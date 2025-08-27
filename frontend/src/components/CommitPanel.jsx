import React, { useState } from 'react';
import { Plus, Bug, RefreshCw, Calendar, User, FileText, Edit3, Check, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { commitTypes } from '../mock';

const CommitPanel = ({ commit, index, onTypeChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedType, setSelectedType] = useState(commit.type);

  const typeConfig = commitTypes[commit.type];
  const IconComponent = {
    Plus,
    Bug, 
    RefreshCw
  }[typeConfig.icon];

  const handleSaveType = () => {
    onTypeChange(selectedType);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setSelectedType(commit.type);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative flex items-start gap-6 group">
      {/* Timeline Dot */}
      <div className="relative z-10 flex-shrink-0">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${typeConfig.color} shadow-lg ring-4 ring-white group-hover:scale-110 transition-transform duration-200`}>
          <IconComponent className="w-5 h-5 text-white" />
        </div>
        {/* Connecting Line to Panel */}
        <div className="absolute top-6 left-12 w-6 h-0.5 bg-slate-300"></div>
      </div>

      {/* Comic Panel */}
      <Card className={`flex-1 relative ${typeConfig.lightColor} border-2 ${typeConfig.color.replace('bg-', 'border-')} shadow-xl transform hover:scale-[1.02] transition-all duration-300 overflow-hidden`}>
        {/* Panel Header Strip */}
        <div className={`${typeConfig.color} px-6 py-3 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 font-mono text-xs">
                #{commit.id}
              </Badge>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-3 h-3" />
                {formatDate(commit.date)}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-32 h-8 text-xs bg-white/20 border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(commitTypes).map(([key, type]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="ghost" onClick={handleSaveType} className="h-8 w-8 p-0 text-white hover:bg-white/20">
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-8 w-8 p-0 text-white hover:bg-white/20">
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                    {typeConfig.label}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setIsEditing(true)}
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Panel Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Commit Message - Comic Style */}
            <div className="relative">
              <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2">
                "{commit.message}"
              </h3>
              <div className="absolute -left-3 top-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-white border-t-8 border-t-white"></div>
            </div>

            {/* Author */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User className="w-4 h-4" />
              <span className="font-medium">{commit.author}</span>
            </div>

            {/* Description */}
            <p className="text-slate-700 leading-relaxed bg-white/50 p-3 rounded-lg border border-white/60">
              {commit.description}
            </p>

            {/* Files and Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FileText className="w-4 h-4" />
                  Files Changed ({commit.files.length})
                </div>
                <div className="space-y-1">
                  {commit.files.slice(0, 3).map((file, idx) => (
                    <div key={idx} className="text-xs text-slate-600 bg-white/60 px-2 py-1 rounded font-mono">
                      {file}
                    </div>
                  ))}
                  {commit.files.length > 3 && (
                    <div className="text-xs text-slate-500">
                      +{commit.files.length - 3} more files
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-slate-700">Changes</div>
                <div className="flex gap-4 text-sm">
                  <span className="text-emerald-600 font-medium">+{commit.additions}</span>
                  <span className="text-red-600 font-medium">-{commit.deletions}</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 float-left"
                    style={{ width: `${(commit.additions / (commit.additions + commit.deletions)) * 100}%` }}
                  ></div>
                  <div 
                    className="h-full bg-red-500 float-left"
                    style={{ width: `${(commit.deletions / (commit.additions + commit.deletions)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Number */}
        <div className="absolute top-2 right-2 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center text-xs font-bold">
          {index + 1}
        </div>
      </Card>
    </div>
  );
};

export default CommitPanel;