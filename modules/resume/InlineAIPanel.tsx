'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, CornerDownLeft, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiEngine } from '@/lib/services/ai/engine';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/lib/logger';

interface InlineAIPanelProps {
  originalText: string;
  onApply: (newText: string) => void;
  sectionId: string;
}

export const InlineAIPanel: React.FC<InlineAIPanelProps> = ({
  originalText,
  onApply,
  sectionId
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  const handleAction = async (actionType: 'quantify' | 'technical' | 'professional' | 'shorten') => {
    if (!originalText || !user) return;
    setIsLoading(true);
    setSuggestion(null);
    setExplanation(null);

    try {
      // Execute the request via the central AI Engine
      const promptInput = JSON.stringify({
        text: originalText,
        action: actionType,
        contextSection: sectionId
      });

      const result = await aiEngine.execute({
        feature: 'career_guidance', // reuse prompt engine mappings
        userId: user.uid,
        input: `You are a resume auditor. Apply the instruction '${actionType}' on this resume bullet point: "${originalText}". Return ONLY a JSON block containing the fields "improvedText" and "explanation".`,
        options: {
          bypassCache: true
        }
      });

      if (result.success) {
        // Parse custom return payloads
        try {
          const parsed = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
          setSuggestion(parsed.improvedText || parsed.persona || 'No modification recommended.');
          setExplanation(parsed.explanation || 'Refactored to optimize recruiter scanning.');
        } catch {
          // Fallback parsing
          setSuggestion(String(result.data));
        }
      } else {
        setSuggestion('Failed to get suggestion from AI Engine.');
      }
    } catch (error) {
      logger.error('InlineAI: Refinement call failed.', { error: String(error) });
      setSuggestion('Error executing AI prompt.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative font-sans select-none text-left">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-400/5 hover:bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-md cursor-pointer transition-all"
      >
        <Sparkles className="h-3 w-3" />
        <span>Ask Lumina AI</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            className="absolute left-0 mt-1.5 z-40 w-80 bg-card border border-border rounded-xl p-3.5 shadow-xl flex flex-col gap-3"
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-[10px] font-semibold text-white uppercase tracking-wider">Inline AI assistant</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[10px] text-muted-foreground hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Quick Actions List */}
            {!suggestion && !isLoading && (
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAction('quantify')}
                  className="p-1.5 text-left rounded bg-muted/20 border border-border/50 text-[10px] text-white hover:bg-muted/40 transition-colors"
                >
                  🔢 Quantify Achievements
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('technical')}
                  className="p-1.5 text-left rounded bg-muted/20 border border-border/50 text-[10px] text-white hover:bg-muted/40 transition-colors"
                >
                  💻 Make Technical
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('professional')}
                  className="p-1.5 text-left rounded bg-muted/20 border border-border/50 text-[10px] text-white hover:bg-muted/40 transition-colors"
                >
                  👔 Executive Tone
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('shorten')}
                  className="p-1.5 text-left rounded bg-muted/20 border border-border/50 text-[10px] text-white hover:bg-muted/40 transition-colors"
                >
                  ⚡ Shorten bullet
                </button>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="py-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-cyan-400 animate-spin" />
                <span>Generating suggestion...</span>
              </div>
            )}

            {/* AI Suggestion Results Display */}
            {suggestion && !isLoading && (
              <div className="flex flex-col gap-2.5 bg-muted/15 p-3 rounded-lg border border-border/50">
                <div className="text-[10.5px] text-white/95 leading-relaxed italic">
                  &quot;{suggestion}&quot;
                </div>
                
                {explanation && (
                  <div className="flex items-start gap-1.5 text-[9.5px] text-muted-foreground border-t border-border/30 pt-2 leading-relaxed">
                    <HelpCircle className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{explanation}</span>
                  </div>
                )}

                <div className="flex gap-2 border-t border-border/30 pt-2.5 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onApply(suggestion);
                      setIsOpen(false);
                      setSuggestion(null);
                    }}
                    className="flex-1 py-1 bg-primary text-white text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CornerDownLeft className="h-3 w-3" />
                    <span>Apply Change</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuggestion(null)}
                    className="px-2.5 py-1 bg-muted text-muted-foreground hover:text-white text-[10px] font-bold rounded-lg uppercase tracking-wider cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InlineAIPanel;
