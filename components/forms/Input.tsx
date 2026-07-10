'use client';

import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  className,
  label,
  error,
  helperText,
  type = 'text',
  id,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label 
          htmlFor={id} 
          className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block"
        >
          {label}
        </label>
      )}
      
      <input
        id={id}
        type={type}
        className={cn(
          "w-full bg-[#121214]/60 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground focus-ring font-sans transition-colors",
          error ? "border-accent/50 focus-visible:ring-accent" : "border-border/80 focus-visible:border-primary/60",
          className
        )}
        {...props}
      />

      {error ? (
        <span className="text-[10px] text-accent font-semibold block mt-0.5 animate-in fade-in slide-in-from-top-1">
          {error}
        </span>
      ) : helperText ? (
        <span className="text-[9px] text-muted-foreground block mt-0.5">
          {helperText}
        </span>
      ) : null}
    </div>
  );
};
export default Input;
