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
  const [user] = useState<User>(guestUser);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    alert("تم تسجيل الدخول كحساب تجريبي");
  };

  const signUp = async (email: string, password: string, name: string) => {
    alert("تم إنشاء حساب تجريبي");
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    
    // Check if environment variables are set
    const hasUrl = !!import.meta.env.VITE_SUPABASE_URL;
    const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (hasUrl && hasKey) {
      alert("Google OAuth configured - redirecting would happen here");
    } else {
      alert("تم استخدام حساب Google تجريبي");
    }
    
    setIsLoading(false);
  };

  const signOut = async () => {
    alert("تم تسجيل الخروج");
  };

  const requestParentalConsent = async () => {
    // Empty implementation
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
