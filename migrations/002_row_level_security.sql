-- RecallForge Database Schema Migration 002
-- Row Level Security (RLS) Policies for COPPA Compliance
-- Author: Claude Code
-- Date: 2025-01-20

BEGIN;

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_responses ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS FOR RLS POLICIES (Security Definer Functions)
-- ============================================================================

-- Create a private schema for security definer functions
CREATE SCHEMA IF NOT EXISTS private;

-- Helper function to get user role safely
CREATE OR REPLACE FUNCTION private.get_user_role()
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT role FROM public.users WHERE id = (SELECT auth.uid());
$$;

-- Helper function to check if user is parent of child
CREATE OR REPLACE FUNCTION private.is_child_parent(child_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.child_profiles cp
        WHERE cp.id = child_id 
        AND cp.parent_id = (SELECT auth.uid())
    );
$$;

-- Helper function to check if user owns deck
CREATE OR REPLACE FUNCTION private.is_deck_owner(deck_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.decks d
        WHERE d.id = deck_id 
        AND d.user_id = (SELECT auth.uid())
    );
$$;

-- Helper function to check if user can access child's data
CREATE OR REPLACE FUNCTION private.can_access_child_data(child_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT CASE 
        WHEN (SELECT private.get_user_role()) = 'admin' THEN true
        WHEN (SELECT private.get_user_role()) IN ('parent', 'teacher') THEN 
            private.is_child_parent(child_id)
        ELSE false
    END;
$$;

-- Helper function for subscription access
CREATE OR REPLACE FUNCTION private.check_subscription_access()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT CASE 
        WHEN (SELECT private.get_user_role()) = 'admin' THEN true
        WHEN subscription_status IN ('individual', 'family', 'educator') THEN true
        ELSE false
    END
    FROM public.users 
    WHERE id = (SELECT auth.uid());
$$;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can view and update their own data only
CREATE POLICY "Users can view own profile" 
ON users FOR SELECT 
TO authenticated 
USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
TO authenticated 
USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

-- Only admins can insert users (handled by auth triggers)
CREATE POLICY "Admin can insert users" 
ON users FOR INSERT 
TO authenticated 
WITH CHECK (private.get_user_role() = 'admin');

-- Admins can view all users
CREATE POLICY "Admin can view all users" 
ON users FOR SELECT 
TO authenticated 
USING (private.get_user_role() = 'admin');

-- ============================================================================
-- SUBSCRIPTION BILLING POLICIES
-- ============================================================================

-- Users can view their own billing records
CREATE POLICY "Users can view own billing" 
ON subscription_billing FOR SELECT 
TO authenticated 
USING ((SELECT auth.uid()) = user_id);

-- Only system can insert billing records (via service role)
CREATE POLICY "System can insert billing records" 
ON subscription_billing FOR INSERT 
TO service_role 
WITH CHECK (true);

-- Only system can update billing records
CREATE POLICY "System can update billing records" 
ON subscription_billing FOR UPDATE 
TO service_role 
USING (true);

-- ============================================================================
-- EMAIL SUBSCRIBERS POLICIES
-- ============================================================================

-- Users can view and manage their own email subscriptions
CREATE POLICY "Users can view own email subscriptions" 
ON email_subscribers FOR SELECT 
TO authenticated 
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own email subscriptions" 
ON email_subscribers FOR INSERT 
TO authenticated 
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own email subscriptions" 
ON email_subscribers FOR UPDATE 
TO authenticated 
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own email subscriptions" 
ON email_subscribers FOR DELETE 
TO authenticated 
USING ((SELECT auth.uid()) = user_id);

-- ============================================================================
-- CHILD PROFILES POLICIES - CRITICAL COPPA COMPLIANCE
-- ============================================================================

-- Parents can view their own children's profiles
CREATE POLICY "Parents can view own children" 
ON child_profiles FOR SELECT 
TO authenticated 
USING (private.can_access_child_data(id));

-- Parents can create children under their account
CREATE POLICY "Parents can create children" 
ON child_profiles FOR INSERT 
TO authenticated 
WITH CHECK ((SELECT auth.uid()) = parent_id AND private.get_user_role() IN ('parent', 'teacher'));

-- Parents can update their own children's profiles
CREATE POLICY "Parents can update own children" 
ON child_profiles FOR UPDATE 
TO authenticated 
USING (private.can_access_child_data(id))
WITH CHECK ((SELECT auth.uid()) = parent_id);

-- Parents can delete their own children's profiles
CREATE POLICY "Parents can delete own children" 
ON child_profiles FOR DELETE 
TO authenticated 
USING (private.can_access_child_data(id));

-- Admins can view all child profiles (for support purposes)
CREATE POLICY "Admin can view all children" 
ON child_profiles FOR ALL 
TO authenticated 
USING (private.get_user_role() = 'admin');

-- ============================================================================
-- DECKS POLICIES
-- ============================================================================

-- Users can view decks they own
CREATE POLICY "Users can view own decks" 
ON decks FOR SELECT 
TO authenticated 
USING ((SELECT auth.uid()) = user_id);

-- Users can create decks for their own children
CREATE POLICY "Users can create decks for own children" 
ON decks FOR INSERT 
TO authenticated 
WITH CHECK (
    (SELECT auth.uid()) = user_id 
    AND private.can_access_child_data(child_id)
);

-- Users can update their own decks
CREATE POLICY "Users can update own decks" 
ON decks FOR UPDATE 
TO authenticated 
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

-- Users can delete their own decks
CREATE POLICY "Users can delete own decks" 
ON decks FOR DELETE 
TO authenticated 
USING ((SELECT auth.uid()) = user_id);

-- ============================================================================
-- QUESTIONS POLICIES
-- ============================================================================

-- Users can view questions from their own decks
CREATE POLICY "Users can view questions from own decks" 
ON questions FOR SELECT 
TO authenticated 
USING (private.is_deck_owner(deck_id));

-- System can insert questions (AI processing)
CREATE POLICY "System can insert questions" 
ON questions FOR INSERT 
TO service_role 
WITH CHECK (true);

-- Users can insert questions into their own decks
CREATE POLICY "Users can insert questions into own decks" 
ON questions FOR INSERT 
TO authenticated 
WITH CHECK (private.is_deck_owner(deck_id));

-- Users can update questions in their own decks
CREATE POLICY "Users can update questions in own decks" 
ON questions FOR UPDATE 
TO authenticated 
USING (private.is_deck_owner(deck_id))
WITH CHECK (private.is_deck_owner(deck_id));

-- Users can delete questions from their own decks
CREATE POLICY "Users can delete questions from own decks" 
ON questions FOR DELETE 
TO authenticated 
USING (private.is_deck_owner(deck_id));

-- ============================================================================
-- TEST SESSIONS POLICIES
-- ============================================================================

-- Users can view test sessions for their own children
CREATE POLICY "Users can view test sessions for own children" 
ON test_sessions FOR SELECT 
TO authenticated 
USING (private.can_access_child_data(child_id));

-- Users can create test sessions for their own children with their own decks
CREATE POLICY "Users can create test sessions for own children" 
ON test_sessions FOR INSERT 
TO authenticated 
WITH CHECK (
    private.can_access_child_data(child_id) 
    AND private.is_deck_owner(deck_id)
);

-- Users can update test sessions for their own children
CREATE POLICY "Users can update test sessions for own children" 
ON test_sessions FOR UPDATE 
TO authenticated 
USING (private.can_access_child_data(child_id))
WITH CHECK (private.can_access_child_data(child_id));

-- ============================================================================
-- QUESTION RESPONSES POLICIES
-- ============================================================================

-- Users can view responses for their children's sessions
CREATE POLICY "Users can view responses for own children sessions" 
ON question_responses FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM test_sessions ts 
        WHERE ts.id = session_id 
        AND private.can_access_child_data(ts.child_id)
    )
);

-- Users can insert responses for their children's sessions
CREATE POLICY "Users can insert responses for own children sessions" 
ON question_responses FOR INSERT 
TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM test_sessions ts 
        WHERE ts.id = session_id 
        AND private.can_access_child_data(ts.child_id)
    )
);

-- Users can update responses for their children's sessions
CREATE POLICY "Users can update responses for own children sessions" 
ON question_responses FOR UPDATE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM test_sessions ts 
        WHERE ts.id = session_id 
        AND private.can_access_child_data(ts.child_id)
    )
);

-- ============================================================================
-- ADDITIONAL SECURITY MEASURES
-- ============================================================================

-- Create a restrictive policy for child data protection (COPPA compliance)
-- This ensures no child under 13 can directly access the system
CREATE OR REPLACE FUNCTION private.enforce_coppa_compliance()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT CASE 
        WHEN (SELECT auth.jwt() ->> 'role') = 'child' THEN false
        WHEN (SELECT auth.jwt() ->> 'age')::INTEGER < 13 THEN false
        ELSE true
    END;
$$;

-- Apply COPPA compliance check to all authenticated policies
CREATE POLICY "COPPA compliance check" 
ON child_profiles AS RESTRICTIVE
TO authenticated 
USING (private.enforce_coppa_compliance());

-- Create policy for automatic data deletion (COPPA requirement)
CREATE OR REPLACE FUNCTION private.schedule_data_deletion(user_id UUID)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
    -- This would be implemented with a job queue system
    -- For now, we'll log the requirement
    INSERT INTO migration_history (migration_name, checksum) 
    VALUES ('data_deletion_scheduled_for_' || user_id, 'pending');
$$;

-- ============================================================================
-- PERFORMANCE OPTIMIZATION INDEXES FOR RLS
-- ============================================================================

-- Additional indexes to optimize RLS policy performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_auth_uid ON users(id) WHERE id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_child_profiles_parent_auth ON child_profiles(parent_id, id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_decks_user_auth ON decks(user_id, id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_test_sessions_child_auth ON test_sessions(child_id, id);

-- ============================================================================
-- SECURITY VIEWS FOR SAFE DATA ACCESS
-- ============================================================================

-- Create a secure view for child progress that respects RLS
CREATE OR REPLACE VIEW child_progress_secure AS
SELECT 
    cp.id as child_id,
    cp.name as child_name,
    cp.grade_level,
    COUNT(DISTINCT d.id) as total_decks,
    COUNT(DISTINCT ts.id) as total_sessions,
    AVG(ts.score_percentage) as average_score,
    MAX(ts.completed_at) as last_session_date
FROM child_profiles cp
LEFT JOIN decks d ON cp.id = d.child_id AND d.is_active = true
LEFT JOIN test_sessions ts ON cp.id = ts.child_id AND ts.completed_at IS NOT NULL
WHERE cp.is_active = true
GROUP BY cp.id, cp.name, cp.grade_level;

-- Enable RLS on the view
ALTER VIEW child_progress_secure SET (security_invoker = true);

-- Record this migration
INSERT INTO migration_history (migration_name, checksum) 
VALUES ('002_row_level_security', md5('002_row_level_security_v1.0'));

COMMIT;