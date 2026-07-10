import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, Opportunity, Job, Goal, Notification, StartupIdea, Application, ApplicationStatus } from "./types";
import { mockOpportunities, mockJobs, defaultGoals, mockNotifications } from "./data/mockData";

// Components
import LandingPage from "./components/LandingPage";
import AuthScreen from "./components/AuthScreen";
import AIOnboarding from "./components/AIOnboarding";
import AIDashboard from "./components/AIDashboard";
import OpportunityExplorer from "./components/OpportunityExplorer";
import CareerCopilot from "./components/CareerCopilot";
import JobHub from "./components/JobHub";
import StartupIncubator from "./components/StartupIncubator";
import FinancePlanner from "./components/FinancePlanner";
import GoalTracker from "./components/GoalTracker";
import Settings from "./components/Settings";

// Icons
import {
  Sparkles,
  Award,
  Brain,
  Briefcase,
  Users,
  Rocket,
  DollarSign,
  Target,
  Settings as SettingsIcon,
  LogOut,
  Flame,
  Menu,
  X,
  Copy,
  Download,
  ShieldCheck,
  Check,
  ArrowRight
} from "lucide-react";

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<"landing" | "auth" | "onboarding" | "app">("landing");
  
  // Server-side persistent session verification states
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [googleEmailForSignup, setGoogleEmailForSignup] = useState<string | undefined>(undefined);
  const [showWelcomeCredentials, setShowWelcomeCredentials] = useState(false);
  const [generatedLuminaId, setGeneratedLuminaId] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copiedCredentials, setCopiedCredentials] = useState(false);
  const [showDemoWelcomeModal, setShowDemoWelcomeModal] = useState(false);

  // Core Persistent State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [startups, setStartups] = useState<StartupIdea[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  // Load from Server-Side session and fallbacks
  useEffect(() => {
    const verifyAndLoadSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        
        if (data.authenticated) {
          setProfile(data.profile);
          setCurrentScreen("app");
        } else {
          // If no active secure server session, force login/landing screen for security
          setCurrentScreen("landing");
        }
      } catch (err) {
        console.error("Secure session verification failed:", err);
        setCurrentScreen("landing");
      } finally {
        // Luxuriously timed delay for gorgeous state synchronization
        setTimeout(() => {
          setIsCheckingSession(false);
        }, 1200);
      }
    };

    // Populate local mock repositories
    try {
      const storedOpps = localStorage.getItem("lumina_opps");
      setOpportunities(storedOpps ? JSON.parse(storedOpps) : mockOpportunities);

      const storedJobs = localStorage.getItem("lumina_jobs");
      setJobs(storedJobs ? JSON.parse(storedJobs) : mockJobs);

      const storedGoals = localStorage.getItem("lumina_goals");
      setGoals(storedGoals ? JSON.parse(storedGoals) : defaultGoals);

      const storedNotifs = localStorage.getItem("lumina_notifs");
      setNotifications(storedNotifs ? JSON.parse(storedNotifs) : mockNotifications);

      const storedStartups = localStorage.getItem("lumina_startups");
      setStartups(storedStartups ? JSON.parse(storedStartups) : []);

      const storedApps = localStorage.getItem("lumina_applications");
      setApplications(storedApps ? JSON.parse(storedApps) : []);
    } catch (e) {
      console.error("Failed to parse LocalStorage records:", e);
    }

    verifyAndLoadSession();
  }, []);

  // Save changes to LocalStorage helpers
  const handleCopyCredentials = () => {
    const creds = `Lumina ID: ${generatedLuminaId}\nPassword: ${generatedPassword}`;
    navigator.clipboard.writeText(creds);
    setCopiedCredentials(true);
    setTimeout(() => setCopiedCredentials(false), 2000);
  };

  const handleDownloadRecoveryCard = () => {
    const recoveryText = `
=====================================================
            LUMINA-AI SECURITY APPARATUS
               ACCOUNT RECOVERY CARD
=====================================================
TIMESTAMP: ${new Date().toUTCString()}
LUMINA ID: ${generatedLuminaId}
PASSWORD:  ${generatedPassword}
=====================================================
SECURITY ADVISORY:
Keep this document secure. This generated secret key
passcode serves as your direct access into the Lumina
zero-trust Career Operating System workspace.

You may use these credentials to sign in directly
on the Lumina-AI portal.
=====================================================
`;
    const element = document.createElement("a");
    const file = new Blob([recoveryText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Lumina_Recovery_Card_${generatedLuminaId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const saveProfile = (p: UserProfile | null) => {
    setProfile(p);
    if (p) localStorage.setItem("lumina_profile", JSON.stringify(p));
    else localStorage.removeItem("lumina_profile");
  };

  const saveGoals = (g: Goal[]) => {
    setGoals(g);
    localStorage.setItem("lumina_goals", JSON.stringify(g));
  };

  const saveNotifications = (n: Notification[]) => {
    setNotifications(n);
    localStorage.setItem("lumina_notifs", JSON.stringify(n));
  };

  const saveStartups = (st: StartupIdea[]) => {
    setStartups(st);
    localStorage.setItem("lumina_startups", JSON.stringify(st));
  };

  const saveApplications = (ap: Application[]) => {
    setApplications(ap);
    localStorage.setItem("lumina_applications", JSON.stringify(ap));
  };

  // State manipulation triggers
  const handleOnboardingComplete = async (newProfile: UserProfile) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: googleEmailForSignup,
          profile: newProfile,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Lumina user registration failed:", data.error);
        // Fallback local persistence if server is unresponsive
        saveProfile(newProfile);
        setCurrentScreen("app");
        return;
      }

      // Store generated credentials for Welcome Credentials display
      setGeneratedLuminaId(data.luminaId);
      setGeneratedPassword(data.rawPassword);
      
      // Update profile with onboarding completed and secure ID
      const finalProfile = {
        ...data.profile,
        luminaId: data.luminaId,
      };
      saveProfile(finalProfile);
      
      // Show Welcome Credentials Modal
      setShowWelcomeCredentials(true);
    } catch (err) {
      console.error("Network error during secure registration:", err);
      saveProfile(newProfile);
      setCurrentScreen("app");
    }

    // Dynamic, stage-specific initial milestones (goals)
    let stageGoals: Goal[] = [];
    if (newProfile.stage === "school") {
      stageGoals = [
        {
          id: "goal-school-1",
          title: "Explore STEM Free Courses",
          description: "Browse edX, Coursera, and MIT OpenCourseWare for youth-focused computer science or physics courses.",
          category: "Study Plan",
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          completed: false,
          progress: 0,
        },
        {
          id: "goal-school-2",
          title: "Research Olympiads & Competitions",
          description: "Look up youth science fairs, high school hackathons, or mathematical Olympiads matching your profile.",
          category: "Weekly Action",
          targetDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          completed: false,
          progress: 0,
        },
        {
          id: "goal-school-3",
          title: "Map Out Dream Career Path",
          description: "Engage the AI Career Copilot to query academic routes and standard prerequisites for your dream job.",
          category: "Skill Gap",
          targetDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          completed: false,
          progress: 0,
        }
      ];
    } else if (newProfile.stage === "college") {
      stageGoals = [
        {
          id: "goal-college-1",
          title: "Analyze Resume for Gaps",
          description: "Upload or input your draft credentials to the Career Copilot for instant AI-based scoring & key improvements.",
          category: "Skill Gap",
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          completed: false,
          progress: 0,
        },
        {
          id: "goal-college-2",
          title: "Save 3 Summer Internships",
          description: "Browse the Internship Hub listings and save those with high compatibility match indices.",
          category: "Weekly Action",
          targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          completed: false,
          progress: 0,
        },
        {
          id: "goal-college-3",
          title: "Book Academic Advisory Call",
          description: "Schedule a mentoring slot with Dr. Anjali Mehta to calibrate research fellowships or post-grad targets.",
          category: "Study Plan",
          targetDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          completed: false,
          progress: 0,
        }
      ];
    } else {
      stageGoals = [
        {
          id: "goal-prof-1",
          title: "Initiate Professional Gap Review",
          description: "Perform a comprehensive skill checklist audit on Career Copilot to strategize promotion or switching routes.",
          category: "Skill Gap",
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          completed: false,
          progress: 0,
        },
        {
          id: "goal-prof-2",
          title: "Benchmark Target Compensation",
          description: "Query career-switching salary scales and organize negotiation milestones inside the Finance Planner.",
          category: "Weekly Action",
          targetDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          completed: false,
          progress: 0,
        },
        {
          id: "goal-prof-3",
          title: "Review Leadership Certifications",
          description: "Consult the Advisor network regarding high-impact certificates (PMP, AWS Solutions, Scrum Master).",
          category: "Study Plan",
          targetDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          completed: false,
          progress: 0,
        }
      ];
    }
    saveGoals(stageGoals);

    // Initial Welcome Notification customized to stage
    const welcomeNotif: Notification = {
      id: `notif-onboard-${Date.now()}`,
      title: "Lumina Workspace Calibrated",
      content: `Welcome to Lumina! Your interface is tailored with specialized metrics for ${newProfile.stage === "school" ? "Young Scholar exploration" : newProfile.stage === "college" ? "College career building" : "Working Professional advancement"}.`,
      type: "System",
      read: false,
      timestamp: "Just now",
    };
    saveNotifications([welcomeNotif]);

    // If startup interest was checked, pre-populate a smart, tailored startup concept
    if (newProfile.startupInterest && newProfile.startupIdea) {
      const stageDescriptor = newProfile.stage === "school" ? "STEM Competition Project" : "Commercial Innovation";
      const newStartup = {
        id: `startup-${Date.now()}`,
        name: `${newProfile.name}'s ${stageDescriptor}`,
        description: newProfile.startupIdea,
        validationStatus: "Idle" as const,
        readinessScore: 30,
        marketAnalysis: "Awaiting analysis from Gemini API...",
        feedback: "Your concept is logged. Run our Gemini lean canvas wizard in the incubator tab to outline customer profiles.",
        canvas: null,
        grantDiscovery: [
          newProfile.stage === "school" ? "Lumina Future Scholar Grant ($1,000)" : "Venture Seed Funding Allocation ($5,000)",
          "Women Who Tech Emerging Founders Grant ($5,000)"
        ],
        actionPlan: [
          "Establish core problem hypotheses",
          "Conduct survey among peer user groups",
          "Draft a minimal viable product (MVP) design outline"
        ]
      };
      saveStartups([newStartup]);
    }

    setActiveTab("dashboard");
  };

  const handleToggleGoal = (id: string) => {
    const updated = goals.map((g) =>
      g.id === id ? { ...g, completed: !g.completed } : g
    );
    saveGoals(updated);
  };

  const handleAddGoal = (title: string, desc: string) => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title,
      description: desc || "Acquire necessary skills.",
      category: "Weekly Action",
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      completed: false,
      progress: 0,
    };
    saveGoals([...goals, newGoal]);
  };

  const handleDeleteGoal = (id: string) => {
    saveGoals(goals.filter((g) => g.id !== id));
  };

  const handleReadNotification = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const handleSaveOpportunity = (opp: Opportunity) => {
    const isExist = applications.some((app) => app.opportunityId === opp.id);
    if (isExist) return;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      opportunityId: opp.id,
      title: opp.title,
      category: opp.category,
      providerOrCompany: opp.provider,
      status: "Interested",
      notes: "Saved via Lumina Opportunity Intelligence Explorer.",
      deadline: opp.deadline,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    saveApplications([...applications, newApp]);

    // Push real Notification
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title: "Opportunity Added to Tracker",
      content: `"${opp.title}" is saved. Review eligibility checklists inside the Application Tracker.`,
      type: "System",
      read: false,
      timestamp: "Just now",
    };
    saveNotifications([newNotif, ...notifications]);
  };

  const handleTrackJob = (job: Job) => {
    const isExist = applications.some((app) => app.title === job.title && app.providerOrCompany === job.company);
    if (isExist) return;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      opportunityId: job.id,
      title: job.title,
      category: "Internship",
      providerOrCompany: job.company,
      status: "Interested",
      notes: "Saved from Job & Internship Hub.",
      deadline: "Flexible",
      updatedAt: new Date().toISOString().split("T")[0],
    };
    saveApplications([...applications, newApp]);
  };

  const handleUpdateAppStatus = (appId: string, status: ApplicationStatus) => {
    const updated = applications.map((app) =>
      app.id === appId
        ? { ...app, status, updatedAt: new Date().toISOString().split("T")[0] }
        : app
    );
    saveApplications(updated);
  };

  const handleAddStartup = (idea: StartupIdea) => {
    saveStartups([idea, ...startups]);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Express logout error:", e);
    }
    localStorage.removeItem("lumina_profile");
    setProfile(null);
    setCurrentScreen("landing");
  };

  const handleRealRegistration = async () => {
    setShowDemoWelcomeModal(false);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Express logout error:", e);
    }
    localStorage.removeItem("lumina_profile");
    setProfile(null);
    setCurrentScreen("auth");
  };

  const handleResetData = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    localStorage.clear();
    setProfile(null);
    setOpportunities(mockOpportunities);
    setJobs(mockJobs);
    setGoals(defaultGoals);
    setNotifications(mockNotifications);
    setStartups([]);
    setApplications([]);
    setActiveTab("dashboard");
    setCurrentScreen("landing");
  };

  // Multi-screen router for premium user experience flow
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center relative overflow-hidden" id="app-session-loader">
        {/* Subtle decorative mesh gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-violet/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

        {/* Outer glowing orbits */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-dashed border-brand-violet/40 animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-3 rounded-full border border-brand-cyan/25 animate-[spin_4s_linear_reverse_infinite]" />
          <div className="absolute inset-6 rounded-full border border-brand-magenta/30 animate-[pulse_2s_infinite]" />
          <div className="w-16 h-16 rounded-full bg-[#050508] border border-brand-violet/50 shadow-2xl shadow-brand-violet/40 flex items-center justify-center relative z-10">
            <Sparkles className="w-6 h-6 text-brand-cyan animate-pulse" />
          </div>
        </div>

        {/* Text descriptions */}
        <div className="text-center mt-8 space-y-2 z-10">
          <span className="block text-xs font-black tracking-widest uppercase text-brand-gold animate-pulse">Lumina OS Calibrating</span>
          <p className="text-xs text-gray-400 font-medium">Verifying secure zero-trust tunnel...</p>
        </div>
      </div>
    );
  }

  if (currentScreen === "landing") {
    return (
      <LandingPage
        onStart={() => setCurrentScreen("auth")}
        onExplore={() => setCurrentScreen("auth")}
      />
    );
  }

  if (currentScreen === "auth") {
    return (
      <AuthScreen
        onBack={() => setCurrentScreen("landing")}
        onAuthSuccess={(username, existingProfile, googleEmail) => {
          if (existingProfile) {
            // Existing user bypass onboarding
            saveProfile(existingProfile);
            if (existingProfile.isDemo) {
              setShowDemoWelcomeModal(true);
            }
            setCurrentScreen("app");
            return;
          }

          // New user signup
          setGoogleEmailForSignup(googleEmail);
          const initialName = username.split("@")[0];
          setProfile({
            name: initialName.charAt(0).toUpperCase() + initialName.slice(1),
            age: "21",
            country: "India",
            educationLevel: "Undergraduate",
            interests: [],
            careerGoals: [],
            skills: [],
            targetExams: [],
            preferredIndustries: [],
            startupInterest: false,
            startupIdea: "",
            mentorshipPreference: "",
            onboardingCompleted: false,
            streakDays: 1,
            lastActivityDate: new Date().toISOString().split("T")[0],
          });
          setCurrentScreen("onboarding");
        }}
      />
    );
  }

  if (currentScreen === "onboarding" || !profile || !profile.onboardingCompleted) {
    return (
      <div className="min-h-screen bg-brand-bg text-white flex items-center justify-center relative overflow-hidden" id="app-onboarding-container">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-violet/5 via-transparent to-brand-cyan/5 pointer-events-none" />
        <AIOnboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  // Sidebar navigation options
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Sparkles },
    { id: "opportunities", label: "Opportunity Engine", icon: Award },
    { id: "copilot", label: "AI Career Copilot", icon: Brain },
    { id: "jobs", label: "Job & Internship Hub", icon: Briefcase },
    { id: "incubator", label: "Startup Incubator", icon: Rocket },
    { id: "finance", label: "Finance Planner", icon: DollarSign },
    { id: "goals", label: "Milestones", icon: Target },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-gray-100 font-sans flex flex-col md:flex-row relative" id="app-main-layout">
      {/* Decorative abstract cosmic blur */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-violet/5 rounded-full blur-[120px] pointer-events-none" id="decor-glow-1" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none" id="decor-glow-2" />

      {/* Mobile Top Navigation Rail */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-brand-surface border-b border-white/5 z-50 w-full" id="mobile-top-header">
        <div className="flex items-center space-x-2" id="mobile-app-branding">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-violet to-brand-magenta flex items-center justify-center text-white" id="box-mobile-logo">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white font-display" id="lbl-mobile-brand">LUMINA AI</span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-400 hover:text-white"
          id="btn-mobile-menu-toggle"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar - Desktop Layout */}
      <aside
        className={`fixed md:sticky top-0 left-0 w-64 h-screen bg-brand-surface/95 md:bg-brand-surface/80 border-r border-white/5 p-6 flex flex-col justify-between z-40 transition-transform duration-300 transform md:transform-none backdrop-blur-xl ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        id="app-sidebar"
      >
        <div className="space-y-6" id="sidebar-top-section">
          {/* App Branding logo */}
          <div className="hidden md:flex items-center space-x-2.5" id="desktop-app-branding">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-magenta flex items-center justify-center text-white shadow-lg shadow-brand-violet/20 animate-pulse-glow" id="box-desktop-logo">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-black tracking-tight text-white font-display" id="lbl-desktop-brand">LUMINA AI</span>
              <span className="block text-[8px] text-gray-500 font-black uppercase tracking-widest">Career Operating System</span>
            </div>
          </div>

          {/* User Profile Summary */}
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between" id="sidebar-user-widget">
            <div className="max-w-[130px]">
              <span className="block text-xs font-bold text-white truncate" id="sidebar-username">{profile.name}</span>
              <span className="block text-[9px] text-gray-500 truncate" id="sidebar-user-edu">{profile.educationLevel}</span>
            </div>
            <div className="flex items-center space-x-1 bg-brand-magenta/10 px-2 py-0.5 rounded border border-brand-magenta/25 text-brand-magenta font-bold text-[10px]" id="sidebar-streak-badge">
              <Flame className="w-3.5 h-3.5" />
              <span>{profile.streakDays}</span>
            </div>
          </div>

          {/* Nav Items Link List */}
          <nav className="space-y-1" id="sidebar-navigation">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-brand-violet to-brand-magenta text-white shadow-lg shadow-brand-violet/10 font-bold"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                  id={`nav-item-${item.id}`}
                >
                  <IconComponent className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-white/5 space-y-1" id="sidebar-footer-section">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            id="btn-sidebar-signout"
          >
            <LogOut className="w-4 h-4 text-brand-magenta flex-shrink-0" />
            <span>Sign Out</span>
          </button>
          
          <button
            type="button"
            onClick={handleResetData}
            className="w-full flex items-center space-x-3 px-4 py-1.5 rounded-xl text-[10px] font-medium text-gray-500 hover:text-red-400 hover:bg-red-950/10 transition-all cursor-pointer"
            id="btn-sidebar-purge"
          >
            <X className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
            <span>Purge Dev Cache</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-x-hidden min-h-screen z-10 bg-brand-bg flex flex-col justify-between" id="app-workspace-viewport">
        <div className="flex-1 pb-8" id="viewport-content-wrapper">
          {activeTab === "dashboard" && (
            <AIDashboard
              profile={profile}
              opportunities={opportunities}
              goals={goals}
              notifications={notifications}
              onNavigate={(tab) => setActiveTab(tab)}
              onToggleGoal={handleToggleGoal}
              onReadNotification={handleReadNotification}
            />
          )}

          {activeTab === "opportunities" && (
            <OpportunityExplorer
              profile={profile}
              opportunities={opportunities}
              applications={applications}
              onSaveOpportunity={handleSaveOpportunity}
              onUpdateAppStatus={handleUpdateAppStatus}
            />
          )}

          {activeTab === "copilot" && (
            <CareerCopilot profile={profile} />
          )}

          {activeTab === "jobs" && (
            <JobHub
              profile={profile}
              jobs={jobs}
              applications={applications}
              onTrackJob={handleTrackJob}
            />
          )}

          {activeTab === "incubator" && (
            <StartupIncubator
              profile={profile}
              startups={startups}
              onAddStartup={handleAddStartup}
            />
          )}

          {activeTab === "finance" && (
            <FinancePlanner
              profile={profile}
              applications={applications}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === "goals" && (
            <GoalTracker
              profile={profile}
              goals={goals}
              onToggleGoal={handleToggleGoal}
              onAddGoal={handleAddGoal}
              onDeleteGoal={handleDeleteGoal}
            />
          )}

          {activeTab === "settings" && (
            <Settings
              profile={profile}
              onUpdateProfile={saveProfile}
              onResetData={handleResetData}
            />
          )}
        </div>

        {/* Elegant Footer Attribution */}
        <footer className="pt-6 border-t border-gray-800/40 text-center flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 relative" id="app-footer">
          <div className="flex items-center space-x-1.5" id="footer-credits">
            <span>Designed & Built by the</span>
            <span className="text-gray-400 font-semibold cursor-help transition-colors hover:text-brand-cyan relative group/tooltip" id="footer-team-trigger">
              Lumina-AI Team
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 bg-[#0e131b] border border-gray-800 text-[10px] text-gray-400 rounded-lg shadow-2xl opacity-0 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 pointer-events-none text-left z-50 leading-relaxed">
                <span className="block font-bold text-white mb-0.5">Lumina-AI Founders:</span>
                • Kartikeya Jagadale (Founder & Lead Architect)<br />
                • Atharva Jagadale (Senior AI Engineer)
              </span>
            </span>
          </div>
          <span className="mt-2 sm:mt-0 opacity-80" id="footer-tag">© 2026 Lumina Career OS. Empowering women in STEM.</span>
        </footer>
      </main>

      {/* WELCOME CREDENTIALS MODAL */}
      <AnimatePresence>
        {showWelcomeCredentials && (
          <div className="fixed inset-0 bg-[#020205]/95 backdrop-blur-3xl flex items-center justify-center z-50 p-4" id="welcome-credentials-modal">
            {/* Elegant golden and violet floating particles representing digital confetti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute w-2 h-2 bg-brand-gold rounded-full opacity-60 animate-bounce" style={{ top: "15%", left: "10%", animationDuration: "3s" }} />
              <div className="absolute w-1.5 h-1.5 bg-brand-violet rounded-full opacity-50 animate-bounce" style={{ bottom: "25%", right: "12%", animationDuration: "4s" }} />
              <div className="absolute w-[3px] h-[3px] bg-brand-cyan rounded-full opacity-40 animate-pulse" style={{ top: "45%", left: "30%" }} />
              <div className="absolute w-2 h-2 bg-brand-magenta rounded-full opacity-30 animate-pulse" style={{ top: "70%", left: "80%" }} />
            </div>

            <motion.div 
              initial={{ scale: 0.92, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 16 }}
              className="glass-card max-w-lg w-full p-8 border border-brand-gold/30 rounded-3xl shadow-2xl relative overflow-hidden space-y-6 text-center"
            >
              {/* Gold/Violet pulsing backdrop glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-violet/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-gold/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                {/* AI holographic orbits */}
                <div className="absolute inset-0 rounded-full border border-dashed border-brand-gold/50 animate-[spin_12s_linear_infinite]" />
                <div className="absolute inset-2 rounded-full border border-brand-violet/40 animate-[spin_8s_linear_reverse_infinite]" />
                <div className="w-12 h-12 rounded-full bg-brand-surface border border-brand-gold flex items-center justify-center shadow-lg shadow-brand-gold/30 z-10">
                  <ShieldCheck className="w-6 h-6 text-brand-gold animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest block">Calibrating Finished</span>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display leading-tight">🎉 Welcome to Lumina-AI</h2>
                <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                  Your Lumina account has been created successfully. These credentials can also be used to sign in if you ever choose not to use Google.
                </p>
              </div>

              {/* Terminal Box presenting Credentials */}
              <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-3.5 relative">
                <div className="absolute top-3 right-3 flex space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                </div>

                <div className="text-left space-y-3.5">
                  <div>
                    <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider">Lumina User ID</span>
                    <span className="block text-sm font-mono font-bold text-brand-cyan select-all selection:bg-brand-cyan/20">{generatedLuminaId}</span>
                  </div>

                  <div>
                    <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider">Temporary Password Secret</span>
                    <span className="block text-sm font-mono font-bold text-brand-gold select-all selection:bg-brand-gold/20">{generatedPassword}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons to copy and download */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleCopyCredentials}
                  className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {copiedCredentials ? (
                    <>
                      <Check className="w-4 h-4 text-brand-emerald" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gray-400" />
                      <span>Copy Credentials</span>
                    </>
                  )}
                </button>

                <button 
                  onClick={handleDownloadRecoveryCard}
                  className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-gray-400" />
                  <span>Recovery Card (.txt)</span>
                </button>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => {
                    setShowWelcomeCredentials(false);
                    setCurrentScreen("app");
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-brand-violet to-brand-magenta hover:shadow-xl hover:shadow-brand-violet/20 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Continue to Dashboard</span>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DEMO WELCOME MODAL */}
      <AnimatePresence>
        {showDemoWelcomeModal && (
          <div className="fixed inset-0 bg-[#020205]/90 backdrop-blur-3xl flex items-center justify-center z-[100] p-4" id="demo-welcome-modal">
            {/* Elegant glowing floating particles representing high-tech microelements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute w-2 h-2 bg-brand-cyan rounded-full opacity-60 animate-bounce" style={{ top: "20%", left: "15%", animationDuration: "3.5s" }} />
              <div className="absolute w-2.5 h-2.5 bg-brand-violet rounded-full opacity-50 animate-pulse" style={{ bottom: "30%", right: "18%", animationDuration: "5s" }} />
              <div className="absolute w-1.5 h-1.5 bg-brand-gold rounded-full opacity-40 animate-pulse" style={{ top: "50%", left: "25%" }} />
              <div className="absolute w-3 h-3 bg-brand-magenta rounded-full opacity-35 animate-bounce" style={{ bottom: "15%", left: "75%", animationDuration: "4s" }} />
            </div>

            <motion.div 
              initial={{ scale: 0.90, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.90, y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
              className="glass-card max-w-lg w-full p-8 border border-brand-violet/40 rounded-3xl shadow-2xl relative overflow-hidden space-y-6 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(15, 10, 30, 0.75) 0%, rgba(5, 5, 12, 0.95) 100%)",
                boxShadow: "0 0 50px rgba(124, 58, 237, 0.15), inset 0 0 20px rgba(124, 58, 237, 0.05)"
              }}
            >
              {/* Neon violet/cyan glow fields inside the card */}
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-brand-violet/25 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-brand-cyan/25 rounded-full blur-[100px] pointer-events-none" />

              {/* Holographic glowing shimmer logo representation */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-dashed border-brand-cyan/60 animate-[spin_15s_linear_infinite]" />
                <div className="absolute inset-3 rounded-full border border-brand-violet/50 animate-[spin_10s_linear_reverse_infinite]" />
                <div className="absolute inset-6 bg-gradient-to-tr from-brand-violet to-brand-cyan opacity-20 blur-xl rounded-full animate-pulse" />
                <div className="w-14 h-14 rounded-full bg-brand-surface border border-brand-cyan flex items-center justify-center shadow-lg shadow-brand-cyan/40 relative z-10">
                  <Sparkles className="w-7 h-7 text-brand-cyan animate-pulse" />
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest block bg-brand-violet/20 py-1 px-3 rounded-full w-max mx-auto border border-brand-violet/30 animate-pulse">Sandbox Environment</span>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display leading-tight">
                  ✨ Welcome to the Lumina-AI Demo Experience
                </h2>
                <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                  You're exploring a fully featured demonstration workspace with realistic sample data designed to showcase every major feature of Lumina-AI.
                </p>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl max-w-sm mx-auto text-[11px] text-brand-gold font-medium flex items-center justify-center space-x-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-brand-gold animate-ping" />
                  <span>This workspace is read-only and intended for preview purposes.</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                <button 
                  onClick={async () => {
                    setShowDemoWelcomeModal(false);
                    // Add welcoming notification as AI greeting to show in notifications
                    const welcomeNotif = {
                      id: `demo-welcome-${Date.now()}`,
                      title: "✨ Sandbox Initialized",
                      content: "Welcome to the Lumina-AI Demo Workspace. Feel free to explore every feature.",
                      type: "System" as any,
                      read: false,
                      timestamp: "Just now"
                    };
                    saveNotifications([welcomeNotif, ...notifications]);
                  }}
                  className="py-3.5 bg-gradient-to-r from-brand-violet to-brand-magenta hover:shadow-xl hover:shadow-brand-violet/20 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 border border-white/10"
                >
                  <span>Explore Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button 
                  onClick={handleRealRegistration}
                  className="py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Start Real Registration</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
