import React, { useState, useEffect } from 'react';
import { ParentalControl, ParentReport, User } from '../lib/chat-types';
import { supabase } from '../lib/supabase';
import { hasSupabase } from '../lib/env';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Shield, 
  Clock, 
  BookOpen, 
  Bell, 
  Eye, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Timer,
  Mail
} from 'lucide-react';
import { toast } from '../hooks/use-toast';

interface ParentalControlDashboardProps {
  childUserId: string;
  parentEmail: string;
}

export default function ParentalControlDashboard({ 
  childUserId, 
  parentEmail 
}: ParentalControlDashboardProps) {
  const [controls, setControls] = useState<ParentalControl | null>(null);
  const [childProfile, setChildProfile] = useState<User | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<ParentReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadParentalControls();
    loadChildProfile();
    loadWeeklyReport();
  }, [childUserId]);

  const loadParentalControls = async () => {
    try {
      if (!hasSupabase || !supabase) {
        // Mock data for development without Supabase
        const mockControls: ParentalControl = {
          childUserId,
          parentEmail,
          dailyLimitMinutes: 60,
          allowedSubjects: ['الرياضيات', 'العلوم', 'اللغة العربية', 'الإنجليزية'],
          contentLevel: 'middle',
          monitoringEnabled: true,
          homeworkHelpOnly: false,
          notifications: {
            dailyDigest: true,
            inappropriateContent: true,
            learningMilestones: true,
            timeLimit: true,
            newSubjects: false,
          }
        };
        setControls(mockControls);
        return;
      }

      const { data, error } = await supabase
        .from('parental_controls')
        .select('*')
        .eq('child_user_id', childUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setControls(data);
      } else {
        // Create default parental controls
        const defaultControls: Partial<ParentalControl> = {
          childUserId,
          parentEmail,
          dailyLimitMinutes: 60,
          allowedSubjects: ['الرياضيات', 'العلوم', 'اللغة العربية', 'الإنجليزية'],
          contentLevel: 'middle',
          monitoringEnabled: true,
          homeworkHelpOnly: false,
          notifications: {
            dailyDigest: true,
            inappropriateContent: true,
            learningMilestones: true,
            timeLimit: true,
            newSubjects: false,
          }
        };

        const { data: created, error: createError } = await supabase
          .from('parental_controls')
          .insert(defaultControls)
          .select()
          .single();

        if (createError) throw createError;
        setControls(created);
      }
    } catch (error) {
      console.error('Error loading parental controls:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل إعدادات الرقابة الأبوية",
        variant: "destructive",
      });
    }
  };

  const loadChildProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', childUserId)
        .single();

      if (error) throw error;
      setChildProfile(data);
    } catch (error) {
      console.error('Error loading child profile:', error);
    }
  };

  const loadWeeklyReport = async () => {
    try {
      // Get user stats and activity for the past week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: sessions, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('*, chat_messages(*)')
        .eq('user_id', childUserId)
        .gte('created_at', oneWeekAgo.toISOString());

      if (sessionsError) throw sessionsError;

      const totalTime = sessions?.reduce((acc, session) => {
        const sessionStart = new Date(session.created_at);
        const sessionEnd = new Date(session.updated_at);
        return acc + (sessionEnd.getTime() - sessionStart.getTime()) / (1000 * 60); // minutes
      }, 0) || 0;

      const subjectsStudied = [...new Set(sessions?.map(s => s.subject).filter(Boolean) || [])];
      
      const report: ParentReport = {
        childUserId,
        reportDate: new Date(),
        timeSpent: Math.round(totalTime),
        subjectsStudied,
        progressSummary: `درس طفلك ${subjectsStudied.length} مواد دراسية هذا الأسبوع`,
        achievements: [], // Would be populated from actual achievements
        concerns: [],
        recommendations: [
          'شجع طفلك على طرح المزيد من الأسئلة',
          'راقب وقت الشاشة المستخدم في التعلم'
        ]
      };

      setWeeklyReport(report);
    } catch (error) {
      console.error('Error loading weekly report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateControls = async (updates: Partial<ParentalControl>) => {
    if (!controls) return;

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('parental_controls')
        .update(updates)
        .eq('id', controls.id)
        .select()
        .single();

      if (error) throw error;
      
      setControls(data);
      toast({
        title: "تم الحفظ",
        description: "تم تحديث إعدادات الرقابة الأبوية بنجاح",
      });
    } catch (error) {
      console.error('Error updating controls:', error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ التغييرات",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const sendConsentEmail = async () => {
    try {
      // This would integrate with an email service
      toast({
        title: "تم إرسال البريد",
        description: "تم إرسال رابط الموافقة على البريد الإلكتروني",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إرسال البريد الإلكتروني",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!controls) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">غير متاح</h3>
        <p className="text-gray-600">إعدادات الرقابة الأبوية غير متاحة</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الرقابة الأبوية</h1>
          <p className="text-gray-600">إدارة وقت التعلم والمحتوى لطفلك</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-green-500" />
          <span className="text-sm text-green-600 font-medium">نشط ومحمي</span>
        </div>
      </div>

      {/* Child Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            معلومات ال��فل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>الاسم</Label>
              <p className="font-medium">{childProfile?.name}</p>
            </div>
            <div>
              <Label>البريد الإلكتروني</Label>
              <p className="text-sm text-gray-600">{childProfile?.email}</p>
            </div>
            <div>
              <Label>تاريخ التسجيل</Label>
              <p className="text-sm text-gray-600">
                {childProfile?.createdAt ? new Date(childProfile.createdAt).toLocaleDateString('ar-SA') : '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="controls" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="controls">إعدادات التحكم</TabsTrigger>
          <TabsTrigger value="monitoring">المراقبة</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        <TabsContent value="controls" className="space-y-6">
          {/* Time Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                إدارة الوقت
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="daily-limit">الحد الأقصى اليومي (بالدقائق)</Label>
                <Input
                  id="daily-limit"
                  type="number"
                  value={controls.dailyLimitMinutes}
                  onChange={(e) => updateControls({ dailyLimitMinutes: parseInt(e.target.value) })}
                  min="15"
                  max="480"
                  step="15"
                />
                <p className="text-sm text-gray-500 mt-1">
                  من 15 دقيقة إلى 8 ساعات يومياً
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                إعدادات المحتوى
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>مستوى المحتوى</Label>
                <Select
                  value={controls.contentLevel}
                  onValueChange={(value: 'elementary' | 'middle' | 'high') => 
                    updateControls({ contentLevel: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elementary">المرحلة الابتدائية</SelectItem>
                    <SelectItem value="middle">المرحلة المتوسطة</SelectItem>
                    <SelectItem value="high">المرحلة الثانوية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>مساعدة الواجبات فقط</Label>
                  <p className="text-sm text-gray-500">
                    السماح بطلب المساعدة في الواجبات المدرسية فقط
                  </p>
                </div>
                <Switch
                  checked={controls.homeworkHelpOnly}
                  onCheckedChange={(checked) => updateControls({ homeworkHelpOnly: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Safety & Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                الأمان والمراقبة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>تفعيل المراقبة</Label>
                  <p className="text-sm text-gray-500">
                    مراقبة المحادثات والنشاطات للتأكد من السلامة
                  </p>
                </div>
                <Switch
                  checked={controls.monitoringEnabled}
                  onCheckedChange={(checked) => updateControls({ monitoringEnabled: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                إعدادات التنبيهات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>التقرير اليومي</Label>
                    <p className="text-sm text-gray-500">ملخص يومي لنشاط التعلم</p>
                  </div>
                  <Switch
                    checked={controls.notifications.dailyDigest}
                    onCheckedChange={(checked) => 
                      updateControls({ 
                        notifications: { ...controls.notifications, dailyDigest: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>تنبيهات المحتوى غير المناسب</Label>
                    <p className="text-sm text-gray-500">إشعار فوري عند اكتشاف محتوى مشكوك فيه</p>
                  </div>
                  <Switch
                    checked={controls.notifications.inappropriateContent}
                    onCheckedChange={(checked) => 
                      updateControls({ 
                        notifications: { ...controls.notifications, inappropriateContent: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>إنجازات التعلم</Label>
                    <p className="text-sm text-gray-500">تنبيه عند تحقيق إنجازات تعليمية</p>
                  </div>
                  <Switch
                    checked={controls.notifications.learningMilestones}
                    onCheckedChange={(checked) => 
                      updateControls({ 
                        notifications: { ...controls.notifications, learningMilestones: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>تجاوز الحد الزمني</Label>
                    <p className="text-sm text-gray-500">تنبيه عند الاقتراب من الحد الزمني اليومي</p>
                  </div>
                  <Switch
                    checked={controls.notifications.timeLimit}
                    onCheckedChange={(checked) => 
                      updateControls({ 
                        notifications: { ...controls.notifications, timeLimit: checked }
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* COPPA Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                الامتثال القانوني
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">موافقة ولي الأمر</h4>
                <p className="text-sm text-blue-700 mb-3">
                  وفقاً لقانون حماية خصوصية الأطفال على الإنترنت (COPPA)، يتطلب استخدام الأطفال تحت سن 13 موافقة ولي الأمر.
                </p>
                <Button onClick={sendConsentEmail} size="sm" variant="outline">
                  <Mail className="w-4 h-4 ml-2" />
                  إرسال نموذج الموافقة
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Weekly Summary */}
          {weeklyReport && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  تقرير الأسبوع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                      <Timer className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{weeklyReport.timeSpent}</h3>
                    <p className="text-sm text-gray-600">دقيقة من التعلم</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                      <BookOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{weeklyReport.subjectsStudied.length}</h3>
                    <p className="text-sm text-gray-600">مادة دراسية</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{weeklyReport.achievements.length}</h3>
                    <p className="text-sm text-gray-600">إنجاز جديد</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-2">المواد المدروسة</h4>
                  <div className="flex flex-wrap gap-2">
                    {weeklyReport.subjectsStudied.map((subject, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">التوصيات</h4>
                  <ul className="space-y-1">
                    {weeklyReport.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={() => updateControls({})} disabled={isSaving}>
          {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </div>
    </div>
  );
}
