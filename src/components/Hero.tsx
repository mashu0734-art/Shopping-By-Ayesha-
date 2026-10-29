import React from 'react';
import { BRAND } from '../data/constants';
import { Language } from '../types';
import { useTranslation } from '../translations';

interface HeroProps {
  language: Language;
  onExploreCollection: () => void;
  onSelectCategory: (category: string, subcategory?: string) => void;
  onOpenSidebar: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onExploreCollection,
  onSelectCategory,
  onOpenSidebar,
}) => {
  const t = useTranslation(language);

  return (
    <section className="relative overflow-hidden bg-[#080509] pt-6 pb-12 sm:pt-10 sm:pb-16 border-b border-[#2e1a2b]">
      {/* Ambient Neon Pink Lighting Glow Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#FF168F]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[350px] h-[350px] bg-[#FF2D9B]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Central Logo Emblem Presentation */}
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-2 bg-gradient-to-tr from-[#FF168F] via-[#FF8BC8] to-[#FF2D9B] shadow-[0_0_40px_rgba(255,22,143,0.5),0_0_80px_rgba(255,45,155,0.25)]">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#080509] p-2 border border-[#FF168F]/30 flex items-center justify-center">
              <img
                src={BRAND.logoImage}
                alt="Shopping By Ayesha"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>

          <div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white neon-text-glow">
              {BRAND.name}
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-[#FF8BC8] font-semibold mt-1">
              {t.brandSubtitle}
            </p>
          </div>
        </div>

        {/* The Exact Requested Announcement Card Under Shopping By Ayesha */}
        <div className="relative rounded-2xl bg-[#171017] border-2 border-[#FF168F] shadow-[0_0_30px_rgba(255,22,143,0.35)] p-4 sm:p-8 text-center space-y-4 max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
          
          {/* Top Decorative Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#080509] border border-[#FF168F] shadow-[0_0_12px_rgba(255,22,143,0.4)]">
            <span className="w-2 h-2 rounded-full bg-[#FF168F] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFD6EA]">
              {language === 'ur' ? '100% کیش آن ڈیلیوری سہولت (Cash on Delivery)' : '100% Cash On Delivery Only'}
            </span>
          </div>

          {/* Greeting - Completed in ONE single line */}
          <div className="w-full flex items-center justify-center overflow-x-hidden">
            <h2
              className="text-[12px] xs:text-[14px] sm:text-xl md:text-2xl font-bold text-white tracking-tight sm:tracking-normal whitespace-nowrap leading-tight drop-shadow-[0_0_10px_rgba(255,22,143,0.5)] select-none text-center"
              dir="rtl"
            >
              {t.hero.noticeGreeting}
            </h2>
          </div>

          {/* Notice Body */}
          <p className="text-xs sm:text-base text-zinc-100 font-medium leading-relaxed sm:leading-loose max-w-xl mx-auto" dir={language === 'ur' ? 'rtl' : 'ltr'}>
            {t.hero.noticeBody}
          </p>

        </div>

        {/* Quick Department Portals (Dresses, Jewellery, Bags) with Direct Subcategories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Dresses Portal */}
          <div className="p-4 rounded-xl bg-[#171017] border border-[#2e1a2b] hover:border-[#FF168F]/60 transition-all space-y-2.5 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xl">👗</span>
              <span className="text-[10px] uppercase font-bold text-[#FF8BC8] bg-[#080509] px-2 py-0.5 rounded border border-[#2e1a2b]">
                {language === 'ur' ? 'ملبوسات' : 'Dresses'}
              </span>
            </div>
            <h3 className="font-serif text-base font-bold text-white">
              {language === 'ur' ? 'لیڈیز ڈریسز (Dresses)' : 'Couture Dresses'}
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { name: language === 'ur' ? '❄️ ونٹر (Winter)' : '❄️ Winter', sub: 'Winter' },
                { name: language === 'ur' ? '☀️ سمر (Summer)' : '☀️ Summer', sub: 'Summer' },
                { name: language === 'ur' ? '✨ فینسی (Fancy)' : '✨ Fancy', sub: 'Fancy' },
              ].map((s) => (
                <button
                  key={s.sub}
                  onClick={() => onSelectCategory('Dresses', s.sub)}
                  className="px-2.5 py-1 rounded bg-[#080509] border border-[#2e1a2b] hover:border-[#FF168F] text-[11px] text-zinc-300 hover:text-white transition-colors"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Jewellery Portal */}
          <div className="p-4 rounded-xl bg-[#171017] border border-[#2e1a2b] hover:border-[#FF168F]/60 transition-all space-y-2.5 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xl">💎</span>
              <span className="text-[10px] uppercase font-bold text-[#FF8BC8] bg-[#080509] px-2 py-0.5 rounded border border-[#2e1a2b]">
                {language === 'ur' ? 'زیورات' : 'Jewellery'}
              </span>
            </div>
            <h3 className="font-serif text-base font-bold text-white">
              {language === 'ur' ? 'شاہی جیولری (Jewellery)' : 'Royal Jewellery'}
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { name: language === 'ur' ? '✨ جھمکے (Jhumkay)' : '✨ Jhumkay', sub: 'Jhumkey' },
                { name: language === 'ur' ? '💎 ہار (Necklace)' : '💎 Necklace', sub: 'Necklace' },
                { name: language === 'ur' ? '🌟 بالیاں (Earrings)' : '🌟 Earrings', sub: 'Earrings' },
                { name: language === 'ur' ? '💍 انگوٹھیاں (Rings)' : '💍 Rings', sub: 'Ring' },
                { name: language === 'ur' ? '👑 مکمل سیٹ' : '👑 Complete Set', sub: 'Complete Set' },
              ].map((s) => (
                <button
                  key={s.sub}
                  onClick={() => onSelectCategory('Jewellery', s.sub)}
                  className="px-2.5 py-1 rounded bg-[#080509] border border-[#2e1a2b] hover:border-[#FF168F] text-[11px] text-zinc-300 hover:text-white transition-colors"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Bags Portal */}
          <div className="p-4 rounded-xl bg-[#171017] border border-[#2e1a2b] hover:border-[#FF168F]/60 transition-all space-y-2.5 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xl">👜</span>
              <span className="text-[10px] uppercase font-bold text-[#FF8BC8] bg-[#080509] px-2 py-0.5 rounded border border-[#2e1a2b]">
                {language === 'ur' ? 'بیگز' : 'Bags'}
              </span>
            </div>
            <h3 className="font-serif text-base font-bold text-white">
              {language === 'ur' ? 'ڈیزائنر بیگز (Bags)' : 'Designer Bags'}
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { name: language === 'ur' ? '👛 کلچز (Clutches)' : '👛 Clutches', sub: 'Clutches' },
                { name: language === 'ur' ? '👜 ہینڈ بیگز' : '👜 Handbags', sub: 'Handbags' },
                { name: language === 'ur' ? '✨ پارٹی بیگز' : '✨ Party Bags', sub: 'Party Bags' },
              ].map((s) => (
                <button
                  key={s.sub}
                  onClick={() => onSelectCategory('Bags', s.sub)}
                  className="px-2.5 py-1 rounded bg-[#080509] border border-[#2e1a2b] hover:border-[#FF168F] text-[11px] text-zinc-300 hover:text-white transition-colors"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
