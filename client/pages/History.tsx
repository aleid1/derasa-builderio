import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { useAuth } from "../lib/auth-context";
import { MessageCircle, Lock } from "lucide-react";

export default function History() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to chat page where history is now in sidebar
    if (!isLoading && isAuthenticated) {
      navigate('/chat', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navigation />
        <main className="flex-1 bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral-500">جاري التحميل...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show guest message (authenticated users will be redirected)
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navigation />
      
      <main className="flex-1 bg-neutral-50" dir="rtl">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center">
            <Lock className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              تسجيل الدخول مطلوب
            </h1>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              يجب تسجيل الدخول لمشاهدة تاريخ المحادثات. سجل دخولك للوصول إلى محادثاتك المحفوظة.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate('/chat')}
                className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors font-medium"
              >
                ابدأ محادثة جديدة
              </button>
              <div>
                <button
                  onClick={() => navigate('/')}
                  className="text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  العودة للرئيسية
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
