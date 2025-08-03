import React, { useState, useEffect } from 'react';
import { Plus, MessageCircle, Trash2, Calendar, Edit3, X, Menu } from 'lucide-react';
import { ChatHistoryService, ChatSession } from '../lib/chat-history';
import { useAuth } from '../lib/auth-context';

interface ChatSidebarProps {
  currentSessionId?: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ChatSidebar({ 
  currentSessionId, 
  onSelectSession, 
  onNewChat,
  isOpen,
  onToggle 
}: ChatSidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    try {
      const chatSessions = ChatHistoryService.getSessions();
      setSessions(chatSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    ChatHistoryService.deleteSession(sessionId);
    loadSessions(); // Reload sessions
    // If deleted session was current, start new chat
    if (sessionId === currentSessionId) {
      onNewChat();
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'اليوم';
    if (diffDays === 2) return 'أمس';
    if (diffDays <= 7) return `منذ ${diffDays} أيام`;
    return date.toLocaleDateString('ar-SA');
  };

  const groupSessionsByDate = (sessions: ChatSession[]) => {
    const groups: { [key: string]: ChatSession[] } = {};
    
    sessions.forEach(session => {
      const date = formatDate(session.updatedAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(session);
    });

    return groups;
  };

  const groupedSessions = groupSessionsByDate(sessions);

  // Don't show sidebar for guest users
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-lg border border-neutral-200"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full bg-neutral-50 border-l border-neutral-200 z-50 transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:z-auto
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        w-80 md:w-64 lg:w-80
      `} dir="rtl">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 bg-white">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">محادثة جديدة</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 text-sm">لا توجد محادثات سابقة</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedSessions).map(([date, dateSessions]) => (
                <div key={date}>
                  <h3 className="text-xs font-medium text-neutral-500 mb-2 px-2">
                    {date}
                  </h3>
                  <div className="space-y-1">
                    {dateSessions.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => onSelectSession(session.id)}
                        className={`
                          group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                          ${session.id === currentSessionId 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'hover:bg-white hover:shadow-sm'
                          }
                        `}
                      >
                        <MessageCircle className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-neutral-900 truncate">
                            {session.title}
                          </h4>
                          <p className="text-xs text-neutral-500">
                            {session.messageCount} رسالة
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDeleteSession(session.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500 transition-all"
                          title="حذف المحادثة"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-white">
          <div className="text-xs text-neutral-400 text-center">
            <span>{sessions.length} محادثة محفوظة</span>
          </div>
        </div>
      </div>
    </>
  );
}
