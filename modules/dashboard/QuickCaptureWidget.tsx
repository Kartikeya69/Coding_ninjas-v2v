'use client';

import React, { useState } from 'react';
import { Plus, X, Sparkles, AlertCircle, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestore';
import { Button } from '@/components/buttons/Button';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/lib/logger';

export const QuickCaptureWidget: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [noteType, setNoteType] = useState<'note' | 'goal' | 'idea'>('note');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = async () => {
    if (!content.trim() || !user) return;
    setIsSaving(true);
    setSaveStatus(null);

    try {
      // Save directly to user document subcollection in Firestore
      const captureColRef = collection(db, 'users', user.uid, 'ai', 'history', 'items');
      await addDoc(captureColRef, {
        type: noteType,
        content: content.trim(),
        timestamp: new Date().toISOString(),
      });

      setSaveStatus('Saved successfully!');
      setContent('');
      setTimeout(() => {
        setSaveStatus(null);
        setIsOpen(false);
      }, 1000);
    } catch (error) {
      logger.error('QuickCapture: Failed to store quick bookmark goal.', { error: String(error) });
      setSaveStatus('Error saving capture.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-72 rounded-xl border border-border bg-card/90 backdrop-blur-2xl p-4 shadow-xl flex flex-col gap-3 font-sans"
          >
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5 text-white text-xs font-semibold">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Quick Capture Notes</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 text-muted-foreground hover:text-white rounded-lg hover:bg-muted/30 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-1.5 bg-muted/20 p-0.5 rounded-lg border border-border/30">
              {(['note', 'goal', 'idea'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setNoteType(type)}
                  className={`flex-1 text-[9px] uppercase tracking-wider font-bold py-1.5 rounded-md transition-all cursor-pointer ${
                    noteType === type ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Write down your quick ${noteType}...`}
              rows={3}
              maxLength={200}
              className="w-full text-xs rounded-lg border border-border bg-background/50 px-3 py-2 text-white outline-none focus:border-primary/50 transition-colors resize-none"
            />

            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{content.length}/200 chars</span>
              {saveStatus && (
                <span className={saveStatus.includes('Error') ? 'text-red-400' : 'text-green-400'}>
                  {saveStatus}
                </span>
              )}
            </div>

            <Button
              onClick={handleSave}
              isLoading={isSaving}
              disabled={!content.trim()}
              className="w-full text-xs font-semibold py-1.5 flex items-center justify-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Action Log</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-12 w-12 rounded-full bg-linear-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25 cursor-pointer relative group border border-white/10"
      >
        <Plus className={`h-6 w-6 text-white transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
        <span className="absolute right-14 bg-black/60 text-white text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded border border-border opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300">
          Quick Capture
        </span>
      </motion.button>
    </div>
  );
};

export default QuickCaptureWidget;
