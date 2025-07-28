import { useNavigate } from "react-router-dom";

export default function MainContent() {
  const navigate = useNavigate();
  return (
    <main className="flex-1 bg-white dark:bg-gray-900 h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl mx-auto">
        {/* Logo/Title */}
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-6">
          دراسة
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          مدرسك الذكي في الذكاء الاصطناعي
        </p>
        
        {/* Description */}
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 leading-relaxed">
          تعلم مع الذكاء الاصطناعي بطريقة تفاعلية وذكية. احصل على إجابات فورية، وشروحات مفصلة، ومساعدة شخصية لتحقيق أهدافك التعليمية.
        </p>

        {/* CTA Button */}
        <button className="bg-[rgb(252,199,81)] hover:bg-[rgb(248,185,61)] text-black font-semibold px-8 py-4 rounded-full text-lg transition-all duration-200 ease-in-out hover:scale-105 shadow-lg">
          ابدأ التعلم الآن
        </button>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">محادثات ذكية</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">تفاعل مع مدرس الذكاء الاصطناعي للحصول على إجابات فورية ومفصلة</p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">مواد تعليمية</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">اكتشف مجموعة واسعة من المواد التعليمية المخصصة لاحتياجاتك</p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">تعلم سريع</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">تقنيات متقدمة لتسريع عملية التعلم وتحسين الفهم</p>
          </div>
        </div>
      </div>
    </main>
  );
}
