# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RecallForge is a Next.js flashcards application that transforms CSV flashcards into AI-generated multiple choice tests for elementary school students. The app focuses on child-safe design, COPPA compliance, and parent-mediated learning.

## Common Development Commands

```bash
# Development
npm run dev                # Start development server (http://localhost:3000)
npm run build             # Build for production
npm run start             # Start production server
npm run lint              # Run ESLint
npm run type-check        # Run TypeScript type checking

# Testing (when implemented)
npm run test              # Run all tests
npm run test:unit         # Run unit tests
npm run test:integration  # Run integration tests
npm run test:watch        # Run tests in watch mode
```

## Technology Stack

- **Frontend**: Next.js 15+ with TypeScript, React 18, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **AI Integration**: OpenAI GPT-4.1 mini for question generation
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Lucide React icons, custom Tailwind components
- **Payments**: Stripe integration
- **Error Monitoring**: Sentry with COPPA-compliant configuration
- **Deployment**: Designed for Cloudflare Pages + Workers

## Architecture

### Path Configuration
- Uses `@/*` path mapping to `./src/*` (configured in tsconfig.json)
- Next.js App Router structure in `src/app/`

### Key Dependencies
- `@supabase/supabase-js` & `@supabase/auth-helpers-nextjs` - Database and authentication
- `stripe` & `@stripe/stripe-js` - Payment processing
- `openai` - AI question generation
- `zustand` - Client-side state management
- `zod` - Schema validation
- `react-hook-form` & `@hookform/resolvers` - Form handling
- `@sentry/nextjs` - Error monitoring and performance tracking

### Design System
- **Colors**: Primary blue (#4A90E2), success green (#7ED321), warm orange (#F5A623)
- **Typography**: Comic Neue font for child-friendliness
- **Accessibility**: WCAG 2.1 AA compliance, minimum 44px touch targets
- **Child-Focused**: High contrast, rounded corners, celebration animations

## Critical Compliance Requirements

### COPPA Compliance
- No direct data collection from children under 13
- All account management through parents/teachers
- Minimal child data collection with automatic deletion schedules
- No marketing communications to children
- **Sentry Configuration**: Child data is sanitized before error reporting

### Content Safety
- Multi-layer content filtering for AI-generated questions
- Manual review processes for educational content
- No social features or child-to-child communication

## Error Monitoring & Sentry Integration

### Sentry Configuration
- **Project**: `recallforge` in `cambia-products` organization
- **DSN**: Configured in environment variables
- **Child-Safe Error Handling**: All errors sanitized to remove child identifiers

### Error Boundaries
- `ErrorBoundary` - Generic error boundary with child-friendly fallbacks
- `PracticeErrorBoundary` - Specialized for practice sessions
- `DashboardErrorBoundary` - Specialized for dashboard components

### Child-Safe Error Reporting
Use `reportChildSafeError()` function for manual error reporting:

```typescript
import { reportChildSafeError, createErrorContext } from '@/lib/error-reporting';

const context = createErrorContext('ComponentName', 'action_name', {
  userRole: 'parent', // Never 'child' for COPPA compliance
  errorLevel: 'medium'
});

reportChildSafeError(error, context);
```

### Environment Variables (Sentry)
```bash
NEXT_PUBLIC_SENTRY_DSN=https://57d42e8d37d61529721c095f245cf371@o4509522489835520.ingest.us.sentry.io/4509523369787392
SENTRY_ORG=cambia-products
SENTRY_PROJECT=recallforge
SENTRY_AUTH_TOKEN=your_auth_token_here
```

## Database Schema Context

Core entities include:
- `users` - Parent/teacher accounts with subscription management
- `child_profiles` - Minimal child information (COPPA-compliant)
- `decks` - CSV-uploaded flashcard collections
- `questions` - AI-generated multiple choice questions
- `test_sessions` - Practice session tracking
- `question_responses` - Individual answer analytics

## Development Notes

- **Primary Users**: 9-year-old children (secondary: parents/teachers)
- **Performance**: Optimize for sub-second response times (child attention spans)
- **Mobile-First**: Design for touch interfaces and mobile devices
- **AI Cost Management**: Implement caching and batching for OpenAI API calls
- **Error Handling**: Child-friendly error messages and fallback states
- **COPPA Compliance**: Never collect, store, or transmit child-identifying data

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── globals.css        # Global styles with child-friendly design
│   ├── layout.tsx         # Root layout with error boundaries
│   └── page.tsx           # Home page
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components (buttons, cards, etc.)
│   │   ├── ErrorBoundary.tsx  # Child-safe error boundaries
│   │   └── SentryTest.tsx     # Development error testing
│   ├── forms/             # Form-specific components
│   └── layout/            # Layout components (header, footer, etc.)
├── lib/                   # Utility functions and configurations
│   ├── utils.ts           # General utilities
│   ├── supabase.ts        # Supabase client configuration
│   ├── openai.ts          # OpenAI client configuration
│   ├── validations.ts     # Zod schemas for validation
│   └── error-reporting.ts # Child-safe error reporting utilities
├── hooks/                 # Custom React hooks
├── stores/                # Zustand state management
├── types/                 # TypeScript type definitions
└── instrumentation.ts     # Sentry server instrumentation
```

## Environment Variables

Required environment variables for development:

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://57d42e8d37d61529721c095f245cf371@o4509522489835520.ingest.us.sentry.io/4509523369787392
SENTRY_ORG=cambia-products
SENTRY_PROJECT=recallforge
SENTRY_AUTH_TOKEN=your_auth_token_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Code Style & Conventions

- Use TypeScript strict mode for all new code
- Follow Next.js 15+ app router conventions
- Use Tailwind CSS for styling with the child-friendly design system
- Implement proper error boundaries for child-safe error handling
- Use React Hook Form with Zod for all forms
- Follow COPPA compliance guidelines for any child-related features
- Ensure all interactive elements meet WCAG 2.1 AA standards
- Minimum touch target size: 44px for child accessibility
- **Error Handling**: Always use child-safe error reporting functions
- **Data Sanitization**: Remove child identifiers before logging/reporting

## Testing Error Handling

In development mode, use the `SentryTest` component to verify error reporting:
1. Start the development server: `npm run dev`
2. Navigate to http://localhost:3000
3. Use the Sentry test buttons to verify error reporting
4. Check your Sentry dashboard at https://cambia-products.sentry.io/projects/recallforge/

## Important Security Notes

- Never log or report child-identifying information
- All Sentry error reports are automatically sanitized
- User roles should only be 'parent', 'teacher', or 'admin' - never 'child'
- Error messages shown to users should be encouraging and child-friendly
- Performance monitoring helps maintain child attention spans