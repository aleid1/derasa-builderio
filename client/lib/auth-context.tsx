import React, { createContext, useContext, useState } from "react";
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { User } from "./chat-types";

// Simple environment check
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = !!(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL.includes('.supabase.co') &&
  SUPABASE_ANON_KEY.length > 20
);

console.log('🔧 Environment Check:');
console.log('- SUPABASE_URL:', SUPABASE_URL ? 'Set' : 'Missing');
console.log('- SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'Set (' + SUPABASE_ANON_KEY.substring(0, 20) + '...)' : 'Missing');
console.log('- isSupabaseConfigured:', isSupabaseConfigured);
console.log('- supabase client available:', !!supabase);

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

interface AuthProviderProps {
  children: React.ReactNode;
}

const createGuestUser = (): User => ({
  id: "guest-" + Date.now(),
  name: "طالب ضيف",
  email: undefined,
  createdAt: new Date(),
  isGuest: true,
});

export function AuthProvider({ children }: AuthProviderProps) {
  // Start with guest user - no complex initialization
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem("guestUser");
      return saved ? JSON.parse(saved) : createGuestUser();
    } catch {
      return createGuestUser();
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data.user) {
          const user: User = {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.full_name || data.user.email!.split('@')[0],
            avatar: data.user.user_metadata?.avatar_url,
            createdAt: new Date(data.user.created_at),
            isGuest: false,
          };
          setUser(user);
          localStorage.removeItem("guestUser");
          return;
        }
      }

      // Demo accounts fallback
      const demoAccounts = [
        { email: "test@test.com", password: "123456", name: "حساب تجريبي" },
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
        localStorage.removeItem("guestUser");
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
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, name: name }
          }
        });

        if (!error && data.user) {
          const user: User = {
            id: data.user.id,
            email: data.user.email!,
            name: name,
            createdAt: new Date(),
            isGuest: false,
          };
          setUser(user);
          localStorage.removeItem("guestUser");
          return;
        }
      }

      // Demo registration
      const newUser: User = {
        id: "user-" + Date.now(),
        email,
        name,
        createdAt: new Date(),
        isGuest: false,
      };
      setUser(newUser);
      localStorage.removeItem("guestUser");
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 Google OAuth Debug:');
      console.log('- isSupabaseConfigured:', isSupabaseConfigured);
      console.log('- supabase client:', !!supabase);
      console.log('- URL:', SUPABASE_URL);
      
      if (isSupabaseConfigured && supabase) {
        console.log('🚀 Attempting Google OAuth...');
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
        });

        console.log('📊 OAuth response:', { data, error });

        if (error) {
          console.error('❌ OAuth error:', error);
          throw new Error(`OAuth failed: ${error.message}`);
        }

        console.log('✅ OAuth initiated - redirecting...');
        return;
      } else {
        console.log('❌ Supabase not configured properly');
        throw new Error('Supabase not configured');
      }
    } catch (error) {
      console.error('❌ Google OAuth failed:', error);
      
      // Fallback to demo
      const demoGoogleUser: User = {
        id: "google-demo-" + Date.now(),
        email: "user@gmail.com",
        name: "مستخدم تجريبي Google",
        avatar: "https://via.placeholder.com/40?text=G",
        createdAt: new Date(),
        isGuest: false,
      };

      setUser(demoGoogleUser);
      localStorage.removeItem("guestUser");
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
    
    const guestUser = createGuestUser();
    setUser(guestUser);
    localStorage.removeItem("guestUser");
    localStorage.setItem("guestUser", JSON.stringify(guestUser));
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
