import React, { useState, useRef } from 'react';
import { X, Plus, Upload, Camera, Trash2, Check, Sparkles, RefreshCw, Edit3, Image as ImageIcon, Palette } from 'lucide-react';
import { Product, ProductSubcategory } from '../types';
import { processAndCompressImage } from '../utils/imageUtils';

interface ProductManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetCatalog: () => void;
  onOpenQuickPhotoChange: (product: Product) => void;
}

// Popular Preset Suit & Dress Colors in Pakistan
const PRESET_SUIT_COLORS = [
  { name: 'Maroon (میرون)', hex: '#800020' },
  { name: 'Red (سرخ / لال)', hex: '#DC2626' },
  { name: 'Hot Pink / Fuchsia (شوخ گلابی)', hex: '#FF168F' },
  { name: 'Baby Pink (ہلکا گلابی)', hex: '#FF8BC8' },
  { name: 'Emerald Green (زمردی سبز)', hex: '#047857' },
  { name: 'Bottle Green (گہرا سبز)', hex: '#064E3B' },
  { name: 'Royal Blue (رائل بلیو)', hex: '#1D4ED8' },
  { name: 'Navy Blue (نیوی بلیو)', hex: '#1E3A8A' },
  { name: 'Sky / Powder Blue (آسمانی)', hex: '#38BDF8' },
  { name: 'Plum / Purple (جامنی)', hex: '#7C3AED' },
  { name: 'Lilac / Lavender (ہلکا جامنی)', hex: '#C084FC' },
  { name: 'Black (سیاہ / کالا)', hex: '#120d14' },
  { name: 'White / Off-White (سفید)', hex: '#FFFFFF' },
  { name: 'Ivory / Skin (سکن / کریم)', hex: '#FEF3C7' },
  { name: 'Mustard / Yellow (مسٹرڈ / پیلا)', hex: '#EAB308' },
  { name: 'Gold / Zari (سنہری)', hex: '#D97706' },
  { name: 'Silver / Metallic (سلور)', hex: '#9CA3AF' },
  { name: 'Peach / Rust (پیچ / زنگ)', hex: '#F97316' },
];

export const ProductManagerModal: React.FC<ProductManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetCatalog,
  onOpenQuickPhotoChange,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'All' | 'Dresses' | 'Jewellery' | 'Bags'>('All');

  // Form State
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<'Dresses' | 'Jewellery' | 'Bags'>('Dresses');
  const [subcategory, setSubcategory] = useState<ProductSubcategory>('Winter');
  const [price, setPrice] = useState('8500');
  const [originalPrice, setOriginalPrice] = useState('10500');
  const [tag, setTag] = useState('NEW ARRIVAL');
  const [description, setDescription] = useState('');
  const [materialsInput, setMaterialsInput] = useState('Pure Lawn / Velvet, Heavy Embroidered Dupatta');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFileLoading, setImageFileLoading] = useState(false);

  // Custom Colors Selection
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Hot Pink / Fuchsia (شوخ گلابی)', hex: '#FF168F' },
    { name: 'Maroon (میرون)', hex: '#800020' },
  ]);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#FF168F');

  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle color selection
  const toggleColor = (color: { name: string; hex: string }) => {
    setSelectedColors((prev) => {
      const exists = prev.some((c) => c.hex === color.hex || c.name === color.name);
      if (exists) {
        if (prev.length === 1) return prev; // Keep at least 1 color
        return prev.filter((c) => c.hex !== color.hex && c.name !== color.name);
      } else {
        return [...prev, color];
      }
    });
  };

  const handleAddCustomColor = () => {
    if (!customColorName.trim()) return;
    const newCol = { name: customColorName.trim(), hex: customColorHex };
    setSelectedColors((prev) => [...prev, newCol]);
    setCustomColorName('');
  };

  // Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormError('');
    setImageFileLoading(true);
    try {
      const compressedDataUrl = await processAndCompressImage(file, 1200, 0.85);
      setImagePreview(compressedDataUrl);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to process image');
    } finally {
      setImageFileLoading(false);
    }
  };

  // Start editing existing product
  const handleStartEdit = (p: Product) => {
    setEditingProductId(p.id);
    setName(p.name);
    setSubtitle(p.subtitle || '');
    setCategory(p.category);
    setSubcategory(p.subcategory);
    setPrice(p.price.toString());
    setOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setTag(p.tag || '');
    setDescription(p.description || '');
    setMaterialsInput(p.materials ? p.materials.join(', ') : '');
    setImagePreview(p.image);
    setSelectedColors(p.colors && p.colors.length > 0 ? p.colors : [{ name: 'Default', hex: '#FF168F' }]);
    setActiveTab('add');
  };

  // Reset form to blank
  const handleResetForm = () => {
    setEditingProductId(null);
    setName('');
    setSubtitle('');
    setCategory('Dresses');
    setSubcategory('Winter');
    setPrice('');
    setOriginalPrice('');
    setTag('');
    setDescription('');
    setMaterialsInput('');
    setImagePreview('');
    setSelectedColors([
      { name: 'Hot Pink / Fuchsia (شوخ گلابی)', hex: '#FF168F' },
      { name: 'Maroon (میرون)', hex: '#800020' },
    ]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Explicit Save Handler
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('براہ کرم پروڈکٹ کا نام درج کریں (Please enter a product title)');
      return;
    }

    if (!imagePreview) {
      setFormError('براہ کرم پروڈکٹ کی تصویر اپلوڈ کریں (Please upload a product photo)');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('براہ کرم درست قیمت درج کریں (Please enter a valid price)');
      return;
    }

    const finalColors = selectedColors.length > 0 ? selectedColors : [{ name: 'Standard Color', hex: '#FF168F' }];

    if (editingProductId) {
      // Update existing product
      const existingProduct = products.find((p) => p.id === editingProductId);
      if (existingProduct) {
        const updatedProduct: Product = {
          ...existingProduct,
          name: name.trim(),
          subtitle: materialsInput.trim(),
          category,
          subcategory,
          price: parsedPrice,
          originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
          image: imagePreview,
          tag: tag.trim() || undefined,
          description: description.trim(),
          materials: materialsInput ? materialsInput.split(',').map((m) => m.trim()).filter(Boolean) : [],
          colors: finalColors,
        };
        onUpdateProduct(updatedProduct);
        setSuccessMessage(`پروڈکٹ "${updatedProduct.name}" کامیابی سے اپڈیٹ ہو گئی ہے! 🎉`);
      }
    } else {
      // Add new product
      const newProduct: Product = {
        id: `sba-custom-${Date.now()}`,
        name: name.trim(),
        subtitle: materialsInput.trim(),
        category,
        subcategory,
        price: parsedPrice,
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        rating: 5.0,
        reviewsCount: 1,
        image: imagePreview,
        tag: tag.trim() || undefined,
        description: description.trim(),
        materials: materialsInput ? materialsInput.split(',').map((m) => m.trim()).filter(Boolean) : [],
        colors: finalColors,
        inStock: true,
        featured: true,
        sku: `SBA-${category.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        details: [],
      };

      onAddProduct(newProduct);
      setSuccessMessage(`نیا آرٹیکل "${newProduct.name}" اسٹور میں محفوظ ہو گیا ہے! 🎉`);
    }

    handleResetForm();
  };

  const filteredProducts = selectedCategoryFilter === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategoryFilter);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-4xl bg-[#080509] border border-[#FF168F]/60 rounded-2xl shadow-[0_0_50px_rgba(255,22,143,0.4)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2e1a2b] bg-[#171017] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF168F]/20 border border-[#FF168F]/50 text-[#FF168F] flex items-center justify-center shadow-[0_0_15px_rgba(255,22,143,0.3)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                Owner Studio · پروڈکٹ و قیمت مینیجر
              </h2>
              <p className="text-[11px] text-[#FF8BC8]">
                اپنے ڈریسز، جیولری یا بیگز کی قیمت، رنگ اور تمام تفصیلات درج کریں
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-black/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-3 bg-[#120a14] border-b border-[#2e1a2b] flex items-center justify-between shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (editingProductId) handleResetForm();
                setActiveTab('add');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'add'
                  ? 'btn-neon-pink shadow-[0_0_15px_rgba(255,22,143,0.4)]'
                  : 'bg-[#171017] text-zinc-400 hover:text-white border border-[#2e1a2b]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{editingProductId ? 'Edit Product Form' : 'Add New Product (نیا آرٹیکل)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'list'
                  ? 'btn-neon-pink shadow-[0_0_15px_rgba(255,22,143,0.4)]'
                  : 'bg-[#171017] text-zinc-400 hover:text-white border border-[#2e1a2b]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>All Products & Prices ({products.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset catalog back to sample Dresses, Jewellery & Bags?')) {
                onResetCatalog();
              }
            }}
            className="text-[11px] text-zinc-400 hover:text-[#FF168F] flex items-center gap-1.5 py-1 px-2.5 rounded hover:bg-[#171017] transition-colors"
            title="Restore original sample products"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Samples</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: ADD / EDIT PRODUCT */}
          {activeTab === 'add' && (
            <form onSubmit={handleSaveProduct} className="space-y-6 max-w-2xl mx-auto">
              
              {editingProductId && (
                <div className="p-3 rounded-xl bg-[#171017] border border-[#FF168F]/60 flex items-center justify-between text-xs text-[#FF8BC8]">
                  <span className="font-bold">موجودہ پروڈکٹ کی تفصیلات تبدیل ہو رہی ہیں (Editing Product)</span>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="underline text-white hover:text-[#FF168F]"
                  >
                    Cancel Edit / Add New
                  </button>
                </div>
              )}

              {successMessage && (
                <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-600 text-xs text-emerald-200 flex items-center gap-3 animate-in fade-in">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {formError && (
                <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-600 text-xs text-rose-200 font-semibold">
                  {formError}
                </div>
              )}

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#FF8BC8] block">
                  1. Select Category (کیٹیگری منتخب کریں):
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Dresses', 'Jewellery', 'Bags'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat);
                        if (cat === 'Dresses') setSubcategory('Winter');
                        else if (cat === 'Jewellery') setSubcategory('Jhumkey');
                        else if (cat === 'Bags') setSubcategory('Clutches');
                      }}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        category === cat
                          ? 'bg-[#171017] border-[#FF168F] text-white shadow-[0_0_15px_rgba(255,22,143,0.35)]'
                          : 'bg-[#171017]/50 border-[#2e1a2b] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span>{cat}</span>
                      {category === cat && <span className="w-2 h-2 rounded-full bg-[#FF168F]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategory Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#FF8BC8] block">
                  2. Article Type (قسم / سب کیٹیگری):
                </label>
                <div className="flex flex-wrap gap-2">
                  {category === 'Dresses' &&
                    (['Winter', 'Summer', 'Fancy'] as const).map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setSubcategory(sub)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          subcategory === sub
                            ? 'bg-[#FF168F] text-white border-[#FF8BC8] shadow-[0_0_10px_#FF168F]'
                            : 'bg-[#171017] text-zinc-300 border-[#2e1a2b] hover:border-[#FF168F]/40'
                        }`}
                      >
                        {sub === 'Winter' ? '❄️ Winter (ونٹر)' : sub === 'Summer' ? '☀️ Summer (سمر)' : '✨ Fancy (فینسی)'}
                      </button>
                    ))}
                  {category === 'Jewellery' &&
                    (['Jhumkey', 'Earrings', 'Necklace', 'Ring', 'Complete Set', 'Bracelets'] as const).map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setSubcategory(sub)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          subcategory === sub
                            ? 'bg-[#FF168F] text-white border-[#FF8BC8] shadow-[0_0_10px_#FF168F]'
                            : 'bg-[#171017] text-zinc-300 border-[#2e1a2b] hover:border-[#FF168F]/40'
                        }`}
                      >
                        {sub === 'Jhumkey' ? '✨ Jhumkay' : sub === 'Earrings' ? '🌟 Earrings' : sub === 'Necklace' ? '💎 Necklace' : sub === 'Ring' ? '💍 Ring' : sub === 'Complete Set' ? '👑 Complete Set' : '💫 Bracelets'}
                      </button>
                    ))}
                  {category === 'Bags' &&
                    (['Clutches', 'Handbags', 'Party Bags'] as const).map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setSubcategory(sub)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          subcategory === sub
                            ? 'bg-[#FF168F] text-white border-[#FF8BC8] shadow-[0_0_10px_#FF168F]'
                            : 'bg-[#171017] text-zinc-300 border-[#2e1a2b] hover:border-[#FF168F]/40'
                        }`}
                      >
                        {sub === 'Clutches' ? '👛 Clutches' : sub === 'Handbags' ? '👜 Handbags' : '✨ Party Bags'}
                      </button>
                    ))}
                </div>
              </div>

              {/* Photo Upload Area */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#FF8BC8] flex items-center justify-between">
                  <span>3. Product Photo (تصویر منتخب کریں):</span>
                  <span className="text-[10px] text-zinc-400 font-normal">Gallery, Camera or File</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-5">
                    <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#171017] border border-[#2e1a2b] flex items-center justify-center">
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="Uploaded preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setImagePreview('')}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 text-white hover:bg-rose-600 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-4 text-zinc-500 space-y-2">
                          <ImageIcon className="w-10 h-10 mx-auto text-zinc-600" />
                          <div className="text-xs">No image selected</div>
                        </div>
                      )}

                      {imageFileLoading && (
                        <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-[#FF168F] border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-7 space-y-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 px-4 rounded-xl bg-[#171017] hover:bg-[#251525] border-2 border-dashed border-[#FF168F]/60 hover:border-[#FF168F] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_0_20px_rgba(255,22,143,0.3)] transition-all"
                    >
                      <Upload className="w-4 h-4 text-[#FF168F]" />
                      <span>Upload Photo from Gallery / Camera</span>
                    </button>

                    <div className="pt-2 border-t border-[#2e1a2b]">
                      <div className="text-[11px] text-zinc-400 mb-1">Or paste photo link:</div>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={imagePreview.startsWith('http') ? imagePreview : ''}
                        onChange={(e) => setImagePreview(e.target.value)}
                        className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SUIT / PRODUCT COLORS SELECTOR */}
              <div className="space-y-3 p-4 rounded-xl bg-[#171017] border border-[#2e1a2b]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#FF8BC8] flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-[#FF168F]" />
                    <span>4. Suit Colors (سوٹ کے تمام دستیاب رنگ چنیں):</span>
                  </label>
                  <span className="text-[10px] text-zinc-400">
                    Selected: {selectedColors.length} {selectedColors.length === 1 ? 'color' : 'colors'}
                  </span>
                </div>

                {/* Selected Color Badges Preview */}
                <div className="flex flex-wrap gap-2 p-2 rounded-lg bg-[#080509] border border-[#2e1a2b] min-h-[40px] items-center">
                  {selectedColors.map((col, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#171017] border border-[#FF168F]/50 text-xs font-semibold text-white shadow-sm"
                    >
                      <span className="w-3 h-3 rounded-full border border-black" style={{ backgroundColor: col.hex }} />
                      <span>{col.name}</span>
                      <button
                        type="button"
                        onClick={() => toggleColor(col)}
                        className="p-0.5 rounded-full text-zinc-400 hover:text-rose-400 hover:bg-black/40 transition-colors"
                        title="Remove color"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Preset Suit Color Options */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1 pt-1">
                  {PRESET_SUIT_COLORS.map((col, idx) => {
                    const isSelected = selectedColors.some((c) => c.name === col.name || c.hex === col.hex);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleColor(col)}
                        className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all text-left ${
                          isSelected
                            ? 'bg-[#FF168F]/20 border-[#FF168F] text-white shadow-[0_0_10px_rgba(255,22,143,0.3)] font-bold'
                            : 'bg-[#080509] border-[#2e1a2b] text-zinc-300 hover:text-white'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full border border-black shrink-0 shadow-sm" style={{ backgroundColor: col.hex }} />
                        <span className="truncate flex-1">{col.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#FF8BC8] shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Color Input */}
                <div className="pt-2 border-t border-[#2e1a2b]/60 flex items-center gap-2">
                  <input
                    type="color"
                    value={customColorHex}
                    onChange={(e) => setCustomColorHex(e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                    title="Choose color shade"
                  />
                  <input
                    type="text"
                    placeholder="Custom color name (e.g. Sea Green / پستئی)"
                    value={customColorName}
                    onChange={(e) => setCustomColorName(e.target.value)}
                    className="flex-1 bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomColor}
                    className="px-3 py-1.5 rounded-lg bg-[#2e1a2b] hover:bg-[#FF168F] text-xs font-bold text-white transition-colors"
                  >
                    + Add Color
                  </button>
                </div>
              </div>

              {/* Title & Prices Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-[#FF8BC8] font-bold block mb-1">
                    5. Product Title (پروڈکٹ کا نام) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Maroon Silk Heavily Embroidered Suit"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-2 text-xs text-white outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#FF8BC8] font-bold block mb-1">
                    Price (پروڈکٹ کی قیمت / Price Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 8500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">
                    Original Price (پرانی قیمت / Optional Strikethrough)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 10500"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">
                    Tag Badge (e.g. NEW ARRIVAL, HOT, BEST SELLER)
                  </label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">
                    Fabric / Materials (کپڑے کی قسم)
                  </label>
                  <input
                    type="text"
                    value={materialsInput}
                    onChange={(e) => setMaterialsInput(e.target.value)}
                    className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] text-zinc-400 block mb-1">
                    Description (تفصیل)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief details about fabric, embroidery work, or organza dupatta..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* Explicit Submit / Save Button */}
              <div className="pt-4 border-t border-[#2e1a2b] flex justify-end gap-3">
                {editingProductId && (
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-5 py-3.5 rounded-xl bg-[#171017] border border-[#2e1a2b] text-xs font-bold text-zinc-300 hover:text-white"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-neon-pink py-3.5 px-8 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(255,22,143,0.5)] hover:shadow-[0_0_30px_rgba(255,22,143,0.8)]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{editingProductId ? 'محفوظ کریں (Save Changes to Store)' : 'محفوظ کریں (Add Product to Store)'}</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: MANAGE & EDIT ALL PRODUCTS */}
          {activeTab === 'list' && (
            <div className="space-y-6">
              
              {/* Category Filter for list */}
              <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-[#2e1a2b]">
                <div className="flex items-center gap-2">
                  {(['All', 'Dresses', 'Jewellery', 'Bags'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedCategoryFilter === cat
                          ? 'bg-[#FF168F] text-white shadow-[0_0_10px_#FF168F]'
                          : 'bg-[#171017] text-zinc-400 hover:text-white border border-[#2e1a2b]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    handleResetForm();
                    setActiveTab('add');
                  }}
                  className="btn-neon-pink px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Product</span>
                </button>
              </div>

              {/* Product Cards Row list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-[#171017] border border-[#2e1a2b] flex flex-col justify-between space-y-3 hover:border-[#FF168F]/50 transition-all"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-black shrink-0 border border-[#2e1a2b]">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase tracking-wider text-[#FF8BC8] font-bold block">
                          {p.category} · {p.subcategory}
                        </span>
                        <h4 className="font-serif text-xs font-bold text-white truncate" title={p.name}>
                          {p.name}
                        </h4>
                        <div className="font-mono text-xs font-bold text-[#FF168F] mt-1">
                          Rs. {p.price}
                        </div>
                        
                        {/* Display suit color swatches */}
                        {p.colors && p.colors.length > 0 && (
                          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                            {p.colors.map((c, idx) => (
                              <span
                                key={idx}
                                className="w-2.5 h-2.5 rounded-full border border-black shadow-sm"
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                              />
                            ))}
                            <span className="text-[9px] text-zinc-400 ml-1">
                              ({p.colors.length} {p.colors.length === 1 ? 'color' : 'colors'})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Inline Price Setting */}
                    <div className="pt-2 border-t border-[#2e1a2b] space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400 font-semibold">پروڈکٹ کی قیمت (Price):</span>
                        <span className="font-mono font-bold text-[#FF8BC8]">Rs. {p.price}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <input
                          type="number"
                          placeholder="New Price Rs."
                          defaultValue={p.price}
                          id={`input-price-${p.id}`}
                          className="flex-1 bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-2.5 py-1 text-xs text-white font-mono outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const inputEl = document.getElementById(`input-price-${p.id}`) as HTMLInputElement;
                            if (inputEl) {
                              const val = parseFloat(inputEl.value);
                              if (!isNaN(val) && val > 0) {
                                onUpdateProduct({ ...p, price: val });
                              }
                            }
                          }}
                          className="px-3 py-1 rounded-lg bg-[#FF168F] hover:bg-[#FF2D9B] text-xs font-bold text-white shrink-0 transition-colors shadow-sm"
                        >
                          Set Price
                        </button>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-[#2e1a2b] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(p)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-[#080509] hover:bg-[#FF168F] text-white text-[11px] font-bold flex items-center justify-center gap-1 border border-[#FF168F]/40 transition-colors"
                      >
                        <Edit3 className="w-3 h-3 text-[#FF8BC8]" />
                        <span>Edit Product & Colors</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onOpenQuickPhotoChange(p);
                          onClose();
                        }}
                        className="p-1.5 rounded-lg bg-[#080509] hover:bg-[#2e1a2b] text-zinc-300 hover:text-white border border-[#2e1a2b] transition-colors"
                        title="Change photo"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete "${p.name}" from catalog?`)) {
                            onDeleteProduct(p.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-black/30 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
