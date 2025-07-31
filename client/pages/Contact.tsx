import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navigation />
      
      <main className="flex-1 bg-neutral-50" dir="rtl">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              تواصل معنا
            </h1>
            <p className="text-xl text-neutral-500 leading-relaxed max-w-2xl mx-auto">
              نحن هنا لمساعدتك. تواصل معنا إذا كان لديك أي أسئلة أو اقتراحات حول دِراسة
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Cards */}
              <div className="space-y-8">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-neutral-200 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900">البريد الإلكتروني</h3>
                      <p className="text-neutral-500">راسلنا عبر البريد الإلكتروني</p>
                    </div>
                  </div>
                  <a href="mailto:info@drasah.com" className="text-lg text-primary hover:text-primary/80 transition-colors">
                    info@drasah.com
                  </a>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-lg border border-neutral-200 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center">
                      <Phone className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900">الهاتف</h3>
                      <p className="text-neutral-500">اتصل بنا للدعم الفوري</p>
                    </div>
                  </div>
                  <a href="tel:+966501234567" className="text-lg text-primary hover:text-primary/80 transition-colors">
                    +966 50 123 4567
                  </a>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-lg border border-neutral-200 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900">الموقع</h3>
                      <p className="text-neutral-500">مقرنا الرئيسي</p>
                    </div>
                  </div>
                  <p className="text-lg text-neutral-700">
                    الرياض، المملكة العربية السعودية
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-neutral-200">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">أرسل رسالة</h3>
                    <p className="text-neutral-500">سنرد عليك في أقرب وقت ممكن</p>
                  </div>
                </div>

                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-lg font-medium text-neutral-900 mb-2">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                      placeholder="أدخل اسمك الكامل"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-lg font-medium text-neutral-900 mb-2">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-lg font-medium text-neutral-900 mb-2">
                      الموضوع
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                      placeholder="موضوع الرسالة"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-lg font-medium text-neutral-900 mb-2">
                      الرسالة
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg resize-none"
                      placeholder="اكتب رسالتك هنا..."
                      dir="rtl"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white px-6 py-4 rounded-xl hover:bg-primary/90 hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    إرسال الرسالة
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
