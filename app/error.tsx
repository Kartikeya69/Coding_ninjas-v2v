'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { logger } from '../lib/logger';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log details to console using our custom logger
    logger.error('NextJS Route Boundary Catch', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6 relative select-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card/45 backdrop-blur-xl p-8 text-center flex flex-col items-center gap-6 relative z-10">
        <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent animate-bounce">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Something went wrong</h1>
          <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed font-mono truncate">
            {error.message || 'An unexpected rendering error occurred.'}
          </p>
        </div>
        <button 
          onClick={reset}
          className="w-full py-2.5 bg-accent text-white text-xs font-semibold rounded-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-accent/10"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset Session</span>
        </button>
      </div>
    </div>
  );
}
