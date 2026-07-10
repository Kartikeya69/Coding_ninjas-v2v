'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}) => {
  return (
    <label className={cn(
      "flex items-center gap-3 select-none cursor-pointer",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}>
      {/* Track container */}
      <div 
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "w-9 h-5 rounded-full p-[2px] transition-colors duration-200 relative flex items-center focus-ring",
          checked ? "bg-primary" : "bg-muted border border-border"
        )}
      >
        {/* Toggle Thumb */}
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            "h-4 w-4 rounded-full bg-white shadow-xs shrink-0 block",
            checked ? "ml-auto" : "ml-0"
          )}
        />
      </div>
      
      {label && (
        <span className="text-xs text-white font-medium font-sans">
          {label}
        </span>
      )}
    </label>
  );
};
export default Switch;
