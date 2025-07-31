import { useState } from "react";
import { Send, Mic, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ChatInterface() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; timestamp: Date }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    if (inputValue.trim() && !isLoading) {
      setIsLoading(true);
      const newMessage = {
        text: inputValue,
        isUser: true,
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          text: "شكرًا لك على سؤالك! أنا هنا لمساعدتك في رحلتك التعليمية. كيف يمكنني مساعدتك أكثر؟",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestions = [
    "اشرح لي مفهوم الجاذبية",
    "ساعدني في حل معادلة رياضية", 
    "ما هي قواعد اللغة العربية؟",
    "كيف أتعلم البرمجة؟",
    "اشرح لي دورة الماء في الطبيعة",
    "ما هو الذكاء الاصطناعي؟"
  ];

  return (
    <main className="flex-1 bg-white" dir="rtl">
      {/* Centered Container with Responsive Padding */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        
        {messages.length === 0 ? (
          // Empty State Layout
          <div>
            {/* Hero Section */}
            <div className="pt-8 pb-6 sm:pt-12 sm:pb-8 lg:pt-16 lg:pb-12">
              <div className="text-center lg:text-right lg:max-w-2xl">
                {/* AI Avatar */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center mb-6 sm:mb-8 shadow-lg border-2 border-primary/20 overflow-hidden mx-auto lg:mx-0">
                  <img 
                    src="https://cdn.builder.io/api/v1/image/assets%2Ffe102fa1240345669888b6698e27bb27%2F49f3aa3e3a324a28b9e41587038c40c6?format=webp&width=160"
                    alt="دِراسة AI"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.classList.add('bg-primary');
                      e.currentTarget.parentElement!.innerHTML = '<span class="text-white text-2xl font-bold">د</span>';
                    }}
                  />
                </div>
                
                {/* Headlines */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
                  ابدأ بطرح أي سؤال…
                </h2>
                <p className="text-base sm:text-lg text-neutral-500 leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8 sm:mb-12">
                  أنا هنا لمساعدتك في تعلم أي موضوع تريده. اسأل واحصل على إجابات مفصلة وواضحة
                </p>
              </div>
            </div>

            {/* Input and Pills Layout */}
            <div className="lg:flex lg:gap-8 lg:items-start">
              {/* Input Card */}
              <div className="lg:flex-1">
                <div className="bg-white rounded-2xl shadow-md border border-neutral-200 p-4">
                  <div className="flex items-center gap-3" dir="rtl">
                    {/* Microphone Button */}
                    <button
                      aria-label="تسجيل صوتي"
                      className="flex items-center justify-center min-w-[44px] h-12 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <Mic className="w-5 h-5" />
                    </button>

                    {/* Text Input */}
                    <input
                      type="text"
                      placeholder="اكتب سؤالك هنا��"
                      dir="rtl"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className="flex-1 text-base bg-transparent border-none outline-none placeholder-neutral-400 py-3 min-h-[44px]"
                    />

                    {/* Send Button */}
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="flex items-center justify-center min-w-[44px] h-12 rounded-xl bg-primary text-white hover:bg-primary/90 hover:shadow-lg transition-all duration-200 disabled:bg-neutral-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label="إرسال"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Action Pills */}
              {/* Mobile: Below input, full width wrapping */}
              <div className="mt-6 lg:hidden">
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(suggestion)}
                      className="px-4 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-300 rounded-full text-sm text-neutral-700 transition-all duration-200 font-medium min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary hover:shadow-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop: Fixed 256px sidebar */}
              <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(suggestion)}
                      className="w-full px-4 py-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-300 rounded-xl text-sm text-neutral-700 transition-all duration-200 font-medium text-right min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary hover:shadow-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Messages View
          <div className="py-6">
            <div className="space-y-8 max-w-3xl mx-auto">
              {messages.map((message, index) => (
                <div key={index} className="space-y-2">
                  <div className={`flex ${message.isUser ? 'justify-start' : 'justify-end'}`}>
                    <div className="flex items-start gap-4 max-w-[85%]">
                      {message.isUser && (
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-sm font-bold">أ</span>
                        </div>
                      )}
                      <div className="flex-1 bg-neutral-50 rounded-2xl p-4">
                        <p className="text-neutral-900 leading-relaxed text-base">{message.text}</p>
                      </div>
                      {!message.isUser && (
                        <div className="w-8 h-8 bg-white rounded-full border border-primary/20 flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
                          <img 
                            src="https://cdn.builder.io/api/v1/image/assets%2Ffe102fa1240345669888b6698e27bb27%2F49f3aa3e3a324a28b9e41587038c40c6?format=webp&width=64"
                            alt="دِراسة"
                            className="w-full h-full rounded-full"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.classList.add('bg-primary');
                              e.currentTarget.parentElement!.innerHTML = '<span class="text-white text-xs font-bold">د</span>';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-end">
                  <div className="flex items-start gap-4 max-w-[85%]">
                    <div className="flex-1 bg-neutral-50 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-neutral-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>يكتب...</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-white rounded-full border border-primary/20 flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
                      <img 
                        src="https://cdn.builder.io/api/v1/image/assets%2Ffe102fa1240345669888b6698e27bb27%2F49f3aa3e3a324a28b9e41587038c40c6?format=webp&width=64"
                        alt="دِراسة"
                        className="w-full h-full rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.classList.add('bg-primary');
                          e.currentTarget.parentElement!.innerHTML = '<span class="text-white text-xs font-bold">د</span>';
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area for Messages View */}
            <div className="sticky bottom-0 bg-white border-t border-neutral-100 pt-6 mt-8">
              <div className="bg-white rounded-2xl shadow-md border border-neutral-200 p-4">
                <div className="flex items-center gap-3" dir="rtl">
                  <button
                    aria-label="تسجيل صوتي"
                    className="flex items-center justify-center min-w-[44px] h-12 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <Mic className="w-5 h-5" />
                  </button>

                  <textarea
                    placeholder="اكتب رسالتك هنا..."
                    dir="rtl"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    rows={1}
                    className="flex-1 text-base bg-transparent border-none outline-none placeholder-neutral-400 resize-none py-3 min-h-[44px] max-h-32"
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="flex items-center justify-center min-w-[44px] h-12 rounded-xl bg-primary text-white hover:bg-primary/90 hover:shadow-lg transition-all duration-200 disabled:bg-neutral-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
