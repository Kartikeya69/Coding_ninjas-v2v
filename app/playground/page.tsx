'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Settings, 
  Keyboard, 
  Eye, 
  Maximize2,
  RefreshCw,
  Info,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import AI components
import { AIOrb } from '../../components/ai/AIOrb';
import { AIThinking } from '../../components/ai/AIThinking';
import { AISuggestionsCard } from '../../components/ai/AISuggestionsCard';
import { AIChatBubble } from '../../components/ai/AIChatBubble';

// Import primitives
import { Button } from '../../components/buttons/Button';
import { Input } from '../../components/forms/Input';
import { Switch } from '../../components/forms/Switch';
import { Card } from '../../components/cards/Card';
import { GlassCard } from '../../components/cards/GlassCard';
import { DashboardWidget } from '../../components/widgets/DashboardWidget';
import { EmptyState } from '../../components/widgets/EmptyState';

// Import charts
import { AreaChart } from '../../components/charts/AreaChart';
import { BarChart } from '../../components/charts/BarChart';
import { CareerRadar } from '../../components/charts/CareerRadar';
import { GrowthTimeline } from '../../components/charts/GrowthTimeline';

export default function PlaygroundPage() {
  // States for interactive components testing
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [switchVal, setSwitchVal] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [orbThinking, setOrbThinking] = useState(false);

  // States for Accessibility Testing features
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showTabOrder, setShowTabOrder] = useState(false);

  // Active theme accent (preview purposes only)
  const [activeAccent, setActiveAccent] = useState<'purple' | 'cyan' | 'rose' | 'emerald'>('purple');

  // States for AI Engine Sandbox
  const [aiFeature, setAiFeature] = useState('career_guidance');
  const [aiInput, setAiInput] = useState('I want to learn frontend engineering with React and TypeScript.');
  const [aiBypassCache, setAiBypassCache] = useState(false);
  const [aiTesting, setAiTesting] = useState(false);
  
  interface TestResult {
    success: boolean;
    data: unknown;
    metrics?: {
      latencyMs: number;
      cacheHit: boolean;
      estimatedTokens: number;
    };
    error?: string;
  }
  const [aiResult, setAiResult] = useState<TestResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleTestAI = async () => {
    setAiTesting(true);
    setAiResult(null);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: aiFeature,
          userId: 'test-user-123',
          input: aiInput,
          bypassCache: aiBypassCache,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiResult(data);
      } else {
        setAiError(data.error || 'Request failed');
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Unknown network failure');
    } finally {
      setAiTesting(false);
    }
  };

  const handleTriggerLoading = () => {
    setBtnLoading(true);
    setTimeout(() => setBtnLoading(false), 2000);
  };

  return (
    <div className={`min-h-screen bg-background pb-20 select-none relative overflow-x-hidden theme-${activeAccent}`}>
      {/* Background glowing gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Subtle Noise overlay */}
      <div className="bg-noise" />

      {/* Header navbar */}
      <header className="h-16 border-b border-border bg-card/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-linear-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-white tracking-tight font-sans">Lumina Sandbox</h1>
            <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">Developer Playground</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Accent switcher preview */}
          <div className="flex bg-muted/40 border border-border p-1 rounded-xl items-center gap-1">
            {(['purple', 'cyan', 'rose', 'emerald'] as const).map((accent) => (
              <button
                key={accent}
                onClick={() => setActiveAccent(accent)}
                className={`h-4 w-4 rounded-full border transition-all cursor-pointer ${
                  accent === 'purple' && 'bg-purple-500 border-purple-400' ||
                  accent === 'cyan' && 'bg-cyan-500 border-cyan-400' ||
                  accent === 'rose' && 'bg-rose-500 border-rose-400' ||
                  'bg-emerald-500 border-emerald-400'
                } ${activeAccent === accent ? 'scale-125 ring-2 ring-white/20' : 'opacity-60 hover:opacity-100'}`}
                title={`Accent: ${accent}`}
              />
            ))}
          </div>
          <Button variant="secondary" size="sm" onClick={() => window.history.back()}>
            Exit Sandbox
          </Button>
        </div>
      </header>

      {/* Body content */}
      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Column: UI Primitives & Accessibility */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Button Playground */}
          <Card>
            <div className="flex items-center gap-2 border-b border-border pb-3 mb-5">
              <Sliders className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-semibold text-white">Button Playground</h3>
            </div>
            
            <div className="flex flex-col gap-6">
              {/* Interactive Controllers */}
              <div className="flex flex-wrap gap-4 items-center bg-muted/20 border border-border p-3.5 rounded-xl">
                <Switch checked={btnLoading} onChange={setBtnLoading} label="Trigger Loading" />
                <Switch checked={btnDisabled} onChange={setBtnDisabled} label="Trigger Disabled" />
                <Button variant="outline" size="sm" onClick={handleTriggerLoading}>
                  Test Auto-Loading (2s)
                </Button>
              </div>

              {/* Showcase Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Default Variants</span>
                  <div className="flex flex-wrap gap-2.5">
                    <Button variant="primary" isLoading={btnLoading} disabled={btnDisabled}>Primary</Button>
                    <Button variant="secondary" isLoading={btnLoading} disabled={btnDisabled}>Secondary</Button>
                    <Button variant="outline" isLoading={btnLoading} disabled={btnDisabled}>Outline</Button>
                    <Button variant="ghost" isLoading={btnLoading} disabled={btnDisabled}>Ghost</Button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Status & Special</span>
                  <div className="flex flex-wrap gap-2.5">
                    <Button variant="success" isLoading={btnLoading} disabled={btnDisabled}>Success</Button>
                    <Button variant="danger" isLoading={btnLoading} disabled={btnDisabled}>Danger</Button>
                    <Button variant="ai" isLoading={btnLoading} disabled={btnDisabled}>Lumina AI</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Form inputs */}
          <Card>
            <div className="flex items-center gap-2 border-b border-border pb-3 mb-5">
              <Settings className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-semibold text-white">Interactive Form Elements</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Sample Text Input"
                placeholder="Enter query details here..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                helperText="Focus outline triggers purple ring."
              />
              <Input
                label="Sample Validation Error"
                placeholder="Wrong email format..."
                defaultValue="invalid_email@com"
                error="Format is incorrect. Please check."
              />
              <div className="flex flex-col gap-4 self-center pt-2">
                <Switch checked={switchVal} onChange={setSwitchVal} label="Interactive Toggle Switch" />
              </div>
            </div>
          </Card>

          {/* Accessibility audit panel */}
          <Card className="border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 border-b border-border pb-3 mb-5">
              <Keyboard className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-semibold text-white">Accessibility (WCAG Audit)</h3>
            </div>
            
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap gap-4 items-center bg-muted/40 p-3 rounded-xl border border-border">
                <Switch checked={reducedMotion} onChange={setReducedMotion} label="Simulate Reduced Motion" />
                <Switch checked={showTabOrder} onChange={setShowTabOrder} label="Highlight Tab Order" />
              </div>

              {/* Tab indicator simulation */}
              {showTabOrder && (
                <div className="p-4 rounded-xl border border-border/80 bg-background/80 flex flex-col gap-3.5 animate-in fade-in slide-in-from-top-2">
                  <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Keyboard Tab Order Indicators:</span>
                  <div className="flex flex-wrap gap-2.5">
                    <div className="px-3.5 py-2 rounded-lg bg-muted text-xs text-white border border-border flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full bg-primary flex items-center justify-center text-[9px] font-mono text-white">1</span>
                      <span>Launch Sidebar</span>
                    </div>
                    <div className="px-3.5 py-2 rounded-lg bg-muted text-xs text-white border border-border flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full bg-primary flex items-center justify-center text-[9px] font-mono text-white">2</span>
                      <span>AI Command Input</span>
                    </div>
                    <div className="px-3.5 py-2 rounded-lg bg-muted text-xs text-white border border-border flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full bg-primary flex items-center justify-center text-[9px] font-mono text-white">3</span>
                      <span>Submit Query</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Contrast Checker grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-lg bg-[#09090b] border border-border flex flex-col items-center">
                  <span className="text-[10px] text-[#f4f4f5] font-semibold">Zinc 950</span>
                  <span className="text-[9px] text-[#a1a1aa] mt-1 font-mono">AAA Pass</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#121214] border border-border flex flex-col items-center">
                  <span className="text-[10px] text-[#f4f4f5] font-semibold">Card 900</span>
                  <span className="text-[9px] text-[#a1a1aa] mt-1 font-mono">AAA Pass</span>
                </div>
                <div className="p-3.5 rounded-lg bg-primary/10 border border-primary/20 flex flex-col items-center">
                  <span className="text-[10px] text-primary font-semibold">Purple 10%</span>
                  <span className="text-[9px] text-primary mt-1 font-mono">AA Pass</span>
                </div>
                <div className="p-3.5 rounded-lg bg-secondary/10 border border-secondary/20 flex flex-col items-center">
                  <span className="text-[10px] text-secondary font-semibold">Cyan 10%</span>
                  <span className="text-[9px] text-secondary mt-1 font-mono">AA Pass</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Static Chart wrappers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DashboardWidget title="Career Area Progress" icon={Sparkles}>
              <AreaChart />
            </DashboardWidget>
            <DashboardWidget title="Weekly Engagement Metrics" icon={Cpu}>
              <BarChart />
            </DashboardWidget>
            <DashboardWidget title="AI Skills Radar" icon={Settings}>
              <CareerRadar />
            </DashboardWidget>
            <DashboardWidget title="Active Growth Timeline" icon={Keyboard}>
              <GrowthTimeline />
            </DashboardWidget>
          </div>

        </div>

        {/* Right Column: AI Branding & Containers */}
        <div className="flex flex-col gap-8">
          
          {/* AI Branding showcase */}
          <Card className="border-cyan-500/20 bg-cyan-950/5 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-400 to-purple-500" />
            
            <div className="flex items-center gap-2 border-b border-border pb-3 mb-5">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-semibold text-white">AI Visual Identity</h3>
            </div>

            <div className="flex flex-col items-center gap-6 justify-center">
              {/* Pulsing AI Orb */}
              <AIOrb size="md" isThinking={orbThinking} />
              
              <div className="flex gap-2">
                <Switch checked={orbThinking} onChange={setOrbThinking} label="Simulate Model Thinking" />
              </div>

              {/* Loader Waves */}
              <AnimatePresence>
                {orbThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="w-full flex justify-center"
                  >
                    <AIThinking />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          {/* AI Suggestions Card */}
          <AISuggestionsCard 
            title="Lumina Coach Advice" 
            actionText="Optimize Draft Resume"
          >
            &quot;You have matching strengths in React and Tailwind, but lack experience with NextJS Edge Routing. We recommend adding dynamic routes references.&quot;
          </AISuggestionsCard>

          {/* AI Chat Node bubble samples */}
          <div className="rounded-xl border border-border bg-card/45 backdrop-blur-xl p-5 flex flex-col gap-4">
            <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">AI Conversation Node</h4>
            <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto pr-1">
              <AIChatBubble 
                role="assistant" 
                content="Hi! I am Lumina. How can I help you design your career roadmap today?" 
                timestamp="4:12 PM" 
              />
              <AIChatBubble 
                role="user" 
                content="I want to transition from frontend designer to full stack engineer." 
                timestamp="4:13 PM" 
              />
            </div>
          </div>

          {/* Dashboard empty states presets previews */}
          <div className="rounded-xl border border-border bg-card/45 backdrop-blur-xl p-5">
            <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-3">Empty State Presets</h4>
            <div className="flex flex-col gap-4">
              <EmptyState preset="jobs" actionText="Search Roles" />
            </div>
          </div>

          {/* Central AI Engine Validator Panel */}
          <div className="rounded-xl border border-border bg-card/45 backdrop-blur-xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">AI Engine Validator</h4>
              <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">v1.0</span>
            </div>
            
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] text-muted-foreground block mb-1.5 font-medium">Select Capability Feature</label>
                <select 
                  value={aiFeature} 
                  onChange={(e) => setAiFeature(e.target.value)}
                  className="w-full text-xs rounded-lg border border-border bg-background/50 px-3 py-2 text-white outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="career_guidance">Career Guidance (career_guidance)</option>
                  <option value="resume_review">Resume Reviewer (resume_review)</option>
                  <option value="roadmap_planner">Learning Roadmap (roadmap_planner)</option>
                  <option value="scholarship_advisor">Scholarship Advisor (scholarship_advisor)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground block mb-1.5 font-medium">Prompt Input Text</label>
                <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  rows={2}
                  className="w-full text-xs rounded-lg border border-border bg-background/50 px-3 py-2 text-white outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <Switch checked={aiBypassCache} onChange={setAiBypassCache} label="Bypass AI Caching Layer" />
              </div>

              <Button 
                onClick={handleTestAI} 
                isLoading={aiTesting} 
                disabled={!aiInput.trim()}
                className="w-full text-xs"
              >
                Execute Query
              </Button>
            </div>

            {aiError && (
              <div className="text-[10px] text-red-400 bg-red-950/20 border border-red-500/20 p-2.5 rounded-lg font-mono">
                Error: {aiError}
              </div>
            )}

            {aiResult && (
              <div className="flex flex-col gap-2 mt-1 font-sans">
                <div className="grid grid-cols-3 gap-1 text-[8px] font-mono text-muted-foreground bg-black/20 p-2 rounded border border-border/30">
                  <div>Latency: <span className="text-white font-semibold">{aiResult.metrics?.latencyMs}ms</span></div>
                  <div>Cache: <span className={`${aiResult.metrics?.cacheHit ? 'text-green-400' : 'text-amber-400'} font-semibold`}>{aiResult.metrics?.cacheHit ? 'HIT' : 'MISS'}</span></div>
                  <div>Tokens: <span className="text-white font-semibold">~{aiResult.metrics?.estimatedTokens}</span></div>
                </div>
                <div className="text-[9px] font-mono text-cyan-400 bg-black/40 p-2.5 rounded border border-border/30 max-h-[150px] overflow-y-auto whitespace-pre-wrap">
                  {JSON.stringify(aiResult.data, null, 2)}
                </div>
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
