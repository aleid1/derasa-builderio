import React, { createContext, useContext, useState } from "react";
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { hasSupabase } from './env'
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
  // Initialize with guest user immediately - no async operations
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem("guestUser");
      return saved ? JSON.parse(saved) : createGuestUser();
    } catch {
      return createGuestUser();
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isMinor] = useState(false);
  const [hasParentalConsent] = useState(true);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Demo accounts only - no Supabase operations for now
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
        try {
          localStorage.removeItem("guestUser");
        } catch {}
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
      try {
        localStorage.removeItem("guestUser");
      } catch {}
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 Google OAuth Debug Info:');
      console.log('- hasSupabase:', hasSupabase);
      console.log('- supabase client:', !!supabase);
      
      if (hasSupabase && supabase) {
        console.log('🚀 Attempting Supabase OAuth...');
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

        console.log('📊 OAuth Response:', { data, error });

        if (!error) {
          console.log('✅ OAuth initiated successfully, redirecting...');
          return;
        }
        
        console.error('❌ Supabase OAuth error:', error);
      } else {
        console.log('❌ Supabase not available - hasSupabase:', hasSupabase, 'supabase:', !!supabase);
      }

      // Demo Google authentication
      console.log('⚠�� Using demo Google authentication');
      const demoGoogleUser: User = {
        id: "google-demo-" + Date.now(),
        email: "user@gmail.com",
        name: "مستخدم تجريبي",
        avatar: "https://via.placeholder.com/40?text=G",
        createdAt: new Date(),
        isGuest: false,
      };

      setUser(demoGoogleUser);
      try {
        localStorage.removeItem("guestUser");
      } catch {}
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ تم تسجيل الدخول بنجاح باستخدام الحساب التجريبي');
    } catch (error) {
      console.error('Google sign in failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    const guestUser = createGuestUser();
    setUser(guestUser);
    try {
      localStorage.removeItem("guestUser");
      localStorage.setItem("guestUser", JSON.stringify(guestUser));
    } catch {}
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
    isMinor,
    hasParentalConsent,
    requestParentalConsent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
