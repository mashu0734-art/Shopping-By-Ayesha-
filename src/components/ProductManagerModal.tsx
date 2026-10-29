import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Upload, Camera, Trash2, Check, Sparkles, Edit3, Image as ImageIcon, Palette, AlertCircle, RefreshCw, Search, Globe } from 'lucide-react';
import { Product, ProductSubcategory, Language } from '../types';
import { processAndCompressImage } from '../utils/imageUtils';

interface ProductManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  language?: Language;
  onSelectLanguage?: (lang: Language) => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetCatalog: () => void;
  onOpenQuickPhotoChange: (product: Product) => void;
}

// 50+ Authentic Pakistani Suit & Dress Colors with Roman Urdu & English names
export const PAKISTANI_SUIT_COLORS = [
  // Pinks & Reds (گلابی و سرخ)
  { name: 'Maroon (میرون)', hex: '#800020', group: 'reds' },
  { name: 'Blood Red (خون جیسا سرخ)', hex: '#8B0000', group: 'reds' },
  { name: 'Deep Crimson Red (گہرا سرخ / لال)', hex: '#DC2626', group: 'reds' },
  { name: 'Ruby Red (روبی ریڈ)', hex: '#991B1B', group: 'reds' },
  { name: 'Shocking Pink / Rani (رانی پنک / شوخ گلابی)', hex: '#FF168F', group: 'pinks' },
  { name: 'Magenta (مجنٹا)', hex: '#D946EF', group: 'pinks' },
  { name: 'Hot Pink (ہاٹ پنک)', hex: '#EC4899', group: 'pinks' },
  { name: 'Tea Pink (ٹی پنک)', hex: '#F4A5AE', group: 'pinks' },
  { name: 'Baby Pink (ہلکا گلابی)', hex: '#FBCFE8', group: 'pinks' },
  { name: 'Dusty Rose (ڈسٹی گلابی)', hex: '#D88B98', group: 'pinks' },
  { name: 'Peach (پیچ / آڑو)', hex: '#FDBA74', group: 'pinks' },
  { name: 'Coral Pink (کورل پنک)', hex: '#FB7185', group: 'pinks' },
  { name: 'Rust / Burnt Orange (زنگ / رسٹ)', hex: '#C2410C', group: 'reds' },

  // Greens (سبز و دھانی)
  { name: 'Bottle Green (گہرا بوتل سبز)', hex: '#064E3B', group: 'greens' },
  { name: 'Emerald Green (زمردی سبز)', hex: '#047857', group: 'greens' },
  { name: 'Mehendi Green (مہندی سبز)', hex: '#65A30D', group: 'greens' },
  { name: 'Dark Forest Green (جنگلی سبز)', hex: '#14532D', group: 'greens' },
  { name: 'Pistachio / Pista (پستہ رنگ)', hex: '#86EFAC', group: 'greens' },
  { name: 'Mint Green (منٹ گرین)', hex: '#6EE7B7', group: 'greens' },
  { name: 'Olive Green (زیتونی سبز)', hex: '#4D7C0F', group: 'greens' },
  { name: 'Sea Green (سی گرین)', hex: '#0D9488', group: 'greens' },
  { name: 'Parrot Green (طوطا سبز)', hex: '#84CC16', group: 'greens' },

  // Blues (نیلا و فیروزی)
  { name: 'Ferozi / Turquoise (فیروزی)', hex: '#06B6D4', group: 'blues' },
  { name: 'Royal Blue (رائل بلیو)', hex: '#1D4ED8', group: 'blues' },
  { name: 'Navy Blue (نیوی بلیو)', hex: '#1E3A8A', group: 'blues' },
  { name: 'Midnight Blue (مڈ نائٹ بلیو)', hex: '#0F172A', group: 'blues' },
  { name: 'Sky Blue (آسمانی)', hex: '#38BDF8', group: 'blues' },
  { name: 'Powder Blue (پاؤڈر بلیو)', hex: '#BAE6FD', group: 'blues' },
  { name: 'Ice Blue (آئس بلیو)', hex: '#E0F2FE', group: 'blues' },
  { name: 'Teal Blue (ٹیل بلیو)', hex: '#0F766E', group: 'blues' },
  { name: 'Peacock Blue (مور پنکھ نیلا)', hex: '#0284C7', group: 'blues' },

  // Purples & Lilacs (جامنی و فالسائی)
  { name: 'Plum (آلو بخارہ / پلم)', hex: '#6B21A8', group: 'purples' },
  { name: 'Deep Purple (گہرا جامنی)', hex: '#581C87', group: 'purples' },
  { name: 'Baingani / Eggplant (بینگنی)', hex: '#4A044E', group: 'purples' },
  { name: 'Lilac / Lavender (ہلکا جامنی / لیلک)', hex: '#C084FC', group: 'purples' },
  { name: 'Mauve (ماؤو)', hex: '#A855F7', group: 'purples' },
  { name: 'Falsai / Berry (فالسائی)', hex: '#701A75', group: 'purples' },

  // Yellows & Golds (پیلا و سنہری)
  { name: 'Mustard / Sarson (مسٹرڈ / سرسوں)', hex: '#CA8A04', group: 'yellows' },
  { name: 'Haldi Yellow (ہلدی پیلا)', hex: '#FACC15', group: 'yellows' },
  { name: 'Lemon Yellow (لیمن یلو)', hex: '#FEF08A', group: 'yellows' },
  { name: 'Gold / Zari (سنہری زری)', hex: '#D97706', group: 'yellows' },
  { name: 'Antique Gold (اینٹیک گولڈ)', hex: '#B45309', group: 'yellows' },
  { name: 'Copper / Bronze (تانبا / کاپر)', hex: '#9A3412', group: 'yellows' },
  { name: 'Silver / Metallic (سلور / چاندی)', hex: '#9CA3AF', group: 'neutrals' },

  // Neutrals, Blacks & Whites (سیاہ و سفید)
  { name: 'Jet Black (جیٹ کالا / سیاہ)', hex: '#111111', group: 'neutrals' },
  { name: 'Pure White (خالص سفید)', hex: '#FFFFFF', group: 'neutrals' },
  { name: 'Off-White (آف وائٹ)', hex: '#FAF8F5', group: 'neutrals' },
  { name: 'Ivory / Cream (آئیوری / کریم)', hex: '#FEF3C7', group: 'neutrals' },
  { name: 'Skin / Nude (سکن / نیوڈ)', hex: '#FDE68A', group: 'neutrals' },
  { name: 'Beige / Khaki (بایج / خاکی)', hex: '#D6D3D1', group: 'neutrals' },
  { name: 'Camel / Tan (اونٹ رنگ / کیمل)', hex: '#A16207', group: 'neutrals' },
  { name: 'Chocolate Brown (چاکلیٹ براؤن)', hex: '#451A03', group: 'neutrals' },
  { name: 'Mocha / Coffee (کافی براؤن)', hex: '#78350F', group: 'neutrals' },
  { name: 'Charcoal Grey (چارکول گرے)', hex: '#374151', group: 'neutrals' },
  { name: 'Light Ash Grey (ہلکا گرے)', hex: '#6B7280', group: 'neutrals' },
];

const DRAFT_STORAGE_KEY = 'sba_product_form_draft_v4';

export const ProductManagerModal: React.FC<ProductManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  language = 'en',
  onSelectLanguage,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetCatalog,
}) => {
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'All' | 'Dresses' | 'Jewellery' | 'Bags'>('All');

  // Load saved draft so user never loses their typed details
  const getSavedDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to parse draft', e);
    }
    return null;
  };

  const initialDraft = useRef(getSavedDraft());

  // Form State: Strictly simplified as user requested:
  // Photos, Product Name, New Price, Old Price, Colors, and Description!
  const [name, setName] = useState<string>(() => initialDraft.current?.name ?? '');
  const [price, setPrice] = useState<string>(() => initialDraft.current?.price ?? '8500');
  const [originalPrice, setOriginalPrice] = useState<string>(() => initialDraft.current?.originalPrice ?? '10500');
  const [description, setDescription] = useState<string>(() => initialDraft.current?.description ?? '');
  const [category, setCategory] = useState<'Dresses' | 'Jewellery' | 'Bags'>(
    () => initialDraft.current?.category ?? 'Dresses'
  );
  const [images, setImages] = useState<string[]>(() => initialDraft.current?.images ?? []);
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string; image?: string }[]>(
    () =>
      initialDraft.current?.selectedColors ?? [
        { name: 'Maroon (میرون)', hex: '#800020' },
        { name: 'Shocking Pink / Rani (رانی پنک / شوخ گلابی)', hex: '#FF168F' },
      ]
  );

  // Color Search & Custom Color State
  const [colorSearch, setColorSearch] = useState('');
  const [colorGroupFilter, setColorGroupFilter] = useState<'all' | 'pinks' | 'reds' | 'greens' | 'blues' | 'yellows' | 'purples' | 'neutrals'>('all');
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#FF168F');

  // Image Upload & Progress
  const [imageFileLoading, setImageFileLoading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [formError, setFormError] = useState('');
  const [hasDraftNotice, setHasDraftNotice] = useState(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Check if draft was restored on mount
  useEffect(() => {
    if (initialDraft.current && (initialDraft.current.name || (initialDraft.current.images && initialDraft.current.images.length > 0))) {
      setHasDraftNotice(true);
    }
  }, []);

  // Continuous auto-save to localStorage
  useEffect(() => {
    try {
      const draft = {
        editingProductId,
        name,
        price,
        originalPrice,
        description,
        category,
        selectedColors,
        images: images.slice(0, 3), // store up to 3 thumbnails to prevent quota error
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [editingProductId, name, price, originalPrice, description, category, selectedColors, images]);

  if (!isOpen) return null;

  // Filtered preset colors based on search and group
  const filteredColors = PAKISTANI_SUIT_COLORS.filter((c) => {
    if (colorGroupFilter !== 'all' && c.group !== colorGroupFilter) {
      return false;
    }
    if (colorSearch.trim()) {
      return c.name.toLowerCase().includes(colorSearch.toLowerCase());
    }
    return true;
  });

  // Safe Close Handler
  const handleAttemptClose = () => {
    // Only ask if user has unsaved text and hasn't saved yet
    if ((name.trim() || description.trim() || images.length > 0) && !editingProductId) {
      if (window.confirm('کیا آپ بند کرنا چاہتے ہیں؟ آپ کا لکھا ہوا فارم ڈرافٹ میں محفوظ رہے گا۔ (Do you want to close? Your typed text will remain saved as a draft)')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Toggle color selection
  const toggleColor = (color: { name: string; hex: string }) => {
    setSelectedColors((prev) => {
      const exists = prev.some((c) => c.hex.toLowerCase() === color.hex.toLowerCase() || c.name === color.name);
      if (exists) {
        if (prev.length === 1) return prev; // Keep at least 1 color
        return prev.filter((c) => c.hex.toLowerCase() !== color.hex.toLowerCase() && c.name !== color.name);
      } else {
        const defaultImg = images[prev.length] || images[0] || '';
        return [...prev, { ...color, image: defaultImg }];
      }
    });
  };

  const handleSetColorImage = (colorName: string, imageUrl: string) => {
    setSelectedColors((prev) =>
      prev.map((c) => (c.name === colorName ? { ...c, image: imageUrl } : c))
    );
  };

  const handleColorPhotoUpload = async (colorName: string, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    try {
      setImageFileLoading(true);
      setUploadProgressText(`${colorName} کے لیے تصویر پراسیس ہو رہی ہے...`);
      const compressed = await processAndCompressImage(fileList[0], 640, 0.65);
      setImages((prev) => (prev.includes(compressed) ? prev : [...prev, compressed]));
      setSelectedColors((prev) =>
        prev.map((c) => (c.name === colorName ? { ...c, image: compressed } : c))
      );
    } catch (e) {
      console.error('Failed to compress color photo', e);
      setFormError('تصویر پراسیس نہیں ہو سکی، دوبارہ کوشش کریں۔');
    } finally {
      setImageFileLoading(false);
      setUploadProgressText('');
    }
  };

  const handleAddCustomColor = () => {
    if (!customColorName.trim()) return;
    const defaultImg = images[selectedColors.length] || images[0] || '';
    const newCol = { name: customColorName.trim(), hex: customColorHex, image: defaultImg };
    setSelectedColors((prev) => [...prev, newCol]);
    setCustomColorName('');
  };

  // Direct Multiple Image Upload with INSTANT Data URLs
  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setFormError('');
    setImageFileLoading(true);
    const files = Array.from(fileList);
    const totalFiles = files.length;
    setUploadProgressText(`${totalFiles} تصاویر پراسیس ہو رہی ہیں...`);

    try {
      const compressedResults: string[] = [];
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        setUploadProgressText(`تصویر ${i + 1} از ${totalFiles} پراسیس ہو رہی ہے...`);
        const compressedDataUrl = await processAndCompressImage(file, 640, 0.65);
        compressedResults.push(compressedDataUrl);
      }

      // Append compressed base64 images directly
      setImages((prev) => [...prev, ...compressedResults]);
    } catch (err: any) {
      console.error('Image upload error:', err);
      setFormError('تصویر لوڈ کرنے میں مسئلہ آیا، دوبارہ کوشش کریں۔');
    } finally {
      setImageFileLoading(false);
      setUploadProgressText('');
      if (galleryInputRef.current) galleryInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  // Remove individual photo
  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Start editing existing product
  const handleStartEdit = (p: Product) => {
    setEditingProductId(p.id);
    setName(p.name);
    setCategory(p.category);
    setPrice(p.price.toString());
    setOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setDescription(p.description || p.subtitle || '');
    const imgs = Array.isArray(p.images) && p.images.length > 0 ? p.images : p.image ? [p.image] : [];
    setImages(imgs);
    setSelectedColors(
      p.colors && p.colors.length > 0
        ? p.colors.map((c, idx) => ({
            ...c,
            image: c.image || p.colorImages?.[c.name] || imgs[idx] || imgs[0] || '',
          }))
        : [{ name: 'Maroon', hex: '#800020', image: imgs[0] || '' }]
    );
    setFormError('');
    setHasDraftNotice(false);
    setActiveTab('add');
  };

  // Reset form to blank
  const handleResetForm = () => {
    setEditingProductId(null);
    setName('');
    setCategory('Dresses');
    setPrice('8500');
    setOriginalPrice('10500');
    setDescription('');
    setImages([]);
    setFormError('');
    setHasDraftNotice(false);
    setSelectedColors([
      { name: 'Maroon (میرون)', hex: '#800020' },
      { name: 'Shocking Pink / Rani (رانی پنک / شوخ گلابی)', hex: '#FF168F' },
    ]);
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {}
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Explicit Save Handler - Instantly saves product and closes modal to show suit in store!
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (images.length === 0) {
      setFormError('براہ کرم سب سے پہلے اوپر دی گئی گیلری یا کیمرہ سے کم از کم ایک تصویر منتخب کریں (Please select at least 1 photo)');
      return;
    }

    if (!name.trim()) {
      setFormError('براہ کرم سوٹ کا نام درج کریں (Please enter product title)');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('براہ کرم درست نئی قیمت (Rs.) درج کریں (Please enter a valid price)');
      return;
    }

    const finalColors = selectedColors.length > 0 ? selectedColors : [{ name: 'Standard Color', hex: '#FF168F' }];
    const colorImagesMap: Record<string, string> = {};
    const processedColors = finalColors.map((c, idx) => {
      const assignedImg = c.image || images[idx] || images[0] || '';
      colorImagesMap[c.name] = assignedImg;
      return {
        ...c,
        image: assignedImg,
      };
    });

    const defaultSubcategory: ProductSubcategory = category === 'Dresses' ? 'Winter' : category === 'Jewellery' ? 'Jhumkey' : 'Clutches';

    if (editingProductId) {
      const existingProduct = products.find((p) => p.id === editingProductId);
      if (existingProduct) {
        const updatedProduct: Product = {
          ...existingProduct,
          name: name.trim(),
          subtitle: description.trim().split('\n')[0] || 'Exclusive Collection',
          category,
          price: parsedPrice,
          originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
          images: images,
          image: images[0],
          description: description.trim(),
          colors: processedColors,
          colorImages: colorImagesMap,
        };
        onUpdateProduct(updatedProduct);
      }
    } else {
      const newProductId = `sba-${Date.now()}`;
      const newProduct: Product = {
        id: newProductId,
        name: name.trim(),
        subtitle: description.trim().split('\n')[0] || 'Exclusive Collection',
        category,
        subcategory: defaultSubcategory,
        price: parsedPrice,
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        rating: 5.0,
        reviewsCount: 1,
        images: images,
        image: images[0],
        tag: 'NEW ARRIVAL',
        description: description.trim(),
        materials: [],
        colors: processedColors,
        colorImages: colorImagesMap,
        inStock: true,
        featured: true,
        sku: `SBA-${category.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        details: [],
      };

      onAddProduct(newProduct);
    }

    // Clean up draft storage
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {}

    // Reset local form state
    handleResetForm();

    // Immediately close modal and take user directly to the storefront
    onClose();
  };

  const filteredProducts = selectedCategoryFilter === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategoryFilter);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div 
        className="relative w-full max-w-4xl bg-[#080509] border border-[#FF168F]/60 rounded-2xl shadow-[0_0_50px_rgba(255,22,143,0.4)] overflow-hidden flex flex-col max-h-[94vh]"
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2e1a2b] bg-[#171017] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF168F]/20 border border-[#FF168F]/50 text-[#FF168F] flex items-center justify-center shadow-[0_0_15px_rgba(255,22,143,0.3)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                {language === 'ur' ? 'سوٹس و قیمت مینیجر (Add & Manage Suits)' : 'Product & Suit Manager'}
              </h2>
              <p className="text-[11px] text-[#FF8BC8]">
                {language === 'ur'
                  ? 'تصویر لگائیں، نام اور قیمت لکھیں اور "محفوظ کریں" پر کلک کریں'
                  : 'Add product photos, title and price, then click Save'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onSelectLanguage && (
              <div className="flex items-center bg-[#080509] p-0.5 sm:p-1 rounded-xl border border-[#FF168F]/70 shadow-sm shrink-0">
                <Globe className="w-3.5 h-3.5 text-[#FF8BC8] mx-1 shrink-0" />
                <button
                  type="button"
                  onClick={() => onSelectLanguage('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    language === 'en'
                      ? 'bg-[#FF168F] text-white shadow-[0_0_8px_#FF168F]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Switch to English"
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => onSelectLanguage('ur')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    language === 'ur'
                      ? 'bg-[#FF168F] text-white shadow-[0_0_8px_#FF168F]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="اردو میں تبدیل کریں"
                >
                  اردو
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleAttemptClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-rose-950/80 hover:border-rose-600 border border-transparent transition-colors flex items-center gap-1 text-xs"
              title={language === 'ur' ? 'بند کریں (Close)' : 'Close'}
            >
              <span className="hidden sm:inline text-[11px] font-bold">
                {language === 'ur' ? 'بند کریں' : 'Close'}
              </span>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-3 bg-[#120a14] border-b border-[#2e1a2b] flex items-center justify-between shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('add')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'add'
                  ? 'btn-neon-pink shadow-[0_0_15px_rgba(255,22,143,0.4)]'
                  : 'bg-[#171017] text-zinc-400 hover:text-white border border-[#2e1a2b]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                {editingProductId
                  ? (language === 'ur' ? 'سوٹ کی تفصیل تبدیل کریں' : 'Edit Product')
                  : (language === 'ur' ? '+ نیا سوٹ لگائیں (Add Suit)' : '+ Add New Product')}
              </span>
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
              <span>
                {language === 'ur'
                  ? `اسٹور کے تمام سوٹس (${products.length})`
                  : `All Store Products (${products.length})`}
              </span>
            </button>
          </div>

          {editingProductId && (
            <button
              type="button"
              onClick={handleResetForm}
              className="text-xs text-[#FF8BC8] hover:text-white underline font-semibold"
            >
              {language === 'ur' ? 'Cancel Edit / نیا سوٹ لگائیں' : 'Cancel Edit / Add New'}
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* TAB 1: ADD / EDIT PRODUCT */}
          {activeTab === 'add' && (
            <form
              onSubmit={handleSaveProduct}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
                  e.preventDefault();
                }
              }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              
              {/* Draft Restored Banner */}
              {hasDraftNotice && (
                <div className="p-3.5 rounded-xl bg-[#171017] border border-[#FF168F]/60 text-xs text-white flex items-center justify-between gap-3 shadow-[0_0_15px_rgba(255,22,143,0.25)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF168F] animate-pulse" />
                    <span className="font-semibold">
                      آپ کا لکھا ہوا مسودہ خودکار محفوظ ہے (Draft auto-saved)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="text-[11px] text-[#FF8BC8] hover:text-white underline font-bold shrink-0 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>صاف کریں (Reset)</span>
                  </button>
                </div>
              )}

              {/* Error Notice */}
              {formError && (
                <div className="p-4 rounded-xl bg-rose-950/80 border-2 border-rose-600 text-xs text-rose-200 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. STEP ONE AT VERY TOP: PHOTOS & INSTANT PREVIEWS */}
              <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-[#171017] border-2 border-[#FF168F]/60 shadow-[0_0_20px_rgba(255,22,143,0.2)]">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#FF168F]" />
                    <span>{language === 'ur' ? '1. سوٹ کی تصاویر لگائیں (Select Photos) *' : '1. Product Photos (Select Photos) *'}</span>
                  </label>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    images.length > 0
                      ? 'bg-[#FF168F] text-white border-[#FF8BC8] shadow-[0_0_10px_#FF168F]'
                      : 'bg-[#080509] text-zinc-400 border-zinc-700'
                  }`}>
                    {language === 'ur'
                      ? `${images.length} ${images.length === 1 ? 'تصویر' : 'تصاویر'} منتخب`
                      : `${images.length} selected`}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {language === 'ur'
                    ? 'موبائل گیلری سے جتنی مرضی تصویریں سلیکٹ کریں یا براہ راست کیمرہ سے فوٹو لیں۔ تصویریں فوری سامنے نظر آئیں گی:'
                    : 'Select photos from your device gallery or capture directly with camera. Photos will show immediately below:'}
                </p>

                {/* Upload Action Labels (Clickable directly on mobile) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  
                  {/* Gallery Multiple Picker Button */}
                  <label
                    htmlFor="sba-gallery-upload"
                    className="cursor-pointer rounded-xl bg-[#080509] hover:bg-[#251525] border-2 border-[#FF168F] text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 py-4 px-4 shadow-[0_0_15px_rgba(255,22,143,0.35)] transition-all select-none active:scale-[0.98]"
                  >
                    <Upload className="w-5 h-5 text-[#FF168F]" />
                    <span>{language === 'ur' ? '🖼️ گیلری سے تصاویر چنیں (Gallery)' : '🖼️ Pick from Gallery'}</span>
                    <input
                      id="sba-gallery-upload"
                      type="file"
                      ref={galleryInputRef}
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFilesSelected(e.target.files)}
                    />
                  </label>

                  {/* Camera Direct Photo Button */}
                  <label
                    htmlFor="sba-camera-upload"
                    className="cursor-pointer rounded-xl bg-[#080509] hover:bg-[#251525] border-2 border-dashed border-[#FF8BC8]/70 text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 py-4 px-4 shadow-sm transition-all select-none active:scale-[0.98]"
                  >
                    <Camera className="w-5 h-5 text-[#FF8BC8]" />
                    <span>{language === 'ur' ? '📷 کیمرہ سے فوٹو لیں (Camera)' : '📷 Snap with Camera'}</span>
                    <input
                      id="sba-camera-upload"
                      type="file"
                      ref={cameraInputRef}
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => handleFilesSelected(e.target.files)}
                    />
                  </label>

                </div>

                {/* Loading / Progress Indicator */}
                {imageFileLoading && (
                  <div className="p-3 rounded-lg bg-[#080509] border border-[#FF168F]/50 text-xs text-[#FF8BC8] flex items-center gap-3 font-semibold animate-pulse">
                    <div className="w-4 h-4 border-2 border-[#FF168F] border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>{uploadProgressText || (language === 'ur' ? 'تصاویر پراسیس ہو رہی ہیں...' : 'Processing photos...')}</span>
                  </div>
                )}

                {/* Instant Previews Grid - Shows right in front of the user */}
                {images.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs text-[#FF8BC8] font-bold">
                      <span>{language === 'ur' ? 'منتخب شدہ تصاویر (سامنے دکھائی دے رہی ہیں):' : 'Selected Photos (Visible here):'}</span>
                      <button
                        type="button"
                        onClick={() => setImages([])}
                        className="text-zinc-400 hover:text-rose-400 underline font-normal text-xs"
                      >
                        {language === 'ur' ? 'تمام صاف کریں (Clear all)' : 'Clear all'}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 bg-black shadow-lg group ${
                            idx === 0 ? 'border-[#FF168F] ring-2 ring-[#FF168F]/40' : 'border-[#2e1a2b]'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {/* Number Badge */}
                          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/85 text-[10px] font-bold text-white shadow border border-white/20">
                            #{idx + 1} {idx === 0 ? (language === 'ur' ? 'مین فوٹو' : 'Cover') : ''}
                          </span>
                          {/* Remove Image Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-500 shadow-md transition-colors"
                            title="Delete photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. PRODUCT NAME / TITLE */}
              <div className="p-4 rounded-xl bg-[#171017] border border-[#2e1a2b] space-y-2">
                <label className="text-xs font-bold text-white block uppercase tracking-wider">
                  {language === 'ur' ? '2. سوٹ کا نام (Product Title) *' : '2. Product Title / Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'ur' ? 'مثال: Royal Maroon Embroidered Silk 3-Piece Suit' : 'e.g. Royal Maroon Embroidered Silk 3-Piece Suit'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3.5 py-3 text-xs sm:text-sm text-white outline-none font-semibold"
                />
              </div>

              {/* 3. NEW PRICE & OLD PRICE (RS.) */}
              <div className="p-4 rounded-xl bg-[#171017] border border-[#2e1a2b] space-y-3">
                <label className="text-xs font-bold text-white block uppercase tracking-wider">
                  {language === 'ur' ? '3. قیمت (New Price & Old Price in Rs.):' : '3. Pricing (New Price & Old Price in Rs.):'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#FF8BC8] block mb-1">
                      {language === 'ur' ? 'نئی قیمت (New Selling Price Rs.) *' : 'New Selling Price (Rs.) *'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#FF168F]">
                        Rs.
                      </span>
                      <input
                        type="number"
                        required
                        placeholder="8500"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white outline-none font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">
                      {language === 'ur' ? 'پرانی کٹی ہوئی قیمت (Old Price Rs.) - اختیاری' : 'Original Cut Price (Rs.) - Optional'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                        Rs.
                      </span>
                      <input
                        type="number"
                        placeholder="10500"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        className="w-full bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. EXPANDED PAKISTANI SUIT COLORS (50+ Authentically labeled shades) */}
              <div className="p-4 rounded-xl bg-[#171017] border border-[#2e1a2b] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#FF8BC8] flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-[#FF168F]" />
                    <span>{language === 'ur' ? '4. دستیاب رنگ منتخب کریں (Select Suit Colors):' : '4. Select Available Colors:'}</span>
                  </label>
                  <span className="text-[11px] font-bold text-white bg-[#080509] px-2.5 py-0.5 rounded-full border border-[#FF168F]/40">
                    {language === 'ur' ? `${selectedColors.length} رنگ منتخب` : `${selectedColors.length} selected`}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-300">
                  {language === 'ur'
                    ? 'جو رنگ آپ کے پاس موجود ہیں ان پر کلک کریں۔ کسٹمر جب اس رنگ پر کلک کرے گا، تو اسے یہ سوٹ نظر آئے گا:'
                    : 'Click colors available in stock. Customers can filter and view suits in their chosen shade:'}
                </p>

                {/* Selected Color Badges */}
                <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-[#080509] border border-[#2e1a2b] min-h-[44px] items-center">
                  {selectedColors.map((col, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171017] border border-[#FF168F] text-xs font-semibold text-white shadow-sm"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-black shadow" style={{ backgroundColor: col.hex }} />
                      <span>{col.name}</span>
                      <button
                        type="button"
                        onClick={() => toggleColor(col)}
                        className="p-0.5 rounded-full text-zinc-400 hover:text-rose-400 transition-colors ml-0.5"
                        title="Remove color"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Assign Photo for Each Color */}
                {selectedColors.length > 0 && (
                  <div className="p-3 rounded-xl bg-[#080509] border border-[#FF168F]/40 space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#FF8BC8] flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#FF168F]" />
                        <span>
                          {language === 'ur'
                            ? 'ہر رنگ کی اپنی تصویر لگائیں (Assign photo to this color):'
                            : 'Set Photo For Each Color (Switches when customer clicks color):'}
                        </span>
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      {language === 'ur'
                        ? 'گاہک جب نیچے جس رنگ پر کلک کرے گا، یہ وہی تصویر دکھائے گا۔ اوپر والی تصاویر میں سے منتخب کریں یا براہ راست نئی تصویر لگائیں:'
                        : 'When a customer taps this color, the card will instantly show this photo. Pick from your uploaded pictures or tap to upload a direct photo:'}
                    </p>

                    <div className="space-y-2.5 pt-1">
                      {selectedColors.map((col, idx) => {
                        const assignedPhoto = col.image || images[idx] || images[0] || '';
                        return (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-[#171017] border border-[#2e1a2b] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2 min-w-[140px]">
                              <span
                                className="w-4 h-4 rounded-full border border-black shadow shrink-0"
                                style={{ backgroundColor: col.hex }}
                              />
                              <span className="text-xs font-bold text-white truncate">{col.name}</span>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Current assigned photo preview */}
                              <div className="flex items-center gap-1.5 bg-[#080509] p-1 rounded-lg border border-[#FF168F]/50">
                                {assignedPhoto ? (
                                  <img
                                    src={assignedPhoto}
                                    alt={col.name}
                                    className="w-8 h-10 object-cover rounded border border-white/20"
                                  />
                                ) : (
                                  <div className="w-8 h-10 rounded bg-zinc-900 flex items-center justify-center text-[9px] text-zinc-500">
                                    No Pic
                                  </div>
                                )}
                                <span className="text-[10px] text-[#FF8BC8] font-semibold pr-1">
                                  {assignedPhoto ? 'فعال تصویر' : 'کوئی تصویر نہیں'}
                                </span>
                              </div>

                              {/* Quick Select from Uploaded Images */}
                              {images.length > 0 && (
                                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 max-w-[200px]">
                                  {images.map((img, imgIdx) => (
                                    <button
                                      key={imgIdx}
                                      type="button"
                                      onClick={() => handleSetColorImage(col.name, img)}
                                      className={`relative w-7 h-9 rounded overflow-hidden border transition-all shrink-0 ${
                                        assignedPhoto === img
                                          ? 'border-[#FF168F] ring-2 ring-[#FF168F] scale-105'
                                          : 'border-zinc-700 opacity-60 hover:opacity-100'
                                      }`}
                                      title={`Use Photo #${imgIdx + 1} for ${col.name}`}
                                    >
                                      <img src={img} alt={`Pic ${imgIdx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* Upload direct photo for this color */}
                              <label className="cursor-pointer px-2.5 py-1.5 rounded-lg bg-[#2e1a2b] hover:bg-[#FF168F] text-[10px] font-bold text-white transition-colors flex items-center gap-1 shrink-0">
                                <Upload className="w-3 h-3" />
                                <span>{language === 'ur' ? 'نئی تصویر لگائیں' : 'Upload Pic'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleColorPhotoUpload(col.name, e.target.files)}
                                />
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Color Search & Category Filters */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="رنگ تلاش کریں (e.g. Ferozi, Maroon, Pink...)"
                      value={colorSearch}
                      onChange={(e) => setColorSearch(e.target.value)}
                      className="w-full bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white outline-none"
                    />
                  </div>

                  {/* Group Filter Chips */}
                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
                    {[
                      { id: 'all', label: 'تمام (All)' },
                      { id: 'reds', label: 'سرخ (Reds)' },
                      { id: 'pinks', label: 'گلابی (Pinks)' },
                      { id: 'greens', label: 'سبز (Greens)' },
                      { id: 'blues', label: 'نیلا و فیروزی (Blues)' },
                      { id: 'yellows', label: 'پیلا و گولڈن' },
                      { id: 'purples', label: 'جامنی (Purples)' },
                      { id: 'neutrals', label: 'سیاہ و سفید' },
                    ].map((grp) => (
                      <button
                        key={grp.id}
                        type="button"
                        onClick={() => setColorGroupFilter(grp.id as any)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-semibold whitespace-nowrap transition-colors ${
                          colorGroupFilter === grp.id
                            ? 'bg-[#FF168F] text-white font-bold'
                            : 'bg-[#080509] text-zinc-400 hover:text-white border border-[#2e1a2b]'
                        }`}
                      >
                        {grp.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Swatch Button Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1 pt-1 border border-[#2e1a2b]/60 p-2 rounded-xl bg-[#0d070f]">
                  {filteredColors.map((col, idx) => {
                    const isSelected = selectedColors.some((c) => c.name === col.name || c.hex.toLowerCase() === col.hex.toLowerCase());
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleColor(col)}
                        className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all text-left ${
                          isSelected
                            ? 'bg-[#FF168F]/25 border-[#FF168F] text-white shadow-[0_0_10px_rgba(255,22,143,0.3)] font-bold'
                            : 'bg-[#171017] border-[#2e1a2b] text-zinc-300 hover:text-white hover:border-[#FF168F]/40'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full border border-black shrink-0 shadow-sm" style={{ backgroundColor: col.hex }} />
                        <span className="truncate flex-1">{col.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#FF8BC8] shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Color Shade */}
                <div className="pt-2 border-t border-[#2e1a2b]/60 flex items-center gap-2">
                  <input
                    type="color"
                    value={customColorHex}
                    onChange={(e) => setCustomColorHex(e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                    title="Choose custom shade"
                  />
                  <input
                    type="text"
                    placeholder="اپنا نیا رنگ لکھیں (e.g. پستئی رنگ / Sea Green)"
                    value={customColorName}
                    onChange={(e) => setCustomColorName(e.target.value)}
                    className="flex-1 bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomColor}
                    className="px-3 py-1.5 rounded-lg bg-[#2e1a2b] hover:bg-[#FF168F] text-xs font-bold text-white transition-colors"
                  >
                    + رنگ شامل کریں
                  </button>
                </div>
              </div>

              {/* 5. LARGE ALL-IN-ONE DESCRIPTION (Fabric, Dupatta, Work, Sizes, Details) */}
              <div className="p-4 rounded-xl bg-[#171017] border border-[#2e1a2b] space-y-2">
                <label className="text-xs font-bold text-white block uppercase tracking-wider">
                  {language === 'ur' ? '5. سوٹ کی تمام تفصیلات (Full Description) *' : '5. Full Description (Fabric, Work, Embroidery & Sizes) *'}
                </label>
                <p className="text-[11px] text-zinc-400">
                  {language === 'ur'
                    ? 'یہاں فیبرک، کڑھائی، دوپٹہ، کام، بازو، قمیض اور شلوار کی جو بھی تفصیل لکھیں گی، وہ گاہک کو سامنے نظر آئے گی:'
                    : 'Enter all details here (fabric, dupatta, work, shirt, trousers, sizing). Customers will see this directly on the product card & details modal:'}
                </p>
                <textarea
                  rows={5}
                  required
                  placeholder={language === 'ur'
                    ? 'مثال کے طور پر: پیور لان / ویلوٹ ہیوی کڑھائی والا 3 پیس سوٹ، آرگنزا دوپٹہ، کٹ ورک بارڈر، مکمل زری اور دھاگے کا کام...'
                    : 'e.g. Pure Lawn / Velvet embroidered 3-piece suit with organza dupatta, cutwork borders, and luxury hand embroidery...'}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg p-3 text-xs sm:text-sm text-white outline-none resize-none leading-relaxed"
                />
              </div>

              {/* 6. CATEGORY SELECTOR */}
              <div className="p-4 rounded-xl bg-[#171017] border border-[#2e1a2b] space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#FF8BC8] block">
                  {language === 'ur' ? '6. کیٹیگری منتخب کریں (Category):' : '6. Select Category:'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Dresses', 'Jewellery', 'Bags'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-3 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        category === cat
                          ? 'bg-[#171017] border-[#FF168F] text-white shadow-[0_0_15px_rgba(255,22,143,0.35)]'
                          : 'bg-[#171017]/50 border-[#2e1a2b] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span>
                        {cat === 'Dresses'
                          ? (language === 'ur' ? '👗 ملبوسات' : '👗 Dresses')
                          : cat === 'Jewellery'
                          ? (language === 'ur' ? '💍 زیورات' : '💍 Jewellery')
                          : (language === 'ur' ? '👜 بیگز' : '👜 Bags')}
                      </span>
                      {category === cat && <span className="w-2 h-2 rounded-full bg-[#FF168F]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* SUBMIT BUTTON - Prominent, Saves & Closes Directly to Live Store */}
              <div className="pt-4 border-t border-[#2e1a2b] flex items-center justify-between gap-3 sticky bottom-0 bg-[#080509]/95 backdrop-blur-md py-3 z-20">
                <button
                  type="button"
                  onClick={handleAttemptClose}
                  className="px-4 py-3 rounded-xl bg-[#171017] border border-[#2e1a2b] text-xs font-bold text-zinc-300 hover:text-white transition-colors"
                >
                  {language === 'ur' ? 'بند کریں (Close)' : 'Close'}
                </button>

                <button
                  type="submit"
                  disabled={imageFileLoading}
                  className="btn-neon-pink py-3.5 px-8 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(255,22,143,0.5)] hover:shadow-[0_0_30px_rgba(255,22,143,0.8)] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {editingProductId
                      ? (language === 'ur' ? 'محفوظ کریں (Save Changes)' : 'Save Changes')
                      : (language === 'ur' ? 'محفوظ کریں (Save Suit to Store)' : 'Save Product to Store')}
                  </span>
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
                      type="button"
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

                <div className="flex items-center gap-2">
                  {onResetCatalog && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('کیا آپ تمام اصل ڈریسز، جیولری اور بیگز بحال کرنا چاہتے ہیں؟ (Do you want to restore all default products?)')) {
                          onResetCatalog();
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-[#171017] hover:bg-[#2e1a2b] text-zinc-300 hover:text-white border border-[#2e1a2b] hover:border-[#FF168F]/60 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      title="تمام پراڈکٹس دوبارہ لوڈ کریں"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#FF8BC8]" />
                      <span>{language === 'ur' ? 'تمام پراڈکٹس لوڈ کریں' : 'Restore All Products'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      handleResetForm();
                      setActiveTab('add');
                    }}
                    className="btn-neon-pink px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'ur' ? '+ نیا سوٹ لگائیں' : '+ Add Product'}</span>
                  </button>
                </div>
              </div>

              {/* Product Cards Row list */}
              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-400 space-y-4">
                  <div>{language === 'ur' ? 'اس کیٹیگری میں ابھی کوئی پروڈکٹ موجود نہیں ہے۔' : 'No products found in this category.'}</div>
                  <div className="flex items-center justify-center gap-2">
                    {onResetCatalog && (
                      <button
                        type="button"
                        onClick={onResetCatalog}
                        className="btn-neon-pink px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{language === 'ur' ? 'تمام اصل پراڈکٹس لوڈ کریں' : 'Restore All Products'}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        handleResetForm();
                        setActiveTab('add');
                      }}
                      className="px-4 py-2 rounded-lg bg-[#2e1a2b] text-white text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'ur' ? 'پہلا سوٹ لگائیں' : 'Add First Product'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((p) => {
                    const displayImg = (p.images && p.images[0]) || p.image || '';
                    return (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-xl bg-[#171017] border border-[#2e1a2b] flex flex-col justify-between space-y-3 hover:border-[#FF168F]/50 transition-all"
                      >
                        <div className="flex gap-3">
                          <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-black shrink-0 border border-[#2e1a2b]">
                            {displayImg ? (
                              <img
                                src={displayImg}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">No Pic</div>
                            )}
                            {p.images && p.images.length > 1 && (
                              <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-[9px] text-[#FF8BC8] font-bold">
                                {p.images.length} pics
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] uppercase tracking-wider text-[#FF8BC8] font-bold block">
                              {p.category}
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

                        {/* Action buttons */}
                        <div className="pt-2 border-t border-[#2e1a2b] flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(p)}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-[#080509] hover:bg-[#FF168F] text-white text-[11px] font-bold flex items-center justify-center gap-1 border border-[#FF168F]/40 transition-colors"
                          >
                            <Edit3 className="w-3 h-3 text-[#FF8BC8]" />
                            <span>Edit Product</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`کیا آپ "${p.name}" کو اسٹور سے ڈیلیٹ کرنا چاہتے ہیں؟`)) {
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
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
