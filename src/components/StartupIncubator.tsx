import React, { useState } from "react";
import { UserProfile, StartupIdea } from "../types";
import { Lightbulb, Rocket, ShieldCheck, Cpu, Layout, Award, DollarSign, Loader2, PlayCircle, CheckCircle2 } from "lucide-react";

interface StartupIncubatorProps {
  profile: UserProfile;
  startups: StartupIdea[];
  onAddStartup: (startup: StartupIdea) => void;
}

export default function StartupIncubator({ profile, startups, onAddStartup }: StartupIncubatorProps) {
  const [ideaName, setIdeaName] = useState("");
  const [ideaDesc, setIdeaDesc] = useState(profile.startupIdea || "");
  const [isLoading, setIsLoading] = useState(false);
  const [activeStartup, setActiveStartup] = useState<StartupIdea | null>(startups[0] || null);

  const handleValidateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaDesc.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/startup/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: ideaName || "My Innovator Project",
          description: ideaDesc,
          userProfile: profile,
        }),
      });
      const data = await response.json();

      const newStartup: StartupIdea = {
        id: `startup-${Date.now()}`,
        name: ideaName || "My Innovator Project",
        description: ideaDesc,
        validationStatus: "Completed",
        readinessScore: data.readinessScore,
        marketAnalysis: data.marketAnalysis,
        feedback: data.feedback,
        canvas: data.canvas,
        grantDiscovery: data.grantDiscovery,
        actionPlan: data.actionPlan,
      };

      onAddStartup(newStartup);
      setActiveStartup(newStartup);
      setIdeaName("");
      setIdeaDesc("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="incubator-root">
      {/* Title */}
      <div id="incubator-title-wrapper">
        <h1 className="text-xl font-bold text-white tracking-tight" id="title-incubator">AI Startup Incubator & Lean Canvas</h1>
        <p className="text-xs text-gray-400" id="desc-incubator">Draft comprehensive market analysis, generate complete Business Model Canvases, and evaluate investor readiness scores using Gemini</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="incubator-grid">
        {/* Left Columns: Validation form & existing ideas */}
        <div className="space-y-6" id="incubator-left-column">
          {/* Validator Form */}
          <div className="glass-card border border-white/5 rounded-3xl p-6 space-y-5 relative overflow-hidden" id="box-validator-form">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-violet/5 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-xs font-semibold text-white tracking-widest uppercase flex items-center space-x-2 font-display z-10 relative" id="lbl-validator-header">
              <Rocket className="w-4.5 h-4.5 text-brand-violet animate-pulse" />
              <span>Validate Concept</span>
            </h3>

            <form onSubmit={handleValidateIdea} className="space-y-4 z-10 relative" id="startup-validator-form">
              <div>
                <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Concept Name</label>
                <input
                  type="text"
                  placeholder="e.g. Lumina AI"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/25"
                  value={ideaName}
                  onChange={(e) => setIdeaName(e.target.value)}
                  id="input-startup-name"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Elevator Pitch / Description</label>
                <textarea
                  placeholder="Describe the problem, target audience, and solution framework..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/25 h-28 resize-none"
                  value={ideaDesc}
                  onChange={(e) => setIdeaDesc(e.target.value)}
                  id="textarea-startup-desc"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !ideaDesc.trim()}
                className="w-full py-3 bg-gradient-to-r from-brand-violet to-brand-magenta hover:opacity-90 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-lg shadow-brand-violet/25"
                id="btn-validate-startup"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Orchestrating Market Canvas...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4 text-white animate-pulse" />
                    <span>Run AI Canvas Assessment</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* List of existing concepts */}
          {startups.length > 0 && (
            <div className="glass-card border border-white/5 rounded-3xl p-6 space-y-4" id="box-saved-concepts">
              <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest font-display">SAVED STARTUP PORTFOLIO</span>
              <div className="space-y-2.5" id="list-concepts">
                {startups.map((startup) => (
                  <div
                    key={startup.id}
                    onClick={() => setActiveStartup(startup)}
                    className={`p-3.5 border rounded-2xl cursor-pointer transition-all ${
                      activeStartup?.id === startup.id
                        ? "bg-brand-violet/10 border-brand-violet/30"
                        : "bg-white/5 border-white/10 hover:border-white/15"
                    }`}
                    id={`concept-item-${startup.id}`}
                  >
                    <div className="flex justify-between items-center" id={`concept-header-${startup.id}`}>
                      <h4 className="text-xs font-bold text-white">{startup.name}</h4>
                      <span className="text-[10px] font-extrabold text-brand-violet" id={`concept-score-${startup.id}`}>{startup.readinessScore}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Columns: Live Canvas Workspace */}
        <div className="lg:col-span-2 space-y-6" id="incubator-right-column">
          {activeStartup ? (
            <div className="space-y-6 animate-fadeIn" id="incubator-results-panel">
              {/* Readiness assessment and market review */}
              <div className="glass-card border border-white/5 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative overflow-hidden" id="startup-readiness-panel">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-violet/5 rounded-full blur-3xl pointer-events-none" />
                <div className="text-center md:border-r md:border-white/5 md:pr-4 flex flex-col justify-center items-center z-10 relative" id="box-readiness-gauge">
                  <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider">INVESTOR READINESS</span>
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-brand-violet bg-brand-violet/5 text-2xl font-black text-brand-violet mt-3.5 shadow-lg shadow-brand-violet/10 animate-pulse" id="val-readiness-gauge">
                    {activeStartup.readinessScore}%
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3 z-10 relative" id="startup-market-review">
                  <div>
                    <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider">AI MARKET SIZING ASSESSMENT</span>
                    <p className="text-xs text-gray-300 leading-relaxed bg-white/5 p-4 border border-white/10 rounded-2xl mt-2" id="val-market-analysis">
                      {activeStartup.marketAnalysis}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pitch feedback & action roadmap */}
              <div className="glass-card border border-white/5 rounded-3xl p-6 space-y-4" id="startup-action-milestones">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-display">AI Feedback & Accelerated 30-Day Launch Roadmap</h3>
                
                <div className="p-4 bg-brand-violet/5 border border-brand-violet/10 text-xs text-brand-violet/90 rounded-2xl font-medium leading-relaxed" id="val-startup-feedback">
                  {activeStartup.feedback}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2" id="grid-startup-roadmaps">
                  {/* Accelerate action plan */}
                  <div className="space-y-3.5" id="startup-launch-plan">
                    <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider font-display">LAUNCH MILESTONES</span>
                    <div className="space-y-2.5" id="list-launch-milestones">
                      {activeStartup.actionPlan.map((action, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs text-gray-300 leading-normal" id={`milestone-${idx}`}>
                          <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0 mt-0.5" />
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Grants discovered */}
                  <div className="space-y-3.5" id="startup-discovered-grants">
                    <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider font-display">DISCOVERED ACCELERATORS & GRANTS</span>
                    <div className="space-y-2.5" id="list-discovered-grants">
                      {activeStartup.grantDiscovery.map((grant, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs text-gray-300 leading-normal" id={`grant-${idx}`}>
                          <Award className="w-4 h-4 text-brand-cyan flex-shrink-0 mt-0.5" />
                          <span>{grant}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Complete Lean Business Canvas Matrix */}
              {activeStartup.canvas && (
                <div className="glass-card border border-white/5 rounded-3xl p-6 space-y-5" id="startup-lean-canvas">
                  <h3 className="text-xs font-semibold text-white tracking-widest uppercase flex items-center space-x-2 font-display" id="lbl-lean-canvas">
                    <Layout className="w-4.5 h-4.5 text-brand-violet" />
                    <span>Lumina AI Lean Business Model Canvas</span>
                  </h3>

                  {/* Canvas Grid - Notion/Linear bento layout */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="canvas-grid-matrix">
                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2 hover:border-white/15 transition-all" id="canvas-problem">
                      <span className="block text-[9px] font-bold text-brand-cyan uppercase tracking-wider font-display">1. Problem</span>
                      <p className="text-xs text-gray-300 leading-relaxed" id="val-canvas-problem">{activeStartup.canvas.problem}</p>
                    </div>

                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2 hover:border-white/15 transition-all" id="canvas-solution">
                      <span className="block text-[9px] font-bold text-brand-cyan uppercase tracking-wider font-display">2. Solution</span>
                      <p className="text-xs text-gray-300 leading-relaxed" id="val-canvas-solution">{activeStartup.canvas.solution}</p>
                    </div>

                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2 hover:border-white/15 transition-all" id="canvas-unique-value">
                      <span className="block text-[9px] font-bold text-brand-magenta uppercase tracking-wider font-display">3. Unique Value Proposition</span>
                      <p className="text-xs text-gray-300 leading-relaxed" id="val-canvas-uvp">{activeStartup.canvas.uniqueValue}</p>
                    </div>

                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2 hover:border-white/15 transition-all" id="canvas-customer-segments">
                      <span className="block text-[9px] font-bold text-brand-cyan uppercase tracking-wider font-display">4. Customer Segments</span>
                      <p className="text-xs text-gray-300 leading-relaxed" id="val-canvas-segments">{activeStartup.canvas.customerSegments}</p>
                    </div>

                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2 hover:border-white/15 transition-all" id="canvas-channels">
                      <span className="block text-[9px] font-bold text-brand-cyan uppercase tracking-wider font-display">5. Channels</span>
                      <p className="text-xs text-gray-300 leading-relaxed" id="val-canvas-channels">{activeStartup.canvas.channels}</p>
                    </div>

                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2 hover:border-white/15 transition-all" id="canvas-unfair-advantage">
                      <span className="block text-[9px] font-bold text-brand-magenta uppercase tracking-wider font-display">6. Unfair Advantage</span>
                      <p className="text-xs text-gray-300 leading-relaxed" id="val-canvas-advantage">{activeStartup.canvas.unfairAdvantage}</p>
                    </div>

                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4" id="canvas-costs-revenues-row">
                      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2 hover:border-white/15 transition-all" id="canvas-key-metrics">
                        <span className="block text-[9px] font-bold text-brand-emerald uppercase tracking-wider font-display">7. Key Metrics</span>
                        <p className="text-xs text-gray-300 leading-relaxed" id="val-canvas-metrics">{activeStartup.canvas.keyMetrics}</p>
                      </div>

                      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2 hover:border-white/15 transition-all" id="canvas-cost-structure">
                        <span className="block text-[9px] font-bold text-brand-gold uppercase tracking-wider font-display">8. Cost Structure</span>
                        <p className="text-xs text-gray-300 leading-relaxed" id="val-canvas-costs">{activeStartup.canvas.costStructure}</p>
                      </div>

                      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2 hover:border-white/15 transition-all" id="canvas-revenue-streams">
                        <span className="block text-[9px] font-bold text-brand-emerald uppercase tracking-wider font-display">9. Revenue Streams</span>
                        <p className="text-xs text-gray-300 leading-relaxed" id="val-canvas-revenues">{activeStartup.canvas.revenueStreams}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 glass-card border border-white/5 rounded-3xl flex flex-col justify-center items-center" id="incubator-idle">
              <Lightbulb className="w-12 h-12 text-gray-600 mb-4 animate-pulse" />
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed">No validation data loaded yet. Describe your startup or MVP concept in the panel to populate your canvas matrix.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
