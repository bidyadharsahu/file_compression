
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface CompressProgressProps {
  progress: number;
  fileName: string;
  isCompressing: boolean;
}

const CompressProgress = ({ progress, fileName, isCompressing }: CompressProgressProps) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
            {isCompressing ? "Compressing File" : "Processing"}
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-400 font-medium truncate max-w-md mx-auto">
            {fileName}
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-blue-600 dark:text-blue-400">Progress</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-blue-100 dark:bg-blue-900" />
        </div>
        
        <p className="text-xs text-blue-600 dark:text-blue-400">
          {isCompressing 
            ? "Compressing your file for secure storage..." 
            : "Processing your file..."}
        </p>
      </div>
    </div>
  );
};

export default CompressProgress;
