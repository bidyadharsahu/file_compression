import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, RotateCcw } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import CompressProgress from "@/components/CompressProgress";

interface SimpleUploaderProps {
  selectedFile: File | null;
  isCompressing: boolean;
  progress: number;
  onFileSelect: (file: File) => void;
  onCompress: () => Promise<void>;
  onCancel: () => void;
}

const SimpleUploader = ({
  selectedFile,
  isCompressing,
  progress,
  onFileSelect,
  onCompress,
  onCancel,
}: SimpleUploaderProps) => {
  return (
    <div className="mb-8">
      <Card className="border-0 shadow-sm dark:bg-gray-800/50 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white dark:text-gray-100 flex items-center gap-2">
            <Upload className="h-5 w-5 text-white" />
            File Compression
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedFile && !isCompressing ? (
            <FileUpload onFileSelect={onFileSelect} />
          ) : (
            <div className="space-y-4">
              {selectedFile && !isCompressing && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Selected file:</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={onCompress} className="bg-primary hover:bg-primary/80">
                      Compress File
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => onFileSelect(null as any)}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Choose Different File
                    </Button>
                  </div>
                </div>
              )}
              
              {isCompressing && (
                <CompressProgress 
                  progress={progress}
                  fileName={selectedFile?.name || ""}
                  isCompressing={isCompressing}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleUploader;
