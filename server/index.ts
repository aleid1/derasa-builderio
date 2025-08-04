import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import OpenAI from "openai";
import { getMockAIResponse } from "./mock-ai-tutor";

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

      // For demo purposes, let's try the OpenAI API directly and handle errors gracefully
      console.log('🔧 API Key check - Current key:', process.env.OPENAI_API_KEY);

      // Always try OpenAI first, fallback only on error
      if (false) { // Temporarily disabled fallback check
        console.log('⚠️  No valid OpenAI API key detected, using contextual fallback responses');

        // Create contextual responses based on the user's message
        let contextualResponse = '';
        const messageText = message.toLowerCase();

        if (messageText.includes('مذاكرة') || messageText.includes('دراسة') || messageText.includes('تعلم')) {
          contextualResponse = 'سؤال ممتاز حول المذاكرة! لنبدأ بفهم طبيعة دراستك أولاً. هل تدرس مادة معينة مثل الرياضيات أو العلوم؟ وما التحدي الذي تواجهه في المذاكرة تحديداً؟';
        } else if (messageText.includes('رياضيات') || messageText.includes('حساب') || messageText.includes('جبر')) {
          contextualResponse = 'الرياضيات موضوع رائع! ما نوع المسألة أو المفهوم الذي تريد فهمه؟ هل هو في الجبر، الهندسة، أم شيء آخر؟';
        } else if (messageText.includes('علوم') || messageText.includes('فيزياء') || messageText.includes('كيمياء')) {
          contextualResponse = 'العلوم مجال واسع ومثير! أي فرع من العلوم تريد أن نتناوله؟ وما المفهوم المحدد الذي تحتاج مساعدة فيه؟';
        } else if (messageText.includes('عربية') || messageText.includes('لغة') || messageText.includes('نحو')) {
          contextualResponse = 'اللغة العربية لغة جميلة وغنية! ما الموضوع الذي تريد التركيز عليه؟ النحو، الصرف، الأدب، أم شيء آخر؟';
        } else {
          contextualResponse = 'أهلاً بك! أنا هنا لمساعدتك في التعلم. يمكنك أن تسألني عن أي موضوع دراسي وسأوجهك خطوة بخطوة للوصول للفهم. ما الموضوع الذي تريد أن نتناوله اليوم؟';
        }

        return res.json({
          content: contextualResponse,
          isComplete: true,
          messageId: Date.now().toString(),
          sessionId: sessionId || 'demo-session',
          userId: userId || 'demo-user',
        });
      }

      // Initialize OpenAI client
      console.log('🤖 Initializing OpenAI client with API key:', process.env.OPENAI_API_KEY?.substring(0, 10) + '...');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Enhanced Arabic Tutor System Prompt with better context handling
      const ARABIC_TUTOR_SYSTEM_PROMPT = `أنت "دراسة" - معلم ذكي صبور ومتوازن يساعد الطلاب العرب والسعوديين في التعلم.

## شخصيتك:
- معلم حكيم وصبور يتذكر السياق دائماً
- تحترم القيم الإسلامية والثقافة العربية
- متوازن في الأسلوب - لا مفرط في الحماس ولا جاف
- تشجع التفكير النقدي والاستقلالية في التعلم
- تتابع المحادثة بطريقة طبيعية ومترابطة

## منهجيتك التعليمية:
1. **حافظ على استمرارية المحادثة** - تذكر ما قيل قبل قليل دائماً
2. **اعترف بالإجابات الصحيحة فوراً** مع التشجيع والبناء عليها
3. **اطرح أسئلة توجيهية** تقود الطالب للوصول للفهم الأعمق
4. **قدم تلميحات تدريجية** بدلاً من الحلول الكاملة
5. **تأكد من فهم الطالب** قبل الانتقال للخطوة التالية
6. **ربط المعلومات** بأمثلة من الحياة اليومية

## التعامل مع الأرقام العربية والإنجليزية:
- ١=1, ٢=2, ٣=3, ٤=4, ٥=5, ٦=6, ٧=7, ٨=8, ٩=9, ٠=0
- اعترف بالأرقام العربية والإنجليزية كإجابات صحيحة
- لا تتجاهل الإجابات المكتوبة بالأرقام العربية أبداً

## أمثلة على أسلوبك المحسن:
الطالب يسأل: "ما هو 8/8؟"
أنت ترد: "سؤال جيد! إذا كان لديك 8 قطع وقسمتها إلى 8 أجزاء متساوية، كم لكل جزء؟"
الطالب يجيب: "١"
أنت ترد: "ممتاز! إجابة صحيحة تماماً! 8÷8 = 1. هذا مفهوم مهم - عندما نقسم أي رقم على نفسه نحصل دائماً على 1. هل تعرف لماذا؟"

الطالب: "كيف أحل ��ذه المسألة الرياضية؟"
أنت: "ممتاز! لنبدأ معاً. أولاً، ما نوع هذه المسألة؟ هل هي جمع، طرح، ضرب، أم قسمة؟"

## المواضيع التي تدرسها:
- الرياضيات (جميع المستويات)
- العلوم (فيزياء، كيمياء، أحياء)
- اللغة العربية والأدب
- الدراسات الإسلامية
- التاريخ والجغرافيا
- اللغة الإنجليزية

## قواعد مهمة جداً:
- لا تفقد سياق المحادثة أبداً
- اعترف بالإجابات الصحيحة فوراً واحتفل بها
- ابن على ما قال الطالب
- استخدم التشجيع المناسب
- اربط المفاهيم ببعضها
- إذا أجاب الطالب بشكل صحيح، قل "ممتاز!" أو "صحيح!" ثم ابن على إجابته

تذكر: أنت تبني محادثة تعليمية مترابطة، ليس مجرد إجابات منفصلة.`;

      // Make API call to OpenAI with error handling
      try {
        console.log('📞 Making OpenAI API call with message:', message);
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
          max_tokens: 800, // Increased for more detailed responses
          temperature: 0.6, // Slightly lower for more consistent tutoring
          presence_penalty: 0.1, // Encourage topic diversity
          frequency_penalty: 0.1, // Reduce repetition
        });

        const aiResponse = completion.choices[0]?.message?.content || 'عذراً، لم أتمكن من فهم سؤالك. يمكنك إعادة صياغته؟';
        console.log('✅ OpenAI API success! Response:', aiResponse.substring(0, 100) + '...');

        const responseData = {
          content: aiResponse,
          isComplete: true,
          messageId: Date.now().toString(),
          sessionId: sessionId || 'session-' + Date.now(),
          userId: userId || 'user-' + Date.now(),
        };

        res.json(responseData);
      } catch (openaiError: any) {
        console.error("❌ OpenAI API error:", openaiError.message);
        console.log("🤖 Using advanced mock AI tutor for demonstration");

        // Use sophisticated mock AI tutor that demonstrates proper tutoring behavior
        const mockResponse = getMockAIResponse(message);

        res.json({
          content: mockResponse,
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
