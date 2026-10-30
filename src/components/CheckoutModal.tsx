import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, Sparkles, MessageCircle, DollarSign, PackageCheck, Tag } from 'lucide-react';
import { CartItem, Currency, OrderCustomer, PlacedOrder, Language } from '../types';
import { BRAND } from '../data/constants';
import { PROMO_CODES } from '../data/products';
import { useTranslation } from '../translations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  language: Language;
  promoDetails: { code: string; discountAmount: number };
  onOrderSuccess: (order: PlacedOrder) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  language,
  promoDetails,
  onOrderSuccess,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const t = useTranslation(language);
  const [step, setStep] = useState<'checkout' | 'confirmation'>('checkout');
  const [confirmedOrder, setConfirmedOrder] = useState<PlacedOrder | null>(null);

  // Form State
  const [customer, setCustomer] = useState<OrderCustomer>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Pakistan',
    postalCode: '',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Promo Code State in Checkout Form
  const [promoCodeInput, setPromoCodeInput] = useState(promoDetails.code || '');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent?: number; discountFixed?: number; description?: string } | null>(
    promoDetails.code && PROMO_CODES[promoDetails.code.toUpperCase()]
      ? { code: promoDetails.code, ...PROMO_CODES[promoDetails.code.toUpperCase()] }
      : promoDetails.discountAmount > 0
      ? { code: promoDetails.code || 'REF10', discountPercent: 10 }
      : null
  );
  const [promoMessage, setPromoMessage] = useState(
    promoDetails.discountAmount > 0
      ? (language === 'ur' ? '10٪ ڈسکاؤنٹ لاگو ہو گیا ہے!' : '10% Discount Applied!')
      : ''
  );

  // Financials
  const rawSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const subtotal = rawSubtotal * currency.rate;
  
  let calculatedDiscount = promoDetails.discountAmount * currency.rate;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      calculatedDiscount = (subtotal * appliedPromo.discountPercent) / 100;
    } else if (appliedPromo.discountFixed) {
      calculatedDiscount = appliedPromo.discountFixed * currency.rate;
    }
  }

  const distinctProductCount = new Set(items.map((i) => i.product.id)).size;
  const baseDeliveryPKR = distinctProductCount > 0 ? 300 * distinctProductCount : 0;
  const shipping = baseDeliveryPKR * currency.rate;

  const grandTotal = Math.max(0, subtotal - calculatedDiscount + shipping);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customer.fullName.trim() || !customer.phone.trim() || !customer.address.trim() || !customer.city.trim()) {
      setFormError(language === 'ur' ? 'براہ کرم اپنا نام، فون نمبر، شہر اور مکمل پتہ درج کریں' : 'Please provide your Full Name, Phone/WhatsApp, City and Address');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedOrder: PlacedOrder = {
        orderId: `SBA-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        customer,
        items,
        subtotal,
        discount: calculatedDiscount,
        shipping,
        total: grandTotal,
        paymentMethod: language === 'ur' ? 'کیش آن ڈیلیوری (Cash on Delivery)' : 'Cash on Delivery',
        status: 'Confirmed',
        currency,
      };

      setConfirmedOrder(generatedOrder);
      onOrderSuccess(generatedOrder);
      onClearCart();
      setIsSubmitting(false);
      setStep('confirmation');
    }, 800);
  };

  const handleWhatsAppOrderShare = () => {
    if (!confirmedOrder) return;
    const itemList = confirmedOrder.items
      .map((i) => `• ${i.product.name} (Qty: ${i.quantity}) - ${i.selectedColor || ''}`)
      .join('\n');
    
    const msg = `*شاپنگ بائے عائشہ نیا آرڈر*\n\nآرڈر نمبر: ${confirmedOrder.orderId}\nکسٹمر کا نام: ${customer.fullName}\nفون: ${customer.phone}\nشہر: ${customer.city}\nایڈریس: ${customer.address}\n\n*آرڈر کی تفصیل:*\n${itemList}\n\n*کل رقم (Cash on Delivery):* ${currency.symbol}${confirmedOrder.total.toFixed(0)}\n\nمہربانی کر کے آرڈر کنفرم کر دیں!`;
    
    window.open(`https://wa.me/${BRAND.contact.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-4xl bg-[#080509] border border-[#FF168F]/40 rounded-2xl shadow-[0_0_60px_rgba(255,22,143,0.35)] overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-5 border-b border-[#2e1a2b] bg-[#171017] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full p-[1px] bg-gradient-to-tr from-[#FF168F] to-[#FF2D9B] shadow-[0_0_10px_#FF168F]">
              <img
                src={BRAND.logoImage}
                alt={BRAND.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white tracking-wide">
                {step === 'checkout' ? t.checkout.title : t.checkout.successTitle}
              </h2>
              <span className="text-[10px] uppercase tracking-widest text-[#FF8BC8]">
                Shopping By Ayesha · 100% Cash On Delivery
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-black/40 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'checkout' ? (
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
            
            {/* Left: Customer & Address Information */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-5 border-b lg:border-b-0 lg:border-r border-[#2e1a2b]">
              
              {formError && (
                <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-600 text-xs text-rose-200">
                  {formError}
                </div>
              )}

              {/* Strict Cash On Delivery Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center gap-3 text-xs text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">{t.checkout.codLabel}</div>
                  <div className="text-[11px] text-zinc-300">{t.cart.codNotice}</div>
                </div>
              </div>

              {/* Customer Contact */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF8BC8] flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#FF168F]/20 text-[#FF168F] text-[10px] flex items-center justify-center font-bold">1</span>
                  {t.checkout.step1}
                </h3>

                <div>
                  <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                    {t.checkout.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.checkout.fullNamePlaceholder}
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                      {t.checkout.phone} *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder={t.checkout.phonePlaceholder}
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                      {t.checkout.city} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t.checkout.cityPlaceholder}
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                    {t.checkout.address} *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder={t.checkout.addressPlaceholder}
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg p-3 text-xs text-white outline-none resize-none"
                  />
                </div>

              </div>

              {/* Payment Method Notice */}
              <div className="p-4 rounded-xl bg-[#171017] border border-[#2e1a2b] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                  <DollarSign className="w-4 h-4 text-[#FF168F]" />
                  <span>{t.checkout.paymentMethod}: 100% Cash On Delivery</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed font-sans" dir={language === 'ur' ? 'rtl' : 'ltr'}>
                  {language === 'ur'
                    ? 'کوئی ایڈوانس پیمنٹ نہیں ہے! پارسل چیک کر کے رقم کوریئر رائیڈر کو ادا کریں۔'
                    : 'Zero advance payment required. Safely inspect your parcel upon arrival and remit cash to the courier.'}
                </p>
              </div>

            </div>

            {/* Right: Order Summary & Placement */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-[#171017]/40 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-[#2e1a2b] pb-2">
                  {language === 'ur' ? 'آرڈر کی تفصیل' : 'Order Summary'} ({items.length} {items.length === 1 ? (language === 'ur' ? 'آئٹم' : 'Item') : (language === 'ur' ? 'آئٹمز' : 'Items')})
                </h3>

                {/* Items preview */}
                <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.product.images?.[0] || item.product.image || ''}
                        alt={item.product.name}
                        className="w-12 h-14 object-cover rounded-md bg-black border border-[#2e1a2b] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">{item.product.name}</div>
                        <div className="text-[11px] text-[#FF8BC8]">
                          Qty: {item.quantity} {item.selectedColor ? `· ${item.selectedColor}` : ''}
                        </div>
                      </div>
                      <div className="font-mono text-white tabular-nums">
                        {currency.symbol}{(item.product.price * item.quantity * currency.rate).toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo / Reference Discount Box */}
                <div className="pt-3 border-t border-[#2e1a2b] space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#FF8BC8] uppercase tracking-wider block">
                    {language === 'ur' ? 'پرومو کوڈ / ریفرنس ڈسکاؤنٹ (10%)' : 'Promo Code / Reference (10% Off)'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={language === 'ur' ? 'کوڈ یا ریفرنس نام درج کریں' : 'Code or Reference name'}
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      className="flex-1 bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-1.5 text-xs text-white uppercase outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const code = promoCodeInput.trim().toUpperCase();
                        if (!code) return;
                        if (PROMO_CODES[code]) {
                          setAppliedPromo({ code, ...PROMO_CODES[code] });
                          setPromoMessage(language === 'ur' ? '10٪ ڈسکاؤنٹ لاگو ہو گیا! 🎉' : '10% Discount Applied! 🎉');
                        } else {
                          setAppliedPromo({ code, discountPercent: 10, description: '10% Reference Discount' });
                          setPromoMessage(language === 'ur' ? '10٪ ریفرنس ڈسکاؤنٹ لاگو ہو گیا! 🎉' : '10% Reference Discount Applied! 🎉');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#2e1a2b] hover:bg-[#FF168F] text-xs font-semibold text-white transition-colors"
                    >
                      {language === 'ur' ? 'لاگو کریں' : 'Apply'}
                    </button>
                  </div>
                  {promoMessage && (
                    <div className="text-[11px] text-emerald-400 font-semibold">{promoMessage}</div>
                  )}
                </div>

                {/* Cost lines */}
                <div className="space-y-2 pt-3 border-t border-[#2e1a2b] text-xs text-zinc-300">
                  <div className="flex justify-between">
                    <span>{t.cart.subtotal}</span>
                    <span className="font-mono text-white tabular-nums">{currency.symbol}{subtotal.toFixed(0)}</span>
                  </div>

                  {calculatedDiscount > 0 && (
                    <div className="flex justify-between text-[#FF8BC8]">
                      <span>{language === 'ur' ? 'ریفرنس / پرومو ڈسکاؤنٹ (10%)' : 'Reference Discount (10%)'}</span>
                      <span className="font-mono tabular-nums">-{currency.symbol}{calculatedDiscount.toFixed(0)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Charges (Rs. 300)</span>
                    <span className="font-mono text-white tabular-nums">
                      {currency.symbol}{shipping.toFixed(0)}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-[#2e1a2b]">
                    <span className="font-serif text-sm font-bold text-white uppercase tracking-wider">{t.cart.total}</span>
                    <span className="font-mono text-2xl font-bold text-[#FF168F] tabular-nums neon-text-glow">
                      {currency.symbol}{grandTotal.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-neon-pink py-4 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,22,143,0.6)] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{language === 'ur' ? 'آرڈر درج ہو رہا ہے...' : 'Placing Order...'}</span>
                    </div>
                  ) : (
                    <>
                      <PackageCheck className="w-5 h-5" />
                      <span>{t.checkout.confirmOrder}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'ur' ? '100٪ کیش آن ڈیلیوری محفوظ آرڈر' : '100% Cash On Delivery Safe Order'}</span>
                </div>
              </div>

            </div>
          </form>
        ) : (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="font-serif text-2xl font-bold text-white">
                {t.checkout.successTitle}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans" dir={language === 'ur' ? 'rtl' : 'ltr'}>
                {t.checkout.successMsg}
              </p>
            </div>

            {confirmedOrder && (
              <div className="p-4 rounded-xl bg-[#171017] border border-[#2e1a2b] max-w-sm mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-[#2e1a2b] pb-2">
                  <span className="text-zinc-400">{t.checkout.orderNumber}:</span>
                  <span className="font-mono font-bold text-[#FF168F]">{confirmedOrder.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">{t.checkout.fullName}:</span>
                  <span className="text-white font-medium">{confirmedOrder.customer.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">{t.checkout.city}:</span>
                  <span className="text-white font-medium">{confirmedOrder.customer.city}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#2e1a2b]">
                  <span className="text-zinc-300 font-bold">{t.cart.total}:</span>
                  <span className="font-mono text-base font-bold text-[#FF168F]">{currency.symbol}{confirmedOrder.total.toFixed(0)}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleWhatsAppOrderShare}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.checkout.whatsappFollowup}</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#171017] border border-[#2e1a2b] hover:border-[#FF168F] text-white text-xs font-semibold transition-all"
              >
                {language === 'ur' ? 'بیک ٹو شاپ' : 'Continue Shopping'}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
