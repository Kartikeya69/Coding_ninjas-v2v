'use client';

import React from 'react';

export const BarChart: React.FC = () => {
  return (
    <div className="w-full h-[180px] relative select-none">
      {/* SVG Bar Chart */}
      <svg className="w-full h-full" viewBox="0 0 400 180" preserveAspectRatio="none">
        <defs>
          <linearGradient id="barGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1="0" y1="165" x2="400" y2="165" stroke="#222226" strokeWidth="1" />
        <line x1="0" y1="100" x2="400" y2="100" stroke="#222226" strokeWidth="0.8" strokeDasharray="3 3" />
        <line x1="0" y1="35" x2="400" y2="35" stroke="#222226" strokeWidth="0.8" strokeDasharray="3 3" />

        {/* Bars (width=24, gap=36) */}
        {/* Bar 1 */}
        <rect x="25" y="65" width="24" height="100" rx="4" fill="url(#barGlow)" opacity="0.85" className="hover:opacity-100 transition-opacity" />
        {/* Bar 2 */}
        <rect x="85" y="105" width="24" height="60" rx="4" fill="url(#barGlow)" opacity="0.85" />
        {/* Bar 3 */}
        <rect x="145" y="45" width="24" height="120" rx="4" fill="url(#barGlow)" opacity="0.85" />
        {/* Bar 4 */}
        <rect x="205" y="90" width="24" height="75" rx="4" fill="url(#barGlow)" opacity="0.85" />
        {/* Bar 5 */}
        <rect x="265" y="30" width="24" height="135" rx="4" fill="url(#barGlow)" opacity="0.85" />
        {/* Bar 6 */}
        <rect x="325" y="70" width="24" height="95" rx="4" fill="url(#barGlow)" opacity="0.85" />
      </svg>
      
      {/* Labels */}
      <div className="flex justify-between items-center text-[9px] font-mono text-muted-foreground mt-2 px-4">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>
    </div>
  );
};
export default BarChart;
