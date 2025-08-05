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

const defaultUser: User = {
  id: "guest-123",
  name: "طالب ضيف",
  email: undefined,
  createdAt: new Date(),
  isGuest: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User>(defaultUser);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    alert("تم تسجيل الدخول كحساب تجريبي");
  };

  const signUp = async (email: string, password: string, name: string) => {
    alert("تم إنشاء حساب تجريبي");
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    
    try {
      // Test environment variables
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      console.log('Environment test:');
      console.log('URL:', url || 'NOT SET');
      console.log('Key:', key ? 'SET' : 'NOT SET');
      
      if (url && key) {
        // Import supabase dynamically to avoid module loading issues
        const { supabase } = await import('./supabase');
        
        if (supabase) {
          console.log('Attempting Google OAuth...');
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            }
          });
          
          if (error) {
            throw error;
          }
          
          console.log('OAuth initiated successfully');
          alert("تم تحويلك لتسجيل الدخول عبر Google");
          return;
        }
      }
      
      alert("البيئة غير مكونة - استخدام حساب تجريبي");
    } catch (error) {
      console.error('OAuth failed:', error);
      alert("حدث خطأ - تم استخدام حساب تجريبي");
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    alert("تم تسجيل الخروج");
  };

  const requestParentalConsent = async () => {};

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
