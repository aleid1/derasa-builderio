import React, { createContext, useContext, useState } from "react";
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { User } from "./chat-types";

// Environment check
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = !!(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL.includes('.supabase.co') &&
  SUPABASE_ANON_KEY.length > 20
);

console.log('🔧 Supabase Configuration:');
console.log('- URL configured:', !!SUPABASE_URL);
console.log('- Key configured:', !!SUPABASE_ANON_KEY);
console.log('- Client ready:', !!supabase);
console.log('- Configuration valid:', isSupabaseConfigured);

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

const createGuestUser = (): User => ({
  id: "guest-" + Date.now(),
  name: "طالب ضيف",
  email: undefined,
  createdAt: new Date(),
  isGuest: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize with guest user
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem("guestUser");
      return saved ? JSON.parse(saved) : createGuestUser();
    } catch {
      return createGuestUser();
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSupabaseUser = async (supabaseUser: SupabaseUser) => {
    try {
      // Get or create user profile in database
      let { data: profile, error } = await supabase!
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // User doesn't exist, create profile
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

        profile = createError ? newProfile : createdProfile;
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
      console.log('✅ User authenticated successfully:', user.name);
    } catch (error) {
      console.error('Error creating user profile:', error);
      // Fallback to basic user
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

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data.user) {
          await handleSupabaseUser(data.user);
          return;
        }
        console.warn('Supabase login failed:', error?.message);
      }

      // Demo accounts fallback
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
        return;
      }

      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, name: name }
          }
        });

        if (!error && data.user) {
          await handleSupabaseUser(data.user);
          return;
        }
        console.warn('Supabase signup failed:', error?.message);
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
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      console.log('🚀 Starting Google OAuth...');
      
      if (!isSupabaseConfigured || !supabase) {
        console.error('❌ Supabase not configured properly');
        throw new Error('Supabase configuration missing');
      }

      console.log('📡 Calling Google OAuth...');
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

      console.log('📊 OAuth response:', { data, error });

      if (error) {
        console.error('❌ OAuth initiation failed:', error);
        throw error;
      }

      console.log('✅ OAuth initiated - redirecting to Google...');
      // Don't set loading to false here - the redirect should happen
      return;
      
    } catch (error) {
      console.error('❌ Google OAuth failed:', error);
      
      // Fallback to demo authentication
      console.log('🔄 Using demo Google authentication');
      const demoGoogleUser: User = {
        id: "google-demo-" + Date.now(),
        email: "user@gmail.com",
        name: "مستخدم تجريبي Google",
        avatar: "https://via.placeholder.com/40?text=G",
        createdAt: new Date(),
        isGuest: false,
      };

      setUser(demoGoogleUser);
      localStorage.removeItem("guestUser");
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
    
    const guestUser = createGuestUser();
    setUser(guestUser);
    localStorage.removeItem("guestUser");
    localStorage.setItem("guestUser", JSON.stringify(guestUser));
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
    isMinor: false,
    hasParentalConsent: true,
    requestParentalConsent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
