import { ChatMessage, AIResponse, StreamingResponse } from "./chat-types";

// Configuration for AI tutoring behavior
const TUTOR_SYSTEM_PROMPT = `أنت مُعلم ذكي اسمك "دراسة". تخصصك هو التوجيه التدريجي للطلاب العرب والسعوديين.

المبادئ الأساسية:
- لا تعطي الإجابة مباشرة، بل ادل الطالب خطوة بخطوة
- استخدم أسلوباً محترماً يتماشى مع القيم الإسلامية والثقافة العربية
- اطرح أسئلة توجيهية تساعد الطالب على التفكير
- قدم تلميحات وليس حلول مباشرة
- تأكد من فهم الطالب قبل الانتقال للخطوة التالية

مثال على أسلوبك:
الطالب: "كيف أحل هذ�� المسألة الرياضية؟"
أنت: "ممتاز! لنبدأ معاً. أولاً، ما نوع هذه المسألة؟ هل هي جمع، طرح، أم شيء آخر؟"`;

class ChatService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "/.netlify/functions/simple-chat";
  }

  async sendMessage(
    message: string,
    sessionId?: string,
  ): Promise<ReadableStream<StreamingResponse>> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        sessionId,
        userId: null, // Will be handled by the API
      }),
    });

    if (!response.ok) {
      console.error('Chat API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });

      let errorText = '';
      try {
        errorText = await response.text();
        console.error('Error details:', errorText);
      } catch (e) {
        console.error('Could not read error response');
      }

      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // For now, handle as JSON response (will be upgraded to streaming later)
    const data = await response.json();

    return new ReadableStream({
      start(controller) {
        controller.enqueue(data);
        controller.close();
      },
    });
  }

  async getSuggestedQuestions(): Promise<string[]> {
    // These will be dynamic based on curriculum and user progress
    return [
      "أطلب تلميحاً",
      "اشرح خطوة بخطوة",
      "مثال إضافي",
      "كيف أتذكر هذا؟",
      "اختبر فهمي",
      "تطبيق عملي",
    ];
  }

  async getChatHistory(userId: string, limit = 50): Promise<ChatMessage[]> {
    const response = await fetch(
      `${this.baseUrl}/history?userId=${userId}&limit=${limit}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch chat history");
    }

    return response.json();
  }

  async createSession(userId: string, title?: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        title: title || "محادثة جديدة",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create session");
    }

    const data = await response.json();
    return data.sessionId;
  }
}

export const chatService = new ChatService();
