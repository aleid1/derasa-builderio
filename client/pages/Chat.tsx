import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import LiveChatInterface from "../components/LiveChatInterface";
import ApiTest from "../components/ApiTest";

export default function Chat() {
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navigation />

      <main className="flex-1 bg-neutral-50" dir="rtl">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <ApiTest />
          <div className="h-[calc(100vh-12rem)] mt-4">
            <LiveChatInterface />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
