import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { useAuth } from "../lib/auth-context";
import { ChatHistoryService } from "../lib/chat-history";
import {
  BarChart3,
  MessageCircle,
  BookOpen,
  Trophy,
  Target,
  Calendar,
} from "lucide-react";

interface UserStats {
  totalSessions: number;
  totalMessages: number;
  subjectsLearned: number;
  sessionsToday: number;
  subjects: string[];
  favoriteSubject: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadUserStats();
  }, [user]);

  const loadUserStats = async () => {
    if (!user) return;

    try {
      // Mock stats for MVP - will be replaced with real data
      // Load real statistics from ChatHistoryService
      const realStats = ChatHistoryService.getUserStats();

      const stats: UserStats = {
        totalSessions: realStats.totalSessions,
        totalMessages: realStats.totalMessages,
        subjectsLearned: realStats.subjectsLearned,
        sessionsToday: realStats.sessionsToday,
        subjects: realStats.subjects,
        favoriteSubject: realStats.subjects[0] || "عام",
      };

      setStats(stats);
    } catch (error) {
      console.error("Error loading user stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navigation />
        <main className="flex-1 bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral-500">جاري تحميل البيانات...</p>
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
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
              مرحباً، {user?.name}! 👋
            </h1>
            <p className="text-neutral-600 text-lg">
              تابع تقدمك في التعلم مع دراسة
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Sessions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-neutral-900">
                    {stats?.totalSessions}
                  </p>
                  <p className="text-neutral-600 text-sm">جلسة تعلم</p>
                </div>
              </div>
            </div>

            {/* Total Messages */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-neutral-900">
                    {stats?.totalMessages}
                  </p>
                  <p className="text-neutral-600 text-sm">رسالة</p>
                </div>
              </div>
            </div>

            {/* Subjects Learned */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-neutral-900">
                    {stats?.subjectsLearned.length}
                  </p>
                  <p className="text-neutral-600 text-sm">مادة دراسية</p>
                </div>
              </div>
            </div>

            {/* Streak Days */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <Trophy className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-neutral-900">
                    {stats?.streakDays}
                  </p>
                  <p className="text-neutral-600 text-sm">يوم متتالي</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Subjects Learned */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                المواد التي تدرسها
              </h3>
              <div className="space-y-3">
                {stats?.subjectsLearned.map((subject, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl"
                  >
                    <span className="font-medium text-neutral-700">
                      {subject}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-neutral-500">نشط</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                النشاط الأخير
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-neutral-700">جلسة رياضيات</p>
                    <p className="text-sm text-neutral-500">منذ ساعتين</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-neutral-700">شرح علوم</p>
                    <p className="text-sm text-neutral-500">أمس</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-neutral-700">قواعد لغة</p>
                    <p className="text-sm text-neutral-500">منذ يومين</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="inline-flex gap-4">
              <button
                onClick={() => (window.location.href = "/chat")}
                className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors font-medium text-lg"
              >
                ابدأ جلسة جديدة
              </button>
              <button
                onClick={() => (window.location.href = "/history")}
                className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-xl hover:bg-primary/5 transition-colors font-medium text-lg"
              >
                عرض المحادثات
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
