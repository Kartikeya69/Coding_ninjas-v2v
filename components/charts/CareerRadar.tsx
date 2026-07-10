'use client';

import React from 'react';

export const CareerRadar: React.FC = () => {
  return (
    <div className="w-full h-[180px] flex items-center justify-center relative select-none">
      {/* Radar SVG */}
      <svg className="w-44 h-44" viewBox="0 0 120 120">
        {/* Outer Hexagon Web grids */}
        <polygon points="60,10 103,35 103,85 60,110 17,85 17,35" fill="none" stroke="#222226" strokeWidth="0.8" />
        <polygon points="60,25 92,43 92,77 60,95 28,77 28,43" fill="none" stroke="#222226" strokeWidth="0.6" />
        <polygon points="60,40 81,52 81,68 60,80 39,68 39,52" fill="none" stroke="#222226" strokeWidth="0.4" strokeDasharray="1 1" />

        {/* Axis Lines radiating from center (60,60) */}
        <line x1="60" y1="60" x2="60" y2="10" stroke="#222226" strokeWidth="0.8" />
        <line x1="60" y1="60" x2="103" y2="35" stroke="#222226" strokeWidth="0.8" />
        <line x1="60" y1="60" x2="103" y2="85" stroke="#222226" strokeWidth="0.8" />
        <line x1="60" y1="60" x2="60" y2="110" stroke="#222226" strokeWidth="0.8" />
        <line x1="60" y1="60" x2="17" y2="85" stroke="#222226" strokeWidth="0.8" />
        <line x1="60" y1="60" x2="17" y2="35" stroke="#222226" strokeWidth="0.8" />

        {/* Skill Area Polygon (Filled with translucent purple glow) */}
        {/* Skill scores: FE=90%, BE=80%, Design=50%, DevOps=60%, Systems=70%, AI=85% */}
        <polygon 
          points="60,20 94,40 81,72 60,90 30,77 25,40" 
          fill="rgba(168, 85, 247, 0.2)" 
          stroke="#a855f7" 
          strokeWidth="1.8" 
        />

        {/* Highlight vertices */}
        <circle cx="60" cy="20" r="2.5" fill="#a855f7" />
        <circle cx="94" cy="40" r="2.5" fill="#a855f7" />
        <circle cx="81" cy="72" r="2.5" fill="#a855f7" />
        <circle cx="60" cy="90" r="2.5" fill="#a855f7" />
        <circle cx="30" cy="77" r="2.5" fill="#a855f7" />
        <circle cx="25" cy="40" r="2.5" fill="#a855f7" />
      </svg>
      
      {/* Absolute labels placed around the Radar */}
      <span className="absolute top-1 text-[8px] font-bold text-white uppercase font-sans">Frontend</span>
      <span className="absolute right-2 top-12 text-[8px] font-bold text-white uppercase font-sans">AI / ML</span>
      <span className="absolute right-2 bottom-12 text-[8px] font-bold text-white uppercase font-sans">Backend</span>
      <span className="absolute bottom-1 text-[8px] font-bold text-white uppercase font-sans">DevOps</span>
      <span className="absolute left-2 bottom-12 text-[8px] font-bold text-white uppercase font-sans">Systems</span>
      <span className="absolute left-2 top-12 text-[8px] font-bold text-white uppercase font-sans">UI/UX</span>
    </div>
  );
};
export default CareerRadar;
