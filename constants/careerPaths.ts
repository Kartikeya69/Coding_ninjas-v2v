export interface CareerPathOption {
  id: string;
  name: string;
  description: string;
  subRoles: string[];
}

export const CAREER_PATHS: CareerPathOption[] = [
  {
    id: 'swe',
    name: 'Software Engineering',
    description: 'Build web applications, system software, and scalable platforms.',
    subRoles: ['Frontend Engineer', 'Backend Engineer', 'Fullstack Engineer', 'Mobile Developer'],
  },
  {
    id: 'ai-ml',
    name: 'Artificial Intelligence & ML',
    description: 'Build and deploy intelligent neural networks, LLMs, and agentic systems.',
    subRoles: ['Machine Learning Engineer', 'Data Scientist', 'AI Systems Architect', 'Prompt Engineer'],
  },
  {
    id: 'design',
    name: 'Product Design & UI/UX',
    description: 'Craft stunning, modern interfaces and high-quality user experiences.',
    subRoles: ['UI/UX Designer', 'Product Designer', 'Interaction Designer', 'UX Researcher'],
  },
  {
    id: 'product',
    name: 'Product Management',
    description: 'Drive the product vision, roadmap, and design requirements.',
    subRoles: ['Associate Product Manager', 'Product Manager', 'Technical PM', 'Growth PM'],
  },
  {
    id: 'cloud',
    name: 'Cloud Infrastructure & DevOps',
    description: 'Maintain cloud architecture, scale servers, and configure CI/CD pipelines.',
    subRoles: ['DevOps Engineer', 'SRE (Site Reliability)', 'Cloud Security Engineer'],
  },
];
