'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Sparkles } from 'lucide-react';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'ai';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl text-xs font-semibold tracking-wide transition-all focus-ring cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/10',
    secondary: 'bg-muted border border-border text-white hover:bg-muted/80',
    outline: 'border border-border bg-transparent text-muted-foreground hover:text-white hover:bg-muted/40',
    ghost: 'bg-transparent text-muted-foreground hover:text-white hover:bg-muted/40',
    danger: 'bg-accent text-white hover:bg-accent/95 shadow-md shadow-accent/10',
    success: 'bg-[#10b981] text-white hover:bg-[#10b981]/95 shadow-md shadow-emerald-500/10',
    ai: 'ai-gradient-bg text-white shadow-md shadow-purple-500/10 hover:shadow-lg hover:shadow-cyan-500/15 relative overflow-hidden group',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-[10px]',
    md: 'px-4.5 py-2.5',
    lg: 'px-6 py-3.5 text-sm',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {/* Decorative reflection layer for AI button */}
      {variant === 'ai' && (
        <div className="absolute inset-0 bg-radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 60%) pointer-events-none" />
      )}

      {isLoading ? (
        <div className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground border-t-white animate-spin shrink-0" />
      ) : variant === 'ai' ? (
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-white animate-pulse" />
      ) : null}

      <span>{children}</span>
    </motion.button>
  );
};
export default Button;
