import React from 'react';
import { X, Sparkles, Gem, Crown, ArrowRight, Quote } from 'lucide-react';
import { BRAND } from '../data/constants';
import { BRAND_STORY } from '../data/products';

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShopCategory: (category: string) => void;
}

export const LookbookModal: React.FC<LookbookModalProps> = ({
  isOpen,
  onClose,
  onShopCategory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-4xl bg-[#080509] border border-[#FF168F]/40 rounded-2xl shadow-[0_0_60px_rgba(255,22,143,0.35)] overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-[#2e1a2b] bg-[#171017] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-[#FF168F]" />
            <h2 className="font-serif text-lg font-bold text-white tracking-wide">
              The House of Ayesha · VIP Lookbook & Heritage
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-black/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-10">
          
          {/* Emblem & Manifesto Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#171017] via-[#211122] to-[#171017] border border-[#FF168F]/30 p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8 shadow-[0_0_30px_rgba(255,22,143,0.2)]">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-tr from-[#FF168F] to-[#FF8BC8] shadow-[0_0_25px_rgba(255,22,143,0.6)] shrink-0">
              <img
                src={BRAND.logoImage}
                alt="Shopping By Ayesha Official Crown Emblem"
                className="w-full h-full object-cover rounded-full bg-black"
              />
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="text-xs uppercase tracking-widest text-[#FF8BC8] font-bold">
                The Heritage & Aesthetic
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                Empowering Modern Royalty in Obsidian & Neon Light
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                {BRAND_STORY.description}
              </p>
            </div>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {BRAND_STORY.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#171017] border border-[#2e1a2b] hover:border-[#FF168F]/50 transition-all space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FF168F]/20 text-[#FF168F] flex items-center justify-center font-bold">
                  <Gem className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-sm font-bold text-white">{pillar.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>

          {/* Editorial Quotes Carousel / Grid */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#FF8BC8] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FF168F]" />
              <span>International Luxury Press</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {BRAND_STORY.pressQuotes.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#171017] border border-[#2e1a2b] flex flex-col justify-between"
                >
                  <Quote className="w-5 h-5 text-[#FF168F]/60 mb-2" />
                  <p className="text-xs text-zinc-300 italic leading-relaxed">
                    "{q.quote}"
                  </p>
                  <span className="text-[11px] font-bold text-[#FF8BC8] tracking-wider uppercase mt-4 block">
                    — {q.publication}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Collection Routes */}
          <div className="p-6 rounded-2xl bg-[#171017] border border-[#FF168F]/30 text-center space-y-4">
            <h4 className="font-serif text-xl font-bold text-white">
              Ready to Explore Your Signature Piece?
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  onShopCategory('Jewellery');
                  onClose();
                }}
                className="btn-neon-pink px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                View Jewellery
              </button>
              <button
                onClick={() => {
                  onShopCategory('Bags');
                  onClose();
                }}
                className="px-5 py-2.5 rounded-lg bg-[#080509] border border-[#FF168F]/60 hover:border-[#FF168F] text-xs font-bold uppercase tracking-wider text-white"
              >
                View Handbags
              </button>
              <button
                onClick={() => {
                  onShopCategory('Dresses');
                  onClose();
                }}
                className="px-5 py-2.5 rounded-lg bg-[#080509] border border-[#FF168F]/60 hover:border-[#FF168F] text-xs font-bold uppercase tracking-wider text-white"
              >
                View Dresses
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
