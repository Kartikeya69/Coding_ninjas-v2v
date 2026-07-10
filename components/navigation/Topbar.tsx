'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  User as UserIcon, 
  Settings as SettingsIcon, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../firebase/auth';
import { useRouter } from 'next/navigation';
import { cn } from '../../utils/cn';

interface TopbarProps {
  onToggleMobileSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileSidebar }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSignOut = async () => {
    try {
      await logoutUser();
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar / Mob Trigger */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-white transition-colors cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* AI Command Search Bar */}
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search career tracks, ask AI, find scholarships... (Press ⌘K)"
            className="w-full bg-card/60 border border-border/80 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-muted-foreground focus:outline-hidden focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all font-sans"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
            <kbd className="h-4 px-1 rounded bg-muted/60 text-[9px] font-mono text-muted-foreground flex items-center justify-center">⌘</kbd>
            <kbd className="h-4 px-1 rounded bg-muted/60 text-[9px] font-mono text-muted-foreground flex items-center justify-center">K</kbd>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="flex items-center gap-4">
        {/* Notification Center */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2.5 hover:bg-muted/50 rounded-full text-muted-foreground hover:text-white transition-all relative cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {/* Glowing dot notification badge */}
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-ping" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          </button>

          {/* Simple Notifications Modal */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-xl border border-border bg-card/95 backdrop-blur-xl p-4 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
                <span className="text-xs font-semibold text-white">Notifications</span>
                <span className="text-[10px] text-primary hover:underline cursor-pointer">Mark all read</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-primary/10">
                  <div className="flex items-center gap-1.5 text-[11px] text-primary font-medium mb-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>AI Career Coach</span>
                  </div>
                  <p className="text-[11px] text-white">Your custom ML Roadmap is generated. Take a look!</p>
                  <span className="text-[9px] text-muted-foreground mt-1 block">5m ago</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                  <p className="text-[11px] text-white font-medium">New Mentor Match Found</p>
                  <p className="text-[11px] text-muted-foreground">Sarah Jenkins approved your meeting request.</p>
                  <span className="text-[9px] text-muted-foreground mt-1 block">2h ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar / Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 cursor-pointer focus:outline-hidden"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Avatar"
                className="h-8 w-8 rounded-full border border-primary/20 object-cover shadow-sm"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-linear-to-tr from-primary to-secondary flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm">
                {user?.displayName ? user.displayName.slice(0, 2) : 'LU'}
              </div>
            )}
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-medium text-white line-clamp-1">{user?.displayName || 'Career Pioneer'}</span>
              <span className="text-[10px] text-muted-foreground line-clamp-1">{user?.email || 'user@lumina.com'}</span>
            </div>
          </button>

          {/* Profile Dropdown Modal */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 rounded-xl border border-border bg-card/95 backdrop-blur-xl p-2.5 shadow-xl z-50">
              <div className="px-2.5 py-1.5 border-b border-border/60 mb-2">
                <p className="text-xs font-semibold text-white truncate">{user?.displayName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              </div>
              <ul className="flex flex-col gap-0.5 list-none p-0 m-0">
                <li>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push('/profile');
                    }}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-muted-foreground hover:bg-muted/50 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <UserIcon className="h-3.5 w-3.5" />
                    <span>My Profile</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push('/settings');
                    }}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-muted-foreground hover:bg-muted/50 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <SettingsIcon className="h-3.5 w-3.5" />
                    <span>Account Settings</span>
                  </button>
                </li>
                <li className="border-t border-border/60 my-1 pt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-accent hover:bg-accent/10 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Topbar;
