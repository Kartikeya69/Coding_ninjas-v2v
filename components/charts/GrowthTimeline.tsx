'use client';

import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface TimelineStep {
  label: string;
  desc: string;
  status: 'done' | 'current' | 'todo';
}

export const GrowthTimeline: React.FC = () => {
  const steps: TimelineStep[] = [
    { label: 'Foundations', desc: 'NextJS, TS, CSS v4', status: 'done' },
    { label: 'Deploy Core', desc: 'Firebase Auth & DB integration', status: 'current' },
    { label: 'AI Optimization', desc: 'Gemini Resume coach model', status: 'todo' },
    { label: 'Scale Up', desc: 'Mentors & finance dashboard', status: 'todo' },
  ];

  return (
    <div className="w-full py-4 px-2 select-none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative">
        {/* Horizontal connector line on desktop */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-border hidden sm:block z-0" />

        {steps.map((step, idx) => (
          <div key={idx} className="flex sm:flex-col items-center sm:text-center gap-3.5 relative z-10 flex-1 w-full">
            {/* Status Icon */}
            <div className="shrink-0">
              {step.status === 'done' && (
                <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <CheckCircle2 className="h-4.5 w-4.5 fill-primary stroke-white" />
                </div>
              )}
              {step.status === 'current' && (
                <div className="h-8 w-8 rounded-full bg-secondary/10 border border-secondary/40 flex items-center justify-center text-secondary animate-pulse">
                  <Clock className="h-4.5 w-4.5" />
                </div>
              )}
              {step.status === 'todo' && (
                <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
                  <Circle className="h-3 w-3 fill-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Labels */}
            <div className="text-left sm:text-center">
              <h4 className="text-xs font-semibold text-white leading-tight font-sans">{step.label}</h4>
              <p className="text-[9px] text-muted-foreground mt-1 font-sans">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default GrowthTimeline;
