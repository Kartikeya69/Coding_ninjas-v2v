/**
 * Firestore Collection Names Constants
 */
export const COLLECTIONS = {
  users: 'users',
  careerRoadmaps: 'careerRoadmaps',
  resumes: 'resumes',
  jobs: 'jobs',
  mentors: 'mentors',
  scholarships: 'scholarships',
  finance: 'finance',
  notifications: 'notifications',
  chatSessions: 'chatSessions',
  settings: 'settings',
} as const;

export type FirestoreCollection = typeof COLLECTIONS[keyof typeof COLLECTIONS];
