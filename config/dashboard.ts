export interface WidgetConfig {
  id: string;
  title: string;
  iconName: string; // maps dynamically in render iconMap
  priority: number;
  route: string;
  visibleFor: ('school' | 'college' | 'professional')[];
  requiresAIProfile: boolean;
  size: 'small' | 'medium' | 'large'; // maps to grid columns
}

export const dashboardWidgets: WidgetConfig[] = [
  {
    id: 'ai_insights',
    title: 'Personalized AI Insights',
    iconName: 'Sparkles',
    priority: 1,
    route: '/chat',
    visibleFor: ['school', 'college', 'professional'],
    requiresAIProfile: true,
    size: 'medium'
  },
  {
    id: 'ai_health',
    title: 'Career OS Analytics',
    iconName: 'TrendingUp',
    priority: 2,
    route: '/playground',
    visibleFor: ['college', 'professional'],
    requiresAIProfile: true,
    size: 'small'
  },
  {
    id: 'roadmap_completion',
    title: 'Learning Milestones progress',
    iconName: 'CheckCircle2',
    priority: 3,
    route: '/resume',
    visibleFor: ['school', 'college', 'professional'],
    requiresAIProfile: true,
    size: 'medium'
  },
  {
    id: 'scholarships_widget',
    title: 'Eligible Scholarships',
    iconName: 'GraduationCap',
    priority: 4,
    route: '/scholarships',
    visibleFor: ['school', 'college'],
    requiresAIProfile: false,
    size: 'medium'
  },
  {
    id: 'jobs_widget',
    title: 'Recommended Internships & Jobs',
    iconName: 'Briefcase',
    priority: 5,
    route: '/jobs',
    visibleFor: ['college', 'professional'],
    requiresAIProfile: false,
    size: 'medium'
  },
  {
    id: 'finance_widget',
    title: 'Career ROI & Funding Plan',
    iconName: 'Wallet',
    priority: 6,
    route: '/finance',
    visibleFor: ['professional'],
    requiresAIProfile: false,
    size: 'small'
  },
  {
    id: 'mentor_widget',
    title: 'Industry Mentors matched',
    iconName: 'HeartHandshake',
    priority: 7,
    route: '/mentors',
    visibleFor: ['college', 'professional'],
    requiresAIProfile: false,
    size: 'small'
  },
  {
    id: 'recent_activity',
    title: 'Activity Feed Log',
    iconName: 'Activity',
    priority: 8,
    route: '/profile',
    visibleFor: ['school', 'college', 'professional'],
    requiresAIProfile: false,
    size: 'large'
  }
];

export default dashboardWidgets;
