'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, isMockAuth, mapFirebaseUser } from '../firebase/auth';
import { db } from '../firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { logger } from '../lib/logger';

interface FirebaseContextType {
  initialized: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({ initialized: false });

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, setLoading, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 1. Listen for Auth State Changes
  useEffect(() => {
    logger.info('Initializing Firebase Auth listener...');
    let unsubscribe = () => {};
    
    try {
      if (!isMockAuth(auth)) {
        unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
          if (fbUser) {
            logger.info(`User session detected: ${fbUser.uid}`);
            setUser(mapFirebaseUser(fbUser));
            document.cookie = "session_active=true; path=/; max-age=86400; SameSite=Lax";
          } else {
            // Check if mock credentials are set
            logger.info('No active user session detected.');
            setUser(null);
            document.cookie = "session_active=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }
          setLoading(false);
        }, (error) => {
          logger.error('Firebase Auth listener error:', error);
          // Fallback to dev user
          setUser({
            uid: 'dev_user_123',
            email: 'developer@lumina-ai.com',
            displayName: 'Lumina Developer',
            photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
            emailVerified: true
          });
          document.cookie = "session_active=true; path=/; max-age=86400; SameSite=Lax";
          setLoading(false);
        });
      } else {
        // Fallback for mocked Auth instances
        logger.info('Using mock Firebase Auth configuration.');
        setUser({
          uid: 'dev_user_123',
          email: 'developer@lumina-ai.com',
          displayName: 'Lumina Developer',
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
          emailVerified: true
        });
        document.cookie = "session_active=true; path=/; max-age=86400; SameSite=Lax";
        setLoading(false);
      }
    } catch (error) {
      logger.error('Failed to initialize Firebase Auth listener:', error);
      setUser({
        uid: 'dev_user_123',
        email: 'developer@lumina-ai.com',
        displayName: 'Lumina Developer',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
        emailVerified: true
      });
      document.cookie = "session_active=true; path=/; max-age=86400; SameSite=Lax";
      setLoading(false);
    }

    return () => unsubscribe();
  }, [setUser, setLoading]);

  // 2. Client-side Navigation Redirection Guard (Defense in Depth)
  useEffect(() => {
    if (isLoading || !user) return;

    const checkOnboardingRedirection = async () => {
      try {
        let isOnboarded = false;
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          isOnboarded = docSnap.exists() && docSnap.data().onboarded === true;
        } catch (dbErr) {
          logger.warn('Failed to fetch user onboarding profile from Firestore. Checking localStorage fallback.', dbErr instanceof Error ? { message: dbErr.message } : { error: String(dbErr) });
          // Check if onboarding completed locally in this browser
          const localFlag = typeof window !== 'undefined' ? localStorage.getItem(`onboarded_${user.uid}`) === 'true' : false;
          isOnboarded = localFlag;
        }

        if (isOnboarded) {
          // Clean up Google signup onboarding automation flag if already onboarded
          if (typeof window !== 'undefined') {
            localStorage.removeItem('google_signup_pending_onboarding');
          }
          // If onboarded and visiting onboarding or login page, send to dashboard
          if (pathname === '/onboarding' || pathname === '/login') {
            logger.info('User is already onboarded. Redirecting to dashboard.');
            router.push('/dashboard');
          }
        } else {
          // If not onboarded and trying to view dashboard/subpages, lock to onboarding
          if (pathname !== '/onboarding' && pathname !== '/login') {
            logger.info('User has not completed onboarding. Locking to onboarding screen.');
            router.push('/onboarding');
          }
        }
      } catch (error) {
        logger.error('Error resolving onboarding redirection:', error);
      }
    };

    checkOnboardingRedirection();
  }, [pathname, user, isLoading, router]);

  return (
    <FirebaseContext.Provider value={{ initialized: true }}>
      {children}
    </FirebaseContext.Provider>
  );
};
export default FirebaseProvider;
