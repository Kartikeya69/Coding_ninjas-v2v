'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AIOrbProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isThinking?: boolean;
}

export const AIOrb: React.FC<AIOrbProps> = ({ 
  className, 
  size = 'md', 
  isThinking = false 
}) => {
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-24 w-24',
    lg: 'h-40 w-40',
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Glow Halo */}
      <motion.div
        animate={{
          scale: isThinking ? [1, 1.25, 1.05, 1.25, 1] : [1, 1.12, 1],
          opacity: isThinking ? [0.6, 0.9, 0.75, 0.9, 0.6] : [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: isThinking ? 2.5 : 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute rounded-full bg-linear-to-tr from-cyan-500/30 to-purple-500/30 blur-xl pointer-events-none ${
          size === 'sm' ? 'h-20 w-20' : size === 'md' ? 'h-36 w-36' : 'h-60 w-60'
        }`}
      />

      {/* Main Shifting Sphere */}
      <motion.div
        animate={{
          rotate: 360,
          scale: isThinking ? [1, 1.08, 0.96, 1.08, 1] : [1, 1.04, 1],
        }}
        transition={{
          rotate: { duration: isThinking ? 4 : 10, repeat: Infinity, ease: 'linear' },
          scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }}
        className={`${sizeClasses[size]} rounded-full bg-linear-to-tr from-cyan-400 via-purple-500 to-indigo-500 shadow-[0_0_30px_rgba(6,182,212,0.3)] relative overflow-hidden`}
      >
        {/* Glass reflection cover */}
        <div className="absolute inset-0 bg-radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)" />
        <div className="absolute inset-[2px] rounded-full bg-[#0a0a0c]/40 backdrop-blur-xs" />
        
        {/* Shifting inner plasma core */}
        <motion.div 
          animate={{
            x: isThinking ? [-10, 15, -15, 10] : [-5, 5, -5],
            y: isThinking ? [12, -8, 10, -12] : [3, -3, 3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-[4px] rounded-full bg-linear-to-bl from-cyan-400/90 to-purple-600/90 blur-[6px]"
        />
      </motion.div>
    </div>
  );
};
export default AIOrb;
