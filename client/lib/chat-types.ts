export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
}

export interface StreamingResponse {
  content: string;
  isComplete: boolean;
  messageId: string;
}

export interface AIResponse {
  message: string;
  suggestions?: string[];
  isComplete: boolean;
}
