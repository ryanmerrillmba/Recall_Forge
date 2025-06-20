export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          role: 'parent' | 'teacher' | 'admin'
          subscription_status: 'free' | 'individual' | 'family' | 'educator'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_expires_at: string | null
          trial_ends_at: string | null
          last_login: string | null
          email_marketing_consent: boolean
          beehiiv_subscriber_id: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          role?: 'parent' | 'teacher' | 'admin'
          subscription_status?: 'free' | 'individual' | 'family' | 'educator'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_expires_at?: string | null
          trial_ends_at?: string | null
          last_login?: string | null
          email_marketing_consent?: boolean
          beehiiv_subscriber_id?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          role?: 'parent' | 'teacher' | 'admin'
          subscription_status?: 'free' | 'individual' | 'family' | 'educator'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_expires_at?: string | null
          trial_ends_at?: string | null
          last_login?: string | null
          email_marketing_consent?: boolean
          beehiiv_subscriber_id?: string | null
          is_active?: boolean
        }
      }
      subscription_billing: {
        Row: {
          id: string
          user_id: string
          stripe_invoice_id: string
          stripe_payment_intent_id: string | null
          amount_paid: number
          currency: string
          billing_period_start: string
          billing_period_end: string
          status: 'paid' | 'pending' | 'failed' | 'refunded'
          created_at: string
          paid_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          stripe_invoice_id: string
          stripe_payment_intent_id?: string | null
          amount_paid: number
          currency?: string
          billing_period_start: string
          billing_period_end: string
          status?: 'paid' | 'pending' | 'failed' | 'refunded'
          created_at?: string
          paid_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          stripe_invoice_id?: string
          stripe_payment_intent_id?: string | null
          amount_paid?: number
          currency?: string
          billing_period_start?: string
          billing_period_end?: string
          status?: 'paid' | 'pending' | 'failed' | 'refunded'
          created_at?: string
          paid_at?: string | null
        }
      }
      email_subscribers: {
        Row: {
          id: string
          user_id: string
          email: string
          beehiiv_subscriber_id: string | null
          subscription_type: 'parent_updates' | 'teacher_resources' | 'product_announcements'
          subscribed_at: string
          unsubscribed_at: string | null
          double_opt_in_confirmed: boolean
          source: string
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          beehiiv_subscriber_id?: string | null
          subscription_type?: 'parent_updates' | 'teacher_resources' | 'product_announcements'
          subscribed_at?: string
          unsubscribed_at?: string | null
          double_opt_in_confirmed?: boolean
          source?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          beehiiv_subscriber_id?: string | null
          subscription_type?: 'parent_updates' | 'teacher_resources' | 'product_announcements'
          subscribed_at?: string
          unsubscribed_at?: string | null
          double_opt_in_confirmed?: boolean
          source?: string
          is_active?: boolean
        }
      }
      child_profiles: {
        Row: {
          id: string
          parent_id: string
          name: string
          grade_level: number | null
          birth_year: number | null
          created_at: string
          is_active: boolean
          preferences: Json
        }
        Insert: {
          id?: string
          parent_id: string
          name: string
          grade_level?: number | null
          birth_year?: number | null
          created_at?: string
          is_active?: boolean
          preferences?: Json
        }
        Update: {
          id?: string
          parent_id?: string
          name?: string
          grade_level?: number | null
          birth_year?: number | null
          created_at?: string
          is_active?: boolean
          preferences?: Json
        }
      }
      decks: {
        Row: {
          id: string
          user_id: string
          child_id: string
          name: string
          description: string | null
          subject: string
          total_questions: number
          created_at: string
          updated_at: string
          is_active: boolean
          csv_filename: string | null
          processing_status: 'pending' | 'processing' | 'completed' | 'failed'
          ai_processing_metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          child_id: string
          name: string
          description?: string | null
          subject?: string
          total_questions?: number
          created_at?: string
          updated_at?: string
          is_active?: boolean
          csv_filename?: string | null
          processing_status?: 'pending' | 'processing' | 'completed' | 'failed'
          ai_processing_metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          child_id?: string
          name?: string
          description?: string | null
          subject?: string
          total_questions?: number
          created_at?: string
          updated_at?: string
          is_active?: boolean
          csv_filename?: string | null
          processing_status?: 'pending' | 'processing' | 'completed' | 'failed'
          ai_processing_metadata?: Json
        }
      }
      questions: {
        Row: {
          id: string
          deck_id: string
          question_text: string
          correct_answer: string
          distractor_1: string
          distractor_2: string
          distractor_3: string
          category: string | null
          subcategory: string | null
          difficulty_level: number
          created_at: string
          ai_generated: boolean
          original_csv_row: number | null
        }
        Insert: {
          id?: string
          deck_id: string
          question_text: string
          correct_answer: string
          distractor_1: string
          distractor_2: string
          distractor_3: string
          category?: string | null
          subcategory?: string | null
          difficulty_level?: number
          created_at?: string
          ai_generated?: boolean
          original_csv_row?: number | null
        }
        Update: {
          id?: string
          deck_id?: string
          question_text?: string
          correct_answer?: string
          distractor_1?: string
          distractor_2?: string
          distractor_3?: string
          category?: string | null
          subcategory?: string | null
          difficulty_level?: number
          created_at?: string
          ai_generated?: boolean
          original_csv_row?: number | null
        }
      }
      test_sessions: {
        Row: {
          id: string
          child_id: string
          deck_id: string
          started_at: string
          completed_at: string | null
          total_questions: number
          correct_answers: number
          duration_seconds: number | null
          score_percentage: number | null
          session_type: 'practice' | 'test' | 'review'
        }
        Insert: {
          id?: string
          child_id: string
          deck_id: string
          started_at?: string
          completed_at?: string | null
          total_questions: number
          correct_answers?: number
          duration_seconds?: number | null
          score_percentage?: number | null
          session_type?: 'practice' | 'test' | 'review'
        }
        Update: {
          id?: string
          child_id?: string
          deck_id?: string
          started_at?: string
          completed_at?: string | null
          total_questions?: number
          correct_answers?: number
          duration_seconds?: number | null
          score_percentage?: number | null
          session_type?: 'practice' | 'test' | 'review'
        }
      }
      question_responses: {
        Row: {
          id: string
          session_id: string
          question_id: string
          selected_answer: string
          is_correct: boolean
          response_time_seconds: number | null
          answered_at: string
        }
        Insert: {
          id?: string
          session_id: string
          question_id: string
          selected_answer: string
          is_correct: boolean
          response_time_seconds?: number | null
          answered_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          question_id?: string
          selected_answer?: string
          is_correct?: boolean
          response_time_seconds?: number | null
          answered_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'parent' | 'teacher' | 'admin'
      subscription_status: 'free' | 'individual' | 'family' | 'educator'
      processing_status: 'pending' | 'processing' | 'completed' | 'failed'
      billing_status: 'paid' | 'pending' | 'failed' | 'refunded'
      email_subscription_type: 'parent_updates' | 'teacher_resources' | 'product_announcements'
      session_type: 'practice' | 'test' | 'review'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for common operations
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type ChildProfile = Database['public']['Tables']['child_profiles']['Row'];
export type ChildProfileInsert = Database['public']['Tables']['child_profiles']['Insert'];
export type ChildProfileUpdate = Database['public']['Tables']['child_profiles']['Update'];

export type Deck = Database['public']['Tables']['decks']['Row'];
export type DeckInsert = Database['public']['Tables']['decks']['Insert'];
export type DeckUpdate = Database['public']['Tables']['decks']['Update'];

export type Question = Database['public']['Tables']['questions']['Row'];
export type QuestionInsert = Database['public']['Tables']['questions']['Insert'];
export type QuestionUpdate = Database['public']['Tables']['questions']['Update'];

export type TestSession = Database['public']['Tables']['test_sessions']['Row'];
export type TestSessionInsert = Database['public']['Tables']['test_sessions']['Insert'];
export type TestSessionUpdate = Database['public']['Tables']['test_sessions']['Update'];

export type QuestionResponse = Database['public']['Tables']['question_responses']['Row'];
export type QuestionResponseInsert = Database['public']['Tables']['question_responses']['Insert'];
export type QuestionResponseUpdate = Database['public']['Tables']['question_responses']['Update'];

export type SubscriptionBilling = Database['public']['Tables']['subscription_billing']['Row'];
export type SubscriptionBillingInsert = Database['public']['Tables']['subscription_billing']['Insert'];
export type SubscriptionBillingUpdate = Database['public']['Tables']['subscription_billing']['Update'];

export type EmailSubscriber = Database['public']['Tables']['email_subscribers']['Row'];
export type EmailSubscriberInsert = Database['public']['Tables']['email_subscribers']['Insert'];
export type EmailSubscriberUpdate = Database['public']['Tables']['email_subscribers']['Update'];

// Utility types for API responses
export interface APIError {
  error: {
    code: string;
    message: string;
    details?: any;
    childFriendlyMessage?: string;
    recoveryActions?: string[];
  };
  requestId: string;
  timestamp: string;
}

export interface DeckListResponse {
  decks: Array<{
    id: string;
    name: string;
    description: string;
    totalQuestions: number;
    lastScore?: number;
    lastTestDate?: string;
    processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
    categories: Array<{
      name: string;
      questionCount: number;
    }>;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface DeckCreateRequest {
  name: string;
  description?: string;
  childId: string;
  csvFile: File;
}

export interface DeckCreateResponse {
  deckId: string;
  processingJobId: string;
  estimatedCompletionTime: number; // seconds
}

export interface SessionStartRequest {
  deckId: string;
  childId: string;
  sessionType: 'practice' | 'test' | 'review';
  questionCount?: number;
  categories?: string[];
}

export interface SessionStartResponse {
  sessionId: string;
  questions: Array<{
    id: string;
    questionText: string;
    options: string[]; // Randomized order
    category: string;
    subcategory: string;
  }>;
  timeLimit?: number;
}

export interface AnswerSubmitRequest {
  questionId: string;
  selectedAnswer: string;
  responseTimeSeconds: number;
}

export interface AnswerSubmitResponse {
  isCorrect: boolean;
  correctAnswer?: string;
  explanation?: string;
  encouragementMessage: string;
}

export interface SessionCompleteResponse {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  durationSeconds: number;
  categoryBreakdown: Array<{
    category: string;
    correct: number;
    total: number;
  }>;
  achievements: string[];
  encouragementMessage: string;
}