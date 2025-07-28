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
    <main className="flex-1 bg-tutory-sidebar" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              محادثة جديدة مع درّسة
            </h1>
            <p className="text-gray-600">
              اسأل أي سؤال واحصل على إجابات مفصلة وشروحات واضحة
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home className="w-4 h-4" />
            العودة للرئيسية
          </button>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Messages Area */}
          <div className="h-96 p-6 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-[#2E7D32] rounded-full flex items-center justify-center mb-6">
                  <span className="text-white text-2xl font-bold">د</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  مرحباً! أنا درّسة، معلمك الشخصي الذكي
                </h3>
                <p className="text-gray-600 mb-6">
                  اسأل أي سؤال أو اطلب المساعدة في أي موضوع تعليمي
                </p>
                
                {/* Suggestion Pills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(suggestion)}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.isUser ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                        message.isUser
                          ? 'bg-[#2E7D32] text-white'
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="leading-relaxed">{message.text}</p>
                      <span className={`text-xs mt-1 block ${
                        message.isUser ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString('ar-SA', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex items-center gap-3">
              {/* Microphone Button */}
              <button className="flex items-center justify-center w-12 h-12 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <Mic className="w-5 h-5" />
              </button>

              {/* Attach Button */}
              <button className="flex items-center justify-center w-12 h-12 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                placeholder="اكتب سؤالك هنا…"
                dir="rtl"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-lg bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
              />

              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#2E7D32] text-white hover:bg-[#1B5E20] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">نصائح للحصول على أفضل النتائج</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">كن محددًا</h4>
                <p className="text-sm text-gray-600">اطرح أسئلة واضحة ومحددة للحصول على إجابات دقيقة</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">اطلب أمثلة</h4>
                <p className="text-sm text-gray-600">لا تتردد في طلب أمثلة وتطبيقات عملية</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">اطلب التوضيح</h4>
                <p className="text-sm text-gray-600">إذا لم تفهم شيئًا، اطلب مني توضيحه بطريقة أخرى</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
