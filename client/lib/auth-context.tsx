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

  // Listen for auth state changes if Supabase is available
  useEffect(() => {
    if (!hasSupabase || !supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await handleSupabaseUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          handleSignOut();
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleSupabaseUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSupabaseUser = async (supabaseUser: SupabaseUser) => {
    try {
      // Get or create user profile
      let { data: profile, error } = await supabase!
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // User doesn't exist, create one
        const newProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.full_name || 
                supabaseUser.user_metadata?.name || 
                supabaseUser.email!.split('@')[0],
          avatar_url: supabaseUser.user_metadata?.avatar_url,
          consent_given: true,
          subscription_tier: 'free',
          preferences: {},
          privacy_settings: {
            shareProgress: false,
            allowAnalytics: true,
            parentNotifications: true
          }
        };

        const { data: createdProfile, error: createError } = await supabase!
          .from('users')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          profile = newProfile; // Use the data we tried to insert
        } else {
          profile = createdProfile;
        }
      } else if (error) {
        console.error('Error fetching user profile:', error);
        // Create a basic profile from Supabase user data
        profile = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.full_name || 
                supabaseUser.user_metadata?.name || 
                supabaseUser.email!.split('@')[0],
          avatar_url: supabaseUser.user_metadata?.avatar_url,
          created_at: supabaseUser.created_at,
          updated_at: new Date().toISOString(),
        };
      }

      const user: User = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar_url,
        createdAt: new Date(profile.created_at || supabaseUser.created_at),
        isGuest: false,
        subscriptionTier: profile.subscription_tier || 'free',
        preferences: profile.preferences || {},
        privacySettings: profile.privacy_settings || {
          shareProgress: false,
          allowAnalytics: true,
          parentNotifications: true
        }
      };

      setUser(user);
      localStorage.removeItem("guestUser");
    } catch (error) {
      console.error('Error handling Supabase user:', error);
      // Fallback to basic user creation
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
    }
  };

  const handleSignOut = () => {
    const guestUser = createGuestUser();
    setUser(guestUser);
    try {
      localStorage.removeItem("guestUser");
      localStorage.setItem("guestUser", JSON.stringify(guestUser));
    } catch (error) {
      console.error('Error saving guest user:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (hasSupabase && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        // User will be set through the auth state change listener
        return;
      }

      // Fallback: Demo accounts for testing when Supabase is not available
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

        if (error) throw error;
        // User will be set through the auth state change listener
        return;
      }

      // Fallback: Mock registration when Supabase is not available
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
      if (hasSupabase && supabase) {
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

        if (error) throw error;
        // The redirect will handle the authentication
        return;
      }

      // Fallback when Supabase is not available
      throw new Error('Google authentication requires Supabase configuration');
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
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      
      handleSignOut();
    } catch (error) {
      console.error('Sign out failed:', error);
      // Still proceed with local sign out
      handleSignOut();
    }
  };

  const requestParentalConsent = async (parentEmail: string) => {
    console.log('Parental consent requested for:', parentEmail);
    // TODO: Implement parental consent email functionality
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
