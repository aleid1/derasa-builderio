import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingFallbackProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showMessage?: boolean;
}

export default function LoadingFallback({ 
  message = "جاري التحميل...", 
  size = 'md',
  showMessage = true 
}: LoadingFallbackProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {showMessage && (
        <p className="mt-4 text-sm text-gray-600 text-center" dir="rtl">
          {message}
        </p>
      )}
    </div>
  );
}

// Full screen loading component
export function FullScreenLoading({ message = "جاري تهيئة التطبيق..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2" dir="rtl">
          دراسة
        </h2>
        
        <p className="text-gray-600" dir="rtl">
          {message}
        </p>
      </div>
    </div>
  );
}

// Inline loading for components
export function InlineLoading({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
  );
}
