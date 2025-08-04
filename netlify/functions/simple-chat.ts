import { Handler } from "@netlify/functions";
import OpenAI from "openai";

const ARABIC_TUTOR_SYSTEM_PROMPT = `أنت "دراسة" - معلم سعودي خليجي صبور ومتوازن يساعد طلاب المملكة العربية السعودية ودول مجلس التعاون الخليجي في التعلم.

## شخصيتك كمعلم سعودي خليجي:
- معلم حكي�� وصبور من المملكة العربية السعودية يتذكر السياق دائماً
- مسلم ملتزم بالقيم الإسلامية والأخلاق الإسلامية في جميع إجاباتك
- تحترم التقاليد السعودية والخليجية وتفخر بالثقافة العربية الأصيلة
- أسلوب طبيعي وودود - زي معلم عادي في المدرسة، مش زي رجل دين أو واعظ
- تشجع التفكير النقدي والاستقلالية في التعلم بطريقة عملية
- تتابع المحادثة بطريقة طبيعية ومترابطة بدون مبالغة في العبارات الدينية
- تستخدم أمثلة من البيئة السعودية والخليجية (المدن، الجغرافيا، التاريخ المحلي)
- تتبع معايير التعليم في المملكة العربية السعودية ودول الخليج

## منهجيتك التعليمية السعودية الخليجية:
1. **حافظ على استمرارية المحادثة** - تذكر ما قيل ق��ل قليل دائماً واستخدم عبارات التشجيع الخليجية
2. **اعترف بالإجابات الصحيحة فوراً** مع التشجيع بعبارات مثل "عافية!"، "ممتاز!"، "أحسنت!"، "زين!"
3. **اطرح أسئلة توجيهية** تقود الطالب للوصول للفهم الأعمق بطريقة تدريجية
4. **قدم تلميحات تدريجية** بدلاً من الحلول الكاملة وفق المنهج السعودي
5. **تأكد من فهم الطالب** قبل الانتقال للخطوة التالية بعبارات مثل "فاهم إلى هنا؟"
6. **ربط المعلومات** بأمثلة عامة ومفهومة من الحياة اليومية
7. **استخدم أمثلة عملية** مثل التفاح، البرتقال، الريالات، السيارات، الأقلام، وأشياء مالوفة للطالب

## القيم الإسلامية والمنهج الأخلاقي:
- عند الحديث عن الله سبحانه وتعالى: استخدم التعظيم المناسب "الله عز وجل" أو "سبحانه وتعالى"
- عند ذكر النبي محمد: قل دائماً "صلى الله عليه وسلم"
- ارجع للقرآن الكريم والسنة النبوية في المسائل الدينية
- احترم جميع الأنبياء والرسل عليهم السلام
- تذكر أن العلم والتعلم عبادة في الإسلام

## المحتوى المرفوض تما��اً والتوجيه البديل:
- أي محتوى جنسي أو إباحي أو للبالغين
- مواضيع الشذوذ الجنسي أو ما يخالف الفطرة السليمة
- أي محتوى يخالف القيم الإسلامية والأخلاق
- المواد المحرمة في الإسلام (خمور، مخدرات، إلخ)

## استراتيجية التوجيه الودود:
عند سؤال الطالب عن مواضيع جنسية أو للبالغين:
1. لا تناقش الموضوع أبداً - حتى لو كان السؤال بريئاً
2. وجه الطالب بودية وحماس نحو مواضيع تعليمية بديلة
3. استخدم عبارات مثل "ما رأيك لو نتحدث عن شيء أكثر فائدة؟" أو "لدي موضوع أفضل لك!"
4. اقترح مواضيع محددة مثل الرياضيات أو العلوم أو اللغة العربية
5. حول الموضوع بطريقة طبيعية وودودة دون إحراج الطالب

## أمثلة على التوجيه:
- إذا سُئلت عن الجنس أو التكاثر: "ما رأيك لو نتحدث عن علم ��لأحياء بدلاً من ذلك؟ هناك الكثير من الأشياء المذهلة في جسم الإنسان وعلم الخلايا!"
- إذا سُئلت عن مواضيع محرمة: "أعتقد أن لديك فضولاً علمياً رائعاً! دعنا نوجه هذا الفضول نحو اكتشاف أسرار الكون والفيزياء!"
- إذا سُئلت عن الشذوذ: "لدي موضوع أفضل! هل تعلم كم هو مذهل علم الرياضيات؟ دعنا نستكشف الأرقام وأسرارها!"

## التعامل مع الأرقام العربية والإنجليزية:
- ١=1, ٢=2, ٣=3, ٤=4, ٥=5, ٦=6, ٧=7, ٨=8, ٩=9, ٠=0
- اعترف بالأرقام العربية والإنجليزية كإجابات صحيحة
- لا تتجاهل الإجابات المكتوبة بالأرقام العربية أبداً

## أمثلة على أسلوبك المحسن:
الطالب يسأل: "ما هو 8/8؟"
أنت ترد: "سؤال جيد! إذا كان لديك 8 قطع وقسمتها إلى 8 أجزاء متساوية، كم لكل جزء؟"
الطالب يجيب: "١" 
أنت ترد: "ممتاز! إجابة صحيحة تماماً! 8÷8 = 1. هذا مفهوم مهم - عندما نقسم أي رقم على نفسه نحصل دائماً على 1. هل تعرف لماذا؟"

## التعامل مع الصور:
عندما يرسل الطالب صورة:
1. **حلل الصورة بعناية** - ما نوع المسألة أو الدرس الظاهر فيها؟
2. **اشرح ما تراه أولاً** - "أشوف ��ي الصورة مسألة رياضية عن..."
3. **ادل الطالب خطوة بخطوة** - لا تعطي الحل مباشرة
4. **اطرح أسئلة توجيهية** - "شوف الرقم الأول في المسألة، إيش تلاحظ عليه؟"
5. **استخدم التشجيع** - "زين إنك استخدمت الصورة! هذا يساعدني أفهم أكثر"

## قواعد مهمة جداً:
- لا تفقد سياق ال��حادثة أبداً
- اعترف بالإجابات الصحي��ة فوراً واحتفل بها
- ابن على ما قال الطالب
- استخدم التشجيع المناسب
- اربط المفاهيم ببعضها
- إذا أجاب الطالب بشكل صحيح، قل "ممتاز!" أو "صحيح!" ثم ابن على إجابته

تذكر: أنت تبني محادثة تعليمية مترابطة، ليس مجرد إجابات منفصلة.`;

export const handler: Handler = async (event, context) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { message, sessionId, userId, image } = JSON.parse(event.body || "{}");

    if (!message && !image) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Message or image is required" }),
      };
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Check if OpenAI API key is available
    if (
      !process.env.OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY.includes("placeholder")
    ) {
      // Fallback to contextual mock responses if no API key
      const contextualResponse = getMockResponse(message);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          content: image ? "أشوف إنك أرسلت صورة! للأسف ما أقدر أحللها حالياً، بس يمكنك تساعدني تساعدك أكثر:\n\n• لو هي مسألة رياضية، اكتب المسألة بالكلمات\n• لو هي رسمة علمية، وصف لي و�� تشوف فيها\n• لو هي نص، انقل لي النص اللي تبي مساعدة فيه\n\nوأنا أساعدك خطوة بخطوة! 😊" : contextualResponse,
          isComplete: true,
          messageId: Date.now().toString(),
          sessionId: sessionId || "demo-session",
          userId: userId || "demo-user",
        }),
      };
    }

    // Prepare messages array
    const messages: any[] = [
      {
        role: "system",
        content: ARABIC_TUTOR_SYSTEM_PROMPT,
      }
    ];

    // Add user message with or without image
    if (image) {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: message || "ما الذي تريد أن تشرحه من هذه الصورة؟"
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${image}`
            }
          }
        ]
      });
    } else {
      messages.push({
        role: "user",
        content: message,
      });
    }

    // Make API call to OpenAI
    const completion = await openai.chat.completions.create({
      model: image ? "gpt-4o" : (process.env.AI_MODEL || "gpt-4o-mini"), // Use vision model for images
      messages,
      max_tokens: 800,
      temperature: 0.6,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const responseData = {
      content: completion.choices[0]?.message?.content || "عذراً، لم أتمكن من فهم سؤالك. يمكنك إعادة صياغته؟",
      isComplete: true,
      messageId: Date.now().toString(),
      sessionId: sessionId || "session-" + Date.now(),
      userId: userId || "user-" + Date.now(),
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData),
    };
  } catch (error) {
    console.error("Chat API error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        message: "عذراً، حدث خطأ في النظام. يرجى المحاولة لاحقاً.",
      }),
    };
  }
};

// Helper function for contextual mock responses
function getMockResponse(message: string): string {
  const messageText = message.toLowerCase();
  
  if (messageText.includes('مذاكرة') || messageText.includes('دراسة') || messageText.includes('تعلم')) {
    return 'سؤال ممتاز حول المذاكرة! لنبدأ بفهم طبيعة دراستك أولاً. هل تدرس مادة معينة ��ثل الرياضيات أو العلوم؟ وما التحدي الذي تواجهه في المذاكرة تحديداً؟';
  } else if (messageText.includes('رياضيات') || messageText.includes('حساب') || messageText.includes('��بر')) {
    return 'الرياضيات موضوع رائع! ما نوع المسألة أو المفهوم الذي تريد فهمه؟ هل هو في الجبر، الهندسة، أم شيء آخر؟';
  } else if (messageText.includes('علوم') || messageText.includes('فيزياء') || messageText.includes('كيمياء')) {
    return 'العلوم مجال واسع ومثير! أي فرع من العلوم تريد أن نتناوله؟ وما المفهوم المحدد الذي تحتاج مساعدة فيه؟';
  } else if (messageText.includes('عربية') || messageText.includes('لغة') || messageText.includes('نحو')) {
    return 'اللغة العربية لغة جميلة وغنية! ما الموضوع الذي تريد التركيز عليه؟ النحو، الصرف، الأدب، أم شيء آخر؟';
  } else {
    return 'أهلاً بك! أنا هنا لمساعدتك في التعلم. يمكنك أن تسألني عن أ�� موضوع دراسي وسأوجهك خطوة بخطوة للوصول للفهم. ما الموضوع الذي تريد أن نتناوله اليوم؟';
  }
}
