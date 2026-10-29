import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product, Currency } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: Product[];
  currency: Currency;
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  currency,
  onRemoveFromWishlist,
  onMoveToCart,
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#080509] border-l border-[#2e1a2b] shadow-[0_0_50px_rgba(255,22,143,0.3)] flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-[#2e1a2b] bg-[#171017] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#FF168F] fill-[#FF168F]" />
              <h2 className="font-serif text-lg font-bold text-white tracking-wide">
                Your Saved Wishlist ({wishlistedProducts.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-black/40 transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlistedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#171017] border border-[#FF168F]/30 flex items-center justify-center text-[#FF168F] shadow-[0_0_20px_rgba(255,22,143,0.25)]">
                  <Heart className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Your wishlist is empty</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                    Click the heart icon on any high jewellery or designer handbag creation to preserve it for later.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="btn-neon-pink px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider"
                >
                  Discover Pieces
                </button>
              </div>
            ) : (
              wishlistedProducts.map((product) => {
                const convertedPrice = (product.price * currency.rate).toFixed(0);
                return (
                  <div
                    key={product.id}
                    className="flex gap-4 p-3.5 rounded-xl bg-[#171017] border border-[#2e1a2b] hover:border-[#FF168F]/50 transition-all"
                  >
                    <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-[#0d090e] shrink-0 border border-[#2e1a2b]">
                      <img
                        src={product.images?.[0] || product.image || ''}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-serif text-sm font-semibold text-white line-clamp-1">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveFromWishlist(product.id)}
                            className="text-zinc-500 hover:text-[#FF168F] p-1"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[11px] text-[#FF8BC8] uppercase font-semibold">
                          {product.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#2e1a2b]">
                        <span className="font-mono text-sm font-bold text-[#FF168F] tabular-nums">
                          {currency.symbol}{convertedPrice}
                        </span>

                        <button
                          onClick={() => {
                            onMoveToCart(product);
                            onRemoveFromWishlist(product.id);
                          }}
                          className="btn-neon-pink px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Move to Bag</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {wishlistedProducts.length > 0 && (
            <div className="p-5 border-t border-[#2e1a2b] bg-[#171017]">
              <button
                onClick={() => {
                  wishlistedProducts.forEach((p) => onMoveToCart(p));
                  onClose();
                }}
                className="w-full btn-neon-pink py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>Move All to Shopping Bag</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
