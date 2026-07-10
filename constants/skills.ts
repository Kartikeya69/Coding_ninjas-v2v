export const SKILLS_INVENTORY = {
  frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue', 'HTML5/CSS3', 'Framer Motion'],
  backend: ['Node.js', 'Express', 'Python', 'Go', 'NestJS', 'GraphQL', 'Django'],
  database: ['PostgreSQL', 'MongoDB', 'Redis', 'Cloud Firestore', 'Supabase', 'SQL'],
  ai: ['OpenAI API', 'Gemini API', 'PyTorch', 'TensorFlow', 'LangChain', 'Vector Databases'],
  devops: ['Docker', 'AWS', 'Vercel', 'Firebase Hosting', 'CI/CD Pipelines', 'GitHub Actions'],
  design: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'Design Systems'],
  soft: ['Communication', 'Team Leadership', 'Project Management', 'Problem Solving', 'Public Speaking'],
};

export const ALL_SKILLS = Object.values(SKILLS_INVENTORY).flat();
