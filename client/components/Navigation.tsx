import { useNavigate } from "react-router-dom";
import { User, Menu } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#2E7D32] rounded-lg flex items-center justify-center ml-3">
                  <span className="text-white font-bold text-xl">د</span>
                </div>
                <span className="text-2xl font-bold text-gray-800">درّسة</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                الرئيسية
              </button>
              <button
                onClick={() => navigate('/chat')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                المحادثة
              </button>
              <button
                onClick={() => navigate('/learn')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                التعلم
              </button>
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                المزايا
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                تواصل معنا
              </a>
            </div>
          </div>

          {/* Login Button */}
          <div className="hidden md:block">
            <button className="flex items-center bg-[#2E7D32] text-white px-4 py-2 rounded-lg hover:bg-[#1B5E20] transition-colors font-medium">
              <User className="w-4 h-4 ml-2" />
              تسجيل الدخول
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
              <button
                onClick={() => {
                  navigate('/');
                  setIsMenuOpen(false);
                }}
                className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium w-full text-right"
              >
                الرئيسية
              </button>
              <button
                onClick={() => {
                  navigate('/chat');
                  setIsMenuOpen(false);
                }}
                className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium w-full text-right"
              >
                المحادثة
              </button>
              <button
                onClick={() => {
                  navigate('/learn');
                  setIsMenuOpen(false);
                }}
                className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium w-full text-right"
              >
                التعلم
              </button>
              <a
                href="#features"
                className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                المزايا
              </a>
              <a
                href="#contact"
                className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                تواصل معنا
              </a>
              <button className="flex items-center bg-[#2E7D32] text-white px-4 py-2 rounded-lg hover:bg-[#1B5E20] transition-colors font-medium mt-2 w-full justify-center">
                <User className="w-4 h-4 ml-2" />
                تسجيل الدخول
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
