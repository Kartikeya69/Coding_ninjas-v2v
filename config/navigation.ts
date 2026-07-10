import { ROUTES } from './routes';

export interface NavigationItem {
  title: string;
  href: string;
  icon: string;
  description?: string;
  exact?: boolean;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

/**
 * Sidebar Navigation config for authenticated dashboard routes
 */
export const sidebarNavigation: NavigationSection[] = [
  {
    title: 'Workspace',
    items: [
      {
        title: 'Dashboard',
        href: ROUTES.dashboard,
        icon: 'LayoutDashboard',
        description: 'Your career progress at a glance',
        exact: true,
      },
      {
        title: 'Resume Builder',
        href: ROUTES.resume,
        icon: 'FileText',
        description: 'AI-assisted resume optimizer',
      },
      {
        title: 'Scholarships',
        href: ROUTES.scholarships,
        icon: 'GraduationCap',
        description: 'Find matching funding & grants',
      },
      {
        title: 'Job Board',
        href: ROUTES.jobs,
        icon: 'Briefcase',
        description: 'Browse smart-matched career opportunities',
      },
    ],
  },
  {
    title: 'Development',
    items: [
      {
        title: 'Mentors',
        href: ROUTES.mentors,
        icon: 'Users',
        description: 'Connect with industry experts',
      },
      {
        title: 'Finance Hub',
        href: ROUTES.finance,
        icon: 'Wallet',
        description: 'Manage educational budgets & applications',
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        title: 'Professional Profile',
        href: ROUTES.profile,
        icon: 'User',
        description: 'View your portfolio & career roadmap',
      },
      {
        title: 'Settings',
        href: ROUTES.settings,
        icon: 'Settings',
        description: 'Manage account, AI & privacy options',
      },
    ],
  },
];

/**
 * Landing Page header navigation links
 */
export const landingNavigation: NavigationItem[] = [
  {
    title: 'Features',
    href: '#features',
    icon: 'Sparkles',
  },
  {
    title: 'Mentorship',
    href: '#mentorship',
    icon: 'Users',
  },
  {
    title: 'Scholarships',
    href: '#scholarships',
    icon: 'GraduationCap',
  },
  {
    title: 'Pricing',
    href: '#pricing',
    icon: 'CreditCard',
  },
];
