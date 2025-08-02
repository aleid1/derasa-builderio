import { ChatMessage, AIResponse, StreamingResponse } from "./chat-types";

// Configuration for AI tutoring behavior
const TUTOR_SYSTEM_PROMPT = `أنت مُعلم ذكي اسمك "دراسة". تخصصك هو التوجيه التدريجي للطلاب ال��رب والسعوديين.

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
      let errorMessage = 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.';

      try {
        errorText = await response.text();
        console.error('Error details:', errorText);

        // Provide more specific error messages
        if (response.status === 429) {
          errorMessage = 'لقد تجاوزت الحد المسموح من الرسائل. يرجى الانتظار قليلاً ثم المحاولة مرة أخرى.';
        } else if (response.status === 500) {
          errorMessage = 'عذراً، حدث خطأ في الخادم. نحن نعمل على إصلاحه.';
        } else if (response.status === 404) {
          errorMessage = 'عذراً، الخدمة غير متوفرة حالياً. يرجى المحاولة لاحقاً.';
        }
      } catch (e) {
        console.error('Could not read error response');
      }

      throw new Error(errorMessage);
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
    // Contextual suggestions based on common learning needs
    return [
      "أريد تعلم الرياضيات",
      "ساعدني في العلوم",
      "أشرح لي قواعد اللغة العربية",
      "كيف أحل المسائل خطوة بخطوة؟",
      "ما هي أفضل طريقة للمذاكرة؟",
      "أريد فهم الفيزياء بطريقة سهلة",
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
