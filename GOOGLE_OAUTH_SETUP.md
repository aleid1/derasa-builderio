# Google OAuth Setup with Supabase

This guide will help you set up Google OAuth authentication for the دراسة platform using Supabase and Google Cloud Platform.

## Prerequisites

1. A Supabase project
2. A Google Cloud Platform (GCP) project
3. Domain configured for your application

## Step 1: Google Cloud Platform Setup

### 1.1 Create a GCP Project (if needed)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

### 1.2 Enable Google+ API
1. Go to APIs & Services > Library
2. Search for "Google+ API"
3. Enable the API

### 1.3 Create OAuth 2.0 Credentials
1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Configure:
   - **Name**: دراسة App
   - **Authorized JavaScript origins**: 
     - `http://localhost:8080` (for development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**:
     - `https://[your-supabase-project].supabase.co/auth/v1/callback`
     - `http://localhost:8080/auth/callback` (for development)

5. Save and note the **Client ID** and **Client Secret**

## Step 2: Supabase Configuration

### 2.1 Configure Google OAuth Provider
1. Go to your Supabase dashboard
2. Navigate to Authentication > Providers
3. Find "Google" and click to configure
4. Fill in:
   - **Client ID**: From GCP OAuth credentials
   - **Client Secret**: From GCP OAuth credentials
   - **Redirect URL**: Should be pre-filled as `https://[project].supabase.co/auth/v1/callback`
5. Enable the provider

### 2.2 Set up RLS (Row Level Security)
The auth context will automatically create user profiles, but ensure your database has proper RLS policies:

```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own data
CREATE POLICY "Users can read own data" ON users
FOR SELECT USING (auth.uid() = id);

-- Policy for users to update their own data  
CREATE POLICY "Users can update own data" ON users
FOR UPDATE USING (auth.uid() = id);

-- Policy for creating user profiles
CREATE POLICY "Users can insert own profile" ON users
FOR INSERT WITH CHECK (auth.uid() = id);
```

## Step 3: Environment Configuration

### 3.1 Create .env file
Copy `.env.example` to `.env` and fill in your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Client-side Supabase (for Vite)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3.2 Set Environment Variables (Production)
For production deployment, set these environment variables in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Step 4: Testing

### 4.1 Development Testing
1. Start your development server: `npm run dev`
2. Open the login modal
3. Click "متابعة مع Google"
4. You should be redirected to Google OAuth
5. After authorization, you'll be redirected back to `/auth/callback`
6. The callback page will process the authentication and redirect to `/chat`

### 4.2 Troubleshooting

**Error: "Supabase configuration missing"**
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set

**Error: "redirect_uri_mismatch"**
- Ensure your callback URL in GCP matches your Supabase redirect URL
- Check that your domain is in the authorized origins

**User not created in database**
- Check your database policies
- Verify the users table schema matches the auth context expectations

## Step 5: User Profile Schema

Ensure your users table has these columns:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  birth_date DATE,
  parent_email TEXT,
  consent_given BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  preferences JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}'
);
```

## Security Notes

1. Never commit actual credentials to version control
2. Use environment variables for all sensitive data
3. Regularly rotate your API keys
4. Monitor authentication logs in Supabase
5. Set up proper CORS policies for production

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
