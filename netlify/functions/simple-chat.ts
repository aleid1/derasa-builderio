import { Handler } from '@netlify/functions';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../client/lib/supabase';

// Initialize OpenAI with environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Supabase admin client
const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Enhanced system prompt for Saudi educational context
const createSystemPrompt = (userProfile?: any) => {
  const basePrompt = `أنت "دراسة"، معلم ذكي متخصص في التعليم السعودي. مهمتك مساعدة الطلاب في التعلم وفق منهج المملكة العربية السعودية ورؤية 2030.

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
- استخدم الرموز النصية: + - �� ÷ = ² ³ √
- مثال: "إذن الجواب هو: 2 + 3 = 5"
- تجنب: $latex$ أو \\( \\) أو [math]

المواضيع المحظورة:
- المحتوى غير المناسب للأعمار
- المعلومات الشخصية الحساسة
- الموضوعات المثيرة للجدل
- حل الواجبات كاملة دون تعليم`;

  if (userProfile?.grade_level) {
    return basePrompt + `\n\nمستوى الطالب: ${userProfile.grade_level}`;
  }
  
  return basePrompt;
};

// Content moderation function
const moderateContent = async (content: string): Promise<boolean> => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return true; // Allow if no moderation available
    }

    const moderation = await openai.moderations.create({
      input: content,
    });

    const result = moderation.results[0];
    
    // Custom Saudi/Islamic content guidelines
    const inappropriatePatterns = [
      /dating|girlfriend|boyfriend/i,
      /alcohol|drinking|party/i,
      /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/, // Credit card
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{10}\b/, // Phone number
    ];
    
    const hasInappropriateContent = inappropriatePatterns.some(pattern => pattern.test(content));
    
    return !result.flagged && !hasInappropriateContent;
  } catch (error) {
    console.error('Moderation error:', error);
    return true; // Default to allow on error
  }
};

// Rate limiting check (simple in-memory for demo)
const rateLimitCheck = (() => {
  const requests = new Map<string, number[]>();
  
  return (ip: string): boolean => {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 10;
    
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }
    
    const userRequests = requests.get(ip)!;
    
    // Remove old requests
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    requests.set(ip, validRequests);
    
    return true;
  };
})();

export const handler: Handler = async (event, context) => {
  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Rate limiting
    const clientIP = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown';
    if (!rateLimitCheck(clientIP)) {
      return {
        statusCode: 429,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'معدل الطلبات مرتفع جداً. يرجى الانتظار قبل إرسال رسالة أخرى.' }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const { message, imageBlob, sessionId, userId } = JSON.parse(event.body);

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    if (message.length > 4000) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'الرسالة طويلة جداً. يرجى تقصيرها.' }),
      };
    }

    // Content moderation
    const isContentSafe = await moderateContent(message);
    if (!isContentSafe) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'المحتوى غير مناسب. يرجى إعادة صياغة رسالتك بطريقة مهذبة وتعليمية.' }),
      };
    }

    // Get user profile if available
    let userProfile = null;
    if (userId && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { data } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        userProfile = data;
      } catch (error) {
        console.log('Could not fetch user profile:', error);
      }
    }

    // Prepare the message for OpenAI
    const messages = [
      {
        role: 'system' as const,
        content: createSystemPrompt(userProfile),
      },
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

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'خدمة الذكاء الاصطناعي غير متاحة حالياً.' }),
      };
    }

    // Get AI response with streaming
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: true,
    });

    // Since we can't stream in Netlify functions, collect the response
    let responseText = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      responseText += content;
    }

    // Save conversation to database if possible
    if (sessionId && userId && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        // Save user message
        await supabaseAdmin.from('chat_messages').insert({
          session_id: sessionId,
          user_id: userId,
          role: 'user',
          content: message,
          image_data: imageBlob,
          moderated: true,
        });

        // Save AI response
        await supabaseAdmin.from('chat_messages').insert({
          session_id: sessionId,
          user_id: userId,
          role: 'assistant',
          content: responseText,
          moderated: true,
        });

        // Update session
        await supabaseAdmin
          .from('chat_sessions')
          .update({ 
            updated_at: new Date().toISOString(),
            is_active: true
          })
          .eq('id', sessionId);

      } catch (dbError) {
        console.error('Database save error:', dbError);
        // Don't fail the request if database save fails
      }
    }

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ 
        response: responseText,
        moderated: true,
        timestamp: new Date().toISOString()
      }),
    };

  } catch (error) {
    console.error('Chat function error:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'حدث خطأ في الخدمة. يرجى المحاولة مرة أخرى.',
        timestamp: new Date().toISOString()
      }),
    };
  }
};
