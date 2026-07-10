import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Mail, 
  Lock, 
  LogIn, 
  ShieldCheck, 
  ArrowLeft, 
  Chrome, 
  Github, 
  User, 
  Check, 
  X, 
  Briefcase,
  AlertCircle,
  UserPlus,
  KeyRound,
  ExternalLink,
  ShieldAlert,
  Wrench,
  RefreshCw
} from "lucide-react";
import PasswordReset from "./PasswordReset";

interface AuthScreenProps {
  onBack: () => void;
  onAuthSuccess: (username: string, profile: any, googleEmail?: string) => void;
}

const FIREBASE_ERRORS: Record<string, {
  title: string;
  code: string;
  status: number;
  description: string;
  checklist: string[];
  links: { label: string; url: string }[];
}> = {
  "auth/invalid-api-key": {
    title: "Firebase 400: Invalid API Key",
    code: "auth/invalid-api-key",
    status: 400,
    description: "The API key configured in your web application credentials is invalid, has expired, or has not been initialized correctly.",
    checklist: [
      "Confirm that your .env or configuration has the correct API key.",
      "Check Google Cloud Console to ensure key restrictions aren't blocking local origins.",
      "Re-verify your firebase-blueprint.json specifications."
    ],
    links: [
      { label: "Google APIs Credentials Console", url: "https://console.cloud.google.com/apis/credentials" },
      { label: "Firebase Console Project Overview", url: "https://console.firebase.google.com/" }
    ]
  },
  "auth/operation-not-allowed": {
    title: "Firebase 400: Sign-In Provider Disabled",
    code: "auth/operation-not-allowed",
    status: 400,
    description: "Google or GitHub OAuth Sign-In is disabled for this Firebase project. The server rejected the incoming handshake.",
    checklist: [
      "Navigate to your Firebase Console -> Authentication.",
      "Under the 'Sign-in method' tab, enable Google or GitHub.",
      "Make sure to save changes and specify client ID / secrets if required."
    ],
    links: [
      { label: "Firebase Sign-In Method Panel", url: "https://console.firebase.google.com/project/_/authentication/providers" },
      { label: "Firebase Google Auth Docs", url: "https://firebase.google.com/docs/auth/web/google-signin" }
    ]
  },
  "auth/unauthorized-domain": {
    title: "Firebase 400: Domain Unauthorized",
    code: "auth/unauthorized-domain",
    status: 400,
    description: "The current web origin is not authorized for OAuth redirection within Firebase's secure frame authorization.",
    checklist: [
      "Add current hosting domain to your Authorized Domains list.",
      "Go to Firebase Console -> Authentication -> Settings -> Authorized domains.",
      "Ensure local testing ports (e.g., localhost:3000) are also whitelisted."
    ],
    links: [
      { label: "Firebase Authorized Domains Settings", url: "https://console.firebase.google.com/project/_/authentication/settings" }
    ]
  },
  "auth/user-not-found": {
    title: "Firebase 404: Account Not Registered",
    code: "auth/user-not-found",
    status: 404,
    description: "There is no corresponding user record in Firebase Authentication matching the supplied identifier.",
    checklist: [
      "Switch to the 'Sign Up' tab above to request a fresh secure account.",
      "If you registered previously, verify you are entering the correct Lumina ID / Email.",
      "If using simulated login, check database.json records."
    ],
    links: [
      { label: "Firebase User Table Viewer", url: "https://console.firebase.google.com/project/_/authentication/users" }
    ]
  },
  "auth/project-not-found": {
    title: "Firebase 404: Project Not Found",
    code: "auth/project-not-found",
    status: 404,
    description: "The specified Firebase project identifier was not found on the secure server framework.",
    checklist: [
      "Check that your firebaseConfig has the correct project ID.",
      "Verify the Google Cloud project hasn't been suspended or deleted."
    ],
    links: [
      { label: "Firebase Support Center", url: "https://firebase.google.com/support" }
    ]
  }
};

export default function AuthScreen({ onBack, onAuthSuccess }: AuthScreenProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [error, setError] = useState("");
  const [firebaseDiagnostics, setFirebaseDiagnostics] = useState<any | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Custom Google SSO flow states
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleInputEmail, setGoogleInputEmail] = useState("");
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);
  const [showCinematicModal, setShowCinematicModal] = useState(false);
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState("");

  // Forgot Password flow states
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Track focused state for floating labels and neon borders
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [isDemoEnabled, setIsDemoEnabled] = useState(false);

  useEffect(() => {
    fetch("/api/auth/demo-config")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.isDemoEnabled === "boolean") {
          setIsDemoEnabled(data.isDemoEnabled);
        }
      })
      .catch((err) => console.error("Error loading demo config:", err));
  }, []);

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Demo login failed");
      }
      // Call onAuthSuccess with the demo user details
      onAuthSuccess(data.luminaId, data.profile, data.email);
    } catch (err: any) {
      console.error("Demo login error:", err);
      setError(err.message || "Unable to initiate demo connection");
    } finally {
      setIsLoading(false);
    }
  };

  // Clean error after 5s or as they type
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const checkPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: "", score: 0, color: "", glow: "" };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { label: "Weak", score: 25, color: "bg-red-500", glow: "shadow-red-500/20 border-red-500/40 text-red-400" };
    if (score <= 3) return { label: "Medium", score: 50, color: "bg-amber-500", glow: "shadow-amber-500/20 border-amber-500/40 text-amber-400" };
    if (score === 4) return { label: "Strong", score: 75, color: "bg-emerald-500", glow: "shadow-emerald-500/20 border-emerald-500/40 text-emerald-400" };
    return { label: "Excellent", score: 100, color: "bg-gradient-to-r from-brand-violet to-brand-gold", glow: "shadow-brand-violet/40 border-brand-violet/40 text-brand-gold font-bold" };
  };

  const strength = checkPasswordStrength(password);

  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const isNameValid = name.trim().length >= 2;
  const isPasswordValid = password.length >= 6;
  const arePasswordsMatching = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSignUp) {
      if (!isNameValid) {
        setError("Please supply a valid name (at least 2 letters)");
        return;
      }
      if (!isEmailValid) {
        setError("Please specify a valid professional email address");
        return;
      }
      if (!isPasswordValid) {
        setError("Password must be at least 6 characters");
        return;
      }
      if (!arePasswordsMatching) {
        setError("Secret Key passwords do not match");
        return;
      }
      if (!agreedTerms) {
        setError("You must accept the Lumina security protocols");
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onAuthSuccess(email, null); // Start onboarding
      }, 1000);
    } else {
      if (!email.trim()) {
        setError("Please supply your Lumina ID or Email");
        return;
      }
      if (!password) {
        setError("Please supply your password secret key");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/login-lumina", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
          if (response.status === 404) {
            setFirebaseDiagnostics(FIREBASE_ERRORS["auth/user-not-found"]);
            setError("");
          } else if (response.status === 400) {
            setFirebaseDiagnostics(FIREBASE_ERRORS["auth/invalid-api-key"]);
            setError("");
          } else {
            setError(data.error || "Invalid Lumina ID or passcode secret");
          }
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        onAuthSuccess(data.luminaId, data.profile);
      } catch (err) {
        console.error("Login error:", err);
        setFirebaseDiagnostics(FIREBASE_ERRORS["auth/unauthorized-domain"]);
        setError("");
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSelect = async (selectedEmail: string) => {
    setIsLoading(true);
    setError("");
    setShowGoogleModal(false);

    try {
      const response = await fetch("/api/auth/google-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: selectedEmail }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.exists) {
        onAuthSuccess(data.luminaId, data.profile);
      } else {
        setSelectedGoogleEmail(selectedEmail);
        setShowCinematicModal(true);
      }
    } catch (err) {
      console.error("Google SSO Check error:", err);
      setFirebaseDiagnostics(FIREBASE_ERRORS["auth/unauthorized-domain"]);
      setError("");
      setIsLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    if (provider === "Google") {
      setError("");
      setShowGoogleModal(true);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess(`${provider.toLowerCase()}User@lumina.ai`, null);
    }, 1000);
  };

  const industryPillars = [
    { label: "Technology", color: "text-brand-violet", bg: "bg-brand-violet/10", border: "border-brand-violet/30" },
    { label: "Biotech & Medicine", color: "text-brand-magenta", bg: "bg-brand-magenta/10", border: "border-brand-magenta/30" },
    { label: "Law & Advocacy", color: "text-brand-cyan", bg: "bg-brand-cyan/10", border: "border-brand-cyan/30" },
    { label: "Engineering Nodes", color: "text-brand-gold", bg: "bg-brand-gold/10", border: "border-brand-gold/30" },
    { label: "Academic Research", color: "text-brand-emerald", bg: "bg-brand-emerald/10", border: "border-brand-emerald/30" },
    { label: "VC & Entrepreneurship", color: "text-brand-coral", bg: "bg-brand-coral/10", border: "border-brand-coral/30" }
  ];

  // Framer Motion variants
  const panelTransition = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const cardTransition = {
    hidden: { opacity: 0, scale: 0.92, y: 60, filter: "blur(25px)" },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        type: "spring", 
        stiffness: 70, 
        damping: 15,
        delay: 0.1 
      } 
    }
  };

  const formStagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  };

  const itemStagger = {
    hidden: { y: 20, opacity: 0, filter: "blur(4px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col lg:flex-row relative overflow-hidden" id="auth-root-container">
      {/* Background drifting glow fields */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-violet/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />

      {/* LEFT PANEL: Cinematic Splitscreen Illustration */}
      <motion.div 
        {...panelTransition}
        className="hidden lg:flex lg:w-1/2 relative bg-brand-surface/40 border-r border-white/5 p-12 flex-col justify-between overflow-hidden" 
        id="auth-left-panel"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-violet/10 via-[#050505]/40 to-brand-cyan/5 opacity-80" />
        <div className="absolute inset-0 bg-noise opacity-[0.01] pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center space-x-3 z-10" id="auth-left-logo">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-violet to-brand-magenta flex items-center justify-center text-white shadow-lg shadow-brand-violet/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xs font-bold tracking-wider uppercase text-white font-display">LUMINA APPARATUS</span>
            <span className="block text-[8px] text-brand-cyan font-bold tracking-widest uppercase">System Core</span>
          </div>
        </div>

        {/* Middle Vector Cyber Illustration representing women in science and tech */}
        <div className="relative my-auto py-12 flex flex-col items-center justify-center text-center z-10 space-y-8" id="cyber-illustration-container">
          <div className="relative w-80 h-80" id="vector-stage">
            {/* Soft background rim lighting */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-violet to-brand-magenta blur-[80px] opacity-25 animate-pulse" />
            
            {/* Spinning orbital matrix rings */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-brand-violet/30"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 rounded-full border border-double border-brand-cyan/20"
            />
            
            {/* Particle constellations orbiting */}
            <div className="absolute inset-0 pointer-events-none">
              {[
                { top: "15%", left: "25%", color: "bg-brand-violet" },
                { top: "75%", left: "15%", color: "bg-brand-magenta" },
                { top: "30%", left: "80%", color: "bg-brand-cyan" },
                { top: "80%", left: "70%", color: "bg-brand-gold" },
                { top: "50%", left: "5%", color: "bg-brand-emerald" },
                { top: "45%", left: "90%", color: "bg-brand-coral" }
              ].map((dot, idx) => (
                <motion.div
                  key={idx}
                  className={`absolute w-2.5 h-2.5 rounded-full ${dot.color} shadow-lg`}
                  animate={{
                    y: [0, -12, 0],
                    scale: [1, 1.25, 1],
                    boxShadow: ["0 0 8px rgba(139,92,255,0.2)", "0 0 16px rgba(139,92,255,0.6)", "0 0 8px rgba(139,92,255,0.2)"]
                  }}
                  transition={{
                    duration: 4 + idx,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ top: dot.top, left: dot.left }}
                />
              ))}
            </div>

            {/* Central futuristic holographic node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-3xl bg-brand-bg/95 border border-brand-violet/40 p-4 shadow-2xl flex flex-col justify-between items-center text-left relative z-20 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-violet/10 rounded-full blur-xl" />
              <div className="flex items-center justify-between w-full border-b border-white/5 pb-2">
                <span className="text-[9px] text-gray-400 font-mono tracking-wider font-semibold">SYNTHESIS ONLINE</span>
                <div className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-ping" />
              </div>
              <div className="space-y-1.5 w-full">
                <span className="block text-[8px] text-brand-cyan font-mono font-semibold tracking-wider">CAREER DNA</span>
                <p className="text-xs font-bold text-white leading-tight">Advanced Science & Tech Path</p>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "94%" }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-brand-violet to-brand-cyan rounded-full"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-1 text-[9px] text-brand-gold font-semibold">
                <Sparkles className="w-3 h-3 text-brand-gold" />
                <span>94% Match Score Calibrated</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-w-md" id="illustration-text">
            <h2 className="text-2xl font-black tracking-tight text-white leading-tight font-display">
              Designed for <span className="bg-gradient-to-r from-brand-violet via-brand-magenta to-brand-cyan bg-clip-text text-transparent">Limitless Growth</span>
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Unlock prioritized opportunity matching, live interview prep with the Gemini-powered Career Coach, and automated CV index evaluations.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {industryPillars.map((p, i) => (
                <div key={i} className={`px-2.5 py-1.5 rounded-xl border ${p.border} ${p.bg} text-[9px] font-extrabold ${p.color} flex items-center space-x-1`}>
                  <span className="w-1 h-1 rounded-full bg-current" />
                  <span>{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info card */}
        <div className="z-10 bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center space-x-3 max-w-sm" id="auth-cert-card">
          <ShieldCheck className="w-6 h-6 text-brand-emerald flex-shrink-0" />
          <p className="text-[10px] text-gray-400 leading-relaxed text-left">
            Strict professional data encryption. Resumes, career roadmaps, and personal profile analytics are locked securely under local-first zero-trust privacy controls.
          </p>
        </div>
      </motion.div>

      {/* RIGHT PANEL: Floating Glassmorphic Signup/Sign-in Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10" id="auth-right-panel">
        <button
          type="button"
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors"
          id="btn-auth-back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Premium glass card with spring entry */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={cardTransition}
          className={`w-full max-w-[440px] glass-card p-8 rounded-3xl border transition-all duration-500 shadow-2xl relative ${
            isSignUp ? "border-brand-magenta/15 shadow-brand-magenta/5" : "border-brand-violet/15 shadow-brand-violet/5"
          }`} 
          id="auth-floating-card"
        >
          {/* Subtle breathing glowing corners */}
          {isSignUp ? (
            <>
              <div className="absolute top-0 right-0 w-28 h-28 bg-brand-magenta/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-brand-gold/10 rounded-full blur-2xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
            </>
          ) : (
            <>
              <div className="absolute top-0 right-0 w-28 h-28 bg-brand-violet/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-brand-cyan/10 rounded-full blur-2xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
            </>
          )}

          {/* Segmented Dual Switcher Tab at the top */}
          <div className="flex p-1 bg-white/[0.03] border border-white/5 rounded-2xl mb-6 relative z-10" id="auth-mode-selector">
            <div className="grid grid-cols-2 w-full relative z-10">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError("");
                  setFirebaseDiagnostics(null);
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center space-x-1.5 ${
                  !isSignUp 
                    ? "text-white shadow-lg bg-gradient-to-r from-brand-violet to-brand-cyan" 
                    : "text-gray-400 hover:text-gray-200"
                }`}
                id="btn-switch-to-signin"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError("");
                  setFirebaseDiagnostics(null);
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center space-x-1.5 ${
                  isSignUp 
                    ? "text-white shadow-lg bg-gradient-to-r from-brand-magenta to-brand-gold" 
                    : "text-gray-400 hover:text-gray-200"
                }`}
                id="btn-switch-to-signup"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          </div>

          <div className="text-center space-y-2 mb-6" id="auth-card-header">
            <div className={`inline-flex w-10 h-10 rounded-xl items-center justify-center text-white mb-2 shadow-lg transition-all ${
              isSignUp 
                ? "bg-gradient-to-tr from-brand-magenta to-brand-gold shadow-brand-magenta/20" 
                : "bg-gradient-to-tr from-brand-violet to-brand-cyan shadow-brand-violet/20"
            }`}>
              {isSignUp ? (
                <UserPlus className="w-5 h-5 animate-pulse" />
              ) : (
                <KeyRound className="w-5 h-5 animate-pulse" />
              )}
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white font-display" id="auth-header-title">
              {isSignUp ? "Create Your Lumina Account" : "Access Career Intelligence"}
            </h1>
            <p className="text-[11px] text-gray-400" id="auth-header-subtitle">
              {isSignUp ? "Begin your automated life-stage onboarding" : "Secure workspace access for registered leaders"}
            </p>
          </div>

          {/* Interactive Firebase & OAuth Diagnostics Area */}
          <AnimatePresence>
            {firebaseDiagnostics && (
              <motion.div
                initial={{ opacity: 0, y: -15, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -15, height: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 15 }}
                className="p-4 bg-brand-surface border border-brand-coral/40 rounded-2xl space-y-3 shadow-xl shadow-brand-coral/5 overflow-hidden text-left mb-4 relative"
                id="firebase-diagnostics-hub"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-brand-coral/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-start justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center space-x-2 text-brand-coral">
                    <ShieldAlert className="w-4 h-4 shrink-0 animate-pulse" />
                    <span className="font-mono text-[9px] font-black uppercase tracking-wider">
                      {firebaseDiagnostics.status === 400 ? "400 Bad Request" : "404 Not Found"}
                    </span>
                  </div>
                  <span className="text-[8px] bg-brand-coral/10 text-brand-coral px-2 py-0.5 rounded-md font-mono font-bold uppercase">
                    {firebaseDiagnostics.code}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[11px] font-extrabold text-white tracking-tight uppercase">
                    {firebaseDiagnostics.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    {firebaseDiagnostics.description}
                  </p>
                </div>

                {/* Checklist */}
                <div className="space-y-1.5 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                  <span className="text-[8px] font-black text-brand-gold uppercase tracking-wider block flex items-center space-x-1">
                    <Wrench className="w-3 h-3 text-brand-gold" />
                    <span>Troubleshooting Actions</span>
                  </span>
                  <div className="space-y-1">
                    {firebaseDiagnostics.checklist.map((item: string, idx: number) => (
                      <label key={idx} className="flex items-start space-x-2 cursor-pointer text-[9px] text-gray-300 hover:text-white transition-colors">
                        <input 
                          type="checkbox" 
                          defaultChecked={false}
                          className="mt-0.5 rounded border-white/10 bg-white/5 text-brand-coral focus:ring-brand-coral focus:ring-opacity-25 w-3 h-3 cursor-pointer" 
                        />
                        <span className="leading-tight">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action/Documentation Links */}
                {firebaseDiagnostics.links && firebaseDiagnostics.links.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-wider block">
                      Direct Resolution Console Links
                    </span>
                    <div className="flex flex-col space-y-1">
                      {firebaseDiagnostics.links.map((link: any, idx: number) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] text-brand-cyan hover:text-white hover:underline flex items-center space-x-1.5 font-medium"
                        >
                          <ExternalLink className="w-3 h-3 text-brand-cyan" />
                          <span>{link.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dismiss Buttons */}
                <div className="flex items-center space-x-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setFirebaseDiagnostics(null)}
                    className="flex-1 py-1.5 text-center text-[9px] font-extrabold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    Dismiss & Try Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-4 text-left" 
            id="auth-form"
            variants={formStagger}
          >
            {/* Animated slide-down error message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="p-3 bg-brand-coral/10 border border-brand-coral/30 rounded-xl text-brand-coral text-xs font-semibold flex items-center space-x-2 shadow-inner"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-brand-coral" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FULL NAME FIELD (Only Sign Up) */}
            <AnimatePresence>
              {isSignUp && (
                <motion.div 
                  variants={itemStagger}
                  className="space-y-1.5" 
                  id="form-group-name"
                >
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Full Name</label>
                  <div className={`relative rounded-xl border transition-all ${
                    focusedField === "name" 
                      ? (isSignUp 
                          ? "border-brand-magenta shadow-md shadow-brand-magenta/10 bg-white/[0.08]" 
                          : "border-brand-violet shadow-md shadow-brand-violet/10 bg-white/[0.08]"
                        )
                      : "border-white/10 bg-white/5"
                  }`}>
                    <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent py-3 pl-10 pr-10 text-xs text-white focus:outline-none transition-all"
                      id="auth-input-name"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                      {isNameValid ? (
                        <Check className="w-4 h-4 text-brand-emerald animate-pulse" />
                      ) : name.length > 0 ? (
                        <X className="w-4 h-4 text-brand-coral" />
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* EMAIL / LUMINA ID FIELD */}
            <motion.div variants={itemStagger} className="space-y-1.5" id="form-group-email">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {isSignUp ? "Professional Email" : "Lumina ID or Email"}
              </label>
              <div className={`relative rounded-xl border transition-all ${
                focusedField === "email" 
                  ? (isSignUp 
                      ? "border-brand-magenta shadow-md shadow-brand-magenta/10 bg-white/[0.08]" 
                      : "border-brand-violet shadow-md shadow-brand-violet/10 bg-white/[0.08]"
                    )
                  : "border-white/10 bg-white/5"
              }`}>
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={isSignUp ? "email" : "text"}
                  placeholder={isSignUp ? "yourname@domain.com" : "LMN-XXXXXXX or email@domain.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent py-3 pl-10 pr-10 text-xs text-white focus:outline-none transition-all"
                  id="auth-input-email"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                  {isSignUp ? (
                    isEmailValid ? (
                      <Check className="w-4 h-4 text-brand-emerald" />
                    ) : email.length > 0 ? (
                      <X className="w-4 h-4 text-brand-coral" />
                    ) : null
                  ) : (
                    email.trim().length > 0 ? (
                      <Check className="w-4 h-4 text-brand-emerald" />
                    ) : null
                  )}
                </div>
              </div>
            </motion.div>

            {/* PASSWORD FIELD */}
            <motion.div variants={itemStagger} className="space-y-1.5" id="form-group-password">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Secret Pass Code</label>
              <div className={`relative rounded-xl border transition-all ${
                focusedField === "password" 
                  ? (isSignUp 
                      ? "border-brand-magenta shadow-md shadow-brand-magenta/10 bg-white/[0.08]" 
                      : "border-brand-violet shadow-md shadow-brand-violet/10 bg-white/[0.08]"
                    )
                  : "border-white/10 bg-white/5"
              }`}>
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent py-3 pl-10 pr-10 text-xs text-white focus:outline-none transition-all"
                  id="auth-input-password"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                  {isPasswordValid ? (
                    <Check className="w-4 h-4 text-brand-emerald" />
                  ) : password.length > 0 ? (
                    <X className="w-4 h-4 text-brand-coral" />
                  ) : null}
                </div>
              </div>

              {/* Password strength submeter */}
              {isSignUp && password.length > 0 && (
                <div className="space-y-1 pt-1 animate-fadeIn">
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="text-gray-500 font-semibold uppercase">Strength</span>
                    <span className={`font-extrabold ${strength.glow}`}>{strength.label}</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${strength.score}%` }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className={`h-full ${strength.color} rounded-full`}
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* CONFIRM PASSWORD FIELD (Only Sign Up) */}
            <AnimatePresence>
              {isSignUp && (
                <motion.div 
                  variants={itemStagger}
                  className="space-y-1.5" 
                  id="form-group-confirm-password"
                >
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Confirm Pass Code</label>
                  <div className={`relative rounded-xl border transition-all ${
                    focusedField === "confirmPassword" 
                      ? "border-brand-magenta shadow-md shadow-brand-magenta/10 bg-white/[0.08]" 
                      : "border-brand-violet shadow-md shadow-brand-violet/10 bg-white/[0.08]"
                  }`}>
                    <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent py-3 pl-10 pr-10 text-xs text-white focus:outline-none transition-all"
                      id="auth-input-confirm-password"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                      {confirmPassword.length > 0 && arePasswordsMatching ? (
                        <Check className="w-4 h-4 text-brand-emerald" />
                      ) : confirmPassword.length > 0 ? (
                        <X className="w-4 h-4 text-brand-coral" />
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AGREE TERMS PROTOCOLS */}
            {isSignUp && (
              <motion.div variants={itemStagger} className="flex items-start space-x-2 pt-1" id="form-group-terms">
                <input
                  type="checkbox"
                  id="check-terms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-white/10 bg-white/5 text-brand-magenta focus:ring-brand-magenta focus:ring-opacity-25"
                />
                <label htmlFor="check-terms" className="text-[10px] text-gray-400 leading-tight">
                  I authorize Lumina to build my encrypted Career DNA index and accept the zero-trust privacy protocols.
                </label>
              </motion.div>
            )}

            {!isSignUp && (
              <motion.div variants={itemStagger} className="text-right" id="forgot-password-link">
                <span 
                  onClick={() => {
                    setShowForgotModal(true);
                  }}
                  className="text-[10px] text-gray-500 hover:text-brand-violet cursor-pointer transition-colors font-semibold"
                >
                  Forgot Password?
                </span>
              </motion.div>
            )}

            {/* SUBMIT BUTTON */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 hover:shadow-xl text-white font-extrabold text-xs rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer mt-4 ${
                isSignUp 
                  ? "bg-gradient-to-r from-brand-magenta to-brand-gold hover:shadow-brand-magenta/20" 
                  : "bg-gradient-to-r from-brand-violet to-brand-cyan hover:shadow-brand-violet/20"
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              id="btn-auth-submit"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? <UserPlus className="w-4.5 h-4.5" /> : <LogIn className="w-4.5 h-4.5" />}
                  <span>{isSignUp ? "Initiate Onboarding Sequence" : "Authenticate Workspace"}</span>
                </>
              )}
            </motion.button>

            {isDemoEnabled && !isSignUp && (
              <motion.button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-brand-violet/10 to-brand-magenta/15 hover:from-brand-violet/25 hover:to-brand-magenta/30 border border-brand-violet/30 hover:border-brand-violet/50 hover:shadow-lg hover:shadow-brand-violet/10 text-brand-cyan hover:text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer mt-3"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                id="btn-auth-demo"
              >
                <span>✨ Explore Demo Workspace</span>
              </motion.button>
            )}
          </motion.form>

          {/* Social Logins */}
          <div className="space-y-4 mt-6" id="auth-socials">
            <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-wider">
              <div className="w-full h-[1px] bg-white/5" />
              <span className="px-3 whitespace-nowrap">Or Access System With</span>
              <div className="w-full h-[1px] bg-white/5" />
            </div>

            <div className="grid grid-cols-2 gap-3" id="social-buttons-grid">
              <motion.button
                type="button"
                onClick={() => handleOAuth("Google")}
                disabled={isLoading}
                className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[11px] font-semibold text-gray-200 transition-all flex items-center justify-center space-x-2 cursor-pointer relative overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                id="btn-auth-google"
              >
                <Chrome className="w-3.5 h-3.5 text-brand-gold animate-[spin_10s_linear_infinite]" />
                <span>Google</span>
                {/* Sweep light overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:animate-[shimmer_2s_infinite]" />
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleOAuth("GitHub")}
                disabled={isLoading}
                className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[11px] font-semibold text-gray-200 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                id="btn-auth-github"
              >
                <Github className="w-3.5 h-3.5 text-brand-cyan" />
                <span>GitHub</span>
              </motion.button>
            </div>

            {/* Troubleshooting Diagnostic Simulator Row */}
            <div className="flex flex-col space-y-2 pt-3 border-t border-white/5">
              <span className="text-[8px] text-gray-500 uppercase tracking-widest block text-center font-bold">
                OAuth & Firebase Diagnostics Simulator
              </span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                <button
                  type="button"
                  onClick={() => setFirebaseDiagnostics(FIREBASE_ERRORS["auth/invalid-api-key"])}
                  className="px-2 py-1 text-[8px] bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded font-mono transition-colors cursor-pointer"
                >
                  400: API Key
                </button>
                <button
                  type="button"
                  onClick={() => setFirebaseDiagnostics(FIREBASE_ERRORS["auth/operation-not-allowed"])}
                  className="px-2 py-1 text-[8px] bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded font-mono transition-colors cursor-pointer"
                >
                  400: Disable
                </button>
                <button
                  type="button"
                  onClick={() => setFirebaseDiagnostics(FIREBASE_ERRORS["auth/unauthorized-domain"])}
                  className="px-2 py-1 text-[8px] bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded font-mono transition-colors cursor-pointer"
                >
                  400: Domain
                </button>
                <button
                  type="button"
                  onClick={() => setFirebaseDiagnostics(FIREBASE_ERRORS["auth/user-not-found"])}
                  className="px-2 py-1 text-[8px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded font-mono transition-colors cursor-pointer"
                >
                  404: User
                </button>
                <button
                  type="button"
                  onClick={() => setFirebaseDiagnostics(FIREBASE_ERRORS["auth/project-not-found"])}
                  className="px-2 py-1 text-[8px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded font-mono transition-colors cursor-pointer"
                >
                  404: Project
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 pt-4 border-t border-white/5 text-xs text-gray-400" id="auth-switch-type">
            {isSignUp ? "Already have a Lumina key?" : "New to Lumina apparatus?"}{" "}
            <span
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setFirebaseDiagnostics(null);
              }}
              className="text-brand-violet hover:text-brand-magenta font-extrabold cursor-pointer transition-colors"
              id="btn-auth-type-switch"
            >
              {isSignUp ? "Access Workspace" : "Request Free Account"}
            </span>
          </div>

        </motion.div>
      </div>

      {/* GOOGLE SSO ACCOUNTS DIALOG */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 bg-[#020205]/90 backdrop-blur-xl flex items-center justify-center z-50 p-4" id="google-sso-modal">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass-card max-w-sm w-full p-6 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden space-y-6"
            >
              {/* Background gradient flares */}
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-brand-violet/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-brand-gold/20 rounded-full blur-2xl" />

              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="flex items-center space-x-2">
                  <Chrome className="w-4 h-4 text-brand-gold animate-spin" style={{ animationDuration: '10s' }} />
                  <span className="text-[10px] font-black uppercase tracking-wider text-white">Google Accounts SSO</span>
                </div>
                <button 
                  onClick={() => {
                    setShowGoogleModal(false);
                  }}
                  className="p-1 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <span className="block text-xs font-bold text-white">Sign in with Google</span>
                  <span className="block text-[10px] text-gray-400 mt-1">Enter your Google Email to authorize a secure session</span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Google Email Address</label>
                    <input 
                      type="email"
                      placeholder="username@gmail.com"
                      value={googleInputEmail}
                      onChange={(e) => setGoogleInputEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-violet"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setShowGoogleModal(false);
                      }}
                      className="flex-1 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button 
                      disabled={!/\S+@\S+\.\S+/.test(googleInputEmail)}
                      onClick={() => handleGoogleSelect(googleInputEmail)}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-brand-violet to-brand-magenta text-xs text-white font-bold disabled:opacity-40"
                    >
                      Authorize
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NEW USER CINEMATIC "NOT REGISTERED" MODAL */}
      <AnimatePresence>
        {showCinematicModal && (
          <div className="fixed inset-0 bg-[#020205]/95 backdrop-blur-2xl flex items-center justify-center z-50 p-4" id="cinematic-not-registered-modal">
            {/* Animated floating subtle cosmic particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute w-[3px] h-[3px] bg-brand-violet rounded-full opacity-60 animate-ping" style={{ top: "25%", left: "15%", animationDuration: "3s" }} />
              <div className="absolute w-1.5 h-1.5 bg-brand-cyan rounded-full opacity-40 animate-ping" style={{ bottom: "35%", right: "20%", animationDuration: "4s" }} />
              <div className="absolute w-2 h-2 bg-brand-magenta rounded-full opacity-30 animate-pulse" style={{ top: "60%", left: "40%", animationDuration: "5s" }} />
            </div>

            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
              className="glass-card max-w-lg w-full p-8 border border-brand-violet/20 rounded-3xl shadow-3xl relative overflow-hidden space-y-8 text-center"
            >
              {/* Soft pulsing border glow */}
              <div className="absolute inset-0 border border-brand-cyan/20 rounded-3xl pointer-events-none animate-pulse" />

              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                {/* Holographic glowing orbits */}
                <div className="absolute inset-0 rounded-full border border-dashed border-brand-violet/40 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-2 rounded-full border border-brand-cyan/30 animate-[spin_6s_linear_reverse_infinite]" />
                <div className="w-12 h-12 rounded-full bg-brand-bg border border-brand-violet flex items-center justify-center shadow-lg shadow-brand-violet/30 z-10">
                  <AlertCircle className="w-6 h-6 text-brand-cyan" />
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest block">Authorization Pending</span>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display leading-tight">You're almost there!</h2>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-gray-400 font-semibold text-xs inline-block">
                  Authorized as: <span className="text-brand-cyan font-mono">{selectedGoogleEmail}</span>
                </div>
                <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                  We couldn't find an existing Lumina-AI account associated with this Google account. Please complete the registration process to unlock your personalized AI Career Dashboard.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
                <button 
                  onClick={() => {
                    setShowCinematicModal(false);
                    // Pass to registration
                    onAuthSuccess(selectedGoogleEmail, null, selectedGoogleEmail);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-brand-violet to-brand-magenta hover:shadow-xl hover:shadow-brand-violet/30 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Create My Account
                </button>
                <button 
                  onClick={() => {
                    setShowCinematicModal(false);
                    setShowGoogleModal(true);
                  }}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Try Another Google Account
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FORGOT PASSWORD MODAL */}
      <AnimatePresence>
        {showForgotModal && (
          <PasswordReset 
            isOpen={showForgotModal}
            onClose={() => setShowForgotModal(false)}
            initialEmail={email}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
