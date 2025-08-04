import React, { useState } from "react";
import { X, Eye, EyeOff, User, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "../lib/auth-context";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (mode === "login") {
        if (!email.trim()) {
          setError("البريد الإلكتروني مطلوب");
          return;
        }
        if (!password.trim()) {
          setError("كلمة المرور مطلوبة");
          return;
        }
        await signIn(email, password);
      } else {
        if (!name.trim()) {
          setError("الاسم مطلوب");
          return;
        }
        if (!email.trim()) {
          setError("البريد الإلكتروني مطلوب");
          return;
        }
        if (!password.trim() || password.length < 6) {
          setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
          return;
        }
        await signUp(email, password, name);
      }
      onClose();
    } catch (err) {
      setError(
        mode === "login"
          ? "فشل تسجيل الدخول. تأكد من بياناتك."
          : "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      await signInWithGoogle();
      onClose(); // Close modal after successful authentication
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      if (err.message?.includes('configuration')) {
        setError("تم استخدام حساب تجريبي. في الإنتاج، سيتم ربطك بحسابك الفعلي.");
      } else {
        setError("فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
    setShowPassword(false);
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      dir="rtl"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">
              {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          </div>
          <p className="text-neutral-500 mt-2">
            {mode === "login"
              ? "أدخل بياناتك للوصول إلى حسابك"
              : "أنشئ حساباً جديداً للبدء مع دراسة"}
          </p>
          {mode === "login" && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 font-medium mb-1">🎯 حساب تجريبي للتجربة:</p>
              <p className="text-xs text-blue-600">
                البريد: test@test.com | كلمة المرور: 123456
              </p>
            </div>
          )}
        </div>

        {/* OAuth Sign-In */}
        <div className="p-6 pb-0">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-neutral-600 mb-2">🚀 تسجيل دخول سريع</p>
              <p className="text-xs text-amber-600 mb-4 bg-amber-50 p-2 rounded border">
                💡 الإصدار التجريبي: سيقوم بإنشاء حساب ��جريبي
              </p>
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "متابعة مع Google"
                )}
              </button>
            </div>

            <div className="flex items-center">
              <div className="flex-1 border-t border-neutral-200"></div>
              <span className="px-4 text-sm text-neutral-500">أو</span>
              <div className="flex-1 border-t border-neutral-200"></div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                الاسم الكامل
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="أدخل اسمك الكامل"
                  dir="rtl"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="example@gmail.com"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-12 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder={mode === "signup" ? "6 أحرف على الأقل" : "كلمة المرور"}
                minLength={6}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading
              ? "جاري المعالجة..."
              : mode === "login"
                ? "تسجيل الدخول"
                : "إنشاء الحساب"}
          </button>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 text-center">
          <p className="text-neutral-600">
            {mode === "login" ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
            <button
              onClick={switchMode}
              className="text-primary hover:text-primary/80 font-medium mr-2"
            >
              {mode === "login" ? "إنشاء حساب جديد" : "تسجيل الدخول"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
