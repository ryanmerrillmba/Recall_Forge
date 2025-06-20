import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase client (for browser usage)
export const createClientSupabase = () => {
  return createClientComponentClient<Database>();
};

// Basic client for non-authenticated operations (client-side)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Database configuration constants
export const DATABASE_CONFIG = {
  connectionPool: {
    min: 2,
    max: 20,
    idle: 30000,
    acquire: 60000,
    evict: 1000,
  },
  ssl: true,
  statement_timeout: 30000,
  query_timeout: 30000,
} as const;

// COPPA compliance helpers
export const COPPA_CONFIG = {
  MIN_AGE: 13,
  ENHANCED_PROTECTION_AGE: 13,
  DATA_RETENTION_DAYS: 30,
  ALLOWED_ROLES: ['parent', 'teacher', 'admin'] as const,
} as const;

// Child-safe error messages
export const CHILD_FRIENDLY_ERRORS = {
  DECK_PROCESSING_FAILED: {
    technical: "AI processing failed for deck creation",
    childFriendly: "Oops! We're having trouble with your questions. Let's try again!",
    recoveryActions: ["Try uploading the file again", "Check if your CSV file is formatted correctly"]
  },
  SESSION_TIMEOUT: {
    technical: "Session expired due to inactivity",
    childFriendly: "You've been away for a while! Let's start fresh.",
    recoveryActions: ["Start a new practice session"]
  },
  INAPPROPRIATE_CONTENT: {
    technical: "Content contains inappropriate material",
    childFriendly: "Let's make sure our questions are appropriate for learning!",
    recoveryActions: ["Review your content", "Contact support for help"]
  },
  TOO_FEW_QUESTIONS: {
    technical: "Minimum 5 questions required",
    childFriendly: "We need at least 5 questions to make a great practice session!",
    recoveryActions: ["Add more questions to your CSV file"]
  },
  TOO_MANY_QUESTIONS: {
    technical: "Maximum 500 questions per deck",
    childFriendly: "Wow! That's a lot of questions. Let's split them into smaller groups.",
    recoveryActions: ["Split your questions into multiple decks"]
  },
} as const;

export type ChildFriendlyError = keyof typeof CHILD_FRIENDLY_ERRORS;