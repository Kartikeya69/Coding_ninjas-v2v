export interface ResumeSectionDef {
  id: string;
  title: string;
  order: number;
  required: boolean;
  aiEnabled: boolean;
  placeholderText: string;
}

export const resumeSections: ResumeSectionDef[] = [
  {
    id: 'details',
    title: 'Personal Details',
    order: 1,
    required: true,
    aiEnabled: false,
    placeholderText: 'Name, email, phone, location, github, linkedin...'
  },
  {
    id: 'summary',
    title: 'Professional Summary',
    order: 2,
    required: false,
    aiEnabled: true,
    placeholderText: 'Brief summary outlining your target roles and strengths...'
  },
  {
    id: 'experience',
    title: 'Work Experience',
    order: 3,
    required: false,
    aiEnabled: true,
    placeholderText: 'Companies, position titles, dates, and achievements...'
  },
  {
    id: 'education',
    title: 'Education',
    order: 4,
    required: false,
    aiEnabled: false,
    placeholderText: 'Schools, colleges, degrees, majors, and graduation years...'
  },
  {
    id: 'projects',
    title: 'Projects',
    order: 5,
    required: false,
    aiEnabled: true,
    placeholderText: 'Project names, tech stack used, and bullet details...'
  },
  {
    id: 'skills',
    title: 'Skills',
    order: 6,
    required: false,
    aiEnabled: false,
    placeholderText: 'Languages, frameworks, developer tools, database engines...'
  }
];

export default resumeSections;
