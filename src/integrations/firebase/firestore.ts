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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';
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
  storage_path: string;
  download_url?: string;
}

const COLLECTION_NAME = 'user_files';
const STORAGE_BUCKET = 'compressed_files';

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
    storage_path: data.storage_path,
    download_url: data.download_url,
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

export const uploadFileToFirebase = async (userId: string, file: File): Promise<{ path: string; downloadUrl: string }> => {
  try {
    // Create a unique path for the file
    const path = `${STORAGE_BUCKET}/${userId}/${Date.now()}_${file.name}`;
    
    console.log("Uploading file to path:", path);
    
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadUrl = await getDownloadURL(snapshot.ref);
    
    console.log("File uploaded:", { path, downloadUrl });
    return { path, downloadUrl };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteUserFile = async (fileId: string, storagePath: string): Promise<void> => {
  try {
    console.log("Deleting file:", fileId, storagePath);
    
    // Delete from Firestore
    await deleteDoc(doc(db, COLLECTION_NAME, fileId));
    
    // Delete from Storage
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const downloadFileFromFirebase = async (downloadUrl: string): Promise<Blob> => {
  try {
    console.log("Downloading file from URL:", downloadUrl);
    
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error('Failed to download file');
    }
    
    const blob = await response.blob();
    console.log("File downloaded successfully");
    return blob;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};
