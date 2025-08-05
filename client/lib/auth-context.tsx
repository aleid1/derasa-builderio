import React, { createContext, useContext, useState } from "react";
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

const guestUser: User = {
  id: "guest-123",
  name: "طالب ضيف",
  email: undefined,
  createdAt: new Date(),
  isGuest: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(guestUser);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    const demoAccounts = [
      { email: "test@test.com", password: "123456", name: "حساب تجريبي" },
      { email: "demo@demo.com", password: "demo123", name: "مستخدم تجريبي" },
      { email: "student@test.com", password: "student", name: "طالب تجريبي" },
    ];

    const account = demoAccounts.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );

    if (account) {
      setUser({
        id: "demo-" + Date.now(),
        email: account.email,
        name: account.name,
        createdAt: new Date(),
        isGuest: false,
      });
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setUser({
      id: "user-" + Date.now(),
      email,
      name,
      createdAt: new Date(),
      isGuest: false,
    });
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    
    // Direct redirect to Supabase OAuth
    const redirectUrl = `https://uevtchccvbnazkmwlswu.supabase.co/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(window.location.origin + '/auth/callback')}`;
    
    try {
      // Test if we can reach Supabase
      const response = await fetch('https://uevtchccvbnazkmwlswu.supabase.co/rest/v1/', {
        method: 'HEAD',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVldnRjaGNjdmJuYXprbXdsc3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNDkzNDQsImV4cCI6MjA2OTYyNTM0NH0.4e_oE-URVauH5LsLKcFxgJuQ8i5mJoNz3kf9naqlb8g'
        }
      });

      if (response.ok) {
        console.log('✅ Supabase accessible, redirecting to Google OAuth...');
        window.location.href = redirectUrl;
        return;
      }
    } catch (error) {
      console.log('❌ Supabase connection failed:', error);
    }

    // Fallback
    setUser({
      id: "google-demo-" + Date.now(),
      email: "user@gmail.com", 
      name: "مستخدم Google تجريبي",
      avatar: "https://via.placeholder.com/40?text=G",
      createdAt: new Date(),
      isGuest: false,
    });
    setIsLoading(false);
  };

  const signOut = async () => {
    setUser(guestUser);
  };

  const requestParentalConsent = async () => {};

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAuthenticated: !user.isGuest,
    isMinor: false,
    hasParentalConsent: true,
    requestParentalConsent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
