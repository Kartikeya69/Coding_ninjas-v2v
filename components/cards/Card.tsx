'use client';

import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card/60 backdrop-blur-md p-5 relative overflow-hidden transition-all duration-300",
        hoverEffect && "hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:translate-y-[-2px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;
