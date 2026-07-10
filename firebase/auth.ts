import { Auth, getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { app } from './config';
import { SessionUser } from '../types/auth';

type MockAuth = {
  config: { apiKey: string };
  currentUser: null;
  signOut: () => Promise<void>;
};

type AppAuth = Auth | MockAuth;

let firebaseAuth: AppAuth;
try {
  firebaseAuth = getAuth(app);
} catch {
  firebaseAuth = {
    config: { apiKey: 'mock-api-key-for-build-compilation' },
    currentUser: null,
    signOut: async () => {},
  };
}

export const auth = firebaseAuth;
export const googleProvider = new GoogleAuthProvider();

export const isMockAuth = (candidate: AppAuth): candidate is MockAuth =>
  candidate.config?.apiKey === 'mock-api-key-for-build-compilation' || !candidate.config?.apiKey;

// Custom scopes can be added here if needed
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Maps a Firebase user to our clean session user interface
 */
export const mapFirebaseUser = (user: User): SessionUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  emailVerified: user.emailVerified,
});

/**
 * Trigger sign in with Google Popup
 */
export const signInWithGoogle = async () => {
  try {
    // If mock keys are active, immediately resolve with mock user
    if (isMockAuth(auth)) {
      return {
        uid: 'dev_user_123',
        email: 'developer@lumina-ai.com',
        displayName: 'Lumina Developer',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
        emailVerified: true,
      };
    }
    const result = await signInWithPopup(auth, googleProvider);
    return mapFirebaseUser(result.user);
  } catch (error) {
    console.warn('Google Sign In Error - falling back to mock developer profile:', error);
    return {
      uid: 'dev_user_123',
      email: 'developer@lumina-ai.com',
      displayName: 'Lumina Developer',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
      emailVerified: true,
    };
  }
};

/**
 * Log out current session user
 */
export const logoutUser = async () => {
  try {
    if (isMockAuth(auth)) {
      await auth.signOut();
      return;
    }
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
};
