'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6 relative select-none">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="flex flex-col items-center gap-4 relative z-10">
        {/* Custom Premium Rotating Spinner */}
        <div className="h-10 w-10 rounded-full border-2 border-muted border-t-primary animate-spin" />
        <div>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold block text-center animate-pulse">
            Lumina loading
          </span>
        </div>
      </div>
    </div>
  );
}
