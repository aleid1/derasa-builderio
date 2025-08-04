import React, { createContext, useContext, useState, useEffect } from "react";
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

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMinor, setIsMinor] = useState(false);
  const [hasParentalConsent, setHasParentalConsent] = useState(false);

  // Simple initialization without complex subscription management
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // Check for existing guest user first
        const savedGuestUser = localStorage.getItem("guestUser");
        if (savedGuestUser) {
          try {
            const parsedUser = JSON.parse(savedGuestUser);
            if (isMounted) {
              setUser(parsedUser);
              setIsMinor(false);
              setHasParentalConsent(true);
              setIsLoading(false);
            }
            return;
          } catch (error) {
            console.error('Failed to parse saved guest user:', error);
            localStorage.removeItem("guestUser");
          }
        }

        // Try Supabase if available
        if (hasSupabase && supabase) {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.user && isMounted) {
              // Simple user profile creation without complex database operations
              const user: User = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'مستخدم',
                avatar: session.user.user_metadata?.avatar_url,
                createdAt: new Date(),
                isGuest: false,
              };
              
              setUser(user);
              setIsMinor(false);
              setHasParentalConsent(true);
            } else {
              // Create guest user
              await createGuestUser();
            }
          } catch (error) {
            console.error('Supabase session error:', error);
            await createGuestUser();
          }
        } else {
          // No Supabase, create guest user
          await createGuestUser();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await createGuestUser();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const createGuestUser = async () => {
      if (!isMounted) return;

      const guestUser: User = {
        id: "guest-" + Date.now(),
        name: "طالب ضيف",
        email: undefined,
        createdAt: new Date(),
        isGuest: true,
      };

      setUser(guestUser);
      setIsMinor(false);
      setHasParentalConsent(true);
      
      try {
        localStorage.setItem("guestUser", JSON.stringify(guestUser));
      } catch (error) {
        console.error('Failed to save guest user:', error);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!hasSupabase || !supabase) {
        throw new Error('Authentication service not available');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'مستخدم',
          avatar: data.user.user_metadata?.avatar_url,
          createdAt: new Date(),
          isGuest: false,
        };
        
        setUser(user);
        setIsMinor(false);
        setHasParentalConsent(true);
        
        // Clear guest user
        localStorage.removeItem("guestUser");
      }
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
      if (!hasSupabase || !supabase) {
        throw new Error('Authentication service not available');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            birth_date: birthDate,
            parent_email: parentEmail
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email,
          name: name,
          avatar: data.user.user_metadata?.avatar_url,
          createdAt: new Date(),
          isGuest: false,
        };
        
        setUser(user);
        
        // Check age if birth date provided
        if (birthDate) {
          const age = calculateAge(new Date(birthDate));
          setIsMinor(age < 18);
          setHasParentalConsent(age >= 18);
        } else {
          setIsMinor(false);
          setHasParentalConsent(true);
        }
        
        // Clear guest user
        localStorage.removeItem("guestUser");
      }
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
      if (!hasSupabase || !supabase) {
        throw new Error('Authentication service not available');
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback'
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Google sign in failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      if (hasSupabase && supabase) {
        await supabase.auth.signOut();
      }

      // Clear any stored data
      localStorage.removeItem("guestUser");
      
      // Create new guest user
      const guestUser: User = {
        id: "guest-" + Date.now(),
        name: "طالب ضيف",
        email: undefined,
        createdAt: new Date(),
        isGuest: true,
      };

      setUser(guestUser);
      setIsMinor(false);
      setHasParentalConsent(true);
      
      localStorage.setItem("guestUser", JSON.stringify(guestUser));
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const requestParentalConsent = async (parentEmail: string) => {
    if (!user || user.isGuest) {
      throw new Error('Must be signed in to request parental consent');
    }

    try {
      // TODO: Implement parental consent email functionality
      console.log('Parental consent requested for:', parentEmail);
    } catch (error) {
      console.error('Failed to request parental consent:', error);
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
    isAuthenticated: user !== null && !user.isGuest,
    isMinor,
    hasParentalConsent,
    requestParentalConsent,
  };

  // Always render children - no conditional rendering that could cause DOM issues
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
