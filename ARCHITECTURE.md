# Vibe2Vision Architecture

This repository snapshot contains the main application shell and feature architecture for the Vibe2Vision platform. The heavy service/helper layer has intentionally been left out of this upload.

## Application Layer

- `app/` - Next.js App Router routes, layouts, loading/error states, and API route entry points.
- `app/(dashboard)/` - Authenticated dashboard route group for profile, jobs, finance, mentors, scholarships, settings, resume, and dashboard pages.
- `app/api/` - API route boundaries for AI, jobs, opportunities, onboarding, coaching, and resume analysis.

## Feature Modules

- `modules/landing/` - Public landing experience.
- `modules/auth/` - Login and authentication-facing views.
- `modules/onboarding/` - User onboarding flow.
- `modules/dashboard/` - Main dashboard widgets, health checks, activity timeline, and quick capture.
- `modules/resume/` - Resume builder UI, templates, export, ATS report, and inline AI panel.
- `modules/jobs/` - Jobs discovery view.
- `modules/scholarships/` - Scholarships and opportunities discovery view.
- `modules/mentor/` - Mentor discovery and interaction view.
- `modules/finance/` - Finance planning interface.
- `modules/profile/` - Profile management view.
- `modules/settings/` - User and app settings view.
- `modules/coach/` - Coaching panels, daily missions, and goal tracking.

## Shared UI

- `components/ai/` - AI assistant UI elements.
- `components/animations/` - Motion helpers and pointer effects.
- `components/buttons/` - Shared button primitives.
- `components/cards/` - Card primitives.
- `components/charts/` - Data visualization components.
- `components/forms/` - Form controls.
- `components/navigation/` - Sidebar, topbar, breadcrumbs, notifications, command palette, and floating assistant.
- `components/widgets/` - Dashboard and empty-state widgets.

## Configuration And Data

- `config/` - Navigation, metadata, routes, dashboard, theme, site, and resume section configuration.
- `constants/` - Static education, role, country, color, scholarship, skills, and career path data.
- `types/` - Shared TypeScript domain models.
- `firebase/` - Firebase client integration boundaries.
- `providers/` - React providers for Firebase, Gemini, React Query, and theme.
- `hooks/` - Feature and state hooks for auth, dashboard, onboarding, resume, theme, and user data.
- `public/` - Static assets.

## Omitted From This Snapshot

- `lib/` - Internal service engines, providers, AI orchestration, caching, logging, and schemas.
- `utils/` - Generic helper functions for class names, dates, formatting, Firebase errors, storage, Gemini, and validation.
- `.env.local` - Local secrets and environment configuration.
- `.next/`, `node_modules/`, logs, and other generated files.

Because `lib/` and `utils/` are intentionally excluded, this snapshot documents and shares the application architecture but is not expected to build as a complete production app without restoring those layers.
