'use client';

import React, { useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Read theme from localStorage or system preference, defaulting to dark
    const storedTheme = localStorage.getItem('lumina-theme') as 'dark' | 'light' | null;
    const initialTheme = storedTheme || 'dark';
    
    setTheme(initialTheme);
    
    const root = window.document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(initialTheme);
  }, [setTheme]);

  return <>{children}</>;
};
