import { neon } from '@netlify/neon';

const sql = neon();

async function setupDatabase() {
  console.log('🔧 Setting up دراسة database schema...');

  try {
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
        subject_area TEXT, -- مثل 'رياضيات', 'علوم', 'لغة عربية'
        grade_level TEXT, -- مثل 'ابتدائي', 'متوسط', 'ثانوي'
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
        message_type TEXT DEFAULT 'text', -- 'text', 'image', 'audio'
        metadata JSONB, -- للمعلومات الإضافية مثل التصنيف أو الاقتراحات
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    console.log('✅ Chat messages table created');

    // Create user_progress table for learning analytics
    await sql`
      CREATE TABLE IF NOT EXISTS user_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        subject_area TEXT NOT NULL,
        topic TEXT NOT NULL,
        skill_level INTEGER DEFAULT 1 CHECK (skill_level BETWEEN 1 AND 10),
        sessions_count INTEGER DEFAULT 0,
        last_session_at TIMESTAMPTZ,
        strengths TEXT[], -- نقاط القوة
        improvement_areas TEXT[], -- المجالات التي تحتاج تحسين
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, subject_area, topic)
      )
    `;
    console.log('✅ User progress table created');

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at)`;
    console.log('✅ Database indexes created');

    // Insert some sample data for testing
    const sampleUser = await sql`
      INSERT INTO users (name, email) 
      VALUES ('طالب تجريبي', 'student@derasa.com')
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `;

    if (sampleUser.length > 0) {
      const userId = sampleUser[0].id;
      
      const sampleSession = await sql`
        INSERT INTO chat_sessions (user_id, title, subject_area, grade_level)
        VALUES (${userId}, 'مساعدة في الرياضيات', 'رياضيات', 'متوسط')
        RETURNING id
      `;

      if (sampleSession.length > 0) {
        const sessionId = sampleSession[0].id;
        
        await sql`
          INSERT INTO chat_messages (session_id, content, role)
          VALUES 
            (${sessionId}, 'مرحباً! أحتاج مساعدة في حل معادلة رياضية', 'user'),
            (${sessionId}, 'مرحباً بك! سأساعدك خطوة بخطوة. ما هي المعادلة التي تريد حلها؟', 'assistant')
        `;
      }

      await sql`
        INSERT INTO user_progress (user_id, subject_area, topic, skill_level, sessions_count)
        VALUES (${userId}, 'رياضيات', 'الجبر', 3, 1)
        ON CONFLICT (user_id, subject_area, topic) DO NOTHING
      `;
      
      console.log('✅ Sample data inserted');
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('📊 Tables created:');
    console.log('   - users (المستخدمين)');
    console.log('   - chat_sessions (جلسات المحادثة)');
    console.log('   - chat_messages (رسائل المحادثة)');
    console.log('   - user_progress (تقدم المستخدم)');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
