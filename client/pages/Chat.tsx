import Sidebar from "../components/Sidebar";

export default function Chat() {
  return (
    <div className="h-screen flex" dir="rtl">
      <div className="flex-1 bg-white dark:bg-gray-900 h-screen flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            دراسة - محادثة جديدة
          </h1>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              مرحباً! كيف يمكنني مساعدتك اليوم؟
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              اسأل أي سؤال أو اطلب المساعدة في أي موضوع تعليمي وسأكون سعيداً لمساعدتك.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <button className="px-6 py-3 bg-[rgb(252,199,81)] hover:bg-[rgb(248,185,61)] text-black rounded-lg transition-colors duration-200">
              إرسال
            </button>
          </div>
        </div>
      </div>
      <Sidebar />
    </div>
  );
}
