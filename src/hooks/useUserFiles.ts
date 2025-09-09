
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getUserFiles,
  addUserFile,
  uploadFileToFirebase,
  deleteUserFile,
  downloadFileFromFirebase,
  UserFile
} from "@/integrations/firebase/firestore";

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
    mutationFn: async (fileMeta: Omit<UserFile, "id" | "created_at" | "updated_at">) => {
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

export async function uploadFileToStorage(userId: string, file: File): Promise<{ path: string; downloadUrl: string }> {
  return await uploadFileToFirebase(userId, file);
}

export async function downloadFile(downloadUrl: string): Promise<Blob> {
  return await downloadFileFromFirebase(downloadUrl);
}

export function useDeleteUserFile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, storage_path }: { id: string, storage_path: string }) => {
      await deleteUserFile(id, storage_path);
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

export { UserFile };
