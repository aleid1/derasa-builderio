import React, { createContext, useContext, useState } from "react";
import { supabase } from './supabase'
import { User } from "./chat-types";

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
  const [user] = useState<User>(createGuestUser);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    // Demo implementation for now
    console.log('Sign in attempted:', email);
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Demo implementation for now
    console.log('Sign up attempted:', email);
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 Environment Check:');
      console.log('- VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL || 'Not set');
      console.log('- VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set');
      console.log('- supabase client:', !!supabase);
      
      if (supabase && import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.log('🚀 Attempting Supabase OAuth...');
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        });

        console.log('📊 OAuth response:', { data, error });

        if (error) {
          console.error('❌ OAuth error:', error);
          throw error;
        }

        console.log('✅ OAuth initiated successfully');
        return;
      } else {
        console.log('❌ Supabase not properly configured');
        throw new Error('Supabase configuration missing');
      }
    } catch (error) {
      console.error('❌ Google OAuth failed:', error);
      alert('تم تسجيل الدخول كحساب تجريبي (Google OAuth غير مكتمل)');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    console.log('Sign out');
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
    isAuthenticated: false,
    isMinor: false,
    hasParentalConsent: true,
    requestParentalConsent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
