import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, Paperclip, MoreVertical, Sparkles } from "lucide-react";
import { useLocation } from "react-router-dom";
import { ChatMessage, StreamingResponse } from "../lib/chat-types";
import { chatService } from "../lib/chat-service";
import { ChatHistoryService } from "../lib/chat-history";
import { useAuth } from "../lib/auth-context";
import TypingIndicator from "./TypingIndicator";

interface LiveChatInterfaceProps {
  sessionId?: string;
  onNewSession?: (sessionId: string) => void;
}

export default function LiveChatInterface({
  sessionId,
  onNewSession,
}: LiveChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(
    sessionId || "",
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Load initial suggestions
    chatService.getSuggestedQuestions().then(setSuggestions);

    // Create or load session
    if (!currentSessionId) {
      const newSessionId = `session-${user?.id || "guest"}-${Date.now()}`;
      setCurrentSessionId(newSessionId);
      if (onNewSession) onNewSession(newSessionId);
    } else {
      // Load existing messages for this session
      const existingMessages =
        ChatHistoryService.getSessionMessages(currentSessionId);
      setMessages(existingMessages);
    }

    // Handle initial message from navigation
    const state = location.state as { initialMessage?: string };
    if (state?.initialMessage) {
      handleSendMessage(state.initialMessage);
      // Clear the state to prevent resending on re-renders
      window.history.replaceState({}, document.title);
    }
  }, [currentSessionId, user]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    // Save user message to localStorage
    ChatHistoryService.saveMessage(userMessage, currentSessionId);
    setInputValue("");
    setIsLoading(true);

    try {
      // Create streaming assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "",
        role: "assistant",
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Start streaming response
      const stream = await chatService.sendMessage(content, currentSessionId);
      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const response: StreamingResponse = value;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? {
                  ...msg,
                  content: response.content,
                  isStreaming: !response.isComplete,
                }
              : msg,
          ),
        );

        if (response.isComplete) {
          // Save completed assistant message to localStorage
          const completedMessage: ChatMessage = {
            ...assistantMessage,
            content: response.content,
            isStreaming: false,
          };
          ChatHistoryService.saveMessage(completedMessage, currentSessionId);
          setIsLoading(false);
          break;
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);

      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        content: "عذراً، حدث خط�� في الاتصال. يرجى المحاولة مرة أخرى.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      // Save error message to localStorage
      ChatHistoryService.saveMessage(errorMessage, currentSessionId);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Directly send the suggestion as a message
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div
      className="flex flex-col h-full bg-white rounded-3xl shadow-xl overflow-hidden"
      dir="rtl"
    >
      {/* Chat Header */}
      <div className="bg-primary/5 px-6 py-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900">
                🤖 دراسة - صديقك المعلم
              </h3>
              <p className="text-sm text-neutral-500">متصل ومستعد للمساعدة</p>
            </div>
          </div>
          <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-neutral-500" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              مرحباً بك!
            </h3>
            <p className="text-neutral-500 mb-6">
              أنا دراسة، معلمك الذكي. سأساعدك في التعل�� خطوة بخطوة.
            </p>

            {/* Suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto px-4">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-neutral-700 rounded-xl text-xs md:text-sm transition-all duration-300 hover:scale-105 hover:shadow-md border-2 border-transparent hover:border-primary/20 transform-gpu text-center"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Show typing indicator when loading */}
        {isLoading && <TypingIndicator />}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-start" : "justify-end"} mb-4`}
          >
            <div
              className={`flex items-start gap-3 max-w-[80%] ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              {message.role === "assistant" && (
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">د</span>
                </div>
              )}
              {message.role === "user" && (
                <div className="w-8 h-8 bg-gradient-to-br from-neutral-400 to-neutral-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">أ</span>
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`p-4 rounded-2xl shadow-sm ${
                  message.role === "user"
                    ? "bg-primary text-white rounded-br-md"
                    : "bg-white border border-neutral-200 text-neutral-900 rounded-bl-md"
                }`}
              >
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                {message.isStreaming && (
                  <div className="flex items-center mt-2">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <div className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString("ar-SA", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-neutral-200 bg-neutral-50">
        <div className="flex items-center gap-3">
          <button
            className="p-3 text-neutral-400 hover:text-neutral-600 hover:bg-white rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="تسجيل صوتي"
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            className="p-3 text-neutral-400 hover:text-neutral-600 hover:bg-white rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="إرفاق ملف"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="🤔 ما الذي تريد أن تتعلمه اليوم؟"
            className="flex-1 bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            disabled={isLoading}
          />

          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
            className="bg-primary text-white p-3 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="إرسال"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
