import React, { useState, useEffect, useRef } from "react";
import { UserProfile, MockResumeAnalysis } from "../types";
import { MessageSquare, Sparkles, Send, Brain, Award, ShieldCheck, CheckCircle, FileText, Loader2, ArrowUpRight, Zap } from "lucide-react";

interface CareerCopilotProps {
  profile: UserProfile;
}

interface Message {
  role: "user" | "copilot";
  content: string;
}

export default function CareerCopilot({ profile }: CareerCopilotProps) {
  const [activeSubTab, setActiveSubTab] = useState<"chat" | "resume" | "roadmap">("chat");

  // Chat States
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "copilot",
      content: `Hello ${profile.name}! I am your AI Career Copilot. I've synced with your targeted career path: **${profile.careerGoals.join(" or ")}**.

I'm ready to help you:
1. Conduct a **Mock Interview** practice session.
2. Formulate a custom **Weekly Study Plan**.
3. Recommend top-tier **Professional Certifications** based on your skills.

Click on any quick action chip below to get started!`,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Resume Analyzer States
  const [resumeText, setResumeText] = useState("");
  const [isResumeLoading, setIsResumeLoading] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState<MockResumeAnalysis | null>(null);

  // Roadmap States
  const [isRoadmapLoading, setIsRoadmapLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState<{
    roadmap: { phase: string; steps: string[]; duration: string }[];
    skillsToAcquire: string[];
    examsToTarget: string[];
  } | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load Roadmap on tab switch
  useEffect(() => {
    if (activeSubTab === "roadmap" && !roadmapData) {
      triggerRoadmapFetch();
    }
  }, [activeSubTab]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userProfile: profile,
        }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "copilot", content: data.text }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "copilot", content: "Error connecting to server. Please ensure the dev server is active and try again." },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleResumeAnalysis = async () => {
    if (!resumeText.trim()) return;
    setIsResumeLoading(true);

    try {
      const response = await fetch("/api/career/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          userProfile: profile,
        }),
      });
      const data = await response.json();
      setResumeAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsResumeLoading(false);
    }
  };

  const triggerRoadmapFetch = async () => {
    setIsRoadmapLoading(true);
    try {
      const response = await fetch("/api/career/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProfile: profile,
        }),
      });
      const data = await response.json();
      setRoadmapData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRoadmapLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="career-copilot-root">
      {/* Module Title */}
      <div id="copilot-title-container">
        <h1 className="text-xl font-bold text-white tracking-tight" id="title-copilot">AI Career & Prep Copilot</h1>
        <p className="text-xs text-gray-400" id="desc-copilot">Personalized resume scores, simulated technical mock interviews, and 12-week skill matrices</p>
      </div>

      {/* Internal Sub-Tab Switcher */}
      <div className="flex border-b border-white/5" id="copilot-subtabs">
        <button
          type="button"
          onClick={() => setActiveSubTab("chat")}
          className={`px-5 py-3 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeSubTab === "chat"
              ? "border-brand-violet text-brand-violet bg-brand-violet/5"
              : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
          }`}
          id="subtab-btn-chat"
        >
          <MessageSquare className="w-4 h-4 text-brand-violet" />
          <span>Interactive Prep Chat</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("resume")}
          className={`px-5 py-3 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeSubTab === "resume"
              ? "border-brand-magenta text-brand-magenta bg-brand-magenta/5"
              : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
          }`}
          id="subtab-btn-resume"
        >
          <FileText className="w-4 h-4 text-brand-magenta" />
          <span>Resume & LinkedIn Optimizer</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("roadmap")}
          className={`px-5 py-3 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeSubTab === "roadmap"
              ? "border-brand-cyan text-brand-cyan bg-brand-cyan/5"
              : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
          }`}
          id="subtab-btn-roadmap"
        >
          <Brain className="w-4 h-4 text-brand-cyan" />
          <span>Personalized Roadmap</span>
        </button>
      </div>

      {/* WORKSPACE PANELS */}
      {activeSubTab === "chat" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch" id="chat-workspace">
          {/* Chat Window Panel */}
          <div className="lg:col-span-3 glass-card border border-white/5 rounded-3xl p-6 flex flex-col h-[520px] relative overflow-hidden" id="box-chat-panel">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-violet/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin z-10" id="chat-message-scroller">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  id={`chat-msg-${idx}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-brand-violet to-brand-magenta text-white font-bold shadow-lg shadow-brand-violet/15"
                        : "bg-white/5 border border-white/10 text-gray-200"
                    }`}
                    style={{ whiteSpace: "pre-line" }}
                    id={`chat-msg-bubble-${idx}`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start" id="chat-loading-indicator">
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center space-x-2 text-xs text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-violet" />
                    <span>Lumina AI is constructing answer...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex space-x-2 mt-4 pt-4 border-t border-white/5 z-10"
              id="chat-input-form"
            >
              <input
                type="text"
                placeholder="Ask your career copilot anything..."
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/25 transition-all"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isChatLoading}
                id="input-chat-text"
              />
              <button
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="px-4 py-3 bg-gradient-to-r from-brand-violet to-brand-magenta hover:opacity-90 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center transition-opacity cursor-pointer shadow-md shadow-brand-violet/20"
                id="btn-send-chat"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Prompt presets / Mock Simulator Controls */}
          <div className="space-y-4" id="chat-sidebar">
            <div className="glass-card border border-white/5 rounded-3xl p-5 space-y-4" id="box-chat-shortcuts">
              <h3 className="text-xs font-semibold text-white tracking-widest uppercase flex items-center space-x-2" id="lbl-prep-simulators">
                <Brain className="w-4 h-4 text-brand-violet" />
                <span className="font-display">Simulators</span>
              </h3>
              
              <div className="space-y-2.5" id="preset-buttons">
                <button
                  type="button"
                  onClick={() => handleSendMessage("Let's start a behavioral Mock Interview for my profile.")}
                  className="w-full p-3.5 text-left bg-white/5 border border-white/10 hover:border-brand-violet/40 hover:bg-brand-violet/5 rounded-xl text-xs text-gray-300 transition-all flex flex-col space-y-1 group cursor-pointer"
                  id="btn-preset-mock"
                >
                  <span className="font-bold text-white group-hover:text-brand-violet transition-colors">Behavioral Mock Interview</span>
                  <span className="text-[10px] text-gray-400">Practice standard STAR answers with feedback</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMessage("Suggest an optimized LinkedIn headline based on my profile.")}
                  className="w-full p-3.5 text-left bg-white/5 border border-white/10 hover:border-brand-magenta/40 hover:bg-brand-magenta/5 rounded-xl text-xs text-gray-300 transition-all flex flex-col space-y-1 group cursor-pointer"
                  id="btn-preset-headline"
                >
                  <span className="font-bold text-white group-hover:text-brand-magenta transition-colors">LinkedIn Profile Tags</span>
                  <span className="text-[10px] text-gray-400">Generate high-impact headlines and about section</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMessage("Analyze my skill gap. Which critical tech frameworks am I missing?")}
                  className="w-full p-3.5 text-left bg-white/5 border border-white/10 hover:border-brand-cyan/40 hover:bg-brand-cyan/5 rounded-xl text-xs text-gray-300 transition-all flex flex-col space-y-1 group cursor-pointer"
                  id="btn-preset-gap"
                >
                  <span className="font-bold text-white group-hover:text-brand-cyan transition-colors">Framework Skill Gaps</span>
                  <span className="text-[10px] text-gray-400">Learn what you need to acquire to stand out</span>
                </button>
              </div>
            </div>

            {/* Quick status card */}
            <div className="p-4 bg-brand-violet/5 border border-brand-violet/10 rounded-2xl flex items-start space-x-2" id="box-copilot-compliance">
              <ShieldCheck className="w-5 h-5 text-brand-violet mt-0.5 flex-shrink-0" id="icon-shield-copilot" />
              <div id="text-compliance">
                <span className="block text-[11px] font-bold text-white">Full-Stack Guardrails</span>
                <span className="block text-[10px] text-gray-400 mt-0.5 leading-normal">Your profile parameters are securely loaded server-side for accurate, contextual interview preparation.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESUME OPTIMIZER PANEL */}
      {activeSubTab === "resume" && (
        <div className="space-y-6" id="resume-workspace">
          <div className="glass-card border border-white/5 rounded-3xl p-6 relative overflow-hidden" id="box-resume-analyzer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-magenta/5 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-sm font-semibold text-white tracking-widest uppercase flex items-center space-x-2 mb-2 font-display" id="lbl-resume-title">
              <FileText className="w-5 h-5 text-brand-magenta" id="icon-file-resume" />
              <span>Resume Strength Analyzer & ATS Tuner</span>
            </h2>
            <p className="text-xs text-gray-400 mb-4" id="desc-resume-instructions">
              Paste your raw resume text (experience, skills, contact) below. Lumina AI will score it against your targeted role (**{profile.careerGoals[0] || "Software Architect"}**) and generate missing keyword listings.
            </p>

            <textarea
              placeholder="Paste your resume text here (e.g. John Doe, Software Developer. Experience: Built React frontends...)"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-magenta focus:ring-1 focus:ring-brand-magenta/25 transition-all h-40 resize-none mb-4"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              id="textarea-resume"
            />

            <button
              type="button"
              onClick={handleResumeAnalysis}
              disabled={isResumeLoading || !resumeText.trim()}
              className="px-5 py-3 bg-gradient-to-r from-brand-violet to-brand-magenta hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-brand-magenta/15"
              id="btn-analyze-resume"
            >
              {isResumeLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Scanning Resume Syntax...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Assess Resume Fit</span>
                </>
              )}
            </button>
          </div>

          {/* Results section */}
          {resumeAnalysis && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn" id="resume-results">
              {/* Score & General feedback */}
              <div className="glass-card border border-white/5 rounded-3xl p-6 space-y-4" id="resume-results-score">
                <div className="text-center" id="resume-results-score-circle">
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">ATS MATCH SCORE</span>
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-brand-magenta bg-brand-magenta/5 text-3xl font-bold text-brand-magenta mt-3 shadow-lg shadow-brand-magenta/10" id="box-resume-score">
                    {resumeAnalysis.score}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2" id="resume-results-headline">
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Optimized Headline</span>
                  <p className="text-xs text-gray-200 bg-white/5 p-3.5 border border-white/10 rounded-xl font-medium leading-relaxed" id="val-resume-headline">
                    {resumeAnalysis.optimizedHeadline}
                  </p>
                </div>
              </div>

              {/* Keyword gaps & Detailed feedback */}
              <div className="lg:col-span-2 glass-card border border-white/5 rounded-3xl p-6 space-y-4" id="resume-results-details">
                <div className="space-y-1.5" id="resume-results-feedback">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">ATS Optimization Feedback</h3>
                  <p className="text-xs text-gray-300 leading-relaxed bg-white/5 p-4 border border-white/10 rounded-xl" id="val-resume-feedback">
                    {resumeAnalysis.feedback}
                  </p>
                </div>

                {/* Found vs Missing keywords */}
                <div className="grid grid-cols-2 gap-4" id="resume-results-keywords">
                  <div className="space-y-1.5" id="resume-keywords-found">
                    <span className="block text-[10px] text-brand-emerald font-bold uppercase tracking-wider">MATCHING KEYWORDS FOUND</span>
                    <div className="flex flex-wrap gap-1.5" id="list-resume-keywords-found">
                      {resumeAnalysis.skillsFound.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 rounded-lg text-[10px] font-medium" id={`skill-found-${idx}`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5" id="resume-keywords-missing">
                    <span className="block text-[10px] text-brand-coral font-bold uppercase tracking-wider">ATS CRITICAL GAPS</span>
                    <div className="flex flex-wrap gap-1.5" id="list-resume-keywords-missing">
                      {resumeAnalysis.skillsMissing.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-brand-coral/10 text-brand-coral border border-brand-coral/20 rounded-lg text-[10px] font-medium" id={`skill-missing-${idx}`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Behavioral Prep QA */}
                <div className="pt-4 border-t border-white/5 space-y-3" id="resume-results-prep">
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">ATS MATCHED BEHAVIORAL QUESTIONS</span>
                  <div className="space-y-3" id="list-resume-prep-questions">
                    {resumeAnalysis.interviewPrepQAs.map((qa, idx) => (
                      <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1.5" id={`qa-item-${idx}`}>
                        <h4 className="text-xs font-bold text-brand-magenta" id={`qa-question-${idx}`}>Q: {qa.question}</h4>
                        <p className="text-[11px] text-gray-300 leading-relaxed" id={`qa-answer-${idx}`}><span className="text-gray-400 font-semibold">Answer Guide: </span>{qa.answerOutline}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/*personalized ROADMAP PANEL */}
      {activeSubTab === "roadmap" && (
        <div className="space-y-6" id="roadmap-workspace">
          {isRoadmapLoading ? (
            <div className="text-center py-20 glass-card border border-white/5 rounded-3xl" id="roadmap-loading">
              <Loader2 className="w-10 h-10 animate-spin text-brand-cyan mx-auto mb-3" id="icon-roadmap-loader" />
              <p className="text-xs text-gray-400" id="desc-roadmap-loader">Lumina AI is mapping your 12-week study frameworks based on your target exams...</p>
            </div>
          ) : roadmapData ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="roadmap-results-grid">
              {/* Roadmap Phases */}
              <div className="lg:col-span-2 glass-card border border-white/5 rounded-3xl p-6 space-y-6 relative overflow-hidden" id="roadmap-results-phases">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center justify-between z-10 relative" id="roadmap-results-header">
                  <h2 className="text-sm font-semibold text-white tracking-widest uppercase flex items-center space-x-2 font-display" id="lbl-roadmap-results-title">
                    <Brain className="w-5 h-5 text-brand-cyan" id="icon-brain-roadmap" />
                    <span>Your 12-Week Prep Roadmap</span>
                  </h2>
                  <span className="text-[10px] font-bold text-gray-500" id="lbl-country-targeted">SYNCED WITH {profile.country.toUpperCase()} CURRICULUM</span>
                </div>

                <div className="space-y-6 border-l-2 border-brand-cyan/20 pl-4 ml-2 z-10 relative" id="list-roadmap-phases">
                  {roadmapData.roadmap.map((phase, idx) => (
                    <div key={idx} className="relative space-y-2" id={`phase-item-${idx}`}>
                      {/* Node point */}
                      <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 bg-brand-cyan rounded-full border-2 border-brand-bg shadow-sm shadow-brand-cyan/50" id={`phase-node-${idx}`} />
                      <div className="flex items-center space-x-2" id={`phase-meta-${idx}`}>
                        <span className="text-xs font-bold text-brand-cyan" id={`phase-duration-${idx}`}>{phase.duration}</span>
                        <span className="text-[10px] text-gray-400 font-medium" id={`phase-title-tag-${idx}`}>• {phase.phase}</span>
                      </div>
                      <div className="space-y-2" id={`phase-steps-${idx}`}>
                        {phase.steps.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start space-x-2.5 text-xs text-gray-300" id={`phase-step-${idx}-${sIdx}`}>
                            <CheckCircle className="w-4 h-4 text-brand-emerald mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar skills & Exams recommended */}
              <div className="space-y-6" id="roadmap-results-sidebar">
                {/* Certifications Card */}
                <div className="glass-card border border-white/5 rounded-3xl p-6 space-y-4" id="box-recommended-exams">
                  <h3 className="text-xs font-semibold text-white tracking-widest uppercase flex items-center space-x-2 font-display" id="lbl-recommended-exams">
                    <Award className="w-4 h-4 text-brand-cyan" id="icon-award-exams" />
                    <span>Target Certifications</span>
                  </h3>
                  <div className="space-y-2.5" id="list-recommended-exams">
                    {roadmapData.examsToTarget.map((exam, idx) => (
                      <div key={idx} className="p-3.5 bg-white/5 border border-white/10 hover:border-brand-cyan/20 rounded-xl flex items-center justify-between transition-colors" id={`exam-item-${idx}`}>
                        <span className="text-xs font-medium text-gray-200" id={`exam-title-${idx}`}>{exam}</span>
                        <Zap className="w-4 h-4 text-brand-gold flex-shrink-0" id={`exam-zap-${idx}`} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skill requirements card */}
                <div className="glass-card border border-white/5 rounded-3xl p-6 space-y-4" id="box-skills-to-acquire">
                  <h3 className="text-xs font-semibold text-white tracking-widest uppercase flex items-center space-x-2 font-display" id="lbl-skills-to-acquire">
                    <Brain className="w-4 h-4 text-brand-magenta" id="icon-brain-skills" />
                    <span>Critical Skill Deficits</span>
                  </h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed" id="desc-skills-to-acquire">
                    Lumina identified the following deficits between your core profile and requirements of competitive grants.
                  </p>
                  <div className="space-y-2.5" id="list-skills-to-acquire">
                    {roadmapData.skillsToAcquire.map((skill, idx) => (
                      <div key={idx} className="flex items-center space-x-2.5 text-xs text-gray-300" id={`skill-gap-item-${idx}`}>
                        <span className="w-1.5 h-1.5 bg-brand-coral rounded-full shadow-sm shadow-brand-coral/50" id={`skill-gap-dot-${idx}`} />
                        <span id={`skill-gap-title-${idx}`}>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 glass-card border border-white/5 rounded-3xl" id="roadmap-error">
              <p className="text-xs text-gray-400" id="desc-roadmap-error">No roadmap generated yet. Ensure your profile onboarding has finished completely.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
