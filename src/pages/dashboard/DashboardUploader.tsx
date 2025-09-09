
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, CheckCircle, RotateCcw, Trash } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import CompressProgress from "@/components/CompressProgress";
import { formatFileSize } from "@/utils/fileUtils";

interface DashboardUploaderProps {
  selectedFile: File | null;
  isUploading: boolean;
  uploadProgress: number;
    progress: number;
     onCancel: () => void;

  uploadCompleted: boolean;
  uploadedFileData: any;
  isCompressing: boolean;
  compressProgress: number;
  compressionCompleted: boolean;
  latestCompressedFile: any;
  onFileSelect: (file: File) => void;
  onUploadFile: () => Promise<void>;
  onCompressFile: () => Promise<void>;
  onNewUpload: () => void;
  onDownload: (fileId: string) => void;
  onDelete: (fileId: string) => void;
}

const DashboardUploader = ({
  selectedFile,
  isUploading,
  uploadProgress,
  uploadCompleted,
  uploadedFileData,
  isCompressing,
  compressProgress,
  compressionCompleted,
  latestCompressedFile,
  onFileSelect,
  onUploadFile,
  onCompressFile,
  onNewUpload,
  onDownload,
  onDelete,
}: DashboardUploaderProps) => {
  return (
    <div className="mb-8">
      <Card className="border-0 shadow-sm dark:bg-gray-800/50 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl dark:text-gray-100">File Upload & Compression</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Upload your file, then compress it for secure storage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: File Selection */}
          {!selectedFile && !isUploading && !uploadCompleted && !isCompressing && !compressionCompleted && (
            <FileUpload
              onFileSelect={onFileSelect}
              isLoading={false}
            />
          )}

          {/* Step 2: Upload File Button */}
          {selectedFile && !isUploading && !uploadCompleted && !isCompressing && !compressionCompleted && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-700 dark:text-blue-300 font-medium">File Selected:</span>
                  <span className="text-blue-600 dark:text-blue-400">{selectedFile.name}</span>
                  <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                    {formatFileSize(selectedFile.size)}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={onUploadFile}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white px-8 py-2"
                  size="lg"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Uploading Progress */}
          {isUploading && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Upload className="w-8 h-8 text-green-600 dark:text-green-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                    Uploading File...
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                    {selectedFile?.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-600 dark:text-green-400">Progress</span>
                    <span className="text-green-600 dark:text-green-400 font-semibold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-green-100 dark:bg-green-900 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Upload Complete + Compress Button */}
          {uploadCompleted && !isCompressing && !compressionCompleted && uploadedFileData && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-green-700 dark:text-green-300 font-medium">Uploaded:</span>
                  <span className="text-green-600 dark:text-green-400">{uploadedFileData.name}</span>
                  <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                    {formatFileSize(uploadedFileData.size)}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={onCompressFile}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-8 py-2"
                  size="lg"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Compress File
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Compressing Progress */}
          {isCompressing && uploadedFileData && (
            <CompressProgress
              progress={compressProgress}
              fileName={uploadedFileData.name}
              isCompressing={isCompressing}
            />
          )}

          {/* Step 6: Compression Complete + Download/Delete */}
          {compressionCompleted && latestCompressedFile && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                      File Compressed Successfully!
                    </h3>
                    <p className="text-green-700 dark:text-green-400 font-medium mb-4">
                      {latestCompressedFile.name}
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-400">Original Size</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {formatFileSize(latestCompressedFile.originalSize)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-400">Compressed Size</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {formatFileSize(latestCompressedFile.compressedSize)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-400">Space Saved</p>
                        <p className="font-semibold text-green-600 dark:text-green-400">
                          {latestCompressedFile.compressionRatio?.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-3">
                    <Button
                      onClick={() => onDownload(latestCompressedFile.id)}
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() => onDelete(latestCompressedFile.id)}
                      variant="outline"
                      className="border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                    <Button
                      onClick={onNewUpload}
                      variant="outline"
                      className="border-gray-600 dark:border-gray-500 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/30"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Upload Another
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Compressed Files Storage Section */}
      {compressionCompleted && (
        <Card className="border-0 shadow-sm dark:bg-gray-800/50 dark:border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-xl dark:text-gray-100">Compressed Files Storage</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Your compressed files are stored securely
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {latestCompressedFile?.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Compressed • {latestCompressedFile?.compressionRatio?.toFixed(1)}% space saved
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                  Stored
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardUploader;
