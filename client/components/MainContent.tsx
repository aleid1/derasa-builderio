import { useNavigate } from "react-router-dom";
import HeroChatCard from "./HeroChatCard";
import SuggestionPills from "./SuggestionPills";

export default function MainContent() {
  const navigate = useNavigate();
  return (
    <main className="flex-1 bg-neutral-50" dir="rtl">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="w-full max-w-6xl mx-auto">
          <HeroChatCard />
          <SuggestionPills />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 text-center mb-16">
            كيف نساعدك؟
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 bg-white rounded-3xl shadow-lg border border-neutral-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 group-hover:text-primary transition-colors duration-300">إرشاد توجيهي</h3>
              <p className="text-neutral-500 leading-relaxed text-lg">خطوة بخطوة حتى تصل للإجابة بنفسك، كما يفعل المعلم.</p>
            </div>

            <div className="group p-8 bg-white rounded-3xl shadow-lg border border-neutral-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 group-hover:text-secondary transition-colors duration-300">مواد متوافقة مع قيمنا</h3>
              <p className="text-neutral-500 leading-relaxed text-lg">محتوى تعليمي يتماشى مع الثقافة الإسلامية واحتياجات الطالب.</p>
            </div>

            <div className="group p-8 bg-white rounded-3xl shadow-lg border border-neutral-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 group-hover:text-primary transition-colors duration-300">بيئة آمنة للأطفال</h3>
              <p className="text-neutral-500 leading-relaxed text-lg">دردشة ومحتوى مناسب لجميع الأعمار، خالٍ من أي محتوى غير لائق.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
