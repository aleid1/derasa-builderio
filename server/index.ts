import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import OpenAI from "openai";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Netlify function proxy for local development with OpenAI integration
  app.post("/.netlify/functions/simple-chat", async (req, res) => {
    try {
      const { message, sessionId, userId } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('placeholder') || process.env.OPENAI_API_KEY.includes('your-actual-openai-api-key-here')) {
        // Fallback to mock responses if no API key
        const fallbackResponses = [
          'ممتاز! دعني أساعدك خطوة بخطوة. ما هو السؤال تحديداً؟',
          'سؤال رائع! لنفكر في هذا معاً. ما رأيك نبدأ بالأساسيات؟',
          'أحسنت! هذا موضوع مهم. كيف يمكنني أن أوجهك للوصول للإجابة بنفسك؟',
          'لنحلل هذا السؤال معاً. ما هو أول شيء تلاحظه؟',
          'فكرة ممتازة! الآن، ما رأيك لو جربنا طريقة أخرى؟'
        ];

        const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

        return res.json({
          content: randomResponse,
          isComplete: true,
          messageId: Date.now().toString(),
          sessionId: sessionId || 'demo-session',
          userId: userId || 'demo-user',
        });
      }

      // Initialize OpenAI client
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Arabic Tutor System Prompt (same as Netlify function)
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

      // Make API call to OpenAI with error handling
      try {
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
          content: completion.choices[0]?.message?.content || 'عذراً، لم أتمكن من فهم سؤالك. يمكنك إعادة ��ياغته؟',
          isComplete: true,
          messageId: Date.now().toString(),
          sessionId: sessionId || 'session-' + Date.now(),
          userId: userId || 'user-' + Date.now(),
        };

        res.json(responseData);
      } catch (openaiError) {
        console.error("OpenAI API error:", openaiError);

        // Fallback to mock response if OpenAI fails
        const fallbackResponses = [
          'ممتاز! دعني أساعدك خطوة بخطوة. ما هو السؤال تحديداً؟',
          'سؤال رائع! لنفكر في هذا معاً. ما رأيك نبدأ بالأساسيات؟',
          'أحسنت! هذا موضوع مهم. كيف يمكنني أن أوجهك للوصول للإجابة بنفسك؟'
        ];

        const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

        res.json({
          content: randomResponse + '\n\n*ملاحظة: حدث خطأ في الاتصال بخدمة الذكاء الاصطناعي. يتم استخدام ردود تجريبية.*',
          isComplete: true,
          messageId: Date.now().toString(),
          sessionId: sessionId || 'session-' + Date.now(),
          userId: userId || 'user-' + Date.now(),
        });
      }
    } catch (error) {
      console.error("Local chat error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "عذراً، حدث خطأ في النظام. يرجى المحاولة لاحقاً.",
      });
    }
  });

  return app;
}
