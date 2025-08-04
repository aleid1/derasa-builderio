import express from "express";
import cors from "cors";
import { OpenAI } from "openai";

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize OpenAI (optional - will fallback gracefully if not configured)
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Simple rate limiting (in-memory for development)
const requestCounts = new Map<string, number[]>();

const rateLimit = (maxRequests: number, windowMs: number) => {
  return (req: any, res: any, next: any) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }
    
    const requests = requestCounts.get(ip)!;
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    
    validRequests.push(now);
    requestCounts.set(ip, validRequests);
    next();
  };
};

// Enhanced system prompt for Saudi educational context
const createSystemPrompt = () => {
  return `أنت "دراسة"، معلم ذكي متخصص في التعليم السعودي. مهمتك مساعدة الطلاب في التعلم وفق منهج المملكة العربية السعودية ورؤية 2030.

القواعد الأساسية:
1. **التعليم التدريجي**: لا تعطِ الإجابات مباشرة، بل وجه الطلاب خطوة بخطوة للوصول للحل
2. **المحتوى الآمن**: تأكد من أن كل المحتوى مناسب للأعمار ويتماشى مع القيم الإسلامية
3. **اللغة العربية الفصحى**: استخدم العربية الواضحة مع بعض التعابير السعودية المناسبة
4. **احترام الخصوصية**: لا تطلب معلومات شخصية أو حساسة
5. **التعلم النشط**: شجع الطلاب على التفكير والمشاركة
6. **تجنب LaTeX**: استخدم الرموز الرياضية النصية العادية بدلاً من LaTeX

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

التعبيرات الرياضية:
- استخدم الرموز النصية: + - × ÷ = ² ³ √
- مثال: "إذن الجواب هو: 2 + 3 = 5"
- تجنب: $latex$ أو \\( \\) أو [math]

المواضيع المحظورة:
- المحتوى غير المناسب للأعمار
- المعلومات الشخصية الحساسة
- الموضوعات المثيرة للجدل
- حل الواجبات كاملة دون تعليم`;
};

// Basic content moderation
const moderateContent = (content: string): boolean => {
  const inappropriatePatterns = [
    /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/, // Credit card
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b\d{10}\b/, // Phone number
  ];
  
  return !inappropriatePatterns.some(pattern => pattern.test(content));
};

// Chat endpoint
app.post('/api/chat', rateLimit(10, 60000), async (req, res) => {
  try {
    const { message, imageBlob } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (message.length > 4000) {
      return res.status(400).json({ error: 'الرسالة طويلة جداً. يرجى تقصيرها.' });
    }

    // Content moderation
    if (!moderateContent(message)) {
      return res.status(400).json({ 
        error: 'المحتوى غير مناسب. يرجى إعادة صياغة رسالتك بطريقة مهذبة وتعليمية.' 
      });
    }

    // Check if OpenAI is available
    if (!openai) {
      return res.status(500).json({ 
        error: 'خدمة الذكاء الاصطناعي غير متاحة حالياً. يرجى إعداد مفتاح OpenAI API.' 
      });
    }

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system' as const,
        content: createSystemPrompt()
      }
    ];

    // Add user message with or without image
    if (imageBlob) {
      messages.push({
        role: 'user' as const,
        content: [
          {
            type: 'text' as const,
            text: message,
          },
          {
            type: 'image_url' as const,
            image_url: {
              url: `data:image/jpeg;base64,${imageBlob}`,
            },
          },
        ],
      });
    } else {
      messages.push({
        role: 'user' as const,
        content: message,
      });
    }

    // Get AI response with streaming
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: true,
    });

    // Set up streaming response
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(content);
      }
    }

    res.end();

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'حدث خطأ في الخدمة. يرجى المحاولة مرة أخرى.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    openai: openai ? 'configured' : 'not configured'
  });
});

// Demo endpoint
app.get('/api/demo', (req, res) => {
  res.json({ message: 'Hello from the demo endpoint!' });
});

// Ping endpoint
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

export { app };

export function createServer() {
  return app;
}
