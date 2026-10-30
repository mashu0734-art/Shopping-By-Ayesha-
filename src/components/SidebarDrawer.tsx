import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, MessageCircle, User, LogIn, ShieldCheck } from 'lucide-react';
import { BRAND } from '../data/constants';
import { UserAccount, Language } from '../types';
import { useTranslation } from '../translations';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  selectedSubcategory: string;
  onSelectCategoryFilter: (category: string, subcategory: string) => void;
  currentUser: UserAccount | null;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  onOpenAuth: () => void;
  onOpenProductManager?: () => void;
  onOpenAdminPanel?: () => void;
  isAdmin?: boolean;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  selectedSubcategory,
  onSelectCategoryFilter,
  currentUser,
  language,
  onSelectLanguage,
  onOpenAuth,
  onOpenAdminPanel,
  isAdmin = false,
  onOpenWishlist,
  onOpenCart,
}) => {
  if (!isOpen) return null;

  const [expandedSection, setExpandedSection] = useState<'Dresses' | 'Jewellery' | 'Bags' | null>(null);
  const t = useTranslation(language);

  const toggleSection = (section: 'Dresses' | 'Jewellery' | 'Bags') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSelect = (category: string, subcategory: string) => {
    onSelectCategoryFilter(category, subcategory);
    onClose();
  };

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent(t.whatsapp.prefillMsg);
    window.open(`https://wa.me/${BRAND.contact.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-[#080509] border-r border-[#2e1a2b] shadow-[0_0_50px_rgba(255,22,143,0.35)] flex flex-col justify-between overflow-hidden">
          
          {/* Header */}
          <div className="p-5 border-b border-[#2e1a2b] bg-[#171017] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full p-[1px] bg-gradient-to-tr from-[#FF168F] to-[#FF2D9B] shadow-[0_0_10px_#FF168F]">
                <img
                  src={BRAND.logoImage}
                  alt={BRAND.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white tracking-wide leading-none">
                  {BRAND.name}
                </h3>
                <span className="text-[10px] text-[#FF8BC8] tracking-widest uppercase font-semibold mt-1 block">
                  {t.drawer.title}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-black/40 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content - All Articles Separately */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            
            {/* Row: All Products + English / Urdu Language Switcher */}
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#171017] border border-[#2e1a2b]">
              <button
                onClick={() => handleSelect('All', 'All')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-[#FF168F] text-white border-[#FF168F] shadow-[0_0_12px_#FF168F]'
                    : 'bg-[#080509] text-zinc-300 border-[#2e1a2b] hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF8BC8]" />
                <span>{language === 'ur' ? 'تمام پراڈکٹس' : 'All Products'}</span>
              </button>

              <div className="flex items-center bg-[#080509] p-0.5 rounded-full border border-[#FF168F]/50">
                <button
                  type="button"
                  onClick={() => onSelectLanguage('en')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    language === 'en'
                      ? 'bg-[#FF168F] text-white shadow-[0_0_10px_#FF168F]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => onSelectLanguage('ur')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    language === 'ur'
                      ? 'bg-[#FF168F] text-white shadow-[0_0_10px_#FF168F]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  اردو
                </button>
              </div>
            </div>

            {/* ================= CATEGORY 1: DRESSES ================= */}
            <div className="space-y-2">
              <div
                onClick={() => toggleSection('Dresses')}
                className="flex items-center justify-between p-3 rounded-xl bg-[#171017] border border-[#2e1a2b] hover:border-[#FF168F]/50 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">👗</span>
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">
                      {language === 'ur' ? 'ملبوسات و ڈریسز' : 'Couture Dresses'}
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {language === 'ur' ? 'موسمِ سرما · موسمِ گرما · فینسی' : 'Winter · Summer · Fancy'}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-[#FF8BC8] transition-transform ${expandedSection === 'Dresses' || expandedSection === null ? 'rotate-90' : ''}`} />
              </div>

              {(expandedSection === 'Dresses' || expandedSection === null) && (
                <div className="pl-4 pr-1 py-1 space-y-1.5 border-l-2 border-[#FF168F]/30 ml-3 animate-in fade-in duration-200">
                  <button
                    onClick={() => handleSelect('Dresses', 'All')}
                    className="w-full text-left py-1.5 px-3 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-[#171017] transition-colors flex items-center justify-between"
                  >
                    <span>{language === 'ur' ? 'تمام ڈریسز' : 'All Dresses'}</span>
                    <span className="text-[10px] text-[#FF8BC8]">{language === 'ur' ? 'سب دیکھیں' : 'View All'}</span>
                  </button>

                  <button
                    onClick={() => handleSelect('Dresses', 'Winter')}
                    className={`w-full text-left py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedSubcategory === 'Winter'
                        ? 'bg-[#FF168F]/20 text-[#FF168F] font-bold border border-[#FF168F]/40'
                        : 'text-zinc-300 hover:text-white hover:bg-[#171017]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8BC8]" />
                      <span>{language === 'ur' ? 'موسمِ سرما (سردیوں کے سوٹ)' : 'Winter Collection'}</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">Velvet & Shawls</span>
                  </button>

                  <button
                    onClick={() => handleSelect('Dresses', 'Summer')}
                    className={`w-full text-left py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedSubcategory === 'Summer'
                        ? 'bg-[#FF168F]/20 text-[#FF168F] font-bold border border-[#FF168F]/40'
                        : 'text-zinc-300 hover:text-white hover:bg-[#171017]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8BC8]" />
                      <span>{language === 'ur' ? 'موسمِ گرما (گرمیوں کا کلیکشن)' : 'Summer Collection'}</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">Lawn & Chiffon</span>
                  </button>

                  <button
                    onClick={() => handleSelect('Dresses', 'Fancy')}
                    className={`w-full text-left py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedSubcategory === 'Fancy'
                        ? 'bg-[#FF168F]/20 text-[#FF168F] font-bold border border-[#FF168F]/40'
                        : 'text-zinc-300 hover:text-white hover:bg-[#171017]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8BC8]" />
                      <span>{language === 'ur' ? 'فینسی و عروسی ملبوسات' : 'Fancy & Party Wear'}</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">Sequins & Silk</span>
                  </button>
                </div>
              )}
            </div>

            {/* ================= CATEGORY 2: JEWELLERY ================= */}
            <div className="space-y-2">
              <div
                onClick={() => toggleSection('Jewellery')}
                className="flex items-center justify-between p-3 rounded-xl bg-[#171017] border border-[#2e1a2b] hover:border-[#FF168F]/50 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">💎</span>
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">
                      {language === 'ur' ? 'شاہی زیورات' : 'Royal Jewellery'}
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {language === 'ur' ? 'جھمکے · ہار · بالیاں · انگوٹھی · برائیڈل سیٹ' : 'Jhumkay · Necklace · Earrings · Rings'}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-[#FF8BC8] transition-transform ${expandedSection === 'Jewellery' || expandedSection === null ? 'rotate-90' : ''}`} />
              </div>

              {(expandedSection === 'Jewellery' || expandedSection === null) && (
                <div className="pl-4 pr-1 py-1 space-y-1.5 border-l-2 border-[#FF168F]/30 ml-3 animate-in fade-in duration-200">
                  <button
                    onClick={() => handleSelect('Jewellery', 'All')}
                    className="w-full text-left py-1.5 px-3 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-[#171017] transition-colors flex items-center justify-between"
                  >
                    <span>{language === 'ur' ? 'تمام زیورات' : 'All Jewellery'}</span>
                    <span className="text-[10px] text-[#FF8BC8]">{language === 'ur' ? 'سب دیکھیں' : 'View All'}</span>
                  </button>

                  <button
                    onClick={() => handleSelect('Jewellery', 'Jhumkey')}
                    className={`w-full text-left py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedSubcategory === 'Jhumkey'
                        ? 'bg-[#FF168F]/20 text-[#FF168F] font-bold border border-[#FF168F]/40'
                        : 'text-zinc-300 hover:text-white hover:bg-[#171017]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8BC8]" />
                      <span>{language === 'ur' ? 'شاہی جھمکے' : 'Jhumkay'}</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">Kundan & Pearl</span>
                  </button>

                  <button
                    onClick={() => handleSelect('Jewellery', 'Necklace')}
                    className={`w-full text-left py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedSubcategory === 'Necklace'
                        ? 'bg-[#FF168F]/20 text-[#FF168F] font-bold border border-[#FF168F]/40'
                        : 'text-zinc-300 hover:text-white hover:bg-[#171017]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8BC8]" />
                      <span>{language === 'ur' ? 'ہار اور چوکر' : 'Necklace & Chokers'}</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">Chokers & Sets</span>
                  </button>

                  <button
                    onClick={() => handleSelect('Jewellery', 'Earrings')}
                    className={`w-full text-left py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedSubcategory === 'Earrings'
                        ? 'bg-[#FF168F]/20 text-[#FF168F] font-bold border border-[#FF168F]/40'
                        : 'text-zinc-300 hover:text-white hover:bg-[#171017]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8BC8]" />
                      <span>{language === 'ur' ? 'بالیاں و ٹاپس' : 'Earrings & Tops'}</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">Drops & Hoops</span>
                  </button>

                  <button
                    onClick={() => handleSelect('Jewellery', 'Ring')}
                    className={`w-full text-left py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedSubcategory === 'Ring'
                        ? 'bg-[#FF168F]/20 text-[#FF168F] font-bold border border-[#FF168F]/40'
                        : 'text-zinc-300 hover:text-white hover:bg-[#171017]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8BC8]" />
                      <span>{language === 'ur' ? 'انگوٹھیاں' : 'Rings'}</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">Solitaire & Crown</span>
                  </button>

                  <button
                    onClick={() => handleSelect('Jewellery', 'Complete Set')}
                    className={`w-full text-left py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedSubcategory === 'Complete Set'
                        ? 'bg-[#FF168F]/20 text-[#FF168F] font-bold border border-[#FF168F]/40'
                        : 'text-zinc-300 hover:text-white hover:bg-[#171017]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8BC8]" />
                      <span>{language === 'ur' ? 'مکمل برائیڈل سیٹ' : 'Complete Bridal Set'}</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">Necklace, Earrings, Tikka</span>
                  </button>

                  <button
                    onClick={() => handleSelect('Jewellery', 'Bracelets')}
                    className={`w-full text-left py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedSubcategory === 'Bracelets'
                        ? 'bg-[#FF168F]/20 text-[#FF168F] font-bold border border-[#FF168F]/40'
                        : 'text-zinc-300 hover:text-white hover:bg-[#171017]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8BC8]" />
                      <span>{language === 'ur' ? 'کنگن اور چوڑیاں' : 'Bracelets & Bangles'}</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">Cuffs & Bangles</span>
                  </button>
                </div>
              )}
            </div>

            {/* ================= CATEGORY 3: BAGS ================= */}
            <div className="space-y-2">
              <div
                onClick={() => toggleSection('Bags')}
                className="flex items-center justify-between p-3 rounded-xl bg-[#171017] border border-[#2e1a2b] hover:border-[#FF168F]/50 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">👜</span>
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">
                      {language === 'ur' ? 'ڈیزائنر بیگز' : 'Designer Bags'}
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {language === 'ur' ? 'کلچز · ہینڈ بیگز · پارٹی بیگز' : 'Clutches · Handbags · Party Bags'}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-[#FF8BC8] transition-transform ${expandedSection === 'Bags' || expandedSection === null ? 'rotate-90' : ''}`} />
              </div>

              {(expandedSection === 'Bags' || expandedSection === null) && (
                <div className="pl-4 pr-1 py-1 space-y-1.5 border-l-2 border-[#FF168F]/30 ml-3 animate-in fade-in duration-200">
                  <button
                    onClick={() => handleSelect('Bags', 'All')}
                    className="w-full text-left py-1.5 px-3 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-[#171017] transition-colors flex items-center justify-between"
                  >
                    <span>{language === 'ur' ? 'تمام بیگز' : 'All Bags'}</span>
                    <span className="text-[10px] text-[#FF8BC8]">{language === 'ur' ? 'سب دیکھیں' : 'View All'}</span>
                  </button>

                  <button
                    onClick={() => handleSelect('Bags', 'Clutches')}
                    className={`w-full text-left py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedSubcategory === 'Clutches'
                        ? 'bg-[#FF168F]/20 text-[#FF168F] font-bold border border-[#FF168F]/40'
                        : 'text-zinc-300 hover:text-white hover:bg-[#171017]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8BC8]" />
                      <span>{language === 'ur' ? 'فینسی کلچز' : 'Clutches'}</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">Satin & Box</span>
                  </button>

                  <button
                    onClick={() => handleSelect('Bags', 'Handbags')}
                    className={`w-full text-left py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedSubcategory === 'Handbags'
                        ? 'bg-[#FF168F]/20 text-[#FF168F] font-bold border border-[#FF168F]/40'
                        : 'text-zinc-300 hover:text-white hover:bg-[#171017]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8BC8]" />
                      <span>{language === 'ur' ? 'لیڈیز ہینڈ بیگز' : 'Handbags'}</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">Caviar & Flap</span>
                  </button>

                  <button
                    onClick={() => handleSelect('Bags', 'Party Bags')}
                    className={`w-full text-left py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedSubcategory === 'Party Bags'
                        ? 'bg-[#FF168F]/20 text-[#FF168F] font-bold border border-[#FF168F]/40'
                        : 'text-zinc-300 hover:text-white hover:bg-[#171017]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8BC8]" />
                      <span>{language === 'ur' ? 'پارٹی و برائیڈل بیگز' : 'Party & Bridal Bags'}</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">Croc & Crystal</span>
                  </button>
                </div>
              )}
            </div>


          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-[#2e1a2b] bg-[#120a13] space-y-2">
            {isAdmin && onOpenAdminPanel && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdminPanel();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#171017] hover:bg-[#FF168F] border border-[#FF168F]/40 text-[#FF8BC8] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-[#FF168F] group-hover:text-white" />
                <span>🔐 {language === 'ur' ? 'ایڈمن ڈیش بورڈ' : 'Owner Admin Dashboard'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleWhatsAppChat}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ur' ? 'واٹس ایپ پر رابطہ کریں' : 'WhatsApp Support'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
