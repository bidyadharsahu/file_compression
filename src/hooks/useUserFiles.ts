import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getUserFiles,
  addUserFile,
  processFileForStorage,
  deleteUserFile,
  downloadFileFromFirestore,
  UserFile as FirebaseUserFile
} from "@/integrations/firebase/firestore";
import { UserFile } from "@/integrations/firebase/firestore";

export function useUserFiles(userId: string | null) {
  return useQuery({
    queryKey: ["user_files", userId],
    queryFn: async () => {
      if (!userId) return [];
      return await getUserFiles(userId);
    },
    enabled: !!userId,
  });
}

export function useAddUserFile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (fileMeta: Omit<FirebaseUserFile, "id" | "created_at" | "updated_at">) => {
      return await addUserFile(fileMeta);
    },
    onSuccess: (data, variables) => {
      console.log("File added successfully:", data);
      // Invalidate query to refresh file list
      queryClient.invalidateQueries({ queryKey: ["user_files"] });
    },
    onError: (error) => {
      console.error("Error in useAddUserFile:", error);
      toast.error("Failed to save file metadata");
    }
  });
}

export async function processAndStoreFile(userId: string, file: File): Promise<{
  compressedData: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}> {
  return await processFileForStorage(file);
}

export async function downloadFile(fileData: string, fileName: string, fileType: string): Promise<void> {
  return await downloadFileFromFirestore(fileData, fileName, fileType);
}

export function useDeleteUserFile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await deleteUserFile(id);
      return id;
    },
    onSuccess: (id) => {
      console.log("File deletion completed:", id);
      queryClient.invalidateQueries({ queryKey: ["user_files"] });
    },
    onError: (error) => {
      console.error("Error in useDeleteUserFile:", error);
      toast.error("Failed to delete file");
    }
  });
}

export type { UserFile };
