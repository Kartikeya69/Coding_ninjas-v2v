'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Target, Plus, Trash2 } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { db } from '@/firebase/firestore';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';

interface Goal {
  id: string;
  title: string;
  category: 'Placement' | 'Skills' | 'Scholarship' | 'Interview';
  targetDate: string;
  progress: number; // 0 to 100
}

export const GoalTracker: React.FC = () => {
  const { profile } = useUser();
  const [goals, setGoals] = useState<Goal[]>([
    { id: 'goal_1', title: 'Prepare for Google STEP Application', category: 'Placement', targetDate: '2026-10-15', progress: 65 },
    { id: 'goal_2', title: 'Achieve 90%+ ATS resume evaluation score', category: 'Skills', targetDate: '2026-08-30', progress: 75 }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Placement' | 'Skills' | 'Scholarship' | 'Interview'>('Skills');

  const loadGoals = useCallback(async (uid: string) => {
    try {
      const snap = await getDocs(collection(db, 'users', uid, 'goals'));
      const list: Goal[] = [];
      snap.forEach(doc => {
        list.push(doc.data() as Goal);
      });
      if (list.length > 0) setGoals(list);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (profile?.uid) {
      const uid = profile.uid;
      Promise.resolve().then(() => {
        loadGoals(uid);
      });
    }
  }, [profile, loadGoals]);

  const handleAddGoal = async () => {
    if (!newTitle.trim() || !profile?.uid) return;

    const newGoal: Goal = {
      id: `goal_${Date.now()}`,
      title: newTitle,
      category: newCategory,
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 10
    };

    try {
      const docRef = doc(db, 'users', profile.uid, 'goals', newGoal.id);
      await setDoc(docRef, newGoal);
      setGoals(prev => [...prev, newGoal]);
      setNewTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!profile?.uid) return;

    try {
      const docRef = doc(db, 'users', profile.uid, 'goals', id);
      await deleteDoc(docRef);
      setGoals(prev => prev.filter(x => x.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card/45 p-5 flex flex-col gap-4 font-sans text-left select-none">
      
      {/* Header target title */}
      <div className="flex justify-between items-center border-b border-border/40 pb-3">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Target className="h-4 w-4 text-primary" />
            <span>Smart Goals Tracker</span>
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">Define career objectives audited by AI.</p>
        </div>
      </div>

      {/* Goal Items Loop */}
      <div className="flex flex-col gap-3">
        {goals.map(g => (
          <div key={g.id} className="p-3.5 rounded-lg border border-border bg-card/60 flex flex-col gap-2">
            <div className="flex justify-between items-start gap-2">
              <div>
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider block font-mono">{g.category}</span>
                <h4 className="text-[11px] font-semibold text-white mt-0.5 leading-normal">{g.title}</h4>
              </div>
              <button 
                onClick={() => handleDeleteGoal(g.id)}
                className="text-muted-foreground hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Slider progress bar */}
            <div className="flex items-center gap-3">
              <div className="h-1 flex-1 bg-muted/40 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${g.progress}%` }} />
              </div>
              <span className="text-[9.5px] font-mono text-muted-foreground font-bold">{g.progress}%</span>
            </div>
            
            <span className="text-[8.5px] text-muted-foreground">Target Completion: {g.targetDate}</span>
          </div>
        ))}
      </div>

      {/* Add New Goal quick toolbar */}
      <div className="border-t border-border/40 pt-4 flex gap-2">
        <input
          type="text"
          placeholder="New milestone, e.g. Build portfolio site..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 bg-muted/20 border border-border rounded-lg text-xs px-3 py-1.5 text-white outline-none focus:border-primary/50"
        />

        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value as Goal['category'])}
          className="bg-muted/25 border border-border rounded-lg text-[10px] text-white px-2 cursor-pointer outline-none"
        >
          <option value="Placement">Job</option>
          <option value="Skills">Skill</option>
          <option value="Scholarship">Grant</option>
          <option value="Interview">Prep</option>
        </select>

        <button
          onClick={handleAddGoal}
          className="px-3 bg-primary hover:bg-primary/95 text-white rounded-lg flex items-center justify-center cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
};
export default GoalTracker;
