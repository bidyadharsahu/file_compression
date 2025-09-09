import { useState, useCallback } from 'react';
import { CompressedFile, compressFile, downloadCompressedFile } from '@/utils/localFileCompression';

export interface UseLocalFilesReturn {
  files: CompressedFile[];
  addFile: (file: File) => Promise<CompressedFile>;
  deleteFile: (fileId: string) => void;
  downloadFile: (fileId: string) => void;
  clearAll: () => void;
  isProcessing: boolean;
}

export const useLocalFiles = (): UseLocalFilesReturn => {
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addFile = useCallback(async (file: File): Promise<CompressedFile> => {
    setIsProcessing(true);
    try {
      const compressedFile = await compressFile(file);
      setFiles(prev => [compressedFile, ...prev]);
      return compressedFile;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const deleteFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  const downloadFile = useCallback((fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      downloadCompressedFile(file);
    }
  }, [files]);

  const clearAll = useCallback(() => {
    setFiles([]);
  }, []);

  return {
    files,
    addFile,
    deleteFile,
    downloadFile,
    clearAll,
    isProcessing
  };
};
