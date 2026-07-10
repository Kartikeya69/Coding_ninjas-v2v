export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experienceLevel: 'Entry' | 'Mid' | 'Senior';
  salaryRange?: string;
  postedDate: string;
  description: string;
  requirements: string[];
  skillsRequired: string[];
  matchScore: number; // AI score 0-100
  matchDetails?: {
    strengths: string[];
    gaps: string[];
    recommendations: string[];
  };
  applyUrl: string;
}

export interface JobApplication {
  id: string;
  userId: string;
  jobId: string;
  status: 'interested' | 'applied' | 'interviewing' | 'offered' | 'rejected';
  appliedDate?: string;
  notes?: string;
  createdAt: string;
}
