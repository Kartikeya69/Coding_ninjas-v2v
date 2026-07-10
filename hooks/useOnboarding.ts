import { create } from 'zustand';

interface OnboardingState {
  step: number;
  stage: 'school' | 'college' | 'professional' | '';
  name: string;
  age: number;
  
  // Adaptive details
  schoolOrCollege: string;
  degree: string;
  major: string;
  graduationYear: string;
  favoriteSubjects: string[];
  currentRole: string;
  company: string;
  yearsOfExperience: number;
  
  // Preferences
  workMode: 'remote' | 'hybrid' | 'onsite' | '';
  location: string;
  
  // Socials
  github: string;
  linkedin: string;

  // General fields
  interests: string[];
  skills: string[];
  weeklyHours: number;

  // Actions
  setField: (key: string, value: unknown) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetOnboarding: () => void;
  loadDraft: () => void;
  autoConfigure: (userData: { name: string }) => void;
}

const LOCAL_STORAGE_KEY = 'lumina-onboarding-draft';

const initialState = {
  step: 1,
  stage: '' as const,
  name: '',
  age: 0,
  schoolOrCollege: '',
  degree: '',
  major: '',
  graduationYear: '',
  favoriteSubjects: [],
  currentRole: '',
  company: '',
  yearsOfExperience: 0,
  workMode: '' as const,
  location: '',
  github: '',
  linkedin: '',
  interests: [],
  skills: [],
  weeklyHours: 10,
};

export const useOnboarding = create<OnboardingState>((set, get) => ({
  ...initialState,

  setField: (key, value) => {
    set({ [key]: value });
    // Autosave draft to localStorage
    if (typeof window !== 'undefined') {
      const currentData = {
        ...get(),
        setField: undefined,
        nextStep: undefined,
        prevStep: undefined,
        resetOnboarding: undefined,
        loadDraft: undefined,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentData));
    }
  },

  nextStep: () => set((state) => {
    const next = state.step + 1;
    if (typeof window !== 'undefined') {
      localStorage.setItem('lumina-onboarding-step', String(next));
    }
    return { step: next };
  }),

  prevStep: () => set((state) => {
    const prev = Math.max(1, state.step - 1);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lumina-onboarding-step', String(prev));
    }
    return { step: prev };
  }),

  resetOnboarding: () => {
    set(initialState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem('lumina-onboarding-step');
    }
  },

  loadDraft: () => {
    if (typeof window !== 'undefined') {
      try {
        const draft = localStorage.getItem(LOCAL_STORAGE_KEY);
        const step = localStorage.getItem('lumina-onboarding-step');
        if (draft) {
          const parsed = JSON.parse(draft);
          set({ 
            ...parsed,
            step: step ? Number(step) : parsed.step || 1 
          });
        }
      } catch (error) {
        console.error('Failed to load onboarding draft:', error);
      }
    }
  },

  autoConfigure: (userData) => {
    const freshState = {
      name: userData.name,
      age: 21,
      stage: 'college' as const,
      schoolOrCollege: 'University',
      degree: 'B.S.',
      major: 'Computer Science',
      graduationYear: String(new Date().getFullYear() + 2),
      favoriteSubjects: ['Computer Science', 'Mathematics'],
      interests: ['jobs', 'resume', 'upskilling'],
      weeklyHours: 15,
      workMode: 'remote' as const,
      location: 'Remote',
      step: 5
    };
    
    set(freshState);
    
    if (typeof window !== 'undefined') {
      const currentData = {
        ...get(),
        setField: undefined,
        nextStep: undefined,
        prevStep: undefined,
        resetOnboarding: undefined,
        loadDraft: undefined,
        autoConfigure: undefined,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentData));
      localStorage.setItem('lumina-onboarding-step', '5');
    }
  },
}));
export default useOnboarding;
