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
  app.post("/.netlify/functions/simple-chat", (req, res) => {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Simple AI response for testing (same as Netlify function)
    const responses = [
      'ممتاز! دعني أساعدك خطوة بخطوة. ما هو السؤال تحديداً؟',
      'سؤال رائع! لنفكر في هذا معاً. ما رأيك نبدأ بالأساسيات؟',
      'أحسنت! هذا موضوع مهم. كيف يمكنني أن أوجهك للوصول للإجابة بنفسك؟'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const responseData = {
      content: randomResponse,
      isComplete: true,
      messageId: Date.now().toString(),
      sessionId: 'test-session',
      userId: 'test-user',
    };

    res.json(responseData);
  });

  return app;
}
