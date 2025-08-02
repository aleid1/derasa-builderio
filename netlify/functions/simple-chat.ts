import { Handler } from '@netlify/functions';

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
    const { message } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' }),
      };
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
        message: 'عذراً�� حدث خطأ في النظام. يرجى المحاولة لاحقاً.'
      }),
    };
  }
};
