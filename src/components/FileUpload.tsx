
import { useState, ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { formatFileSize } from "@/utils/fileUtils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit for Firestore documents
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf', 'text/plain', 'application/json',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const FileUpload = ({ onFileSelect, isLoading = false }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`);
      toast.error(`File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`);
      return false;
    }
    
    // Check file type (be more permissive since we can handle most files)
    // Only block clearly dangerous file types
    const dangerousTypes = ['application/x-executable', 'application/x-msdownload'];
    if (dangerousTypes.includes(file.type)) {
      setError("This file type is not supported for security reasons");
      toast.error("This file type is not supported for security reasons");
      return false;
    }
    
    return true;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setError(null);
        onFileSelect(file);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setError(null);
        onFileSelect(file);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className={`border-2 border-dashed transition-colors ${
      dragActive 
        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
    }`}>
      <CardContent className="p-8">
        <div
          className="flex flex-col items-center justify-center space-y-6 text-center"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
            <Upload className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Drop your file here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or click below to browse
            </p>
          </div>
          
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          
          <Button 
            variant="outline" 
            disabled={isLoading}
            onClick={handleButtonClick}
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          >
            Select File
          </Button>
          
          {error && (
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800 w-full max-w-md">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          {selectedFile && !error && (
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800 w-full max-w-md">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-green-600 dark:text-green-500">
                  ({formatFileSize(selectedFile.size)})
                </span>
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-md space-y-1">
            <p>Maximum file size: {formatFileSize(MAX_FILE_SIZE)}</p>
            <p>Supports most file types including images, documents, and text files</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
