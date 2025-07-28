import { Mic, Paperclip, Send } from "lucide-react";

export default function HeroChatCard() {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Header Text */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          مرحبًا بك في درّسة — معلمك الشخصي الذكي
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          تعلم مع الذكاء الاصطناعي بطريقة تفاعلية وذكية
        </p>
      </div>

      {/* Chat Input Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4" dir="rtl">
          {/* Microphone Button */}
          <button
            aria-label="تسجيل صوتي"
            className="flex items-center justify-center w-12 h-12 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Attach Photo Button */}
          <button
            aria-label="إرفاق صورة"
            className="flex items-center justify-center w-12 h-12 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder="اكتب سؤالك هنا…"
            dir="rtl"
            className="flex-1 text-lg bg-transparent border-none outline-none placeholder-gray-500"
          />

          {/* Send Button */}
          <button
            aria-label="إرسال"
            className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#2E7D32] text-white hover:bg-[#1B5E20] transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
