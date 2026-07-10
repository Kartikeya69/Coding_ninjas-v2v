'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const AIThinking: React.FC = () => {
  return (
    <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl border border-primary/10 bg-primary/5 w-fit">
      {/* Mini glowing pulse dots */}
      <div className="flex gap-1.5 items-center">
        {[0, 1, 2].map((idx) => (
          <motion.span
            key={idx}
            animate={{
              y: [-2, 2, -2],
              scale: [0.85, 1.15, 0.85],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: idx * 0.16,
              ease: 'easeInOut'
            }}
            className="h-2 w-2 rounded-full bg-linear-to-tr from-cyan-400 to-purple-500 shadow-xs"
          />
        ))}
      </div>
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest animate-pulse">
        Lumina Thinking
      </span>
    </div>
  );
};
export default AIThinking;
