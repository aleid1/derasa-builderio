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

interface AuthProviderProps {
  children: React.ReactNode;
}

// Create default guest user immediately
const createGuestUser = (): User => ({
  id: "guest-" + Date.now(),
  name: "طالب ضيف",
  email: undefined,
  createdAt: new Date(),
  isGuest: true,
});

export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize with guest user immediately - no loading states
  const [user, setUser] = useState<User>(() => {
    try {
      const savedUser = localStorage.getItem("guestUser");
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (error) {
      console.error('Failed to parse saved user:', error);
    }
    
    const guestUser = createGuestUser();
    try {
      localStorage.setItem("guestUser", JSON.stringify(guestUser));
    } catch (error) {
      console.error('Failed to save guest user:', error);
    }
    return guestUser;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isMinor] = useState(false);
  const [hasParentalConsent] = useState(true);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Demo accounts for testing
      const demoAccounts = [
        { email: "test@test.com", password: "123456", name: "حساب تجريبي" },
        { email: "demo@demo.com", password: "demo123", name: "مستخدم تجريبي" },
        { email: "student@test.com", password: "student", name: "طالب تجريبي" },
      ];

      // Check demo accounts first
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
        localStorage.removeItem("guestUser");
        return;
      }

      // For any other email/password combination, create a user (for demo purposes)
      if (email && password && email.includes('@') && password.length >= 6) {
        const authenticatedUser: User = {
          id: "user-" + Date.now(),
          email,
          name: email.split("@")[0],
          createdAt: new Date(),
          isGuest: false,
        };

        setUser(authenticatedUser);
        localStorage.removeItem("guestUser");
        return;
      }

      // If validation fails, throw error
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, birthDate?: string, parentEmail?: string) => {
    setIsLoading(true);
    try {
      // Mock registration for now
      const newUser: User = {
        id: "user-" + Date.now(),
        email,
        name,
        createdAt: new Date(),
        isGuest: false,
      };

      setUser(newUser);
      localStorage.removeItem("guestUser");
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Mock Google authentication
      const googleUser: User = {
        id: "google-" + Date.now(),
        email: "user@gmail.com",
        name: "مستخدم Google",
        createdAt: new Date(),
        isGuest: false,
      };

      setUser(googleUser);
      localStorage.removeItem("guestUser");
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
    } catch (error) {
      console.error('Sign out localStorage error:', error);
    }
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
