// Validate if Supabase URL is real (not demo/placeholder)
const validateSupabaseUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    // Check if it's a real Supabase URL (not demo/placeholder)
    return urlObj.hostname.includes('.supabase.') &&
           !urlObj.hostname.includes('demo') &&
           !urlObj.hostname.includes('placeholder') &&
           !urlObj.hostname.includes('example');
  } catch {
    return false;
  }
};

// Client-side environment configuration
export const env = {
  // Supabase configuration (optional for development)
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',

  // Feature flags - only enable Supabase if URL is valid
  ENABLE_SUPABASE: !!(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    validateSupabaseUrl(import.meta.env.VITE_SUPABASE_URL) &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== 'demo-key'
  ),
  ENABLE_PARENTAL_CONTROLS: import.meta.env.VITE_ENABLE_PARENTAL_CONTROLS !== 'false',
  ENABLE_CONTENT_MODERATION: import.meta.env.VITE_ENABLE_CONTENT_MODERATION !== 'false',

  // App configuration
  APP_ENV: import.meta.env.MODE || 'development',
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
} as const;

export const isDevelopment = env.IS_DEVELOPMENT;
export const isProduction = env.IS_PRODUCTION;
export const hasSupabase = env.ENABLE_SUPABASE;
