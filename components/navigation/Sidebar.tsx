'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Wallet, 
  User, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { sidebarNavigation } from '../../config/navigation';
import { logoutUser } from '../../firebase/auth';
import { logger } from '../../lib/logger';

// Map string icon names to Lucide icons for safety
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  FileText,
  GraduationCap,
  Briefcase,
  Users,
  Wallet,
  User,
  Settings,
};

interface SidebarProps {
  className?: string;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, onCloseMobile }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      logger.info('Signing out user...');
      await logoutUser();
      router.push('/login');
    } catch (err) {
      logger.error('Error during sign out', err);
    }
  };

  return (
    <aside className={cn(
      "w-[280px] h-screen border-r border-border bg-card/40 backdrop-blur-xl flex flex-col justify-between py-6 px-4 shrink-0",
      className
    )}>
      {/* Branding */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2.5 px-2">
          <div className="h-9 w-9 rounded-lg bg-linear-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white font-sans">Lumina AI</h1>
            <p className="text-[10px] text-muted-foreground tracking-wider font-mono">CAREER OS</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-6 overflow-y-auto pr-1">
          {sidebarNavigation.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest px-2 font-sans">
                {section.title}
              </span>
              <ul className="flex flex-col gap-1 list-none p-0 m-0">
                {section.items.map((item) => {
                  const Icon = iconMap[item.icon] || Sparkles;
                  const isActive = pathname === item.href;
                  
                  return (
                    <li key={item.href}>
                      <Link 
                        href={item.href}
                        onClick={onCloseMobile}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative",
                          isActive 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-muted-foreground hover:bg-muted/30 hover:text-white"
                        )}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-primary" />
                        )}
                        <Icon className={cn(
                          "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                          isActive ? "text-primary" : "text-muted-foreground/80 group-hover:text-white"
                        )} />
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / Sign Out */}
      <div className="pt-4 border-t border-border/60">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-accent/10 hover:text-accent transition-all duration-200 cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
