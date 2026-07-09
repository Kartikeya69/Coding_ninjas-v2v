import { FirebaseError } from 'firebase/app';

/**
 * Maps Firebase Auth error codes to user-friendly messages
 */
export function getFriendlyAuthErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return 'An unexpected error occurred.';
  
  const code = (error as FirebaseError).code;
  if (!code) return error.message;

  switch (code) {
    case 'auth/invalid-credential':
      return 'The credentials provided are invalid. Please check and try again.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
      return 'No account was found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password entered.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/weak-password':
      return 'The password chosen is too weak. Must be at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in window closed. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Authentication request cancelled. Please try again.';
    default:
      return `Authentication failed: ${error.message}`;
  }
}
