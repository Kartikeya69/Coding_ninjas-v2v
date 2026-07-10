export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  category: 'career_coach' | 'resume_coach' | 'interview_coach' | 'scholarship_advisor' | 'finance_coach' | 'general';
  createdAt: string;
  updatedAt: string;
}

export interface AISessionState {
  currentSession: ChatSession | null;
  history: ChatSession[];
  isLoading: boolean;
  error: string | null;
}
