import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration missing. Using fallback localStorage authentication.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url?: string
          birth_date?: string
          parent_email?: string
          consent_given: boolean
          subscription_tier: 'free' | 'premium' | 'family'
          created_at: string
          updated_at: string
          last_seen_at?: string
          preferences: Json
          privacy_settings: Json
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string
          birth_date?: string
          parent_email?: string
          consent_given?: boolean
          subscription_tier?: 'free' | 'premium' | 'family'
          created_at?: string
          updated_at?: string
          last_seen_at?: string
          preferences?: Json
          privacy_settings?: Json
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string
          birth_date?: string
          parent_email?: string
          consent_given?: boolean
          subscription_tier?: 'free' | 'premium' | 'family'
          created_at?: string
          updated_at?: string
          last_seen_at?: string
          preferences?: Json
          privacy_settings?: Json
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          title: string
          subject?: string
          grade_level?: string
          session_type: 'homework' | 'explanation' | 'practice' | 'general'
          created_at: string
          updated_at: string
          is_active: boolean
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          subject?: string
          grade_level?: string
          session_type?: 'homework' | 'explanation' | 'practice' | 'general'
          created_at?: string
          updated_at?: string
          is_active?: boolean
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          subject?: string
          grade_level?: string
          session_type?: 'homework' | 'explanation' | 'practice' | 'general'
          created_at?: string
          updated_at?: string
          is_active?: boolean
          metadata?: Json
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          image_url?: string
          image_data?: string
          moderated: boolean
          moderation_flags?: Json
          tokens_used?: number
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          image_url?: string
          image_data?: string
          moderated?: boolean
          moderation_flags?: Json
          tokens_used?: number
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          role?: 'user' | 'assistant'
          content?: string
          image_url?: string
          image_data?: string
          moderated?: boolean
          moderation_flags?: Json
          tokens_used?: number
          created_at?: string
          metadata?: Json
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          subject: string
          topic: string
          skill_level: number
          mastery_score: number
          time_spent_minutes: number
          last_practiced_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject: string
          topic: string
          skill_level?: number
          mastery_score?: number
          time_spent_minutes?: number
          last_practiced_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          topic?: string
          skill_level?: number
          mastery_score?: number
          time_spent_minutes?: number
          last_practiced_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      content_moderation_logs: {
        Row: {
          id: string
          user_id: string
          session_id: string
          message_id: string
          content: string
          moderation_result: Json
          action_taken: 'approved' | 'flagged' | 'blocked'
          reviewer_id?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id: string
          message_id: string
          content: string
          moderation_result: Json
          action_taken: 'approved' | 'flagged' | 'blocked'
          reviewer_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          message_id?: string
          content?: string
          moderation_result?: Json
          action_taken?: 'approved' | 'flagged' | 'blocked'
          reviewer_id?: string
          created_at?: string
        }
      }
      parental_controls: {
        Row: {
          id: string
          child_user_id: string
          parent_email: string
          daily_limit_minutes: number
          allowed_subjects: string[]
          content_level: 'elementary' | 'middle' | 'high'
          monitoring_enabled: boolean
          homework_help_only: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          child_user_id: string
          parent_email: string
          daily_limit_minutes?: number
          allowed_subjects?: string[]
          content_level?: 'elementary' | 'middle' | 'high'
          monitoring_enabled?: boolean
          homework_help_only?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          child_user_id?: string
          parent_email?: string
          daily_limit_minutes?: number
          allowed_subjects?: string[]
          content_level?: 'elementary' | 'middle' | 'high'
          monitoring_enabled?: boolean
          homework_help_only?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      user_stats: {
        Row: {
          user_id: string
          total_sessions: number
          total_messages: number
          subjects_learned: string[]
          total_time_minutes: number
          average_session_length: number
          last_activity: string
        }
      }
    }
    Functions: {
      get_user_progress: {
        Args: { user_id: string }
        Returns: Json
      }
      moderate_content: {
        Args: { content: string; user_id: string }
        Returns: Json
      }
    }
    Enums: {
      subscription_tier: 'free' | 'premium' | 'family'
      session_type: 'homework' | 'explanation' | 'practice' | 'general'
      content_level: 'elementary' | 'middle' | 'high'
      moderation_action: 'approved' | 'flagged' | 'blocked'
    }
  }
}

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]
