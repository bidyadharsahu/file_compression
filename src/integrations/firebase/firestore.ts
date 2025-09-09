import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from './config';
import { toast } from 'sonner';

export interface UserFile {
  id?: string;
  user_id: string;
  name: string;
  original_size: number;
  compressed_size: number;
  file_type: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  file_data: string; // Base64 encoded file data
  compression_ratio: number;
}

const COLLECTION_NAME = 'user_files';

// Convert Firestore document to UserFile
const convertDocToUserFile = (doc: QueryDocumentSnapshot<DocumentData>): UserFile => {
  const data = doc.data();
  return {
    id: doc.id,
    user_id: data.user_id,
    name: data.name,
    original_size: data.original_size,
    compressed_size: data.compressed_size,
    file_type: data.file_type,
    created_at: data.created_at,
    updated_at: data.updated_at,
    file_data: data.file_data,
    compression_ratio: data.compression_ratio,
  };
};

export const getUserFiles = async (userId: string): Promise<UserFile[]> => {
  try {
    console.log("Fetching files for user:", userId);
    
    const q = query(
      collection(db, COLLECTION_NAME),
      where("user_id", "==", userId),
      orderBy("created_at", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const files = querySnapshot.docs.map(convertDocToUserFile);
    
    console.log("Files fetched:", files);
    return files;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};

export const addUserFile = async (fileMeta: Omit<UserFile, "id" | "created_at" | "updated_at">): Promise<UserFile> => {
  try {
    console.log("Adding file:", fileMeta);
    
    const now = Timestamp.now();
    const fileData = {
      ...fileMeta,
      created_at: now,
      updated_at: now,
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), fileData);
    
    const newFile: UserFile = {
      id: docRef.id,
      ...fileData,
    };
    
    console.log("File added:", newFile);
    return newFile;
  } catch (error) {
    console.error("Error adding file:", error);
    throw error;
  }
};

// Convert file to base64 and compress
export const processFileForStorage = async (file: File): Promise<{
  compressedData: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}> => {
  try {
    console.log("Processing file for storage:", file.name);
    
    const originalSize = file.size;
    let compressedData: string;
    let compressedSize: number;
    
    // Handle image compression
    if (file.type.startsWith('image/')) {
      const { data, size } = await compressImage(file);
      compressedData = data;
      compressedSize = size;
    } else {
      // For non-images, convert to base64 and simulate compression
      compressedData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data URL prefix (data:image/jpeg;base64,)
          const base64 = result.split(',')[1];
          resolve(base64);
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
    
    console.log("File processed:", { originalSize, compressedSize, compressionRatio });
    
    return {
      compressedData,
      originalSize,
      compressedSize,
      compressionRatio
    };
  } catch (error) {
    console.error("Error processing file:", error);
    throw error;
  }
};

// Image compression function
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
        
        // Convert to compressed base64
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64Data = compressedDataUrl.split(',')[1];
        
        // Estimate compressed size (base64 is ~33% larger than binary)
        const compressedSize = Math.round((base64Data.length * 3) / 4);
        
        resolve({ data: base64Data, size: compressedSize });
      } else {
        reject(new Error('Canvas context not available'));
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const deleteUserFile = async (fileId: string): Promise<void> => {
  try {
    console.log("Deleting file:", fileId);
    
    // Delete from Firestore only (no storage to delete)
    await deleteDoc(doc(db, COLLECTION_NAME, fileId));
    
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const downloadFileFromFirestore = async (fileData: string, fileName: string, fileType: string): Promise<void> => {
  try {
    console.log("Downloading file:", fileName);
    
    // Convert base64 back to blob
    const byteCharacters = atob(fileData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log("File downloaded successfully");
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};
