'use client';

import React from 'react';
import { cn } from '../../utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        "glass-panel rounded-xl p-5 relative overflow-hidden transition-all duration-300",
        hoverEffect && "hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 hover:translate-y-[-2px]",
        className
      )}
      {...props}
    >
      {/* Soft overlay reflections */}
      <div className="absolute inset-0 bg-radial-gradient(circle at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 75%) pointer-events-none" />
      
      {children}
    </div>
  );
};
export default GlassCard;
