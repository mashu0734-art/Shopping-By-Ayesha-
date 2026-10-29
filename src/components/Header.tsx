import React, { useState } from 'react';
import { ShoppingCart, Heart, Search, Menu, X, Sparkles, ChevronDown, User, MessageCircle, Globe, Camera } from 'lucide-react';
import { BRAND } from '../data/constants';
import { Currency, CurrencyCode, UserAccount, Language } from '../types';
import { CURRENCIES } from '../data/products';
import { useTranslation } from '../translations';

interface HeaderProps {
  currentCategory: string;
  onSelectCategory: (category: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  currency: Currency;
  onSelectCurrency: (code: CurrencyCode) => void;
  onNavigateHome: () => void;
  onOpenSidebar: () => void;
  onOpenAuth: () => void;
  currentUser: UserAccount | null;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  currency,
  onSelectCurrency,
  onNavigateHome,
  onOpenSidebar,
  onOpenAuth,
  currentUser,
  language,
  onSelectLanguage,
}) => {
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const t = useTranslation(language);

  const navItems = [
    { label: t.nav.all, value: 'All' },
    { label: t.nav.dresses, value: 'Dresses' },
    { label: t.nav.jewellery, value: 'Jewellery' },
    { label: t.nav.bags, value: 'Bags' },
  ];

  const handleNavClick = (value: string) => {
    onSelectCategory(value);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(t.whatsapp.prefillMsg);
    window.open(`https://wa.me/${BRAND.contact.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080509]/95 backdrop-blur-md border-b border-[#2e1a2b] transition-all">
      {/* Running Announcement Bar: Hot-pink background with white scrolling marquee text */}
      {!announcementDismissed && (
        <div className="relative bg-[#FF2D9B] text-white text-xs font-bold tracking-widest py-2 transition-all overflow-hidden shadow-[0_2px_15px_rgba(255,45,155,0.4)] flex items-center select-none">
          <div className="overflow-hidden whitespace-nowrap w-full flex items-center">
            <div className="animate-marquee flex items-center gap-8">
              <span>{t.announcement}</span>
              <span>{t.announcement}</span>
            </div>
          </div>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            className="absolute right-2 z-10 p-1 bg-black/40 hover:bg-black/80 text-white rounded transition-colors shrink-0"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-6 h-18 sm:h-20">
          
          {/* Zone 1: 3-Lines Side Menu Button (☰) + Profile Avatar & Brand Name */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
            {/* 3-Lines Side Menu Trigger Button */}
            <button
              onClick={onOpenSidebar}
              className="p-2 sm:p-2.5 rounded-xl bg-[#171017] hover:bg-[#251525] border border-[#FF168F]/60 hover:border-[#FF168F] text-white hover:text-[#FF8BC8] shadow-sm hover:shadow-[0_0_15px_rgba(255,22,143,0.4)] transition-all flex items-center gap-1.5 shrink-0"
              aria-label="Open 3-lines menu for all articles"
              title={t.nav.menu}
            >
              <Menu className="w-5 h-5 text-[#FF168F]" />
              <span className="text-xs font-bold uppercase tracking-wider hidden lg:inline">
                {t.nav.menu}
              </span>
            </button>

            {/* Left Side: Profile Avatar / Picture Button (In place of logo) */}
            <button
              onClick={onOpenAuth}
              className="relative group p-0.5 rounded-full border-2 border-[#FF168F] hover:border-[#FF8BC8] shadow-[0_0_12px_rgba(255,22,143,0.4)] hover:shadow-[0_0_20px_rgba(255,22,143,0.8)] transition-all shrink-0 focus:outline-none"
              aria-label="Profile Picture & Account"
              title={currentUser?.avatar ? (language === 'ur' ? `${currentUser.fullName} - تصویر تبدیل کریں` : `${currentUser.fullName} - Change Profile Picture`) : (language === 'ur' ? 'اپنی پروفائل تصویر لگائیں' : 'Upload Profile Picture')}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-[#171017] flex items-center justify-center relative">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.fullName || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-[#171017] to-[#251525] flex items-center justify-center text-zinc-300 group-hover:text-white">
                    <User className="w-4 h-4 text-[#FF168F]" />
                  </div>
                )}
              </div>
              {/* Miniature camera badge indicator on avatar */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#FF168F] text-white flex items-center justify-center shadow-[0_0_6px_#FF168F] border border-black">
                <Camera className="w-2.5 h-2.5" />
              </div>
            </button>

            {/* Brand Title */}
            <button
              onClick={() => {
                onNavigateHome();
                onSelectCategory('All');
              }}
              className="group text-left focus:outline-none shrink-0"
              title="Shopping By Ayesha"
            >
              <span className="font-serif text-base lg:text-xl font-bold tracking-tight text-white group-hover:text-[#FFD6EA] transition-colors hidden md:inline">
                Shopping By Ayesha
              </span>
            </button>
          </div>

          {/* Zone 2: Center Trolley Cart Button (Centered & Larger Size) */}
          <div className="flex-1 flex justify-center items-center px-1">
            <button
              onClick={onOpenCart}
              className="btn-neon-pink flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(255,22,143,0.5)] hover:shadow-[0_0_30px_rgba(255,22,143,0.8)] transition-all shrink-0 border border-white/20"
              aria-label={`Shopping bag with ${cartCount} items`}
              title={t.nav.bag}
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span className="hidden sm:inline font-bold">{t.nav.bag}</span>
              <span className="bg-white/30 text-white px-2 py-0.5 rounded-md text-xs sm:text-sm font-extrabold min-w-[22px] text-center shadow-inner">
                {cartCount}
              </span>
            </button>
          </div>

          {/* Zone 3: Interactive Affordances (Language Switcher) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Search Button (Desktop/Tablet) */}
            <button
              onClick={onOpenSearch}
              className="hidden sm:flex p-2 text-zinc-300 hover:text-[#FF168F] transition-colors rounded-full hover:bg-[#171017] focus:outline-none shrink-0"
              aria-label={t.nav.search}
              title={t.nav.search}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button (Desktop/Tablet) */}
            <button
              onClick={onOpenWishlist}
              className="relative hidden sm:flex p-2 text-zinc-300 hover:text-[#FF168F] transition-colors rounded-full hover:bg-[#171017] focus:outline-none shrink-0"
              aria-label={`Wishlist with ${wishlistCount} items`}
              title={t.nav.wishlist}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF168F] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_0_8px_#FF168F]">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Language Switcher: English | Urdu */}
            <div className="flex items-center bg-[#171017] p-0.5 sm:p-1 rounded-full border border-[#FF168F]/70 shadow-[0_0_12px_rgba(255,22,143,0.35)] shrink-0">
              <button
                type="button"
                onClick={() => onSelectLanguage('en')}
                className={`px-2.5 xs:px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  language === 'en'
                    ? 'bg-[#FF168F] text-white shadow-[0_0_10px_#FF168F]'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Switch to English"
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onSelectLanguage('ur')}
                className={`px-2.5 xs:px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  language === 'ur'
                    ? 'bg-[#FF168F] text-white shadow-[0_0_10px_#FF168F]'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="اردو میں دیکھیں"
              >
                اردو
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
