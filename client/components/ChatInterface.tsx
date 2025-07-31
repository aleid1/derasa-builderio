import { useState } from "react";
import { Send, Home, Loader2 } from "lucide-react";
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
    "اشرح لي دورة الم��ء في الطبيعة",
    "ما هو الذكاء الاصطناعي؟"
  ];

  return (
    <main className="flex-1 bg-white" dir="rtl">
      <div className="h-full flex flex-col max-w-4xl mx-auto">
        {/* Minimal Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h1 className="text-xl font-semibold text-neutral-900">دِراسة</h1>
          <button
            onClick={() => navigate('/')}
            className="text-neutral-500 hover:text-neutral-700 p-3 rounded-xl hover:bg-neutral-100 transition-all duration-200 min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="العودة للرئيسية"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              {/* AI Avatar */}
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-lg border-2 border-primary/20 overflow-hidden">
                <img
                  src="https://cdn.builder.io/o/assets%2Ffe102fa1240345669888b6698e27bb27%2Faa3eda9e914344cc8a33219d964a7f55?alt=media&token=eb821ec4-72b0-4916-900e-ee69e0bb184c&apiKey=fe102fa1240345669888b6698e27bb27"
                  alt="دِراسة AI"
                  className="w-20 h-20 rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement.classList.add('bg-primary');
                    e.currentTarget.parentElement.innerHTML = '<span class="text-white text-2xl font-bold">د</span>';
                  }}
                />
              </div>
              
              {/* Welcome Message */}
              <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
                ابدأ بطرح أي سؤال…
              </h3>
              <p className="text-lg text-neutral-500 mb-12 max-w-md leading-relaxed">
                أنا هنا لمساعدتك في تعلم أي موضوع تريده. اسأل واحصل على إجابات مفصلة وواضحة
              </p>
              
              {/* Horizontal Scrolling Suggestion Pills */}
              <div className="w-full max-w-2xl relative">
                <div 
                  className="overflow-x-auto scrollbar-hide pb-4"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  <div className="flex gap-3 px-4 min-w-max">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setInputValue(suggestion)}
                        className="px-5 py-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-300 rounded-full text-neutral-700 transition-all duration-200 font-medium whitespace-nowrap min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary hover:shadow-md"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Fade out edges */}
                <div className="absolute left-0 top-0 bottom-4 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-4 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
              </div>
            </div>
          ) : (
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
                        <p className="text-neutral-900 leading-relaxed text-lg">{message.text}</p>
                      </div>
                      {!message.isUser && (
                        <div className="w-8 h-8 bg-white rounded-full border border-primary/20 flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
                          <img
                            src="https://cdn.builder.io/o/assets%2Ffe102fa1240345669888b6698e27bb27%2Faa3eda9e914344cc8a33219d964a7f55?alt=media&token=eb821ec4-72b0-4916-900e-ee69e0bb184c&apiKey=fe102fa1240345669888b6698e27bb27"
                            alt="دِراسة"
                            className="w-full h-full rounded-full"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement.classList.add('bg-primary');
                              e.currentTarget.parentElement.innerHTML = '<span class="text-white text-xs font-bold">د</span>';
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
                        <span>��كتب...</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-white rounded-full border border-primary/20 flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
                      <img
                        src="https://cdn.builder.io/o/assets%2Ffe102fa1240345669888b6698e27bb27%2Faa3eda9e914344cc8a33219d964a7f55?alt=media&token=eb821ec4-72b0-4916-900e-ee69e0bb184c&apiKey=fe102fa1240345669888b6698e27bb27"
                        alt="دِراسة"
                        className="w-full h-full rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement.classList.add('bg-primary');
                          e.currentTarget.parentElement.innerHTML = '<span class="text-white text-xs font-bold">د</span>';
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-neutral-100">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  placeholder="اكتب رسالتك هنا..."
                  dir="rtl"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  rows={1}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none text-lg disabled:bg-neutral-50 disabled:text-neutral-400 min-h-[52px]"
                  style={{ 
                    maxHeight: '120px',
                    minHeight: '52px'
                  }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="min-w-[52px] h-[52px] bg-primary text-white rounded-xl hover:bg-primary/90 hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:bg-neutral-300 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center"
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
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}
