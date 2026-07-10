'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Bookmark,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Info,
  Layers,
  Clock
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useResumeStore } from '@/hooks/useResumeStore';
import { Opportunity } from '@/lib/services/opportunities/schemas/opportunity';
import { cn } from '@/utils/cn';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestore';

interface OpportunityApp {
  oppId: string;
  stage: 'Interested' | 'Preparing' | 'Applied' | 'Interview' | 'Accepted' | 'Rejected' | 'Archived';
  notes: string;
  updatedAt: string;
}

interface AICareerMatchResult {
  eligibilityScore: number;
  documentReadinessScore: number;
  competitionScore: number;
  successProbability: number;
  whyItMatches: string;
  checklist: { name: string; status: string }[];
  applicationStrategy: {
    BestSubmissionDate: string;
    PreparationTimeline: string;
    PriorityLevel: string;
    EstimatedHours: number;
    RiskFactors: string;
  };
}

export const ScholarshipsView: React.FC = () => {
  const { profile } = useUser();
  const { resumes, loadResumes, activeResumeId, setActiveResumeId } = useResumeStore();

  const [searchTerm, setSearchTerm] = useState('Google');
  const [oppTypeFilter, setOppTypeFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [fullyFunded, setFullyFunded] = useState(false);

  // Data state loaders
  const [opportunities, setOpportunities] = useState<(Opportunity & { relevanceScore: number })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cacheHit, setCacheHit] = useState(false);

  // Users bookmarks & workspace application pipelines
  const [savedOppIds, setSavedOppIds] = useState<string[]>([]);
  const [oppApps, setOppApps] = useState<Record<string, OpportunityApp>>({});

  // Highlight/Select Opportunity for AI audit
  const [selectedOpp, setSelectedOpp] = useState<(Opportunity & { relevanceScore: number }) | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<AICareerMatchResult | null>(null);

  // Pipeline modal
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const [trackingOpp, setTrackingOpp] = useState<Opportunity | null>(null);
  const [appStage, setAppStage] = useState<OpportunityApp['stage']>('Preparing');
  const [appNotes, setAppNotes] = useState('');

  // Opportunity Comparison Board
  const [compareList, setCompareList] = useState<(Opportunity & { relevanceScore: number })[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Workspace sub-tabs: 'feed' | 'calendar'
  const [workspaceTab, setWorkspaceTab] = useState<'feed' | 'calendar'>('feed');

  const loadUserData = useCallback(async (uid: string) => {
    try {
      const savedSnap = await getDocs(collection(db, 'users', uid, 'savedOpportunities'));
      const savedIds: string[] = [];
      savedSnap.forEach(d => savedIds.push(d.id));
      setSavedOppIds(savedIds);

      const appsSnap = await getDocs(collection(db, 'users', uid, 'opportunityApps'));
      const appMap: Record<string, OpportunityApp> = {};
      appsSnap.forEach(doc => {
        appMap[doc.id] = doc.data() as OpportunityApp;
      });
      setOppApps(appMap);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const triggerQuery = useCallback(async () => {
    setIsLoading(true);
    setOpportunities([]);
    setSelectedOpp(null);
    setActiveAnalysis(null);

    try {
      const response = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchTerm || 'Google',
          opportunityType: oppTypeFilter || undefined,
          country: countryFilter || undefined,
          fullyFunded,
          userId: profile?.uid || undefined
        })
      });

      const res = await response.json();
      if (res.success) {
        setOpportunities(res.opportunities || []);
        setCacheHit(res.cacheHit || false);
        if (res.opportunities?.length > 0) {
          setSelectedOpp(res.opportunities[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, oppTypeFilter, countryFilter, fullyFunded, profile]);

  // Initial load
  useEffect(() => {
    if (profile?.uid) {
      const uid = profile.uid;
      // Defer to prevent render-time synchronous cascading setters
      Promise.resolve().then(() => {
        loadResumes(uid);
        loadUserData(uid);
        triggerQuery();
      });
    }
  }, [profile, loadResumes, loadUserData, triggerQuery]);

  // Run AI eligibility matching
  const handleAnalyzeOpportunity = async (opp: Opportunity & { relevanceScore: number }) => {
    setSelectedOpp(opp);
    setActiveAnalysis(null);
    if (!profile?.uid) return;

    setIsAuditing(true);
    const activeResume = resumes.find(r => r.id === activeResumeId);

    try {
      const response = await fetch('/api/opportunities/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.uid,
          opportunity: opp,
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
      setIsAuditing(false);
    }
  };

  // Toggle saved opportunities
  const handleToggleSave = async (oppId: string) => {
    if (!profile?.uid) return;

    try {
      const docRef = doc(db, 'users', profile.uid, 'savedOpportunities', oppId);
      if (savedOppIds.includes(oppId)) {
        await deleteDoc(docRef);
        setSavedOppIds(prev => prev.filter(x => x !== oppId));
      } else {
        await setDoc(docRef, { oppId, savedAt: new Date().toISOString() });
        setSavedOppIds(prev => [...prev, oppId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Log application tracker pipeline status
  const handleSaveAppPipeline = async () => {
    if (!profile?.uid || !trackingOpp) return;

    try {
      const docRef = doc(db, 'users', profile.uid, 'opportunityApps', trackingOpp.id);
      const appData: OpportunityApp = {
        oppId: trackingOpp.id,
        stage: appStage,
        notes: appNotes,
        updatedAt: new Date().toISOString()
      };

      await setDoc(docRef, appData);
      setOppApps(prev => ({ ...prev, [trackingOpp.id]: appData }));
      setShowTrackerModal(false);
      setAppNotes('');
    } catch (err) {
      console.error(err);
    }
  };

  // Comparison list toggling
  const handleToggleCompare = (opp: Opportunity & { relevanceScore: number }) => {
    if (compareList.some(x => x.id === opp.id)) {
      setCompareList(prev => prev.filter(x => x.id !== opp.id));
    } else {
      if (compareList.length >= 3) return; // limit comparison to 3 opportunities
      setCompareList(prev => [...prev, opp]);
    }
  };

  // Render month calendar grid matching deadline items
  const renderCalendarMilestones = () => {
    const deadlinesList = opportunities.filter(x => x.deadline);
    return (
      <div className="rounded-xl border border-border bg-card/45 p-6 flex flex-col gap-5 text-left font-sans select-none">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Opportunity Deadline Calendar</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Upcoming deadlines */}
          <div className="bg-muted/10 border border-border/40 p-4 rounded-lg flex flex-col gap-3">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-border/40 pb-2">
              <Clock className="h-3.5 w-3.5" />
              <span>Upcoming / Approaching</span>
            </span>
            <div className="flex flex-col gap-2">
              {deadlinesList.slice(0, 3).map(opp => (
                <div key={opp.id} className="p-2.5 rounded bg-card border border-border/60">
                  <h4 className="text-[10.5px] font-semibold text-white/95">{opp.title}</h4>
                  <span className="text-[9px] text-muted-foreground block mt-0.5">Due Date: {opp.deadline}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preparing Tracker applications */}
          <div className="bg-muted/10 border border-border/40 p-4 rounded-lg flex flex-col gap-3">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-border/40 pb-2">
              <Layers className="h-3.5 w-3.5" />
              <span>Actively Preparing</span>
            </span>
            <div className="flex flex-col gap-2">
              {Object.values(oppApps).filter(x => x.stage === 'Preparing' || x.stage === 'Interested').map(app => {
                const opp = opportunities.find(o => o.id === app.oppId);
                if (!opp) return null;
                return (
                  <div key={app.oppId} className="p-2.5 rounded bg-card border border-border/60">
                    <h4 className="text-[10.5px] font-semibold text-white/95">{opp.title}</h4>
                    <span className="text-[9px] text-amber-400 block mt-0.5">Stage: {app.stage}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completed / Submitted deadlines */}
          <div className="bg-muted/10 border border-border/40 p-4 rounded-lg flex flex-col gap-3">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-border/40 pb-2">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Completed / Sent</span>
            </span>
            <div className="flex flex-col gap-2">
              {Object.values(oppApps).filter(x => x.stage === 'Applied').map(app => {
                const opp = opportunities.find(o => o.id === app.oppId);
                if (!opp) return null;
                return (
                  <div key={app.oppId} className="p-2.5 rounded bg-card border border-border/60">
                    <h4 className="text-[10.5px] font-semibold text-white/95">{opp.title}</h4>
                    <span className="text-[9px] text-emerald-400 block mt-0.5">Applied Stage Logged</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 select-none animate-in fade-in duration-300 relative text-left">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Opportunity Intelligence Explorer</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Tailored scholarships, fellowships, and innovation challenges matched using AI.</p>
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

      {/* Daily Digest panel summary counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card/40 border border-border p-4 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold">{"Today's digest matches"}</span>
          <span className="text-lg font-bold text-white font-mono">{opportunities.length}</span>
        </div>
        <div className="bg-card/40 border border-border p-4 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold">Scholarships</span>
          <span className="text-lg font-bold text-primary font-mono">
            {opportunities.filter(x => x.type === 'Scholarship').length}
          </span>
        </div>
        <div className="bg-card/40 border border-border p-4 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold">Fellowships & Hackathons</span>
          <span className="text-lg font-bold text-cyan-400 font-mono">
            {opportunities.filter(x => x.type === 'Fellowship' || x.type === 'Competition').length}
          </span>
        </div>
        <div className="bg-card/40 border border-border p-4 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold">Preparing pipeline items</span>
          <span className="text-lg font-bold text-amber-500 font-mono">
            {Object.keys(oppApps).length}
          </span>
        </div>
      </div>

      {/* Sub-tab workspace headers */}
      <div className="flex border-b border-border/40 gap-4">
        <button
          onClick={() => setWorkspaceTab('feed')}
          className={cn(
            "pb-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all",
            workspaceTab === 'feed' ? 'border-primary text-white' : 'border-transparent text-muted-foreground hover:text-white'
          )}
        >
          Opportunities Feed
        </button>
        <button
          onClick={() => setWorkspaceTab('calendar')}
          className={cn(
            "pb-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all",
            workspaceTab === 'calendar' ? 'border-primary text-white' : 'border-transparent text-muted-foreground hover:text-white'
          )}
        >
          Deadline Calendar
        </button>
      </div>

      {workspaceTab === 'calendar' ? (
        renderCalendarMilestones()
      ) : (
        <>
          {/* Advanced Search & Filtering panel */}
          <div className="flex flex-col sm:flex-row gap-3 border-b border-border/40 pb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search opportunities, organizations or programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && triggerQuery()}
                className="w-full bg-card/60 border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            <div className="relative w-full sm:w-48">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Country/Region..."
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && triggerQuery()}
                className="w-full bg-card/60 border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            <select
              value={oppTypeFilter}
              onChange={(e) => setOppTypeFilter(e.target.value)}
              className="bg-card/60 border border-border rounded-xl text-xs text-white px-3 py-2 focus:border-primary/60 outline-none cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="Scholarship">Scholarships</option>
              <option value="Fellowship">Fellowships</option>
              <option value="Grant">Grants</option>
              <option value="Competition">Competitions/Hackathons</option>
              <option value="Exchange">Exchange Programs</option>
            </select>

            <button
              onClick={() => setFullyFunded(!fullyFunded)}
              className={cn(
                "px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all",
                fullyFunded ? 'bg-primary/10 border-primary text-primary' : 'border-border text-muted-foreground hover:text-white'
              )}
            >
              Fully Funded
            </button>

            <button
              onClick={triggerQuery}
              className="px-5 py-2.5 bg-linear-to-tr from-primary to-secondary hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md shadow-primary/15"
            >
              Query Matches
            </button>
          </div>

          {/* Grid Splitting */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Feed list (Col 7) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              
              {/* Cachehit indicator */}
              {cacheHit && !isLoading && (
                <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg p-2.5 flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider font-semibold">
                  <Info className="h-3.5 w-3.5" />
                  <span>Aggregated instantly from Global Cache Hashed query.</span>
                </div>
              )}

              {/* Skeletons loaders */}
              {isLoading && (
                <div className="flex flex-col gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="h-32 bg-muted/20 rounded-xl border border-border/60 animate-pulse p-5" />
                  ))}
                </div>
              )}

              {/* Opportunities Loop */}
              {!isLoading && opportunities.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {opportunities.map((opp) => {
                    const isSaved = savedOppIds.includes(opp.id);
                    const app = oppApps[opp.id];
                    const isComparing = compareList.some(x => x.id === opp.id);

                    return (
                      <div
                        key={opp.id}
                        onClick={() => handleAnalyzeOpportunity(opp)}
                        className={cn(
                          "p-5 rounded-xl border flex flex-col sm:flex-row justify-between gap-4 transition-all duration-300 group cursor-pointer relative text-left",
                          selectedOpp?.id === opp.id 
                            ? 'bg-card border-primary/40 shadow-md' 
                            : 'bg-card/45 border-border hover:border-primary/20'
                        )}
                      >
                        <div className="flex flex-col gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs font-semibold text-white group-hover:text-primary transition-colors leading-snug">
                                {opp.title}
                              </h3>
                              <span className="text-[9px] font-bold text-cyan-400 bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-400/20 uppercase tracking-wider font-mono">
                                {opp.provider}
                              </span>
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-0.5 block">{opp.organization} • {opp.country}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3.5 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1 font-mono">
                              <DollarSign className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span>{opp.fundingAmount}</span>
                            </span>
                            <span className="flex items-center gap-1 font-mono">
                              <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                              <span>Due {opp.deadline}</span>
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-1">
                            {opp.tags.slice(0, 4).map((tag) => (
                              <span key={tag} className="px-2 py-0.5 rounded bg-muted/40 border border-border/40 text-[9px] text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Match & CTAs */}
                        <div className="flex sm:flex-col justify-between items-end shrink-0 sm:text-right gap-2 sm:gap-0">
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-[9.5px] font-semibold text-primary">
                            <Sparkles className="h-3 w-3 text-primary shrink-0" />
                            <span>{opp.relevanceScore}% Match</span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-auto">
                            
                            {/* Compare Checkbox */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleCompare(opp);
                              }}
                              className={cn(
                                "px-2 py-1.5 rounded-lg border text-[9px] font-bold uppercase transition-all cursor-pointer",
                                isComparing 
                                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                                  : 'bg-muted/10 border-border text-muted-foreground hover:text-white'
                              )}
                            >
                              Compare
                            </button>

                            {/* Bookmark */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSave(opp.id);
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

                            {/* Tracker */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setTrackingOpp(opp);
                                setAppStage(app?.stage || 'Preparing');
                                setAppNotes(app?.notes || '');
                                setShowTrackerModal(true);
                              }}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer",
                                app 
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                                  : 'bg-primary border-primary text-white hover:bg-primary/95 shadow-sm'
                              )}
                            >
                              {app ? app.stage : 'Track / Log'}
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                !isLoading && (
                  <div className="p-12 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                    No matching opportunities found. Define another query.
                  </div>
                )
              )}
            </div>

            {/* Right Column: AI Eligibility and comparisons (Col 5) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Compare toggle trigger */}
              {compareList.length > 0 && (
                <div className="bg-card/45 border border-border p-4 rounded-xl flex items-center justify-between text-left select-none">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Comparison board</span>
                    <h4 className="text-xs font-semibold text-white mt-0.5">{compareList.length} Opportunities selected</h4>
                  </div>
                  <button
                    onClick={() => setShowComparison(true)}
                    className="px-3.5 py-1.5 rounded bg-primary text-white text-[10px] font-bold uppercase cursor-pointer"
                  >
                    Open Comparison
                  </button>
                </div>
              )}

              {/* AI Details Analysis Card */}
              {selectedOpp && (
                <div className="rounded-xl border border-border bg-card/45 backdrop-blur-xl p-6 flex flex-col gap-5 text-left">
                  
                  <div className="border-b border-border/40 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded uppercase tracking-wider">
                        {selectedOpp.type}
                      </span>
                      <a href={selectedOpp.applicationLink} target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-0.5 font-bold uppercase tracking-wider">
                        <span>Official site</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <h3 className="text-xs font-bold text-white mt-1.5 leading-snug">{selectedOpp.title}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{selectedOpp.organization} • {selectedOpp.country}</p>
                  </div>

                  {/* Saved tracking pipeline state */}
                  {oppApps[selectedOpp.id] && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg p-2.5 flex items-start gap-2 text-[10.5px]">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Pipeline Stage: {oppApps[selectedOpp.id].stage}</span>
                        <p className="text-[9.5px] text-muted-foreground mt-0.5 leading-normal">
                          Notes: {oppApps[selectedOpp.id].notes || 'None'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* AI match metrics */}
                  {isAuditing ? (
                    <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                      <Sparkles className="h-5 w-5 text-cyan-400 animate-spin" />
                      <span>Auditing document vault and profile requirements...</span>
                    </div>
                  ) : activeAnalysis ? (
                    <div className="flex flex-col gap-4 font-sans select-none">
                      
                      {/* Health scoring matrix */}
                      <div className="grid grid-cols-2 gap-3 bg-muted/10 p-3 rounded-lg border border-border/30">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] text-muted-foreground uppercase font-bold">Eligibility Fit</span>
                          <span className="text-xs font-bold text-white font-mono">{activeAnalysis.eligibilityScore}%</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] text-muted-foreground uppercase font-bold">Vault Readiness</span>
                          <span className="text-xs font-bold text-white font-mono">{activeAnalysis.documentReadinessScore}%</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] text-muted-foreground uppercase font-bold">Success Odds</span>
                          <span className="text-xs font-bold text-emerald-400 font-mono">{activeAnalysis.successProbability}%</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] text-muted-foreground uppercase font-bold">Strategy Priority</span>
                          <span className="text-xs font-bold text-cyan-400 font-mono">{activeAnalysis.applicationStrategy.PriorityLevel}</span>
                        </div>
                      </div>

                      {/* Matching rationale */}
                      <div>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">AI Rationale:</span>
                        <p className="text-[11px] text-white/90 leading-relaxed">{activeAnalysis.whyItMatches}</p>
                      </div>

                      {/* AI document checklist */}
                      <div>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Vault Document Checklist:</span>
                        <div className="flex flex-col gap-1.5">
                          {activeAnalysis.checklist.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/20 border border-border/30 text-[10.5px]">
                              <span className="text-white/90">{item.name}</span>
                              <span className={cn(
                                "text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono border",
                                item.status === 'Ready' && 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
                                item.status === 'Missing' && 'bg-rose-500/10 border-rose-500/30 text-rose-400',
                                item.status === 'Warning' && 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              )}>
                                {item.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Application Strategy */}
                      <div className="border-t border-border/40 pt-3 flex flex-col gap-2">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Submission Strategy:</span>
                        <div className="flex flex-col gap-1 text-[10.5px] text-white/90 leading-relaxed">
                          <div>• <span className="text-muted-foreground">Best Submission:</span> {activeAnalysis.applicationStrategy.BestSubmissionDate}</div>
                          <div>• <span className="text-muted-foreground">Prep Hours:</span> {activeAnalysis.applicationStrategy.EstimatedHours} hours</div>
                          <div>• <span className="text-muted-foreground">Risk Factors:</span> {activeAnalysis.applicationStrategy.RiskFactors}</div>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] text-muted-foreground text-center py-6 block leading-normal">
                        Evaluate document vault checklist, success probability, and priority submission timeline strategies.
                      </span>
                      <button
                        onClick={() => handleAnalyzeOpportunity(selectedOpp)}
                        className="w-full py-2.5 rounded-xl bg-linear-to-tr from-primary to-secondary hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-primary/10"
                      >
                        <Cpu className="h-4 w-4" />
                        <span>Run AI Eligibility Check</span>
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>
        </>
      )}

      {/* TRACKER MODAL */}
      {showTrackerModal && trackingOpp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5 flex flex-col gap-4 font-sans text-left">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Log Opportunity Workspace</h3>
            
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Opportunity</span>
                <h4 className="text-xs font-semibold text-white mt-0.5 leading-normal">{trackingOpp.title}</h4>
                <p className="text-[10px] text-muted-foreground">{trackingOpp.organization} • {trackingOpp.country}</p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-muted-foreground uppercase font-bold">Pipeline Stage</label>
                <select
                  value={appStage}
                  onChange={(e) => setAppStage(e.target.value as OpportunityApp['stage'])}
                  className="bg-muted/10 border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="Interested">Interested</option>
                  <option value="Preparing">Preparing / Document Drafts</option>
                  <option value="Applied">Applied / Sent</option>
                  <option value="Interview">Interview loops</option>
                  <option value="Accepted">Accepted / Awarded 🎉</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-muted-foreground uppercase font-bold">Notes & Checklist logs</label>
                <textarea
                  value={appNotes}
                  onChange={(e) => setAppNotes(e.target.value)}
                  placeholder="e.g. Working on recommendation letters (LOR) request. Emailed professor on Friday..."
                  rows={3}
                  className="bg-muted/10 border border-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary/50 resize-none"
                />
              </div>

              <div className="flex gap-2.5 mt-3">
                <button
                  onClick={handleSaveAppPipeline}
                  className="flex-1 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md cursor-pointer"
                >
                  Save Workspace
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

      {/* COMPARISON MODAL BOARD */}
      {showComparison && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-xl border border-border bg-card p-6 flex flex-col gap-5 text-left font-sans select-none animate-in scale-in duration-200">
            <div className="flex justify-between items-center border-b border-border/40 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-primary" />
                <span>Opportunity Side-by-Side Comparison</span>
              </h3>
              <button
                onClick={() => setShowComparison(false)}
                className="text-xs text-muted-foreground hover:text-white uppercase font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse text-white">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/10 text-muted-foreground uppercase text-[9.5px]">
                    <th className="p-3">Attribute</th>
                    {compareList.map(opp => (
                      <th key={opp.id} className="p-3 font-semibold text-white/95 max-w-[200px] truncate">{opp.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  <tr>
                    <td className="p-3 font-bold text-muted-foreground">Type</td>
                    {compareList.map(opp => (
                      <td key={opp.id} className="p-3 font-semibold text-cyan-400">{opp.type}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-muted-foreground">Funding</td>
                    {compareList.map(opp => (
                      <td key={opp.id} className="p-3 font-mono text-emerald-400 font-bold">{opp.fundingAmount}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-muted-foreground">Eligibility</td>
                    {compareList.map(opp => (
                      <td key={opp.id} className="p-3 leading-relaxed max-w-[200px] truncate">{opp.eligibility}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-muted-foreground">Benefits</td>
                    {compareList.map(opp => (
                      <td key={opp.id} className="p-3 leading-relaxed max-w-[200px] truncate text-[10.5px]">{opp.benefits}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-muted-foreground">Deadline</td>
                    {compareList.map(opp => (
                      <td key={opp.id} className="p-3 font-mono">{opp.deadline}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-muted-foreground">AI Match</td>
                    {compareList.map(opp => (
                      <td key={opp.id} className="p-3 font-mono font-bold text-primary">{opp.relevanceScore}% Fit</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={() => {
                  setCompareList([]);
                  setShowComparison(false);
                }}
                className="px-4 py-2 bg-muted text-muted-foreground hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-lg cursor-pointer"
              >
                Clear Board
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ScholarshipsView;
