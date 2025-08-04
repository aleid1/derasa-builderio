export interface User {
  id: string;
  email?: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  isGuest?: boolean;
  subscriptionTier?: 'free' | 'premium' | 'family';
  preferences?: UserPreferences;
  privacySettings?: PrivacySettings;
}

export interface UserPreferences {
  language?: 'ar' | 'en';
  dialect?: 'saudi' | 'gulf' | 'levantine' | 'egyptian' | 'maghreb';
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  subjects?: string[];
  gradeLevel?: string;
  studyReminders?: boolean;
  darkMode?: boolean;
}

export interface PrivacySettings {
  shareProgress: boolean;
  allowAnalytics: boolean;
  parentNotifications: boolean;
  dataRetention?: 'minimal' | 'standard' | 'extended';
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  imageData?: string;
  timestamp: Date;
  tokens?: number;
  moderated?: boolean;
  moderationFlags?: ModerationFlags;
  metadata?: ChatMessageMetadata;
}

export interface ModerationFlags {
  inappropriate: boolean;
  spam: boolean;
  homework_violation: boolean;
  personal_info: boolean;
  unsafe_content: boolean;
  language_inappropriate: boolean;
  confidence_score: number;
}

export interface ChatMessageMetadata {
  subject?: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  educationalValue?: number;
  responseTime?: number;
  aiModel?: string;
  imageAnalysis?: ImageAnalysisResult;
}

export interface ImageAnalysisResult {
  detectedText?: string;
  mathEquations?: string[];
  diagrams?: string[];
  contentType: 'math' | 'science' | 'language' | 'history' | 'geography' | 'other';
  educationalLevel?: 'elementary' | 'middle' | 'high' | 'university';
  confidence: number;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  subject?: string;
  gradeLevel?: string;
  sessionType: 'homework' | 'explanation' | 'practice' | 'general';
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  metadata?: ChatSessionMetadata;
}

export interface ChatSessionMetadata {
  totalTokens?: number;
  averageResponseTime?: number;
  topicsDiscussed?: string[];
  learningObjectives?: string[];
  parentalSupervision?: boolean;
  timeSpent?: number;
  skillsImproved?: string[];
}

export interface UserProgress {
  userId: string;
  subject: string;
  topic: string;
  skillLevel: number; // 0-100
  masteryScore: number; // 0-100
  timeSpentMinutes: number;
  lastPracticedAt: Date;
  streakDays: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category: 'learning' | 'consistency' | 'improvement' | 'milestone';
}

export interface ParentalControl {
  childUserId: string;
  parentEmail: string;
  dailyLimitMinutes: number;
  allowedSubjects: string[];
  contentLevel: 'elementary' | 'middle' | 'high';
  monitoringEnabled: boolean;
  homeworkHelpOnly: boolean;
  notifications: ParentalNotificationSettings;
}

export interface ParentalNotificationSettings {
  dailyDigest: boolean;
  inappropriateContent: boolean;
  learningMilestones: boolean;
  timeLimit: boolean;
  newSubjects: boolean;
}

export interface ContentModerationResult {
  approved: boolean;
  confidence: number;
  flags: ModerationFlags;
  suggestedAction: 'allow' | 'review' | 'block';
  explanation?: string;
}

export interface SafetyConfig {
  enableParentalControls: boolean;
  enableContentModeration: boolean;
  enableHomeworkDetection: boolean;
  enableCulturalFilter: boolean;
  strictMode: boolean;
  reportingEnabled: boolean;
}

export interface SaudiCurriculumConfig {
  gradeLevel: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  track?: 'general' | 'scientific' | 'literary' | 'technical';
  subjects: SaudiSubject[];
  moeCompliance: boolean;
  vision2030Alignment: boolean;
}

export interface SaudiSubject {
  nameAr: string;
  nameEn: string;
  code: string;
  gradeLevel: string;
  semester: 1 | 2;
  chapters: SaudiChapter[];
  isCore: boolean;
}

export interface SaudiChapter {
  number: number;
  titleAr: string;
  titleEn: string;
  topics: string[];
  learningObjectives: string[];
  assessmentCriteria: string[];
}

export interface LearningAnalytics {
  userId: string;
  sessionStats: SessionStats;
  performanceMetrics: PerformanceMetrics;
  engagementMetrics: EngagementMetrics;
  parentReports?: ParentReport[];
}

export interface SessionStats {
  totalSessions: number;
  totalMessages: number;
  averageSessionLength: number;
  subjectsStudied: string[];
  favoriteSubject: string;
  weeklyHours: number[];
  monthlyProgress: number[];
}

export interface PerformanceMetrics {
  overallProgress: number; // 0-100
  subjectProgress: Record<string, number>;
  skillImprovement: Record<string, number>;
  responseAccuracy: number;
  learningVelocity: number;
  retentionRate: number;
}

export interface EngagementMetrics {
  loginStreak: number;
  questionsAsked: number;
  topicsExplored: number;
  helpfulness: number;
  satisfactionScore: number;
  recommendationLikelihood: number;
}

export interface ParentReport {
  childUserId: string;
  reportDate: Date;
  timeSpent: number;
  subjectsStudied: string[];
  progressSummary: string;
  achievements: Achievement[];
  concerns: string[];
  recommendations: string[];
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  services: ServiceStatus[];
  lastChecked: Date;
  issues: SystemIssue[];
}

export interface ServiceStatus {
  name: string;
  status: 'up' | 'down' | 'slow';
  responseTime?: number;
  lastChecked: Date;
}

export interface SystemIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedUsers?: number;
  estimatedResolution?: Date;
  workaround?: string;
}
