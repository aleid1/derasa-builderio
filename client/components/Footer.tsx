import { Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[#2E7D32] rounded-lg flex items-center justify-center ml-3">
                <span className="text-white font-bold text-xl">د</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">درّسة</span>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              منصة تعليمية ذكية تستخدم الذكاء الاصطناعي لتوفير تجربة تعلم مخصصة وتفاعلية. 
              نساعدك في تحقيق أهدافك التعليمية بطريقة سهلة وممتعة.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-[#2E7D32] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#2E7D32] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#2E7D32] transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-[#2E7D32] transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="/chat" className="text-gray-600 hover:text-[#2E7D32] transition-colors">
                  المحادثة
                </a>
              </li>
              <li>
                <a href="/learn" className="text-gray-600 hover:text-[#2E7D32] transition-colors">
                  التعلم
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-600 hover:text-[#2E7D32] transition-colors">
                  المزايا
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#2E7D32] transition-colors">
                  الأسئلة الشائعة
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-gray-400 ml-3" />
                <span className="text-gray-600">info@dorrasa.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 ml-3" />
                <span className="text-gray-600">+966 50 123 4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-400 ml-3" />
                <span className="text-gray-600">الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 درّسة. جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-6 space-x-reverse mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-[#2E7D32] text-sm transition-colors">
                سياسة الخصوصية
              </a>
              <a href="#" className="text-gray-500 hover:text-[#2E7D32] text-sm transition-colors">
                شروط الاستخدام
              </a>
              <a href="#" className="text-gray-500 hover:text-[#2E7D32] text-sm transition-colors">
                اتفاقية الخدمة
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
