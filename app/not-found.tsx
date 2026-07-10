'use client';

import React from 'react';
import Link from 'next/link';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6 relative select-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card/45 backdrop-blur-xl p-8 text-center flex flex-col items-center gap-6 relative z-10">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary animate-pulse">
          <HelpCircle className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">404 - Not Found</h1>
          <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
            This module does not exist or has been relocated.
          </p>
        </div>
        <Link 
          href="/" 
          className="w-full py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-primary/10"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
