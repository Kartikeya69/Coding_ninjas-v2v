import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes list
const PROTECTED_PATHS = [
  '/dashboard',
  '/resume',
  '/scholarships',
  '/jobs',
  '/mentors',
  '/finance',
  '/profile',
  '/settings',
  '/onboarding',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Read session cookie written by client-side Firebase provider
  const sessionActive = request.cookies.get('session_active')?.value === 'true';

  const isProtectedPath = PROTECTED_PATHS.some((path) => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // If user is not logged in and tries to access a protected path, redirect to login
  if (isProtectedPath && !sessionActive) {
    const loginUrl = new URL('/login', request.url);
    // Remember redirect destination
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is already logged in and tries to access login, redirect to dashboard
  if (pathname === '/login' && sessionActive) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Config to optimize proxy matching routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|illustrations|animations|logos).*)',
  ],
};
