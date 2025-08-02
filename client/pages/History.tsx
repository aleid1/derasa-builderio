import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useAuth } from '../lib/auth-context';
import { ChatHistoryService, ChatSession } from '../lib/chat-history';
import { Clock, MessageCircle, BookOpen, Calculator, Atom, PenTool, Trash2 } from 'lucide-react';



const subjectIcons = {
  'رياضيات': Calculator,
  'علوم': Atom,
  'فيزياء': Atom,
  'كيمياء': Atom,
  'أحياء': Atom,
  'لغة عربية': PenTool,
  'اجتماعيات': BookOpen,
  'لغة إنجليزية': PenTool,
  'دراسات إسلامية': BookOpen,
  'عام': MessageCircle,
  'عام': BookOpen,
};

const subjectColors: Record<string, string> = {
  'رياضيات': 'bg-blue-100 text-blue-700',
  'علوم': 'bg-green-100 text-green-700',
  'فيزياء': 'bg-green-100 text-green-700',
  'كيمياء': 'bg-green-100 text-green-700',
  'أحياء': 'bg-green-100 text-green-700',
  'لغة عربية': 'bg-purple-100 text-purple-700',
  'اجتماعيات': 'bg-orange-100 text-orange-700',
  'لغة إنجليزية': 'bg-indigo-100 text-indigo-700',
  'دراسات إسلامية': 'bg-teal-100 text-teal-700',
  'عام': 'bg-gray-100 text-gray-700',
};

export default function History() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadChatHistory();
  }, [user]);

  const loadChatHistory = async () => {
    if (!user) return;

    try {
      // Load real chat history from localStorage
      const realSessions = ChatHistoryService.getSessions();
      setSessions(realSessions);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'اليوم';
    if (diffDays === 2) return 'أمس';
    if (diffDays <= 7) return `منذ ${diffDays} أيام`;
    return date.toLocaleDateString('ar-SA');
  };

  const handleSessionClick = (sessionId: string) => {
    navigate('/chat', { state: { sessionId } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navigation />
        <main className="flex-1 bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral-500">جاري تحميل المحادثات...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navigation />
      
      <main className="flex-1 bg-neutral-50" dir="rtl">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              📚 محادثاتي
            </h1>
            <p className="text-neutral-600 text-lg">
              مر��جعة جلسات التعلم والمحادثات السابقة مع دراسة
            </p>
          </div>

          {/* Sessions List */}
          {sessions.length === 0 ? (
            <div className="text-center py-16">
              <MessageCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-600 mb-2">
                لا توجد محادثات بعد
              </h3>
              <p className="text-neutral-500 mb-6">
                ابدأ محادثة جديدة مع دراسة لتعلم شيء جديد!
              </p>
              <button
                onClick={() => navigate('/chat')}
                className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors font-medium"
              >
                ابدأ محادثة جديدة
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => {
                const SubjectIcon = subjectIcons[session.subject_area as keyof typeof subjectIcons] || BookOpen;
                const subjectColor = subjectColors[session.subject_area as keyof typeof subjectColors] || subjectColors['عام'];

                return (
                  <div
                    key={session.id}
                    onClick={() => handleSessionClick(session.id)}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Subject Icon */}
                        <div className={`p-3 rounded-xl ${subjectColor}`}>
                          <SubjectIcon className="w-5 h-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-neutral-900 mb-1 truncate">
                            {session.title}
                          </h3>
                          
                          <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                            {session.last_message_preview}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-neutral-500">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              <span>{session.message_count} رسالة</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(session.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Continue indicator */}
                      <div className="text-primary mr-4">
                        <svg className="w-5 h-5 transform rotate-180" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* New Chat Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/chat')}
              className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors font-medium text-lg"
            >
              + محادثة جديدة
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
