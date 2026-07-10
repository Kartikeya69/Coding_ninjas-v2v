'use client';

import React from 'react';
import { User, Mail, MapPin, Briefcase, Award, Save, GraduationCap, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const ProfileView: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 select-none animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-sans">Professional Portfolio</h2>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Manage your credentials, track accomplishments, and review saved jobs and scholarships.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card/45 backdrop-blur-xl p-6 flex flex-col items-center text-center gap-4 relative overflow-hidden">
            {/* Soft background radial color */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary to-secondary" />

            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Avatar"
                className="h-20 w-20 rounded-full border-2 border-primary/20 object-cover shadow-md mt-4"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-linear-to-tr from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white uppercase shadow-md mt-4">
                {user?.displayName ? user.displayName.slice(0, 2) : 'LU'}
              </div>
            )}

            <div>
              <h3 className="text-xs font-semibold text-white mt-1 leading-snug">{user?.displayName || 'Career Pioneer'}</h3>
              <p className="text-[10px] text-muted-foreground mt-1">Full Stack Developer aspirant</p>
            </div>

            <div className="w-full flex flex-col gap-2.5 text-left border-t border-border/60 pt-4 text-xs text-muted-foreground mt-2">
              <div className="flex items-center gap-2 text-white">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate">{user?.email || 'user@lumina-ai.com'}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>Entry Level</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Statistics & Saved elements */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card/40 text-center">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">Resume ATS</span>
              <span className="text-sm font-bold text-white block mt-1">74%</span>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card/40 text-center">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">Interview Prep</span>
              <span className="text-sm font-bold text-white block mt-1">Stage 2</span>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card/40 text-center">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">Roadmaps</span>
              <span className="text-sm font-bold text-white block mt-1">1 Active</span>
            </div>
          </div>

          {/* Saved Items lists */}
          <div className="rounded-xl border border-border bg-card/45 backdrop-blur-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Save className="h-4 w-4 text-primary shrink-0" />
              <h3 className="text-xs font-semibold text-white">Saved & Watchlist Items</h3>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-muted/10 border border-border/60 text-xs text-white">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                  <span>Grace Hopper Celebration Scholar Program (anitab.org)</span>
                </div>
                <span className="text-[9px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md shrink-0">
                  Diversity fund
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-muted/10 border border-border/60 text-xs text-white">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                  <span>Frontend Developer at Vercel</span>
                </div>
                <span className="text-[9px] font-mono text-secondary bg-secondary/10 px-2 py-0.5 rounded-md shrink-0">
                  94% Match
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default ProfileView;
