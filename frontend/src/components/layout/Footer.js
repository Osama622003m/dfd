import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold">
                م
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                مانجا بلس
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              أفضل منصة لقراءة المانجا باللغة العربية مع أحدث الفصول وأجمل التصاميم
            </p>
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
              <span>صُنع بـ</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>للقراء العرب</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/library" className="text-muted-foreground hover:text-foreground transition-colors">
                  المكتبة
                </Link>
              </li>
              <li>
                <Link to="/genres" className="text-muted-foreground hover:text-foreground transition-colors">
                  التصنيفات
                </Link>
              </li>
              <li>
                <Link to="/latest" className="text-muted-foreground hover:text-foreground transition-colors">
                  أحدث الإصدارات
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">التصنيفات الشائعة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/genre/action" className="text-muted-foreground hover:text-foreground transition-colors">
                  أكشن
                </Link>
              </li>
              <li>
                <Link to="/genre/adventure" className="text-muted-foreground hover:text-foreground transition-colors">
                  مغامرة
                </Link>
              </li>
              <li>
                <Link to="/genre/fantasy" className="text-muted-foreground hover:text-foreground transition-colors">
                  فانتازيا
                </Link>
              </li>
              <li>
                <Link to="/genre/romance" className="text-muted-foreground hover:text-foreground transition-colors">
                  رومانسي
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="font-semibold">تواصل معنا</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>contact@mangaplus.com</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 مانجا بلس. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center space-x-4 rtl:space-x-reverse mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              سياسة الخصوصية
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              شروط الاستخدام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;