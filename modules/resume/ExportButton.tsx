'use client';

import React, { useState } from 'react';
import { Download, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ExportButtonProps {
  onTriggerExport: (format: 'pdf' | 'markdown' | 'json') => void;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onTriggerExport,
  className
}) => {
  const [exportStep, setExportStep] = useState<'idle' | 'preparing' | 'optimizing' | 'ready'>('idle');

  const handleExport = (format: 'pdf' | 'markdown' | 'json') => {
    setExportStep('preparing');

    // Simulate staged processing sequence for premium UI feels
    setTimeout(() => {
      setExportStep('optimizing');
      
      setTimeout(() => {
        setExportStep('ready');
        
        setTimeout(() => {
          onTriggerExport(format);
          setExportStep('idle');
        }, 600);
      }, 900);
    }, 700);
  };

  return (
    <div className="relative font-sans select-none">
      {exportStep === 'idle' ? (
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className={cn(
              "px-4 py-2 bg-linear-to-tr from-primary to-secondary hover:opacity-95 transition-opacity text-xs font-bold text-white rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm",
              className
            )}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export PDF</span>
          </button>
          
          <button
            onClick={() => handleExport('markdown')}
            className="px-3 py-2 bg-muted/40 hover:bg-muted/60 border border-border text-xs font-semibold text-white rounded-lg cursor-pointer"
          >
            MD
          </button>
          
          <button
            onClick={() => handleExport('json')}
            className="px-3 py-2 bg-muted/40 hover:bg-muted/60 border border-border text-xs font-semibold text-white rounded-lg cursor-pointer"
          >
            JSON
          </button>
        </div>
      ) : (
        <div className="px-4 py-2 bg-muted/30 border border-border rounded-lg text-xs flex items-center gap-2 font-mono text-cyan-400">
          <Sparkles className="h-3.5 w-3.5 animate-spin" />
          <span>
            {exportStep === 'preparing' && 'Preparing PDF Canvas...'}
            {exportStep === 'optimizing' && 'Optimizing Print Spacing...'}
            {exportStep === 'ready' && 'Ready! Downloading...'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
