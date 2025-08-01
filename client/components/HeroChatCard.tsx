import { Mic, Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroChatCard() {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      {/* Header Text */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
          مرحباً بك في دِراسة - معلمك الذكي الخاص
        </h1>
        <p className="text-xl md:text-2xl text-neutral-500 leading-relaxed max-w-2xl mx-auto">
          دِراسة يرشدك كالمعلم خطوة بخطوة دون إجابات جاهزة، في بيئة آمنة تحترم قيمنا الإسلامية.
        </p>
      </div>

      {/* Chat Input Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-neutral-200 p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && inputValue.trim()) {
                navigate("/chat", {
                  state: { initialMessage: inputValue.trim() },
                });
              }
            }}
            className="flex-1 text-lg bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none placeholder-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />

          {/* Send Button */}
          <button
            aria-label="إرسال"
            onClick={() => {
              if (inputValue.trim()) {
                navigate("/chat", {
                  state: { initialMessage: inputValue.trim() },
                });
              }
            }}
            disabled={!inputValue.trim()}
            className="flex items-center justify-center min-w-[48px] h-12 rounded-xl bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
