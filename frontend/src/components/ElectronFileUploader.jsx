import React, { useState } from 'react';
import { FolderOpen, GitBranch, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { electronAPI } from '../services/electronAPI';

const ElectronFileUploader = ({ onUpload, isGenerating }) => {
  const [selectedPath, setSelectedPath] = useState('');
  const { toast } = useToast();

  const handleSelectDirectory = async () => {
    try {
      const gitPath = await electronAPI.selectGitDirectory();
      
      if (gitPath) {
        setSelectedPath(gitPath);
        toast({
          title: "Directory selected",
          description: `Selected: ${gitPath}`,
        });
      }
    } catch (error) {
      console.error('Error selecting directory:', error);
      toast({
        title: "Error",
        description: "Failed to select directory.",
        variant: "destructive"
      });
    }
  };

  const handleAnalyze = async () => {
    if (!selectedPath) {
      toast({
        title: "No directory selected",
        description: "Please select a git repository directory first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const commits = await electronAPI.analyzeGitRepository(selectedPath);
      onUpload(commits);
      
      toast({
        title: "Analysis complete",
        description: `Found ${commits.length} commits in repository.`,
      });
    } catch (error) {
      console.error('Error analyzing repository:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze git repository. Make sure it's a valid git repository.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-lg p-8 text-center border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <GitBranch className="w-8 h-8 text-indigo-600" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Select Git Repository
            </h3>
            <p className="text-slate-600 mb-4">
              Choose a folder containing a git repository to analyze
            </p>
            
            <Button
              onClick={handleSelectDirectory}
              variant="outline"
              className="flex items-center gap-2 mb-4"
              disabled={isGenerating}
            >
              <FolderOpen className="w-4 h-4" />
              Browse Folders
            </Button>
          </div>
        </div>
      </div>

      {selectedPath && (
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              Selected Repository
            </span>
          </div>
          <div className="text-xs text-slate-600 font-mono bg-white p-2 rounded border">
            {selectedPath}
          </div>
        </div>
      )}

      <Button 
        onClick={handleAnalyze}
        disabled={isGenerating || !selectedPath}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
        size="lg"
      >
        {isGenerating ? (
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin" />
            Analyzing Repository...
          </div>
        ) : (
          'Analyze Git History'
        )}
      </Button>
    </div>
  );
};

export default ElectronFileUploader;