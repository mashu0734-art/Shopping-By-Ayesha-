import React from 'react';
import { X, ShieldCheck, Mail, MessageCircle, RefreshCw, FileText, Lock, Sparkles, Heart } from 'lucide-react';
import { BRAND } from '../data/constants';
import { Language } from '../types';

interface InfoPagesModalProps {
  page: 'about' | 'contact' | 'returns' | 'privacy' | 'terms' | null;
  onClose: () => void;
  language?: Language;
}

export const InfoPagesModal: React.FC<InfoPagesModalProps> = ({ page, onClose, language = 'en' }) => {
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
                  {language === 'ur'
                    ? 'ہاتھ سے تیار کردہ ملبوسات · شاہی زیورات · ڈیزائنر بیگز'
                    : 'Luxury Handcrafted Dresses · Fine Jewellery · Designer Bags'}
                </span>
              </div>
            </div>

            <p>
              {language === 'ur'
                ? 'شاپنگ بائے عائشہ پاکستان کا ایک اعلیٰ معیار فیشن برانڈ ہے جو خواتین کے لیے کڑھائی والے سوٹس، شاہی جیولری اور امپورٹڈ فینسی بیگز فراہم کرتا ہے۔'
                : 'Shopping By Ayesha is a premier Pakistani fashion brand delivering handcrafted embroidered dresses, royal jewellery, and imported luxury bags.'}
            </p>

            <p>
              {language === 'ur'
                ? 'ہماری تمام پروڈکٹس 100٪ کوالٹی گارنٹی اور 100٪ کیش آن ڈیلیوری پر پاکستان بھر میں دستیاب ہیں۔'
                : 'All our creations come with a 100% quality guarantee and are delivered nationwide via 100% Cash on Delivery.'}
            </p>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 font-bold">
              ✓ {language === 'ur' ? '100% کیش آن ڈیلیوری | کوئی ایڈوانس پیمنٹ نہیں!' : '100% Cash On Delivery | Zero Advance Payment Needed!'}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4 text-xs text-zinc-300">
            <p className="text-zinc-400">
              {language === 'ur'
                ? 'کسی بھی سوال، آرڈر کی معلومات یا ہیلپ کے لیے ہم سے رابطہ کریں:'
                : 'For any questions, order updates, or assistance, contact us:'}
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
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                  {language === 'ur' ? 'فوری آرڈر و واٹس ایپ ہیلپ' : 'WhatsApp Support & Order'}
                </span>
                <span className="text-xs font-extrabold text-white group-hover:text-emerald-300">
                  {language === 'ur' ? 'برائے راست چیٹ کریں' : 'Click to Chat on WhatsApp'}
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
                <span className="text-[10px] text-zinc-500 font-bold uppercase block">
                  {language === 'ur' ? 'ای میل سپورٹ:' : 'Email Support:'}
                </span>
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
            <h4 className="font-bold text-white text-sm">
              🔄 {language === 'ur' ? '7 روز کی ریٹرن اور ایکسچینج پالیسی:' : '7-Day Easy Return & Exchange Policy:'}
            </h4>
            <p>
              {language === 'ur'
                ? 'اگر موصول ہونے والے پارسل میں کوئی مسئلہ یا خرابی ہو تو آپ 7 دنوں کے اندر باآسانی تبدیل یا ریٹرن کروا سکتے ہیں۔'
                : 'If your parcel arrives with any damage or defect, you can exchange or return it within 7 days.'}
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400">
              <li>{language === 'ur' ? 'پروڈکٹ کا غیر استعمال شدہ اور اصل پیکنگ میں ہونا ضروری ہے۔' : 'The item must be unused and in original packaging.'}</li>
              <li>{language === 'ur' ? 'تبدیلی کے لیے ہمارے واٹس ایپ بٹن پر رابطہ کریں۔' : 'For returns, simply contact us via WhatsApp Support.'}</li>
            </ul>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
            <h4 className="font-bold text-white text-sm">
              🔒 {language === 'ur' ? 'پرائیویسی اور سیکیورٹی پالیسی:' : 'Privacy & Data Protection Policy:'}
            </h4>
            <p>
              {language === 'ur'
                ? 'شاپنگ بائے عائشہ آپ کے تمام ذاتی و ڈلیوری کوائف (نام، فون نمبر، پتہ) کو مکمل طور پر محفوظ رکھتی ہے۔'
                : 'Shopping By Ayesha securely protects all customer information (name, phone, delivery address).'}
            </p>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
            <h4 className="font-bold text-white text-sm">
              📜 {language === 'ur' ? 'شرائط و ضوابط:' : 'Terms & Conditions:'}
            </h4>
            <p>
              {language === 'ur'
                ? '1. تمام آرڈرز صرف کیش آن ڈیلیوری پر بھیجے جاتے ہیں۔'
                : '1. All orders are strictly dispatched on Cash on Delivery.'}
            </p>
            <p>
              {language === 'ur'
                ? '2. ایک ہی پروڈکٹ کی ملٹیپل کوانٹٹی پر صرف ایک بار Rs. 300 ڈلیوری چارج لاگو ہوگا۔'
                : '2. Delivery fee of Rs. 300 is charged once per distinct product.'}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const titles = {
    about: language === 'ur' ? 'ہمارے بارے میں' : 'About Us',
    contact: language === 'ur' ? 'ہم سے رابطہ کریں' : 'Contact Us',
    returns: language === 'ur' ? 'ریٹرن و ایکسچینج پالیسی' : 'Return & Exchange Policy',
    privacy: language === 'ur' ? 'پرائیویسی پالیسی' : 'Privacy Policy',
    terms: language === 'ur' ? 'شرائط و ضوابط' : 'Terms & Conditions',
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
