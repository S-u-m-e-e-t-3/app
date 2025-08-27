import React, { useState } from 'react';
import { Github, FileText, Upload, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { parseGitLog, fetchGitHubCommits } from '../services/gitProcessing';

const OnlineGitProcessor = ({ onUpload, isGenerating }) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [gitLogText, setGitLogText] = useState('');
  const [activeTab, setActiveTab] = useState('github');
  const { toast } = useToast();

  const handleGitHubAnalysis = async () => {
    if (!githubUrl.trim()) {
      toast({
        title: "Repository URL required",
        description: "Please enter a GitHub repository URL.",
        variant: "destructive"
      });
      return;
    }

    try {
      const commits = await fetchGitHubCommits(githubUrl);
      onUpload(commits);
      
      toast({
        title: "GitHub analysis complete",
        description: `Found ${commits.length} commits from GitHub repository.`,
      });
    } catch (error) {
      console.error('GitHub analysis error:', error);
      toast({
        title: "GitHub analysis failed",
        description: error.message || "Failed to fetch commits from GitHub. Make sure the repository is public.",
        variant: "destructive"
      });
    }
  };

  const handleGitLogAnalysis = async () => {
    if (!gitLogText.trim()) {
      toast({
        title: "Git log required",
        description: "Please paste your git log output.",
        variant: "destructive"
      });
      return;
    }

    try {
      const commits = parseGitLog(gitLogText);
      onUpload(commits);
      
      toast({
        title: "Git log analysis complete",
        description: `Parsed ${commits.length} commits from git log.`,
      });
    } catch (error) {
      console.error('Git log parsing error:', error);
      toast({
        title: "Git log parsing failed", 
        description: error.message || "Failed to parse git log. Please check the format.",
        variant: "destructive"
      });
    }
  };

  const handleDemoData = () => {
    // Use mock data for demo
    onUpload([]);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="github" className="flex items-center gap-2">
            <Github className="w-4 h-4" />
            GitHub URL
          </TabsTrigger>
          <TabsTrigger value="gitlog" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Git Log
          </TabsTrigger>
          <TabsTrigger value="demo" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Demo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="github" className="space-y-4">
          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Github className="w-5 h-5 text-slate-700" />
                GitHub Repository
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  placeholder="https://github.com/owner/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Enter a public GitHub repository URL to analyze its commit history
                </p>
              </div>
              
              <Button 
                onClick={handleGitHubAnalysis}
                disabled={isGenerating || !githubUrl.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isGenerating ? 'Analyzing...' : 'Analyze GitHub Repository'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gitlog" className="space-y-4">
          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-700" />
                Git Log Output
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Textarea
                  placeholder={`Paste your git log output here. Examples:

git log --oneline -n 20
git log --pretty=format:"%h|%an|%ad|%s" --date=short -n 20

Example format:
a1b2c3d John Doe 2024-07-15 Add user authentication system
e4f5g6h Jane Smith 2024-07-14 Fix memory leak in parser
i7j8k9l Bob Johnson 2024-07-13 Refactor API structure`}
                  value={gitLogText}
                  onChange={(e) => setGitLogText(e.target.value)}
                  className="min-h-32 font-mono text-sm"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Paste the output from your local git repository
                </p>
              </div>
              
              <Button 
                onClick={handleGitLogAnalysis}
                disabled={isGenerating || !gitLogText.trim()}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {isGenerating ? 'Parsing...' : 'Parse Git Log'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demo" className="space-y-4">
          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-slate-700" />
                Demo Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-orange-600" />
                </div>
                <p className="text-slate-600 mb-4">
                  Try the app with sample commit data to see how it works
                </p>
                <Button 
                  onClick={handleDemoData}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  {isGenerating ? 'Loading...' : 'Load Demo Data'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
        <div className="text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Github className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xs text-slate-600 font-medium">GitHub</p>
          <p className="text-xs text-slate-500">Public repos</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-xs text-slate-600 font-medium">Git Log</p>
          <p className="text-xs text-slate-500">Any repository</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-xs text-slate-600 font-medium">Demo</p>
          <p className="text-xs text-slate-500">Sample data</p>
        </div>
      </div>
    </div>
  );
};

export default OnlineGitProcessor;