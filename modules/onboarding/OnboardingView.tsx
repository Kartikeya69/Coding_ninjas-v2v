'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { logger } from '../../lib/logger';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Check, Sparkle, BrainCircuit, ShieldCheck, Flame } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useOnboarding } from '../../hooks/useOnboarding';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { AIProfile } from '../../types/user';

// Import UI Primitives
import { Button } from '../../components/buttons/Button';
import { Input } from '../../components/forms/Input';
import { GlassCard } from '../../components/cards/GlassCard';
import { AIOrb } from '../../components/ai/AIOrb';
import { AIThinking } from '../../components/ai/AIThinking';

// Standard focus categories
const INTEREST_OPTIONS = [
  { id: 'scholarships', label: 'Match Scholarships', desc: 'Find funding matching your profile' },
  { id: 'resume', label: 'Build & Audit Resume', desc: 'Run automated AI reviews on drafts' },
  { id: 'jobs', label: 'Match Target Jobs', desc: 'AI filter active roles matching skills' },
  { id: 'mentorship', label: '1:1 Expert Mentors', desc: 'Schedule training sessions with guides' },
  { id: 'upskilling', label: 'AI Study Roadmaps', desc: 'Deploy tailored curriculum timelines' },
  { id: 'startup', label: 'Startup Founder Tools', desc: 'Explore venture templates and resources' },
];

export const OnboardingView: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Zustand state sync
  const onboarding = useOnboarding();
  const {
    loadDraft,
    step,
    nextStep,
    prevStep,
    name,
    age,
    stage,
    schoolOrCollege,
    graduationYear,
    favoriteSubjects,
    degree,
    major,
    yearsOfExperience,
    currentRole,
    company,
    workMode,
    location,
    github,
    linkedin,
    weeklyHours,
    autoConfigure
  } = onboarding;
  
  // Local screen state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiProfile, setAiProfile] = useState<AIProfile | null>(null);
  const [progressMessage, setProgressMessage] = useState('Initializing profile analysis...');
  const [isAutoOnboarding] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem('google_signup_pending_onboarding') === 'true'
  );
  const [countdown, setCountdown] = useState(4);
  const generationRequestKeyRef = useRef<string | null>(null);

  // Initialize draft restore from localStorage
  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  // Auto-configure onboarding if Google signup flag is present
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const isAuto = localStorage.getItem('google_signup_pending_onboarding') === 'true';
      if (isAuto && step !== 5 && step !== 6) {
        logger.info('Google signup detected. Auto-configuring onboarding...');
        const displayName = user.displayName || user.email?.split('@')[0] || 'Pioneer';
        autoConfigure({ name: displayName });
      }
    }
  }, [user, autoConfigure, step]);

  // Update progress message staggered timers during AI generation step
  useEffect(() => {
    if (step === 5) {
      const requestKey = JSON.stringify({
        uid: user?.uid,
        name,
        stage,
        schoolOrCollege,
        graduationYear,
        favoriteSubjects,
        degree,
        major,
        yearsOfExperience,
        currentRole,
        company,
        workMode,
        location,
        github,
        linkedin,
        weeklyHours,
      });

      if (generationRequestKeyRef.current === requestKey) {
        return;
      }
      generationRequestKeyRef.current = requestKey;

      const messages = [
        'Analyzing your interests...',
        'Mapping educational priorities...',
        'Finding tailored scholarships...',
        'Formulating weekly milestone goals...',
        'Writing personalization profile...',
      ];
      
      let index = 0;
      const interval = setInterval(() => {
        if (index < messages.length - 1) {
          index++;
          setProgressMessage(messages[index]);
        }
      }, 1000);

      // Trigger server-side API call once on Step 5
      const triggerAPI = async () => {
        setLoading(true);
        setError(null);
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 20000);
        try {
          const payload = {
            uid: user?.uid,
            email: user?.email,
            displayName: name || user?.displayName || 'Pioneer',
            photoURL: user?.photoURL || null,
            stage,
            education: stage === 'school' ? {
              schoolOrCollege,
              graduationYear,
              favoriteSubjects,
            } : stage === 'college' ? {
              schoolOrCollege,
              degree,
              major,
              graduationYear,
            } : undefined,
            career: stage === 'professional' ? {
              experienceLevel: yearsOfExperience > 5 ? 'senior' : yearsOfExperience > 2 ? 'mid' : 'entry',
              currentRole,
              company,
              yearsOfExperience: Number(yearsOfExperience),
            } : {
              experienceLevel: 'student',
            },
            preferences: {
              workMode: workMode || undefined,
              location: location || undefined,
            },
            socials: {
              github: github || undefined,
              linkedin: linkedin || undefined,
            },
            availability: {
              weeklyHours: Number(weeklyHours),
            },
          };

          const response = await fetch('/api/onboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`API failed with status ${response.status}`);
          }

          const resData = await response.json();
          if (resData.success && resData.profile) {
            setAiProfile(resData.profile);
            // Move to preview step
            setTimeout(() => {
              nextStep();
            }, 1200);
          } else {
            throw new Error(resData.message || 'Failed to generate profile');
          }
        } catch (err) {
          generationRequestKeyRef.current = null;
          const errMsg = err instanceof Error && err.name === 'AbortError'
            ? 'Profile generation timed out. Please try again.'
            : err instanceof Error ? err.message : 'Unknown network error';
          console.error(err);
          setError(errMsg);
          // Auto-step back to edit if failed
          setTimeout(() => {
            prevStep();
          }, 3000);
        } finally {
          window.clearTimeout(timeout);
          setLoading(false);
        }
      };

      triggerAPI();
      return () => clearInterval(interval);
    }
  }, [
    step,
    name,
    stage,
    schoolOrCollege,
    graduationYear,
    favoriteSubjects,
    degree,
    major,
    yearsOfExperience,
    currentRole,
    company,
    workMode,
    location,
    github,
    linkedin,
    weeklyHours,
    nextStep,
    prevStep,
    user
  ]);

  const handleNext = () => {
    onboarding.nextStep();
  };

  const handlePrev = () => {
    onboarding.prevStep();
  };

  const handleToggleInterest = (id: string) => {
    const active = onboarding.interests.includes(id)
      ? onboarding.interests.filter((i) => i !== id)
      : [...onboarding.interests, id];
    onboarding.setField('interests', active);
  };

  const handleToggleSubject = (sub: string) => {
    const active = onboarding.favoriteSubjects.includes(sub)
      ? onboarding.favoriteSubjects.filter((s) => s !== sub)
      : [...onboarding.favoriteSubjects, sub];
    onboarding.setField('favoriteSubjects', active);
  };

  const handleCompleteOnboarding = useCallback(() => {
    // Set local storage flag to prevent offline redirection loop
    if (user?.uid) {
      localStorage.setItem(`onboarded_${user.uid}`, 'true');
    }
    // Clear autosave draft data
    onboarding.resetOnboarding();
    // Invalidate react query cache to force reload the new profile
    queryClient.invalidateQueries({ queryKey: ['user-profile', user?.uid] });
    // Go to dashboard
    router.push('/dashboard');
  }, [user, onboarding, queryClient, router]);

  // Countdown redirection timer for automated onboarding preview step
  useEffect(() => {
    if (step === 6 && isAutoOnboarding) {
      if (countdown <= 0) {
        localStorage.removeItem('google_signup_pending_onboarding');
        handleCompleteOnboarding();
        return;
      }
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, isAutoOnboarding, countdown, handleCompleteOnboarding]);

  const isStepValid = () => {
    switch (onboarding.step) {
      case 1:
        return onboarding.name.trim().length > 1 && onboarding.age > 5 && !!onboarding.stage;
      case 2:
        if (onboarding.stage === 'school') {
          return onboarding.schoolOrCollege.trim().length > 1;
        }
        if (onboarding.stage === 'college') {
          return onboarding.schoolOrCollege.trim().length > 1 && onboarding.major.trim().length > 1;
        }
        if (onboarding.stage === 'professional') {
          return onboarding.currentRole.trim().length > 1 && onboarding.company.trim().length > 1;
        }
        return false;
      case 3:
        return onboarding.interests.length > 0;
      case 4:
        return onboarding.weeklyHours >= 1 && onboarding.weeklyHours <= 80;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-center items-center px-6 py-12 select-none">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="bg-noise" />

      {/* Onboarding Shell Panel */}
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card/45 backdrop-blur-xl p-8 shadow-2xl relative z-10">
        
        {/* Step Indicator Header (Hide during generation & preview) */}
        {onboarding.step < 5 && (
          <div className="flex justify-between items-center mb-8 border-b border-border/60 pb-4">
            <div>
              <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">Step {onboarding.step} of 4</span>
              <h2 className="text-md font-semibold text-white mt-0.5">
                {onboarding.step === 1 && 'Personalize Identity'}
                {onboarding.step === 2 && 'Tailor Focus Areas'}
                {onboarding.step === 3 && 'Core Career Interests'}
                {onboarding.step === 4 && 'Commitment & Profiles'}
              </h2>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <span 
                  key={s} 
                  className={cn(
                    "h-1.5 w-6 rounded-full transition-all duration-300",
                    s <= onboarding.step ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: IDENTITY & LIFE STAGE */}
          {onboarding.step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-4">
                <Input
                  label="What should we call you?"
                  placeholder="Enter your name..."
                  value={onboarding.name}
                  onChange={(e) => onboarding.setField('name', e.target.value)}
                />
                <Input
                  label="Your Age"
                  type="number"
                  placeholder="E.g., 20"
                  value={onboarding.age || ''}
                  onChange={(e) => onboarding.setField('age', Number(e.target.value))}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Identify Your Career Stage</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {(['school', 'college', 'professional'] as const).map((stageVal) => (
                    <button
                      key={stageVal}
                      onClick={() => onboarding.setField('stage', stageVal)}
                      className={cn(
                        "w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer",
                        onboarding.stage === stageVal
                          ? "border-primary bg-primary/5 text-white"
                          : "border-border bg-card/60 text-muted-foreground hover:text-white"
                      )}
                    >
                      <span className="text-xs font-semibold block mb-0.5 uppercase tracking-wide">
                        {stageVal === 'school' && 'School Student'}
                        {stageVal === 'college' && 'University / College Student'}
                        {stageVal === 'professional' && 'Working Professional'}
                      </span>
                      <span className="text-[9px] text-muted-foreground">
                        {stageVal === 'school' && 'Explore options, prepare for olympiads and competitions'}
                        {stageVal === 'college' && 'Build github portfolios, target internships, write resume drafts'}
                        {stageVal === 'professional' && 'Formulate promotion plans, switch fields, expand system patterns'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: STAGE DETAILS */}
          {onboarding.step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="flex flex-col gap-6"
            >
              {/* SCHOOL BRANCH */}
              {onboarding.stage === 'school' && (
                <div className="flex flex-col gap-5">
                  <Input
                    label="School Name"
                    placeholder="Enter your school name..."
                    value={onboarding.schoolOrCollege}
                    onChange={(e) => onboarding.setField('schoolOrCollege', e.target.value)}
                  />
                  <Input
                    label="Current Grade/Standard"
                    placeholder="E.g. Grade 10"
                    value={onboarding.graduationYear}
                    onChange={(e) => onboarding.setField('graduationYear', e.target.value)}
                  />
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2.5">Favorite subjects</label>
                    <div className="flex flex-wrap gap-2">
                      {['Mathematics', 'Computer Science', 'Physics', 'Chemistry', 'Biology', 'Literature'].map((sub) => {
                        const isSel = onboarding.favoriteSubjects.includes(sub);
                        return (
                          <button
                            key={sub}
                            onClick={() => handleToggleSubject(sub)}
                            className={cn(
                              "px-3 py-1.5 rounded-full border text-[10px] transition-colors cursor-pointer",
                              isSel ? "bg-primary border-primary text-white" : "bg-card/60 border-border text-muted-foreground hover:text-white"
                            )}
                          >
                            {sub}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* COLLEGE BRANCH */}
              {onboarding.stage === 'college' && (
                <div className="flex flex-col gap-5">
                  <Input
                    label="College / University Name"
                    placeholder="Enter institution..."
                    value={onboarding.schoolOrCollege}
                    onChange={(e) => onboarding.setField('schoolOrCollege', e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Degree"
                      placeholder="E.g. B.Tech"
                      value={onboarding.degree}
                      onChange={(e) => onboarding.setField('degree', e.target.value)}
                    />
                    <Input
                      label="Major / Branch"
                      placeholder="E.g. Computer Science"
                      value={onboarding.major}
                      onChange={(e) => onboarding.setField('major', e.target.value)}
                    />
                  </div>
                  <Input
                    label="Graduation Year"
                    placeholder="E.g. 2027"
                    value={onboarding.graduationYear}
                    onChange={(e) => onboarding.setField('graduationYear', e.target.value)}
                  />
                </div>
              )}

              {/* PROFESSIONAL BRANCH */}
              {onboarding.stage === 'professional' && (
                <div className="flex flex-col gap-5">
                  <Input
                    label="Current Role / Job Title"
                    placeholder="E.g. Frontend Engineer"
                    value={onboarding.currentRole}
                    onChange={(e) => onboarding.setField('currentRole', e.target.value)}
                  />
                  <Input
                    label="Company Name"
                    placeholder="E.g. Google"
                    value={onboarding.company}
                    onChange={(e) => onboarding.setField('company', e.target.value)}
                  />
                  <Input
                    label="Years of Experience"
                    type="number"
                    placeholder="E.g. 3"
                    value={onboarding.yearsOfExperience || ''}
                    onChange={(e) => onboarding.setField('yearsOfExperience', Number(e.target.value))}
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 3: CORE INTERESTS */}
          {onboarding.step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="flex flex-col gap-4"
            >
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">What tools would you like to load first?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
                {INTEREST_OPTIONS.map((item) => {
                  const isSel = onboarding.interests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleToggleInterest(item.id)}
                      className={cn(
                        "text-left p-3.5 rounded-xl border transition-all cursor-pointer",
                        isSel
                          ? "border-primary bg-primary/5 text-white"
                          : "border-border bg-card/60 text-muted-foreground hover:text-white"
                      )}
                    >
                      <span className="text-xs font-semibold block mb-0.5">{item.label}</span>
                      <span className="text-[9px] text-muted-foreground">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 4: AVAILABILITY & SOCIALS */}
          {onboarding.step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Weekly availability committed</label>
                <div className="flex items-center gap-4 bg-muted/20 border border-border p-4 rounded-xl">
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={onboarding.weeklyHours}
                    onChange={(e) => onboarding.setField('weeklyHours', Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <span className="text-xs font-bold text-white shrink-0 min-w-[55px] text-right">
                    {onboarding.weeklyHours} hrs
                  </span>
                </div>
              </div>

              {onboarding.stage !== 'school' && (
                <div className="flex flex-col gap-4 border-t border-border/60 pt-4">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Developer Links (Optional)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="GitHub profile link"
                      placeholder="github.com/..."
                      value={onboarding.github}
                      onChange={(e) => onboarding.setField('github', e.target.value)}
                    />
                    <Input
                      label="LinkedIn link"
                      placeholder="linkedin.com/in/..."
                      value={onboarding.linkedin}
                      onChange={(e) => onboarding.setField('linkedin', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 5: AI PROCESSING ENGINE */}
          {onboarding.step === 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center gap-6 py-10"
            >
              {/* Pulsing rotating Orb core */}
              <AIOrb size="md" isThinking={true} />

              <div className="flex flex-col gap-2.5 items-center">
                <AIThinking />
                <span className="text-xs text-white font-medium animate-pulse mt-2">{progressMessage}</span>
                <p className="text-[10px] text-muted-foreground max-w-xs mt-1">
                  Lumina AI is connecting variables to deploy your customized dashboard engine.
                </p>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-lg border border-accent/25 bg-accent/5 text-[10px] text-accent font-semibold leading-relaxed max-w-sm">
                  Error: {error}. Retrying/reverting profile data configurations...
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 6: AI PROFILE PREVIEW SUMMARY */}
          {onboarding.step === 6 && aiProfile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-5 py-2"
            >
              {/* Header block */}
              <div className="text-center flex flex-col items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-linear-to-tr from-cyan-400 to-purple-500 flex items-center justify-center text-white shadow-md animate-pulse">
                  <Sparkle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-white">Your AI Profile is Ready!</h3>
                  <p className="text-[10px] text-muted-foreground mt-1 max-w-xs mx-auto">
                    Here is how Lumina segments your path based on your inputs.
                  </p>
                </div>
              </div>

              {/* Persona glass card */}
              <GlassCard className="flex flex-col gap-4 border-primary/25 bg-primary/5">
                <div className="flex items-center gap-2 text-cyan-400">
                  <BrainCircuit className="h-4.5 w-4.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Generated Career Persona</span>
                </div>
                
                <div>
                  <span className="text-sm font-bold text-white block leading-tight">{aiProfile.persona}</span>
                  <span className="text-[10px] text-muted-foreground block mt-1">Learning Style: {aiProfile.learningStyle}</span>
                </div>

                <p className="text-[10px] text-white/90 leading-relaxed font-sans italic">
                  &quot;{aiProfile.welcomeMessage}&quot;
                </p>
              </GlassCard>

              {/* Strengths & First Milestone grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-card/60 flex flex-col gap-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-white font-semibold">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <span>Your Strengths</span>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {aiProfile.strengths?.slice(0, 3).map((st: string, i: number) => (
                      <li key={i} className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                        <Check className="h-3 w-3 text-cyan-400 shrink-0" />
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card/60 flex flex-col gap-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-white font-semibold">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>First Milestone</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                    {aiProfile.firstMilestone}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Navigation Buttons footer (Hide during generation step 5) */}
        {onboarding.step !== 5 && (
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-border/60">
            {onboarding.step === 6 ? (
              isAutoOnboarding ? (
                <div className="text-[11px] text-cyan-400 font-semibold animate-pulse">
                  Redirecting to dashboard in {countdown}s...
                </div>
              ) : (
                <div />
              )
            ) : (
              <button
                onClick={handlePrev}
                disabled={onboarding.step === 1}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            )}

            {onboarding.step === 6 ? (
              <Button
                variant="ai"
                onClick={handleCompleteOnboarding}
                className="px-6 py-3 font-semibold uppercase tracking-wider text-[11px]"
              >
                Looks Great 🚀
              </Button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
export default OnboardingView;
