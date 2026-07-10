/**
 * App Routing Configuration
 */
export const ROUTES = {
  landing: '/',
  login: '/login',
  onboarding: '/onboarding',
  dashboard: '/dashboard',
  resume: '/resume',
  scholarships: '/scholarships',
  jobs: '/jobs',
  mentors: '/mentors',
  finance: '/finance',
  profile: '/profile',
  settings: '/settings',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];

// Routes accessible without authentication
export const PUBLIC_ROUTES = [
  ROUTES.landing,
  ROUTES.login,
] as const;

// Routes that require authentication but bypass onboarding
export const ONBOARDING_ROUTE = ROUTES.onboarding;

// Routes protected by Auth Middleware
export const PROTECTED_ROUTES = [
  ROUTES.dashboard,
  ROUTES.resume,
  ROUTES.scholarships,
  ROUTES.jobs,
  ROUTES.mentors,
  ROUTES.finance,
  ROUTES.profile,
  ROUTES.settings,
] as const;
