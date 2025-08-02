import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('', {
      status: 200,
      headers,
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers,
    });
  }

  try {
    const body = await req.text();
    const { message } = JSON.parse(body || '{}');

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers,
      });
    }

    // Simple AI response for testing
    const responses = [
      'ممتاز! دعني أساعدك خطوة بخطوة. ما هو السؤال تحديداً؟',
      'سؤال رائع! لنفكر في هذا معاً. ما رأيك نبدأ بالأساسيات؟',
      'أحسنت! هذا موضوع مهم. كيف يمكنني أن أوجهك للوصول للإجابة بنفسك؟'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const responseData = {
      content: randomResponse,
      isComplete: true,
      messageId: Date.now().toString(),
      sessionId: 'test-session',
      userId: 'test-user',
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: 'عذراً، حدث خطأ في النظام. يرجى المحاولة لاحقاً.'
    }), {
      status: 500,
      headers,
    });
  }
};

export const config: Config = {
  path: "/simple-chat"
};
