import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalFiles } from "@/hooks/useLocalFiles";
import { formatFileSize } from "@/utils/localFileCompression";

import DashboardStats from "./dashboard/DashboardStats";
import SimpleUploader from "@/components/SimpleUploader";
import DashboardFileList from "./dashboard/DashboardFileList";

const Dashboard = () => {
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);

  const { files, addFile, deleteFile, downloadFile } = useLocalFiles();

  // Calculate stats from local files
  const totalFiles = files.length;
  const totalOriginalSize = files.reduce((sum, file) => sum + file.originalSize, 0);
  const totalCompressedSize = files.reduce((sum, file) => sum + file.compressedSize, 0);
  const savedSpace = totalOriginalSize - totalCompressedSize;
  const percentSaved = totalOriginalSize === 0
    ? 0
    : Math.round((savedSpace / totalOriginalSize) * 100);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleCompressFile = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive"
      });
      return;
    }

    setIsCompressing(true);
    setProgress(0);

    try {
      // Simulate progress
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(timer);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Compress the file locally
      const compressedFile = await addFile(selectedFile);

      clearInterval(timer);
      setProgress(100);

      setTimeout(() => {
        setIsCompressing(false);
        setProgress(0);
        setSelectedFile(null);

        toast({
          title: "Success",
          description: `File "${compressedFile.name}" compressed successfully! Saved ${compressedFile.compressionRatio.toFixed(1)}% space`,
        });
      }, 500);
    } catch (error) {
      setIsCompressing(false);
      setProgress(0);
      toast({
        title: "Compression Error",
        description: String((error as any)?.message || error),
        variant: "destructive"
      });
    }
  };

  const handleDownloadFile = (fileId: string) => {
    try {
      downloadFile(fileId);
      const file = files.find(f => f.id === fileId);
      if (file) {
        toast({
          title: "Downloaded",
          description: `File "${file.name}" downloaded successfully`,
        });
      }
    } catch (error) {
      toast({
        title: "Download Error",
        description: String((error as any)?.message || error),
        variant: "destructive"
      });
    }
  };

  const handleDeleteFile = (fileId: string) => {
    try {
      const file = files.find(f => f.id === fileId);
      deleteFile(fileId);
      if (file) {
        toast({
          title: "Deleted",
          description: `File "${file.name}" deleted successfully`,
        });
      }
    } catch (error) {
      toast({
        title: "Delete Error",
        description: String((error as any)?.message || error),
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="flex-1 py-8 bg-gray-950">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400 text-lg">Manage your compressed files</p>
          </div>

          {/* Stats Section */}
          <div className="mb-8">
            <DashboardStats
              totalFiles={totalFiles}
              savedSpace={savedSpace}
              percentSaved={percentSaved}
              totalCompressedSize={totalCompressedSize}
            />
          </div>

          {/* Upload Section */}
          <div className="mb-8 bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Upload & Compress</h2>
            <SimpleUploader
              selectedFile={selectedFile}
              isCompressing={isCompressing}
              progress={progress}
              onFileSelect={handleFileSelect}
              onCompress={handleCompressFile}
              onCancel={() => {
                setIsCompressing(false);
                setProgress(0);
              }}
            />
          </div>

          {/* Files Section */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Your Files</h2>
            {files.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No files uploaded yet</div>
                <div className="text-gray-600 text-sm">Upload and compress your first file to get started</div>
              </div>
            ) : (
              <DashboardFileList
                files={files.map(f => ({
                  id: f.id,
                  name: f.name,
                  originalSize: f.originalSize,
                  compressedSize: f.compressedSize,
                  createdAt: f.createdAt,
                  type: f.fileType,
                }))}
                onDownload={handleDownloadFile}
                onDelete={handleDeleteFile}
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;