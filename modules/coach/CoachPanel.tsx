'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  X, 
  Send, 
  Cpu, 
  ListTodo, 
  Target, 
  Activity 
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { DailyMission } from './DailyMission';
import { GoalTracker } from './GoalTracker';
import { cn } from '@/utils/cn';

interface ChatMessage {
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

export const CoachPanel: React.FC = () => {
  const { profile } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  
  // Drawer tabs: 'chat' | 'missions' | 'goals'
  const [coachTab, setCoachTab] = useState<'chat' | 'missions' | 'goals'>('chat');
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'coach',
      text: 'Hello! I am your Lumina Career Coach. I can help evaluate your resume draft, match scholarships, or structure preparation timelines. What would you like to build today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend || inputVal;
    if (!rawText.trim() || !profile?.uid) return;

    if (!textToSend) setInputVal('');

    const userMsg: ChatMessage = {
      sender: 'user',
      text: rawText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.uid,
          message: rawText
        })
      });

      const res = await response.json();
      if (res.success && res.data) {
        setMessages(prev => [...prev, {
          sender: 'coach',
          text: res.data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error('Analysis run failed');
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'coach',
        text: 'I ran into an issue connecting to the AI brain. Let me check the registry adapters.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* GLOBAL TRIGGER FLOATING BADGE */}
      <button
        id="ai-coach-trigger"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-linear-to-tr from-primary to-secondary text-white rounded-full shadow-lg shadow-primary/25 cursor-pointer hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-primary/20 group"
      >
        <Sparkles className="h-5.5 w-5.5 animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out font-bold text-xs uppercase tracking-wider ml-0 font-sans group-hover:ml-2">
          Lumina Coach
        </span>
      </button>

      {/* FLOATING SIDE PANEL DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          
          <div className="w-full max-w-md bg-card border-l border-border h-full flex flex-col shadow-2xl relative select-none font-sans text-left">
            
            {/* Header toolbar */}
            <div className="p-4 border-b border-border/40 flex justify-between items-center bg-muted/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/25 text-primary">
                  <Cpu className="h-4.5 w-4.5 shrink-0" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Career Coach</h3>
                  <span className="text-[9px] text-muted-foreground">Always-available career mentor</span>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-white p-1 rounded-lg hover:bg-muted/30 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sub-tab navigation selectors */}
            <div className="flex border-b border-border/40 text-xs font-semibold bg-muted/5">
              <button
                onClick={() => setCoachTab('chat')}
                className={cn(
                  "flex-1 py-3 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider text-[9.5px]",
                  coachTab === 'chat' ? 'border-primary text-white font-bold' : 'border-transparent text-muted-foreground hover:text-white'
                )}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Coach Chat</span>
              </button>
              
              <button
                onClick={() => setCoachTab('missions')}
                className={cn(
                  "flex-1 py-3 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider text-[9.5px]",
                  coachTab === 'missions' ? 'border-primary text-white font-bold' : 'border-transparent text-muted-foreground hover:text-white'
                )}
              >
                <ListTodo className="h-3.5 w-3.5" />
                <span>Missions</span>
              </button>

              <button
                onClick={() => setCoachTab('goals')}
                className={cn(
                  "flex-1 py-3 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider text-[9.5px]",
                  coachTab === 'goals' ? 'border-primary text-white font-bold' : 'border-transparent text-muted-foreground hover:text-white'
                )}
              >
                <Target className="h-3.5 w-3.5" />
                <span>Goals</span>
              </button>
            </div>

            {/* Scrollable contents panel */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              
              {coachTab === 'missions' && <DailyMission />}

              {coachTab === 'goals' && <GoalTracker />}

              {coachTab === 'chat' && (
                <div className="flex flex-col gap-3.5 flex-1 min-h-0">
                  
                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto flex flex-col gap-3.5 pr-1">
                    {messages.map((m, i) => {
                      const isUser = m.sender === 'user';
                      return (
                        <div 
                          key={i} 
                          className={cn(
                            "flex flex-col max-w-[85%] rounded-xl p-3 border text-xs leading-relaxed",
                            isUser 
                              ? 'bg-primary/10 border-primary/20 self-end text-white text-right' 
                              : 'bg-muted/20 border-border/40 self-start text-white/95'
                          )}
                        >
                          <p>{m.text}</p>
                          <span className="text-[8px] text-muted-foreground block mt-1.5 uppercase font-mono tracking-wider">
                            {m.timestamp}
                          </span>
                        </div>
                      );
                    })}

                    {isLoading && (
                      <div className="p-3 bg-muted/20 border border-border/40 rounded-xl self-start max-w-[85%] text-xs text-muted-foreground flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
                        <span>Formulating career recommendations...</span>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>

                  {/* Suggested chip quick-replies */}
                  <div className="flex flex-wrap gap-1.5 border-t border-border/30 pt-3">
                    {[
                      'What should I do today?',
                      'Review my resume score',
                      'Find scholarships'
                    ].map(chip => (
                      <button
                        key={chip}
                        onClick={() => handleSendMessage(chip)}
                        className="px-2.5 py-1.5 rounded-lg bg-card hover:bg-muted border border-border text-[9.5px] font-semibold text-white/90 hover:text-white transition-all cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {/* Input form */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask coach, e.g. How close am I to Google STEP?"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 bg-muted/15 border border-border rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary/50 placeholder-muted-foreground"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      className="p-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      )}
    </>
  );
};
export default CoachPanel;
