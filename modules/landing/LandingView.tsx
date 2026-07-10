'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, GraduationCap, Users, Briefcase, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingView: React.FC = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between select-none">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -top-[10%] -left-[10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-linear-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-md font-semibold tracking-tight text-white">Lumina AI</span>
        </div>
        
        {/* Navigation Items (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-xs text-muted-foreground">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#mentorship" className="hover:text-white transition-colors">Mentorship</a>
          <a href="#scholarships" className="hover:text-white transition-colors">Scholarships</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </nav>

        {/* Action Button */}
        <div>
          <Link 
            href="/login" 
            className="px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors shadow-xs cursor-pointer"
          >
            Launch Console
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-medium mb-6"
        >
          <Star className="h-3 w-3 fill-primary" />
          <span>Announcing Phase 1: Project Foundation</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl font-sans leading-[1.15]"
        >
          Your AI Career <br />
          <span className="text-gradient-purple-cyan font-bold">Operating System</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-sm sm:text-base text-muted-foreground max-w-2xl font-sans"
        >
          Lumina AI empowers women in tech to optimize resumes, discover high-value scholarships, match with mentors, track finances, and map customized career roadmaps through one agentic assistant.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link 
            href="/login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-linear-to-tr from-primary to-secondary text-white text-xs font-semibold hover:opacity-95 transition-opacity shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a 
            href="#features"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-border bg-card/40 text-muted-foreground hover:text-white transition-colors text-xs font-semibold flex items-center justify-center cursor-pointer"
          >
            Explore Platform
          </a>
        </motion.div>

        {/* Dashboard Preview Frame */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full max-w-5xl mt-20 rounded-2xl border border-white/10 bg-card/20 p-2.5 backdrop-blur-md shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 rounded-2xl pointer-events-none" />
          <div className="w-full h-[400px] rounded-xl bg-[#09090b]/80 border border-white/5 glowing-grid flex flex-col overflow-hidden">
            {/* Window bar */}
            <div className="h-9 border-b border-white/5 px-4 flex items-center gap-1.5 shrink-0 bg-black/20">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[10px] text-muted-foreground font-mono ml-4">console.lumina-ai.com</span>
            </div>
            {/* Inner Dashboard Mock */}
            <div className="flex-1 p-6 flex flex-col gap-6 text-left">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <div>
                  <h3 className="text-sm font-semibold text-white">Lumina Workspace</h3>
                  <p className="text-[10px] text-muted-foreground">Select a tool from the side console to deploy AI models.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                  <span className="text-[10px] text-primary font-medium">Core Engines Standby</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 transition-colors">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Sparkles className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <h4 className="text-xs font-semibold text-white mb-1">AI Career Roadmap</h4>
                  <p className="text-[10px] text-muted-foreground">Dynamic stage milestones tailored to skill level and target roles.</p>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 transition-colors">
                  <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                    <Briefcase className="h-4.5 w-4.5 text-secondary" />
                  </div>
                  <h4 className="text-xs font-semibold text-white mb-1">Resume Optimizer</h4>
                  <p className="text-[10px] text-muted-foreground">Detailed evaluation logs highlighting resume match scores and keyword gaps.</p>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 transition-colors">
                  <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                    <GraduationCap className="h-4.5 w-4.5 text-accent" />
                  </div>
                  <h4 className="text-xs font-semibold text-white mb-1">Scholarship Finder</h4>
                  <p className="text-[10px] text-muted-foreground">Smart filters listing prestigious funds and application dates.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 h-16 border-t border-white/5 flex items-center justify-between text-[11px] text-muted-foreground relative z-10">
        <span>© 2026 Lumina AI Inc. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};
export default LandingView;
