import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Award, 
  Brain, 
  Briefcase, 
  Users, 
  Rocket, 
  DollarSign, 
  Target, 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  ChevronRight, 
  Quote, 
  HelpCircle,
  TrendingUp,
  FileCheck,
  Percent,
  Compass
} from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
  onExplore: () => void;
}

export default function LandingPage({ onStart, onExplore }: LandingPageProps) {
  // Timeline/Boot states: "initial" (0-0.5s) | "logoReveal" (0.5-2s) | "bootSequence" (2-3.5s) | "transitioning" (3.5-4.5s) | "ready" (4.5s+)
  const [timeline, setTimeline] = useState<"initial" | "logoReveal" | "bootSequence" | "transitioning" | "ready">(() => {
    // Check session storage to avoid repeating full boot sequence in the same session if they navigate back
    const visited = sessionStorage.getItem("lumina_booted");
    return visited ? "ready" : "initial";
  });

  const [bootMessageIndex, setBootMessageIndex] = useState(0);
  const [typedMessage, setTypedMessage] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const bootMessages = [
    "✓ Initializing Lumina Intelligence...",
    "✓ Loading Career Intelligence...",
    "✓ Connecting AI Models...",
    "✓ Personalizing Experience...",
    "✓ Ready."
  ];

  // Mouse radial light effect tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Boot Timeline sequence
  useEffect(() => {
    if (timeline === "ready") return;

    if (timeline === "initial") {
      const t = setTimeout(() => {
        setTimeline("logoReveal");
      }, 500);
      return () => clearTimeout(t);
    }

    if (timeline === "logoReveal") {
      const t = setTimeout(() => {
        setTimeline("bootSequence");
      }, 2000);
      return () => clearTimeout(t);
    }

    if (timeline === "bootSequence") {
      // Type writer for each boot message
      let msgIdx = 0;
      let charIdx = 0;
      let interval: NodeJS.Timeout;

      const typeNextMessage = () => {
        if (msgIdx >= bootMessages.length) {
          setTimeline("transitioning");
          sessionStorage.setItem("lumina_booted", "true");
          return;
        }
        setBootMessageIndex(msgIdx);
        charIdx = 0;
        setTypedMessage("");

        interval = setInterval(() => {
          setTypedMessage((prev) => prev + bootMessages[msgIdx].charAt(charIdx));
          charIdx++;
          if (charIdx >= bootMessages[msgIdx].length) {
            clearInterval(interval);
            setTimeout(() => {
              msgIdx++;
              typeNextMessage();
            }, 350);
          }
        }, 20);
      };

      typeNextMessage();
      return () => clearInterval(interval);
    }

    if (timeline === "transitioning") {
      const t = setTimeout(() => {
        setTimeline("ready");
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [timeline]);

  // Skip Intro Helper
  const handleSkipIntro = () => {
    setTimeline("ready");
    sessionStorage.setItem("lumina_booted", "true");
  };

  // Stats
  const stats = [
    { label: "Women Empowered", value: "85,000+" },
    { label: "Average Salary Boost", value: "32%" },
    { label: "Matches Generated", value: "1.2M+" },
    { label: "Partner Companies", value: "450+" }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Sophia Martinez",
      role: "Lead Machine Learning Architect at Stripe",
      content: "Lumina-AI completely transformed my approach to negotiating my salary. The AI coach guided me line-by-line, resulting in a 40% compensation bump.",
      avatar: "SM"
    },
    {
      name: "Dr. Elena Rostov",
      role: "Research Director at Stanford Academic Labs",
      content: "The Opportunity Engine found three major research grants I didn't even know existed. For young women in academic research, this is an invaluable asset.",
      avatar: "ER"
    },
    {
      name: "Anya K.",
      role: "Founder at BloomTech (YC W24)",
      content: "As a student starting an AI-driven logistics tool, the Startup Incubator Lean Canvas generator gave me YC-quality investor feedback in seconds.",
      avatar: "AK"
    }
  ];

  // FAQ
  const faqs = [
    {
      q: "Who is Lumina-AI built for?",
      a: "Lumina-AI is custom-calibrated for female-identifying high school students (scholars), university undergraduates, and working professionals pursuing growth in STEM, corporate leadership, and innovative entrepreneurship."
    },
    {
      q: "How does the adaptive life-stage engine work?",
      a: "Upon onboarding, Lumina's AI automatically groups your journey into School, College, or Professional. It disables non-applicable questions (like experience requirements for 15-year-olds) and unlocks target-specific tabs (like Financial Planning and Promotion strategies for professionals)."
    },
    {
      q: "Can I use Lumina to prepare for startup funding?",
      a: "Yes! Our Startup Incubator utilizes the Gemini API to analyze your startup concept, calculate a market readiness score, write a standard Lean Business Canvas, and suggest eligible female-founder grants."
    }
  ];

  // Glowing drifting background particles
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 12 + 10,
    delay: Math.random() * -15
  }));

  return (
    <div className="min-h-screen bg-brand-bg text-white font-sans overflow-x-hidden selection:bg-brand-violet/30 selection:text-white relative" id="landing-container">
      {/* Absolute Noise and Radial Cursor Tracker */}
      <div className="absolute inset-0 bg-[radial-gradient(600px_at_var(--x,_0px)_var(--y,_0px),rgba(139,92,255,0.06),transparent_80%)] pointer-events-none z-10" style={{ "--x": `${mousePosition.x}px`, "--y": `${mousePosition.y}px` } as React.CSSProperties} />
      <div className="absolute inset-0 bg-noise opacity-[0.015] pointer-events-none mix-blend-overlay z-10" />

      {/* Floating Neon Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-brand-violet/20"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -120, 0],
              x: [0, Math.sin(p.id) * 35, 0],
              opacity: [0.15, 0.5, 0.15],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* 1. CINEMATIC STARTUP BOOT OVERLAY */}
      <AnimatePresence>
        {timeline !== "ready" && timeline !== "transitioning" && (
          <motion.div
            key="cinematic-intro"
            className="fixed inset-0 bg-[#050505] z-[999] flex flex-col items-center justify-center overflow-hidden"
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            id="cinematic-boot-overlay"
          >
            {/* Ambient Aurora mesh background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-violet/10 via-[#050505] to-brand-cyan/10 opacity-70" />
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-violet/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-cyan/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />

            {/* Skip Button */}
            <button
              type="button"
              onClick={handleSkipIntro}
              className="absolute top-6 right-6 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-[100]"
              id="btn-skip-intro"
            >
              Skip Intro
            </button>

            {/* Core Animating Content wrapper */}
            <div className="flex flex-col items-center text-center space-y-6 z-20" id="boot-core-box">
              <motion.div
                layoutId="lumina-logo-core"
                initial={{ scale: 0.7, opacity: 0, rotate: 2, filter: "blur(20px)" }}
                animate={timeline !== "initial" ? { scale: 1, opacity: 1, rotate: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center justify-center"
              >
                {/* Logo glow core */}
                <div className="absolute w-24 h-24 rounded-2xl bg-gradient-to-tr from-brand-violet to-brand-magenta blur-xl opacity-60 animate-pulse" />
                
                {/* Outlines of neon */}
                <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-brand-violet via-brand-magenta to-brand-cyan opacity-20 blur-sm animate-[spin_8s_linear_infinite]" />
                
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-violet to-brand-magenta flex items-center justify-center text-white relative z-10 border border-white/20 shadow-2xl">
                  <Sparkles className="w-9 h-9 text-white animate-[pulse_3s_ease-in-out_infinite]" />
                  {/* Subtle sweep line overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={timeline !== "initial" ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="space-y-3"
              >
                <h1 className="text-xl md:text-2xl font-black tracking-widest text-white font-display uppercase">
                  LUMINA AI
                </h1>
                <p className="text-xs text-brand-cyan/80 tracking-widest font-bold">
                  Empowering the Future of Women's Careers
                </p>
              </motion.div>

              {/* AI boot sequence terminal typed messages */}
              <div className="h-6 flex items-center justify-center" id="boot-terminal">
                {timeline === "bootSequence" && (
                  <div className="flex items-center space-x-1 font-mono text-[10.5px] text-gray-400 bg-white/5 border border-white/5 px-4 py-1 rounded-full backdrop-blur-md">
                    <span>{typedMessage}</span>
                    <span className="w-1.5 h-3 bg-brand-cyan animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Ambient Header / Nav */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between" id="landing-header">
        <div className="flex items-center space-x-3" id="landing-logo">
          {/* Framer motion shared layout logo transition */}
          <motion.div 
            layoutId="lumina-logo-core"
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-magenta flex items-center justify-center text-white shadow-lg shadow-brand-violet/20" 
            id="landing-logo-box"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <span className="block text-sm font-bold tracking-tight text-white uppercase font-display" id="landing-logo-text">LUMINA AI</span>
            <span className="block text-[8px] text-brand-cyan font-bold tracking-widest uppercase">Career & Opportunity OS</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-gray-400" id="landing-navbar">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Success Stories</a>
          <a href="#pricing" className="hover:text-white transition-colors">Free Access</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center space-x-4" id="landing-actions">
          <button 
            type="button" 
            onClick={onStart}
            className="px-4 py-2 bg-gradient-to-r from-brand-violet to-brand-magenta hover:from-brand-violet/90 hover:to-brand-magenta/90 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-brand-violet/20 hover:scale-[1.02]"
            id="btn-header-start"
          >
            Start Free
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 md:px-12 max-w-7xl mx-auto" id="hero-section">
        {/* Soft Animated Aurora Background */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[70vw] h-[50vh] bg-gradient-to-tr from-brand-violet/10 via-brand-magenta/5 to-brand-cyan/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="hero-grid">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8 text-left" id="hero-left">
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-medium text-brand-cyan" id="hero-announcement">
              <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Calibrated Exclusively for Female Leaders</span>
            </div>

            {/* Word-by-word animate in with stagger */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none font-display" id="hero-title">
              {"Your AI Career Companion for Every Stage of Your Journey".split(" ").map((word, idx) => (
                <motion.span
                  key={idx}
                  className="inline-block mr-3"
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)", scale: 0.96 }}
                  animate={timeline === "ready" ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 } : {}}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 15,
                    delay: idx * 0.08
                  }}
                >
                  {word === "Every" || word === "Stage" || word === "Journey" ? (
                    <span className="bg-gradient-to-r from-brand-violet via-brand-magenta to-brand-cyan bg-clip-text text-transparent">{word}</span>
                  ) : word}
                </motion.span>
              ))}
            </h1>

            <motion.p 
              className="text-sm md:text-base text-gray-400 max-w-xl leading-relaxed" 
              id="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={timeline === "ready" ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              Lumina-AI is an ultra-premium, modular Career and Opportunity Operating System. It dynamically adapts its intelligence based on your specific life stage—whether you are a young high school scholar, a university student hunting for STEM fellowships, or a senior professional maximizing compensation and leadership promotions.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4 pt-2" 
              id="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={timeline === "ready" ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              {/* Magnetic style interactive buttons */}
              <motion.button
                type="button"
                onClick={onStart}
                className="px-6 py-3.5 bg-gradient-to-r from-brand-violet to-brand-magenta hover:shadow-brand-violet/30 hover:shadow-xl text-white rounded-xl text-sm font-extrabold transition-all flex items-center space-x-2 cursor-pointer"
                whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(139, 92, 255, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                id="btn-hero-cta-start"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                type="button"
                onClick={onExplore}
                className="px-6 py-3.5 bg-brand-elevated border border-white/10 hover:border-brand-cyan/30 text-white rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                id="btn-hero-cta-explore"
              >
                <span>Explore Careers</span>
                <ChevronRight className="w-4 h-4 text-brand-cyan" />
              </motion.button>
            </motion.div>
          </div>

          {/* Hero Right Holographic Frame with specified Float widgets */}
          <div className="lg:col-span-5 relative flex justify-center" id="hero-right">
            <div className="relative w-full max-w-[420px] h-[500px]" id="hologram-viewport">
              {/* Spinning / Glowing cyber core rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-dashed border-brand-violet/30 animate-[spin_40s_linear_infinite] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-double border-brand-cyan/20 animate-[spin_25s_linear_infinite] pointer-events-none" />
              
              {/* Center Hologram Avatar Sphere */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-tr from-brand-violet/20 to-brand-magenta/10 blur-xl animate-pulse" />
              <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-28 h-28 rounded-full border-2 border-brand-violet bg-brand-surface/90 flex items-center justify-center shadow-2xl shadow-brand-violet/50 z-20 animate-bounce" style={{ animationDuration: '6s' }}>
                <Brain className="w-12 h-12 text-brand-cyan animate-pulse" />
              </div>

              {/* DYNAMIC SPECIFIED WIDGETS WITH TILT & SPRING ENTRANCE */}
              
              {/* Card 1: Resume Score */}
              <TiltCard id="widget-resume-score" className="absolute top-2 -left-6 z-30" delay={0.2}>
                <div className="glass-card px-3.5 py-2.5 rounded-xl border border-white/5 shadow-2xl max-w-[150px] text-left">
                  <span className="block text-[8px] text-brand-gold font-bold uppercase mb-0.5">Resume Score</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-bold text-white">88</span>
                    <span className="text-[9px] text-gray-400">/100</span>
                  </div>
                  <span className="text-[8px] text-brand-emerald font-semibold block mt-1">Excellent (ATS Optimized)</span>
                </div>
              </TiltCard>

              {/* Card 2: Career DNA */}
              <TiltCard id="widget-career-dna" className="absolute bottom-6 right-0 z-30" delay={0.4}>
                <div className="glass-card px-4 py-3 rounded-xl border border-brand-violet/30 shadow-2xl max-w-[190px] text-left">
                  <span className="block text-[8px] text-brand-violet font-bold uppercase mb-1">Career DNA Analysis</span>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px]">
                      <span className="text-gray-400">Technical index</span>
                      <span className="text-brand-cyan font-bold">94%</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-gray-400">Leadership track</span>
                      <span className="text-brand-magenta font-bold">87%</span>
                    </div>
                  </div>
                </div>
              </TiltCard>

              {/* Card 3: Scholarship Alert */}
              <TiltCard id="widget-scholarship-alert" className="absolute bottom-28 -left-10 z-30" delay={0.6}>
                <div className="glass-card px-3.5 py-3 rounded-xl border border-brand-magenta/30 shadow-2xl max-w-[185px] text-left">
                  <div className="flex items-center space-x-1 text-brand-magenta font-bold text-[9px] uppercase mb-1">
                    <Award className="w-3 h-3 text-brand-magenta" />
                    <span>Scholarship Match</span>
                  </div>
                  <p className="text-[10px] font-bold text-white leading-tight">Adobe Women-in-Technology</p>
                  <p className="text-[9px] text-brand-gold font-semibold mt-0.5">$10,000 Award</p>
                </div>
              </TiltCard>

              {/* Card 4: Learning Progress */}
              <TiltCard id="widget-learning-progress" className="absolute top-16 -right-6 z-30" delay={0.8}>
                <div className="glass-card px-3.5 py-2.5 rounded-xl border border-brand-cyan/30 shadow-2xl max-w-[150px] text-left">
                  <span className="block text-[8px] text-brand-cyan font-bold uppercase mb-0.5">Progress Track</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-lg font-bold text-white">3 / 5</span>
                    <span className="text-[8px] text-gray-400 ml-1">Milestones</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-brand-cyan w-[60%] h-full rounded-full animate-pulse" />
                  </div>
                </div>
              </TiltCard>

              {/* Card 5: AI Coach */}
              <TiltCard id="widget-ai-coach" className="absolute bottom-1 right-[48%] translate-x-1/2 z-30" delay={1.0}>
                <div className="glass-card px-3 py-2 rounded-full border border-white/10 shadow-lg flex items-center space-x-2 text-[9px] text-brand-gold font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-spin" style={{ animationDuration: '8s' }} />
                  <span>"Ready for your mock interview prep"</span>
                </div>
              </TiltCard>

              {/* Card 6: Job Match */}
              <TiltCard id="widget-job-match" className="absolute top-[52%] -right-12 z-30" delay={1.2}>
                <div className="glass-card px-3.5 py-3 rounded-xl border border-brand-emerald/30 shadow-2xl max-w-[155px] text-left">
                  <span className="block text-[8px] text-brand-emerald font-bold uppercase mb-1">98% Match Score</span>
                  <p className="text-[10px] font-bold text-white leading-tight">AI Research Engineer</p>
                  <p className="text-[8px] text-gray-400 mt-0.5">Google DeepMind</p>
                </div>
              </TiltCard>

            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-brand-surface/60 border-y border-white/5 text-center" id="trusted-section">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-8">
            Lumina is trusted by female leaders and ambitious students worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 select-none grayscale" id="trust-logos">
            <span className="text-sm font-extrabold tracking-tight text-white font-display">GOOGLE FOR STARTUPS</span>
            <span className="text-sm font-extrabold tracking-tight text-white font-display">MICROSOFT AI RESEARCH</span>
            <span className="text-sm font-extrabold tracking-tight text-white font-display">ADOBE FOUNDATION</span>
            <span className="text-sm font-extrabold tracking-tight text-white font-display">WOMEN WHO CODE</span>
            <span className="text-sm font-extrabold tracking-tight text-white font-display">AWS INCLUSION</span>
          </div>
        </div>
      </section>

      {/* 2. CHROME STYLE STICKY SCROLL SECTION REVEALS */}
      <motion.section 
        className="py-24 max-w-7xl mx-auto px-6" 
        id="features"
        initial={{ opacity: 0, y: 60, filter: "blur(10px)", scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center space-y-3 mb-16" id="features-header">
          <span className="text-xs font-bold text-brand-violet uppercase tracking-widest">SaaS Modules</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display">
            Built for confidence and explosive career growth
          </h2>
          <p className="text-xs text-gray-400 max-w-lg mx-auto">
            Experience state-of-the-art career development. No mock-ups, just premium, personalized intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="features-grid">
          {/* Card 1: Adaptive Life Stage */}
          <motion.div 
            className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 hover:border-brand-violet/30 hover:scale-[1.02] transition-all cursor-pointer" 
            id="feature-card-1"
            whileHover={{ y: -4 }}
          >
            <div className="w-10 h-10 rounded-xl bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center text-brand-violet">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Dynamic Journey Adaptation</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Lumina immediately recalibrates based on whether you are a secondary scholar, college stem-major, or a veteran leader. Forms update instantly to serve you.
            </p>
          </motion.div>

          {/* Card 2: AI Career Coach */}
          <motion.div 
            className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 hover:border-brand-magenta/30 hover:scale-[1.02] transition-all cursor-pointer" 
            id="feature-card-2"
            whileHover={{ y: -4 }}
          >
            <div className="w-10 h-10 rounded-xl bg-brand-magenta/10 border border-brand-magenta/20 flex items-center justify-center text-brand-magenta">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Generative Career Copilot</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Consult with Gemini AI. Copy mock transcripts, perfect interview cues, and calculate live resume ATS optimization matching indexes.
            </p>
          </motion.div>

          {/* Card 3: Opportunity Explorer */}
          <motion.div 
            className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 hover:border-brand-cyan/30 hover:scale-[1.02] transition-all cursor-pointer" 
            id="feature-card-3"
            whileHover={{ y: -4 }}
          >
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Opportunity Intelligence</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              An intelligent repository of academic scholarships, STEM research grants, corporate fellowships, and high-tier internships. Save with 1-click.
            </p>
          </motion.div>

          {/* Card 4: Resume Analyzer */}
          <motion.div 
            className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 hover:border-brand-gold/30 hover:scale-[1.02] transition-all cursor-pointer" 
            id="feature-card-4"
            whileHover={{ y: -4 }}
          >
            <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Smart Resume & ATS Audit</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Identify missing keywords, syntax inaccuracies, and grammar flaws. Match your resume parameters instantly against custom job definitions.
            </p>
          </motion.div>

          {/* Card 5: Startup Incubator */}
          <motion.div 
            className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 hover:border-brand-emerald/30 hover:scale-[1.02] transition-all cursor-pointer" 
            id="feature-card-5"
            whileHover={{ y: -4 }}
          >
            <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald">
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Startup Incubator & Lean Canvas</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Input project ideas to auto-generate fully validated Lean Business Canvases complete with customer segments, revenue plans, and grants.
            </p>
          </motion.div>

          {/* Card 6: Finance & Salary Planner */}
          <motion.div 
            className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 hover:border-brand-coral/30 hover:scale-[1.02] transition-all cursor-pointer" 
            id="feature-card-6"
            whileHover={{ y: -4 }}
          >
            <div className="w-10 h-10 rounded-xl bg-brand-coral/10 border border-brand-coral/20 flex items-center justify-center text-brand-coral">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Negotiation & Budget Planner</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Determine salary benchmark targets, construct expense strategies, and track outstanding scholarship savings via interactive visual calculators.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        className="py-24 bg-brand-surface/40 border-y border-white/5" 
        id="how-it-works"
        initial={{ opacity: 0, y: 50, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-brand-magenta uppercase tracking-widest">Engineering Architecture</span>
            <h2 className="text-3xl font-bold tracking-tight text-white font-display">How Lumina Empowers You</h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto">Three automated steps to launch your intelligent career environment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left relative" id="steps-container">
            {/* Connection lines (desktop) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-brand-violet via-brand-magenta to-brand-cyan opacity-20 pointer-events-none" />

            {/* Step 1 */}
            <div className="space-y-4 relative" id="step-1">
              <div className="w-12 h-12 rounded-2xl bg-brand-bg border border-brand-violet text-brand-violet flex items-center justify-center font-bold text-base shadow-lg shadow-brand-violet/20 z-10 relative">
                1
              </div>
              <h3 className="text-base font-semibold text-white">Adaptive Stage Calibration</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Take our onboarding questionnaire. Lumina AI adapts automatically to your age and life stage to filter out irrelevant requirements.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 relative" id="step-2">
              <div className="w-12 h-12 rounded-2xl bg-brand-bg border border-brand-magenta text-brand-magenta flex items-center justify-center font-bold text-base shadow-lg shadow-brand-magenta/20 z-10 relative">
                2
              </div>
              <h3 className="text-base font-semibold text-white">AI Career DNA Synthesis</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Lumina generates your personalized Career DNA index, immediately matching your interests against a database of scholarships, grants, and mentors.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 relative" id="step-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-bg border border-brand-cyan text-brand-cyan flex items-center justify-center font-bold text-base shadow-lg shadow-brand-cyan/20 z-10 relative">
                3
              </div>
              <h3 className="text-base font-semibold text-white">Interactive Achievement Loops</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Unlock milestones, track saved applications, negotiate senior pay rates, or validate startup prototypes with the Gemini-powered Career Coach.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section with auto-incrementing counts */}
      <section className="py-20 max-w-7xl mx-auto px-6 border-b border-white/5" id="stats-section">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center" id="stats-grid">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-2">
              <StatsCounter value={s.value} />
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories & Testimonials */}
      <motion.section 
        className="py-24 max-w-7xl mx-auto px-6" 
        id="testimonials"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-brand-cyan uppercase tracking-widest">Global Leadership</span>
          <h2 className="text-3xl font-bold tracking-tight text-white font-display">Success Stories</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">Read how ambitious women have accelerated their milestones with Lumina-AI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="testimonials-grid">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx} 
              className="glass-card p-6 rounded-2xl border border-white/5 relative flex flex-col justify-between" 
              id={`testimonial-card-${idx}`}
              initial={{ opacity: 0, x: idx * 40 - 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 60, damping: 15, delay: idx * 0.1 }}
            >
              <div className="absolute top-4 right-6 text-brand-violet/20 font-serif text-6xl select-none leading-none">“</div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-violet to-brand-cyan flex items-center justify-center text-xs font-extrabold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <p className="text-[10px] text-brand-cyan font-semibold">{t.role}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 100% Free Access Spotlight - Rising Card with Glow */}
      <section className="py-24 bg-brand-surface/40 border-y border-white/5" id="pricing">
        <motion.div 
          className="max-w-4xl mx-auto px-6 text-center space-y-6"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          whileHover={{ boxShadow: "0 0 40px rgba(139, 92, 255, 0.12)", borderColor: "rgba(139, 92, 255, 0.3)" }}
        >
          <div className="inline-flex items-center space-x-1.5 bg-brand-emerald/10 border border-brand-emerald/20 px-3 py-1 rounded-full text-brand-emerald" id="badge-unlimited-free">
            <CheckCircle className="w-3.5 h-3.5" id="icon-free-check" />
            <span className="text-[10px] font-bold uppercase tracking-widest">100% Free & Unlimited Access</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display" id="title-free-access">
            Empowerment Without Barriers
          </h2>
          <p className="text-xs text-gray-400 max-w-2xl mx-auto leading-relaxed" id="desc-free-access">
            We believe that career advancement, mentorship, and opportunities should be accessible to every aspiring female leader. That's why <strong className="text-white">all premium modules in Lumina are completely free</strong> for everyone—no subscription, no hidden costs.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-6 text-left" id="free-features-grid">
            {[
              "Infinite AI Copilot Conversations",
              "Unlimited Resume ATS Optimization",
              "Full Opportunity Engine Matching",
              "Lean Startup Business Canvases",
              "Unlimited Advisor Bookings",
              "Interactive Financial Calculators"
            ].map((feat, idx) => (
              <div key={idx} className="glass-card p-4 rounded-xl border border-white/5 flex items-center space-x-2" id={`free-feature-card-${idx}`}>
                <CheckCircle className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                <span className="text-xs text-gray-200">{feat}</span>
              </div>
            ))}
          </div>
          <div className="pt-8">
            <button
              type="button"
              onClick={onStart}
              className="px-8 py-3.5 bg-gradient-to-r from-brand-violet to-brand-magenta text-white font-bold rounded-xl text-xs hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-brand-violet/25"
              id="btn-free-get-started"
            >
              Get Started for Free
            </button>
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 max-w-4xl mx-auto px-6" id="faq">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-brand-cyan uppercase tracking-widest">Assistance</span>
          <h2 className="text-3xl font-bold tracking-tight text-white font-display">Frequently Asked Questions</h2>
          <p className="text-xs text-gray-400">Everything you need to know about the Lumina platform and your data security.</p>
        </div>

        <div className="space-y-4 text-left" id="faq-accordion">
          {faqs.map((f, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-white/5 space-y-2" id={`faq-item-${idx}`}>
              <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-brand-cyan flex-shrink-0" />
                <span>{f.q}</span>
              </h3>
              <p className="text-xs text-gray-400 pl-6 leading-relaxed">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Hero CTA Footer Banner */}
      <section className="py-20 px-6 max-w-5xl mx-auto" id="landing-footer-banner">
        <div className="glass-card p-12 rounded-3xl border border-brand-violet/30 bg-gradient-to-tr from-brand-violet/10 via-transparent to-brand-cyan/5 text-center space-y-6 relative overflow-hidden" id="banner-content">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-violet/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-display">
            Step into the future of career intelligence today.
          </h2>
          <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
            Gain full access to the AI Career Coach, customized Opportunity match listings, Lean Business Canvas calculators, and a lifetime mentor network.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onStart}
              className="px-8 py-4 bg-gradient-to-r from-brand-violet to-brand-magenta hover:shadow-brand-violet/30 hover:shadow-xl text-white rounded-xl text-sm font-extrabold transition-all inline-flex items-center space-x-2 cursor-pointer hover:scale-[1.02]"
              id="btn-footer-cta-action"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#030303]" id="landing-footer">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-left" id="footer-grid">
          <div className="space-y-4" id="footer-branding">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-violet to-brand-magenta flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold tracking-tight text-white uppercase font-display">Lumina AI</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              The world's most intelligent Career and Opportunity Operating System designed to empower female innovators.
            </p>
          </div>

          <div className="space-y-3" id="footer-col-1">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Platform</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">Career Copilot</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Opportunity Matcher</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Startup Lean Canvas</a></li>
            </ul>
          </div>

          <div className="space-y-3" id="footer-col-2">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Company</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><span className="text-gray-600">About Us</span></li>
              <li><span className="text-gray-600">Careers</span></li>
              <li><span className="text-gray-600">Inclusion Program</span></li>
            </ul>
          </div>

          <div className="space-y-3" id="footer-col-3">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Legal</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><span className="text-gray-600">Privacy Standards</span></li>
              <li><span className="text-gray-600">Terms of Operation</span></li>
              <li><span className="text-gray-600">Security Architecture</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500" id="footer-bottom">
          <span>&copy; 2026 Lumina AI Inc. All rights reserved.</span>
          <span className="mt-2 md:mt-0">Crafted with Electric Violet, Neon Magenta, and AI Cyan Glow.</span>
        </div>
      </footer>

    </div>
  );
}

// -------------------------------------------------------------
// MICRO-COMPONENTS FOR ENHANCED PRECISE MOTION EXPERIENCE
// -------------------------------------------------------------

// High-performance stats incrementor
function StatsCounter({ value }: { value: string }) {
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const duration = 1500; // ms
    const startTime = performance.now();

    const animateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * numericValue));

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [hasStarted, numericValue]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-extrabold text-white font-display">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

// 3D Tilt floating card container
function TiltCard({ children, className, id, delay = 0 }: { children: React.ReactNode, className: string, id: string, delay?: number }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Maximum 12 degrees tilt for safety and elegance
    setRotateX(-y / (rect.height / 12));
    setRotateY(x / (rect.width / 12));
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      id={id}
      className={`${className} cursor-pointer`}
      initial={{ scale: 0.8, opacity: 0, y: 80, rotate: 5 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        y: 0, 
        rotate: 0,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 80, 
        damping: 15,
        delay,
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
        rotateX,
        rotateY,
      }}
    >
      <motion.div
        animate={{
          y: [0, -6, 0],
          rotate: [0, 0.5, 0, -0.5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 3
        }}
        className="w-full h-full relative"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
