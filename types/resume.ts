export interface ResumeWorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[]; // Bullet points
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface ResumeData {
  title: string; // E.g., "Software Engineer Draft"
  summary: string;
  workExperience: ResumeWorkExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  skills: string[];
  languages: string[];
  certifications: string[];
}

export interface ResumeDraft {
  id: string;
  userId: string;
  resumeData: ResumeData;
  aiFeedback?: {
    score: number;
    suggestions: string[];
    missingKeywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}
