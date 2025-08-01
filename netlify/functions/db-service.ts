import { neon } from "@netlify/neon";

const sql = neon();

export interface User {
  id: string;
  email?: string;
  name: string;
  avatar_url?: string;
  auth_provider?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  subject_area?: string;
  grade_level?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  content: string;
  role: "user" | "assistant";
  message_type: string;
  metadata?: any;
  created_at: Date;
}

export class DatabaseService {
  // User management
  async createUser(email: string, name: string): Promise<User> {
    const result = await sql`
      INSERT INTO users (email, name) 
      VALUES (${email}, ${name})
      RETURNING *
    `;
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result[0] || null;
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await sql`
      SELECT * FROM users WHERE id = ${id}
    `;
    return result[0] || null;
  }

  async createGuestUser(): Promise<User> {
    const guestName = `ضيف ${Date.now()}`;
    const result = await sql`
      INSERT INTO users (name, auth_provider) 
      VALUES (${guestName}, 'guest')
      RETURNING *
    `;
    return result[0];
  }

  // Chat session management
  async createChatSession(
    userId: string,
    title?: string,
  ): Promise<ChatSession> {
    const sessionTitle = title || "محادثة جديدة";
    const result = await sql`
      INSERT INTO chat_sessions (user_id, title) 
      VALUES (${userId}, ${sessionTitle})
      RETURNING *
    `;
    return result[0];
  }

  async getChatSession(sessionId: string): Promise<ChatSession | null> {
    const result = await sql`
      SELECT * FROM chat_sessions WHERE id = ${sessionId}
    `;
    return result[0] || null;
  }

  async getUserChatSessions(
    userId: string,
    limit = 20,
  ): Promise<ChatSession[]> {
    const result = await sql`
      SELECT * FROM chat_sessions 
      WHERE user_id = ${userId} AND is_active = true
      ORDER BY updated_at DESC 
      LIMIT ${limit}
    `;
    return result;
  }

  async updateChatSession(
    sessionId: string,
    updates: Partial<ChatSession>,
  ): Promise<ChatSession> {
    const setClause = Object.keys(updates)
      .map((key) => `${key} = $${Object.keys(updates).indexOf(key) + 2}`)
      .join(", ");

    const values = [sessionId, ...Object.values(updates)];

    const result = await sql`
      UPDATE chat_sessions 
      SET ${sql.unsafe(setClause)}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `.apply(null, values);

    return result[0];
  }

  // Chat message management
  async addChatMessage(
    sessionId: string,
    content: string,
    role: "user" | "assistant",
    metadata?: any,
  ): Promise<ChatMessage> {
    const result = await sql`
      INSERT INTO chat_messages (session_id, content, role, metadata) 
      VALUES (${sessionId}, ${content}, ${role}, ${metadata ? JSON.stringify(metadata) : null})
      RETURNING *
    `;

    // Update session's updated_at timestamp
    await sql`
      UPDATE chat_sessions 
      SET updated_at = NOW() 
      WHERE id = ${sessionId}
    `;

    return result[0];
  }

  async getChatMessages(sessionId: string, limit = 50): Promise<ChatMessage[]> {
    const result = await sql`
      SELECT * FROM chat_messages 
      WHERE session_id = ${sessionId}
      ORDER BY created_at ASC 
      LIMIT ${limit}
    `;
    return result;
  }

  async getRecentChatHistory(
    userId: string,
    limit = 10,
  ): Promise<ChatMessage[]> {
    const result = await sql`
      SELECT cm.* FROM chat_messages cm
      JOIN chat_sessions cs ON cm.session_id = cs.id
      WHERE cs.user_id = ${userId}
      ORDER BY cm.created_at DESC
      LIMIT ${limit}
    `;
    return result;
  }

  // Analytics and progress
  async updateUserProgress(
    userId: string,
    subjectArea: string,
    topic: string,
    skillLevel?: number,
  ): Promise<void> {
    await sql`
      INSERT INTO user_progress (user_id, subject_area, topic, skill_level, sessions_count, last_session_at)
      VALUES (${userId}, ${subjectArea}, ${topic}, ${skillLevel || 1}, 1, NOW())
      ON CONFLICT (user_id, subject_area, topic) 
      DO UPDATE SET 
        sessions_count = user_progress.sessions_count + 1,
        last_session_at = NOW(),
        skill_level = COALESCE(${skillLevel}, user_progress.skill_level),
        updated_at = NOW()
    `;
  }

  async getUserProgress(userId: string): Promise<any[]> {
    const result = await sql`
      SELECT * FROM user_progress 
      WHERE user_id = ${userId}
      ORDER BY last_session_at DESC
    `;
    return result;
  }

  // Utility methods
  async getSessionStats(
    sessionId: string,
  ): Promise<{ messageCount: number; duration: number }> {
    const result = await sql`
      SELECT 
        COUNT(*) as message_count,
        EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at)))::integer as duration_seconds
      FROM chat_messages 
      WHERE session_id = ${sessionId}
    `;

    return {
      messageCount: parseInt(result[0].message_count) || 0,
      duration: parseInt(result[0].duration_seconds) || 0,
    };
  }
}

export const dbService = new DatabaseService();
