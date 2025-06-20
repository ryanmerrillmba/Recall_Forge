-- RecallForge Database Schema Migration 001
-- Initial database schema with COPPA-compliant structure
-- Author: Claude Code
-- Date: 2025-01-20

BEGIN;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('parent', 'teacher', 'admin');
CREATE TYPE subscription_status AS ENUM ('free', 'individual', 'family', 'educator');
CREATE TYPE processing_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE billing_status AS ENUM ('paid', 'pending', 'failed', 'refunded');
CREATE TYPE email_subscription_type AS ENUM ('parent_updates', 'teacher_resources', 'product_announcements');
CREATE TYPE session_type AS ENUM ('practice', 'test', 'review');

-- ============================================================================
-- USERS TABLE - Core user management (Parents/Teachers only - COPPA compliant)
-- ============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role user_role DEFAULT 'parent',
  subscription_status subscription_status DEFAULT 'free',
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  email_marketing_consent BOOLEAN DEFAULT false,
  beehiiv_subscriber_id VARCHAR(255),
  is_active BOOLEAN DEFAULT true
);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_subscription ON users(subscription_status);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX idx_users_active ON users(is_active);

-- ============================================================================
-- SUBSCRIPTION BILLING TABLE - Payment tracking for Stripe integration
-- ============================================================================
CREATE TABLE subscription_billing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_invoice_id VARCHAR(255) NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  amount_paid INTEGER NOT NULL, -- in cents
  currency VARCHAR(3) DEFAULT 'USD',
  billing_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  billing_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  status billing_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for billing table
CREATE INDEX idx_billing_user_id ON subscription_billing(user_id);
CREATE INDEX idx_billing_invoice ON subscription_billing(stripe_invoice_id);
CREATE INDEX idx_billing_status ON subscription_billing(status);
CREATE INDEX idx_billing_created_at ON subscription_billing(created_at);

-- ============================================================================
-- EMAIL SUBSCRIBERS TABLE - Beehiiv integration for marketing
-- ============================================================================
CREATE TABLE email_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  beehiiv_subscriber_id VARCHAR(255) UNIQUE,
  subscription_type email_subscription_type DEFAULT 'parent_updates',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  double_opt_in_confirmed BOOLEAN DEFAULT false,
  source VARCHAR(50) DEFAULT 'website_footer', -- tracking signup source
  is_active BOOLEAN DEFAULT true
);

-- Indexes for email subscribers
CREATE INDEX idx_email_subscribers_user_id ON email_subscribers(user_id);
CREATE INDEX idx_email_subscribers_beehiiv ON email_subscribers(beehiiv_subscriber_id);
CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX idx_email_subscribers_active ON email_subscribers(is_active);

-- ============================================================================
-- CHILD PROFILES TABLE - COPPA-compliant child data storage
-- ============================================================================
CREATE TABLE child_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  grade_level INTEGER CHECK (grade_level BETWEEN 1 AND 12),
  birth_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  preferences JSONB DEFAULT '{}',
  
  CONSTRAINT valid_birth_year CHECK (birth_year >= 2000 AND birth_year <= EXTRACT(YEAR FROM NOW()))
);

-- Indexes for child profiles
CREATE INDEX idx_child_profiles_parent_id ON child_profiles(parent_id);
CREATE INDEX idx_child_profiles_grade ON child_profiles(grade_level);
CREATE INDEX idx_child_profiles_active ON child_profiles(is_active);

-- ============================================================================
-- DECKS TABLE - Flashcard collections
-- ============================================================================
CREATE TABLE decks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  subject VARCHAR(100) DEFAULT 'Latin',
  total_questions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  csv_filename VARCHAR(255),
  processing_status processing_status DEFAULT 'pending',
  ai_processing_metadata JSONB DEFAULT '{}'
);

-- Indexes for decks
CREATE INDEX idx_decks_user_id ON decks(user_id);
CREATE INDEX idx_decks_child_id ON decks(child_id);
CREATE INDEX idx_decks_status ON decks(processing_status);
CREATE INDEX idx_decks_subject ON decks(subject);
CREATE INDEX idx_decks_active ON decks(is_active);
CREATE INDEX idx_decks_updated_at ON decks(updated_at);

-- ============================================================================
-- QUESTIONS TABLE - AI-generated multiple choice questions
-- ============================================================================
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  distractor_1 TEXT NOT NULL,
  distractor_2 TEXT NOT NULL,
  distractor_3 TEXT NOT NULL,
  category VARCHAR(100),
  subcategory VARCHAR(100),
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5) DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT true,
  original_csv_row INTEGER
);

-- Indexes for questions
CREATE INDEX idx_questions_deck_id ON questions(deck_id);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_subcategory ON questions(subcategory);
CREATE INDEX idx_questions_difficulty ON questions(difficulty_level);
CREATE INDEX idx_questions_csv_row ON questions(original_csv_row);

-- ============================================================================
-- TEST SESSIONS TABLE - Individual practice/test sessions
-- ============================================================================
CREATE TABLE test_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  score_percentage DECIMAL(5,2),
  session_type session_type DEFAULT 'practice'
);

-- Indexes for test sessions
CREATE INDEX idx_test_sessions_child_id ON test_sessions(child_id);
CREATE INDEX idx_test_sessions_deck_id ON test_sessions(deck_id);
CREATE INDEX idx_test_sessions_completed ON test_sessions(completed_at);
CREATE INDEX idx_test_sessions_started_at ON test_sessions(started_at);
CREATE INDEX idx_test_sessions_type ON test_sessions(session_type);

-- Performance optimization: Composite index for child's deck performance
CREATE INDEX idx_child_deck_performance ON test_sessions(child_id, deck_id, completed_at DESC) 
WHERE completed_at IS NOT NULL;

-- ============================================================================
-- QUESTION RESPONSES TABLE - Individual answers within sessions
-- ============================================================================
CREATE TABLE question_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES test_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  response_time_seconds INTEGER,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for question responses
CREATE INDEX idx_question_responses_session_id ON question_responses(session_id);
CREATE INDEX idx_question_responses_question_id ON question_responses(question_id);
CREATE INDEX idx_question_responses_correct ON question_responses(is_correct);
CREATE INDEX idx_question_responses_answered_at ON question_responses(answered_at);

-- Performance optimization: Index for question difficulty analysis
CREATE INDEX idx_question_performance ON question_responses(question_id, is_correct) 
INCLUDE (response_time_seconds);

-- ============================================================================
-- DATABASE FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for decks table
CREATE TRIGGER update_decks_updated_at 
    BEFORE UPDATE ON decks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate session score percentage
CREATE OR REPLACE FUNCTION calculate_session_score()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate score percentage when session is completed
    IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
        NEW.score_percentage = CASE 
            WHEN NEW.total_questions > 0 THEN 
                ROUND((NEW.correct_answers::DECIMAL / NEW.total_questions::DECIMAL) * 100, 2)
            ELSE 0 
        END;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic score calculation
CREATE TRIGGER calculate_test_session_score 
    BEFORE UPDATE ON test_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION calculate_session_score();

-- Function to update deck question count
CREATE OR REPLACE FUNCTION update_deck_question_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE decks SET total_questions = total_questions + 1 WHERE id = NEW.deck_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE decks SET total_questions = total_questions - 1 WHERE id = OLD.deck_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers for question count management
CREATE TRIGGER update_deck_question_count_insert 
    AFTER INSERT ON questions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_deck_question_count();

CREATE TRIGGER update_deck_question_count_delete 
    AFTER DELETE ON questions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_deck_question_count();

-- ============================================================================
-- INITIAL DATA AND CONSTRAINTS
-- ============================================================================

-- Add additional constraints for data integrity
ALTER TABLE child_profiles ADD CONSTRAINT valid_name_length CHECK (LENGTH(TRIM(name)) >= 1);
ALTER TABLE decks ADD CONSTRAINT valid_deck_name_length CHECK (LENGTH(TRIM(name)) >= 1);
ALTER TABLE questions ADD CONSTRAINT valid_question_text_length CHECK (LENGTH(TRIM(question_text)) >= 10);
ALTER TABLE questions ADD CONSTRAINT valid_answer_length CHECK (LENGTH(TRIM(correct_answer)) >= 1);

-- Create a view for deck statistics (will be used frequently)
CREATE OR REPLACE VIEW deck_statistics AS
SELECT 
    d.id,
    d.name,
    d.subject,
    d.total_questions,
    COUNT(DISTINCT ts.id) as total_sessions,
    AVG(ts.score_percentage) as average_score,
    MAX(ts.completed_at) as last_session_date,
    COUNT(DISTINCT ts.child_id) as unique_children
FROM decks d
LEFT JOIN test_sessions ts ON d.id = ts.deck_id AND ts.completed_at IS NOT NULL
WHERE d.is_active = true
GROUP BY d.id, d.name, d.subject, d.total_questions;

-- Create migration tracking table
CREATE TABLE IF NOT EXISTS migration_history (
    id SERIAL PRIMARY KEY,
    migration_name VARCHAR(255) NOT NULL UNIQUE,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    checksum VARCHAR(255)
);

-- Record this migration
INSERT INTO migration_history (migration_name, checksum) 
VALUES ('001_initial_schema', md5('001_initial_schema_v1.0'));

COMMIT;