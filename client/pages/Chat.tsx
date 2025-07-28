import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ChatInterface from "../components/ChatInterface";

export default function Chat() {
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navigation />
      <ChatInterface />
      <Footer />
    </div>
  );
}
