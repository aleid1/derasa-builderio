import { ChatMessage, AIResponse, StreamingResponse } from './chat-types';

// Configuration for AI tutoring behavior
const TUTOR_SYSTEM_PROMPT = `أنت مُعلم ذكي اسمك "دراسة". تخصصك هو التوجيه التدريجي للطلاب العرب والسعوديين.

المبادئ الأساسية:
- لا تعطي الإجابة مباشرة، بل ادل الطالب خطوة بخطوة
- استخدم أسلوباً محترماً يتماشى مع القيم الإسلامية والثقافة العربية
- اطرح أسئلة توجيهية تساعد الطالب على التفكير
- قدم تلميحات وليس حلول مباشرة
- تأكد من فهم الطالب قبل الانتقال للخطوة التالية

مثال على أسلوبك:
الطالب: "كيف أحل هذه المسألة الرياضية؟"
أنت: "ممتاز! لنبدأ معاً. أولاً، ما نوع هذه المسألة؟ هل هي جمع، طرح، أم شيء آخر؟"`;

class ChatService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/chat';
  }

  async sendMessage(message: string, sessionId?: string): Promise<ReadableStream<StreamingResponse>> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId,
        systemPrompt: TUTOR_SYSTEM_PROMPT,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response stream available');
    }

    return new ReadableStream({
      start(controller) {
        function pump(): Promise<void> {
          return reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }

            // Parse the streaming response
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  controller.enqueue(data);
                } catch (e) {
                  console.error('Failed to parse streaming data:', e);
                }
              }
            }

            return pump();
          });
        }

        return pump();
      },
    });
  }

  async getSuggestedQuestions(): Promise<string[]> {
    // These will be dynamic based on curriculum and user progress
    return [
      'أطلب تلميحاً',
      'اشرح خطوة بخطوة',
      'مثال إضافي',
      'كيف أتذكر هذا؟',
      'اختبر فهمي',
      'تطبيق عملي'
    ];
  }

  async getChatHistory(userId: string, limit = 50): Promise<ChatMessage[]> {
    const response = await fetch(`${this.baseUrl}/history?userId=${userId}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }

    return response.json();
  }

  async createSession(userId: string, title?: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        title: title || 'محادثة جديدة',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create session');
    }

    const data = await response.json();
    return data.sessionId;
  }
}

export const chatService = new ChatService();
