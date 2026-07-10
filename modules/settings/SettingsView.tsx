'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  Accessibility, 
  Database,
  KeyRound,
  Download
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';

export const SettingsView: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [highContrast, setHighContrast] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);
  
  // Custom API Preferences
  const [useCustomKeys, setUseCustomKeys] = useState(false);
  const [customKey, setCustomKey] = useState('');

  const handleSave = () => {
    setSaveStatus(true);
    setTimeout(() => {
      setSaveStatus(false);
    }, 2000);
  };

  const handleToggleContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    document.documentElement.classList.toggle('high-contrast');
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      theme,
      selectedModel,
      useCustomKeys,
      exportedAt: new Date().toISOString()
    }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "lumina_ai_settings_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 select-none animate-in fade-in duration-300 text-left font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Account & AI Settings</h2>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Configure active AI models, theme selections, connected vaults, and profile parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form Sections */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* AI Settings group */}
          <div className="rounded-xl border border-border bg-card/45 backdrop-blur-xl p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <Cpu className="h-4.5 w-4.5 text-primary shrink-0" />
              <h3 className="text-xs font-semibold text-white">AI Engine Configuration</h3>
            </div>
            
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase">Active Intelligence Engine Model</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedModel('gemini-1.5-flash')}
                  className={cn(
                    "p-3 rounded-lg border text-left cursor-pointer transition-colors",
                    selectedModel === 'gemini-1.5-flash'
                      ? "border-primary bg-primary/5 text-white"
                      : "border-border bg-card/60 text-muted-foreground hover:text-white"
                  )}
                >
                  <span className="text-xs font-semibold block">Gemini 1.5 Flash</span>
                  <span className="text-[9.5px] text-muted-foreground mt-0.5 leading-normal">Optimized for general chat, real-time responses, and daily missions checkouts. (Default)</span>
                </button>
                <button
                  onClick={() => setSelectedModel('gemini-1.5-pro')}
                  className={cn(
                    "p-3 rounded-lg border text-left cursor-pointer transition-colors",
                    selectedModel === 'gemini-1.5-pro'
                      ? "border-primary bg-primary/5 text-white"
                      : "border-border bg-card/60 text-muted-foreground hover:text-white"
                  )}
                >
                  <span className="text-xs font-semibold block">Gemini 1.5 Pro</span>
                  <span className="text-[9.5px] text-muted-foreground mt-0.5 leading-normal">Deep reasoning, ideal for extensive resume review ATS audits.</span>
                </button>
              </div>
            </div>

            {/* Custom API Credentials option */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border/30">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-white">Use Custom API Key</span>
                  <p className="text-[9.5px] text-muted-foreground mt-0.5">Bring your own credentials for custom rate boundaries.</p>
                </div>
                <button
                  onClick={() => setUseCustomKeys(!useCustomKeys)}
                  className={cn(
                    "px-3 py-1 rounded text-[9.5px] font-bold uppercase transition-all cursor-pointer",
                    useCustomKeys ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  )}
                >
                  {useCustomKeys ? "Enabled" : "Disabled"}
                </button>
              </div>

              {useCustomKeys && (
                <div className="relative mt-2">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Enter custom API key..."
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    className="w-full bg-muted/10 border border-border rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-muted-foreground focus:outline-none"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Accessibility Settings */}
          <div className="rounded-xl border border-border bg-card/45 backdrop-blur-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <Accessibility className="h-4.5 w-4.5 text-primary shrink-0" />
              <h3 className="text-xs font-semibold text-white">Accessibility & Theme</h3>
            </div>

            <div className="flex justify-between items-center text-xs border-b border-border/30 pb-3">
              <div>
                <span className="text-white font-medium block">High Contrast Mode</span>
                <span className="text-[9.5px] text-muted-foreground mt-0.5">Increases text color boundaries to satisfy WCAG AA standards.</span>
              </div>
              <button 
                onClick={handleToggleContrast}
                className={cn(
                  "px-4 py-2 border rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer",
                  highContrast ? "bg-primary text-white border-primary" : "bg-muted/40 hover:bg-muted/60 border-border text-white"
                )}
              >
                {highContrast ? "Disable" : "Enable"}
              </button>
            </div>

            <div className="flex justify-between items-center text-xs pt-1">
              <div>
                <span className="text-white font-medium block">Interface Appearance Theme</span>
                <span className="text-[9.5px] text-muted-foreground mt-0.5">Lumina defaults to premium dark mode schemas.</span>
              </div>
              <button 
                onClick={toggleTheme}
                className="px-4 py-2 bg-muted/40 hover:bg-muted/60 border border-border rounded-xl text-[10px] font-semibold uppercase tracking-wider text-white transition-colors cursor-pointer"
              >
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>

          {/* Workspace Data utilities */}
          <div className="rounded-xl border border-border bg-card/45 backdrop-blur-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <Database className="h-4.5 w-4.5 text-primary shrink-0" />
              <h3 className="text-xs font-semibold text-white">Workspace Data Management</h3>
            </div>

            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="text-white font-medium block">Backup local settings configuration</span>
                <span className="text-[9.5px] text-muted-foreground mt-0.5">Export active preferences structure layout payload to JSON file.</span>
              </div>
              <button 
                onClick={handleExportData}
                className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Data</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: CTA Panel */}
        <div className="flex flex-col gap-6">
          
          <div className="rounded-xl border border-border bg-card/45 backdrop-blur-xl p-6 flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-white">Apply Preferences</h3>
            <p className="text-[10px] text-muted-foreground">Changes will update details immediately across the active session.</p>
            {saveStatus && (
              <span className="text-[10px] text-emerald-400 font-semibold text-center animate-pulse">Preferences saved!</span>
            )}
            <button 
              onClick={handleSave}
              className="w-full py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:opacity-95 transition-opacity cursor-pointer shadow-md shadow-primary/10"
            >
              Save Settings
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
export default SettingsView;
