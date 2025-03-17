-- Create users table extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interview sessions table
CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT,
  industry TEXT,
  difficulty INTEGER,
  question_count INTEGER,
  categories TEXT[],
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'created',
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create interview results table
CREATE TABLE IF NOT EXISTS interview_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES interview_sessions(id) ON DELETE SET NULL,
  questions TEXT[],
  question_types TEXT[],
  answers TEXT[],
  code_answers TEXT[],
  coding_languages TEXT[],
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  overall_score INTEGER,
  metrics JSONB,
  personality_traits TEXT[]
);

-- Create notes table
CREATE TABLE IF NOT EXISTS interview_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES interview_sessions(id) ON DELETE CASCADE,
  question_index INTEGER,
  note_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled interviews table
CREATE TABLE IF NOT EXISTS scheduled_interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 30,
  interview_type TEXT DEFAULT 'practice',
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reminder_sent BOOLEAN DEFAULT FALSE
);

-- Create RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_interviews ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Interview sessions policies
CREATE POLICY "Users can view their own interview sessions"
  ON interview_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interview sessions"
  ON interview_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interview sessions"
  ON interview_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Interview results policies
CREATE POLICY "Users can view their own interview results"
  ON interview_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interview results"
  ON interview_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Interview notes policies
CREATE POLICY "Users can view their own interview notes"
  ON interview_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interview notes"
  ON interview_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interview notes"
  ON interview_notes FOR UPDATE
  USING (auth.uid() = user_id);

-- Scheduled interviews policies
CREATE POLICY "Users can view their own scheduled interviews"
  ON scheduled_interviews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scheduled interviews"
  ON scheduled_interviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled interviews"
  ON scheduled_interviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled interviews"
  ON scheduled_interviews FOR DELETE
  USING (auth.uid() = user_id);
