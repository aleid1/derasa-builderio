import { ChatMessage, AIResponse, StreamingResponse } from "./chat-types";

// Configuration for AI tutoring behavior
const TUTOR_SYSTEM_PROMPT = `أنت مُعلم ذكي اسمك "دراسة". تخصصك هو التوجيه التدريجي للطلاب العرب والسعوديين.`;

class ChatService {
  private baseUrl: string;
  private fallbackResponses: Record<string, string[]>;

  constructor() {
    this.baseUrl = "/.netlify/functions/simple-chat";
    
    // Fallback responses for when API is not available
    this.fallbackResponses = {
      math: [
        "ممتاز! لنحل هذه المسألة الرياضية معاً خطوة بخطوة. أولاً، ما ن��ع هذه المسألة؟",
        "رائع! المسائل الرياضية تحتاج تفكير منطقي. دعني أوضح لك الطريقة الصحيحة.",
        "جيد! في الرياضيات، نبدأ بتحديد المطلوب، ثم نخطط للحل. ما المطلوب في مسألتك؟"
      ],
      science: [
        "ممتاز! العلوم مليئة بالاكتشافات المثيرة. دعنا نستكشف هذا الموضوع معاً.",
        "رائع! في العلوم نتعلم بالتجربة والملاحظة. ما الذي تود أن تعرفه أكثر؟",
        "جيد! العلوم تساعدنا على فهم العالم من حولنا. أي جانب يثير فضولك؟"
      ],
      arabic: [
        "ممتاز! اللغة العربية لغة جميلة وغنية. دعنا نتعلم قواعدها معاً.",
        "رائع! في اللغة العربية، النحو والصرف أساس الفهم. ما الذي تريد أن تتعلمه؟",
        "جيد! العربية لغة القرآن الكريم. سأساعدك في إتقان قواعدها."
      ],
      general: [
        "أهلاً وسهلاً! أنا هنا لمساعدتك في التعلم. ما الموضوع الذي تود أن نتناوله اليوم؟",
        "مرحباً بك! كمعلم ذكي، سأرشدك خطوة بخطوة لفهم ما تريد تعلمه.",
        "أهلاً! أحب أن أساعد الطلاب في رحلة التعلم. ما هو سؤالك اليوم؟",
        "مرحباً! التعلم رحلة ممتعة، وأنا هنا لأكون دليلك فيها. كيف يمكنني مساعدتك؟"
      ]
    };
  }

  private getRandomFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    let category = 'general';
    
    if (lowerMessage.includes('رياض') || lowerMessage.includes('حساب') || lowerMessage.includes('جمع') || lowerMessage.includes('طرح')) {
      category = 'math';
    } else if (lowerMessage.includes('علوم') || lowerMessage.includes('فيزياء') || lowerMessage.includes('كيمياء')) {
      category = 'science';
    } else if (lowerMessage.includes('عربي') || lowerMessage.includes('نحو') || lowerMessage.includes('إعراب')) {
      category = 'arabic';
    }
    
    const responses = this.fallbackResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async sendMessage(
    message: string,
    sessionId?: string,
    imageBlob?: Blob,
  ): Promise<ReadableStream<StreamingResponse>> {
    let imageData = null;
    if (imageBlob) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.readAsDataURL(imageBlob);
      });
      imageData = base64;
      console.log('📷 Image converted to base64, length:', base64.length);
    }

    // Try the real API first
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          sessionId,
          userId: null,
          image: imageData,
        }),
      });

      if (response.ok) {
        // Parse the response and convert to streaming format
        const data = await response.json();
        return this.createStreamFromText(data.response || data.content);
      } else {
        console.warn('API failed, using fallback response');
        throw new Error('API failed');
      }
    } catch (error) {
      console.log('Using fallback response due to API error:', error);
      
      // Use fallback response
      const fallbackText = this.getRandomFallbackResponse(message);
      return this.createStreamFromText(fallbackText);
    }
  }

  private createStreamFromText(text: string): ReadableStream<StreamingResponse> {
    const words = text.split(' ');
    let wordIndex = 0;

    return new ReadableStream({
      start(controller) {
        const sendNextWord = () => {
          if (wordIndex < words.length) {
            const currentText = words.slice(0, wordIndex + 1).join(' ');
            controller.enqueue({
              content: currentText,
              isComplete: false,
              timestamp: new Date().toISOString()
            });
            wordIndex++;
            setTimeout(sendNextWord, 100); // Simulate typing speed
          } else {
            controller.enqueue({
              content: text,
              isComplete: true,
              timestamp: new Date().toISOString()
            });
            controller.close();
          }
        };
        
        sendNextWord();
      }
    });
  }

  async getSuggestedQuestions(): Promise<string[]> {
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
    // Return empty for now - could implement localStorage storage
    return [];
  }

  async createSession(userId: string, title?: string): Promise<string> {
    return `session-${userId}-${Date.now()}`;
  }
}

export const chatService = new ChatService();
