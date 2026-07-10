'use client';

import React from 'react';
import { Award, Briefcase, GraduationCap, RefreshCw, KeyRound, Sparkles } from 'lucide-react';
import { AIProfile } from '@/types/user';

interface ActivityTimelineProps {
  aiProfile?: AIProfile;
}

interface TimelineItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  timestamp: string;
  category: 'onboarding' | 'learning' | 'career' | 'security';
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ aiProfile }) => {
  // Compute milestones based on user state
  const activities: TimelineItem[] = [
    {
      id: '1',
      icon: Sparkles,
      title: 'AI Career Persona Generated',
      desc: aiProfile ? `Mapped to: ${aiProfile.persona}` : 'Career roadmap synchronized with Lumina AI engine',
      timestamp: 'Yesterday, 4 PM',
      category: 'onboarding',
    },
    {
      id: '2',
      icon: GraduationCap,
      title: 'Onboarding Questionnaire Completed',
      desc: 'Preferences, goals, and weekly hours verified.',
      timestamp: '2 days ago',
      category: 'onboarding',
    },
    {
      id: '3',
      icon: KeyRound,
      title: 'Google Session Logged',
      desc: 'Account credentials synced successfully with Firebase.',
      timestamp: '3 days ago',
      category: 'security',
    },
    {
      id: '4',
      icon: Briefcase,
      title: 'Target milestones mapped',
      desc: aiProfile ? `Primary Goal set to: ${aiProfile.learningGoal}` : 'Synchronized matching opportunities',
      timestamp: '5 days ago',
      category: 'career',
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'onboarding':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'learning':
        return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'security':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default:
        return 'text-secondary bg-secondary/10 border-secondary/20';
    }
  };

  return (
    <div className="flex flex-col gap-5 font-sans select-none text-left">
      <div className="relative border-l border-border/60 pl-5 ml-2.5 flex flex-col gap-5">
        {activities.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} className="relative group">
              {/* Connector Dot */}
              <div className="absolute -left-[27.5px] top-1 h-3.5 w-3.5 rounded-full bg-background border-2 border-border flex items-center justify-center transition-all group-hover:border-primary">
                <div className="h-1.5 w-1.5 rounded-full bg-border group-hover:bg-primary" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded border flex items-center justify-center shrink-0 ${getCategoryColor(item.category)}`}>
                    <IconComponent className="h-3.5 w-3.5" />
                  </div>
                  <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                </div>
                <span className="text-[9px] font-mono text-muted-foreground self-start sm:self-center">
                  {item.timestamp}
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground mt-1 leading-normal ml-8 pl-0.5">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTimeline;
