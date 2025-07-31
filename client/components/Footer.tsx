import { Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200" dir="rtl">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Ffe102fa1240345669888b6698e27bb27%2F49f3aa3e3a324a28b9e41587038c40c6?format=webp&width=96"
                alt="دِراسة Logo"
                className="w-12 h-12 ml-4 rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              <div
                className="w-12 h-12 bg-primary rounded-full flex items-center justify-center ml-4 hidden"
                style={{ display: 'none' }}
              >
                <span className="text-white font-bold text-xl">د</span>
              </div>
              <span className="text-3xl font-bold text-neutral-900">دِراسة</span>
            </div>
            <p className="text-neutral-500 mb-8 leading-relaxed text-lg max-w-md">
              منصة تعليم��ة ذكية تستخدم الذكاء الاصطناعي لتوفير تجربة تعلم مخصصة وتفاعلية.
              نساعدك في تحقيق أهدافك التعليمية بطريقة سهلة وممتعة.
            </p>
            <div className="flex space-x-6 space-x-reverse">
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors duration-200 p-2 hover:bg-primary/10 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors duration-200 p-2 hover:bg-primary/10 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors duration-200 p-2 hover:bg-primary/10 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center">
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-neutral-900 mb-6">روابط سريعة</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-neutral-500 hover:text-primary transition-colors duration-200 text-lg min-h-[44px] flex items-center">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="/chat" className="text-neutral-500 hover:text-primary transition-colors duration-200 text-lg min-h-[44px] flex items-center">
                  المحادثة
                </a>
              </li>
              <li>
                <a href="/features" className="text-neutral-500 hover:text-primary transition-colors duration-200 text-lg min-h-[44px] flex items-center">
                  المزايا
                </a>
              </li>
              <li>
                <a href="/contact" className="text-neutral-500 hover:text-primary transition-colors duration-200 text-lg min-h-[44px] flex items-center">
                  تواصل معنا
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-500 hover:text-primary transition-colors duration-200 text-lg min-h-[44px] flex items-center">
                  الأسئلة الشائعة
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-neutral-900 mb-6">تواصل معنا</h3>
            <div className="space-y-4">
              <div className="flex items-center min-h-[44px]">
                <Mail className="w-5 h-5 text-neutral-400 ml-4" />
                <span className="text-neutral-500 text-lg">info@dorrasa.com</span>
              </div>
              <div className="flex items-center min-h-[44px]">
                <Phone className="w-5 h-5 text-neutral-400 ml-4" />
                <span className="text-neutral-500 text-lg">+966 50 123 4567</span>
              </div>
              <div className="flex items-center min-h-[44px]">
                <MapPin className="w-5 h-5 text-neutral-400 ml-4" />
                <span className="text-neutral-500 text-lg">الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-500 text-lg">
              © 2024 دِراسة. جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-8 space-x-reverse mt-6 md:mt-0">
              <a href="#" className="text-neutral-500 hover:text-primary text-lg transition-colors duration-200 min-h-[44px] flex items-center">
                سياسة الخصوصية
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary text-lg transition-colors duration-200 min-h-[44px] flex items-center">
                شروط الاستخدام
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary text-lg transition-colors duration-200 min-h-[44px] flex items-center">
                اتفاقية الخدمة
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
