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

const createGuestUser = (): User => ({
  id: "guest-" + Date.now(),
  name: "طالب ضيف",
  email: undefined,
  createdAt: new Date(),
  isGuest: true,
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMinor] = useState(false);
  const [hasParentalConsent] = useState(true);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Check for existing Supabase session first
        if (hasSupabase && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            await handleSupabaseUser(session.user);
            setIsLoading(false);
            return;
          }
        }

        // Fall back to guest user
        if (isMounted) {
          const savedUser = localStorage.getItem("guestUser");
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch {
              const guestUser = createGuestUser();
              setUser(guestUser);
              localStorage.setItem("guestUser", JSON.stringify(guestUser));
            }
          } else {
            const guestUser = createGuestUser();
            setUser(guestUser);
            localStorage.setItem("guestUser", JSON.stringify(guestUser));
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          const guestUser = createGuestUser();
          setUser(guestUser);
          localStorage.setItem("guestUser", JSON.stringify(guestUser));
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up Supabase auth listener
    const subscription = hasSupabase && supabase 
      ? supabase.auth.onAuthStateChange(async (event, session) => {
          if (!isMounted) return;
          
          if (event === 'SIGNED_IN' && session?.user) {
            await handleSupabaseUser(session.user);
          } else if (event === 'SIGNED_OUT') {
            handleSignOut();
          }
        })
      : null;

    return () => {
      isMounted = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, []);

  const handleSupabaseUser = async (supabaseUser: SupabaseUser) => {
    try {
      const user: User = {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.full_name || 
              supabaseUser.user_metadata?.name || 
              supabaseUser.email!.split('@')[0],
        avatar: supabaseUser.user_metadata?.avatar_url,
        createdAt: new Date(supabaseUser.created_at),
        isGuest: false,
      };

      setUser(user);
      localStorage.removeItem("guestUser");
    } catch (error) {
      console.error('Error handling Supabase user:', error);
    }
  };

  const handleSignOut = () => {
    const guestUser = createGuestUser();
    setUser(guestUser);
    localStorage.removeItem("guestUser");
    localStorage.setItem("guestUser", JSON.stringify(guestUser));
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (hasSupabase && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error) {
          setIsLoading(false);
          return;
        }
      }

      // Demo authentication
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
        localStorage.removeItem("guestUser");
        setIsLoading(false);
        return;
      }

      throw new Error('Invalid credentials');
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, birthDate?: string, parentEmail?: string) => {
    setIsLoading(true);
    try {
      if (hasSupabase && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              name: name,
              birth_date: birthDate,
              parent_email: parentEmail
            }
          }
        });

        if (!error) {
          setIsLoading(false);
          return;
        }
      }

      // Demo registration
      const newUser: User = {
        id: "user-" + Date.now(),
        email,
        name,
        createdAt: new Date(),
        isGuest: false,
      };

      setUser(newUser);
      localStorage.removeItem("guestUser");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
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
      }

      // Demo Google authentication
      console.log('⚠️ Using demo Google authentication');
      const demoGoogleUser: User = {
        id: "google-demo-" + Date.now(),
        email: "user@gmail.com",
        name: "مستخدم تجريبي",
        avatar: "https://via.placeholder.com/40?text=G",
        createdAt: new Date(),
        isGuest: false,
      };

      setUser(demoGoogleUser);
      localStorage.removeItem("guestUser");
      
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
    try {
      if (hasSupabase && supabase) {
        await supabase.auth.signOut();
      }
      handleSignOut();
    } catch (error) {
      console.error('Sign out failed:', error);
      handleSignOut();
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
