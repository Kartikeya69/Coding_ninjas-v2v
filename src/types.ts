/**
 * Lumina AI Types
 */

export interface UserProfile {
  name: string;
  age: string;
  country: string;
  educationLevel: string;
  interests: string[];
  careerGoals: string[];
  skills: string[];
  targetExams: string[];
  preferredIndustries: string[];
  startupInterest: boolean;
  startupIdea: string;
  mentorshipPreference: string;
  onboardingCompleted: boolean;
  streakDays: number;
  lastActivityDate: string; // YYYY-MM-DD

  // Adaptive Life Stage Properties
  stage?: 'school' | 'college' | 'professional';
  schoolName?: string;
  gradeClass?: string;
  favoriteSubjects?: string[];
  dreamCareer?: string;
  collegeName?: string;
  degreeMajor?: string;
  graduationYear?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  currentRole?: string;
  currentCompany?: string;
  experienceYears?: string;
  salary?: string;
  isDemo?: boolean;
}

export type OpportunityCategory =
  | "Scholarships"
  | "Grants"
  | "Fellowships"
  | "Hackathons"
  | "Competitions"
  | "Exchange Programs"
  | "Internships"
  | "Research Programs";

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  provider: string;
  category: OpportunityCategory;
  amount: string;
  deadline: string; // YYYY-MM-DD
  link: string;
  eligibilityCriteria: string[];
  matchScore: number; // 0-100
  urgencyScore: number; // 0-100
  recommendationReason: string;
}

export type ApplicationStatus =
  | "Interested"
  | "In Progress"
  | "Submitted"
  | "Accepted"
  | "Declined";

export interface Application {
  id: string;
  opportunityId: string;
  title: string;
  category: OpportunityCategory | "Job" | "Internship";
  providerOrCompany: string;
  status: ApplicationStatus;
  notes: string;
  deadline: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salary: string;
  type: "Full-time" | "Part-time" | "Internship" | "Contract";
  remote: boolean;
  salaryInsights: string;
  provider: string;
  link: string;
  matchScore: number;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  expertise: string[];
  rating: number;
  bio: string;
  availability: string[]; // e.g. ["Mon 4-5 PM", "Wed 10-11 AM"]
}

export interface MentorSession {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorTitle: string;
  dateTime: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  notes: string;
  followUps: string[];
}

export interface BusinessModelCanvas {
  problem: string;
  solution: string;
  uniqueValue: string;
  customerSegments: string;
  revenueStreams: string;
  costStructure: string;
  channels: string;
  keyMetrics: string;
  unfairAdvantage: string;
}

export interface StartupIdea {
  id: string;
  name: string;
  description: string;
  validationStatus: "Idle" | "Validating" | "Completed" | "Failed";
  readinessScore: number; // 0-100
  marketAnalysis: string;
  feedback: string;
  canvas: BusinessModelCanvas | null;
  grantDiscovery: string[];
  actionPlan: string[]; // Step-by-step goals
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: "Weekly Action" | "Skill Gap" | "Study Plan" | "Onboarding";
  targetDate: string;
  completed: boolean;
  progress: number; // percentage 0-100
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: "Deadline" | "Match" | "Booking" | "System";
  read: boolean;
  timestamp: string;
}

export interface MockResumeAnalysis {
  score: number;
  skillsFound: string[];
  skillsMissing: string[];
  feedback: string;
  optimizedHeadline: string;
  interviewPrepQAs: { question: string; answerOutline: string }[];
}
