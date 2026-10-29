export type Language = 'ur' | 'en';

export type ProductCategory = 'Dresses' | 'Jewellery' | 'Bags';

export type ProductSubcategory =
  // Dresses
  | 'Winter'
  | 'Summer'
  | 'Fancy'
  // Jewellery
  | 'Jhumkey'
  | 'Earrings'
  | 'Necklace'
  | 'Ring'
  | 'Complete Set'
  | 'Bracelets'
  // Bags
  | 'Clutches'
  | 'Handbags'
  | 'Party Bags'
  // Generic
  | 'All';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  subcategory: ProductSubcategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  secondaryImage?: string;
  tag?: string;
  description: string;
  materials: string[];
  colors: { name: string; hex: string }[];
  sizes?: string[];
  inStock: boolean;
  featured?: boolean;
  isBestSeller?: boolean;
  sku: string;
  details: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type CurrencyCode = 'PKR' | 'USD' | 'AED' | 'GBP';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD or base
}

export interface FilterState {
  category: string;
  subcategory: string;
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  minPrice: number;
  maxPrice: number;
  onlyInStock: boolean;
}

export interface UserAccount {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  avatar?: string;
}

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface PlacedOrder {
  orderId: string;
  date: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: 'Confirmed' | 'Preparing Shipment' | 'Dispatched' | 'Delivered';
  currency: Currency;
}
