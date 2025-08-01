import React, { useState } from "react";
import { X, Eye, EyeOff, User, Mail, Lock } from "lucide-react";
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

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        if (!name.trim()) {
          setError("الاسم مطلوب");
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
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">
              {mode === "login" ? "تسجيل ال��خول" : "إنشاء حساب جديد"}
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
        </div>

        {/* Google Sign-In */}
        <div className="p-6 pb-0">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-neutral-600 mb-4">🌟 سجل دخولك بسهولة مع Gmail</p>
              <div ref={googleButtonRef} className="flex justify-center"></div>
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
                  required={mode === "signup"}
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
                placeholder="البريد الإلكتروني"
                required
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
                placeholder="كلمة المرور"
                required
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
            <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
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
