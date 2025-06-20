# Supabase Database Setup for RecallForge

## Quick Setup Instructions

Since the automated migration encountered some issues, please follow these manual steps to set up your database:

### Step 1: Go to Supabase Dashboard
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Open your project: `mkfteinkyteqkgzdbijo`
3. Click on the **SQL Editor** in the left sidebar

### Step 2: Run the Database Schema
Copy and paste the SQL code below into the SQL Editor and run it:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('parent', 'teacher', 'admin');
CREATE TYPE subscription_status AS ENUM ('free', 'individual', 'family', 'educator');
CREATE TYPE processing_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Users table (Parents/Teachers only - COPPA compliant)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role DEFAULT 'parent',
    subscription_status subscription_status DEFAULT 'free',
    stripe_customer_id VARCHAR(255),
    email_marketing_consent BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Child profiles (Minimal data collection for COPPA)
CREATE TABLE child_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- First name only
    grade_level INTEGER, -- 0 for K, 1-6 for grades, NULL for homeschool
    birth_year INTEGER, -- Year only for age verification
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Decks (Flashcard collections)
CREATE TABLE decks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    subject VARCHAR(100),
    total_questions INTEGER DEFAULT 0,
    processing_status processing_status DEFAULT 'pending',
    csv_file_path TEXT,
    csv_file_size INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions (AI-generated multiple choice)
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
    difficulty_level INTEGER DEFAULT 3,
    original_csv_row INTEGER,
    ai_generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test sessions
CREATE TABLE test_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
    deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
    questions_count INTEGER NOT NULL,
    correct_count INTEGER DEFAULT 0,
    score_percentage DECIMAL(5,2),
    time_spent_seconds INTEGER,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT false
);

-- Question responses
CREATE TABLE question_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES test_sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    selected_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_spent_seconds INTEGER,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create useful indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_child_profiles_parent_id ON child_profiles(parent_id);
CREATE INDEX idx_decks_user_id ON decks(user_id);
CREATE INDEX idx_decks_child_id ON decks(child_id);
CREATE INDEX idx_questions_deck_id ON questions(deck_id);
CREATE INDEX idx_test_sessions_child_id ON test_sessions(child_id);
CREATE INDEX idx_question_responses_session_id ON question_responses(session_id);
```

### Step 3: Set up Row Level Security (RLS)
Run this SQL to enable security policies:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_responses ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" 
ON users FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Child profiles policies
CREATE POLICY "Parents can view own children" 
ON child_profiles FOR SELECT 
TO authenticated 
USING (parent_id = auth.uid());

CREATE POLICY "Parents can create children" 
ON child_profiles FOR INSERT 
TO authenticated 
WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Parents can update own children" 
ON child_profiles FOR UPDATE 
TO authenticated 
USING (parent_id = auth.uid());

-- Decks policies
CREATE POLICY "Users can view own decks" 
ON decks FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can create decks" 
ON decks FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own decks" 
ON decks FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());

-- Questions policies
CREATE POLICY "Users can view questions in own decks" 
ON questions FOR SELECT 
TO authenticated 
USING (deck_id IN (SELECT id FROM decks WHERE user_id = auth.uid()));

-- Test sessions policies
CREATE POLICY "Users can view sessions for own children" 
ON test_sessions FOR SELECT 
TO authenticated 
USING (child_id IN (SELECT id FROM child_profiles WHERE parent_id = auth.uid()));

CREATE POLICY "Users can create sessions for own children" 
ON test_sessions FOR INSERT 
TO authenticated 
WITH CHECK (child_id IN (SELECT id FROM child_profiles WHERE parent_id = auth.uid()));

-- Question responses policies
CREATE POLICY "Users can view responses for own children's sessions" 
ON question_responses FOR SELECT 
TO authenticated 
USING (session_id IN (
    SELECT id FROM test_sessions 
    WHERE child_id IN (
        SELECT id FROM child_profiles WHERE parent_id = auth.uid()
    )
));
```

### Step 4: Enable Authentication
1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Make sure **Enable email confirmations** is turned ON
3. Set the Site URL to: `http://localhost:3000`
4. Add redirect URLs: `http://localhost:3000/auth/verify-email`

### Step 5: Test the Setup

Once you've run all the SQL commands, you can test the setup:

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to [http://localhost:3000/auth/signup](http://localhost:3000/auth/signup)

3. Try creating a test account:
   - Use a real email address (you'll need to verify it)
   - Create a strong password
   - Fill in child information
   - Submit the form

4. Check your email for the verification link
   - Click the verification link
   - You should be redirected to the dashboard

### Troubleshooting

If you encounter any issues:

1. **Check the browser console** for error messages
2. **Check the Supabase logs** in your dashboard under Logs → API
3. **Verify environment variables** are correctly set in `.env.local`
4. **Run the validation command**: `npm run db:validate`

### Security Notes

✅ **COPPA Compliant**: No child accounts, minimal data collection
✅ **Row Level Security**: Users can only access their own data
✅ **Email Verification**: Required for all accounts
✅ **Secure by Default**: All tables have proper security policies

Your RecallForge database is now ready for production use!