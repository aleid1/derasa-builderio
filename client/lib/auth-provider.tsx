// @refresh reset
import React, { createContext, useContext, useState } from "react";
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { User } from "./chat-types";

// Environment check
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = !!(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL.includes('.supabase.co') &&
  SUPABASE_ANON_KEY.length > 20
);

console.log('🔧 Auth Provider Configuration:');
console.log('- Supabase configured:', isSupabaseConfigured);

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, birthDate?: string, parentEmail?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isMinor: boolean;
  hasParentalConsent: boolean;
  requestParentalConsent: (parentEmail: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const createGuestUser = (): User => ({
  id: "guest-" + Date.now(),
  name: "طالب ضيف",
  email: undefined,
  createdAt: new Date(),
  isGuest: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(createGuestUser);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Demo accounts
      const demoAccounts = [
        { email: "test@test.com", password: "123456", name: "ح��اب تجريبي" },
        { email: "demo@demo.com", password: "demo123", name: "مستخدم تجريبي" },
        { email: "student@test.com", password: "student", name: "طالب تجريبي" },
        { email: "admin@admin.com", password: "admin123", name: "مدير النظام" },
      ];

      const demoAccount = demoAccounts.find(
        account => account.email.toLowerCase() === email.toLowerCase() && account.password === password
      );

      if (demoAccount || (email.includes('@') && password.length >= 6)) {
        const authenticatedUser: User = {
          id: "demo-" + Date.now(),
          email: demoAccount?.email || email,
          name: demoAccount?.name || email.split("@")[0],
          createdAt: new Date(),
          isGuest: false,
        };
        setUser(authenticatedUser);
        return;
      }

      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const newUser: User = {
        id: "user-" + Date.now(),
        email,
        name,
        createdAt: new Date(),
        isGuest: false,
      };
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      console.log('🚀 Google OAuth attempt...');
      
      if (isSupabaseConfigured && supabase) {
        console.log('✅ Supabase configured, attempting OAuth...');
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          }
        });

        if (error) {
          console.error('❌ OAuth error:', error);
          throw error;
        }

        console.log('🔄 Redirecting to Google...');
        return;
      } else {
        console.log('❌ Supabase not configured');
        throw new Error('Supabase not configured');
      }
    } catch (error) {
      console.error('❌ Google OAuth failed:', error);
      
      // Fallback demo user
      const demoUser: User = {
        id: "google-demo-" + Date.now(),
        email: "user@gmail.com",
        name: "مستخدم تجريبي Google",
        avatar: "https://via.placeholder.com/40?text=G",
        createdAt: new Date(),
        isGuest: false,
      };
      setUser(demoUser);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setUser(createGuestUser());
  };

  const requestParentalConsent = async (parentEmail: string) => {
    console.log('Parental consent requested for:', parentEmail);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAuthenticated: user !== null && !user.isGuest,
    isMinor: false,
    hasParentalConsent: true,
    requestParentalConsent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
