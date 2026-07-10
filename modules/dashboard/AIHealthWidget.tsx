'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { AIProfile } from '@/types/user';

interface AIHealthWidgetProps {
  aiProfile?: AIProfile;
}

export const AIHealthWidget: React.FC<AIHealthWidgetProps> = ({ aiProfile }) => {
  // Compute default values if no AI profile loaded
  const confidence = aiProfile ? 85 : 50;
  const strongAreas = aiProfile?.strengths?.slice(0, 3) || ['Growth mindset', 'Ambition', 'Core study'];
  const weakAreas = aiProfile?.gaps?.slice(0, 3) || ['Technical roadmap deepdive', 'Resume alignment metrics'];

  return (
    <div className="flex flex-col gap-4 font-sans select-none">
      {/* Confidence meter */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">Career Confidence</span>
          <span className="text-white font-bold font-mono">{confidence}%</span>
        </div>
        <div className="w-full h-2 bg-muted/20 rounded-full overflow-hidden relative border border-border/20">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute top-0 bottom-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/30 pt-3">
        {/* Strong Areas */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Strong Areas</span>
          </div>
          <ul className="flex flex-col gap-1.5">
            {strongAreas.map((item, idx) => (
              <li 
                key={idx} 
                className="text-[11px] text-white/90 bg-green-500/5 border border-green-500/10 rounded px-2.5 py-1 text-left truncate"
                title={item}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Weak Areas */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-bold uppercase tracking-wider">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Improvement Gaps</span>
          </div>
          <ul className="flex flex-col gap-1.5">
            {weakAreas.map((item, idx) => (
              <li 
                key={idx} 
                className="text-[11px] text-white/90 bg-amber-500/5 border border-amber-500/10 rounded px-2.5 py-1 text-left truncate"
                title={item}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="bg-primary/5 border border-primary/10 rounded-lg p-2.5 flex items-start gap-2">
        <Cpu className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
        <span className="text-[9px] text-muted-foreground leading-normal text-left">
          Lumina AI automatically parses gaps based on target roles. Update your profile or upload a new resume draft to re-audit.
        </span>
      </div>
    </div>
  );
};

export default AIHealthWidget;
