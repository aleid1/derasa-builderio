import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { hasSupabase } from './env'
import { User } from "./chat-types";
import { FullScreenLoading } from "../components/LoadingFallback";

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
  
  // Use ref to track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    let subscription: any = null;
    let isInitialized = false;

    const initializeAuth = async () => {
      try {
        if (!isMountedRef.current) return;

        if (hasSupabase && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!isMountedRef.current) return;

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
        if (isMountedRef.current) {
          await createGuestSession();
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
          isInitialized = true;
        }
      }
    };

    // Initialize auth state
    initializeAuth();

    // Listen for auth changes only if Supabase is available
    if (hasSupabase && supabase) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          // Only process auth changes after initial setup
          if (!isInitialized || !isMountedRef.current) return;

          try {
            if (event === 'SIGNED_IN' && session?.user) {
              await loadUserProfile(session.user);
            } else if (event === 'SIGNED_OUT') {
              if (isMountedRef.current) {
                setUser(null);
                setIsMinor(false);
                setHasParentalConsent(false);
              }
            }
          } catch (error) {
            console.error('Auth state change error:', error);
          }
        }
      );
      subscription = data.subscription;
    }

    return () => {
      isMountedRef.current = false;
      
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from auth changes:', error);
        }
      }
    };
  }, []);

  const createGuestSession = async () => {
    if (!isMountedRef.current) return;

    const guestUser: User = {
      id: "guest-" + Date.now(),
      name: "طالب ضيف",
      email: undefined,
      createdAt: new Date(),
      isGuest: true,
    };

    if (isMountedRef.current) {
      setUser(guestUser);
      setIsMinor(false);
      setHasParentalConsent(true); // Guests don't need parental consent
    }
    
    // Store guest session locally
    try {
      localStorage.setItem("guestUser", JSON.stringify(guestUser));
    } catch (error) {
      console.error('Failed to save guest user to localStorage:', error);
    }
  };

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    if (!isMountedRef.current) return;

    try {
      if (!hasSupabase || !supabase) {
        throw new Error('Supabase not available');
      }

      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (!isMountedRef.current) return;

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

        if (!isMountedRef.current) return;

        if (createError) throw createError;
        userProfile = createdProfile;
      }

      if (!isMountedRef.current) return;

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
        if (isMountedRef.current) {
          setIsMinor(isUserMinor);
          setHasParentalConsent(!isUserMinor || userProfile.consent_given);
        }
      } else {
        // If no birth date, assume adult
        if (isMountedRef.current) {
          setIsMinor(false);
          setHasParentalConsent(true);
        }
      }

      // Update last seen if Supabase is available
      if (hasSupabase && supabase) {
        try {
          await supabase
            .from('users')
            .update({ last_seen_at: new Date().toISOString() })
            .eq('id', userProfile.id);
        } catch (error) {
          console.error('Failed to update last seen:', error);
        }
      }

    } catch (error) {
      console.error('Failed to load user profile:', error);
      if (isMountedRef.current) {
        throw error;
      }
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
    if (!isMountedRef.current) return;
    
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

      if (data.user && isMountedRef.current) {
        await loadUserProfile(data.user);
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const signUp = async (email: string, password: string, name: string, birthDate?: string, parentEmail?: string) => {
    if (!isMountedRef.current) return;
    
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

      if (data.user && isMountedRef.current) {
        await loadUserProfile(data.user);
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const signInWithGoogle = async () => {
    if (!isMountedRef.current) return;
    
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
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const signOut = async () => {
    try {
      if (hasSupabase && supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }

      // Clear local storage
      try {
        localStorage.removeItem("guestUser");
      } catch (error) {
        console.error('Failed to clear localStorage:', error);
      }
      
      // Create new guest session
      if (isMountedRef.current) {
        await createGuestSession();
      }
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
      if (hasSupabase && supabase) {
        // Update user profile with parent email
        const { error } = await supabase
          .from('users')
          .update({ parent_email: parentEmail })
          .eq('id', user.id);

        if (error) throw error;
      }

      // TODO: Send email to parent with consent link
      console.log('Parental consent requested for:', parentEmail);
      
    } catch (error) {
      console.error('Failed to request parental consent:', error);
      throw error;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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

  // Show loading screen during initial authentication setup
  if (isLoading && !user) {
    return <FullScreenLoading message="جاري تهيئة النظام..." />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
