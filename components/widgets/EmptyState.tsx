'use client';

import React from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  FileText, 
  BellOff, 
  Users, 
  Wallet, 
  Search
} from 'lucide-react';
import { cn } from '../../utils/cn';

export type EmptyStatePreset = 'jobs' | 'scholarships' | 'resume' | 'notifications' | 'mentor' | 'finance' | 'search';

interface EmptyStateProps {
  preset: EmptyStatePreset;
  title?: string;
  description?: string;
  actionText?: string;
  onActionClick?: () => void;
  className?: string;
}

const presetConfig: Record<EmptyStatePreset, { icon: React.ComponentType<{ className?: string }>; title: string; description: string }> = {
  jobs: {
    icon: Briefcase,
    title: 'No Jobs Matched Yet',
    description: 'Optimize your resume and select active skills to trigger our AI job matching engine.',
  },
  scholarships: {
    icon: GraduationCap,
    title: 'No Scholarships Saved',
    description: 'Browse the explorer and bookmark prestigious funds to track deadlines here.',
  },
  resume: {
    icon: FileText,
    title: 'No Resumes Uploaded',
    description: 'Upload your PDF or DOCX file to run an automated AI match audit against target roles.',
  },
  notifications: {
    icon: BellOff,
    title: 'All Caught Up',
    description: 'No new notifications right now. We will alert you when matches or sessions update.',
  },
  mentor: {
    icon: Users,
    title: 'No Mentorship Connections',
    description: 'Discover certified female guides, schedule sessions, and prepare for interviews 1:1.',
  },
  finance: {
    icon: Wallet,
    title: 'No Financial Logs Detected',
    description: 'Enter tuition goals and savings metrics in the estimator to see your cost projection logs.',
  },
  search: {
    icon: Search,
    title: 'No Search Results Found',
    description: 'We could not find any matches matching your query. Check filters and try again.',
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  preset,
  title,
  description,
  actionText,
  onActionClick,
  className,
}) => {
  const config = presetConfig[preset];
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 rounded-xl border border-border bg-card/25 backdrop-blur-md max-w-md mx-auto w-full select-none gap-4",
      className
    )}>
      {/* Icon Ring */}
      <div className="h-12 w-12 rounded-full bg-muted/60 border border-border flex items-center justify-center text-muted-foreground animate-pulse">
        <Icon className="h-5 w-5" />
      </div>

      {/* Texts */}
      <div>
        <h4 className="text-xs font-semibold text-white font-sans">{title || config.title}</h4>
        <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed font-sans max-w-[280px] mx-auto">
          {description || config.description}
        </p>
      </div>

      {/* Action Button */}
      {actionText && (
        <button
          onClick={onActionClick}
          className="px-3.5 py-2 bg-muted/60 hover:bg-muted/80 border border-border text-[10px] font-semibold text-white rounded-lg transition-colors cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
export default EmptyState;
