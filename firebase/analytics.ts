import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import { app } from './config';

let analytics: Analytics | null = null;

// Initialize analytics only on the client side if supported
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };
export const logEventSafe = async (eventName: string, params?: Record<string, unknown>) => {
  if (analytics) {
    const { logEvent } = await import('firebase/analytics');
    logEvent(analytics, eventName, params);
  }
};
