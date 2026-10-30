import React from 'react';
import { Instagram, Facebook, Youtube, ShieldCheck, Mail, MessageCircle } from 'lucide-react';
import { BRAND } from '../data/constants';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onOpenLookbook?: () => void;
  onOpenProductManager?: () => void;
  onOpenInfoPage?: (page: 'about' | 'contact' | 'returns' | 'privacy' | 'terms') => void;
  onOpenAdminPanel?: () => void;
  isAdmin?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenInfoPage,
  onOpenAdminPanel,
  isAdmin = false,
}) => {
  return (
    <footer className="bg-[#080509] border-t border-[#2e1a2b] text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Tier: Brand Presence, Departments & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full p-[1.5px] bg-gradient-to-tr from-[#FF168F] to-[#FF2D9B] shadow-[0_0_15px_rgba(255,22,143,0.5)]">
                <img
                  src={BRAND.logoImage}
                  alt={BRAND.name}
                  className="w-full h-full object-cover rounded-full bg-black"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white block leading-none neon-text-glow">
                  {BRAND.name}
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#FF8BC8] font-semibold mt-1 block">
                  Dresses · Jewellery · Bags
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 max-w-sm font-light leading-relaxed">
              Curating sovereign elegance through black obsidian depths and electrifying neon pink brilliance. Handcrafted fine jewellery, bespoke luxury bags, and red-carpet couture dresses.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Instagram, label: 'Instagram', href: '#' },
                { icon: Facebook, label: 'Facebook', href: '#' },
                { icon: Youtube, label: 'YouTube', href: '#' },
              ].map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  className="w-9 h-9 rounded-full bg-[#171017] border border-[#2e1a2b] flex items-center justify-center text-white hover:text-[#FF168F] hover:border-[#FF168F] hover:shadow-[0_0_12px_rgba(255,22,143,0.5)] transition-all"
                  aria-label={s.label}
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF8BC8]">
              Departments
            </h4>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li>
                <button
                  onClick={() => onSelectCategory('Dresses')}
                  className="hover:text-[#FF168F] transition-colors"
                >
                  Couture Dresses & Gowns
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Jewellery')}
                  className="hover:text-[#FF168F] transition-colors"
                >
                  Haute Fine Jewellery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Bags')}
                  className="hover:text-[#FF168F] transition-colors"
                >
                  Designer Luxury Handbags & Clutches
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('All')}
                  className="hover:text-[#FF168F] transition-colors"
                >
                  View All New Drops
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF8BC8]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li>
                <button onClick={() => onOpenInfoPage?.('about')} className="hover:text-[#FF168F] transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onOpenInfoPage?.('contact')} className="hover:text-[#FF168F] transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => onOpenInfoPage?.('returns')} className="hover:text-[#FF168F] transition-colors">
                  Return & Exchange
                </button>
              </li>
              <li>
                <button onClick={() => onOpenInfoPage?.('privacy')} className="hover:text-[#FF168F] transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenInfoPage?.('terms')} className="hover:text-[#FF168F] transition-colors">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF8BC8]">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-300">
              <a
                href={`mailto:${BRAND.contact.email}`}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#171017] border border-[#2e1a2b] hover:border-[#FF168F]/60 text-zinc-300 hover:text-white transition-all group"
              >
                <Mail className="w-4 h-4 text-[#FF168F] shrink-0" />
                <span className="font-mono text-[11px] truncate block">{BRAND.contact.email}</span>
              </a>

              <a
                href={`https://wa.me/${BRAND.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0e2716]/60 border border-emerald-600/40 hover:border-emerald-500 text-zinc-300 hover:text-white transition-all group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  WhatsApp Support
                </span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Tier: Payment Badges, Admin Link (Owner only) & Copyright */}
        <div className="pt-8 border-t border-[#2e1a2b] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2 text-zinc-400">
            <span>© {new Date().getFullYear()}</span>
            <strong className="text-white font-serif">{BRAND.name}</strong>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-zinc-400 flex-wrap justify-center">
            <span onClick={() => onOpenInfoPage?.('returns')} className="hover:text-white cursor-pointer transition-colors">100% Cash On Delivery</span>
            <span>·</span>
            <span onClick={() => onOpenInfoPage?.('privacy')} className="hover:text-white cursor-pointer transition-colors">Authenticity Guarantee</span>
            {isAdmin && onOpenAdminPanel && (
              <>
                <span>·</span>
                <button
                  type="button"
                  onClick={onOpenAdminPanel}
                  className="px-2 py-0.5 rounded bg-[#171017] border border-[#FF168F]/40 hover:border-[#FF168F] text-[#FF8BC8] hover:text-white transition-all font-semibold flex items-center gap-1"
                  title="Private Owner Admin Panel"
                >
                  <span>🔐 Admin Portal</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
