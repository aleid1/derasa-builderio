import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "./chat-types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: (
    email: string,
    name: string,
    avatar?: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
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

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('AuthProvider rendering, user:', user);

  useEffect(() => {
    // Check for existing session on app load
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      // Check if user exists in localStorage
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } else {
        // Create persistent guest user
        const guestUser: User = {
          id: "guest-" + Date.now(),
          name: "طالب ضيف",
          email: undefined,
          createdAt: new Date(),
        };

        setUser(guestUser);
        localStorage.setItem("user", JSON.stringify(guestUser));
      }
    } catch (error) {
      console.error("Session check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock authentication - replace with Supabase auth
      const authenticatedUser: User = {
        id: "user-" + Date.now(),
        email,
        name: email.split("@")[0],
        createdAt: new Date(),
      };

      setUser(authenticatedUser);
      localStorage.setItem("user", JSON.stringify(authenticatedUser));
    } catch (error) {
      console.error("Sign in failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Mock registration - replace with Supabase auth
      const newUser: User = {
        id: "user-" + Date.now(),
        email,
        name,
        createdAt: new Date(),
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (error) {
      console.error("Sign up failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (
    email: string,
    name: string,
    avatar?: string,
  ) => {
    setIsLoading(true);
    try {
      // Create user with Google credentials
      const googleUser: User = {
        id: "google-" + Date.now(),
        email,
        name,
        avatar,
        createdAt: new Date(),
      };

      setUser(googleUser);
      localStorage.setItem("user", JSON.stringify(googleUser));
    } catch (error) {
      console.error("Google sign in failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem("user");

      // Create new guest session
      await checkExistingSession();
    } catch (error) {
      console.error("Sign out failed:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAuthenticated: user !== null && user.email !== undefined,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
