import React, { useMemo } from 'react';
import { SlidersHorizontal, Search, RotateCcw, Sparkles, Plus, RefreshCw } from 'lucide-react';
import { Product, Currency, FilterState, Language } from '../types';
import { ProductCard } from './ProductCard';
import { useTranslation } from '../translations';

interface ProductGridProps {
  products: Product[];
  currency: Currency;
  wishlist: string[];
  filterState: FilterState;
  language: Language;
  onSelectLanguage?: (lang: Language) => void;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onResetCatalog?: () => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, color?: string, size?: string) => void;
  onQuickView: (product: Product) => void;
  onOpenQuickPhotoChange?: (product: Product) => void;
  onOpenProductManager?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  currency,
  wishlist,
  filterState,
  language,
  onSelectLanguage,
  onUpdateFilters,
  onResetFilters,
  onResetCatalog,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onOpenQuickPhotoChange,
  onOpenProductManager,
}) => {
  const t = useTranslation(language);

  const getSubcategories = (cat: string) => {
    if (cat === 'Dresses') {
      return [
        { label: language === 'ur' ? 'تمام ڈریسز' : 'All Dresses', value: 'All' },
        { label: language === 'ur' ? '❄️ ونٹر (Winter)' : '❄️ Winter Dresses', value: 'Winter' },
        { label: language === 'ur' ? '☀️ سمر (Summer)' : '☀️ Summer Dresses', value: 'Summer' },
        { label: language === 'ur' ? '✨ فینسی پارٹی ویئر' : '✨ Fancy Party Wear', value: 'Fancy' },
      ];
    }
    if (cat === 'Jewellery') {
      return [
        { label: language === 'ur' ? 'تمام جیولری' : 'All Jewellery', value: 'All' },
        { label: language === 'ur' ? '✨ جھمکے (Jhumkay)' : '✨ Jhumkay', value: 'Jhumkey' },
        { label: language === 'ur' ? '💎 ہار و چوکر (Necklace)' : '💎 Necklace & Chokers', value: 'Necklace' },
        { label: language === 'ur' ? '🌟 بالیاں (Earrings)' : '🌟 Earrings', value: 'Earrings' },
        { label: language === 'ur' ? '💍 انگوٹھیاں (Rings)' : '💍 Rings', value: 'Ring' },
        { label: language === 'ur' ? '👑 مکمل سیٹ (Complete Set)' : '👑 Complete Sets', value: 'Complete Set' },
        { label: language === 'ur' ? '💫 کنگن و چوڑیاں' : '💫 Bracelets', value: 'Bracelets' },
      ];
    }
    if (cat === 'Bags') {
      return [
        { label: language === 'ur' ? 'تمام بیگز' : 'All Bags', value: 'All' },
        { label: language === 'ur' ? '👛 کلچز (Clutches)' : '👛 Clutches', value: 'Clutches' },
        { label: language === 'ur' ? '👜 ہینڈ بیگز (Handbags)' : '👜 Handbags', value: 'Handbags' },
        { label: language === 'ur' ? '✨ پارٹی بیگز (Party Bags)' : '✨ Party Bags', value: 'Party Bags' },
      ];
    }
    // When All is selected, show most popular quick type pills
    return [
      { label: language === 'ur' ? 'سب ورائٹی' : 'All Types', value: 'All' },
      { label: language === 'ur' ? '❄️ ونٹر ڈریسز' : '❄️ Winter', value: 'Winter' },
      { label: language === 'ur' ? '☀️ سمر ڈریسز' : '☀️ Summer', value: 'Summer' },
      { label: language === 'ur' ? '✨ فینسی ڈریسز' : '✨ Fancy', value: 'Fancy' },
      { label: language === 'ur' ? '✨ جھمکے' : '✨ Jhumkay', value: 'Jhumkey' },
      { label: language === 'ur' ? '💎 ہار' : '💎 Necklace', value: 'Necklace' },
      { label: language === 'ur' ? '💍 انگوٹھی' : '💍 Rings', value: 'Ring' },
      { label: language === 'ur' ? '👑 مکمل سیٹ' : '👑 Complete Set', value: 'Complete Set' },
      { label: language === 'ur' ? '👛 کلچز' : '👛 Clutches', value: 'Clutches' },
      { label: language === 'ur' ? '👜 ہینڈ بیگز' : '👜 Handbags', value: 'Handbags' },
    ];
  };

  const currentSubcategories = getSubcategories(filterState.category);

  // Filtering and Sorting logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (filterState.category !== 'All' && p.category !== filterState.category) {
        return false;
      }
      // Subcategory filter
      if (filterState.subcategory && filterState.subcategory !== 'All' && p.subcategory !== filterState.subcategory) {
        return false;
      }
      // Color filter: customer clicks on any color
      if (filterState.selectedColor && filterState.selectedColor !== 'All') {
        const hasColor = p.colors?.some(
          (c) => c.name.toLowerCase() === filterState.selectedColor!.toLowerCase()
        );
        if (!hasColor) return false;
      }
      // Search Query filter
      if (filterState.searchQuery.trim() !== '') {
        const query = filterState.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesSub = p.subtitle.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        const matchesSubcat = (p.subcategory || '').toLowerCase().includes(query);
        const matchesColor = p.colors?.some((c) => c.name.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesSub && !matchesCat && !matchesSubcat && !matchesColor) {
          return false;
        }
      }
      // In stock filter
      if (filterState.onlyInStock && !p.inStock) {
        return false;
      }
      // Price range check (with fallback max limit so Pakistani suit prices are never blocked)
      const maxLimit = filterState.maxPrice > 2000 ? filterState.maxPrice : 500000;
      if (p.price < filterState.minPrice || p.price > maxLimit) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (filterState.sortBy === 'price-asc') return a.price - b.price;
      if (filterState.sortBy === 'price-desc') return b.price - a.price;
      if (filterState.sortBy === 'rating') return b.rating - a.rating;
      if (filterState.sortBy === 'newest') return (b.tag ? 1 : 0) - (a.tag ? 1 : 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, filterState]);

  const getSectionTitle = () => {
    if (language === 'ur') {
      if (filterState.category === 'Dresses') return t.product.dressesCollection;
      if (filterState.category === 'Jewellery') return t.product.jewelleryCollection;
      if (filterState.category === 'Bags') return t.product.bagsCollection;
      return t.product.allCollections;
    }
    if (filterState.category === 'All') return t.product.allCollections;
    if (filterState.category === 'Dresses') return t.product.dressesCollection;
    if (filterState.category === 'Jewellery') return t.product.jewelleryCollection;
    if (filterState.category === 'Bags') return t.product.bagsCollection;
    return `${filterState.category} Collection`;
  };

  return (
    <section id="collection" className="bg-[#080509] py-10 sm:py-16 border-b border-[#2e1a2b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Product Title & Dedicated Products-Area Language Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2e1a2b]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#FF168F] font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FF168F]" />
              <span>{t.product.curatedLine}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {getSectionTitle()}
            </h2>
          </div>

          {/* Action Group: Add Product (Clean and prominent, language buttons removed as requested) */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {onOpenProductManager && (
              <button
                onClick={onOpenProductManager}
                className="btn-neon-pink px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_18px_rgba(255,22,143,0.5)] shrink-0 hover:shadow-[0_0_25px_rgba(255,22,143,0.8)] transition-all cursor-pointer"
                title="Add product photo and details"
              >
                <Plus className="w-4 h-4" />
                <span>{t.product.addProduct}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Bar (Search & Sort controls) */}
        <div className="py-5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.filter.searchPlaceholder}
              value={filterState.searchQuery}
              onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
              className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] focus:ring-1 focus:ring-[#FF168F] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 transition-all outline-none"
            />
            {filterState.searchQuery && (
              <button
                onClick={() => onUpdateFilters({ searchQuery: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Sort Selector */}
            <div className="flex items-center gap-2 bg-[#171017] border border-[#2e1a2b] rounded-lg px-3 py-1.5 focus-within:border-[#FF168F] transition-all">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF8BC8]" />
              <select
                value={filterState.sortBy}
                onChange={(e) => onUpdateFilters({ sortBy: e.target.value as FilterState['sortBy'] })}
                className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer pr-1"
              >
                <option value="featured" className="bg-[#171017] text-white">{t.filter.featured}</option>
                <option value="price-asc" className="bg-[#171017] text-white">{t.filter.priceLowHigh}</option>
                <option value="price-desc" className="bg-[#171017] text-white">{t.filter.priceHighLow}</option>
                <option value="rating" className="bg-[#171017] text-white">{t.filter.rating}</option>
                <option value="newest" className="bg-[#171017] text-white">{t.filter.newest}</option>
              </select>
            </div>

            {/* Reset Filters button if active filters exist */}
            {(filterState.category !== 'All' || (filterState.subcategory && filterState.subcategory !== 'All') || filterState.searchQuery !== '') && (
              <button
                onClick={onResetFilters}
                className="p-2 rounded-lg bg-[#171017] border border-[#2e1a2b] hover:border-[#FF168F] text-zinc-400 hover:text-[#FF168F] transition-colors"
                title={t.filter.reset}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Subcategory Pills Row (Winter, Summer, Fancy, Jhumkay, Rings, Complete Sets, Clutches, Handbags, etc.) */}
        <div className="pb-5 pt-1 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] text-[#FF8BC8] font-bold uppercase tracking-wider whitespace-nowrap mr-1">
            {t.filter.selectType}
          </span>
          {currentSubcategories.map((sub) => {
            const active = (filterState.subcategory || 'All') === sub.value;
            return (
              <button
                key={sub.value}
                onClick={() => onUpdateFilters({ subcategory: sub.value as any })}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#FF168F] text-white shadow-[0_0_12px_rgba(255,22,143,0.5)] border border-[#FFD6EA]/50 font-bold'
                    : 'bg-[#171017] text-zinc-300 hover:text-white border border-[#2e1a2b] hover:border-[#FF168F]/50'
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid: 3-column / 4-column responsive layout */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                language={language}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                onOpenQuickPhotoChange={onOpenQuickPhotoChange}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl bg-[#171017]/90 border border-[#FF168F]/50 p-8 sm:p-10 max-w-lg mx-auto space-y-6 shadow-[0_0_35px_rgba(255,22,143,0.25)]">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FF168F]/20 border border-[#FF168F]/60 flex items-center justify-center text-[#FF168F] shadow-[0_0_20px_rgba(255,22,143,0.4)]">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                {products.length === 0
                  ? (language === 'ur' ? 'تمام پروڈکٹس لوڈ کریں' : 'Load All Boutique Products')
                  : (language === 'ur' ? 'کوئی پروڈکٹ میچ نہیں ہوا' : 'No Products Match Selected Filters')}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-sm mx-auto">
                {products.length === 0
                  ? (language === 'ur'
                      ? 'تمام فینسی و ونٹر سوٹس، شاہی زیورات اور بیگز کی مکمل ورائٹی دیکھنے کے لیے نیچے کلک کریں۔'
                      : 'Click below to instantly display all winter and summer suits, royal jewellery sets, and designer bags.')
                  : (language === 'ur'
                      ? 'موجودہ فلٹرز کو ختم کریں تاکہ تمام ورائٹی سامنے نظر آئے۔'
                      : 'Clear your active filters or search query to see all available creations.')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {products.length === 0 && onResetCatalog ? (
                <button
                  type="button"
                  onClick={onResetCatalog}
                  className="btn-neon-pink w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,22,143,0.6)]"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{language === 'ur' ? 'تمام پروڈکٹس لوڈ کریں' : 'Show All Products'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="btn-neon-pink w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,22,143,0.6)]"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{language === 'ur' ? 'تمام پراڈکٹس دکھائیں (ری سیٹ)' : 'Show All Products'}</span>
                </button>
              )}

              {onOpenProductManager && (
                <button
                  type="button"
                  onClick={onOpenProductManager}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 bg-[#2e1a2b] hover:bg-[#3d233a] text-white border border-[#FF168F]/40 transition-all"
                >
                  <Plus className="w-4 h-4 text-[#FF8BC8]" />
                  <span>{language === 'ur' ? 'نیا سوٹ شامل کریں' : '+ Add Product'}</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
