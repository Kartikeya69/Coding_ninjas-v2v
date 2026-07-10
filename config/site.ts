/**
 * Site branding and settings configuration
 */
export const siteConfig = {
  name: 'Lumina AI',
  tagline: 'Your AI Career Operating System',
  description: 'An AI-powered platform empowering women to discover careers, build skills, prepare for interviews, design resumes, secure scholarships, and connect with mentors.',
  url: 'https://lumina-ai.vercel.app',
  ogImage: '/images/og-image.jpg',
  creator: 'Lumina AI Team',
  links: {
    github: 'https://github.com/lumina-ai',
    twitter: 'https://twitter.com/lumina_ai',
  },
  contact: {
    email: 'support@lumina-ai.com',
  },
} as const;

export type SiteConfig = typeof siteConfig;
