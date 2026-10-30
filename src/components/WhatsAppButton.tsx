import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BRAND } from '../data/constants';
import { Language } from '../types';
import { useTranslation } from '../translations';

interface WhatsAppButtonProps {
  language?: Language;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ language = 'en' }) => {
  const t = useTranslation(language);

  const handleClick = () => {
    const text = encodeURIComponent(t.whatsapp.prefillMsg);
    window.open(`https://wa.me/${BRAND.contact.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <aside
      aria-label="Contact options"
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 group"
    >
      <button
        onClick={handleClick}
        className="relative w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.8)] hover:scale-105 transition-all duration-300"
        aria-label="Order on WhatsApp"
        title={t.whatsapp.btnTitle}
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF168F] text-white rounded-full flex items-center justify-center text-[9px] font-bold shadow-[0_0_6px_#FF168F] animate-pulse">
          1
        </span>
      </button>

      <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#171017] border border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white shadow-xl pointer-events-none">
        <div className="font-bold text-emerald-400">{t.whatsapp.tooltipTitle}</div>
        <div className="text-[10px] text-zinc-300">{t.whatsapp.tooltipSub}</div>
      </div>
    </aside>
  );
};
