-- Database Schema for دراسة (Derasa) Educational Platform
-- Run this in your Supabase SQL Editor

-- Create custom users table that extends Supabase auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  birth_date DATE,
  parent_email TEXT,
  consent_given BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'family')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ,
  preferences JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{"shareProgress": false, "allowAnalytics": true, "parentNotifications": true}'
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT,
  grade_level TEXT,
  session_type TEXT DEFAULT 'general' CHECK (session_type IN ('homework', 'explanation', 'practice', 'general')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS on chat_sessions table
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_sessions table
CREATE POLICY "Users can view own sessions" ON public.chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON public.chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  image_url TEXT,
  image_data TEXT,
  moderated BOOLEAN DEFAULT FALSE,
  moderation_flags JSONB DEFAULT '{}',
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS on chat_messages table
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_messages table
CREATE POLICY "Users can view own messages" ON public.chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  skill_level INTEGER DEFAULT 0 CHECK (skill_level >= 0 AND skill_level <= 100),
  mastery_score INTEGER DEFAULT 0 CHECK (mastery_score >= 0 AND mastery_score <= 100),
  time_spent_minutes INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subject, topic)
);

-- Enable RLS on user_progress table
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user_progress table
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR ALL USING (auth.uid() = user_id);

-- Create content_moderation_logs table
CREATE TABLE IF NOT EXISTS public.content_moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  moderation_result JSONB NOT NULL,
  action_taken TEXT NOT NULL CHECK (action_taken IN ('approved', 'flagged', 'blocked')),
  reviewer_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on content_moderation_logs table
ALTER TABLE public.content_moderation_logs ENABLE ROW LEVEL SECURITY;

-- Create parental_controls table
CREATE TABLE IF NOT EXISTS public.parental_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  parent_email TEXT NOT NULL,
  daily_limit_minutes INTEGER DEFAULT 60,
  allowed_subjects TEXT[] DEFAULT ARRAY['الرياضيات', 'العلوم', 'اللغة العربية', 'الإنجليزية'],
  content_level TEXT DEFAULT 'middle' CHECK (content_level IN ('elementary', 'middle', 'high')),
  monitoring_enabled BOOLEAN DEFAULT TRUE,
  homework_help_only BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_user_id)
);

-- Enable RLS on parental_controls table
ALTER TABLE public.parental_controls ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON public.chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_subject ON public.user_progress(subject);

-- Create trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parental_controls_updated_at
  BEFORE UPDATE ON public.parental_controls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create user stats view
CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
  u.id as user_id,
  COALESCE(session_stats.total_sessions, 0) as total_sessions,
  COALESCE(message_stats.total_messages, 0) as total_messages,
  COALESCE(progress_stats.subjects_learned, ARRAY[]::text[]) as subjects_learned,
  COALESCE(session_stats.total_time_minutes, 0) as total_time_minutes,
  COALESCE(session_stats.average_session_length, 0) as average_session_length,
  COALESCE(u.last_seen_at, u.created_at) as last_activity
FROM public.users u
LEFT JOIN (
  SELECT 
    user_id,
    COUNT(*) as total_sessions,
    SUM(EXTRACT(EPOCH FROM (updated_at - created_at))/60) as total_time_minutes,
    AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/60) as average_session_length
  FROM public.chat_sessions 
  GROUP BY user_id
) session_stats ON u.id = session_stats.user_id
LEFT JOIN (
  SELECT 
    user_id,
    COUNT(*) as total_messages
  FROM public.chat_messages 
  WHERE role = 'user'
  GROUP BY user_id
) message_stats ON u.id = message_stats.user_id
LEFT JOIN (
  SELECT 
    user_id,
    ARRAY_AGG(DISTINCT subject) as subjects_learned
  FROM public.user_progress
  WHERE skill_level > 0
  GROUP BY user_id
) progress_stats ON u.id = progress_stats.user_id;

-- Grant permissions
GRANT SELECT ON public.user_stats TO authenticated;
