import React, { useState, useRef } from 'react';
import { Upload, FolderOpen, File } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

const FileUploader = ({ onUpload, isGenerating }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    // Filter for git-related files
    const gitFiles = files.filter(file => 
      file.name.includes('.git') || 
      file.name.includes('commit') ||
      file.webkitRelativePath?.includes('.git/')
    );
    
    if (gitFiles.length === 0 && files.length > 0) {
      toast({
        title: "No Git files detected",
        description: "Please upload a folder containing .git directory or git-related files.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFiles(files);
    
    if (files.length > 0) {
      toast({
        title: "Files uploaded successfully",
        description: `${files.length} files selected. Click "Generate Comic Strip" to proceed.`,
      });
    }
  };

  const handleGenerate = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload your git repository files first.",
        variant: "destructive"
      });
      return;
    }
    
    onUpload(selectedFiles);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
          isDragOver
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          webkitdirectory=""
          directory=""
          className="hidden"
          onChange={handleFileInput}
          accept=".git/*,*"
        />
        
        <div className="flex flex-col items-center gap-2">
          {isDragOver ? (
            <FolderOpen className="w-12 h-12 text-indigo-600" />
          ) : (
            <Upload className="w-12 h-12 text-slate-400" />
          )}
          <p className="text-slate-600 font-medium">
            {isDragOver ? 'Drop your git repository here' : 'Upload Git Repository'}
          </p>
          <p className="text-sm text-slate-500">
            Drag & drop your project folder or click to browse
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Make sure your folder includes the .git directory
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <File className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              {selectedFiles.length} files selected
            </span>
          </div>
          <div className="text-xs text-slate-500 max-h-20 overflow-y-auto">
            {selectedFiles.slice(0, 5).map((file, index) => (
              <div key={index} className="truncate">
                {file.webkitRelativePath || file.name}
              </div>
            ))}
            {selectedFiles.length > 5 && (
              <div className="text-slate-400">
                ... and {selectedFiles.length - 5} more files
              </div>
            )}
          </div>
        </div>
      )}

      <Button 
        onClick={handleGenerate}
        disabled={isGenerating || selectedFiles.length === 0}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
        size="lg"
      >
        {isGenerating ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Generating...
          </div>
        ) : (
          'Generate Comic Strip'
        )}
      </Button>
    </div>
  );
};

export default FileUploader;