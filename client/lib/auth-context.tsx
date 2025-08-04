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

  useEffect(() => {
    // Initialize auth state
    initializeAuth();

    // Listen for auth changes only if Supabase is available
    let subscription: any = null;

    if (hasSupabase && supabase) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            await loadUserProfile(session.user);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setIsMinor(false);
            setHasParentalConsent(false);
          }
          setIsLoading(false);
        }
      );
      subscription = data.subscription;
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const initializeAuth = async () => {
    try {
      if (hasSupabase && supabase) {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          await createGuestSession();
        }
      } else {
        // No Supabase configuration, use guest session
        await createGuestSession();
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      await createGuestSession();
    } finally {
      setIsLoading(false);
    }
  };

  const createGuestSession = async () => {
    const guestUser: User = {
      id: "guest-" + Date.now(),
      name: "طالب ضيف",
      email: undefined,
      createdAt: new Date(),
      isGuest: true,
    };

    setUser(guestUser);
    setIsMinor(false);
    setHasParentalConsent(true); // Guests don't need parental consent
    
    // Store guest session locally
    localStorage.setItem("guestUser", JSON.stringify(guestUser));
  };

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      if (!hasSupabase || !supabase) {
        throw new Error('Supabase not available');
      }

      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      let userProfile = profile;

      // Create profile if it doesn't exist
      if (!profile) {
        const newProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
          avatar_url: supabaseUser.user_metadata?.avatar_url,
          consent_given: false,
          subscription_tier: 'free' as const,
          preferences: {},
          privacy_settings: {
            shareProgress: false,
            allowAnalytics: true,
            parentNotifications: true
          }
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('users')
          .insert(newProfile)
          .select()
          .single();

        if (createError) throw createError;
        userProfile = createdProfile;
      }

      const user: User = {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        avatar: userProfile.avatar_url,
        createdAt: new Date(userProfile.created_at),
        isGuest: false,
        subscriptionTier: userProfile.subscription_tier,
        preferences: userProfile.preferences,
        privacySettings: userProfile.privacy_settings
      };

      setUser(user);

      // Check if user is minor and has parental consent
      const birthDate = userProfile.birth_date;
      if (birthDate) {
        const age = calculateAge(new Date(birthDate));
        const isUserMinor = age < 18;
        setIsMinor(isUserMinor);
        setHasParentalConsent(!isUserMinor || userProfile.consent_given);
      } else {
        // If no birth date, assume adult
        setIsMinor(false);
        setHasParentalConsent(true);
      }

      // Update last seen if Supabase is available
      if (hasSupabase && supabase) {
        await supabase
          .from('users')
          .update({ last_seen_at: new Date().toISOString() })
          .eq('id', userProfile.id);
      }

    } catch (error) {
      console.error('Failed to load user profile:', error);
      throw error;
    }
  };

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
        await loadUserProfile(data.user);
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
        await loadUserProfile(data.user);
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear local storage
      localStorage.removeItem("guestUser");
      
      // Create new guest session
      await createGuestSession();
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
      // Update user profile with parent email
      const { error } = await supabase
        .from('users')
        .update({ parent_email: parentEmail })
        .eq('id', user.id);

      if (error) throw error;

      // TODO: Send email to parent with consent link
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
