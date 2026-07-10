import React, { useState } from "react";
import { UserProfile } from "../types";
import { Settings as SettingsIcon, Save, RefreshCw, Trash2, CheckCircle } from "lucide-react";

interface SettingsProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetData: () => void;
}

export default function Settings({ profile, onUpdateProfile, onResetData }: SettingsProps) {
  const [name, setName] = useState(profile.name);
  const [country, setCountry] = useState(profile.country);
  const [startupIdea, setStartupIdea] = useState(profile.startupIdea || "");
  const [educationLevel, setEducationLevel] = useState(profile.educationLevel);
  const [streakDays, setStreakDays] = useState(profile.streakDays);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name,
      country,
      startupIdea,
      educationLevel,
      streakDays,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto" id="settings-root">
      {/* Title */}
      <div id="settings-title-wrapper">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2" id="title-settings">
          <SettingsIcon className="w-5 h-5 text-blue-400 animate-spin" style={{ animationDuration: "12s" }} />
          <span>Lumina System Settings</span>
        </h1>
        <p className="text-xs text-gray-400" id="desc-settings">Calibrate active profile metadata, adjust study streak days, or reset development databases</p>
      </div>

      {/* Main Settings Panel */}
      <div className="bg-[#0e131b]/95 border border-gray-800 rounded-2xl p-6" id="box-settings-panel">
        <form onSubmit={handleSave} className="space-y-5" id="settings-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="grid-settings-inputs">
            <div>
              <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-[#11161d] border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="input-set-name"
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Country of Residency</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-[#11161d] border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                id="input-set-country"
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Education Level</label>
              <select
                className="w-full px-4 py-2.5 bg-[#11161d] border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                id="select-set-edu"
              >
                <option>Undergraduate (Computer Science / STEM)</option>
                <option>Undergraduate (Business / Arts)</option>
                <option>Master's Student (Research/Industry)</option>
                <option>Ph.D. Scholar / PostDoc Researcher</option>
                <option>High School / Innovator</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Streak Days (Mock)</label>
              <input
                type="number"
                className="w-full px-4 py-2.5 bg-[#11161d] border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                value={streakDays}
                onChange={(e) => setStreakDays(Number(e.target.value))}
                id="input-set-streak"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Startup Concept Description</label>
            <textarea
              className="w-full px-4 py-2.5 bg-[#11161d] border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 h-24 resize-none"
              value={startupIdea}
              onChange={(e) => setStartupIdea(e.target.value)}
              id="textarea-set-startup"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-850" id="settings-actions">
            {isSaved ? (
              <span className="text-emerald-400 text-xs font-semibold flex items-center space-x-1.5" id="lbl-settings-saved">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
                <span>Profiles Calibrated!</span>
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs flex items-center space-x-1.5 transition-colors shadow-lg shadow-blue-500/10"
              id="btn-save-settings"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* About Lumina-AI Section */}
      <div className="bg-[#0e131b]/95 border border-purple-950/40 rounded-2xl p-6 space-y-4 relative overflow-hidden" id="box-about-lumina">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

        <div id="about-header" className="border-b border-gray-800/60 pb-3">
          <span className="block text-[10px] text-purple-400 font-bold uppercase tracking-wider">PROJECT INTELLECT</span>
          <h3 className="text-sm font-bold text-white mt-0.5">About Lumina-AI</h3>
          <p className="text-[11px] text-gray-400 italic mt-1.5 leading-relaxed">
            "Designed and engineered with a vision to empower women through AI-driven career intelligence."
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="about-credits">
          <div className="p-3 bg-gray-900/30 border border-gray-850 rounded-xl" id="credit-founder">
            <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider">Founder & Lead Architect</span>
            <span className="block text-xs font-semibold text-white mt-1">Kartikeya Jagadale</span>
          </div>

          <div className="p-3 bg-gray-900/30 border border-gray-850 rounded-xl" id="credit-engineer">
            <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider">Senior AI Engineer</span>
            <span className="block text-xs font-semibold text-white mt-1">Atharva Jagadale</span>
          </div>

          <div className="p-3 bg-gray-900/30 border border-gray-850 rounded-xl" id="credit-designer">
            <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider">Product Designer</span>
            <span className="block text-xs font-semibold text-white mt-1">Kartikeya & Atharva</span>
          </div>
        </div>
      </div>

      {/* Dev Reset Cache Card */}
      <div className="bg-[#0e131b]/95 border border-red-950/40 rounded-2xl p-6 space-y-4" id="box-danger-zone">
        <div id="danger-header">
          <span className="block text-[10px] text-red-500 font-bold uppercase tracking-wider">SYSTEM DANGER ZONE</span>
          <h3 className="text-xs font-bold text-white mt-0.5">Purge Dev Local Cache Databases</h3>
          <p className="text-[10.5px] text-gray-400 mt-1">
            This action will clear all saved study goals, matched advisory schedules, cover letter drafts, and return you back to step 1 AI Onboarding.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm("Are you sure you want to purge all Lumina profile caches? This will restart onboarding.")) {
              onResetData();
            }
          }}
          className="px-4 py-2 bg-red-950/20 hover:bg-red-900/35 text-red-400 border border-red-900/50 hover:border-red-500 font-semibold rounded-lg text-xs flex items-center space-x-1.5 transition-colors"
          id="btn-reset-databases"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Caches & Re-Onboard</span>
        </button>
      </div>
    </div>
  );
}
