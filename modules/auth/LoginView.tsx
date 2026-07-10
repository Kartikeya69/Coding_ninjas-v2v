'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { signInWithGoogle } from '../../firebase/auth';
import { getFriendlyAuthErrorMessage } from '../../utils/firebase';
import { useAuth } from '../../hooks/useAuth';
import { logger } from '../../lib/logger';

export const LoginView: React.FC = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    logger.info('Initiating Google sign-in popup...');
    try {
      const loggedUser = await signInWithGoogle();
      setUser(loggedUser);
      document.cookie = "session_active=true; path=/; max-age=86400; SameSite=Lax";
      logger.info('Google sign-in completed successfully.');
      
      // Set the flag for Google signup onboarding automation
      if (typeof window !== 'undefined') {
        localStorage.setItem('google_signup_pending_onboarding', 'true');
      }

      // New sign-ins always land in the guided AI setup before entering the app.
      router.push('/onboarding');
    } catch (err) {
      logger.error('Error during Google sign-in', err);
      setError(getFriendlyAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-center items-center px-6 py-12 select-none">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/45 backdrop-blur-xl p-8 shadow-2xl relative z-10">
        {/* Branding header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-11 w-11 rounded-xl bg-linear-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 mb-4 animate-pulse">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans">Welcome to Lumina AI</h1>
          <p className="text-[11px] text-muted-foreground mt-1 max-w-[280px]">
            Sign in to access your AI Career Operating System.
          </p>
        </div>

        {/* Error Alert Panel */}
        {error && (
          <div className="mb-5 p-3 rounded-lg border border-accent/25 bg-accent/5 text-[11px] text-accent text-center font-medium animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {/* Google Authentication Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border bg-card/80 hover:bg-muted/30 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group relative"
        >
          {loading ? (
            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground border-t-white animate-spin" />
          ) : (
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
          )}
          <span>{loading ? 'Authenticating...' : 'Sign in with Google'}</span>
        </button>

        {/* Demo Warning / Guidelines */}
        <div className="mt-8 pt-6 border-t border-border/60 text-center">
          <p className="text-[10px] text-muted-foreground leading-normal">
            For evaluation, you can sign in using any active Google account. Secure sessions are automatically maintained.
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginView;
