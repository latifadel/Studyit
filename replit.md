# StudyIt - Personalized Study Planner

## Overview

StudyIt is a Next.js-based personalized study planning application designed to help users organize their learning, track progress, and engage with educational content through flashcards, quizzes, and an AI tutor interface. The app provides a dashboard-driven experience where users can manage their study preferences, create study plans, and monitor their performance over time.

The application is built as a client-side app with localStorage persistence, making it suitable for demo purposes and rapid prototyping. All data is stored locally in the browser without requiring a backend database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 15.5.4 with React 19.1.0
- Uses the App Router architecture (`src/app` directory structure)
- TypeScript for type safety across all components
- Client-side rendering for interactive features (marked with `"use client"`)
- Tailwind CSS v4 for styling with custom theme variables

**Routing Strategy**:
- File-based routing via Next.js App Router
- Public routes: `/` (landing), `/login`
- Protected routes: All other pages require authentication
- Route protection handled via `Protected` component wrapper

**State Management**:
- Local component state using React hooks (`useState`, `useEffect`)
- Global auth state via React Context (`AuthProvider`)
- No external state management library (Redux, Zustand, etc.)

### Authentication & Authorization

**Auth Implementation**:
- Custom localStorage-based authentication (no server-side auth)
- `AuthProvider` context provides `user`, `login()`, and `logout()` methods
- User object structure: `{ email: string }`
- Session persistence key: `studyit_user` in localStorage

**Route Protection**:
- `Protected` component wraps all routes in root layout
- Redirects unauthenticated users to `/login` for protected routes
- Public routes explicitly allow anonymous access

**Design Rationale**: Chose localStorage auth for simplicity and demo purposes. This approach avoids backend dependencies but is not suitable for production security requirements. Future enhancement would integrate proper authentication providers (NextAuth, Clerk, etc.).

### Data Storage

**Client-Side Persistence** (localStorage):

All application data is stored in browser localStorage with the following keys:

- `studyit_user`: Current user session `{ email: string }`
- `studyit_prefs`: User preferences `{ subjects: string, goal: string, style: string, level: string }`
- `studyit_stats`: Performance metrics `{ streak: number, sessions: number, quizzes: number }`
- `studyit_plan`: Study plan items `PlanItem[]` where `PlanItem = { topic: string, type: string, day: number }`
- `studyit_cards`: Flashcard collection `Card[]` where `Card = { q: string, a: string, due: string }`
- `studyit_settings`: App settings `{ notif: boolean, difficulty: string }`

**Design Rationale**: localStorage provides zero-friction data persistence for prototyping. The schema is intentionally simple with string-based keys and JSON serialization. This approach trades scalability and security for development speed.

**Limitations**: 
- No data validation or migration strategy
- No multi-device sync
- Storage quota limits (~5-10MB)
- Data loss on browser cache clear

### Application Features

**Core Pages & Functionality**:

1. **Dashboard** (`/dashboard`): Main hub displaying KPIs (streak, sessions, quizzes) and quick links
2. **Preferences** (`/preferences`): Form to configure subjects, goals, learning style, and difficulty level
3. **Study Plan** (`/plan`): Generates a deterministic 2-day study schedule from preferences
4. **Flashcards** (`/flashcards`): Creates and stores flashcard sets for topics
5. **Quiz** (`/quiz`): Builds 3-question quizzes with scoring and stats tracking
6. **AI Tutor** (`/tutor`): Chat interface with placeholder AI responses (no actual AI integration)
7. **Performance** (`/performance`): Analytics view of user statistics
8. **Settings** (`/settings`): Account settings and logout functionality

**Data Flow Pattern**:
- User inputs → Local state → localStorage persistence
- Page hydration → Read from localStorage → Populate UI
- No server API calls; all logic runs client-side

### Styling & UI

**CSS Framework**: Tailwind CSS v4
- Global styles in `src/app/globals.css`
- Custom CSS variables for theming (`--background`, `--foreground`)
- Dark mode support via `prefers-color-scheme` media query
- Utility-first approach for component styling

**Design System**:
- Card-based layout pattern across pages
- Consistent spacing with Tailwind spacing scale
- Shadow and rounded corners for visual hierarchy
- Responsive grid layouts with `md:` breakpoints

### Development Configuration

**TypeScript Setup**:
- Strict mode enabled for type safety
- Path alias `@/*` maps to `src/*` for clean imports
- Targets ES2022 with ESNext modules
- Next.js plugin for enhanced type checking

**Build Configuration**:
- Development server on port 5000 (bound to 0.0.0.0 for external access)
- Custom dev and start scripts for deployment flexibility
- Standard Next.js build process (no custom webpack config)

## External Dependencies

### Core Framework Dependencies
- **Next.js 15.5.4**: React meta-framework for routing, SSR, and build tooling
- **React 19.1.0** & **React DOM 19.1.0**: UI library and rendering engine

### Development Dependencies
- **TypeScript 5**: Type system and compiler
- **Tailwind CSS v4**: Utility-first CSS framework
- **@tailwindcss/postcss**: PostCSS integration for Tailwind
- **@types/node**, **@types/react**, **@types/react-dom**: TypeScript definitions

### Missing Integrations (Future Work)

The application currently has placeholder implementations for:

1. **AI/LLM Integration**: The AI Tutor page has no actual model connection; responses are hardcoded
2. **Database**: No persistent backend storage; all data is localStorage only
3. **Authentication Provider**: No OAuth, JWT, or session management service
4. **Analytics**: No tracking or monitoring (Google Analytics, PostHog, etc.)
5. **API Routes**: No Next.js API routes or external API calls implemented

**Recommendation**: Future iterations should integrate:
- OpenAI/Anthropic API for AI Tutor functionality
- Postgres + Drizzle ORM for persistent storage
- NextAuth or Clerk for production-grade authentication
- Vercel Analytics or similar for usage tracking