'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Award, CheckCircle2, Circle, Flame, Sparkles } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { db } from '@/firebase/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface Mission {
  id: string;
  label: string;
  category: 'Resume' | 'Skills' | 'Opportunity' | 'General';
  completed: boolean;
}

export const DailyMission: React.FC = () => {
  const { profile } = useUser();
  const [streak, setStreak] = useState(3);
  const [productivityScore, setProductivityScore] = useState(85);
  const [missions, setMissions] = useState<Mission[]>([
    { id: 'miss_1', label: 'Evaluate Resume ATS Alignment Score', category: 'Resume', completed: false },
    { id: 'miss_2', label: 'Verify 3 Scholarship Deadlines or Competitions', category: 'Opportunity', completed: true },
    { id: 'miss_3', label: 'Update Roadmaps learning targets', category: 'Skills', completed: false }
  ]);

  const loadMissionState = useCallback(async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid, 'dailyMissions', 'current');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.missions) setMissions(data.missions);
        if (data.streak) setStreak(data.streak);
        if (data.productivityScore) setProductivityScore(data.productivityScore);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (profile?.uid) {
      const uid = profile.uid;
      Promise.resolve().then(() => {
        loadMissionState(uid);
      });
    }
  }, [profile, loadMissionState]);

  const toggleMission = async (id: string) => {
    const updated = missions.map(m => m.id === id ? { ...m, completed: !m.completed } : m);
    setMissions(updated);

    // Compute updated productivity score
    const completedCount = updated.filter(x => x.completed).length;
    const newScore = Math.min(Math.round((completedCount / updated.length) * 100), 100);
    setProductivityScore(newScore);

    if (profile?.uid) {
      try {
        const docRef = doc(db, 'users', profile.uid, 'dailyMissions', 'current');
        await setDoc(docRef, {
          missions: updated,
          streak,
          productivityScore: newScore,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card/45 p-5 flex flex-col gap-4 font-sans text-left select-none">
      
      {/* Header metrics */}
      <div className="flex justify-between items-center border-b border-border/40 pb-3">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Daily Missions Engine</span>
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">Complete missions to increase career score.</p>
        </div>

        {/* Streak counter */}
        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase font-mono">
          <Flame className="h-3.5 w-3.5 fill-amber-500 shrink-0" />
          <span>{streak} Day Streak</span>
        </div>
      </div>

      {/* Progress percentage bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold">
          <span>Productivity Index</span>
          <span className="text-white font-mono">{productivityScore}%</span>
        </div>
        <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-linear-to-r from-primary to-secondary transition-all duration-500" 
            style={{ width: `${productivityScore}%` }}
          />
        </div>
      </div>

      {/* Checkbox item loop */}
      <div className="flex flex-col gap-2">
        {missions.map(m => (
          <div 
            key={m.id}
            onClick={() => toggleMission(m.id)}
            className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card/40 hover:bg-card/90 transition-all cursor-pointer"
          >
            <button className="shrink-0 mt-0.5 text-muted-foreground hover:text-white transition-colors cursor-pointer">
              {m.completed ? (
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
              ) : (
                <Circle className="h-4.5 w-4.5 text-muted-foreground" />
              )}
            </button>
            <div className="flex-1">
              <span className={`text-[11px] font-medium leading-relaxed block ${m.completed ? 'line-through text-muted-foreground' : 'text-white'}`}>
                {m.label}
              </span>
              <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-wider block mt-0.5 font-mono">{m.category}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
export default DailyMission;
