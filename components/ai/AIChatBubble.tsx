'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AIChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  className?: string;
}

export const AIChatBubble: React.FC<AIChatBubbleProps> = ({
  role,
  content,
  timestamp,
  className,
}) => {
  const isAI = role === 'assistant';

  return (
    <div className={cn(
      "flex flex-col gap-1 w-full max-w-[85%]",
      isAI ? "self-start items-start" : "self-end items-end",
      className
    )}>
      {/* Sender Header Indicator */}
      <div className="flex items-center gap-1.5 px-1.5 text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
        {isAI ? (
          <>
            <Sparkles className="h-3 w-3 text-cyan-400 shrink-0" />
            <span className="text-cyan-400 font-semibold">Lumina Coach</span>
          </>
        ) : (
          <span>You</span>
        )}
        {timestamp && <span>• {timestamp}</span>}
      </div>

      {/* Bubble Container */}
      <div className={cn(
        "rounded-2xl px-4 py-3 text-xs leading-relaxed font-sans",
        isAI 
          ? "bg-card/80 border border-primary/10 text-white rounded-tl-none shadow-md" 
          : "bg-primary text-white rounded-tr-none shadow-md shadow-primary/5"
      )}>
        {content}
      </div>
    </div>
  );
};
export default AIChatBubble;
