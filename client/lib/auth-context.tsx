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
  const [user, setUser] = useState<User>(createGuestUser);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data.user) {
          const authenticatedUser: User = {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.full_name || data.user.email!.split('@')[0],
            avatar: data.user.user_metadata?.avatar_url,
            createdAt: new Date(data.user.created_at),
            isGuest: false,
          };
          setUser(authenticatedUser);
          return;
        }
      }

      // Demo fallback
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
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, name: name }
          }
        });

        if (!error && data.user) {
          const newUser: User = {
            id: data.user.id,
            email: data.user.email!,
            name: name,
            createdAt: new Date(),
            isGuest: false,
          };
          setUser(newUser);
          return;
        }
      }

      // Demo fallback
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
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

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

      if (error) {
        throw error;
      }

      // OAuth initiated successfully - redirect will happen
      return;
      
    } catch (error) {
      console.error('Google OAuth failed:', error);
      
      // Fallback to demo user
      const demoGoogleUser: User = {
        id: "google-demo-" + Date.now(),
        email: "user@gmail.com",
        name: "مستخدم تجريبي Google",
        avatar: "https://via.placeholder.com/40?text=G",
        createdAt: new Date(),
        isGuest: false,
      };
      setUser(demoGoogleUser);
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
    
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
