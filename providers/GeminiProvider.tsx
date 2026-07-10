'use client';

import React, { createContext, useContext, useState } from 'react';
import { ChatSession, ChatMessage } from '../types/ai';

interface GeminiContextType {
  activeSession: ChatSession | null;
  setActiveSession: (session: ChatSession | null) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const GeminiContext = createContext<GeminiContextType | undefined>(undefined);

export const useGeminiContext = () => {
  const context = useContext(GeminiContext);
  if (!context) {
    throw new Error('useGeminiContext must be used within a GeminiProvider');
  }
  return context;
};

export const GeminiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <GeminiContext.Provider
      value={{
        activeSession,
        setActiveSession,
        isLoading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </GeminiContext.Provider>
  );
};
export default GeminiProvider;
