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

// Check environment variables immediately
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Environment Check on Load:');
console.log('- URL:', envUrl || 'Not set');
console.log('- Key:', envKey ? 'Set' : 'Not set');
console.log('- Supabase client:', !!supabase);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(createGuestUser);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Demo accounts
      const demoAccounts = [
        { email: "test@test.com", password: "123456", name: "حساب تجريبي" },
        { email: "demo@demo.com", password: "demo123", name: "مستخدم تجريبي" },
        { email: "student@test.com", password: "student", name: "طالب تجريبي" },
      ];

      const demoAccount = demoAccounts.find(
        account => account.email.toLowerCase() === email.toLowerCase() && account.password === password
      );

      if (demoAccount) {
        const authenticatedUser: User = {
          id: "demo-" + Date.now(),
          email: demoAccount.email,
          name: demoAccount.name,
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
      // Direct environment check
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      console.log('🚀 Google OAuth Attempt:');
      console.log('- URL present:', !!url);
      console.log('- Key present:', !!key);
      console.log('- URL value:', url);
      console.log('- Supabase client:', !!supabase);

      if (url && key && supabase) {
        console.log('✅ Calling Supabase OAuth...');
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          }
        });

        console.log('📊 OAuth result:', { data, error });

        if (error) {
          throw error;
        }

        console.log('🎯 OAuth initiated successfully');
        return;
      } else {
        console.log('❌ Missing configuration - using demo');
        throw new Error('Configuration missing');
      }
      
    } catch (error) {
      console.error('❌ OAuth failed:', error);
      
      // Demo user
      const demoUser: User = {
        id: "google-demo-" + Date.now(),
        email: "user@gmail.com",
        name: "مستخدم Google تجريبي",
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

  const requestParentalConsent = async () => {};

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
