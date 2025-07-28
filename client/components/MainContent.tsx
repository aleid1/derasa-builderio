import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function MainContent() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      navigate('/chat');
    }
  };

  const suggestions = ["اطلب تلميحًا", "اشرح خطوة", "مثال إضافي", "تغيير الموضوع"];

  return (
    <main className="flex-1 h-screen overflow-y-auto" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-4">
            مرحبًا بك في درّسة
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 font-medium">
            معلمك الشخصي الذكي
          </p>
          
          {/* Description */}
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            تعلم مع الذكاء الاصطناعي بطريقة تفاعلية وذكية. احصل على إجابات فورية، وشروحات مفصلة، ومساعدة شخصية لتحقيق أهدافك التعليمية.
          </p>

          {/* Chat Input Card */}
          <div className="w-[95%] md:w-[75%] max-w-3xl mx-auto mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
              {/* Input Container */}
              <div className="flex items-center gap-2 md:gap-3 mb-4 bg-gray-50 dark:bg-gray-700 rounded-xl p-2 md:p-3" dir="rtl">
                {/* Send Button */}
                <button
                  onClick={handleSend}
                  className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>

                {/* Microphone Icon */}
                <button className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>

                {/* Attach Photo Icon */}
                <button className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>

                {/* Input Field */}
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="اكتب سؤالك هنا…"
                  className="flex-1 bg-transparent text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-lg"
                />
              </div>

              {/* Suggestion Pills */}
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(suggestion)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-full text-sm transition-colors duration-200 border border-gray-200 dark:border-gray-500"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How We Help Section */}
      <div className="bg-white dark:bg-gray-800 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center mb-12">
            كيف نساعدك؟
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">محادثات ذكية</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">تفاعل مع مدرس الذكاء الاصطناعي للحصول على إجابات فورية ومفصلة</p>
            </div>

            <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">مواد تعليمية</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">اكتشف مجموعة واسعة من المواد التعليمية المخصصة لاحتياجاتك</p>
            </div>

            <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">تعلم سريع</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">تقنيات متقدمة لتسريع عملية التعلم وتحسين الفهم</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
