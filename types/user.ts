import { z } from 'zod';

// ==========================================
// ZOD VALIDATION SCHEMAS
// ==========================================

export const UserEducationSchema = z.object({
  schoolOrCollege: z.string().min(2, 'Institution name must be at least 2 characters'),
  degree: z.string().optional(),
  major: z.string().optional(),
  graduationYear: z.string().optional(),
  favoriteSubjects: z.array(z.string()).optional(),
});

export const UserCareerSchema = z.object({
  experienceLevel: z.enum(['student', 'entry', 'mid', 'senior']),
  currentRole: z.string().optional(),
  company: z.string().optional(),
  yearsOfExperience: z.number().optional(),
});

export const UserPreferencesSchema = z.object({
  workMode: z.enum(['remote', 'hybrid', 'onsite']).optional(),
  location: z.string().optional(),
});

export const UserSocialsSchema = z.object({
  github: z.string().optional(),
  linkedin: z.string().optional(),
});

export const UserAvailabilitySchema = z.object({
  weeklyHours: z.number().min(1).max(168),
});

export const OnboardingPayloadSchema = z.object({
  uid: z.string().min(1, 'User UID is required'),
  email: z.string().email('Invalid email address').nullable(),
  displayName: z.string().nullable(),
  photoURL: z.string().nullable(),
  stage: z.enum(['school', 'college', 'professional']),
  education: UserEducationSchema.optional(),
  career: UserCareerSchema.optional(),
  preferences: UserPreferencesSchema.optional(),
  socials: UserSocialsSchema.optional(),
  availability: UserAvailabilitySchema.optional(),
});

// ==========================================
// TYPES DERIVED FROM SCHEMAS & INTERFACES
// ==========================================

export type UserEducation = z.infer<typeof UserEducationSchema>;
export type UserCareer = z.infer<typeof UserCareerSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type UserSocials = z.infer<typeof UserSocialsSchema>;
export type UserAvailability = z.infer<typeof UserAvailabilitySchema>;
export type OnboardingPayload = z.infer<typeof OnboardingPayloadSchema>;

export interface AIProfile {
  persona: string;
  learningStyle: string;
  growthPriorities: string[];
  strengths: string[];
  gaps: string[];
  suggestedPaths: string[];
  suggestedSkills: string[];
  learningGoal: string;
  firstMilestone: string;
  welcomeMessage: string;
  version: number;
  model: string;
  generatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  onboarded: boolean;
  stage: 'school' | 'college' | 'professional';
  education?: UserEducation;
  career?: UserCareer;
  preferences?: UserPreferences;
  socials?: UserSocials;
  availability?: UserAvailability;
  aiProfile?: AIProfile;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}
