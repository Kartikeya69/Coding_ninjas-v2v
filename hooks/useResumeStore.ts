import { create } from 'zustand';
import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestore';
import { logger } from '@/lib/logger';

export interface ResumeDetails {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
}

export interface ResumeExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface ResumeEducation {
  id: string;
  school: string;
  degree: string;
  major: string;
  graduationYear: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  technologies: string;
  bullets: string[];
}

export interface ResumeData {
  details: ResumeDetails;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  skills: string[];
}

export interface ScoreHistoryItem {
  date: string;
  score: number;
}

export interface Resume {
  id: string;
  name: string;
  targetRole: string;
  template: 'modern' | 'minimal' | 'developer' | 'corporate';
  data: ResumeData;
  scoreHistory: ScoreHistoryItem[];
  version: number;
  updatedAt: string;
}

export interface AIResumeReview {
  matchScore: number;
  strengths: string[];
  gaps: string[];
  keywordGaps: string[];
  formattingCritique: string;
  actionItems: string[];
}

interface ResumeState {
  resumes: Resume[];
  activeResumeId: string | null;
  isSaving: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  isAnalyzing: boolean;
  activeAnalysis: AIResumeReview | null;

  // Actions
  loadResumes: (userId: string) => Promise<void>;
  createResume: (userId: string, name: string, targetRole: string, template?: Resume['template']) => Promise<string>;
  updateActiveResume: (userId: string, data: Partial<ResumeData> | Partial<Omit<Resume, 'data'>>) => Promise<void>;
  deleteResume: (userId: string, id: string) => Promise<void>;
  setActiveResumeId: (id: string | null) => void;
  setAnalysis: (analysis: AIResumeReview | null) => void;
  setAnalyzing: (loading: boolean) => void;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  resumes: [],
  activeResumeId: null,
  isSaving: false,
  saveStatus: 'idle',
  isAnalyzing: false,
  activeAnalysis: null,

  loadResumes: async (userId) => {
    try {
      const resumesCol = collection(db, 'users', userId, 'resumes');
      const snap = await getDocs(resumesCol);
      const items: Resume[] = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Resume);
      });
      
      set({ 
        resumes: items,
        activeResumeId: items.length > 0 ? items[0].id : null 
      });
    } catch (err) {
      logger.error('ResumeStore: Failed to load user resumes.', { error: String(err) });
    }
  },

  createResume: async (userId, name, targetRole, template = 'modern') => {
    const id = `resume_${Date.now()}`;
    const initialResume: Resume = {
      id,
      name,
      targetRole,
      template,
      data: {
        details: { fullName: '', email: '', phone: '', location: '', github: '', linkedin: '' },
        summary: '',
        experience: [],
        education: [],
        projects: [],
        skills: []
      },
      scoreHistory: [{ date: new Date().toLocaleDateString(), score: 60 }],
      version: 1,
      updatedAt: new Date().toISOString()
    };

    try {
      const docRef = doc(db, 'users', userId, 'resumes', id);
      await setDoc(docRef, initialResume);
      
      set((state) => ({
        resumes: [...state.resumes, initialResume],
        activeResumeId: id
      }));
      return id;
    } catch (err) {
      logger.error('ResumeStore: Failed to create new resume.', { error: String(err) });
      throw err;
    }
  },

  updateActiveResume: async (userId, updatePayload) => {
    const { activeResumeId, resumes } = get();
    if (!activeResumeId) return;

    const current = resumes.find(r => r.id === activeResumeId);
    if (!current) return;

    // Build the updated object structure
    let updated: Resume;
    if ('details' in updatePayload || 'summary' in updatePayload || 'experience' in updatePayload || 'education' in updatePayload || 'projects' in updatePayload || 'skills' in updatePayload) {
      updated = {
        ...current,
        data: {
          ...current.data,
          ...updatePayload as Partial<ResumeData>
        },
        updatedAt: new Date().toISOString()
      };
    } else {
      updated = {
        ...current,
        ...updatePayload as Partial<Omit<Resume, 'data'>>,
        updatedAt: new Date().toISOString()
      };
    }

    // Optimistically update client state
    set({
      resumes: resumes.map(r => r.id === activeResumeId ? updated : r),
      saveStatus: 'saving',
      isSaving: true
    });

    try {
      const docRef = doc(db, 'users', userId, 'resumes', activeResumeId);
      await setDoc(docRef, updated);
      set({ saveStatus: 'saved', isSaving: false });
    } catch (err) {
      logger.error('ResumeStore: Failed to update resume document.', { error: String(err) });
      set({ saveStatus: 'error', isSaving: false });
    }
  },

  deleteResume: async (userId, id) => {
    try {
      const docRef = doc(db, 'users', userId, 'resumes', id);
      await deleteDoc(docRef);
      
      set((state) => {
        const nextList = state.resumes.filter(r => r.id !== id);
        return {
          resumes: nextList,
          activeResumeId: state.activeResumeId === id ? (nextList.length > 0 ? nextList[0].id : null) : state.activeResumeId
        };
      });
    } catch (err) {
      logger.error('ResumeStore: Failed to delete resume document.', { error: String(err) });
      throw err;
    }
  },

  setActiveResumeId: (id) => set({ activeResumeId: id }),
  setAnalysis: (analysis) => set({ activeAnalysis: analysis }),
  setAnalyzing: (loading) => set({ isAnalyzing: loading })
}));
export default useResumeStore;
