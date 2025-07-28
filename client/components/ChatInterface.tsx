import { useState } from "react";
import { Send, Mic, Paperclip, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ChatInterface() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; timestamp: Date }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const handleSendMessage = () => {
    if (inputValue.trim()) {
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
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const suggestions = [
    "اشرح لي مفهوم الجاذبية",
    "ساعدني في حل معادلة رياضية",
    "ما هي قواعد اللغة العربية؟",
    "كيف أتعلم البرمجة؟"
  ];

  return (
    <main className="flex-1 bg-white" dir="rtl">
      <div className="h-full flex flex-col max-w-4xl mx-auto">
        {/* Minimal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h1 className="text-lg font-medium text-gray-900">درّسة</h1>
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-[#2E7D32] rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-lg font-bold">د</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                مرحباً! كيف يمكنني مساعدتك؟
              </h3>
              <p className="text-gray-600 mb-8 max-w-md">
                اسأل أي سؤال أو اطلب المساعدة في أي موضوع تعليمي
              </p>

              {/* Minimal Suggestion Pills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-lg">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(suggestion)}
                    className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors border border-gray-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {messages.map((message, index) => (
                <div key={index} className="space-y-2">
                  <div className={`flex ${message.isUser ? 'justify-start' : 'justify-end'}`}>
                    <div className="flex items-start gap-3 max-w-[80%]">
                      {message.isUser && (
                        <div className="w-6 h-6 bg-[#2E7D32] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-xs font-bold">أ</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-gray-900 leading-relaxed">{message.text}</p>
                      </div>
                      {!message.isUser && (
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-gray-600 text-xs font-bold">د</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Minimal Input Area */}
        <div className="p-4 border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="اكتب رسالتك هنا..."
                  dir="rtl"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2E7D32] focus:border-[#2E7D32] resize-none"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="p-3 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
