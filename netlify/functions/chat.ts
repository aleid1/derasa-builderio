import { Handler } from "@netlify/functions";
import { dbService } from "./db-service.js";
import { neon } from "@netlify/neon";

const sql = neon();

// Kid-friendly Arabic tutoring system prompt for the AI
const ARABIC_TUTOR_SYSTEM_PROMPT = `أنت "دراسة" 🤖 - معلم ذكي ودود ومرح! أنت صديق الأطفال المفضل للتعلم.

شخصيتك:
- 🌈 مرح ومتحمس للتعلم
- 😊 صبور ومشجع دائماً
- 🎉 تستخدم الرموز التعبيرية والكلمات المشجعة
- 🏆 تحتفل بكل إنجاز صغير

أسلوبك مع الأطفال:
- ��ا تعطي الإجابة مباشرة، بل تجعل التعلم كاللعبة الممتعة
- استخدم كلمات بسيطة ومناسبة للأطفال
- اطرح أسئلة مثيرة وممتعة تحفز الفضول
- استخدم أمثلة من عالم الطفل (ألعاب، قصص، أشياء يحبها)
- امدح الطفل عند كل محاولة: "رائع!" "أحسنت!" "ممتاز!"
- اجعل التعلم كالمغامرة الشيقة

أمثلة على أسلوبك:
الطفل: "كيف أحل هذه المسألة؟"
أنت: "🎯 واو! مسألة ممتعة! دعنا نصبح مثل المحققين الأذكياء! 🕵️ أولاً، ما رأيك لو نقرأها معاً ونرى ما هي الأرقام الموجودة؟ 🔢"

الطفل: "ما هو التمثيل الضوئي؟"
أنت: "🌱 سؤال رائع! هل تعرف أن النباتات تأكل بطريقة سحرية؟ ✨ تخيل معي... ما رأيك لو نكتشف كيف تحصل النباتات في حديقتك على طعامها؟ 🌞🍃"

تذكر: أنت صديق الطفل المرح الذي يجعل التعلم مغامرة ممتعة! 🚀`;

const generateAIResponse = async (message: string): Promise<string> => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn("OpenAI API key not found, using fallback response");
    return "أعتذر، لا يمكنني الوصول لخدمة الذكاء الاصطناعي في الوقت الحالي. يرجى المحاولة لاحقاً.";
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: ARABIC_TUTOR_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return (
      data.choices[0]?.message?.content ||
      "أعتذر، لم أتمكن من معالجة سؤالك. يرجى إعادة الصياغة."
    );
  } catch (error) {
    console.error("OpenAI API error:", error);

    // Fallback to mock responses if API fails
    const fallbackResponses = [
      "أعتذر، واجهت مشكلة تقنية. يرجى إعادة المحاولة.",
      "عذراً، لا أستطيع الإجابة في الوقت الحالي. هل يمكنك إعادة صياغة سؤالك؟",
      "أواجه صعوبة في الاتصال. يرجى المحاولة مرة أخرى بعد قليل.",
    ];

    return fallbackResponses[
      Math.floor(Math.random() * fallbackResponses.length)
    ];
  }
};

// Helper function to detect subject area from message
function detectSubjectArea(message: string): string | null {
  const messageWords = message.toLowerCase();

  if (
    messageWords.includes("رياض") ||
    messageWords.includes("حساب") ||
    messageWords.includes("جبر") ||
    messageWords.includes("هندسة")
  ) {
    return "رياضيات";
  } else if (
    messageWords.includes("علوم") ||
    messageWords.includes("فيزياء") ||
    messageWords.includes("كيمياء") ||
    messageWords.includes("أحياء")
  ) {
    return "علوم";
  } else if (
    messageWords.includes("لغة") ||
    messageWords.includes("نحو") ||
    messageWords.includes("أدب") ||
    messageWords.includes("قواعد")
  ) {
    return "لغة عربية";
  } else if (
    messageWords.includes("انجليزي") ||
    messageWords.includes("english")
  ) {
    return "لغة انجليزية";
  } else if (
    messageWords.includes("تاريخ") ||
    messageWords.includes("جغرافيا") ||
    messageWords.includes("اجتماعيات")
  ) {
    return "دراسات اجتماعية";
  }

  return null;
}

// Initialize database tables if they don't exist
async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE,
        name TEXT NOT NULL,
        avatar_url TEXT,
        auth_provider TEXT DEFAULT 'email',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL DEFAULT 'محادثة جديدة',
        subject_area TEXT,
        grade_level TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
        message_type TEXT DEFAULT 'text',
        metadata JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        subject_area TEXT NOT NULL,
        topic TEXT NOT NULL,
        skill_level INTEGER DEFAULT 1 CHECK (skill_level BETWEEN 1 AND 10),
        sessions_count INTEGER DEFAULT 0,
        last_session_at TIMESTAMPTZ,
        strengths TEXT[],
        improvement_areas TEXT[],
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, subject_area, topic)
      )
    `;

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.log('Database initialization:', error.message);
  }
}

export const handler: Handler = async (event, context) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "text/plain; charset=utf-8",
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
      body: "Method Not Allowed",
    };
  }

  try {
    // Initialize database tables on first run
    await initializeDatabase();

    const { message, sessionId, userId } = JSON.parse(event.body || "{}");

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Message is required" }),
      };
    }

    // Get or create user (for now, create guest if no userId provided)
    let user;
    if (userId) {
      user = await dbService.getUserById(userId);
      if (!user) {
        user = await dbService.createGuestUser();
      }
    } else {
      user = await dbService.createGuestUser();
    }

    // Get or create chat session
    let session;
    if (sessionId) {
      session = await dbService.getChatSession(sessionId);
      if (!session) {
        session = await dbService.createChatSession(user.id);
      }
    } else {
      session = await dbService.createChatSession(user.id);
    }

    // Save user message to database
    const userMessage = await dbService.addChatMessage(
      session.id,
      message,
      "user",
    );

    // Generate AI response
    const aiResponse = await generateAIResponse(message);

    // Save AI response to database
    const assistantMessage = await dbService.addChatMessage(
      session.id,
      aiResponse,
      "assistant",
    );

    // Analyze subject area from message for progress tracking
    const subjectArea = detectSubjectArea(message);
    if (subjectArea) {
      await dbService.updateUserProgress(user.id, subjectArea, "general");
    }

    const streamingData = {
      content: aiResponse,
      isComplete: true,
      messageId: assistantMessage.id,
      sessionId: session.id,
      userId: user.id,
    };

    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(streamingData),
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
