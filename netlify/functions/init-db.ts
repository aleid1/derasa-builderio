import { Handler } from '@netlify/functions';
import { neon } from '@netlify/neon';

const sql = neon();

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    console.log('🔧 Setting up دراسة database schema...');

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE,
        name TEXT NOT NULL,
        avatar_url TEXT,
        auth_provider TEXT DEFAULT 'email',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    console.log('✅ Users table created');

    // Create chat_sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL DEFAULT 'محادثة جديدة',
        subject_area TEXT,
        grade_level TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    console.log('✅ Chat sessions table created');

    // Create chat_messages table
    await sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
        message_type TEXT DEFAULT 'text',
        metadata JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    console.log('✅ Chat messages table created');

    // Create user_progress table
    await sql`
      CREATE TABLE IF NOT EXISTS user_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        subject_area TEXT NOT NULL,
        topic TEXT NOT NULL,
        skill_level INTEGER DEFAULT 1 CHECK (skill_level BETWEEN 1 AND 10),
        sessions_count INTEGER DEFAULT 0,
        last_session_at TIMESTAMPTZ,
        strengths TEXT[],
        improvement_areas TEXT[],
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, subject_area, topic)
      )
    `;
    console.log('✅ User progress table created');

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at)`;
    console.log('✅ Database indexes created');

    console.log('🎉 Database setup completed successfully!');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Database initialized successfully',
        tables: ['users', 'chat_sessions', 'chat_messages', 'user_progress']
      }),
    };

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Database initialization failed',
        details: error.message
      }),
    };
  }
};
