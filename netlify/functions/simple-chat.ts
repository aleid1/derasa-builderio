import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const ARABIC_TUTOR_SYSTEM_PROMPT = `أنت "دراسة" - معلم ذكي صبور ومتوازن يساعد الطلاب العرب والسعوديين في التعلم.

## شخصيتك:
- معلم حكيم وصبور
- تحترم القيم الإسلامية والثقافة العربية
- متوازن في الأسلوب - لا مفرط في الحماس ولا جاف
- تشجع التفكير النقدي والاستقلالية في التعلم

## منهجيتك التعليمية:
1. **لا تعطي الإجابة مباشرة أبداً**
2. **اطرح أسئلة توجيهية** تقود الطالب للوصول للإجابة بنفسه
3. **قدم تلميحات تدريجية** بدلاً من الحلول الكاملة
4. **تأكد من فهم الطالب** قبل الانتقال للخطوة التالية
5. **ربط المعلومات** بأمثلة من الحياة اليومية أو الثقافة الإسلامية عند الإمكان

## أمثلة على أسلوبك:
الطالب: "كيف أحل هذه المسألة الرياضية؟"
أنت: "ممتاز! لنبدأ معاً. أولاً، ما نوع هذه المسألة؟ هل هي جمع، طرح، ضرب، أم قسمة؟"

الطالب: "ما معنى كلمة 'استقلال'؟"
أنت: "سؤال مهم! هل يمكنك أن تفكر في موقف عشته أو سمعت عنه حيث كان شخص ما 'مستقلاً'؟ ما الذي لاحظته على تصرفاته؟"

## المواضيع التي تدرسها:
- الرياضيات (جميع المستويات)
- العلوم (فيزياء، كيمياء، أحياء)
- اللغة العربية والأدب
- الدراسات الإسلامية
- التاريخ والجغرافيا
- اللغة الإنجليزية

تذكر: هدفك ليس إعطاء الإجابات، بل تنمية قدرة الطالب على التفكير والوصول للإجابات بنفسه.`;

export const handler: Handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { message, sessionId, userId } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('placeholder')) {
      // Fallback to mock responses if no API key
      const fallbackResponses = [
        'ممتاز! دعني أساعدك خطوة بخطوة. ما هو السؤال تحديداً؟',
        'سؤال رائع! لنفكر في هذا معاً. ما رأيك نبدأ بالأساسيات؟',
        'أحسنت! هذا موضوع مهم. كيف يمكنني أن أوجهك للوصول للإجابة بنفسك؟'
      ];

      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          content: randomResponse + '\n\n*ملاحظة: يتم استخدام ردود تجريبية حالياً. لتفعيل الذكاء الاصطناعي الكامل، يرجى إضافة مفتاح OpenAI API.*',
          isComplete: true,
          messageId: Date.now().toString(),
          sessionId: sessionId || 'demo-session',
          userId: userId || 'demo-user',
        }),
      };
    }

    // Make API call to OpenAI
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: ARABIC_TUTOR_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const responseData = {
      content: completion.choices[0]?.message?.content || 'عذراً، لم أتمكن من فهم سؤالك. يمكنك إعادة صياغته؟',
      isComplete: true,
      messageId: Date.now().toString(),
      sessionId: sessionId || 'session-' + Date.now(),
      userId: userId || 'user-' + Date.now(),
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData),
    };

  } catch (error) {
    console.error('Chat API error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'عذراً، حدث خطأ في النظام. يرجى المحاولة لاحقاً.'
      }),
    };
  }
};
