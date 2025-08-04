import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import LiveChatInterface from "../components/LiveChatInterface";
import ChatSidebar from "../components/ChatSidebar";
import { useAuth } from "../lib/auth-context";

export default function Chat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Get session ID from URL params
    const sessionId = searchParams.get('sessionId');
    if (sessionId) {
      setCurrentSessionId(sessionId);
    }
  }, [searchParams]);

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setSearchParams({ sessionId });
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  const handleNewChat = () => {
    const newSessionId = `session-${user?.id || 'guest'}-${Date.now()}`;
    setCurrentSessionId(newSessionId);
    setSearchParams({ sessionId: newSessionId });
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  const handleNewSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setSearchParams({ sessionId });
  };

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navigation />

      <main className="flex-1 bg-neutral-50 flex" dir="rtl">
        {/* Chat Sidebar - only for authenticated users */}
        {isAuthenticated && (
          <ChatSidebar
            currentSessionId={currentSessionId}
            onSelectSession={handleSelectSession}
            onNewChat={handleNewChat}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className={`flex-1 ${isAuthenticated ? 'px-4 md:px-6' : 'max-w-6xl mx-auto px-6'} py-8`}>
            <div className="h-[calc(100vh-12rem)]">
              <LiveChatInterface
                sessionId={currentSessionId}
                onNewSession={handleNewSession}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
