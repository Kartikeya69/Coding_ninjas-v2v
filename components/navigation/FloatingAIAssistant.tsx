'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X, Send, ArrowRight, MessageSquareCode } from 'lucide-react';
import { cn } from '../../utils/cn';

export const FloatingAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-assistant', handleOpen);
    return () => window.removeEventListener('open-ai-assistant', handleOpen);
  }, []);

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', text: string }>>([
    { role: 'assistant', text: "Hello! I'm Lumina, your AI Career Coach. How can I help you accelerate your professional journey today?" }
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const userMsg = inputVal.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInputVal('');

    // Simulate mock AI typing delay
    setTimeout(() => {
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        text: `I've noted your question about "${userMsg}". Since we are in the project foundation phase, my cognitive engine is currently in standby. I'll be fully active in Phase 2!` 
      }]);
    }, 800);
  };

  const QUICK_PROMPTS = [
    'Optimize my resume for ML roles',
    'Find scholarships for women in AI',
    'Prepare for a system design interview',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[380px] h-[520px] rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden mb-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-linear-to-r from-primary/10 to-secondary/10 border-b border-border/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-linear-to-tr from-primary to-secondary flex items-center justify-center shadow-md">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">Lumina AI Coach</h3>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground">Ready to accelerate</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-muted/80 rounded-lg text-muted-foreground hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 scrollbar-thin">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={cn(
                  "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs line-height-relaxed",
                  msg.role === 'assistant' 
                    ? "bg-muted/50 text-white rounded-tl-none self-start" 
                    : "bg-primary text-white rounded-tr-none self-end"
                )}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Quick Prompts Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-col gap-1.5">
              <span className="text-[10px] text-muted-foreground font-medium">Quick Starters:</span>
              <div className="flex flex-col gap-1">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputVal(prompt);
                    }}
                    className="w-full text-left text-[10px] text-muted-foreground hover:text-white bg-muted/20 hover:bg-muted/40 border border-border/40 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 border-t border-border/80 bg-background/50">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Lumina anything..."
                className="w-full bg-card border border-border rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-muted-foreground focus:outline-hidden focus:border-primary/60 transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!inputVal.trim()}
                className="absolute right-2 p-1.5 bg-primary/90 hover:bg-primary text-white rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-primary/90"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-linear-to-tr from-primary to-secondary text-white flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer group relative"
      >
        <span className="absolute -inset-1 rounded-full bg-primary/20 blur-md group-hover:bg-primary/30 transition-all animate-pulse" />
        {isOpen ? (
          <X className="h-6 w-6 relative z-10" />
        ) : (
          <MessageSquareCode className="h-6 w-6 relative z-10 text-white animate-bounce" />
        )}
      </button>
    </div>
  );
};
export default FloatingAIAssistant;
