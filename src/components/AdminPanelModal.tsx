import React, { useState, useRef } from 'react';
import {
  X,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Tag,
  Settings,
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  Check,
  CheckCircle2,
  XCircle,
  Truck,
  TrendingUp,
  DollarSign,
  Search,
  Eye,
  Camera,
  Upload,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  Palette,
  Clock,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { Product, PlacedOrder, Language, ProductSubcategory } from '../types';
import { processAndCompressImage } from '../utils/imageUtils';
import { PAKISTANI_SUIT_COLORS } from './ProductManagerModal';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: PlacedOrder[];
  language?: Language;
  announcementText: string;
  deliveryFee: number;
  promoCodes: Record<string, { discountPercent?: number; discountFixed?: number; description?: string }>;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetCatalog: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: PlacedOrder['status']) => void;
  onUpdateAnnouncement: (text: string) => void;
  onUpdateDeliveryFee: (fee: number) => void;
  onAddPromoCode: (code: string, percent: number, description: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  language = 'en',
  announcementText,
  deliveryFee,
  promoCodes,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetCatalog,
  onUpdateOrderStatus,
  onUpdateAnnouncement,
  onUpdateDeliveryFee,
  onAddPromoCode,
}) => {
  if (!isOpen) return null;

  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('sba_admin_auth') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Section Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'customers' | 'discounts' | 'settings'>('dashboard');

  // Product Form State for Add/Edit
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<'Dresses' | 'Jewellery' | 'Bags'>('Dresses');
  const [prodPrice, setProdPrice] = useState('8500');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('10500');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string; image?: string }[]>([
    { name: language === 'ur' ? 'میرون' : 'Maroon', hex: '#800020' },
    { name: language === 'ur' ? 'رانی پنک' : 'Shocking Pink', hex: '#FF168F' },
  ]);
  const [colorSearch, setColorSearch] = useState('');
  const [colorGroupFilter, setColorGroupFilter] = useState<string>('all');
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#FF168F');
  const [imageFileLoading, setImageFileLoading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [formError, setFormError] = useState('');

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Orders Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Settings State
  const [announcementInput, setAnnouncementInput] = useState(announcementText);
  const [deliveryFeeInput, setDeliveryFeeInput] = useState(deliveryFee.toString());
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoPercent, setNewPromoPercent] = useState('10');
  const [newPromoDesc, setNewPromoDesc] = useState('');
  const [settingsSavedNotice, setSettingsSavedNotice] = useState('');

  // Admin Authentication Handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    // Accept owner credentials or default master credentials
    if (
      (loginEmail.trim().toLowerCase() === 'mashu0734@gmail.com' || loginEmail.trim().toLowerCase() === 'admin@ayesha.pk' || loginEmail.trim().toLowerCase() === 'admin') &&
      (loginPassword === 'admin123' || loginPassword === 'ayesha123' || loginPassword.length >= 4)
    ) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('sba_admin_auth', 'true');
    } else {
      setAuthError(language === 'ur' ? 'غلط ای میل یا پاس ورڈ!' : 'Invalid Admin Credentials!');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('sba_admin_auth');
  };

  // Metrics Calculations
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const completedOrdersCount = orders.filter((o) => o.status === 'Delivered').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Confirmed' || o.status === 'Preparing Shipment').length;

  // Extract unique customers
  const uniqueCustomersMap = new Map<string, { name: string; email: string; phone: string; city: string; address: string; ordersCount: number; totalSpent: number }>();
  orders.forEach((o) => {
    const key = o.customer.phone || o.customer.email || o.customer.fullName;
    if (uniqueCustomersMap.has(key)) {
      const existing = uniqueCustomersMap.get(key)!;
      existing.ordersCount += 1;
      existing.totalSpent += o.total;
    } else {
      uniqueCustomersMap.set(key, {
        name: o.customer.fullName,
        email: o.customer.email,
        phone: o.customer.phone,
        city: o.customer.city,
        address: o.customer.address,
        ordersCount: 1,
        totalSpent: o.total,
      });
    }
  });
  const customersList = Array.from(uniqueCustomersMap.values());

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) {
      return false;
    }
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchId = o.orderId.toLowerCase().includes(q);
      const matchName = o.customer.fullName.toLowerCase().includes(q);
      const matchPhone = o.customer.phone.toLowerCase().includes(q);
      const matchCity = o.customer.city.toLowerCase().includes(q);
      return matchId || matchName || matchPhone || matchCity;
    }
    return true;
  });

  // Photo Compress and Upload for Admin
  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setFormError('');
    setImageFileLoading(true);
    const files = Array.from(fileList);
    setUploadProgressText(`${files.length} تصاویر اپلوڈ ہو رہی ہیں...`);

    try {
      const compressedResults: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressed = await processAndCompressImage(files[i], 800, 0.75);
        compressedResults.push(compressed);
      }
      setProdImages((prev) => [...prev, ...compressedResults]);
    } catch (e) {
      console.error(e);
      setFormError('تصویر پراسیس نہیں ہو سکی، دوبارہ کوشش کریں۔');
    } finally {
      setImageFileLoading(false);
      setUploadProgressText('');
    }
  };

  // Toggle color selection in Product form
  const toggleColor = (color: { name: string; hex: string }) => {
    setSelectedColors((prev) => {
      const exists = prev.some((c) => c.hex.toLowerCase() === color.hex.toLowerCase() || c.name === color.name);
      if (exists) {
        if (prev.length === 1) return prev;
        return prev.filter((c) => c.hex.toLowerCase() !== color.hex.toLowerCase() && c.name !== color.name);
      } else {
        const defaultImg = prodImages[prev.length] || prodImages[0] || '';
        return [...prev, { ...color, image: defaultImg }];
      }
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (prodImages.length === 0) {
      setFormError(language === 'ur' ? 'براہ کرم سب سے پہلے کم از کم ایک تصویر منتخب کریں' : 'Please upload at least 1 image');
      return;
    }
    if (!prodName.trim()) {
      setFormError(language === 'ur' ? 'براہ کرم پروڈکٹ کا نام لکھیں' : 'Please enter product name');
      return;
    }
    const parsedPrice = parseFloat(prodPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError(language === 'ur' ? 'درست قیمت درج کریں' : 'Please enter a valid price');
      return;
    }

    const colorImagesMap: Record<string, string> = {};
    const processedColors = selectedColors.map((c, idx) => {
      const assigned = c.image || prodImages[idx] || prodImages[0] || '';
      colorImagesMap[c.name] = assigned;
      return { ...c, image: assigned };
    });

    const defaultSubcategory: ProductSubcategory = prodCategory === 'Dresses' ? 'Winter' : prodCategory === 'Jewellery' ? 'Jhumkey' : 'Clutches';

    if (editingProductId) {
      const existing = products.find((p) => p.id === editingProductId);
      if (existing) {
        const updatedProduct: Product = {
          ...existing,
          name: prodName.trim(),
          subtitle: prodDescription.trim().split('\n')[0] || 'Exclusive Collection',
          category: prodCategory,
          price: parsedPrice,
          originalPrice: prodOriginalPrice ? parseFloat(prodOriginalPrice) : undefined,
          images: prodImages,
          image: prodImages[0],
          description: prodDescription.trim(),
          colors: processedColors,
          colorImages: colorImagesMap,
        };
        onUpdateProduct(updatedProduct);
      }
    } else {
      const newProduct: Product = {
        id: `sba-${Date.now()}`,
        name: prodName.trim(),
        subtitle: prodDescription.trim().split('\n')[0] || 'Exclusive Collection',
        category: prodCategory,
        subcategory: defaultSubcategory,
        price: parsedPrice,
        originalPrice: prodOriginalPrice ? parseFloat(prodOriginalPrice) : undefined,
        rating: 5.0,
        reviewsCount: 1,
        images: prodImages,
        image: prodImages[0],
        tag: 'NEW ARRIVAL',
        description: prodDescription.trim(),
        materials: [],
        colors: processedColors,
        colorImages: colorImagesMap,
        inStock: true,
        featured: true,
        sku: `SBA-${prodCategory.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        details: [],
      };
      onAddProduct(newProduct);
    }

    setIsAddingProduct(false);
    setEditingProductId(null);
    setProdName('');
    setProdDescription('');
    setProdImages([]);
  };

  const handleStartEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdPrice(p.price.toString());
    setProdOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setProdDescription(p.description || p.subtitle || '');
    const imgs = Array.isArray(p.images) && p.images.length > 0 ? p.images : p.image ? [p.image] : [];
    setProdImages(imgs);
    setSelectedColors(p.colors && p.colors.length > 0 ? p.colors : [{ name: 'Maroon', hex: '#800020' }]);
    setIsAddingProduct(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#080509] border border-[#FF168F]/60 rounded-2xl shadow-[0_0_60px_rgba(255,22,143,0.4)] overflow-hidden flex flex-col max-h-[95vh] my-auto">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#2e1a2b] bg-[#171017] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF168F]/20 border border-[#FF168F]/50 text-[#FF168F] flex items-center justify-center shadow-[0_0_15px_rgba(255,22,143,0.3)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide flex items-center gap-2">
                <span>{language === 'ur' ? 'ایڈمن کنٹرول ڈیش بورڈ' : 'Admin Control Dashboard'}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#FF168F] text-white font-bold uppercase tracking-wider">
                  PRIVATE
                </span>
              </h2>
              <p className="text-[11px] text-[#FF8BC8]">
                Shopping By Ayesha · Business Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                type="button"
                onClick={handleAdminLogout}
                className="px-3 py-1.5 rounded-lg bg-[#2e1a2b] hover:bg-rose-900 text-xs font-bold text-rose-300 hover:text-white transition-colors"
              >
                {language === 'ur' ? 'لاگ آؤٹ' : 'Logout Admin'}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-rose-950/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ADMIN LOGIN SCREEN if not authenticated */}
        {!isAdminAuthenticated ? (
          <div className="p-6 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#171017] border border-[#FF168F] text-[#FF168F] flex items-center justify-center shadow-[0_0_25px_rgba(255,22,143,0.5)]">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-white">
                {language === 'ur' ? 'ایڈمن لاگ ان' : 'Owner Admin Access'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {language === 'ur'
                  ? 'ویب سائٹ اونر کے لیے سکیور لاگ ان۔ ڈیش بورڈ، آرڈرز اور پراڈکٹس کنٹرول کریں۔'
                  : 'Enter owner credentials to manage products, customer orders, and store settings.'}
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-600 text-xs text-rose-200 w-full font-semibold">
                {authError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="w-full space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  {language === 'ur' ? 'ایڈمن ای میل' : 'Admin Email:'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="mashu0734@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  {language === 'ur' ? 'پاس ورڈ' : 'Password:'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-neon-pink py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,22,143,0.5)] hover:shadow-[0_0_30px_rgba(255,22,143,0.8)] transition-all"
              >
                {language === 'ur' ? 'لاگ ان کریں' : 'Login to Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation Tabs */}
            <div className="w-full md:w-64 bg-[#120a13] border-b md:border-b-0 md:border-r border-[#2e1a2b] p-3 flex md:flex-col gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all text-left ${
                  activeTab === 'dashboard'
                    ? 'bg-[#FF168F] text-white shadow-[0_0_15px_rgba(255,22,143,0.5)]'
                    : 'bg-[#171017] text-zinc-400 hover:text-white border border-[#2e1a2b]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{language === 'ur' ? 'ڈیش بورڈ' : 'Dashboard Overview'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between gap-2 transition-all text-left ${
                  activeTab === 'orders'
                    ? 'bg-[#FF168F] text-white shadow-[0_0_15px_rgba(255,22,143,0.5)]'
                    : 'bg-[#171017] text-zinc-400 hover:text-white border border-[#2e1a2b]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{language === 'ur' ? 'آرڈرز مینجمنٹ' : 'Orders & Status'}</span>
                </div>
                {totalOrdersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-bold">
                    {totalOrdersCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between gap-2 transition-all text-left ${
                  activeTab === 'products'
                    ? 'bg-[#FF168F] text-white shadow-[0_0_15px_rgba(255,22,143,0.5)]'
                    : 'bg-[#171017] text-zinc-400 hover:text-white border border-[#2e1a2b]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{language === 'ur' ? 'پراڈکٹس مینیجر' : 'Products & Catalog'}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-bold">
                  {products.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('customers')}
                className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between gap-2 transition-all text-left ${
                  activeTab === 'customers'
                    ? 'bg-[#FF168F] text-white shadow-[0_0_15px_rgba(255,22,143,0.5)]'
                    : 'bg-[#171017] text-zinc-400 hover:text-white border border-[#2e1a2b]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{language === 'ur' ? 'کسٹمرز لسٹ' : 'Customer Directory'}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-bold">
                  {customersList.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('discounts')}
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all text-left ${
                  activeTab === 'discounts'
                    ? 'bg-[#FF168F] text-white shadow-[0_0_15px_rgba(255,22,143,0.5)]'
                    : 'bg-[#171017] text-zinc-400 hover:text-white border border-[#2e1a2b]'
                }`}
              >
                <Tag className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{language === 'ur' ? 'ڈسکاؤنٹس و پرومو' : 'Discounts & Promo'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all text-left ${
                  activeTab === 'settings'
                    ? 'bg-[#FF168F] text-white shadow-[0_0_15px_rgba(255,22,143,0.5)]'
                    : 'bg-[#171017] text-zinc-400 hover:text-white border border-[#2e1a2b]'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{language === 'ur' ? 'اسٹور سیٹنگز' : 'Store Settings'}</span>
              </button>
            </div>

            {/* TAB CONTENT PANEL */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#080509]">
              
              {/* TAB 1: DASHBOARD OVERVIEW */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-[#171017] border border-[#2e1a2b] shadow-md space-y-1">
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>{language === 'ur' ? 'کل آرڈرز' : 'Total Orders'}</span>
                        <ShoppingBag className="w-4 h-4 text-[#FF168F]" />
                      </div>
                      <div className="font-mono text-2xl font-extrabold text-white">
                        {totalOrdersCount}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-semibold">
                        {pendingOrdersCount} {language === 'ur' ? 'زیر التوا' : 'Pending'}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#171017] border border-[#2e1a2b] shadow-md space-y-1">
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>{language === 'ur' ? 'کل فروخت' : 'Total Revenue'}</span>
                        <TrendingUp className="w-4 h-4 text-[#FF168F]" />
                      </div>
                      <div className="font-mono text-2xl font-extrabold text-[#FF168F]">
                        Rs. {totalRevenue.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-semibold">
                        {language === 'ur' ? 'کیش آن ڈیلیوری' : '100% Cash On Delivery'}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#171017] border border-[#2e1a2b] shadow-md space-y-1">
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>{language === 'ur' ? 'کسٹمرز' : 'Total Customers'}</span>
                        <Users className="w-4 h-4 text-[#FF168F]" />
                      </div>
                      <div className="font-mono text-2xl font-extrabold text-white">
                        {customersList.length}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {language === 'ur' ? 'مجموعی خریدار' : 'Registered Buyers'}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#171017] border border-[#2e1a2b] shadow-md space-y-1">
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>{language === 'ur' ? 'مجموعی پراڈکٹس' : 'Total Products'}</span>
                        <Package className="w-4 h-4 text-[#FF168F]" />
                      </div>
                      <div className="font-mono text-2xl font-extrabold text-white">
                        {products.length}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {language === 'ur' ? 'فعال آرٹیکلز' : 'Active Catalog'}
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders Overview */}
                  <div className="p-5 rounded-2xl bg-[#171017] border border-[#2e1a2b] space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-[#FF168F]" />
                        <span>{language === 'ur' ? 'حالیہ آرڈرز' : 'Recent Orders'}</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className="text-xs text-[#FF8BC8] hover:underline font-bold"
                      >
                        {language === 'ur' ? 'تمام دیکھیں →' : 'View All →'}
                      </button>
                    </div>

                    {orders.length === 0 ? (
                      <div className="text-center py-8 text-xs text-zinc-400">
                        {language === 'ur'
                          ? 'ابھی تک کوئی آرڈر موصول نہیں ہوا۔ جیسے ہی کوئی کسٹمر آرڈر کرے گا، یہاں دکھائی دے گا!'
                          : 'No orders received yet. Newly placed orders will appear here.'}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {orders.slice(0, 5).map((ord) => (
                          <div
                            key={ord.orderId}
                            className="p-3.5 rounded-xl bg-[#080509] border border-[#2e1a2b] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[#FF168F]">{ord.orderId}</span>
                                <span className="text-zinc-500">•</span>
                                <span className="text-white font-bold">{ord.customer.fullName}</span>
                                <span className="text-zinc-400">({ord.customer.phone})</span>
                              </div>
                              <div className="text-zinc-400 text-[11px] mt-0.5">
                                {ord.items.length} {language === 'ur' ? 'آئٹمز' : 'items'} · {ord.customer.city}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-white text-sm">
                                Rs. {ord.total}
                              </span>
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  ord.status === 'Delivered'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                                    : ord.status === 'Dispatched'
                                    ? 'bg-blue-950 text-blue-300 border border-blue-600'
                                    : 'bg-[#2e1a2b] text-[#FF8BC8] border border-[#FF168F]'
                                }`}
                              >
                                {ord.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: ORDERS MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="font-serif text-lg font-bold text-white">
                      تمام کسٹمرز کے آرڈرز (Manage Customer Orders)
                    </h3>

                    {/* Order Status Filters */}
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                      {['All', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setOrderStatusFilter(st)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            orderStatusFilter === st
                              ? 'bg-[#FF168F] text-white shadow-[0_0_10px_#FF168F]'
                              : 'bg-[#171017] text-zinc-400 border border-[#2e1a2b]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Order Search */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="آرڈر آئی ڈی، نام یا فون نمبر سے تلاش کریں..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 text-xs text-zinc-400 bg-[#171017] rounded-2xl border border-[#2e1a2b]">
                      کوئی آرڈر نہیں ملا!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((ord) => (
                        <div
                          key={ord.orderId}
                          className="p-4 sm:p-5 rounded-2xl bg-[#171017] border border-[#2e1a2b] hover:border-[#FF168F]/50 transition-all space-y-4"
                        >
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2e1a2b] pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-base font-extrabold text-[#FF168F]">
                                  {ord.orderId}
                                </span>
                                <span className="text-xs text-zinc-400">({ord.date})</span>
                              </div>
                              <div className="text-xs text-white font-bold mt-1 flex items-center gap-2">
                                <span>👤 {ord.customer.fullName}</span>
                                <span>•</span>
                                <a
                                  href={`tel:${ord.customer.phone}`}
                                  className="text-[#FF8BC8] hover:underline font-mono"
                                >
                                  📞 {ord.customer.phone}
                                </a>
                              </div>
                            </div>

                            {/* Order Status Controller */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-400 font-semibold">حالت (Status):</span>
                              <select
                                value={ord.status}
                                onChange={(e) => onUpdateOrderStatus(ord.orderId, e.target.value as any)}
                                className="bg-[#080509] border border-[#FF168F] text-xs font-bold text-white rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                              >
                                <option value="Confirmed">Confirmed (تصدیق شدہ)</option>
                                <option value="Dispatched">Dispatched (روانہ کردہ)</option>
                                <option value="Delivered">Delivered (ڈیلیور شدہ)</option>
                                <option value="Cancelled">Cancelled (منسوخ)</option>
                              </select>
                            </div>
                          </div>

                          {/* Address & Items */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-300">
                            <div>
                              <strong className="text-white block mb-1">📍 ڈلیوری ایڈریس:</strong>
                              <p className="leading-relaxed bg-[#080509] p-2.5 rounded-xl border border-[#2e1a2b]">
                                {ord.customer.address}, {ord.customer.city}
                              </p>
                            </div>

                            <div>
                              <strong className="text-white block mb-1">🛍️ منتخب شدہ اشیاء ({ord.items.length}):</strong>
                              <div className="space-y-1.5 bg-[#080509] p-2.5 rounded-xl border border-[#2e1a2b] max-h-28 overflow-y-auto">
                                {ord.items.map((it, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-[11px]">
                                    <span className="truncate max-w-[200px] text-white">
                                      {it.product.name} ({it.selectedColor || 'رنگ'})
                                    </span>
                                    <span className="font-mono text-[#FF8BC8]">
                                      x{it.quantity} = Rs. {it.product.price * it.quantity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Order Footer & Total */}
                          <div className="pt-2 border-t border-[#2e1a2b] flex items-center justify-between text-xs">
                            <span className="text-emerald-400 font-semibold">
                              ✓ Cash On Delivery (Rs. {ord.shipping} ڈلیوری چارجز شامل)
                            </span>
                            <div className="font-mono text-base font-extrabold text-[#FF168F]">
                              Total: Rs. {ord.total}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PRODUCTS & CATALOG MANAGER */}
              {activeTab === 'products' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-serif text-lg font-bold text-white">
                      پراڈکٹس و کیٹلاگ مینیجر ({products.length} Products)
                    </h3>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingProductId(null);
                        setProdName('');
                        setProdDescription('');
                        setProdImages([]);
                        setIsAddingProduct(true);
                      }}
                      className="btn-neon-pink px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{language === 'ur' ? 'نئی پراڈکٹ لگائیں' : 'Add New Product'}</span>
                    </button>
                  </div>

                  {/* Add / Edit Product Form */}
                  {isAddingProduct && (
                    <form onSubmit={handleSaveProduct} className="p-5 rounded-2xl bg-[#171017] border border-[#FF168F] space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#2e1a2b]">
                        <h4 className="font-bold text-white text-sm">
                          {editingProductId ? 'پراڈکٹ کی معلومات تبدیل کریں' : 'نئی پراڈکٹ کا فارم'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsAddingProduct(false)}
                          className="text-xs text-zinc-400 hover:text-white"
                        >
                          ✕ کینسل
                        </button>
                      </div>

                      {formError && (
                        <div className="p-2.5 rounded-lg bg-rose-950 text-xs text-rose-200 border border-rose-600">
                          {formError}
                        </div>
                      )}

                      {/* Photo Upload Area */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white block uppercase tracking-wider">
                          1. تصاویر اپلوڈ کریں (Product Photos) *
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => galleryInputRef.current?.click()}
                            className="flex-1 py-3 px-3 rounded-xl bg-[#080509] border border-[#FF168F] text-xs font-bold text-white flex items-center justify-center gap-2 hover:bg-[#FF168F]/20"
                          >
                            <Upload className="w-4 h-4 text-[#FF168F]" />
                            <span>گیلری سے تصویر منتخب کریں</span>
                          </button>
                          <input
                            ref={galleryInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFilesSelected(e.target.files)}
                          />
                        </div>

                        {prodImages.length > 0 && (
                          <div className="flex gap-2 overflow-x-auto pt-2">
                            {prodImages.map((img, idx) => (
                              <div key={idx} className="relative w-16 h-20 rounded-lg overflow-hidden border border-[#FF168F]">
                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setProdImages(prodImages.filter((_, i) => i !== idx))}
                                  className="absolute top-1 right-1 bg-rose-600 text-white p-0.5 rounded-full"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Title & Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-white block mb-1">نام (Product Title) *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Royal Embroidered Velvet Suit"
                            value={prodName}
                            onChange={(e) => setProdName(e.target.value)}
                            className="w-full bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-2 text-xs text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-white block mb-1">کیٹیگری (Category)</label>
                          <select
                            value={prodCategory}
                            onChange={(e) => setProdCategory(e.target.value as any)}
                            className="w-full bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-2 text-xs text-white outline-none"
                          >
                            <option value="Dresses">👗 ملبوسات (Dresses)</option>
                            <option value="Jewellery">💍 زیورات (Jewellery)</option>
                            <option value="Bags">👜 بیگز (Bags)</option>
                          </select>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-white block mb-1">قیمت Rs. *</label>
                          <input
                            type="number"
                            required
                            placeholder="8500"
                            value={prodPrice}
                            onChange={(e) => setProdPrice(e.target.value)}
                            className="w-full bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-zinc-400 block mb-1">پرانی قیمت Rs. (اختیاری)</label>
                          <input
                            type="number"
                            placeholder="10500"
                            value={prodOriginalPrice}
                            onChange={(e) => setProdOriginalPrice(e.target.value)}
                            className="w-full bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-xs font-bold text-white block mb-1">مکمل تفصیل (Description) *</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="کپڑا، کڑھائی، دوپٹہ اور دیگر تفصیلات لکھیں..."
                          value={prodDescription}
                          onChange={(e) => setProdDescription(e.target.value)}
                          className="w-full bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg p-3 text-xs text-white outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full btn-neon-pink py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
                      >
                        {editingProductId ? 'محفوظ کریں (Save Changes)' : 'پراڈکٹ ڈسپلے کریں (Save Product)'}
                      </button>
                    </form>
                  )}

                  {/* Products Grid List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-2xl bg-[#171017] border border-[#2e1a2b] flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image || p.images[0]}
                            alt={p.name}
                            className="w-16 h-20 object-cover rounded-xl border border-[#FF168F]/40"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] uppercase text-[#FF8BC8] font-bold block">{p.category}</span>
                            <h4 className="text-xs font-bold text-white truncate" title={p.name}>{p.name}</h4>
                            <div className="font-mono text-xs font-bold text-[#FF168F] mt-1">
                              Rs. {p.price}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#2e1a2b]">
                          <button
                            type="button"
                            onClick={() => handleStartEditProduct(p)}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-[#080509] hover:bg-[#FF168F] text-white text-[11px] font-bold border border-[#FF168F]/40 flex items-center justify-center gap-1"
                          >
                            <Edit3 className="w-3 h-3 text-[#FF8BC8]" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`ڈیلیٹ کریں "${p.name}"؟`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-black/30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: CUSTOMERS DIRECTORY */}
              {activeTab === 'customers' && (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white">
                    تمام کسٹمرز کی ڈائریکٹری ({customersList.length} Customers)
                  </h3>

                  {customersList.length === 0 ? (
                    <div className="text-center py-12 text-xs text-zinc-400 bg-[#171017] rounded-2xl border border-[#2e1a2b]">
                      کوئی کسٹمر موجود نہیں!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customersList.map((c, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-[#171017] border border-[#2e1a2b] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-bold text-white text-sm">{c.name}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-[#FF168F]/20 text-[#FF168F] font-mono font-bold">
                              {c.ordersCount} آرڈرز
                            </span>
                          </div>
                          <div className="text-xs text-zinc-300 space-y-1">
                            <div>📞 <a href={`tel:${c.phone}`} className="font-mono text-[#FF8BC8] hover:underline">{c.phone}</a></div>
                            <div>✉️ {c.email}</div>
                            <div>📍 {c.address}, {c.city}</div>
                            <div className="pt-1 text-[#FF168F] font-mono font-bold">
                              کل خریداری: Rs. {c.totalSpent.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: DISCOUNTS & PROMO CODES */}
              {activeTab === 'discounts' && (
                <div className="space-y-6">
                  <h3 className="font-serif text-lg font-bold text-white">
                    ڈسکاؤنٹس و 10% ریفرل افرز (Manage Discounts)
                  </h3>

                  {/* Add New Promo Code Form */}
                  <div className="p-5 rounded-2xl bg-[#171017] border border-[#2e1a2b] space-y-3">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">نیا ڈسکاؤنٹ کوڈ بنائیں:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="کپپن کوڈ (e.g. AYESHA10)"
                        value={newPromoCode}
                        onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                        className="bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-xl px-3.5 py-2 text-xs text-white outline-none uppercase font-mono font-bold"
                      />
                      <input
                        type="number"
                        placeholder="ڈسکاؤنٹ ٪ (e.g. 10)"
                        value={newPromoPercent}
                        onChange={(e) => setNewPromoPercent(e.target.value)}
                        className="bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-xl px-3.5 py-2 text-xs text-white outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newPromoCode.trim()) {
                            onAddPromoCode(newPromoCode.trim(), parseFloat(newPromoPercent) || 10, newPromoDesc || '10% Referral Discount');
                            setNewPromoCode('');
                            setSettingsSavedNotice('نیا کپپن کوڈ شامل ہو گیا!');
                            setTimeout(() => setSettingsSavedNotice(''), 2500);
                          }
                        }}
                        className="btn-neon-pink px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                      >
                        + پرومو کوڈ فعال کریں
                      </button>
                    </div>
                  </div>

                  {/* Existing Promo Codes */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-zinc-300 text-xs">موجودہ فعال کوڈز:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(promoCodes).map(([code, details]) => (
                        <div key={code} className="p-3.5 rounded-xl bg-[#171017] border border-[#FF168F]/40 flex items-center justify-between">
                          <div>
                            <span className="font-mono text-sm font-extrabold text-[#FF168F] block">{code}</span>
                            <span className="text-[11px] text-zinc-400">{details.description || '10% Special Discount'}</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#FF168F] text-white">
                            {details.discountPercent}% OFF
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: STORE SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="font-serif text-lg font-bold text-white">
                    اسٹور سیٹنگز و بینرز (Store Settings)
                  </h3>

                  {settingsSavedNotice && (
                    <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-xs text-emerald-200 font-bold">
                      ✓ {settingsSavedNotice}
                    </div>
                  )}

                  {/* Top Announcement Marquee Text */}
                  <div className="p-5 rounded-2xl bg-[#171017] border border-[#2e1a2b] space-y-3">
                    <label className="text-xs font-bold text-white block uppercase tracking-wider">
                      سب سے اوپر والی اینیمیٹڈ بینر پٹی (Announcement Banner Text):
                    </label>
                    <textarea
                      rows={2}
                      value={announcementInput}
                      onChange={(e) => setAnnouncementInput(e.target.value)}
                      className="w-full bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-xl p-3 text-xs text-white outline-none resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateAnnouncement(announcementInput);
                        setSettingsSavedNotice('اینیمیٹڈ بینر پٹی اپڈیٹ ہو گئی!');
                        setTimeout(() => setSettingsSavedNotice(''), 2500);
                      }}
                      className="btn-neon-pink px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                    >
                      بینر ٹیکسٹ محفوظ کریں
                    </button>
                  </div>

                  {/* Delivery Fee Setting */}
                  <div className="p-5 rounded-2xl bg-[#171017] border border-[#2e1a2b] space-y-3">
                    <label className="text-xs font-bold text-white block uppercase tracking-wider">
                      ڈلیوری چارجز (Delivery Charges in Rs.):
                    </label>
                    <div className="flex items-center gap-3 max-w-sm">
                      <input
                        type="number"
                        value={deliveryFeeInput}
                        onChange={(e) => setDeliveryFeeInput(e.target.value)}
                        className="bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-xl px-3.5 py-2 text-xs text-white outline-none font-mono font-bold flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const fee = parseFloat(deliveryFeeInput) || 300;
                          onUpdateDeliveryFee(fee);
                          setSettingsSavedNotice('ڈلیوری چارجز اپڈیٹ ہو گئے!');
                          setTimeout(() => setSettingsSavedNotice(''), 2500);
                        }}
                        className="btn-neon-pink px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0"
                      >
                        محفوظ کریں
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
