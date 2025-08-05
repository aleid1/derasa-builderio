import React, { createContext, useContext } from "react";
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

const mockUser: User = {
  id: "guest-123",
  name: "طالب ضيف",
  email: undefined,
  createdAt: new Date(),
  isGuest: true,
};

const mockAuthValue: AuthContextType = {
  user: mockUser,
  isLoading: false,
  signIn: async () => { console.log('Mock sign in'); },
  signUp: async () => { console.log('Mock sign up'); },
  signInWithGoogle: async () => { 
    console.log('Mock Google OAuth');
    alert('تم استخدام نسخة تجريبية من تسجيل الدخول');
  },
  signOut: async () => { console.log('Mock sign out'); },
  isAuthenticated: false,
  isMinor: false,
  hasParentalConsent: true,
  requestParentalConsent: async () => { console.log('Mock parental consent'); },
};

const AuthContext = createContext<AuthContextType>(mockAuthValue);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={mockAuthValue}>
      {children}
    </AuthContext.Provider>
  );
}
