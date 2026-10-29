import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingCart, Sparkles, Tag, Check, ShieldCheck } from 'lucide-react';
import { CartItem, Currency, Language } from '../types';
import { PROMO_CODES } from '../data/products';
import { useTranslation } from '../translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  language?: Language;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onOpenCheckout: (promoDetails: { code: string; discountAmount: number }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  language = 'ur',
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
}) => {
  if (!isOpen) return null;
  const t = useTranslation(language);

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent?: number; discountFixed?: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  // Calculate Subtotal
  const rawSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const subtotal = rawSubtotal * currency.rate;

  // Rule 2, 3, 4: Delivery charges Rs. 300 separate. If same product ordered multiple times, charge delivery once (Rs 300). If different products ordered, charge Rs 300 for each distinct product.
  // In PKR: 300. Converted by currency.rate.
  const distinctProductCount = new Set(items.map((i) => i.product.id)).size;
  const baseDeliveryPKR = distinctProductCount > 0 ? 300 * distinctProductCount : 0;
  const shippingCost = baseDeliveryPKR * currency.rate;

  // Rule 5: 10% discount on product price if ordered through reference (or promo code AYESHA10 / ref)
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discountAmount = (subtotal * appliedPromo.discountPercent) / 100;
    } else if (appliedPromo.discountFixed) {
      discountAmount = appliedPromo.discountFixed * currency.rate;
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, ...PROMO_CODES[code] });
      setPromoInput('');
    } else {
      setPromoError('Invalid promotion code. Try "AYESHA10" or "GLAMOUR"');
    }
  };

  const handleCheckoutClick = () => {
    onOpenCheckout({
      code: appliedPromo?.code || '',
      discountAmount: discountAmount / currency.rate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#080509] border-l border-[#2e1a2b] shadow-[0_0_50px_rgba(255,22,143,0.3)] flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-[#2e1a2b] bg-[#171017] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#FF168F]" />
              <h2 className="font-serif text-lg font-bold text-white tracking-wide">
                Your Shopping Bag ({items.reduce((acc, item) => acc + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-black/40 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>



          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#171017] border border-[#FF168F]/30 flex items-center justify-center text-[#FF168F] shadow-[0_0_20px_rgba(255,22,143,0.25)]">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Your bag is empty</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                    Explore our crowned jewellery, luxury clutches, and evening couture collections to discover your next statement piece.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="btn-neon-pink px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item, index) => {
                const itemTotal = (item.product.price * item.quantity * currency.rate).toFixed(0);
                return (
                  <div
                    key={`${item.product.id}-${index}`}
                    className="flex gap-4 p-3.5 rounded-xl bg-[#171017] border border-[#2e1a2b] transition-all hover:border-[#FF168F]/40"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-[#0d090e] shrink-0 border border-[#2e1a2b]">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif text-sm font-semibold text-white line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(index)}
                            className="text-zinc-500 hover:text-[#FF168F] transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Variants */}
                        <div className="flex flex-wrap gap-2 text-[11px] text-zinc-400 mt-1">
                          {item.selectedColor && (
                            <span className="text-[#FF8BC8]">{item.selectedColor}</span>
                          )}
                          {item.selectedSize && (
                            <>
                              <span className="text-zinc-600">/</span>
                              <span>{item.selectedSize}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper & Price */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#2e1a2b]">
                        <div className="flex items-center bg-[#080509] border border-[#2e1a2b] rounded-md">
                          <button
                            onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-zinc-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="w-7 text-center text-xs font-mono font-bold text-white tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-zinc-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-mono text-sm font-bold text-[#FF168F] tabular-nums">
                          {currency.symbol}{itemTotal}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#2e1a2b] bg-[#171017] space-y-4">
              
              {/* Promo Code Form */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#080509] border border-[#FF168F]/40 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[#FF168F]" />
                      <span className="font-mono font-bold text-white">{appliedPromo.code}</span>
                      <span className="text-emerald-400">applied</span>
                    </div>
                    <button
                      onClick={() => setAppliedPromo(null)}
                      className="text-zinc-400 hover:text-white text-xs underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. AYESHA10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 uppercase outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-[#2e1a2b] hover:bg-[#FF168F] text-xs font-semibold text-white transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <div className="text-[11px] text-rose-400 mt-1">{promoError}</div>
                )}
              </div>

              {/* Order Cost Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-[#2e1a2b]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-white">{currency.symbol}{subtotal.toFixed(0)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#FF8BC8]">
                    <span>VIP Promotion</span>
                    <span className="font-mono tabular-nums">-{currency.symbol}{discountAmount.toFixed(0)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Charges (Rs. 300)</span>
                  <span className="font-mono tabular-nums">
                    {shippingCost === 0 ? (
                      <strong className="text-emerald-400 uppercase font-sans">Free</strong>
                    ) : (
                      `${currency.symbol}${shippingCost.toFixed(0)}`
                    )}
                  </span>
                </div>

                {/* Final Total in Neon Pink */}
                <div className="flex justify-between items-baseline pt-2 border-t border-[#2e1a2b] text-sm">
                  <span className="font-bold text-white uppercase tracking-wider">{t.cart.total}</span>
                  <span className="font-mono text-xl font-bold text-[#FF168F] tabular-nums neon-text-glow">
                    {currency.symbol}{finalTotal.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* High-Contrast Checkout Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full btn-neon-pink py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,22,143,0.5)] hover:shadow-[0_0_30px_rgba(255,22,143,0.8)] transition-all"
              >
                <span>{t.cart.checkoutBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF168F]" />
                <span>{t.cart.codNotice}</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
