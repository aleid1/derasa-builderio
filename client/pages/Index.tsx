import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";

export default function Index() {
  return (
    <div className="h-screen flex">
      <Sidebar />
      <MainContent />
    </div>
  );
}
