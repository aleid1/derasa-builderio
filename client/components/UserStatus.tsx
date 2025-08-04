import React from 'react';
import { useAuth } from '../lib/auth-context';
import { User, LogOut, Loader2 } from 'lucide-react';

export default function UserStatus() {
  const { user, isLoading, signOut, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">جاري التحميل...</span>
      </div>
    );
  }

  if (!isAuthenticated || user?.isGuest) {
    return (
      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <User className="w-4 h-4 text-blue-600" />
        <span className="text-sm text-blue-700">ضيف - يرجى تسجيل الدخول</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-green-600" />
        <div>
          <p className="text-sm font-medium text-green-700">{user.name}</p>
          <p className="text-xs text-green-600">{user.email}</p>
        </div>
      </div>
      <button
        onClick={signOut}
        className="p-1 hover:bg-green-100 rounded transition-colors"
        title="تسجيل الخروج"
      >
        <LogOut className="w-4 h-4 text-green-600" />
      </button>
    </div>
  );
}
