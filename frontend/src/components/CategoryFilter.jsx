import React from 'react';
import { Plus, Bug, RefreshCw } from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { commitTypes } from '../mock';

const CategoryFilter = ({ selectedTypes, onTypeToggle, stats }) => {
  return (
    <Card className="p-4 bg-white/60 backdrop-blur-sm border-slate-200">
      <h3 className="font-medium text-slate-800 mb-4">Filter by Type</h3>
      <div className="space-y-3">
        {Object.entries(commitTypes).map(([key, type]) => {
          const IconComponent = {
            Plus,
            Bug,
            RefreshCw
          }[type.icon];
          
          const count = stats[key] || 0;
          const isSelected = selectedTypes.includes(key);
          
          return (
            <div 
              key={key}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? `${type.lightColor} border-${type.color.replace('bg-', '')} border-2` 
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
              onClick={() => onTypeToggle(key)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type.color}`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-800">{type.label}</div>
                  <div className="text-xs text-slate-500">{type.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {count}
                </Badge>
                <Switch
                  checked={isSelected}
                  onCheckedChange={() => onTypeToggle(key)}
                  className="scale-75"
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-200">
        <div className="text-xs text-slate-500 text-center">
          Showing {selectedTypes.length} of {Object.keys(commitTypes).length} types
        </div>
      </div>
    </Card>
  );
};

export default CategoryFilter;