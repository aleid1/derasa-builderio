import React from 'react';
import { useAuth } from '../lib/auth-context';
import { hasSupabase } from '../lib/env';
import { CheckCircle, AlertCircle, UserCheck, User } from 'lucide-react';

export default function AuthStatusIndicator() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-sm">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-700">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg p-3 shadow-sm max-w-xs">
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          {hasSupabase ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-500" />
          )}
          <span className={hasSupabase ? 'text-green-700' : 'text-amber-700'}>
            Supabase: {hasSupabase ? 'متصل' : 'غير متصل'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <UserCheck className="w-4 h-4 text-blue-500" />
          ) : (
            <User className="w-4 h-4 text-gray-500" />
          )}
          <span className={isAuthenticated ? 'text-blue-700' : 'text-gray-600'}>
            المستخدم: {isAuthenticated ? 'مسجل الدخول' : 'ضيف'}
          </span>
        </div>

        {user && (
          <div className="pt-2 border-t border-gray-200">
            <p className="font-medium text-gray-900">{user.name}</p>
            {user.email && (
              <p className="text-gray-600">{user.email}</p>
            )}
            <p className="text-gray-500">
              {user.isGuest ? 'حساب ضيف' : 'حساب مُسجل'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Export a version that only shows in development
export function DevAuthStatusIndicator() {
  const isDevelopment = import.meta.env.DEV;
  
  if (!isDevelopment) {
    return null;
  }
  
  return <AuthStatusIndicator />;
}
