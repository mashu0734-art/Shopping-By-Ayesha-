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
import { WhatsAppButton } from './components/WhatsAppButton';
import { INITIAL_PRODUCTS, CURRENCIES } from './data/products';
import { Product, CartItem, Currency, CurrencyCode, FilterState, PlacedOrder, UserAccount, Language } from './types';

export default function App() {
  // Language State: 'ur' (Urdu) by default, or 'en' (English) with localStorage persistence
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('sba_lang');
    return (saved === 'en' || saved === 'ur') ? saved : 'ur';
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

  // Products with localStorage persistence so owner custom uploads & photos stay saved!
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      // Clear legacy sample products once for a clean fresh store
      if (!localStorage.getItem('sba_cleared_samples_v1')) {
        localStorage.setItem('sba_cleared_samples_v1', 'true');
        localStorage.removeItem('sba_products');
        localStorage.removeItem('sba_cart');
        localStorage.removeItem('sba_wishlist');
        return [];
      }
      const saved = localStorage.getItem('sba_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved products', e);
    }
    return [];
  });

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

  // Filter State
  const [filterState, setFilterState] = useState<FilterState>({
    category: 'All',
    subcategory: 'All',
    searchQuery: '',
    sortBy: 'featured',
    minPrice: 0,
    maxPrice: 2000,
    onlyInStock: false,
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
  const [quickPhotoProduct, setQuickPhotoProduct] = useState<Product | null>(null);

  const [promoDetails, setPromoDetails] = useState<{ code: string; discountAmount: number }>({
    code: '',
    discountAmount: 0,
  });

  // Toast feedback state
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
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

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sba_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
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
    setProducts((prev) => [newProduct, ...prev]);
    showNotification(`Added "${newProduct.name}" to ${newProduct.category}`);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    if (selectedProduct && selectedProduct.id === updatedProduct.id) {
      setSelectedProduct(updatedProduct);
    }
    showNotification(`Updated "${updatedProduct.name}"`);
  };

  const handleUpdateProductPhoto = (productId: string, newImageUrl: string, secondaryImageUrl?: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            image: newImageUrl,
            secondaryImage: secondaryImageUrl || p.secondaryImage,
          };
        }
        return p;
      })
    );

    // Also update active modal if currently opened
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) => (prev ? { ...prev, image: newImageUrl } : null));
    }

    showNotification('Product photo updated successfully!');
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(null);
    }
    showNotification('Product removed from catalog');
  };

  const handleResetCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem('sba_products');
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
    showNotification(`Order ${order.orderId} Confirmed! Check your email for tracking details.`);
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
        onOpenAuth={() => setIsAuthOpen(true)}
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
          onUpdateFilters={(updates) => setFilterState((prev) => ({ ...prev, ...updates }))}
          onResetFilters={() =>
            setFilterState({
              category: 'All',
              subcategory: 'All',
              searchQuery: '',
              sortBy: 'featured',
              minPrice: 0,
              maxPrice: 2000,
              onlyInStock: false,
            })
          }
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={(product, color, size) => handleAddToCart(product, color, size, 1)}
          onQuickView={(product) => setSelectedProduct(product)}
          onOpenQuickPhotoChange={(product) => setQuickPhotoProduct(product)}
          onOpenProductManager={() => setIsProductManagerOpen(true)}
        />

        {/* VIP Circle Newsletter Section */}
        <VIPClubSection />
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={handleCategorySelect}
        onOpenLookbook={() => setIsLookbookOpen(true)}
        onOpenProductManager={() => setIsProductManagerOpen(true)}
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

      {/* Owner Product Manager & Upload Modal */}
      <ProductManagerModal
        isOpen={isProductManagerOpen}
        onClose={() => setIsProductManagerOpen(false)}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetCatalog={handleResetCatalog}
        onOpenQuickPhotoChange={(p) => setQuickPhotoProduct(p)}
      />

      {/* Quick 1-Click Photo Replacement Modal */}
      <QuickPhotoChangeModal
        product={quickPhotoProduct}
        isOpen={!!quickPhotoProduct}
        onClose={() => setQuickPhotoProduct(null)}
        onUpdateProductPhoto={handleUpdateProductPhoto}
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
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProductManager={() => setIsProductManagerOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Sign Up / Login Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        language={language}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Floating 1-Click WhatsApp Quick Order Button */}
      <WhatsAppButton language={language} />

    </div>
  );
}
