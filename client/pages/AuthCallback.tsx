import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { hasSupabase } from '../lib/env';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (!hasSupabase || !supabase) {
          console.error('Supabase not configured');
          navigate('/');
          return;
        }

        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/?error=auth_failed');
          return;
        }

        if (data.session) {
          // Authentication successful, redirect to chat
          navigate('/chat');
        } else {
          // No session found, redirect to home
          navigate('/');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        navigate('/?error=unexpected');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="mb-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          جاري تسجيل الدخول...
        </h2>
        <p className="text-gray-600 text-sm">
          يرجى الانتظار بينما نقوم بتأكيد هويتك
        </p>
      </div>
    </div>
  );
}
