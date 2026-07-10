'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  GraduationCap, 
  Briefcase, 
  Wallet, 
  HeartHandshake, 
  Activity,
  Cpu,
  WifiOff,
  Search,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useDashboard } from '@/hooks/useDashboard';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

// Import sub-widgets
import { DashboardLoader } from './DashboardLoader';
import { AIHealthWidget } from './AIHealthWidget';
import { ActivityTimeline } from './ActivityTimeline';
import { QuickCaptureWidget } from './QuickCaptureWidget';
import { DashboardWidget } from '@/components/widgets/DashboardWidget';

interface MilestoneItem {
  id: string;
  title: string;
  completed: boolean;
}

export const DashboardView: React.FC = () => {
  const { profile, isLoading } = useUser();
  const { widgetVisibility } = useDashboard();

  // Local state for online status initialized with safe client-side check
  const [isOnline, setIsOnline] = useState(() => typeof window !== 'undefined' ? navigator.onLine : true);
  const [completedIds, setCompletedIds] = useState<string[]>(['4']);

  // Handle Online/Offline updates
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Derive dashboard state machine values dynamically to avoid cascading renders
  const dashboardState = (() => {
    if (isLoading) return 'loading';
    if (!isOnline) return 'offline';
    if (!profile || !profile.onboarded) return 'first_time';
    if (!profile.aiProfile) return 'no_ai_profile';
    return 'ready';
  })();

  // Compute profile completion percentage dynamically
  const getProfileCompletion = () => {
    if (!profile) return 0;
    let score = 20; // onboarded gets baseline 20%
    if (profile.displayName) score += 20;
    if (profile.education) score += 20;
    if (profile.preferences) score += 20;
    if (profile.socials) score += 20;
    return score;
  };

  const completionPercent = getProfileCompletion();

  // Onboarding milestones checklist compile
  const ai = profile?.aiProfile;
  const skillsList = ai?.suggestedSkills?.slice(0, 2).join(', ') || 'React, Tailwind';

  const milestones: MilestoneItem[] = ai ? [
    { 
      id: '1', 
      title: ai.firstMilestone || 'Complete initial review of your personalized career roadmap', 
      completed: completedIds.includes('1') 
    },
    { 
      id: '2', 
      title: `Start learning recommended core skills: ${skillsList}`, 
      completed: completedIds.includes('2') 
    },
    { 
      id: '3', 
      title: `Address career prioritisation: ${ai.growthPriorities?.[0] || 'Build technical core'}`, 
      completed: completedIds.includes('3') 
    },
    { 
      id: '4', 
      title: 'Import your initial profile layout into the Resume Builder', 
      completed: completedIds.includes('4') 
    },
  ] : [];

  const toggleMilestone = (id: string) => {
    setCompletedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const completedCount = milestones.filter(m => m.completed).length;
  const progressPercent = milestones.length > 0 
    ? Math.round((completedCount / milestones.length) * 100)
    : 25;

  // Open Command Palette programmatically on Click
  const triggerCommandPalette = () => {
    const evt = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true, bubbles: true });
    window.dispatchEvent(evt);
  };

  // 1. STATE RENDER: Loading
  if (dashboardState === 'loading') {
    return <DashboardLoader onComplete={() => {}} />;
  }

  // 2. STATE RENDER: First Time User / No Profile
  if (dashboardState === 'first_time') {
    return (
      <div className="p-6 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center select-none font-sans">
        <div className="h-16 w-16 rounded-2xl bg-linear-to-tr from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/20">
          <Sparkles className="h-8 w-8 text-white animate-pulse" />
        </div>
        <div className="max-w-md">
          <h2 className="text-xl font-bold text-white tracking-tight">Initialize your Career Operating System</h2>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Welcome to Lumina! To map learning timelines, resume keywords, and scholarships matching your career stage, complete the conversational AI onboarding wizard.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mt-2">
          <a href="/onboarding" className="flex-1">
            <Button className="w-full text-xs font-semibold py-2.5">
              Launch AI Onboarding (3 mins) →
            </Button>
          </a>
        </div>
      </div>
    );
  }

  // Determine Today's priority task based on unchecked checklist items
  const activeMilestone = milestones.find(m => !m.completed);

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 select-none font-sans relative">
      
      {/* Offline Alert Banner */}
      {dashboardState === 'offline' && (
        <div className="mb-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg p-3 flex items-center gap-2 text-xs">
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>Offline Mode. Showing your cached offline data. AI Coach and live matching features are temporarily unavailable.</span>
        </div>
      )}

      {/* Top command launcher search bar */}
      <div 
        onClick={triggerCommandPalette}
        className="w-full max-w-xl bg-card/30 border border-border/80 hover:border-primary/45 rounded-lg px-4 py-2 flex items-center justify-between text-xs text-muted-foreground hover:text-white transition-all cursor-pointer shadow-xs"
      >
        <div className="flex items-center gap-2">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Search anything (Resume, scholarships, interview targets...)</span>
        </div>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-muted/20 border border-border/50 text-[9px] font-mono tracking-widest text-muted-foreground select-none">
          CTRL K
        </kbd>
      </div>

      {/* Header Welcome banner withQuote */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Welcome back, {profile?.displayName || 'Pioneer'} ✨
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Lumina Career Engine active. Stage: <span className="uppercase font-bold text-cyan-400 font-mono">{profile?.stage}</span>
          </p>
        </div>
        
        {ai && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5 text-[10px] text-primary font-bold uppercase tracking-wider font-mono">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Profile Sync: Cache v{ai.version}</span>
          </div>
        )}
      </div>

      {/* Main Grid Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Milestones, Opps & Workspaces */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Today's Mission Priority Panel */}
          {activeMilestone && (
            <div className="p-5 rounded-xl border border-primary/20 bg-linear-to-tr from-primary/10 to-secondary/5 flex items-center justify-between shadow-xs">
              <div className="flex-1 min-w-0 pr-4">
                <span className="text-[9px] text-primary uppercase font-bold tracking-wider block">Today&apos;s Focus Mission</span>
                <h4 className="text-xs font-semibold text-white mt-1 leading-normal truncate">{activeMilestone.title}</h4>
              </div>
              <button 
                onClick={() => toggleMilestone(activeMilestone.id)}
                className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-[10px] font-bold uppercase tracking-wide shrink-0 cursor-pointer shadow-sm"
              >
                Mark Complete
              </button>
            </div>
          )}

          {widgetVisibility.roadmap_completion && (
            <DashboardWidget 
              title="Interactive Growth Milestones" 
              icon={CheckCircle2}
              actions={
                <span className="text-[10px] text-muted-foreground font-mono">{progressPercent}% ({completedCount}/4) completed</span>
              }
            >
              <div className="flex flex-col gap-2.5 mt-2">
                {milestones.map((m) => (
                  <div 
                    key={m.id}
                    onClick={() => toggleMilestone(m.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer text-left",
                      m.completed 
                        ? "bg-primary/5 border-primary/20 text-muted-foreground/60" 
                        : "bg-muted/10 border-border/80 text-white hover:bg-muted/20"
                    )}
                  >
                    <div className={cn(
                      "h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                      m.completed ? "bg-primary border-primary text-white" : "border-muted-foreground/60"
                    )}>
                      {m.completed && <CheckCircle2 className="h-3 w-3 fill-primary stroke-white" />}
                    </div>
                    <span className={cn("text-xs font-sans", m.completed && "line-through text-muted-foreground/50")}>
                      {m.title}
                    </span>
                  </div>
                ))}
              </div>
            </DashboardWidget>
          )}

          {/* Dynamic Opps Matched based on user stage (Personalization) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Stage Widget: School / Scholarships */}
            {(profile?.stage === 'school' || profile?.stage === 'college') && widgetVisibility.scholarships_widget && (
              <DashboardWidget title="Eligible AI Scholarships" icon={GraduationCap}>
                <div className="flex flex-col gap-3 mt-2">
                  <div className="p-3 bg-muted/10 border border-border/60 rounded-lg text-left">
                    <h4 className="text-xs font-semibold text-white">Google Generation Scholarship</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Eligibility: CS & Tech majors • Funding: $10,000</p>
                    <a href="/scholarships">
                      <button className="text-[9px] text-primary mt-2 font-bold uppercase tracking-wider hover:underline cursor-pointer flex items-center gap-0.5">
                        <span>Apply Scholarship →</span>
                      </button>
                    </a>
                  </div>
                </div>
              </DashboardWidget>
            )}

            {/* Stage Widget: College / Internships */}
            {(profile?.stage === 'college' || profile?.stage === 'professional') && widgetVisibility.jobs_widget && (
              <DashboardWidget title="Recommended Opportunities" icon={Briefcase}>
                <div className="flex flex-col gap-3 mt-2">
                  <div className="p-3 bg-muted/10 border border-border/60 rounded-lg text-left">
                    <h4 className="text-xs font-semibold text-white">Frontend Software Engineer Intern</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Stripe • Remote hybrid • Match: 92%</p>
                    <a href="/jobs">
                      <button className="text-[9px] text-primary mt-2 font-bold uppercase tracking-wider hover:underline cursor-pointer flex items-center gap-0.5">
                        <span>View Details →</span>
                      </button>
                    </a>
                  </div>
                </div>
              </DashboardWidget>
            )}

            {/* Stage Widget: Professional / ROI Finance */}
            {profile?.stage === 'professional' && widgetVisibility.finance_widget && (
              <DashboardWidget title="Market ROI & Finance Analytics" icon={Wallet}>
                <div className="flex flex-col gap-2 mt-2 text-left">
                  <div className="flex items-center justify-between text-xs pb-1.5 border-b border-border/20">
                    <span className="text-muted-foreground">Target Role Average</span>
                    <span className="text-white font-bold font-mono">$135,000/yr</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1.5">
                    <span className="text-muted-foreground">Estimated Salary Growth</span>
                    <span className="text-emerald-400 font-bold font-mono">+12.4%</span>
                  </div>
                </div>
              </DashboardWidget>
            )}

            {/* Mentors Preview widget */}
            {widgetVisibility.mentor_widget && (
              <DashboardWidget title="Matched Advisory Mentors" icon={HeartHandshake}>
                <div className="flex flex-col gap-3 mt-2 text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-linear-to-tr from-cyan-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">
                      SJ
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-white truncate">Sarah Jenkins</h4>
                      <p className="text-[10px] text-muted-foreground truncate">Staff Engineer at Stripe</p>
                    </div>
                    <a href="/mentors">
                      <ChevronRight className="h-4 w-4 text-muted-foreground hover:text-white" />
                    </a>
                  </div>
                </div>
              </DashboardWidget>
            )}
          </div>

          {/* Timeline Feed Log */}
          {widgetVisibility.recent_activity && (
            <DashboardWidget title="Recent Activity Timeline" icon={Activity}>
              <div className="mt-2">
                <ActivityTimeline aiProfile={ai} />
              </div>
            </DashboardWidget>
          )}

        </div>

        {/* Right Column: AI Insights, Coach, Profile Completion Ring */}
        <div className="flex flex-col gap-6">
          
          {/* SVG Progress Ring */}
          <DashboardWidget title="Lumina Profile Verification" icon={CheckCircle2}>
            <div className="flex flex-col items-center justify-center gap-4 py-2">
              <div className="relative h-20 w-20 flex items-center justify-center">
                <svg className="h-full w-full -rotate-90">
                  <circle
                    className="text-muted/15"
                    strokeWidth="5"
                    stroke="currentColor"
                    fill="transparent"
                    r="32"
                    cx="40"
                    cy="40"
                  />
                  <motion.circle
                    className="text-primary"
                    strokeWidth="5"
                    strokeDasharray={2 * Math.PI * 32}
                    strokeDashoffset={2 * Math.PI * 32 * (1 - completionPercent / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="32"
                    cx="40"
                    cy="40"
                    initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - completionPercent / 100) }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </svg>
                <span className="absolute text-xs font-bold text-white font-mono">{completionPercent}%</span>
              </div>
              <div className="text-center">
                <h4 className="text-[11px] font-semibold text-white">Profile Strength Profile</h4>
                <p className="text-[9px] text-muted-foreground mt-0.5">
                  {completionPercent === 100 ? 'Verification complete! Lumina mapping active.' : 'Add developer socials to reach 100% verification.'}
                </p>
              </div>
            </div>
          </DashboardWidget>

          {/* AI Cache Insights Card */}
          {ai && widgetVisibility.ai_insights && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 flex flex-col gap-3.5 relative overflow-hidden text-left">
              <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-primary/10 blur-xl animate-pulse" />
              
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                <span className="uppercase tracking-wider text-[10px]">AI Insights Advisor</span>
              </div>
              
              <p className="text-xs text-white leading-relaxed font-sans italic">
                &quot;{ai.welcomeMessage}&quot;
              </p>

              <div className="border-t border-border/30 pt-3 flex flex-col gap-2">
                <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider block">Recommended Goal Target</span>
                <span className="text-xs text-white/90 font-medium font-sans leading-normal">
                  {ai.learningGoal}
                </span>
              </div>
            </div>
          )}

          {/* AI Coach Quick prompt assistant card */}
          {widgetVisibility.ai_insights && (
            <DashboardWidget title="AI Coach Quick Actions" icon={Cpu}>
              <div className="flex flex-col gap-2.5 text-left mt-2 font-sans">
                <span className="text-[10px] text-muted-foreground">Select an option to execute in the future AI Studio:</span>
                <div className="grid grid-cols-1 gap-2">
                  <a href="/resume" className="p-2.5 rounded-lg bg-muted/10 border border-border/40 hover:bg-muted/20 transition-all text-xs font-semibold text-white flex justify-between items-center cursor-pointer">
                    <span>Audit My Resume (3 mins)</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                  <a href="/playground" className="p-2.5 rounded-lg bg-muted/10 border border-border/40 hover:bg-muted/20 transition-all text-xs font-semibold text-white flex justify-between items-center cursor-pointer">
                    <span>Practice Job Interview</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                  <a href="/scholarships" className="p-2.5 rounded-lg bg-muted/10 border border-border/40 hover:bg-muted/20 transition-all text-xs font-semibold text-white flex justify-between items-center cursor-pointer">
                    <span>Find Eligible Funding</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                </div>
              </div>
            </DashboardWidget>
          )}

          {/* Analytics Health Widget */}
          {ai && widgetVisibility.ai_health && (
            <DashboardWidget title="AI Career OS Health" icon={TrendingUp}>
              <div className="mt-1">
                <AIHealthWidget aiProfile={ai} />
              </div>
            </DashboardWidget>
          )}

        </div>

      </div>

      {/* Floating Capture widget */}
      <QuickCaptureWidget />
    </div>
  );
};

// Internal Button component since it is only used locally for first time layout
const Button: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg bg-linear-to-r from-primary to-secondary text-white font-bold transition-all shadow-md shadow-primary/10 hover:shadow-primary/20 cursor-pointer",
        className
      )}
    >
      {children}
    </button>
  );
};

export default DashboardView;
