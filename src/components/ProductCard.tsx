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
  language = 'en',
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onOpenQuickPhotoChange,
}) => {
  const t = useTranslation(language);
  const isDataUri = typeof product.image === 'string' && (product.image.startsWith('data:') || product.images?.[0]?.startsWith('data:'));
  const [imageLoaded, setImageLoaded] = useState(() => isDataUri);
  const [isHovered, setIsHovered] = useState(false);

  // Helper to determine the photo corresponding to a specific color
  const getColorImage = (colorName: string): string => {
    const allImages = Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];
    if (!colorName) return allImages[0] || '';

    const colorIndex = product.colors?.findIndex(
      (c) => c.name.toLowerCase() === colorName.toLowerCase()
    ) ?? -1;
    const colorObj = colorIndex >= 0 ? product.colors[colorIndex] : undefined;

    // 1. Direct photo attached to this color object
    if (colorObj?.image) return colorObj.image;
    // 2. Direct mapping in colorImages record
    if (product.colorImages && product.colorImages[colorName]) return product.colorImages[colorName];
    // 3. Fallback to image at the same index in the images array
    if (colorIndex >= 0 && allImages[colorIndex]) return allImages[colorIndex];
    // 4. Default to primary image
    return allImages[0] || '';
  };

  const initialColor = product.colors && product.colors.length > 0 ? product.colors[0].name : '';
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  const [currentImage, setCurrentImage] = useState<string>(() => getColorImage(initialColor));

  // Sync when product props change
  React.useEffect(() => {
    const newColor = product.colors && product.colors.length > 0 ? product.colors[0].name : '';
    setSelectedColor(newColor);
    setCurrentImage(getColorImage(newColor));
  }, [product]);

  const handleColorClick = (colorName: string) => {
    setSelectedColor(colorName);
    const newImg = getColorImage(colorName);
    if (newImg) {
      setCurrentImage(newImg);
    }
  };

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
        {!imageLoaded && !isDataUri && (
          <div className="absolute inset-0 bg-[#1f141f] animate-pulse flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#FF168F]/40" />
          </div>
        )}

        {/* Displayed Image with smooth color change */}
        <img
          src={currentImage || (product.images && product.images[0]) || product.image || ''}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`h-full w-full object-cover object-center transition-all duration-500 ease-out ${
            (imageLoaded || isDataUri) ? 'opacity-100' : 'opacity-90'
          } ${isHovered ? 'scale-105' : 'scale-100'}`}
          referrerPolicy="no-referrer"
        />

        {/* Subtle contrast gradient scrim for edge definition */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171017] via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Selected Color Badge overlay on photo */}
        {selectedColor && (
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-black/85 backdrop-blur-md text-[#FFD6EA] border border-[#FF168F]/50 shadow">
              {selectedColor}
            </span>
          </div>
        )}

        {/* Neon Pink Sale / Drop Badge */}
        {product.tag && (
          <div className="absolute top-3 left-3 pointer-events-none">
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

      {/* Interactive Color Switcher Bar directly under the photo */}
      {product.colors && product.colors.length > 0 && (
        <div className="px-3 py-2 bg-[#120a13] border-b border-[#2e1a2b] flex items-center justify-between gap-1.5 z-10">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 flex-1">
            {product.colors.map((color, idx) => {
              const isCurSelected = selectedColor === color.name || (!selectedColor && idx === 0);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleColorClick(color.name);
                  }}
                  className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all shrink-0 ${
                    isCurSelected
                      ? 'border-[#FF168F] bg-[#FF168F]/30 text-white ring-1 ring-[#FF168F] shadow-[0_0_10px_rgba(255,22,143,0.5)] font-bold'
                      : 'border-[#2e1a2b] bg-[#171017] text-zinc-300 hover:border-[#FF168F]/60 hover:text-white'
                  }`}
                  title={`${color.name} - Click to see suit in this color`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/80 shadow-sm shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="truncate max-w-[85px]">{color.name.split('(')[0].trim()}</span>
                </button>
              );
            })}
          </div>
          <span className="text-[10px] text-[#FF8BC8] font-bold shrink-0 ml-1">
            {product.colors.length} {language === 'ur' ? 'رنگ' : 'Colors'}
          </span>
        </div>
      )}

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
          <p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-light leading-relaxed">
            {product.description || product.subtitle}
          </p>

          {/* Color Swatch Dots with click action */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-3 pt-2 border-t border-[#2e1a2b]/60">
              <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1.5">
                <span>{t.product.selectColor}</span>
                <span className="text-[#FF8BC8] font-semibold truncate max-w-[130px]">
                  {selectedColor || product.colors[0]?.name}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {product.colors.map((color, idx) => {
                  const isCurSelected = selectedColor === color.name || (!selectedColor && idx === 0);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleColorClick(color.name);
                      }}
                      className={`relative w-5 h-5 rounded-full border transition-all flex items-center justify-center ${
                        isCurSelected
                          ? 'border-[#FF168F] ring-2 ring-[#FF168F]/70 scale-110 shadow-[0_0_8px_#FF168F]'
                          : 'border-zinc-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {isCurSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white shadow" />
                      )}
                    </button>
                  );
                })}
              </div>
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
                const activeColor = selectedColor || product.colors?.[0]?.name;
                const defaultSize = product.sizes?.[0];
                onAddToCart(product, activeColor, defaultSize);
                // Also trigger checkout directly
                const event = new CustomEvent('sba-instant-order', { detail: { product, color: activeColor, size: defaultSize } });
                window.dispatchEvent(event);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg btn-neon-pink text-white text-[11px] font-bold uppercase tracking-wider hover:shadow-[0_0_15px_rgba(255,22,143,0.7)] transition-all flex items-center justify-center gap-1"
              aria-label={`Order Now - ${product.name}`}
              title={t.product.orderNow}
            >
              <span>{t.product.orderNow}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
