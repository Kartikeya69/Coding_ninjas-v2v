export const ROLES_LIST = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Machine Learning Engineer',
  'Data Scientist',
  'Product Manager',
  'UI/UX Designer',
  'Cybersecurity Analyst',
  'Cloud Architect',
  'DevOps Engineer',
  'Developer Advocate',
] as const;

export type ProfessionalRole = typeof ROLES_LIST[number];
