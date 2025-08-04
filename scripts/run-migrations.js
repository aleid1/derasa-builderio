#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const migrations = [
  {
    name: '001_create_users_table',
    sql: `
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

      -- Enable RLS
      ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

      -- Create policies
      CREATE POLICY "Users can view own profile" ON public.users
        FOR SELECT USING (auth.uid() = id);
      
      CREATE POLICY "Users can update own profile" ON public.users
        FOR UPDATE USING (auth.uid() = id);

      -- Create trigger for updated_at
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON public.users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `
  },
  {
    name: '002_create_chat_sessions_table',
    sql: `
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

      -- Enable RLS
      ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

      -- Create policies
      CREATE POLICY "Users can view own sessions" ON public.chat_sessions
        FOR SELECT USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can create own sessions" ON public.chat_sessions
        FOR INSERT WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY "Users can update own sessions" ON public.chat_sessions
        FOR UPDATE USING (auth.uid() = user_id);

      -- Create trigger for updated_at
      CREATE TRIGGER update_chat_sessions_updated_at
        BEFORE UPDATE ON public.chat_sessions
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

      -- Create index for performance
      CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON public.chat_sessions(created_at DESC);
    `
  },
  {
    name: '003_create_chat_messages_table',
    sql: `
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

      -- Enable RLS
      ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

      -- Create policies
      CREATE POLICY "Users can view own messages" ON public.chat_messages
        FOR SELECT USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can create own messages" ON public.chat_messages
        FOR INSERT WITH CHECK (auth.uid() = user_id);

      -- Create indexes for performance
      CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
      CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
      CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
    `
  },
  {
    name: '004_create_user_progress_table',
    sql: `
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

      -- Enable RLS
      ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

      -- Create policies
      CREATE POLICY "Users can view own progress" ON public.user_progress
        FOR SELECT USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can update own progress" ON public.user_progress
        FOR ALL USING (auth.uid() = user_id);

      -- Create trigger for updated_at
      CREATE TRIGGER update_user_progress_updated_at
        BEFORE UPDATE ON public.user_progress
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_progress_subject ON public.user_progress(subject);
    `
  },
  {
    name: '005_create_parental_controls_table',
    sql: `
      CREATE TABLE IF NOT EXISTS public.parental_controls (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        child_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        parent_email TEXT NOT NULL,
        daily_limit_minutes INTEGER DEFAULT 60,
        allowed_subjects TEXT[] DEFAULT ARRAY['الرياضيات', 'العلوم', 'اللغة العربية', 'الإنجليزية'],
        content_level TEXT DEFAULT 'middle' CHECK (content_level IN ('elementary', 'middle', 'high')),
        monitoring_enabled BOOLEAN DEFAULT TRUE,
        homework_help_only BOOLEAN DEFAULT FALSE,
        notifications JSONB DEFAULT '{"dailyDigest": true, "inappropriateContent": true, "learningMilestones": true, "timeLimit": true, "newSubjects": false}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(child_user_id)
      );

      -- Enable RLS
      ALTER TABLE public.parental_controls ENABLE ROW LEVEL SECURITY;

      -- Create policies
      CREATE POLICY "Parents can view child controls" ON public.parental_controls
        FOR SELECT USING (
          parent_email = (SELECT email FROM auth.users WHERE id = auth.uid())
          OR auth.uid() = child_user_id
        );
      
      CREATE POLICY "Parents can manage child controls" ON public.parental_controls
        FOR ALL USING (
          parent_email = (SELECT email FROM auth.users WHERE id = auth.uid())
        );

      -- Create trigger for updated_at
      CREATE TRIGGER update_parental_controls_updated_at
        BEFORE UPDATE ON public.parental_controls
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `
  },
  {
    name: '006_create_content_moderation_logs_table',
    sql: `
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

      -- Enable RLS
      ALTER TABLE public.content_moderation_logs ENABLE ROW LEVEL SECURITY;

      -- Create policies (admin-only access)
      CREATE POLICY "Only admins can view moderation logs" ON public.content_moderation_logs
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND (preferences->>'role')::text = 'admin'
          )
        );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_moderation_logs_user_id ON public.content_moderation_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_moderation_logs_created_at ON public.content_moderation_logs(created_at DESC);
    `
  },
  {
    name: '007_create_user_stats_view',
    sql: `
      -- Create a view for user statistics
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

      -- Grant access to the view
      GRANT SELECT ON public.user_stats TO authenticated;
    `
  },
  {
    name: '008_create_helper_functions',
    sql: `
      -- Function to get user progress summary
      CREATE OR REPLACE FUNCTION public.get_user_progress(user_uuid UUID)
      RETURNS JSON AS $$
      DECLARE
        result JSON;
      BEGIN
        SELECT json_build_object(
          'totalSessions', COALESCE(total_sessions, 0),
          'totalMessages', COALESCE(total_messages, 0),
          'subjectsLearned', COALESCE(subjects_learned, ARRAY[]::text[]),
          'totalTimeMinutes', COALESCE(total_time_minutes, 0),
          'averageSessionLength', COALESCE(average_session_length, 0),
          'lastActivity', last_activity
        ) INTO result
        FROM public.user_stats
        WHERE user_id = user_uuid;
        
        RETURN COALESCE(result, '{}'::json);
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      -- Function for content moderation
      CREATE OR REPLACE FUNCTION public.moderate_content(content_text TEXT, user_uuid UUID)
      RETURNS JSON AS $$
      DECLARE
        result JSON;
      BEGIN
        -- Basic content checks (this would integrate with external moderation APIs)
        result := json_build_object(
          'approved', LENGTH(content_text) > 0 AND LENGTH(content_text) <= 4000,
          'confidence', 0.8,
          'flags', json_build_object(
            'inappropriate', FALSE,
            'spam', FALSE,
            'personal_info', content_text ~* '\\d{10,}|\\b\\d{4}\\s?\\d{4}\\s?\\d{4}\\s?\\d{4}\\b'
          )
        );
        
        RETURN result;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `
  }
];

async function runMigrations() {
  console.log('🚀 Starting database migrations...\n');

  for (const migration of migrations) {
    try {
      console.log(`⏳ Running migration: ${migration.name}`);
      
      const { error } = await supabase.rpc('run_sql', {
        sql: migration.sql
      });

      if (error) {
        // Try executing directly if RPC fails
        const { error: directError } = await supabase.rpc(migration.sql);
        if (directError) {
          throw directError;
        }
      }

      console.log(`✅ Migration completed: ${migration.name}\n`);
    } catch (error) {
      console.error(`❌ Migration failed: ${migration.name}`);
      console.error('Error:', error.message);
      console.log('📝 SQL:', migration.sql);
      console.log('\n⚠️  You may need to run this migration manually in your Supabase dashboard.\n');
    }
  }

  console.log('🎉 All migrations completed!');
  console.log('\n📋 Manual steps if needed:');
  console.log('1. Go to your Supabase dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Run any failed migrations manually');
  console.log('4. Verify tables are created correctly\n');
}

// Run migrations
runMigrations().catch(console.error);
