import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, ShieldCheck, Gem, Sparkles, Check, Truck, ArrowRight, Camera, MessageCircle } from 'lucide-react';
import { Product, Currency, Language } from '../types';
import { BRAND } from '../data/constants';
import { useTranslation } from '../translations';

interface ProductDetailModalProps {
  product: Product | null;
  currency: Currency;
  isOpen: boolean;
  language?: Language;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, color?: string, size?: string, quantity?: number) => void;
  onBuyNow: (product: Product, color?: string, size?: string, quantity?: number) => void;
  onOpenQuickPhotoChange?: (product: Product) => void;
  onUpdateProduct?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  isOpen,
  language = 'ur',
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onOpenQuickPhotoChange,
  onUpdateProduct,
}) => {
  if (!isOpen || !product) return null;
  const t = useTranslation(language);

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'shipping' | 'reviews'>('details');
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Price Edit State
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newPriceInput, setNewPriceInput] = useState(product.price.toString());

  const images = [product.image, ...(product.secondaryImage ? [product.secondaryImage] : [])];

  const convertedPrice = (product.price * currency.rate).toFixed(0);
  const convertedOriginalPrice = product.originalPrice
    ? (product.originalPrice * currency.rate).toFixed(0)
    : null;

  const handleAddToCart = () => {
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    onBuyNow(product, selectedColor, selectedSize, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#080509] border border-[#FF168F]/40 rounded-2xl shadow-[0_0_50px_rgba(255,22,143,0.35)] overflow-hidden my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#171017]/90 text-zinc-300 hover:text-white hover:bg-[#FF168F] transition-all border border-[#2e1a2b]"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
          
          {/* Left Column: Premium Image Gallery */}
          <div className="lg:col-span-6 bg-[#171017] p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#2e1a2b]">
            <div className="space-y-4">
              {/* Main Active Image with Glow Frame */}
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#0d090e] border border-[#2e1a2b]">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                
                {product.tag && (
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded bg-[#FF168F] text-white shadow-[0_0_12px_rgba(255,22,143,0.6)]">
                      {product.tag}
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === img
                          ? 'border-[#FF168F] shadow-[0_0_12px_rgba(255,22,143,0.5)]'
                          : 'border-[#2e1a2b] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Owner quick change photo trigger */}
              {onOpenQuickPhotoChange && (
                <button
                  type="button"
                  onClick={() => onOpenQuickPhotoChange(product)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#080509] hover:bg-[#FF168F] text-white border border-[#FF168F]/60 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5 text-[#FF8BC8]" />
                  <span>Change Product Photo (Apni Pic Lgayein)</span>
                </button>
              )}
            </div>

            {/* Packaging guarantee callout */}
            <div className="mt-6 p-3.5 rounded-xl bg-[#080509]/80 border border-[#2e1a2b] flex items-center gap-3">
              <Gem className="w-5 h-5 text-[#FF168F] shrink-0" />
              <div className="text-xs text-zinc-300">
                <strong className="text-white">Complimentary Signature Box:</strong> Arrives in illuminated pink velvet showcase case with magnetic closure.
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-[#080509] space-y-6">
            <div className="space-y-5">
              
              {/* Category, SKU & Wishlist */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FF8BC8]">
                  <span>{product.category}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="font-mono text-zinc-400">{product.sku}</span>
                </div>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    isWishlisted
                      ? 'bg-[#FF168F] text-white border-[#FF168F] shadow-[0_0_10px_#FF168F]'
                      : 'bg-[#171017] text-zinc-300 border-[#2e1a2b] hover:text-[#FF168F]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>

              {/* Product Title */}
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-zinc-400 mt-1 font-light">
                  {product.subtitle}
                </p>
              </div>

              {/* Star Rating & Reviews */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-[#FF168F] text-[#FF168F]'
                          : 'fill-zinc-800 text-zinc-800'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono font-bold text-white tabular-nums">
                  {product.rating} / 5.0
                </span>
                <span className="text-xs text-zinc-500">
                  ({product.reviewsCount} verified reviews)
                </span>
              </div>

              {/* Pricing Section */}
              <div className="p-4 rounded-xl bg-[#171017] border border-[#2e1a2b] space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-3xl font-bold text-[#FF168F] tabular-nums neon-text-glow">
                      {currency.symbol}{convertedPrice}
                    </span>
                    {convertedOriginalPrice && (
                      <span className="font-mono text-sm text-zinc-500 line-through tabular-nums">
                        {currency.symbol}{convertedOriginalPrice}
                      </span>
                    )}
                  </div>
                  
                  {onUpdateProduct && (
                    <button
                      type="button"
                      onClick={() => setIsEditingPrice(!isEditingPrice)}
                      className="px-2.5 py-1 rounded-lg bg-[#2e1a2b] hover:bg-[#FF168F] text-[11px] font-bold text-white transition-colors flex items-center gap-1 border border-[#FF168F]/30"
                    >
                      <span>{language === 'ur' ? 'قیمت تبدیل کریں' : 'Set Price'}</span>
                    </button>
                  )}
                </div>

                {/* Inline Price Change Box */}
                {isEditingPrice && onUpdateProduct && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const parsed = parseFloat(newPriceInput);
                      if (!isNaN(parsed) && parsed > 0) {
                        onUpdateProduct({ ...product, price: parsed });
                        setIsEditingPrice(false);
                      }
                    }}
                    className="p-3 rounded-xl bg-[#080509] border border-[#FF168F]/50 space-y-2 animate-in fade-in duration-200 shadow-lg"
                  >
                    <div className="text-xs font-bold text-[#FF8BC8]">
                      {language === 'ur' ? 'نئی قیمت درج کریں (Set New Price Rs.):' : 'Set New Price (Rs.):'}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        required
                        placeholder="Price e.g. 8500"
                        value={newPriceInput}
                        onChange={(e) => setNewPriceInput(e.target.value)}
                        className="flex-1 bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-1.5 text-xs text-white outline-none font-mono"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 rounded-lg btn-neon-pink text-xs font-bold whitespace-nowrap shadow-sm"
                      >
                        {language === 'ur' ? 'محفوظ کریں' : 'Save Price'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#2e1a2b]/60">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    ✓ 100% Cash On Delivery
                  </span>
                  <span className="text-zinc-400 text-[11px]">
                    In Stock & Ready to Ship
                  </span>
                </div>
              </div>

              {/* Fabric / Material Display */}
              {product.materials && product.materials.length > 0 && (
                <div className="p-3.5 rounded-xl bg-[#171017] border border-[#2e1a2b] space-y-1">
                  <div className="text-[11px] font-bold text-[#FF8BC8] uppercase tracking-wider">
                    {language === 'ur' ? 'کپڑا / فیبرک (Fabric / Material):' : 'Fabric / Material:'}
                  </div>
                  <div className="text-xs text-white font-medium">
                    {product.materials.join(', ')}
                  </div>
                </div>
              )}

              {/* Color Swatches */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                    <span>{language === 'ur' ? 'دستیاب رنگ (Available Colors):' : 'Available Colors:'}</span>
                    <span className="text-[#FF8BC8] font-bold">{selectedColor || product.colors[0]?.name}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          selectedColor === c.name || (!selectedColor && product.colors[0]?.name === c.name)
                            ? 'border-[#FF168F] bg-[#FF168F]/20 text-white shadow-[0_0_12px_rgba(255,22,143,0.5)]'
                            : 'border-[#2e1a2b] bg-[#171017] text-zinc-300 hover:border-[#FF168F]/40'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black shadow-sm"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="p-3.5 rounded-xl bg-[#171017] border border-[#2e1a2b] space-y-1">
                  <div className="text-[11px] font-bold text-[#FF8BC8] uppercase tracking-wider">
                    {language === 'ur' ? 'تفصیل (Description):' : 'Description:'}
                  </div>
                  <p className="text-xs text-zinc-200 leading-relaxed font-sans whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Order Now & Add to Bag Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#171017] border border-[#2e1a2b] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-3 text-zinc-300 hover:text-white hover:bg-black/40 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-mono font-bold text-white tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-3 text-zinc-300 hover:text-white hover:bg-black/40 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 btn-neon-pink py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,22,143,0.5)] hover:shadow-[0_0_30px_rgba(255,22,143,0.8)] transition-all"
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-white" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider btn-neon-pink text-white transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(255,22,143,0.6)]"
                >
                  <span>{language === 'ur' ? 'آرڈر کریں (Order Now)' : 'Order Now'}</span>
                  <ArrowRight className="w-4 h-4 text-[#FFD6EA]" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
