import { User } from "./chat-types";

// Temporary mock while debugging DOM issues
export function useAuth() {
  return {
    user: {
      id: "guest-123",
      name: "طالب ضيف",
      email: undefined,
      createdAt: new Date(),
      isGuest: true,
    } as User,
    isLoading: false,
    signIn: async () => alert("تم تسجيل الدخول كحساب تجريبي"),
    signUp: async () => alert("تم إنشاء حساب تجريبي"),
    signInWithGoogle: async () => {
      // Check environment variables
      const hasUrl = !!import.meta.env.VITE_SUPABASE_URL;
      const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (hasUrl && hasKey) {
        alert("البيئة مكونة - سيتم تفعيل Google OAuth لاحقاً");
      } else {
        alert("تم استخدام حساب Google تجريبي");
      }
    },
    signOut: async () => alert("تم تسجيل الخروج"),
    isAuthenticated: false,
    isMinor: false,
    hasParentalConsent: true,
    requestParentalConsent: async () => {},
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
