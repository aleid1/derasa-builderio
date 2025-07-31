import { Mic, Paperclip, Send } from "lucide-react";

export default function HeroChatCard() {
  return (
    <div className="w-[95%] md:w-[75%] mx-auto mb-8">
      {/* Header Text */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
          مرحبًا بك في درّسة — معلمك الشخصي الذكي
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
          تعلم مع الذكاء الاصطناعي بطريقة ��فاعلية وذكية
        </p>
      </div>

      {/* Chat Input Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
        <div className="flex items-center gap-4" dir="rtl">
          {/* Microphone Button */}
          <button
            aria-label="تسجيل صوتي"
            className="flex items-center justify-center min-w-[48px] h-12 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Attach Photo Button */}
          <button
            aria-label="إرفاق صورة"
            className="flex items-center justify-center min-w-[48px] h-12 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder="اكتب سؤالك هنا…"
            dir="rtl"
            className="flex-1 text-lg bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none placeholder-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />

          {/* Send Button */}
          <button
            aria-label="إرسال"
            className="flex items-center justify-center min-w-[48px] h-12 rounded-xl bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
