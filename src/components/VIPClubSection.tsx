import React, { useState } from 'react';
import { Crown, Sparkles, Check, ArrowRight } from 'lucide-react';

export const VIPClubSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <section className="bg-[#171017] py-16 sm:py-20 border-b border-[#2e1a2b] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF168F]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080509] border border-[#FF168F]/50 shadow-[0_0_15px_rgba(255,22,143,0.3)]">
          <Crown className="w-4 h-4 text-[#FF168F]" />
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FFD6EA]">
            The Pink Circle VIP
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Enter The Circle of Sovereign Glamour
        </h2>

        <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto font-light leading-relaxed">
          Be first to receive private invitations to limited jewel drops, midnight couture previews, and enjoy an immediate <strong className="text-[#FF8BC8] font-semibold">10% privilege code</strong> on your order.
        </p>

        {subscribed ? (
          <div className="p-6 rounded-2xl bg-[#080509] border border-[#FF168F] shadow-[0_0_25px_rgba(255,22,143,0.4)] max-w-md mx-auto space-y-2 animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-full bg-[#FF168F]/20 text-[#FF168F] flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-bold text-white">Welcome to The Pink Circle</h4>
            <p className="text-xs text-zinc-400">
              Your 10% VIP privilege code has been generated. Use code at checkout:
            </p>
            <div className="p-2.5 rounded-lg bg-[#171017] border border-[#FF168F]/40 font-mono text-sm font-bold text-[#FF168F] tracking-widest">
              AYESHA10
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your VIP email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:flex-1 bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] focus:ring-1 focus:ring-[#FF168F] rounded-xl px-4 py-3.5 text-xs text-white placeholder-zinc-500 outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              className="w-full sm:w-auto btn-neon-pink px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 whitespace-nowrap shrink-0 shadow-[0_0_20px_rgba(255,22,143,0.5)]"
            >
              <span>Join Circle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-6 text-[11px] text-zinc-400 pt-2">
          <span>✨ Private Client Previews</span>
          <span>·</span>
          <span>💎 Bespoke Atelier Sizing</span>
          <span>·</span>
          <span>🔒 Strict Privacy Guaranteed</span>
        </div>
      </div>
    </section>
  );
};
