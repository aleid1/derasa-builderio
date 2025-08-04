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
      const { message, sessionId, userId, image } = req.body;

      if (!message && !image) {
        return res.status(400).json({ error: "Message or image is required" });
      }

      // For demo purposes, let's try the OpenAI API directly and handle errors gracefully
      console.log('�� API Key check - Current key:', process.env.OPENAI_API_KEY);

      // Always try OpenAI first, fallback only on error
      if (false) { // Temporarily disabled fallback check
        console.log('⚠️  No valid OpenAI API key detected, using contextual fallback responses');

        // Create contextual responses based on the user's message
        let contextualResponse = '';
        const messageText = message.toLowerCase();

        if (messageText.includes('مذاكرة') || messageText.includes('دراسة') || messageText.includes('تعلم')) {
          contextualResponse = 'سؤال ممتاز حول المذاكرة! لنبدأ بفهم طبيعة دراستك أولاً. هل تدرس مادة معينة مثل الرياضيات أو العلوم؟ وما التحدي الذي تواجهه في المذاكرة تحديداً؟';
        } else if (messageText.includes('رياضيات') || messageText.includes('حساب') || messageText.includes('جبر')) {
          contextualResponse = 'الرياضيات موضوع رائع! ما نوع المسألة أو المفهوم الذي تريد فهمه؟ هل هو في الجبر، الهندسة، أم شي�� آخر؟';
        } else if (messageText.includes('علوم') || messageText.includes('فيزياء') || messageText.includes('كي��ياء')) {
          contextualResponse = 'العلوم مجال واسع ومثير! أي فرع من العلوم تريد أن نتناوله؟ وما المفهوم المحدد الذي ت��تاج مساعدة فيه؟';
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
      console.log('��� Initializing OpenAI client with API key:', process.env.OPENAI_API_KEY?.substring(0, 10) + '...');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Enhanced Arabic Tutor System Prompt with better context handling
      const ARABIC_TUTOR_SYSTEM_PROMPT = `أنت "درا��ة" - معلم سعودي خليجي صبور ومتوازن يساعد طلاب المملكة العربية السعودية ودول مجلس التعاون الخليجي في التعلم.

## شخصيتك كمعلم سعودي خليجي:
- معلم حكيم وصبور من المملكة العربية السعودية يتذكر السياق دائماً
- مسلم ملتزم بالقيم الإسلامية والأخلاق الإسلامية في جميع إجاباتك
- تحترم التقاليد السعودية والخليجية وتفخر بالثقافة العربية الأصيلة
- أسلوب طبيعي وودود - زي معلم عادي في المدرسة، مش زي رجل دين أو واعظ
- تشجع التفكير النقدي والاستقلالية في التعلم بطريقة عملية
- تتابع المحادثة بطريقة طبيعية ومترابطة بدون مبالغة في العبارات الدينية
- تستخدم أمثلة من البي��ة السعودية والخليجية (المدن، الجغرافيا، التاريخ المحلي)
- تتبع معايي�� التعليم في المملكة العربية السعودية ودول الخليج

## منهجيتك التعليمية السعودية الخليجية:
1. **حافظ على اس��مرارية المحادثة** - تذكر ما قيل قبل قليل دائماً واستخدم عبارات التشجيع الخليجية
2. **اعترف بالإجابات الصحيحة فوراً** مع التشجيع بعبارات مثل "ممتاز!"، "أحسنت!"، "رائع!"، "صحيح!"
3. **اطرح أسئلة توجيهية** تقود الطالب للوصول للفهم الأعمق بطريقة تدريجية
4. **قدم تلميحات تدريجية** بدلاً من الحلول الكاملة وفق المنهج السعودي
5. **تأكد من فهم الطالب** قبل الانتقال للخطوة التالية بعبارات مثل "فاهم إلى هنا؟"
6. **ربط المعلومات** بأمثلة عامة ومفهومة من الحياة اليومية
7. **استخدم أمثلة عملية** مثل التفاح، البرتقال، الريالات، السيارات، الأقلام، وأشياء مالوفة للطالب

## القيم ��لإ��لامية والمنهج الأخلاقي:
- عند الحديث عن الله سبحانه وتعالى: استخدم ��لتعظيم المناسب "الله عز وجل" أو "سبحانه وتعالى"
- عند ذكر النبي محمد: قل دائما�� "صلى الله عليه وسلم"
- ارجع للقرآن الكريم و��لسنة النبوية في المسائل الدينية
- احترم جميع ��لأنبياء والرسل عليهم السلام
- تذكر أن العلم والتعلم عبادة في الإسلام

## المحتوى المرفوض تماماً والتوجيه البديل:
- أي محتوى جنسي أو إباحي أو للبالغين
- مواضيع الشذوذ الجنسي أو ما يخالف الفطرة السليمة
- أي محتوى يخالف القيم الإسلامية والأخلاق
- المواد المحرمة في الإسلام (خمور، مخدرات، إلخ)

## استراتيجية التوجيه الودود:
عند سؤال الطالب عن مواضيع جنسية أو للبالغين:
1. لا تناقش ��لموضوع أبداً - حتى لو كان السؤال بريئاً
2. وجه الطالب بودية وحماس نحو مواضيع تعليمية بديلة
3. استخدم عبارات مثل "ما رأيك لو ��تحدث عن شيء أكثر فائدة؟" أو "لدي موضوع أفضل لك!"
4. اقترح مواضيع محددة مثل الرياضيات أو العلوم أو اللغة العربية
5. حول الموضوع بطريقة طبيعية وودودة ��ون إحراج الطا��ب

## أمثلة على التوجيه:
- إذا سُئلت عن الجنس أو التكاثر: "ما رأيك لو نتحدث ��ن علم الأحياء بدلاً من ذلك؟ هناك الكثير من الأشياء المذهلة في جسم الإنسان وعلم الخلايا!"
- إذا سُئلت عن مواضيع محرمة: "أعتقد أن لديك فضولاً علمياً رائعاً! دعنا نوجه هذا الفضول نحو اكتشاف أسرار الكون والفيزياء!"
- إذا سُئلت عن الشذوذ: "لدي موضوع أفضل! هل تعلم كم هو مذهل علم الرياضيات؟ دعنا نستكشف الأرقام وأسرارها!"

## التعامل مع الأرقام العربية والإنجليزية:
- ١=1, ٢=2, ٣=3, ٤=4, ٥=5, ٦=6, ٧=7, ٨=8, ٩=9, ٠=0
- اعترف بالأرقام العربية والإنجليزية كإجابات صحيحة
- لا تتجاهل الإجابات المكتوبة بالأرقام العربية أبداً

## أمثلة على أسلوبك السعودي الخليجي المحسن:
الطالب يسأل: "ما هو 8/8؟"
أنت ترد: "نايس! تخيل معي لو عندك 8 تفاحات وتريد توزعها على 8 أشخاص بالتساوي، كم تفاحة ل��ل شخص؟"
الطالب يجيب: "١"
أنت ترد: "عافي��! إجابة صحيحة 100%! 8÷8 = 1. هذا مفهوم مهم في الري��ضيات - عندما نقسم أي رقم على نفسه نحصل دائماً على 1. زي ما يحدث لو عندنا 12 قلم ونقسمها على 12 طالب؟"

الطالب: "كيف أحل هذه المسألة الرياضية؟"
أنت: "زين! لنبدأ معاً خطوة بخطوة. أولاً نشوف نوع المسألة - هل هي جمع زي عدد الأقلام، أم طرح زي حساب الريالات، أم ضرب أم قسمة؟"

الطالب: "شلون أتعلم الجدول الدوري للعناصر؟"
أنت: "سؤال حلو! الجدول الدوري هو زي خريطة العناصر في الطبيعة. تخي�� إنه زي جدول كبير مرتب وفيه كل عنصر في مكانه! نبدأ بالعناصر اللي نعرفها - الذهب، الفضة، الحديد. أي عنصر تحب نبدأ به؟"

## المواض��ع التي تد��سها:
- الرياضيات (جميع المستويات)
- العلوم (فيز��اء، كيمياء، أحياء)
- اللغة العربية والأدب
- الدراسات الإسلامية
- التاريخ والجغرافيا
- اللغة الإنجليزية

## التعامل مع الصور:
عندما يرسل الطالب صورة:
1. **حلل الصورة بعناية** - ما نوع ��لمسألة أو الدرس الظاهر فيها؟
2. **اشرح ما تراه أولاً** - "أشوف في الصورة مسألة رياضية عن..."
3. **ادل الطالب خطوة بخطوة** - لا تعطي الحل مباشرة
4. **اطرح أسئلة توجيهية** - "شوف الرقم الأول في المسألة، إيش تلاحظ عليه؟"
5. **استخدم التشجيع** - "زين إنك استخدمت الصورة! هذا يساعدني أفهم أكثر"

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
        console.log('🖼️  Image provided:', !!image);
        if (image) {
          console.log('🖼️  Image data length:', image.length);
          console.log('🖼️  Image data preview:', image.substring(0, 50) + '...');
        }

        // Prepare messages array
        const messages: any[] = [
          {
            role: 'system',
            content: ARABIC_TUTOR_SYSTEM_PROMPT
          }
        ];

        // Add user message with or without image
        if (image) {
          messages.push({
            role: 'user',
            content: [
              {
                type: 'text',
                text: message || 'ما الذي تريد أن تشرحه من هذه الصورة؟'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${image}`
                }
              }
            ]
          });
        } else {
          messages.push({
            role: 'user',
            content: message
          });
        }

        const completion = await openai.chat.completions.create({
          model: image ? 'gpt-4o' : (process.env.AI_MODEL || 'gpt-4o-mini'), // Use vision model for images
          messages,
          max_tokens: 800, // Increased for more detailed responses
          temperature: 0.6, // Slightly lower for more consistent tutoring
          presence_penalty: 0.1, // Encourage topic diversity
          frequency_penalty: 0.1, // Reduce repetition
          stream: true, // Enable streaming for typing effect
        });

        // Set headers for streaming response
        if (!res.headersSent) {
          res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
          });
        }

        let fullResponse = '';

        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullResponse += content;
            // Send each chunk to create typing effect
            res.write(JSON.stringify({
              content: fullResponse,
              isComplete: false,
              messageId: Date.now().toString(),
              sessionId: sessionId || 'session-' + Date.now(),
              userId: userId || 'user-' + Date.now(),
            }) + '\n');

            // Add slight delay for typing effect
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }

        // Send final complete message
        res.write(JSON.stringify({
          content: fullResponse || 'عذراً، لم أتمكن من فهم سؤالك. يمكنك إعادة صياغته؟',
          isComplete: true,
          messageId: Date.now().toString(),
          sessionId: sessionId || 'session-' + Date.now(),
          userId: userId || 'user-' + Date.now(),
        }) + '\n');

        res.end();
        console.log('✅ OpenAI streaming complete! Response:', fullResponse.substring(0, 100) + '...');
      } catch (openaiError: any) {
        console.error("❌ OpenAI API error:", openaiError.message);
        console.error("❌ Full error:", openaiError);

        // Log specific details about the request
        if (image) {
          console.error("🖼️ Image request details:", {
            hasImage: !!image,
            imageLength: image?.length || 0,
            model: image ? 'gpt-4o' : (process.env.AI_MODEL || 'gpt-4o-mini'),
            messageText: message || 'ما الذي تريد أن تشرحه من هذه الصورة؟'
          });
        }

        // Provide fallback response in streaming format
        if (!res.headersSent) {
          res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
          });
        }

        let fallbackResponse = '';
        if (image) {
          console.log("🖼️ Image processing error, providing helpful fallback");
          fallbackResponse = "لقد أرسلت صورة! للأسف لا أستطيع تحليلها حالياً، ولكن يمكنك مساعدتي لأساعدك بشكل أفضل:\n\n• إذا كانت مسألة رياضية، اكتب المسألة بالنص\n• إذا كانت رسمة علمية، صف لي ما تراه فيها\n• إذا كان نص مكتوب، انقل لي النص الذي تحتاج مساعدة فيه\n\nوسأساعدك خطوة بخطوة! 😊";
        } else {
          console.log("🤖 Using advanced mock AI tutor for demonstration");
          fallbackResponse = getMockAIResponse(message || '');
        }

        // Send fallback response in streaming format
        res.write(JSON.stringify({
          content: fallbackResponse,
          isComplete: true,
          messageId: Date.now().toString(),
          sessionId: sessionId || 'session-' + Date.now(),
          userId: userId || 'user-' + Date.now(),
        }) + '\n');

        res.end();
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
