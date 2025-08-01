import { Handler } from '@netlify/functions';

// Arabic tutoring system prompt for the AI
const ARABIC_TUTOR_SYSTEM_PROMPT = `أنت معلم ذكي اسمك "دراسة" متخصص في التوجيه التدريجي للطلاب العرب والسعوديين.

مبادئك الأساسية:
- لا تعطي الإجابة مباشرة أبداً، بل ادل الطالب خطوة بخطوة
- استخدم أسلوباً محترماً يتماشى مع القيم الإسلامية والثقافة العربية السعودية
- اطرح أسئلة توجيهية تساعد الطالب على التفكير النقدي
- قدم تلميحات وأمثلة بدلاً من حلول مباشرة
- تأكد من فهم الطالب قبل الانتقال للخطوة التالية
- استخدم أمثلة من البيئة السعودية والثقافة الإسلامية عند الحاجة

أمثلة على أسلوبك:
الطالب: "كيف أحل هذه المسألة الرياضية؟"
أنت: "ممتاز! لنبدأ معاً. أولاً، ما نوع هذه المسألة؟ هل هي جمع، طرح، أم شيء آخر؟ وما هي المعطيات المتوفرة لدينا؟"

الطالب: "ما هو التمثيل الضوئي��"
أنت: "سؤال علمي رائع! قبل أن نتعمق، هل تعرف ماذا تحتاج النباتات لتنمو؟ فكر في النباتات التي تراها في حديقة بيتك أو في المدرسة."

تذكر: هدفك هو تطوير قدرة الطالب على التفكير والوصول للمعرفة بنفسه، وليس إعطاء إجابات جاهزة.`;

const generateAIResponse = async (message: string): Promise<string> => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn('OpenAI API key not found, using fallback response');
    return 'أعتذر، لا يمكنني الوصول لخدمة الذكاء الاصطناعي في الوقت الحالي. يرجى المحاولة لاحقاً.';
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
        max_tokens: 300,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'أعتذر، لم أتمكن من معالجة سؤالك. يرجى إعادة الصياغة.';

  } catch (error) {
    console.error('OpenAI API error:', error);

    // Fallback to mock responses if API fails
    const fallbackResponses = [
      'أعتذر، واجهت مشكلة تقنية. يرجى إعادة المحاولة.',
      'عذراً، لا أستطيع الإجابة في الوقت الحالي. هل يمكنك إعادة صياغة سؤالك؟',
      'أواجه صعوبة في الاتصال. يرجى المحاولة مرة أخرى بعد قليل.'
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};

export const handler: Handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'text/plain; charset=utf-8',
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
      body: 'Method Not Allowed',
    };
  }

  try {
    const { message, sessionId } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Generate AI response
    const response = await generateAIResponse(message);

    // Simulate streaming by sending the response in chunks
    const chunks = response.split(' ');
    let streamedResponse = '';

    // For now, return the complete response
    // In production, this would be a true streaming response
    streamedResponse = response;

    const streamingData = {
      content: streamedResponse,
      isComplete: true,
      messageId: Date.now().toString(),
    };

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(streamingData),
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
