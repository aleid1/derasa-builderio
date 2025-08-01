import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function Features() {
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navigation />
      
      <main className="flex-1 bg-neutral-50" dir="rtl">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              مزايا منصة دراسة
            </h1>
            <p className="text-xl text-neutral-500 leading-relaxed max-w-2xl mx-auto">
              تعرف على كيفية مساعدتك في رحلتك التعليمية بشكل آمن وملائم لقيمنا الثقافية والإسلامية.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6 bg-neutral-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-neutral-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">بيئة آمنة</h3>
                <p className="text-neutral-500 leading-relaxed">محتوى مفلتر ومناسب لجميع الأعمار، خالٍ من أي محتوى غير لائق أو ضار</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-neutral-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">تراعي الثقافة والقيم</h3>
                <p className="text-neutral-500 leading-relaxed">محتوى وتفاعل يراعي قيمنا العربية والإسلامية ويحترم خصوصيتنا الثقافية.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-neutral-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">إرشاد تدريجي</h3>
                <p className="text-neutral-500 leading-relaxed">نرشدك خطوة بخطوة للوصول إلى الحل بنفسك بدلاً من إعطائك الإجابة مباشرة.</p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-neutral-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">منهجية تعليمية</h3>
                <p className="text-neutral-500 leading-relaxed">أسلوب تعليمي منظم يركز على الفهم العميق وبناء المعرفة التدريجي</p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-neutral-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">محتوى موثوق وعالي الجودة</h3>
                <p className="text-neutral-500 leading-relaxed">معلومات دقيقة مستندة إلى مصادر موثوقة لضمان أفضل تجربة تعليمية.</p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-neutral-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 19l-7-7 1.41-1.41L12 16.17l5.59-5.58L19 12l-7 7z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">متاح دائماً</h3>
                <p className="text-neutral-500 leading-relaxed">خدمة متاحة على مدار الساعة لمساعدتك في أي وقت تحتاج فيه للتعلم</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
