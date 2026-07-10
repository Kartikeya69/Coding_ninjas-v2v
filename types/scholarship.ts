export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: number;
  type: 'merit' | 'need' | 'diversity' | 'general';
  deadline: string;
  description: string;
  eligibilityRequirements: string[];
  applyUrl: string;
  matchScore: number; // AI score 0-100
  createdAt: string;
}

export interface ScholarshipApplication {
  id: string;
  userId: string;
  scholarshipId: string;
  status: 'planning' | 'drafting' | 'submitted' | 'awarded' | 'not_awarded';
  submissionDate?: string;
  notes?: string;
  createdAt: string;
}
