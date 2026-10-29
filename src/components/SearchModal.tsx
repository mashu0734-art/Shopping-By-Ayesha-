import React, { useState, useMemo } from 'react';
import { X, Search, Sparkles, ArrowRight } from 'lucide-react';
import { Product, Currency } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: Currency;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const trendingTerms = ['Pink Sapphire', 'Minaudière Clutch', 'Eternity Bracelet', 'Couture Blazer', 'Crown Tiara'];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.materials.some((m) => m.toLowerCase().includes(q))
    );
  }, [products, query]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#080509] border border-[#FF168F]/40 rounded-2xl shadow-[0_0_50px_rgba(255,22,143,0.35)] overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#2e1a2b] bg-[#171017] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#FF168F]" />
          <input
            type="text"
            autoFocus
            placeholder="Search by gem, style, material (e.g. pink sapphire, clutch)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-black/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Trending Searches */}
        {!query && (
          <div className="p-5 space-y-3 bg-[#080509]">
            <div className="text-xs font-bold uppercase tracking-wider text-[#FF8BC8] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF168F]" />
              <span>Trending Haute Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingTerms.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 rounded-lg bg-[#171017] border border-[#2e1a2b] hover:border-[#FF168F] text-xs text-zinc-300 hover:text-white transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {query && (
          <div className="max-h-96 overflow-y-auto p-4 space-y-2 bg-[#080509]">
            {results.length > 0 ? (
              results.map((product) => {
                const convertedPrice = (product.price * currency.rate).toFixed(0);
                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-[#171017] border border-[#2e1a2b] hover:border-[#FF168F] cursor-pointer transition-all group"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-16 object-cover rounded-lg bg-black border border-[#2e1a2b] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs uppercase tracking-wider text-[#FF8BC8] font-semibold">
                        {product.category}
                      </div>
                      <h4 className="font-serif text-sm font-bold text-white group-hover:text-[#FFD6EA] truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-zinc-400 truncate">{product.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-[#FF168F] tabular-nums">
                        {currency.symbol}{convertedPrice}
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#FF168F] ml-auto mt-1 transition-colors" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-zinc-400">
                No luxury pieces found for "{query}". Try checking the spelling or search by category.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
