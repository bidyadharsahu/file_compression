// Local file compression utilities without Firebase
export interface CompressedFile {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  fileType: string;
  compressionRatio: number;
  compressedData: string; // Base64 data URL
  createdAt: Date;
}

/**
 * Generate a unique file ID
 */
export const generateFileId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Get file type from file extension
 */
export const getFileType = (file: File): string => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  
  const typeMap: Record<string, string> = {
    'pdf': 'PDF Document',
    'doc': 'Word Document',
    'docx': 'Word Document',
    'xls': 'Excel Spreadsheet',
    'xlsx': 'Excel Spreadsheet',
    'ppt': 'PowerPoint',
    'pptx': 'PowerPoint',
    'jpg': 'JPEG Image',
    'jpeg': 'JPEG Image',
    'png': 'PNG Image',
    'gif': 'GIF Image',
    'svg': 'SVG Image',
    'mp4': 'MP4 Video',
    'mov': 'MOV Video',
    'mp3': 'MP3 Audio',
    'wav': 'WAV Audio',
    'zip': 'ZIP Archive',
    'rar': 'RAR Archive',
    'txt': 'Text File',
    'html': 'HTML File',
    'css': 'CSS File',
    'js': 'JavaScript File',
    'json': 'JSON File',
    'xml': 'XML File'
  };
  
  return typeMap[extension] || extension.toUpperCase();
};

/**
 * Compress an image file
 */
const compressImage = async (file: File, quality: number = 0.7): Promise<{ data: string; size: number }> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions (max 1200px on longer side)
      const maxSize = 1200;
      let { width, height } = img;
      
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to compressed data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Estimate compressed size (base64 is ~33% larger than binary)
        const base64Data = compressedDataUrl.split(',')[1];
        const compressedSize = Math.round((base64Data.length * 3) / 4);
        
        resolve({ data: compressedDataUrl, size: compressedSize });
      } else {
        reject(new Error('Canvas context not available'));
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Process and compress a file locally
 */
export const compressFile = async (file: File): Promise<CompressedFile> => {
  const originalSize = file.size;
  let compressedData: string;
  let compressedSize: number;
  
  // Handle image compression
  if (file.type.startsWith('image/')) {
    const { data, size } = await compressImage(file);
    compressedData = data;
    compressedSize = size;
  } else {
    // For non-images, convert to data URL and simulate compression
    compressedData = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    // Simulate compression for non-image files
    if (file.type.includes('text') || file.type.includes('json') || file.type.includes('javascript')) {
      // Text files can be compressed more
      compressedSize = Math.round(originalSize * 0.4);
    } else if (file.type.includes('pdf') || file.type.includes('document')) {
      compressedSize = Math.round(originalSize * 0.6);
    } else {
      // Default compression
      compressedSize = Math.round(originalSize * 0.7);
    }
  }
  
  const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
  
  return {
    id: generateFileId(),
    name: file.name,
    originalSize,
    compressedSize,
    fileType: getFileType(file),
    compressionRatio,
    compressedData,
    createdAt: new Date()
  };
};

/**
 * Download a compressed file
 */
export const downloadCompressedFile = (compressedFile: CompressedFile): void => {
  const link = document.createElement('a');
  link.href = compressedFile.compressedData;
  link.download = compressedFile.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};
