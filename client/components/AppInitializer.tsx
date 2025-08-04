import React from 'react';
import { useAuth } from '../lib/auth-context';
import { Loader2 } from 'lucide-react';

interface AppInitializerProps {
  children: React.ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  const { isLoading, user } = useAuth();

  // Show simple loading state while auth is initializing
  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2" dir="rtl">
            دراسة
          </h2>
          <p className="text-gray-600 text-sm" dir="rtl">
            جاري التحميل...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
