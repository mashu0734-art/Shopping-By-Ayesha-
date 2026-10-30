import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { LookbookModal } from './components/LookbookModal';
import { VIPClubSection } from './components/VIPClubSection';
import { Footer } from './components/Footer';
import { ProductManagerModal } from './components/ProductManagerModal';
import { QuickPhotoChangeModal } from './components/QuickPhotoChangeModal';
import { SidebarDrawer } from './components/SidebarDrawer';
import { AuthModal } from './components/AuthModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { InfoPagesModal } from './components/InfoPagesModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { INITIAL_PRODUCTS, CURRENCIES } from './data/products';
import { Product, CartItem, Currency, CurrencyCode, FilterState, PlacedOrder, UserAccount, Language } from './types';
import { loadSavedProducts, saveProductsReliably } from './utils/storage';

export default function App() {
  // Language State: 'en' (English) by default as requested, switching to 'ur' on click
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('sba_lang');
    return (saved === 'en' || saved === 'ur') ? saved : 'en';
  });

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('sba_lang', lang);
  };

  // User account state with localStorage persistence
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('sba_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Products with rock-solid IndexedDB & localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('sba_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: any) => {
            const imgs: string[] = Array.isArray(p.images) && p.images.length > 0
              ? p.images
              : p.image
              ? [p.image]
              : [];
            return {
              ...p,
              images: imgs,
              image: imgs[0] || p.image || '',
            };
          });
        }
      }
    } catch (e) {
      console.error('Failed to load saved products', e);
    }
    // Default to INITIAL_PRODUCTS so the storefront is never empty!
    return INITIAL_PRODUCTS;
  });

  // Load from IndexedDB on startup (unlimited storage quota)
  useEffect(() => {
    loadSavedProducts().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setProducts(loaded);
      } else {
        // Automatically seed default catalog into IndexedDB and localStorage
        setProducts(INITIAL_PRODUCTS);
        saveProductsReliably(INITIAL_PRODUCTS);
      }
    });
  }, []);

  // Currency State - Defaults to PKR (Rs.)
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('sba_currency');
    return saved && CURRENCIES[saved] ? CURRENCIES[saved] : CURRENCIES.PKR;
  });

  // Cart State with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sba_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State with localStorage persistence
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sba_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter State - Default maxPrice 200,000 covers all Pakistani designer suits and luxury sets
  const [filterState, setFilterState] = useState<FilterState>({
    category: 'All',
    subcategory: 'All',
    searchQuery: '',
    sortBy: 'featured',
    minPrice: 0,
    maxPrice: 200000,
    onlyInStock: false,
  });

  // Orders State with localStorage persistence (Starts completely clean with 0 dummy orders)
  const [placedOrders, setPlacedOrders] = useState<PlacedOrder[]>(() => {
    try {
      const saved = localStorage.getItem('sba_orders');
      if (saved) {
        const parsed: PlacedOrder[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out old sample/dummy orders for Sana Ahmed or Zainab Malik
          const realOrders = parsed.filter(
            (o) =>
              !['SBA-924182', 'SBA-815302'].includes(o.orderId) &&
              !['Sana Ahmed', 'Zainab Malik'].includes(o.customer?.fullName)
          );
          return realOrders;
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Clean local storage on mount to ensure dummy orders are permanently removed
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sba_orders');
      if (saved) {
        const parsed: PlacedOrder[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(
            (o) =>
              !['SBA-924182', 'SBA-815302'].includes(o.orderId) &&
              !['Sana Ahmed', 'Zainab Malik'].includes(o.customer?.fullName)
          );
          localStorage.setItem('sba_orders', JSON.stringify(cleaned));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Sync orders across windows/tabs instantly
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('sba_orders');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setPlacedOrders(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save placed orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sba_orders', JSON.stringify(placedOrders));
    } catch (e) {
      console.error(e);
    }
  }, [placedOrders]);

  // Store Settings & Banners State
  const [announcementText, setAnnouncementText] = useState<string>(() => {
    return localStorage.getItem('sba_announcement') || '🌸💖 100% Cash on Delivery Across Pakistan | Referral Discount Code: REF10 💖🌸';
  });

  const [deliveryFee, setDeliveryFee] = useState<number>(() => {
    const saved = localStorage.getItem('sba_delivery_fee');
    return saved ? parseFloat(saved) : 300;
  });

  const [promoCodes, setPromoCodes] = useState<Record<string, { discountPercent?: number; discountFixed?: number; description?: string }>>(() => {
    try {
      const saved = localStorage.getItem('sba_promos');
      return saved ? JSON.parse(saved) : {
        REF10: { discountPercent: 10, description: '10% Referral Discount' },
        AYESHA10: { discountPercent: 10, description: '10% Special Discount' },
      };
    } catch {
      return {
        REF10: { discountPercent: 10, description: '10% Referral Discount' },
        AYESHA10: { discountPercent: 10, description: '10% Special Discount' },
      };
    }
  });

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
  const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isCustomerAccountOpen, setIsCustomerAccountOpen] = useState(false);
  const [infoPage, setInfoPage] = useState<'about' | 'contact' | 'returns' | 'privacy' | 'terms' | null>(null);

  const handleOpenProductManager = () => {
    setIsAdminPanelOpen(true);
  };

  const handleCloseProductManager = () => {
    setIsAdminPanelOpen(false);
  };

  const [quickPhotoProduct, setQuickPhotoProduct] = useState<Product | null>(null);

  const [promoDetails, setPromoDetails] = useState<{ code: string; discountAmount: number }>({
    code: '',
    discountAmount: 0,
  });

  // Toast feedback state
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('sba_user', JSON.stringify(user));
    showNotification(`Khush Amdeed, ${user.fullName}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sba_user');
    showNotification('Logged out successfully');
  };

  // Sync products to IndexedDB & safe localStorage
  useEffect(() => {
    saveProductsReliably(products);
  }, [products]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sba_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sba_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Instant order event listener
  useEffect(() => {
    const handleInstantOrder = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.product) {
        setIsCheckoutOpen(true);
      }
    };
    window.addEventListener('sba-instant-order', handleInstantOrder);
    return () => {
      window.removeEventListener('sba-instant-order', handleInstantOrder);
    };
  }, []);

  const handleSelectCurrency = (code: CurrencyCode) => {
    const selected = CURRENCIES[code] || CURRENCIES.USD;
    setCurrency(selected);
    localStorage.setItem('sba_currency', code);
  };

  // Product Management Handlers (Owner Features)
  const handleAddProduct = (newProduct: Product) => {
    const normalized: Product = {
      ...newProduct,
      image: (newProduct.images && newProduct.images[0]) || (newProduct as any).image || '',
    };
    const updated = [normalized, ...products];
    setProducts(updated);
    saveProductsReliably(updated);

    // Reset filters so newly added product is guaranteed visible at the top!
    setFilterState({
      category: 'All',
      subcategory: 'All',
      searchQuery: '',
      sortBy: 'newest',
      minPrice: 0,
      maxPrice: 200000,
      onlyInStock: false,
      selectedColor: undefined,
    });

    // Scroll to collection smoothly
    setTimeout(() => {
      const el = document.getElementById('collection');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);

    showNotification(`🎉 مبارک ہو! سوٹ "${newProduct.name}" کامیابی سے اسٹور میں لگ گیا ہے!`);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    const normalized: Product = {
      ...updatedProduct,
      image: (updatedProduct.images && updatedProduct.images[0]) || (updatedProduct as any).image || '',
    };
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === normalized.id ? normalized : p));
      saveProductsReliably(updated);
      return updated;
    });
    if (selectedProduct && selectedProduct.id === normalized.id) {
      setSelectedProduct(normalized);
    }
    showNotification(`آرٹیکل "${normalized.name}" اپڈیٹ ہو گیا ہے!`);
  };

  const handleUpdateProductPhotos = (productId: string, newImages: string[]) => {
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            images: newImages,
            image: newImages[0] || '',
          };
        }
        return p;
      });
      saveProductsReliably(updated);
      return updated;
    });

    // Also update active modal if currently opened
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) => (prev ? { ...prev, images: newImages, image: newImages[0] || '' } : null));
    }

    showNotification('تصاویر کامیابی سے تبدیل ہو گئیں!');
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      saveProductsReliably(updated);
      return updated;
    });
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(null);
    }
    showNotification('پروڈکٹ اسٹور سے ڈیلیٹ کر دی گئی');
  };

  const handleResetCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    saveProductsReliably(INITIAL_PRODUCTS);
    showNotification('Catalog restored to default Dresses, Jewellery & Bags');
  };

  // Wishlist Handler
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showNotification(`Removed "${product.name}" from Wishlist`);
        return prev.filter((id) => id !== product.id);
      } else {
        showNotification(`Saved "${product.name}" to Wishlist`);
        return [...prev, product.id];
      }
    });
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, color?: string, size?: string, quantity: number = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [
          ...prev,
          {
            product,
            quantity,
            selectedColor: color || product.colors?.[0]?.name,
            selectedSize: size || product.sizes?.[0],
          },
        ];
      }
    });
    showNotification(`Added ${quantity}x "${product.name}" to Bag`);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(index);
      return;
    }
    setCartItems((prev) => {
      const next = [...prev];
      next[index].quantity = quantity;
      return next;
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    showNotification('Item removed from shopping bag');
  };

  const handleBuyNow = (product: Product, color?: string, size?: string, quantity: number = 1) => {
    handleAddToCart(product, color, size, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleOpenCheckout = (promo: { code: string; discountAmount: number }) => {
    setPromoDetails(promo);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: PlacedOrder) => {
    const updated = [order, ...placedOrders];
    setPlacedOrders(updated);
    try {
      localStorage.setItem('sba_orders', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showNotification(`🎉 آرڈر ${order.orderId} کامیابی سے ہو گیا ہے!`);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: PlacedOrder['status']) => {
    setPlacedOrders((prev) => {
      const updated = prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o));
      try {
        localStorage.setItem('sba_orders', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    showNotification(`آرڈر ${orderId} اسٹیٹس اپڈیٹ ہو کر "${newStatus}" ہو گیا ہے!`);
  };

  const handleUpdateAnnouncement = (text: string) => {
    setAnnouncementText(text);
    localStorage.setItem('sba_announcement', text);
    showNotification('بینر ٹیکسٹ اپڈیٹ ہو گیا!');
  };

  const handleUpdateDeliveryFee = (fee: number) => {
    setDeliveryFee(fee);
    localStorage.setItem('sba_delivery_fee', fee.toString());
    showNotification(`ڈلیوری چارجز Rs. ${fee} اپڈیٹ ہو گئے!`);
  };

  const handleAddPromoCode = (code: string, percent: number, description: string) => {
    setPromoCodes((prev) => {
      const updated = { ...prev, [code.toUpperCase()]: { discountPercent: percent, description } };
      try {
        localStorage.setItem('sba_promos', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    showNotification(`نیا پرو مو کوڈ ${code.toUpperCase()} فعال ہو گیا!`);
  };

  const handleSelectCategoryFilter = (category: string, subcategory: string = 'All') => {
    setFilterState((prev) => ({
      ...prev,
      category,
      subcategory: subcategory as any,
      searchQuery: '',
    }));
    const collectionElem = document.getElementById('collection');
    if (collectionElem) {
      collectionElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (category: string, subcategory: string = 'All') => {
    handleSelectCategoryFilter(category, subcategory);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isAdmin =
    Boolean(currentUser?.email?.toLowerCase().includes('mashu0734@gmail.com')) ||
    Boolean(currentUser?.email?.toLowerCase().includes('admin')) ||
    localStorage.getItem('sba_admin_auth') === 'true';

  return (
    <div className="min-h-screen bg-[#080509] text-white flex flex-col font-sans selection:bg-[#FF168F] selection:text-white">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#171017] border border-[#FF168F] shadow-[0_0_20px_rgba(255,22,143,0.5)] text-white px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#FF168F] shadow-[0_0_8px_#FF168F]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentCategory={filterState.category}
        onSelectCategory={handleCategorySelect}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        currency={currency}
        onSelectCurrency={handleSelectCurrency}
        onNavigateHome={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenAuth={() => setIsCustomerAccountOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        currentUser={currentUser}
        language={language}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Banner Section */}
        <Hero
          language={language}
          onExploreCollection={() => {
            const el = document.getElementById('collection');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onSelectCategory={handleCategorySelect}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        {/* Product Catalog Section */}
        <ProductGrid
          products={products}
          currency={currency}
          wishlist={wishlist}
          filterState={filterState}
          language={language}
          onSelectLanguage={handleSelectLanguage}
          onUpdateFilters={(updates) => setFilterState((prev) => ({ ...prev, ...updates }))}
          onResetFilters={() =>
            setFilterState({
              category: 'All',
              subcategory: 'All',
              searchQuery: '',
              sortBy: 'featured',
              minPrice: 0,
              maxPrice: 200000,
              onlyInStock: false,
              selectedColor: undefined,
            })
          }
          onResetCatalog={handleResetCatalog}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={(product, color, size) => handleAddToCart(product, color, size, 1)}
          onQuickView={(product) => setSelectedProduct(product)}
        />

        {/* VIP Circle Newsletter Section */}
        <VIPClubSection />
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={handleCategorySelect}
        onOpenLookbook={() => setIsLookbookOpen(true)}
        onOpenInfoPage={(p) => setInfoPage(p)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        isAdmin={true}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        currency={currency}
        language={language}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onOpenQuickPhotoChange={(product) => {
          setQuickPhotoProduct(product);
        }}
        onUpdateProduct={handleUpdateProduct}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={currency}
        language={language}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        products={products}
        currency={currency}
        onRemoveFromWishlist={(id) => setWishlist((prev) => prev.filter((pId) => pId !== id))}
        onMoveToCart={(product) => handleAddToCart(product)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        currency={currency}
        onSelectProduct={(product) => setSelectedProduct(product)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currency={currency}
        language={language}
        promoDetails={promoDetails}
        onOrderSuccess={handleOrderSuccess}
        onClearCart={() => setCartItems([])}
      />

      {/* Lookbook Modal */}
      <LookbookModal
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
        onShopCategory={handleCategorySelect}
      />

      {/* Private Owner Admin Panel Dashboard Modal */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        products={products}
        orders={placedOrders}
        language={language}
        announcementText={announcementText}
        deliveryFee={deliveryFee}
        promoCodes={promoCodes}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetCatalog={handleResetCatalog}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateAnnouncement={handleUpdateAnnouncement}
        onUpdateDeliveryFee={handleUpdateDeliveryFee}
        onAddPromoCode={handleAddPromoCode}
      />

      {/* Customer Account ("My Account") Modal */}
      <CustomerAccountModal
        isOpen={isCustomerAccountOpen || isAuthOpen}
        onClose={() => {
          setIsCustomerAccountOpen(false);
          setIsAuthOpen(false);
        }}
        currentUser={currentUser}
        orders={placedOrders}
        language={language}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        onAddPromoCode={handleAddPromoCode}
      />

      {/* Public Store Policy & Contact Info Pages Modal */}
      <InfoPagesModal
        page={infoPage}
        onClose={() => setInfoPage(null)}
        language={language}
      />

      {/* Quick 1-Click Photo Replacement Modal */}
      <QuickPhotoChangeModal
        product={quickPhotoProduct}
        isOpen={!!quickPhotoProduct}
        onClose={() => setQuickPhotoProduct(null)}
        onUpdateProductPhotos={handleUpdateProductPhotos}
      />

      {/* 3-Lines Side Navigation Drawer (Article & Subcategory Types) */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedCategory={filterState.category}
        selectedSubcategory={filterState.subcategory || 'All'}
        onSelectCategoryFilter={handleSelectCategoryFilter}
        currentUser={currentUser}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        onOpenAuth={() => setIsCustomerAccountOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        isAdmin={true}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Floating 1-Click WhatsApp Quick Order Button */}
      <WhatsAppButton language={language} />

    </div>
  );
}
