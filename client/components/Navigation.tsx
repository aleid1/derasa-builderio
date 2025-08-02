import { useNavigate, useLocation } from "react-router-dom";
import { User, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../lib/auth-context";
import AuthModal from "./AuthModal";

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut, isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "الرئيسية" },
    { path: "/chat", label: "المحادثة" },
    { path: "/history", label: "المحادثات" },
  ];

  return (
    <nav
      className="bg-white border-b border-neutral-200 sticky top-0 z-50"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center group focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Ffe102fa1240345669888b6698e27bb27%2F49f3aa3e3a324a28b9e41587038c40c6?format=webp&width=80"
                alt="دِراسة Logo"
                className="w-10 h-10 ml-3 group-hover:scale-105 transition-transform rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling.style.display = "flex";
                }}
              />
              <div
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center ml-3 group-hover:scale-105 transition-transform hidden"
                style={{ display: "none" }}
              >
                <span className="text-white font-bold text-lg">د</span>
              </div>
              <span className="text-2xl font-bold text-neutral-900 group-hover:text-primary transition-colors">
                دِراسة
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1 space-x-reverse">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] min-w-[44px] ${
                    isActive(item.path)
                      ? "text-primary font-bold bg-primary/10 border-b-2 border-primary"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  } focus:outline-none focus:ring-2 focus:ring-primary`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => navigate("/features")}
                className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary"
              >
                المزايا
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary"
              >
                تواصل معنا
              </button>
            </div>
          </div>

          {/* Auth Button */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-neutral-700 text-sm">
                  مرحباً، {user?.name}
                </span>
                <button
                  onClick={signOut}
                  className="flex items-center bg-neutral-100 text-neutral-700 px-4 py-2.5 rounded-xl hover:bg-neutral-200 transition-all font-medium min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <LogOut className="w-4 h-4 ml-2" />
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all font-medium min-h-[44px] hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <User className="w-4 h-4 ml-2" />
                تسجيل الدخول
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-neutral-600 hover:text-neutral-900 p-2 rounded-lg hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-right px-4 py-3 rounded-lg text-base font-medium min-h-[44px] transition-all ${
                    isActive(item.path)
                      ? "text-primary font-bold bg-primary/10"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  } focus:outline-none focus:ring-2 focus:ring-primary`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  navigate("/features");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-right px-4 py-3 rounded-lg text-base font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 min-h-[44px] transition-all focus:outline-none focus:ring-2 focus:ring-primary"
              >
                المزايا
              </button>
              <button
                onClick={() => {
                  navigate("/contact");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-right px-4 py-3 rounded-lg text-base font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 min-h-[44px] transition-all focus:outline-none focus:ring-2 focus:ring-primary"
              >
                تواصل معنا
              </button>
              {isAuthenticated ? (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <div className="text-neutral-700 text-sm mb-3 px-4">
                    مرحباً، {user?.name}
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center bg-neutral-100 text-neutral-700 px-4 py-3 rounded-xl hover:bg-neutral-200 transition-all font-medium w-full min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <LogOut className="w-4 h-4 ml-2" />
                    تسجيل الخروج
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center bg-primary text-white px-4 py-3 rounded-xl hover:bg-primary/90 transition-all font-medium mt-4 w-full min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <User className="w-4 h-4 ml-2" />
                  تسجيل الدخول
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </nav>
  );
}
