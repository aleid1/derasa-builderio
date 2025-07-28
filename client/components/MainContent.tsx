import { useNavigate } from "react-router-dom";
import HeroChatCard from "./HeroChatCard";
import SuggestionPills from "./SuggestionPills";

export default function MainContent() {
  const navigate = useNavigate();
  return (
    <main className="flex-1 bg-tutory-sidebar" dir="rtl">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <div className="w-full max-w-6xl mx-auto">
          <HeroChatCard />
          <SuggestionPills />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            كيف نساعدك؟
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">محادثات ذكية</h3>
              <p className="text-gray-600 leading-relaxed">تفاعل مع مدرس الذكاء الاصطناعي للحصول على إجابات فورية ومفصلة لجميع أسئلتك التعليمية</p>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">مواد تعليمية</h3>
              <p className="text-gray-600 leading-relaxed">اكتشف مجموعة واسعة من المواد التعليمية المخصصة لاحتياجاتك ومستواك الدراسي</p>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">تعلم سريع</h3>
              <p className="text-gray-600 leading-relaxed">تقنيات متقدمة لتسريع عملية التعلم وتحسين الفهم مع نصائح ذكية ومخصصة</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
