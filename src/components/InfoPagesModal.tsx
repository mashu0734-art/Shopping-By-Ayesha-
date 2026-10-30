import React from 'react';
import { X, ShieldCheck, Mail, MessageCircle, RefreshCw, FileText, Lock, Sparkles, Heart } from 'lucide-react';
import { BRAND } from '../data/constants';
import { Language } from '../types';

interface InfoPagesModalProps {
  page: 'about' | 'contact' | 'returns' | 'privacy' | 'terms' | null;
  onClose: () => void;
  language?: Language;
}

export const InfoPagesModal: React.FC<InfoPagesModalProps> = ({ page, onClose, language = 'ur' }) => {
  if (!page) return null;

  const renderContent = () => {
    switch (page) {
      case 'about':
        return (
          <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#171017] border border-[#FF168F]/40">
              <div className="w-12 h-12 rounded-full p-[1.5px] bg-gradient-to-tr from-[#FF168F] to-[#FF2D9B] shadow-[0_0_15px_#FF168F] shrink-0">
                <img src={BRAND.logoImage} alt={BRAND.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white neon-text-glow">{BRAND.name}</h3>
                <span className="text-[10px] text-[#FF8BC8] uppercase tracking-wider font-semibold">
                  Luxury Handcrafted Dresses · Fine Jewellery · Designer Bags
                </span>
              </div>
            </div>

            <p>
              شاپنگ بائے عائشہ (Shopping By Ayesha) پاکستان کا ایک اعلیٰ معیار اور انوکھا فیشن برانڈ ہے جو خواتین کے لیے ہاتھ کی نفیس کڑھائی والے سوٹس (ونٹر، سمر اور فینسی ڈریسز)، ہاتھ سے بنے ہوئے شاندار جیولری اور امپورٹڈ فینسی ہینڈ بیگز فراہم کرتا ہے۔
            </p>

            <p>
              ہماری تمام پروڈکٹس 100٪ کوالٹی گارنٹی اور 100٪ کیش آن ڈیلیوری (Cash On Delivery) پر پاکستان بھر میں دستیاب ہیں۔ ہمارا مقصد ہر خاتون کو جدید اور باوقار انداز فراہم کرنا ہے۔
            </p>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 font-bold">
              ✓ 100% کیش آن ڈیلیوری | کوئی ایڈوانس پیمنٹ نہیں!
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4 text-xs text-zinc-300">
            <p className="text-zinc-400">
              کسی بھی قسم کے سوالات، آرڈر کی معلومات یا ہیلپ کے لیے ہم سے رابطہ کریں:
            </p>

            <a
              href={`https://wa.me/${BRAND.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 hover:border-emerald-400 text-white transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">فوری آرڈر و واٹس ایپ ہیلپ:</span>
                <span className="font-mono text-sm font-extrabold text-white group-hover:text-emerald-300">
                  {BRAND.contact.whatsappFormatted}
                </span>
              </div>
            </a>

            <a
              href={`mailto:${BRAND.contact.email}`}
              className="flex items-center gap-3 p-4 rounded-2xl bg-[#171017] border border-[#2e1a2b] hover:border-[#FF168F] text-white transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FF168F]/20 flex items-center justify-center text-[#FF168F] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase block">ای میل / Gmail Support:</span>
                <span className="font-mono text-xs font-bold text-white group-hover:text-[#FF168F]">
                  {BRAND.contact.email}
                </span>
              </div>
            </a>
          </div>
        );

      case 'returns':
        return (
          <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
            <h4 className="font-bold text-white text-sm">🔄 7 روز کی ریٹرن اور ایکسچینج پالیسی:</h4>
            <p>
              اگر آپ کو موصول ہونے والا سوٹ، جیولری یا بیگ کسی بھی قسم کے نقصان (Damage) یا غلط رنگ کا نکلے تو آپ 7 دنوں کے اندر اندر اسے باآسانی تبدیل (Exchange) یا ریٹرن کروا سکتے ہیں۔
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400">
              <li>پروڈکٹ کا غیر استعمال شدہ اور اصل پیکنگ میں ہونا ضروری ہے۔</li>
              <li>تبدیلی کے لیے واٹس ایپ نمبر {BRAND.contact.whatsappFormatted} پر تصویر بھیجیں۔</li>
            </ul>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
            <h4 className="font-bold text-white text-sm">🔒 پرائیویسی اور سیکیورٹی پالیسی:</h4>
            <p>
              شاپنگ بائے عائشہ آپ کے تمام ذاتی و ڈلیوری کوائف (نام، فون نمبر، پتہ) کو مکمل طور پر محفوظ رکھتی ہے۔ ہم آپ کی معلومات کسی بھی تیسرے فریق کو فروخت یا شیئر نہیں کرتے۔
            </p>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
            <h4 className="font-bold text-white text-sm">📜 شرائط و ضوابط (Terms & Conditions):</h4>
            <p>
              1. تمام آرڈرز صرف کیش آن ڈیلیوری پر بھیجے جاتے ہیں۔ پارسل کھول کر چیک کرنے کی سہولت ڈلیوری رائڈر کے قوانین کے مطابق دی جاتی ہے۔
            </p>
            <p>
              2. ایک ہی پروڈکٹ کی ملٹیپل کوانٹٹی پر صرف ایک بار Rs. 300 ڈلیوری چارج لاگو ہوگا جبکہ مختلف پروڈکٹس پر الگ ڈلیوری چارجز شامل ہوں گے۔
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const titles = {
    about: 'ہمارے بارے میں (About Us)',
    contact: 'ہم سے رابطہ کریں (Contact Us)',
    returns: 'ریٹرن و ایکسچینج پالیسی (Return Policy)',
    privacy: 'پرائیویسی پالیسی (Privacy Policy)',
    terms: 'شرائط و ضوابط (Terms & Conditions)',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#080509] border border-[#FF168F]/60 rounded-2xl shadow-[0_0_50px_rgba(255,22,143,0.35)] overflow-hidden my-auto">
        <div className="p-4 border-b border-[#2e1a2b] bg-[#171017] flex items-center justify-between">
          <h3 className="font-serif font-bold text-white text-sm">{titles[page]}</h3>
          <button onClick={onClose} className="p-1 rounded text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};
