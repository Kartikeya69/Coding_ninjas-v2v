'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  Bookmark,
  CheckCircle2,
  Info,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useResumeStore } from '@/hooks/useResumeStore';
import { Job } from '@/lib/services/jobs/schemas/job';
import { cn } from '@/utils/cn';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestore';

interface JobApplication {
  jobId: string;
  appliedAt: string;
  stage: 'Saved' | 'Applied' | 'OA' | 'Interview' | 'Offer' | 'Rejected';
  notes: string;
  resumeVersionUsed: string;
}

interface AICareerMatch {
  overallMatch: number;
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
  resumeScore: number;
  careerGoalAlignment: number;
  missingSkills: string[];
  recommendedCourses: string[];
  estimatedPreparationTime: string;
  confidence: string;
}

export const JobsView: React.FC = () => {
  const { profile } = useUser();
  const { resumes, loadResumes, activeResumeId, setActiveResumeId } = useResumeStore();

  const [searchTerm, setSearchTerm] = useState('React Developer');
  const [locationTerm, setLocationTerm] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  
  // Data loading states
  const [jobs, setJobs] = useState<(Job & { relevanceScore: number })[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [cacheHit, setCacheHit] = useState(false);

  // Saved & Applications user stats
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<Record<string, JobApplication>>({});

  // Active Job selection for AI Match breakdown sidebar drawer
  const [selectedJob, setSelectedJob] = useState<(Job & { relevanceScore: number }) | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<AICareerMatch | null>(null);

  // Application tracker modal state
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const [trackingJob, setTrackingJob] = useState<Job | null>(null);
  const [appStage, setAppStage] = useState<JobApplication['stage']>('Applied');
  const [appNotes, setAppNotes] = useState('');

  const loadUserData = useCallback(async (uid: string) => {
    try {
      // Load bookmarks
      const bookmarkSnap = await getDocs(collection(db, 'users', uid, 'savedJobs'));
      const bookmarkIds: string[] = [];
      bookmarkSnap.forEach((doc) => bookmarkIds.push(doc.id));
      setSavedJobIds(bookmarkIds);

      // Load applications
      const appsSnap = await getDocs(collection(db, 'users', uid, 'applications'));
      const appMap: Record<string, JobApplication> = {};
      appsSnap.forEach((doc) => {
        appMap[doc.id] = doc.data() as JobApplication;
      });
      setApplications(appMap);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Job query controller
  const triggerSearch = useCallback(async () => {
    setIsLoadingJobs(true);
    setJobs([]);
    setSelectedJob(null);
    setActiveAnalysis(null);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchTerm || 'Software',
          location: locationTerm || undefined,
          remoteOnly,
          userId: profile?.uid || undefined
        })
      });

      const res = await response.json();
      if (res.success) {
        setJobs(res.jobs || []);
        setCacheHit(res.cacheHit || false);
        if (res.jobs?.length > 0) {
          setSelectedJob(res.jobs[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingJobs(false);
    }
  }, [searchTerm, locationTerm, remoteOnly, profile]);

  // Initial load
  useEffect(() => {
    if (profile?.uid) {
      const uid = profile.uid;
      // Defer to prevent render-time synchronous cascading setters
      Promise.resolve().then(() => {
        loadResumes(uid);
        loadUserData(uid);
        triggerSearch();
      });
    }
  }, [profile, loadResumes, loadUserData, triggerSearch]);

  // Trigger detailed match audit calculations on selection
  const handleAnalyzeJob = async (job: Job & { relevanceScore: number }) => {
    setSelectedJob(job);
    setActiveAnalysis(null);
    if (!profile?.uid) return;
    
    setIsAnalyzing(true);
    const activeResume = resumes.find(r => r.id === activeResumeId);

    try {
      const response = await fetch('/api/jobs/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.uid,
          jobTitle: job.title,
          jobDescription: job.description || `${job.title} at ${job.company}`,
          resumeData: activeResume || {}
        })
      });

      const res = await response.json();
      if (res.success) {
        setActiveAnalysis(res.match);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle bookmark / saved job
  const handleToggleBookmark = async (jobId: string) => {
    if (!profile?.uid) return;

    try {
      const docRef = doc(db, 'users', profile.uid, 'savedJobs', jobId);
      if (savedJobIds.includes(jobId)) {
        await deleteDoc(docRef);
        setSavedJobIds(prev => prev.filter(x => x !== jobId));
      } else {
        await setDoc(docRef, { jobId, savedAt: new Date().toISOString() });
        setSavedJobIds(prev => [...prev, jobId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Log new application tracking stage
  const handleSaveApplication = async () => {
    if (!profile?.uid || !trackingJob) return;

    try {
      const docRef = doc(db, 'users', profile.uid, 'applications', trackingJob.id);
      const appData: JobApplication = {
        jobId: trackingJob.id,
        appliedAt: new Date().toISOString(),
        stage: appStage,
        notes: appNotes,
        resumeVersionUsed: activeResumeId || 'draft'
      };

      await setDoc(docRef, appData);
      setApplications(prev => ({ ...prev, [trackingJob.id]: appData }));
      setShowTrackerModal(false);
      setAppNotes('');
    } catch (err) {
      console.error(err);
    }
  };

  const activeApp = selectedJob ? applications[selectedJob.id] : null;

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 select-none animate-in fade-in duration-300 relative">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Opportunity Career Hub</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Discover internships & jobs, and audit qualifications matching your active resume draft.
          </p>
        </div>

        {/* Selected Resume version switcher */}
        {resumes.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Matching Resume:</span>
            <select
              value={activeResumeId || ''}
              onChange={(e) => setActiveResumeId(e.target.value)}
              className="bg-card border border-border rounded-lg text-xs font-semibold text-white px-3 py-1.5 focus:border-primary outline-none cursor-pointer"
            >
              {resumes.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Filters & Search Input panel */}
      <div className="flex flex-col sm:flex-row gap-3 border-b border-border/40 pb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search roles, skills or technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && triggerSearch()}
            className="w-full bg-card/60 border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        <div className="relative w-full sm:w-48">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Location..."
            value={locationTerm}
            onChange={(e) => setLocationTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && triggerSearch()}
            className="w-full bg-card/60 border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        <button
          onClick={() => setRemoteOnly(!remoteOnly)}
          className={cn(
            "px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5",
            remoteOnly ? 'bg-primary/10 border-primary text-primary' : 'border-border text-muted-foreground hover:text-white'
          )}
        >
          <span>Remote Only</span>
        </button>

        <button
          onClick={triggerSearch}
          className="px-5 py-2.5 bg-linear-to-tr from-primary to-secondary hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md shadow-primary/15"
        >
          Search Opportunities
        </button>
      </div>

      {/* Main Grid split panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Unified Opportunity Feed (Col 7) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Cache Status tag */}
          {cacheHit && !isLoadingJobs && (
            <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg p-2.5 flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider font-semibold">
              <Info className="h-3.5 w-3.5" />
              <span>Served instantly from Global Shared Cache Query parameters.</span>
            </div>
          )}

          {/* LOADING SKELETONS */}
          {isLoadingJobs && (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted/20 rounded-xl border border-border/60 animate-pulse p-5 flex flex-col justify-between">
                  <div className="h-4 bg-muted/30 rounded w-1/3" />
                  <div className="h-3 bg-muted/20 rounded w-full mt-2" />
                  <div className="h-3 bg-muted/20 rounded w-2/3 mt-1" />
                </div>
              ))}
            </div>
          )}

          {/* List display */}
          {!isLoadingJobs && jobs.length > 0 ? (
            <div className="flex flex-col gap-4">
              {jobs.map((job) => {
                const isSaved = savedJobIds.includes(job.id);
                const hasApplied = !!applications[job.id];
                const activeApplication = applications[job.id];

                return (
                  <div 
                    key={job.id}
                    onClick={() => handleAnalyzeJob(job)}
                    className={cn(
                      "p-5 rounded-xl border flex flex-col sm:flex-row justify-between gap-4 transition-all duration-300 group cursor-pointer relative text-left",
                      selectedJob?.id === job.id 
                        ? 'bg-card border-primary/40 shadow-md' 
                        : 'bg-card/45 border-border hover:border-primary/20'
                    )}
                  >
                    <div className="flex flex-col gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-semibold text-white group-hover:text-primary transition-colors leading-snug">
                            {job.title}
                          </h3>
                          <span className="text-[9px] font-bold text-cyan-400 bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-400/20 uppercase tracking-wider font-mono">
                            {job.provider}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-0.5 block">{job.company}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3.5 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                          <span>{job.location}</span>
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <DollarSign className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>{job.salary}</span>
                        </span>
                        {job.remote && (
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/5 px-2 py-0.5 rounded border border-emerald-400/20 uppercase tracking-wider">
                            Remote
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mt-1">
                        {job.skills.slice(0, 4).map((skill) => (
                          <span key={skill} className="px-2 py-0.5 rounded bg-muted/40 border border-border/40 text-[9px] text-muted-foreground">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Match rate visual badge */}
                    <div className="flex sm:flex-col justify-between items-end shrink-0 sm:text-right gap-2 sm:gap-0 select-none">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-[9.5px] font-semibold text-primary">
                        <Sparkles className="h-3 w-3 text-primary shrink-0" />
                        <span>{job.relevanceScore}% Fit</span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-auto">
                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBookmark(job.id);
                          }}
                          className={cn(
                            "p-1.5 rounded-lg border transition-all cursor-pointer",
                            isSaved 
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                              : 'bg-muted/10 border-border text-muted-foreground hover:text-white'
                          )}
                        >
                          <Bookmark className="h-3.5 w-3.5" />
                        </button>

                        {/* Tracker Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTrackingJob(job);
                            setAppStage(activeApplication?.stage || 'Applied');
                            setAppNotes(activeApplication?.notes || '');
                            setShowTrackerModal(true);
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer",
                            hasApplied 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                              : 'bg-primary border-primary text-white hover:bg-primary/95 shadow-sm'
                          )}
                        >
                          {hasApplied ? activeApplication.stage : 'Apply / Track'}
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            !isLoadingJobs && (
              <div className="p-12 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                0 opportunities matched queries. Make a new search query.
              </div>
            )
          )}
        </div>

        {/* Right Column: AI Opportunity Match Analysis & Tracker summaries (Col 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Detailed Matching Analysis Card */}
          {selectedJob && (
            <div className="rounded-xl border border-border bg-card/45 backdrop-blur-xl p-6 flex flex-col gap-5 text-left">
              
              <div className="border-b border-border/40 pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-white">Lumina Match Breakdown</h3>
                  <a href={selectedJob.applyUrl} target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-0.5 font-bold uppercase tracking-wider">
                    <span>Apply Link</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <h4 className="text-xs font-semibold text-white/90 mt-1">{selectedJob.title}</h4>
                <p className="text-[10px] text-muted-foreground">{selectedJob.company} • {selectedJob.location}</p>
              </div>

              {/* Status details */}
              {activeApp && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg p-2.5 flex items-start gap-2 text-[10.5px]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Application Status: {activeApp.stage}</span>
                    <p className="text-[9.5px] text-muted-foreground mt-0.5 leading-normal">
                      Logged: {new Date(activeApp.appliedAt).toLocaleDateString()}. Notes: {activeApp.notes || 'None'}
                    </p>
                  </div>
                </div>
              )}

              {/* API Match analysis breakdown */}
              {isAnalyzing ? (
                <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-cyan-400 animate-spin" />
                  <span>Auditing resume keywords against description...</span>
                </div>
              ) : activeAnalysis ? (
                <div className="flex flex-col gap-4 font-sans select-none">
                  
                  {/* Detailed scores */}
                  <div className="grid grid-cols-2 gap-3 bg-muted/10 p-3 rounded-lg border border-border/30">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-muted-foreground uppercase font-bold">Overall Fit</span>
                      <span className="text-xs font-bold text-white font-mono">{activeAnalysis.overallMatch}%</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-muted-foreground uppercase font-bold">Skills Match</span>
                      <span className="text-xs font-bold text-white font-mono">{activeAnalysis.skillMatch}%</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-muted-foreground uppercase font-bold">Experience Match</span>
                      <span className="text-xs font-bold text-white font-mono">{activeAnalysis.experienceMatch}%</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-muted-foreground uppercase font-bold">Prep timeline</span>
                      <span className="text-xs font-bold text-cyan-400 font-mono">{activeAnalysis.estimatedPreparationTime}</span>
                    </div>
                  </div>

                  {/* Missing Skills */}
                  {activeAnalysis.missingSkills?.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Gaps to Address:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeAnalysis.missingSkills.map((s: string) => (
                          <span key={s} className="px-2 py-0.5 rounded border border-amber-500/20 bg-amber-500/5 text-[9px] font-mono text-amber-400">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended study paths */}
                  {activeAnalysis.recommendedCourses?.length > 0 && (
                    <div className="flex flex-col gap-2 border-t border-border/40 pt-3">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Recommended Preparation:</span>
                      <ul className="flex flex-col gap-1.5">
                        {activeAnalysis.recommendedCourses.map((c: string, idx: number) => (
                          <li key={idx} className="text-[10.5px] text-white/90 leading-relaxed list-disc ml-4">
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-muted-foreground text-center py-6 leading-normal block">
                    Trigger AI audit analysis to evaluate your active resume keywords compatibility against the description.
                  </span>
                  <button
                    onClick={() => handleAnalyzeJob(selectedJob)}
                    className="w-full py-2.5 rounded-xl bg-linear-to-tr from-primary to-secondary hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-primary/10"
                  >
                    <Cpu className="h-4 w-4" />
                    <span>Run AI Compatibility check</span>
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* TRACKER / SAVE PIPELINE MODAL */}
      {showTrackerModal && trackingJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5 flex flex-col gap-4 font-sans text-left">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Track Opportunity Application</h3>
            
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Opportunity details</span>
                <h4 className="text-xs font-semibold text-white mt-0.5 leading-normal">{trackingJob.title}</h4>
                <p className="text-[10px] text-muted-foreground">{trackingJob.company} • {trackingJob.location}</p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-muted-foreground uppercase font-bold">Pipeline Stage</label>
                <select
                  value={appStage}
                  onChange={(e) => setAppStage(e.target.value as JobApplication['stage'])}
                  className="bg-muted/10 border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="Saved">Saved / Bookmark</option>
                  <option value="Applied">Applied / Sent</option>
                  <option value="OA">Online Assessment (OA)</option>
                  <option value="Interview">Interview loops</option>
                  <option value="Offer">Offer Letter</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-muted-foreground uppercase font-bold">Personal Notes & Deadlines</label>
                <textarea
                  value={appNotes}
                  onChange={(e) => setAppNotes(e.target.value)}
                  placeholder="e.g. Interview scheduled for next Monday. Studied Stripe API integration specs..."
                  rows={3}
                  className="bg-muted/10 border border-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary/50 resize-none"
                />
              </div>

              <div className="flex gap-2.5 mt-3">
                <button
                  onClick={handleSaveApplication}
                  className="flex-1 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md cursor-pointer"
                >
                  Save Log
                </button>
                <button
                  onClick={() => setShowTrackerModal(false)}
                  className="px-4 py-2 bg-muted text-muted-foreground hover:text-white text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobsView;
