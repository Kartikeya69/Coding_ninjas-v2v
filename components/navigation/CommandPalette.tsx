'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Compass, Layout, Terminal, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  shortcut?: string;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Command palette options list
  const commands: CommandItem[] = [
    { id: 'nav_dash', title: 'Go to Dashboard', category: 'Navigation', shortcut: 'G D', action: () => router.push('/dashboard') },
    { id: 'nav_resume', title: 'Go to Resume Studio', category: 'Navigation', shortcut: 'G R', action: () => router.push('/resume') },
    { id: 'nav_jobs', title: 'Go to Career Hub', category: 'Navigation', shortcut: 'G J', action: () => router.push('/jobs') },
    { id: 'nav_scholarships', title: 'Go to Opportunity Explorer', category: 'Navigation', shortcut: 'G S', action: () => router.push('/scholarships') },
    { id: 'nav_mentors', title: 'Go to Mentors Hub', category: 'Navigation', shortcut: 'G M', action: () => router.push('/mentors') },
    { id: 'nav_settings', title: 'Go to Settings', category: 'Navigation', shortcut: 'G P', action: () => router.push('/settings') },
    { id: 'act_theme', title: 'Toggle High Contrast', category: 'Quick Action', shortcut: 'T H', action: () => {
      document.documentElement.classList.toggle('high-contrast');
    } },
    { id: 'act_coach', title: 'Open AI Career Coach Side Drawer', category: 'AI Assistant', shortcut: 'O C', action: () => {
      const btn = document.getElementById('ai-coach-trigger');
      if (btn) btn.click();
    } }
  ];

  // Filter based on fuzzy text matching
  const filtered = commands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  // Toggle open shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle input focus
  useEffect(() => {
    if (isOpen) {
      Promise.resolve().then(() => {
        setQuery('');
        setSelectedIndex(0);
      });
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelect = useCallback((item: CommandItem) => {
    item.action();
    setIsOpen(false);
  }, []);

  const handleArrowKeys = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    }
  }, [filtered, selectedIndex, handleSelect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-[15vh]">
      <div 
        className="w-full max-w-xl rounded-xl border border-border bg-card p-4 flex flex-col gap-3 font-sans shadow-2xl text-left select-none"
        onKeyDown={handleArrowKeys}
      >
        {/* Search header bar */}
        <div className="flex items-center gap-2 border-b border-border/40 pb-3">
          <Search className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search pathways..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm text-white placeholder-muted-foreground border-none outline-none focus:ring-0"
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-white transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results grid list */}
        <div className="max-h-[300px] overflow-y-auto flex flex-col gap-1 pr-1">
          {filtered.length > 0 ? (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "p-3 rounded-lg flex items-center justify-between transition-all cursor-pointer",
                    isSelected ? 'bg-primary/25 border border-primary/20' : 'bg-transparent hover:bg-muted/15'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.category === 'Navigation' && <Compass className="h-4 w-4 text-cyan-400" />}
                    {item.category === 'Quick Action' && <Terminal className="h-4 w-4 text-emerald-400" />}
                    {item.category === 'AI Assistant' && <Layout className="h-4 w-4 text-primary" />}
                    
                    <div>
                      <span className="text-xs font-semibold text-white/95">{item.title}</span>
                      <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-wider mt-0.5">{item.category}</span>
                    </div>
                  </div>

                  {item.shortcut && (
                    <kbd className="px-2 py-0.5 rounded bg-muted/60 border border-border text-[9.5px] font-mono text-muted-foreground">
                      {item.shortcut}
                    </kbd>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-xs text-muted-foreground">
              {"No command paths match your keyword search. Try 'Dashboard'."}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="border-t border-border/40 pt-3 flex justify-between items-center text-[10px] text-muted-foreground">
          <div className="flex gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>ctrl + k to close</span>
        </div>

      </div>
    </div>
  );
};
export default CommandPalette;
