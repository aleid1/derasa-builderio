import { Handler } from '@netlify/functions';

// Mock AI response for now - will be replaced with actual OpenAI/Claude integration
const generateAIResponse = async (message: string, systemPrompt: string): Promise<string> => {
  // Simulate thinking time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Arabic tutoring responses based on common patterns
  const responses = {
    math: [
      'ممتاز! لنبدأ بتحليل هذه المسألة. ما هو أول شيء تلاحظه في هذه المعادلة؟',
      'هذا سؤال رائع! دعني أساعدك خطوة بخطوة. أولاً، ما نوع العملية المطلوبة هنا؟',
      'أحسنت في طرح هذا السؤال. لنفكر معاً - ما هي المعطيات المتوفرة لدينا؟'
    ],
    science: [
      'سؤال علمي ممتاز! لنبدأ بالأساسيات. ما تعريفك لهذا المفهوم؟',
      'هذا موضوع شيق! دعنا نفكر في الأمثلة من حولنا. هل يمكنك ذكر مثال من الواقع؟',
      'جيد جداً! لنقسم هذه المشكلة إلى أجزاء صغيرة. ما هو الجزء الذي تفهمه بالفعل؟'
    ],
    language: [
      'سؤال لغوي رائع! لنحلل هذا النص معاً. ما أول ما يلفت انتباهك؟',
      'ممتاز! دعنا نفكر في قواعد اللغة هنا. ما نوع هذه الجملة؟',
      'أحسنت! لنبدأ بفهم المعنى العام أولاً. ما الفكرة الرئيسية في رأيك؟'
    ],
    general: [
      'شكراً لسؤالك! أود أن أساعدك على الوصول للإجابة بنفسك. ما هو فهمك الحالي للموضوع؟',
      'سؤال جيد! لنفكر في هذا معاً خطوة بخطوة. من أين نبدأ في رأيك؟',
      'ممتاز أنك تسأل! دعني أوجهك بالتلميحات. ما أول شيء تحتاج لمعرفته؟'
    ]
  };

  // Simple keyword detection for subject classification
  const messageWords = message.toLowerCase();
  let category = 'general';
  
  if (messageWords.includes('رياض') || messageWords.includes('حساب') || messageWords.includes('جبر')) {
    category = 'math';
  } else if (messageWords.includes('علوم') || messageWords.includes('فيزياء') || messageWords.includes('كيمياء')) {
    category = 'science';
  } else if (messageWords.includes('لغة') || messageWords.includes('نحو') || messageWords.includes('أدب')) {
    category = 'language';
  }

  const categoryResponses = responses[category];
  return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
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
    const { message, sessionId, systemPrompt } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: 'Message is required',
      };
    }

    // Generate AI response
    const response = await generateAIResponse(message, systemPrompt);

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
