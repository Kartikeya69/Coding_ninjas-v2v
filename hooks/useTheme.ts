import { create } from 'zustand';

type ThemeMode = 'dark' | 'light';

interface ThemeStore {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

export const useTheme = create<ThemeStore>((set) => ({
  theme: 'dark', // default to dark first
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') {
      localStorage.setItem('lumina-theme', nextTheme);
      const root = window.document.documentElement;
      root.classList.remove('dark', 'light');
      root.classList.add(nextTheme);
    }
    return { theme: nextTheme };
  }),
  setTheme: (theme) => set(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lumina-theme', theme);
      const root = window.document.documentElement;
      root.classList.remove('dark', 'light');
      root.classList.add(theme);
    }
    return { theme };
  }),
}));
export default useTheme;
