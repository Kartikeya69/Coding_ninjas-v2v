'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIOrb } from '../../components/ai/AIOrb';

interface DashboardLoaderProps {
  onComplete?: () => void;
}

const LOADING_MESSAGES = [
  'Loading Lumina Career OS...',
  'Analyzing AI profile insights...',
  'Syncing with long-term memory...',
  'Optimizing dashboard widgets...',
  'Welcome back.'
];

export const DashboardLoader: React.FC<DashboardLoaderProps> = ({ onComplete }) => {
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    let active = true;
    const triggerNextStep = (index: number) => {
      if (index >= LOADING_MESSAGES.length) {
        if (onComplete) onComplete();
        return;
      }
      if (!active) return;
      setLoadingStep(index);
      setTimeout(() => triggerNextStep(index + 1), 900);
    };

    triggerNextStep(0);
    return () => {
      active = false;
    };
  }, [onComplete]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 select-none">
      {/* Pulse orbital spinner */}
      <AIOrb size="lg" isThinking={true} />

      {/* Progress Messages */}
      <div className="h-6 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={loadingStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-mono text-cyan-400 font-medium tracking-wide"
          >
            {LOADING_MESSAGES[loadingStep]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="w-[120px] h-0.5 bg-muted/20 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ left: '-100%' }}
          animate={{ left: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 bottom-0 w-1/3 bg-cyan-400 rounded-full blur-[1px]"
        />
      </div>
    </div>
  );
};

export default DashboardLoader;
