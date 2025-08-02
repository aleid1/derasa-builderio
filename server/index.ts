import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

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

  // Mock Netlify function for local development
  app.post("/.netlify/functions/simple-chat", async (req, res) => {
    try {
      const { message, sessionId, userId } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Use fallback responses for local development
      const responses = [
        "ممتاز! دعني أساعدك خطوة بخطوة. ما هو السؤال تحديداً؟",
        "سؤال رائع! لنفكر في هذا معاً. ما رأيك نبدأ بالأساسيات؟",
        "أحسنت! هذا موضوع مهم. كيف يمكنني أن أوجهك للوصول للإجابة بنفسك؟",
        "لنحلل هذا السؤال معاً. ما هو أول شيء تلاحظه في هذه المسألة؟",
        "فكرة ممتازة! الآن، ما رأيك لو جربنا طريقة أخرى؟",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const responseData = {
        content:
          randomResponse +
          "\n\n*ملاحظة: يتم استخدام ردود تجريبية في البيئة المحلية.*",
        isComplete: true,
        messageId: Date.now().toString(),
        sessionId: sessionId || "local-session",
        userId: userId || "local-user",
      };

      res.json(responseData);
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
