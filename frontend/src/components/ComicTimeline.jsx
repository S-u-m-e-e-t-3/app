import React, { useState } from 'react';
import { ArrowLeft, Download, Share2, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import CommitPanel from './CommitPanel';
import CategoryFilter from './CategoryFilter';

const ComicTimeline = ({ commits, onStartOver }) => {
  const [selectedTypes, setSelectedTypes] = useState(['feature', 'bug', 'refactor']);
  const [commitUpdates, setCommitUpdates] = useState({});

  const handleTypeToggle = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleCommitTypeChange = (commitId, newType) => {
    setCommitUpdates(prev => ({
      ...prev,
      [commitId]: { ...prev[commitId], type: newType }
    }));
  };

  const getCommitData = (commit) => {
    const updates = commitUpdates[commit.id] || {};
    return { ...commit, ...updates };
  };

  const filteredCommits = commits.filter(commit => {
    const commitData = getCommitData(commit);
    return selectedTypes.includes(commitData.type);
  });

  const stats = commits.reduce((acc, commit) => {
    const type = getCommitData(commit).type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onStartOver}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Start Over
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Git Comic Strip</h1>
                <p className="text-sm text-slate-600">
                  {filteredCommits.length} commits • {stats.feature || 0} features • {stats.bug || 0} bugs • {stats.refactor || 0} refactors
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <CategoryFilter
                selectedTypes={selectedTypes}
                onTypeToggle={handleTypeToggle}
                stats={stats}
              />
              
              <Card className="p-4 bg-white/60 backdrop-blur-sm border-slate-200">
                <h3 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Quick Actions
                </h3>
                <div className="space-y-2 text-sm">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-slate-600 hover:text-slate-800"
                    onClick={() => setSelectedTypes(['feature', 'bug', 'refactor'])}
                  >
                    Show All Types
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-slate-600 hover:text-slate-800"
                    onClick={() => setSelectedTypes(['feature'])}
                  >
                    Features Only
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-slate-600 hover:text-slate-800"
                    onClick={() => setSelectedTypes(['bug'])}
                  >
                    Bug Fixes Only
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-3">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-400"></div>
              
              {/* Commit Panels */}
              <div className="space-y-8">
                {filteredCommits.map((commit, index) => (
                  <CommitPanel
                    key={commit.id}
                    commit={getCommitData(commit)}
                    index={index}
                    onTypeChange={(newType) => handleCommitTypeChange(commit.id, newType)}
                  />
                ))}
              </div>
              
              {filteredCommits.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-lg font-medium">No commits match your filter</p>
                  <p className="text-slate-400 text-sm mt-1">Try selecting different commit types</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComicTimeline;