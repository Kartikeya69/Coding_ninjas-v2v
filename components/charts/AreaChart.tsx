'use client';

import React from 'react';

export const AreaChart: React.FC = () => {
  return (
    <div className="w-full h-[180px] relative select-none">
      {/* Dynamic inline SVG area chart */}
      <svg className="w-full h-full" viewBox="0 0 400 180" preserveAspectRatio="none">
        <defs>
          {/* Gradient for area fill */}
          <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0"/>
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        <line x1="0" y1="30" x2="400" y2="30" stroke="#222226" strokeWidth="0.8" />
        <line x1="0" y1="75" x2="400" y2="75" stroke="#222226" strokeWidth="0.8" />
        <line x1="0" y1="120" x2="400" y2="120" stroke="#222226" strokeWidth="0.8" />
        <line x1="0" y1="165" x2="400" y2="165" stroke="#222226" strokeWidth="0.8" />

        {/* Area Path */}
        <path 
          d="M 0 165 L 50 140 L 100 150 L 150 110 L 200 90 L 250 115 L 300 70 L 350 50 L 400 30 L 400 165 Z" 
          fill="url(#areaGlow)" 
        />

        {/* Line Stroke */}
        <path 
          d="M 0 165 L 50 140 L 100 150 L 150 110 L 200 90 L 250 115 L 300 70 L 350 50 L 400 30" 
          fill="none" 
          stroke="#a855f7" 
          strokeWidth="2.5" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Highlight points */}
        <circle cx="200" cy="90" r="4.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="350" cy="50" r="4.5" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="400" cy="30" r="4.5" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
      </svg>
      
      {/* X Axis labels */}
      <div className="flex justify-between items-center text-[9px] font-mono text-muted-foreground mt-2 px-1">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
      </div>
    </div>
  );
};
export default AreaChart;
