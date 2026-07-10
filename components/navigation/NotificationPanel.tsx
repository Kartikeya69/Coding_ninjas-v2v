'use client';

import React from 'react';
import { Bell, Sparkles, X, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface NotificationPanelProps {
  onClose?: () => void;
  className?: string;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  onClose,
  className,
}) => {
  return (
    <div className={cn(
      "w-80 rounded-xl border border-border bg-card/95 backdrop-blur-xl p-4 shadow-xl flex flex-col gap-3.5",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
          <Bell className="h-4 w-4 text-primary shrink-0" />
          <span>Notifications</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-0.5 hover:bg-muted/80 rounded-md text-muted-foreground hover:text-white transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1">
        <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors cursor-pointer">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-primary mb-1">
            <Sparkles className="h-3 w-3 shrink-0" />
            <span>AI Career Coach</span>
          </div>
          <p className="text-[10px] text-white font-medium">Your custom ML Roadmap is generated. Take a look!</p>
          <span className="text-[8px] text-muted-foreground block mt-1.5">5m ago</span>
        </div>

        <div className="p-2.5 rounded-lg bg-muted/20 border border-border/40 hover:bg-muted/40 transition-colors cursor-pointer">
          <p className="text-[10px] text-white font-semibold mb-0.5">New Mentor Match Found</p>
          <p className="text-[10px] text-muted-foreground">Sarah Jenkins approved your meeting request.</p>
          <span className="text-[8px] text-muted-foreground block mt-1.5">2h ago</span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/60 pt-2 flex items-center justify-between text-[9px] text-primary hover:underline cursor-pointer font-semibold uppercase tracking-wider">
        <span>Mark all as read</span>
        <ChevronRight className="h-3 w-3 shrink-0" />
      </div>
    </div>
  );
};
export default NotificationPanel;
