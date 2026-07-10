'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardWidgetProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyNode?: React.ReactNode; // custom empty state override
  expandable?: boolean;
  className?: string;
  onRefresh?: () => void;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  icon: Icon,
  actions,
  children,
  loading = false,
  empty = false,
  emptyNode,
  expandable = false,
  className,
  onRefresh,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={cn(
      "rounded-xl border border-border bg-card/45 backdrop-blur-xl p-5 shadow-xs flex flex-col gap-4 relative overflow-hidden transition-all duration-300",
      className
    )}>
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4.5 w-4.5 text-primary shrink-0" />}
          <h3 className="text-xs font-semibold text-white font-sans">{title}</h3>
        </div>
        
        {/* Controls / Actions */}
        <div className="flex items-center gap-2">
          {onRefresh && !loading && (
            <button 
              onClick={onRefresh}
              className="p-1 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
          {actions && <div className="flex items-center">{actions}</div>}
          {expandable && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-white transition-colors cursor-pointer"
            >
              {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Content Body */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            {loading ? (
              /* Loading Skeletons */
              <div className="flex flex-col gap-3 py-2">
                <div className="h-4 bg-muted/30 rounded-md w-1/3 animate-pulse" />
                <div className="h-3 bg-muted/20 rounded-md w-full animate-pulse" />
                <div className="h-3 bg-muted/20 rounded-md w-5/6 animate-pulse" />
                <div className="h-3 bg-muted/20 rounded-md w-2/3 animate-pulse" />
              </div>
            ) : empty ? (
              /* Empty state render */
              <div className="py-6 flex items-center justify-center">
                {emptyNode || (
                  <div className="text-center">
                    <p className="text-[10px] text-muted-foreground">No data available right now.</p>
                  </div>
                )}
              </div>
            ) : (
              /* Standard children */
              children
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default DashboardWidget;
