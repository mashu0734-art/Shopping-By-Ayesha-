import React from 'react';
import { Instagram, Facebook, Youtube, ShieldCheck, Mail, MessageCircle } from 'lucide-react';
import { BRAND } from '../data/constants';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onOpenLookbook?: () => void;
  onOpenProductManager?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
}) => {
  return (
    <footer className="bg-[#080509] border-t border-[#2e1a2b] text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Tier: Brand Presence, Departments & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
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

          {/* Departments strictly Dresses, Jewellery, Bags */}
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

          {/* Contact Section: Gmail mashu0734@gmail.com & WhatsApp 03013331824 */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF8BC8]">
              Contact
            </h4>
            <div className="space-y-3 text-xs text-zinc-300">
              
              {/* Email */}
              <a
                href={`mailto:${BRAND.contact.email}`}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#171017] border border-[#2e1a2b] hover:border-[#FF168F]/60 text-zinc-300 hover:text-white transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FF168F]/10 border border-[#FF168F]/30 flex items-center justify-center shrink-0 group-hover:bg-[#FF168F]/20 transition-colors">
                  <Mail className="w-4 h-4 text-[#FF168F]" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Email / Gmail</span>
                  <span className="font-mono text-xs text-white group-hover:text-[#FF168F] transition-colors truncate block">
                    {BRAND.contact.email}
                  </span>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${BRAND.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0e2716]/60 border border-emerald-600/40 hover:border-emerald-500 text-zinc-300 hover:text-white transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center shrink-0 group-hover:bg-emerald-900 transition-colors">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    WhatsApp Order & Support
                  </span>
                </div>
              </a>



            </div>
          </div>

        </div>

        {/* Bottom Tier: Payment Badges & Copyright */}
        <div className="pt-8 border-t border-[#2e1a2b] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2 text-zinc-400">
            <span>© {new Date().getFullYear()}</span>
            <strong className="text-white font-serif">{BRAND.name}</strong>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-zinc-400">
            <span className="hover:text-white cursor-pointer transition-colors">Cash On Delivery Policy</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer transition-colors">Authenticity Guarantee</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
