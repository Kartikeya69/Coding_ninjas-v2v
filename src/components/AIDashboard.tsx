import React from "react";
import { motion } from "motion/react";
import { UserProfile, Opportunity, Goal, Notification } from "../types";
import { Flame, Clock, Award, Shield, CheckCircle, ArrowRight, Zap, Target, BookOpen, AlertTriangle, Sparkles } from "lucide-react";

interface AIDashboardProps {
  profile: UserProfile;
  opportunities: Opportunity[];
  goals: Goal[];
  notifications: Notification[];
  onNavigate: (tab: string) => void;
  onToggleGoal: (id: string) => void;
  onReadNotification: (id: string) => void;
}

export default function AIDashboard({
  profile,
  opportunities,
  goals,
  notifications,
  onNavigate,
  onToggleGoal,
  onReadNotification,
}: AIDashboardProps) {
  // Compute urgent deadlines (< 30 days) and sort them by score
  const matchingOpps = [...opportunities]
    .filter((o) => o.matchScore > 85)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  const pendingGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);
  const progressPercent = goals.length
    ? Math.round((completedGoals.length / goals.length) * 100)
    : 0;

  const unreadNotifs = notifications.filter((n) => !n.read);

  return (
    <div className="space-y-8 pb-12" id="dashboard-root">
      {profile.isDemo && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.5 }}
          className="bg-gradient-to-r from-brand-violet/10 via-[#0a0518] to-brand-cyan/10 border border-brand-violet/30 rounded-2xl p-5 flex items-start space-x-4 relative overflow-hidden"
          id="demo-mode-greeting-banner"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full blur-2xl pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-brand-cyan animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest bg-brand-violet/20 px-2 py-0.5 rounded-full border border-brand-violet/35">AI Copilot</span>
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Demo Sandbox Active</span>
            </div>
            <p className="text-xs text-gray-300 font-semibold italic">
              "Welcome to the Lumina-AI Demo Workspace. Feel free to explore every feature."
            </p>
          </div>
        </motion.div>
      )}

      {/* Welcome Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-950/20 via-[#0e131b] to-purple-950/20 border border-gray-800 rounded-2xl relative overflow-hidden" id="dashboard-welcome-header">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" id="welcome-glowing-bg" />
        <div className="space-y-1.5" id="welcome-text-container">
          <div className="flex items-center space-x-2 text-xs font-bold tracking-wider uppercase" id="welcome-badge">
            <Zap className="w-3.5 h-3.5 text-blue-400" id="icon-zap-badge" />
            {profile.stage === "school" ? (
              <span className="text-emerald-400">🎒 Young Scholar Active</span>
            ) : profile.stage === "college" ? (
              <span className="text-blue-400">🎓 College Student Active</span>
            ) : (
              <span className="text-purple-400">💼 Professional Active</span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight" id="welcome-title">
            Welcome back, {profile.name}!
          </h1>
          <p className="text-xs text-gray-400" id="welcome-subtitle">
            {profile.stage === "school" && "Lumina is tracking STEM competitions, youth scholarships, and career discovery roadmaps for you."}
            {profile.stage === "college" && "Lumina is tracking internship applications, scholarship checkers, resume scanning, and academic goals."}
            {(!profile.stage || profile.stage === "professional") && "Lumina is tracking job matches, career transitions, salary negotiation strategies, and leadership milestones."}
          </p>
        </div>

        {/* Global Streak & Progress Indicators */}
        <div className="flex items-center space-x-4 bg-gray-900/40 p-3 rounded-xl border border-gray-800/80" id="dashboard-streak-widget">
          <div className="flex items-center space-x-2" id="box-streak">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20" id="box-streak-icon">
              <Flame className="w-5.5 h-5.5 animate-bounce" id="icon-flame-streak" />
            </div>
            <div>
              <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider" id="lbl-streak">STREAK</span>
              <span className="text-sm font-semibold text-white" id="val-streak">{profile.streakDays} Days</span>
            </div>
          </div>

          <div className="w-px h-8 bg-gray-800" id="divider-streak" />

          <div className="flex items-center space-x-2" id="box-completion">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20" id="box-completion-icon">
              <CheckCircle className="w-5.5 h-5.5" id="icon-check-completion" />
            </div>
            <div>
              <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider" id="lbl-completion">WEEKLY PATH</span>
              <span className="text-sm font-semibold text-white" id="val-completion">{progressPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Bento-style widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="dashboard-bento-grid">
        {/* Left Column: Opportunities Match Summary */}
        <div className="lg:col-span-2 space-y-6" id="bento-left-column">
          <div className="bg-[#0e131b]/90 border border-gray-800 rounded-2xl p-6 relative" id="box-highly-matched-opps">
            <div className="flex items-center justify-between mb-4" id="header-matched-opps">
              <div className="flex items-center space-x-2" id="heading-matched-opps">
                <Award className="w-5 h-5 text-blue-400" id="icon-award-opps" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider" id="title-matched-opps">Top Recommended Matches</h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("opportunities")}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                id="btn-all-matched-opps"
              >
                <span>Explore All</span>
                <ArrowRight className="w-3.5 h-3.5" id="icon-arrow-matched-opps" />
              </button>
            </div>

            <div className="space-y-4" id="list-matched-opps">
              {matchingOpps.map((opp) => (
                <div
                  key={opp.id}
                  className="p-4 bg-[#11161d] border border-gray-800 hover:border-gray-700 rounded-xl transition-all relative group"
                  id={`matched-opp-item-${opp.id}`}
                >
                  <div className="absolute top-4 right-4 bg-blue-950/60 text-blue-400 border border-blue-900 px-2 py-0.5 rounded text-[10px] font-bold" id={`badge-score-${opp.id}`}>
                    {opp.matchScore}% Match
                  </div>

                  <div className="space-y-2 pr-16" id={`content-opp-${opp.id}`}>
                    <span className="inline-block text-[10px] uppercase font-bold text-gray-500 tracking-wider" id={`category-opp-${opp.id}`}>
                      {opp.category}
                    </span>
                    <h3 className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors" id={`title-opp-${opp.id}`}>
                      {opp.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 line-clamp-1" id={`desc-opp-${opp.id}`}>
                      {opp.description}
                    </p>
                    <div className="flex items-center space-x-4 text-[10px] text-gray-500 pt-1" id={`meta-opp-${opp.id}`}>
                      <span id={`provider-opp-${opp.id}`}>Provider: <span className="text-gray-400">{opp.provider}</span></span>
                      <span id={`amt-opp-${opp.id}`}>Funding: <span className="text-emerald-400">{opp.amount}</span></span>
                      <span className="flex items-center space-x-1" id={`deadline-opp-${opp.id}`}>
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span className="text-amber-500 font-medium">Closes {opp.deadline}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Productivity & Weekly Goals */}
          <div className="bg-[#0e131b]/90 border border-gray-800 rounded-2xl p-6" id="box-dashboard-goals">
            <div className="flex items-center justify-between mb-4" id="header-goals">
              <div className="flex items-center space-x-2" id="heading-goals">
                <Target className="w-5 h-5 text-blue-400" id="icon-target-goals" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider" id="title-goals">AI-Generated Study & Goal Planner</h2>
              </div>
              <span className="text-xs text-gray-500" id="lbl-goals-completed">{completedGoals.length}/{goals.length} Completed</span>
            </div>

            {/* Goal Progress bar */}
            <div className="w-full h-1.5 bg-gray-800 rounded-full mb-6 overflow-hidden" id="goals-progress-container">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
                id="goals-progress-bar"
              />
            </div>

            <div className="space-y-3" id="list-goals">
              {pendingGoals.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-500" id="empty-goals-msg">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  All goals completed! Request a new week's action plan from the AI Copilot.
                </div>
              ) : (
                pendingGoals.map((goal) => (
                  <div
                    key={goal.id}
                    onClick={() => onToggleGoal(goal.id)}
                    className="flex items-start space-x-3 p-3 bg-[#11161d] border border-gray-800 hover:border-gray-750 rounded-xl cursor-pointer transition-all group"
                    id={`goal-item-${goal.id}`}
                  >
                    <div className="w-4.5 h-4.5 rounded border border-gray-600 flex items-center justify-center text-transparent group-hover:border-blue-400 transition-all mt-0.5 flex-shrink-0" id={`checkbox-goal-${goal.id}`}>
                      &nbsp;
                    </div>
                    <div className="space-y-0.5" id={`content-goal-${goal.id}`}>
                      <h4 className="text-xs font-medium text-gray-200 group-hover:text-white" id={`title-goal-${goal.id}`}>{goal.title}</h4>
                      <p className="text-[10px] text-gray-500" id={`desc-goal-${goal.id}`}>{goal.description}</p>
                    </div>
                  </div>
                ))
              )}

              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => onToggleGoal(goal.id)}
                  className="flex items-start space-x-3 p-3 bg-gray-900/10 border border-gray-850 rounded-xl cursor-pointer opacity-50 hover:opacity-70 transition-all"
                  id={`goal-item-${goal.id}`}
                >
                  <div className="w-4.5 h-4.5 rounded bg-blue-900 border border-blue-800 flex items-center justify-center text-blue-300 mt-0.5 flex-shrink-0" id={`checkbox-goal-${goal.id}`}>
                    ✓
                  </div>
                  <div className="space-y-0.5" id={`content-goal-${goal.id}`}>
                    <h4 className="text-xs font-medium text-gray-400 line-through" id={`title-goal-${goal.id}`}>{goal.title}</h4>
                    <p className="text-[10px] text-gray-600 line-through" id={`desc-goal-${goal.id}`}>{goal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Notifications & Copilot Quick-Launch */}
        <div className="space-y-6" id="bento-right-column">
          {/* Quick-Launch Copilot Card */}
          <div className="bg-gradient-to-br from-[#121c2c] to-[#0e131b] border border-blue-900/30 rounded-2xl p-5 relative overflow-hidden group hover:border-blue-500/40 transition-all" id="box-copilot-launcher">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" id="copilot-launcher-glow" />
            <div className="space-y-4" id="content-copilot-launcher">
              <div className="flex items-center space-x-2" id="header-copilot-launcher">
                <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center" id="icon-copilot-launcher">
                  <Zap className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white tracking-wider uppercase" id="title-copilot-launcher">AI Career Copilot</h3>
                  <span className="text-[10px] text-gray-400 font-medium">Ready for Resume Review</span>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed" id="desc-copilot-launcher">
                Launch real-time speech mock interviews, draft target cover letters, or optimize your LinkedIn tags.
              </p>
              <button
                type="button"
                onClick={() => onNavigate("copilot")}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center space-x-1.5"
                id="btn-launch-copilot"
              >
                <span>Launch Assistant</span>
                <ArrowRight className="w-3.5 h-3.5" id="icon-arrow-launch" />
              </button>
            </div>
          </div>

          {/* Active Notifications System */}
          <div className="bg-[#0e131b]/90 border border-gray-800 rounded-2xl p-5" id="box-dashboard-notifications">
            <div className="flex items-center justify-between mb-4" id="header-notifs">
              <div className="flex items-center space-x-2" id="heading-notifs">
                <BookOpen className="w-4.5 h-4.5 text-blue-400" id="icon-book-notifs" />
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider" id="title-notifs">Opportunity Alerts</h3>
              </div>
              {unreadNotifs.length > 0 && (
                <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded-full" id="badge-unread-count">
                  {unreadNotifs.length} New
                </span>
              )}
            </div>

            <div className="space-y-3" id="list-notifs">
              {notifications.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-500" id="empty-notifs-msg">
                  No active alerts. We will notify you when new grants match your canvas.
                </div>
              ) : (
                notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => onReadNotification(n.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                      n.read
                        ? "bg-gray-900/10 border-gray-850 opacity-60"
                        : "bg-[#11161d] border-gray-800 hover:border-gray-700"
                    }`}
                    id={`notif-item-${n.id}`}
                  >
                    {!n.read && (
                      <span className="absolute top-3.5 right-3 w-1.5 h-1.5 bg-blue-500 rounded-full" id={`dot-unread-${n.id}`} />
                    )}
                    <div className="pr-4 space-y-1" id={`content-notif-${n.id}`}>
                      <div className="flex items-center space-x-1.5" id={`header-notif-item-${n.id}`}>
                        {n.type === "Deadline" && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                        <h4 className="text-[11px] font-medium text-gray-300" id={`title-notif-${n.id}`}>{n.title}</h4>
                      </div>
                      <p className="text-[10px] text-gray-500" id={`body-notif-${n.id}`}>{n.content}</p>
                      <span className="block text-[9px] text-gray-600 pt-0.5" id={`time-notif-${n.id}`}>{n.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Secure Firebase Connection Status */}
          <div className="p-3 bg-[#11161d]/80 border border-gray-800 rounded-xl flex items-center justify-between text-[10px] text-gray-500" id="box-connection-status">
            <span className="flex items-center space-x-1.5" id="lbl-conn-state">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" id="dot-conn-state" />
              <span>Offline-First Synced</span>
            </span>
            <span className="text-gray-600" id="lbl-storage-strategy">Durable localStorage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
