// Client-side environment configuration
export const env = {
  // Supabase configuration (optional for development)
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  
  // Feature flags
  ENABLE_SUPABASE: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
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
