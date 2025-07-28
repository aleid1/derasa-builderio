import MainContent from "../components/MainContent";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navigation />
      <MainContent />
      <Footer />
    </div>
  );
}
