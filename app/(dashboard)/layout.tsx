'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../components/navigation/Sidebar';
import { Topbar } from '../../components/navigation/Topbar';
import { CommandPalette } from '../../components/navigation/CommandPalette';
import { CoachPanel } from '../../modules/coach/CoachPanel';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Desktop Sidebar (hidden on mobile) */}
      <Sidebar className="hidden md:flex" />

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-background/80 backdrop-blur-xs">
          <Sidebar 
            className="flex animate-in slide-in-from-left duration-200" 
            onCloseMobile={() => setMobileSidebarOpen(false)} 
          />
          <div 
            className="flex-1 cursor-pointer" 
            onClick={() => setMobileSidebarOpen(false)} 
          />
        </div>
      )}

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        
        {/* Router Subpage Content */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0c]/60 glowing-grid">
          {children}
        </main>

        {/* Global Floating Coach Assistant & spotlight search */}
        <CoachPanel />
        <CommandPalette />
      </div>
    </div>
  );
}
