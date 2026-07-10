'use client';

import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { AIResumeReview, ScoreHistoryItem } from '@/hooks/useResumeStore';

interface ATSReportWidgetProps {
  analysis: AIResumeReview | null;
  scoreHistory?: ScoreHistoryItem[];
}

export const ATSReportWidget: React.FC<ATSReportWidgetProps> = ({
  analysis,
  scoreHistory = []
}) => {
  // Fallbacks if no audit has been triggered yet
  const score = analysis ? analysis.matchScore : 60;
  const strengths = analysis?.strengths || ['Details and social contact information correctly formatted.'];
  const gaps = analysis?.gaps || ['Consider quantifying your software engineer project details.'];
  const keywords = analysis?.keywordGaps || ['TypeScript', 'Next.js', 'Firestore', 'Tailwind'];
  const actions = analysis?.actionItems || ['Add metrics to experience bullets', 'Audit skills keywords density'];

  return (
    <div className="flex flex-col gap-6 font-sans select-none text-left">
      
      {/* 1. Score Summary Chart */}
      <div className="flex flex-col gap-2 p-4.5 rounded-xl border border-primary/20 bg-primary/5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-white">AI ATS compatibility Score</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">Scanned against target career benchmarks</p>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="h-4.5 w-4.5 text-primary" />
            <span className="text-sm font-bold text-white font-mono">{score}/100</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-muted/20 rounded-full overflow-hidden mt-1 border border-border/20">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500" 
            style={{ width: `${score}%` }} 
          />
        </div>
      </div>

      {/* 2. ATS Score History Timeline */}
      {scoreHistory.length > 1 && (
        <div className="flex flex-col gap-2 p-4 rounded-xl border border-border/60 bg-muted/5">
          <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
            <TrendingUp className="h-4 w-4" />
            <span>ATS Improvement History</span>
          </div>
          
          <div className="flex justify-between items-center gap-4 mt-2 px-2 relative">
            <div className="absolute left-6 right-6 top-1/2 h-0.5 bg-border/40 -translate-y-1/2 z-0" />
            {scoreHistory.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 z-10">
                <div className="h-6 w-6 rounded-full bg-card border border-primary/40 flex items-center justify-center text-[10px] font-bold text-white font-mono">
                  {item.score}
                </div>
                <span className="text-[8px] text-muted-foreground">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Keyword Gaps */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Missing Keywords & Skills:</span>
        <div className="flex flex-wrap gap-1.5">
          {keywords.length > 0 ? (
            keywords.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded border border-amber-500/20 bg-amber-500/5 text-[9.5px] font-mono text-amber-400">
                {tag}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-muted-foreground">0 keyword gaps detected. Excellent coverage!</span>
          )}
        </div>
      </div>

      {/* 4. Action items lists */}
      <div className="flex flex-col gap-3 border-t border-border/40 pt-4">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Recommended Improvements:</span>
        <div className="flex flex-col gap-3">
          {actions.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[11px] text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{item}</p>
            </div>
          ))}
          {strengths.slice(0, 1).map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[11px] text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-white/90">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formatting feedback */}
      {analysis?.formattingCritique && (
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-2.5 flex items-start gap-2 mt-1">
          <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
          <span className="text-[10px] text-muted-foreground leading-normal text-left">
            <strong>Layout Critique:</strong> {analysis.formattingCritique}
          </span>
        </div>
      )}

    </div>
  );
};

export default ATSReportWidget;
