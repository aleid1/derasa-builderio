import { ChatMessage } from "./chat-types";

const CHAT_HISTORY_KEY = 'derasa_chat_history';
const MAX_HISTORY_MESSAGES = 1000; // Limit to prevent localStorage overflow

export interface ChatSession {
  id: string;
  title: string;
  subject?: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

export class ChatHistoryService {
  // Save a message to localStorage
  static saveMessage(message: ChatMessage, sessionId: string): void {
    try {
      const history = this.getHistory();
      
      if (!history[sessionId]) {
        history[sessionId] = [];
      }
      
      history[sessionId].push(message);
      
      // Keep only the latest messages to prevent storage overflow
      if (history[sessionId].length > MAX_HISTORY_MESSAGES) {
        history[sessionId] = history[sessionId].slice(-MAX_HISTORY_MESSAGES);
      }
      
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save message to localStorage:', error);
    }
  }

  // Get all chat history
  static getHistory(): Record<string, ChatMessage[]> {
    try {
      const stored = localStorage.getItem(CHAT_HISTORY_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to load chat history from localStorage:', error);
      return {};
    }
  }

  // Get messages for a specific session
  static getSessionMessages(sessionId: string): ChatMessage[] {
    const history = this.getHistory();
    return history[sessionId] || [];
  }

  // Get all sessions with metadata
  static getSessions(): ChatSession[] {
    const history = this.getHistory();
    
    return Object.entries(history).map(([sessionId, messages]) => {
      const firstMessage = messages[0];
      const lastMessage = messages[messages.length - 1];
      
      // Determine subject from message content
      const subject = this.inferSubject(messages);
      
      return {
        id: sessionId,
        title: firstMessage?.content?.slice(0, 50) + '...' || 'محادثة جديدة',
        subject,
        createdAt: new Date(firstMessage?.timestamp || Date.now()),
        updatedAt: new Date(lastMessage?.timestamp || Date.now()),
        messageCount: messages.length
      };
    }).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  // Infer subject from message content (basic implementation)
  private static inferSubject(messages: ChatMessage[]): string {
    const content = messages.map(m => m.content).join(' ').toLowerCase();
    
    if (content.includes('رياضيات') || content.includes('حساب') || content.includes('جبر') || content.includes('هندسة')) {
      return 'رياضيات';
    } else if (content.includes('فيزياء') || content.includes('كيمياء') || content.includes('أحياء') || content.includes('علوم')) {
      return 'علوم';
    } else if (content.includes('عربية') || content.includes('أدب') || content.includes('شعر') || content.includes('نحو')) {
      return 'لغة عربية';
    } else if (content.includes('تاريخ') || content.includes('جغرافيا')) {
      return 'اجتماعيات';
    } else if (content.includes('إنجليزي') || content.includes('english')) {
      return 'لغة إنجليزية';
    } else if (content.includes('إسلامية') || content.includes('فقه') || content.includes('تفسير')) {
      return 'دراسات إسلامية';
    }
    
    return 'عام';
  }

  // Delete a session
  static deleteSession(sessionId: string): void {
    try {
      const history = this.getHistory();
      delete history[sessionId];
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  }

  // Clear all history
  static clearAllHistory(): void {
    try {
      localStorage.removeItem(CHAT_HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  }

  // Get user statistics
  static getUserStats() {
    const sessions = this.getSessions();
    const totalMessages = sessions.reduce((sum, session) => sum + session.messageCount, 0);
    const subjects = [...new Set(sessions.map(s => s.subject))];
    const sessionsToday = sessions.filter(s => {
      const today = new Date();
      return s.updatedAt.toDateString() === today.toDateString();
    }).length;

    return {
      totalSessions: sessions.length,
      totalMessages,
      subjectsLearned: subjects.length,
      sessionsToday,
      subjects
    };
  }
}
