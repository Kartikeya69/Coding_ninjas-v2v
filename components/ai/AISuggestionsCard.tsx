'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface AISuggestionsCardProps {
  title?: string;
  className?: string;
  actionText?: string;
  onActionClick?: () => void;
  children: React.ReactNode;
}

export const AISuggestionsCard: React.FC<AISuggestionsCardProps> = ({
  title = 'AI Suggests',
  className,
  actionText,
  onActionClick,
  children,
}) => {
  return (
    <div className={cn(
      "relative rounded-xl border border-transparent bg-clip-padding p-[1px] overflow-hidden group",
      className
    )}>
      {/* Shifting Gradient Border Background */}
      <div className="absolute inset-0 bg-linear-to-tr from-cyan-500 via-purple-500 to-indigo-600 opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Main Inner Card content */}
      <div className="relative rounded-[11px] bg-[#0c0c0e]/95 p-5 flex flex-col gap-3.5">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
          <Sparkles className="h-4.5 w-4.5 text-cyan-400 shrink-0 animate-pulse" />
          <span className="font-sans uppercase tracking-wider text-[10px]">{title}</span>
        </div>

        {/* Content Body */}
        <div className="text-xs text-muted-foreground leading-relaxed font-sans">
          {children}
        </div>

        {/* Action Button */}
        {actionText && (
          <button 
            onClick={onActionClick}
            className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-400 hover:text-purple-400 transition-colors uppercase self-start mt-1 cursor-pointer group/btn"
          >
            <span>{actionText}</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};
export default AISuggestionsCard;
