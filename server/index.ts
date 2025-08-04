import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import Joi from "joi";
import jwt from "jsonwebtoken";
import crypto from "crypto-js";
import { OpenAI } from "openai";
import { createClient } from '@supabase/supabase-js';
import * as Sentry from "@sentry/node";
import { Database } from '../client/lib/supabase';

// Initialize Sentry for error tracking
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
  });
}

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.openai.com", process.env.SUPABASE_URL || ""].filter(Boolean),
    },
  },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://www.yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 chat requests per minute
  message: 'Chat rate limit exceeded. Please wait before sending another message.',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
});

app.use('/api/', generalLimiter);
app.use('/api/chat', chatLimiter);
app.use('/api/auth', authLimiter);

// Initialize services with secure configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Validation schemas
const chatMessageSchema = Joi.object({
  content: Joi.string().required().max(4000),
  sessionId: Joi.string().uuid().required(),
  imageData: Joi.string().optional(),
  subject: Joi.string().optional(),
  gradeLevel: Joi.string().optional(),
});

const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().required().max(100),
  birthDate: Joi.date().optional(),
  parentEmail: Joi.string().email().optional(),
});

// Authentication middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (error) {
    Sentry.captureException(error);
    return res.status(403).json({ error: 'Token verification failed' });
  }
};

// Content moderation middleware
const moderateContent = async (content: string, userId: string) => {
  try {
    // OpenAI moderation
    const moderation = await openai.moderations.create({
      input: content,
    });

    const result = moderation.results[0];
    
    // Custom Saudi/Islamic content guidelines
    const saudiModerationChecks = {
      inappropriate_cultural: checkCulturalAppropriatenessSaudi(content),
      homework_violation: checkHomeworkViolation(content),
      personal_info: checkPersonalInformation(content),
      educational_value: assessEducationalValue(content),
    };

    const moderationResult = {
      approved: !result.flagged && saudiModerationChecks.inappropriate_cultural && 
                !saudiModerationChecks.homework_violation && !saudiModerationChecks.personal_info,
      confidence: result.categories ? Object.values(result.categories).some(v => v) ? 0.9 : 0.1 : 0.5,
      flags: {
        inappropriate: result.flagged,
        spam: result.categories?.spam || false,
        homework_violation: saudiModerationChecks.homework_violation,
        personal_info: saudiModerationChecks.personal_info,
        unsafe_content: result.categories?.["hate/threatening"] || result.categories?.violence || false,
        language_inappropriate: !saudiModerationChecks.inappropriate_cultural,
        confidence_score: result.categories ? Math.max(...Object.values(result.category_scores || {})) : 0,
      }
    };

    // Log moderation result
    await supabaseAdmin.from('content_moderation_logs').insert({
      user_id: userId,
      content: content.substring(0, 500), // Store first 500 chars
      moderation_result: moderationResult,
      action_taken: moderationResult.approved ? 'approved' : 'flagged',
    });

    return moderationResult;
  } catch (error) {
    Sentry.captureException(error);
    // Default to block if moderation fails
    return {
      approved: false,
      confidence: 0,
      flags: { inappropriate: true, confidence_score: 1 }
    };
  }
};

// Saudi-specific content checks
const checkCulturalAppropriatenessSaudi = (content: string): boolean => {
  const inappropriatePatterns = [
    /dating|girlfriend|boyfriend/i,
    /alcohol|drinking|party/i,
    /inappropriate religious content patterns/i,
  ];
  
  return !inappropriatePatterns.some(pattern => pattern.test(content));
};

const checkHomeworkViolation = (content: string): boolean => {
  const homeworkPatterns = [
    /solve this for me|give me the answer|do my homework/i,
    /what is the answer to|tell me the solution/i,
  ];
  
  return homeworkPatterns.some(pattern => pattern.test(content));
};

const checkPersonalInformation = (content: string): boolean => {
  const personalInfoPatterns = [
    /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/, // Credit card
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b\d{10}\b/, // Phone number
    /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // Email
  ];
  
  return personalInfoPatterns.some(pattern => pattern.test(content));
};

const assessEducationalValue = (content: string): number => {
  const educationalKeywords = ['explain', 'how', 'why', 'what', 'learn', 'understand', 'help'];
  const matches = educationalKeywords.filter(keyword => 
    content.toLowerCase().includes(keyword)
  ).length;
  
  return Math.min(matches / educationalKeywords.length, 1) * 100;
};

// Enhanced system prompt for Saudi educational context
const createSystemPrompt = (userProfile: any) => {
  const basePrompt = `أنت "دراسة"، معلم ذكي متخصص في التعليم السعودي. مهمتك مساعدة الطلاب في التعلم وفق منهج المملكة العربية السعودية ورؤية 2030.

القواعد الأساسية:
1. **التعليم التدريجي**: لا تعطِ الإجابات مباشرة، بل وجه الطلاب خطوة بخطوة للوصول للحل
2. **المحتوى الآمن**: تأكد من أن كل المحتوى مناسب للأعمار ويتماشى مع القيم الإسلامية
3. **اللغة العربية الفصحى**: استخدم العربية الواضحة مع بعض التعابير السعودية المناسبة
4. **احترام الخصوصية**: لا تطلب معلومات شخصية أو حساسة
5. **التعلم النشط**: شجع الطلاب على التفكير والمشاركة

المنهج السعودي:
- اتبع معايير وزارة التعليم السعودية
- ادعم أهداف رؤية 2030 التعليمية
- استخدم أمثلة من البيئة السعودية
- احترم الثقافة والتقاليد المحلية

أسلوب التعامل:
- كن صبوراً ومشجعاً
- استخدم أمثلة عملية وواضحة  
- اطرح أسئلة توجيهية
- قدم التغذية الراجعة الإيجابية

المواضيع المحظورة:
- المحتوى غير المناسب للأعمار
- المعلومات الشخصية الحساسة
- الموضوعات المثيرة للجدل
- حل الواجبات كاملة دون تعليم`;

  // Add user-specific context
  if (userProfile?.grade_level) {
    return basePrompt + `\n\nمستوى الطالب: ${userProfile.grade_level}`;
  }
  
  return basePrompt;
};

// API Routes
app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { error, value } = chatMessageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { content, sessionId, imageData, subject, gradeLevel } = value;
    const userId = req.user.id;

    // Content moderation
    const moderationResult = await moderateContent(content, userId);
    if (!moderationResult.approved) {
      return res.status(400).json({ 
        error: 'المحتوى غير مناسب. يرجى إعادة صياغة رسالتك بطريقة مهذبة وتعليمية.',
        moderationFlags: moderationResult.flags 
      });
    }

    // Get user profile for personalized responses
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    // Check parental controls for minors
    if (userProfile?.birth_date) {
      const age = new Date().getFullYear() - new Date(userProfile.birth_date).getFullYear();
      if (age < 18) {
        const { data: parentalControls } = await supabaseAdmin
          .from('parental_controls')
          .select('*')
          .eq('child_user_id', userId)
          .single();

        if (parentalControls?.homework_help_only && !isEducationalQuery(content)) {
          return res.status(403).json({ 
            error: 'وفقاً لإعدادات الرقابة الأبوية، يمكنك فقط طلب المساعدة في الواجبات المدرسية.' 
          });
        }
      }
    }

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system' as const,
        content: createSystemPrompt(userProfile)
      },
      {
        role: 'user' as const,
        content: imageData ? [
          { type: 'text' as const, text: content },
          { 
            type: 'image_url' as const, 
            image_url: { url: `data:image/jpeg;base64,${imageData}` }
          }
        ] : content
      }
    ];

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: true,
    });

    // Set up streaming response
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    let fullResponse = '';
    let tokenCount = 0;

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        tokenCount += 1; // Rough estimate
        res.write(content);
      }
    }

    res.end();

    // Save message to database
    const messageId = crypto.lib.WordArray.random(16).toString();
    await supabaseAdmin.from('chat_messages').insert([
      {
        id: messageId,
        session_id: sessionId,
        user_id: userId,
        role: 'user',
        content,
        image_data: imageData,
        moderated: true,
        moderation_flags: moderationResult.flags,
      },
      {
        id: crypto.lib.WordArray.random(16).toString(),
        session_id: sessionId,
        user_id: userId,
        role: 'assistant',
        content: fullResponse,
        tokens_used: tokenCount,
        moderated: true,
      }
    ]);

    // Update session
    await supabaseAdmin
      .from('chat_sessions')
      .update({ 
        updated_at: new Date().toISOString(),
        metadata: { 
          subject,
          grade_level: gradeLevel,
          last_message_tokens: tokenCount 
        }
      })
      .eq('id', sessionId);

  } catch (error) {
    Sentry.captureException(error);
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'حدث خطأ في الخدمة. يرجى المحاولة مرة أخرى.' });
  }
});

// User registration with COPPA compliance
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { error, value } = userRegistrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password, name, birthDate, parentEmail } = value;

    // Check age for COPPA compliance
    if (birthDate) {
      const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
      if (age < 13 && !parentEmail) {
        return res.status(400).json({ 
          error: 'يجب موافقة ولي الأمر للطلاب أقل من 13 سنة.' 
        });
      }
    }

    // Create user account
    const { data, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, birth_date: birthDate, parent_email: parentEmail }
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    res.json({ 
      message: 'تم إنشاء الحساب بنجاح',
      requiresParentalConsent: birthDate ? new Date().getFullYear() - new Date(birthDate).getFullYear() < 18 : false
    });

  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'خطأ في إنشاء الحساب' });
  }
});

// Helper functions
const isEducationalQuery = (content: string): boolean => {
  const educationalKeywords = ['شرح', 'كيف', 'لماذا', 'ما هو', 'ساعدني في فهم', 'أريد أن أتعلم'];
  return educationalKeywords.some(keyword => content.includes(keyword));
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      ai: 'connected',
      moderation: 'active'
    }
  });
});

export { app };

export function createServer() {
  return app;
}
