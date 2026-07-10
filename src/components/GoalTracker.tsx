import React, { useState } from "react";
import { Goal, UserProfile } from "../types";
import { CheckSquare, Calendar, Award, Plus, Trash2, CheckCircle } from "lucide-react";

interface GoalTrackerProps {
  profile: UserProfile;
  goals: Goal[];
  onToggleGoal: (id: string) => void;
  onAddGoal: (title: string, desc: string) => void;
  onDeleteGoal: (id: string) => void;
}

export default function GoalTracker({
  profile,
  goals,
  onToggleGoal,
  onAddGoal,
  onDeleteGoal,
}: GoalTrackerProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddGoal(newTitle, newDesc);
    setNewTitle("");
    setNewDesc("");
  };

  const completed = goals.filter((g) => g.completed);
  const pending = goals.filter((g) => !g.completed);

  // Daily Habits checklist
  const [habits, setHabits] = useState([
    { id: "h1", name: "Read Match Feed", completed: true },
    { id: "h2", name: "30m Mock Prep", completed: false },
    { id: "h3", name: "Review Saved Dates", completed: true },
    { id: "h4", name: "Engage Advisory Notes", completed: false },
  ]);

  const toggleHabit = (id: string) => {
    setHabits(
      habits.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  return (
    <div className="space-y-6" id="goal-tracker-root">
      {/* Title */}
      <div id="goal-title-wrapper">
        <h1 className="text-xl font-bold text-white tracking-tight" id="title-goal-tracker">Goal Tracker & Milestones</h1>
        <p className="text-xs text-gray-400" id="desc-goal-tracker">Synthesize custom milestones, maintain learning streaks, and track micro-habits</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="goal-grid">
        {/* Milestone Creator & List */}
        <div className="lg:col-span-2 space-y-6" id="goal-left-column">
          {/* Create Goal Form */}
          <div className="glass-card border border-white/5 rounded-3xl p-6 relative overflow-hidden" id="box-create-goal">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-violet/5 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-xs font-semibold text-white tracking-widest uppercase flex items-center space-x-2 mb-4 font-display z-10 relative">
              <CheckSquare className="w-4.5 h-4.5 text-brand-violet" />
              <span>Synthesize New Milestone</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 z-10 relative" id="create-goal-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="grid-create-goal-inputs">
                <input
                  type="text"
                  placeholder="Milestone title (e.g. AWS Solutions Architect Exam)"
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/25"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  id="input-goal-title"
                />
                <input
                  type="text"
                  placeholder="Target deadline or description"
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/25"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  id="input-goal-desc"
                />
              </div>

              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="px-5 py-3 bg-gradient-to-r from-brand-violet to-brand-magenta hover:opacity-90 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-lg shadow-brand-violet/25"
                id="btn-add-goal"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Add Goal</span>
              </button>
            </form>
          </div>

          {/* Goal List Panel */}
          <div className="glass-card border border-white/5 rounded-3xl p-6 space-y-4" id="box-goal-tracker-list">
            <div className="flex items-center justify-between" id="goal-tracker-list-header">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-display">Active Career Milestones</h3>
              <span className="text-[10px] text-brand-violet font-extrabold font-display" id="lbl-goal-count">{completed.length}/{goals.length} Completed</span>
            </div>

            <div className="space-y-3" id="list-goals-full">
              {goals.length === 0 ? (
                <div className="text-center py-10 text-xs text-gray-500 border border-dashed border-white/10 rounded-2xl animate-pulse" id="empty-goals-full">
                  No milestones configured. Create custom benchmarks above.
                </div>
              ) : (
                goals.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-start justify-between p-4 bg-white/5 border border-white/10 hover:border-brand-violet/20 rounded-2xl transition-all"
                    id={`goal-full-item-${g.id}`}
                  >
                    <div
                      onClick={() => onToggleGoal(g.id)}
                      className="flex items-start space-x-3 cursor-pointer flex-1"
                      id={`goal-full-clickable-${g.id}`}
                    >
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs mt-0.5 flex-shrink-0 transition-all ${
                        g.completed
                          ? "bg-brand-violet/20 border-brand-violet/40 text-brand-violet"
                          : "border-white/20 hover:border-brand-violet text-transparent"
                      }`} id={`goal-full-checkbox-${g.id}`}>
                        ✓
                      </div>
                      <div id={`goal-full-content-${g.id}`}>
                        <h4 className={`text-xs font-bold ${g.completed ? "text-gray-500 line-through" : "text-white"}`} id={`goal-full-title-${g.id}`}>{g.title}</h4>
                        <p className={`text-[11px] leading-relaxed mt-0.5 ${g.completed ? "text-gray-600 line-through" : "text-gray-400"}`} id={`goal-full-desc-${g.id}`}>{g.description}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteGoal(g.id)}
                      className="text-gray-500 hover:text-brand-coral p-1.5 rounded-lg hover:bg-brand-coral/5 transition-colors flex-shrink-0 cursor-pointer"
                      id={`btn-delete-goal-${g.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Study Habits & Streaks */}
        <div className="space-y-6" id="goal-sidebar">
          {/* Streak Indicator Box */}
          <div className="glass-card border border-brand-violet/20 rounded-3xl p-6 space-y-3.5 relative overflow-hidden" id="box-goal-streak">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-magenta/5 rounded-full blur-3xl pointer-events-none" />
            <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-widest font-display z-10 relative">CAREER PREP TRACK</span>
            <div className="flex items-center space-x-3.5 z-10 relative" id="goal-streak-meta">
              <div className="w-12 h-12 rounded-full bg-brand-magenta/10 border border-brand-magenta/20 flex items-center justify-center text-brand-magenta text-xl font-black shadow-lg shadow-brand-magenta/10 animate-pulse" id="goal-streak-value">
                {profile.streakDays}
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Continuous Practice Streak</span>
                <span className="block text-[10px] text-gray-400 leading-normal mt-0.5">Keep completing study habits to lock active scores.</span>
              </div>
            </div>
          </div>

          {/* Micro Habits Tracker */}
          <div className="glass-card border border-white/5 rounded-3xl p-6 space-y-4 relative overflow-hidden" id="box-habits-tracker">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-xs font-semibold text-white tracking-widest uppercase flex items-center space-x-2 font-display z-10 relative" id="lbl-habits">
              <Calendar className="w-4 h-4 text-brand-cyan animate-pulse" />
              <span>Daily Study Habits</span>
            </h3>

            <div className="space-y-3 z-10 relative" id="list-habits">
              {habits.map((h) => (
                <div
                  key={h.id}
                  onClick={() => toggleHabit(h.id)}
                  className="flex items-center space-x-3.5 p-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl cursor-pointer transition-all"
                  id={`habit-item-${h.id}`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] flex-shrink-0 transition-all ${
                    h.completed
                      ? "bg-brand-emerald/15 border-brand-emerald/35 text-brand-emerald"
                      : "border-white/20 text-transparent"
                  }`} id={`habit-checkbox-${h.id}`}>
                    ✓
                  </div>
                  <span className={`text-xs font-medium ${h.completed ? "text-gray-500 line-through" : "text-gray-200"}`} id={`habit-name-${h.id}`}>
                    {h.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
