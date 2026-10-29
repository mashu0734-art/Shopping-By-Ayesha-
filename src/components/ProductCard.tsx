import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Sparkles, Camera, MessageCircle } from 'lucide-react';
import { Product, Currency, Language } from '../types';
import { BRAND } from '../data/constants';
import { useTranslation } from '../translations';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  isWishlisted: boolean;
  language?: Language;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, color?: string, size?: string) => void;
  onQuickView: (product: Product) => void;
  onOpenQuickPhotoChange?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  language = 'ur',
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onOpenQuickPhotoChange,
}) => {
  const t = useTranslation(language);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const convertedPrice = (product.price * currency.rate).toFixed(0);
  const convertedOriginalPrice = product.originalPrice
    ? (product.originalPrice * currency.rate).toFixed(0)
    : null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-[#171017] rounded-xl overflow-hidden border border-[#2e1a2b] transition-all duration-300 hover:border-[#FF168F] hover:shadow-[0_0_22px_rgba(255,22,143,0.35)]"
    >
      {/* Visual Product Showcase (65-75% height proportion) */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0d090e] cursor-pointer" onClick={() => onQuickView(product)}>
        {/* Fallback & Loading Shimmer */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#1f141f] animate-pulse flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#FF168F]/40" />
          </div>
        )}

        {/* Primary and secondary hover image */}
        <img
          src={isHovered && product.secondaryImage ? product.secondaryImage : product.image}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`h-full w-full object-cover object-center transition-all duration-700 ease-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-105' : 'scale-100'}`}
          referrerPolicy="no-referrer"
        />

        {/* Subtle contrast gradient scrim for edge definition */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171017] via-transparent to-transparent opacity-60" />

        {/* Neon Pink Sale / Drop Badge */}
        {product.tag && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded bg-[#FF168F] text-white shadow-[0_0_12px_rgba(255,22,143,0.6)]">
              {product.tag}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-[#FF168F] text-white shadow-[0_0_12px_#FF168F]'
              : 'bg-[#080509]/70 text-zinc-300 hover:text-[#FF168F] hover:bg-[#171017]'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Floating Action Bar on Hover */}
        <div className="absolute inset-x-2.5 bottom-2.5 flex items-center gap-1.5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2 px-2.5 rounded-lg bg-[#080509]/95 hover:bg-[#080509] border border-[#FF168F]/50 text-white text-[11px] font-semibold tracking-wide flex items-center justify-center gap-1 shadow-lg hover:border-[#FF168F] transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-[#FF8BC8]" />
            <span>{t.product.quickView}</span>
          </button>

          {onOpenQuickPhotoChange && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenQuickPhotoChange(product);
              }}
              className="py-2 px-2.5 rounded-lg bg-[#171017]/95 hover:bg-[#FF168F] border border-[#FF168F]/70 text-white text-[11px] font-semibold flex items-center justify-center gap-1 shadow-lg transition-all"
              title="Upload your own picture for this product"
            >
              <Camera className="w-3.5 h-3.5 text-[#FFD6EA]" />
              <span className="hidden sm:inline">{t.product.changePhoto}</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-[#171017]">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#FF8BC8] font-medium">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-zinc-400">
              <Star className="w-3 h-3 fill-[#FF168F] text-[#FF168F]" />
              <span className="font-mono text-[11px] text-zinc-300 tabular-nums">
                {product.rating}
              </span>
              <span className="text-[10px] text-zinc-500">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-serif text-base font-semibold text-white group-hover:text-[#FFD6EA] transition-colors line-clamp-1 cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Subtitle / Key description snippet */}
          <p className="text-xs text-zinc-400 line-clamp-1 mt-1 font-light">
            {product.subtitle}
          </p>

          {/* Color swatches preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-3">
              {product.colors.map((color, idx) => (
                <span
                  key={idx}
                  className="w-3 h-3 rounded-full border border-black/50 shadow-sm"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              <span className="text-[10px] text-zinc-500 ml-1">
                {product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'}
              </span>
            </div>
          )}
        </div>

        {/* Pricing and Direct Quick Add */}
        <div className="mt-4 pt-3 border-t border-[#2e1a2b] flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-bold text-[#FF168F] tabular-nums tracking-tight">
                {currency.symbol}{convertedPrice}
              </span>
              {convertedOriginalPrice && (
                <span className="font-mono text-xs text-zinc-500 line-through tabular-nums">
                  {currency.symbol}{convertedOriginalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold text-emerald-400">
              ✓ {t.product.codBadge}
            </span>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <button
              onClick={() => {
                const defaultColor = product.colors?.[0]?.name;
                const defaultSize = product.sizes?.[0];
                onAddToCart(product, defaultColor, defaultSize);
                // Also trigger checkout directly
                const event = new CustomEvent('sba-instant-order', { detail: { product, color: defaultColor, size: defaultSize } });
                window.dispatchEvent(event);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg btn-neon-pink text-white text-[11px] font-bold uppercase tracking-wider hover:shadow-[0_0_15px_rgba(255,22,143,0.7)] transition-all flex items-center justify-center gap-1"
              aria-label={`Order Now - ${product.name}`}
              title="Order Now"
            >
              <span>{language === 'ur' ? 'آرڈر' : 'Order Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
