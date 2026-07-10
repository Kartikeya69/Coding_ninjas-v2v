import { create } from 'zustand';
import { SessionUser } from '../types/auth';

interface AuthStore {
  user: SessionUser | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: SessionUser | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isLoading: true, // Default to true until Firebase checks session status
  error: null,
  setUser: (user) => set({ user, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
}));
export default useAuth;
