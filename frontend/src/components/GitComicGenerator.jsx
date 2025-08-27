import React, { useState, useEffect } from 'react';
import { Upload, FileText, GitBranch, Sparkles, Monitor, Globe, Laptop } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import FileUploader from './FileUploader';
import ElectronFileUploader from './ElectronFileUploader';
import OnlineGitProcessor from './OnlineGitProcessor';
import ComicTimeline from './ComicTimeline';
import { mockCommits } from '../mock';

const GitComicGenerator = () => {
  const [commits, setCommits] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if running in Electron
    setIsElectron(window.process && window.process.type);
  }, []);

  const handleFileUpload = async (files) => {
    setIsGenerating(true);
    
    // If we got actual git commits (from online processing or Electron), use them
    if (Array.isArray(files) && files.length > 0 && files[0].id) {
      setCommits(files);
    } else {
      // Simulate processing time for web version or fallback to mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCommits(mockCommits);
    }
    
    setIsGenerating(false);
    setShowTimeline(true);
  };

  const handleStartOver = () => {
    setCommits([]);
    setShowTimeline(false);
    setIsGenerating(false);
  };

  if (showTimeline) {
    return (
      <ComicTimeline 
        commits={commits} 
        onStartOver={handleStartOver}
      />
    );
  }

  const getModeInfo = () => {
    if (isElectron) {
      return {
        icon: Laptop,
        title: 'Desktop App Mode',
        subtitle: 'Process local git repositories',
        color: 'bg-green-100 text-green-800',
        dotColor: 'bg-green-500'
      };
    } else {
      return {
        icon: Globe,
        title: 'Online Mode',
        subtitle: 'GitHub repos & git log parsing',
        color: 'bg-blue-100 text-blue-800',
        dotColor: 'bg-blue-500'
      };
    }
  };

  const modeInfo = getModeInfo();
  const ModeIcon = modeInfo.icon;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <GitBranch className="w-16 h-16 text-indigo-600" />
                <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-slate-800 mb-4 leading-tight">
              Git History
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> Comic Strip</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your project's git commits into an engaging visual story. Perfect for retrospectives, onboarding, and understanding project evolution.
            </p>
            
            {/* Mode Indicator */}
            <div className="mb-6">
              <span className={`inline-flex items-center gap-2 ${modeInfo.color} px-4 py-2 rounded-full text-sm font-medium shadow-sm`}>
                <div className={`w-2 h-2 ${modeInfo.dotColor} rounded-full animate-pulse`}></div>
                <ModeIcon className="w-4 h-4" />
                <span>{modeInfo.title}</span>
                <span className="text-xs opacity-75">• {modeInfo.subtitle}</span>
              </span>
            </div>
          </div>

          <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center justify-center gap-2 text-slate-700">
                <Upload className="w-6 h-6 text-indigo-600" />
                {isElectron ? 'Select Git Repository' : 'Analyze Git History'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isElectron ? (
                <ElectronFileUploader 
                  onUpload={handleFileUpload}
                  isGenerating={isGenerating}
                />
              ) : (
                <FileUploader 
                  onUpload={handleFileUpload}
                  isGenerating={isGenerating}
                />
              )}
              
              {isGenerating && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 text-indigo-600">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">
                      {isElectron ? 'Analyzing git history and generating comic strips...' : 'Analyzing git history and generating comic strips...'}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-sm text-slate-600 font-medium">Features</p>
                  <p className="text-xs text-slate-500">New functionality</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="text-sm text-slate-600 font-medium">Bug Fixes</p>
                  <p className="text-xs text-slate-500">Issue resolution</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm text-slate-600 font-medium">Refactors</p>
                  <p className="text-xs text-slate-500">Code improvements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GitComicGenerator;