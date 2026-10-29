import { Product, Currency } from '../types';

export const CURRENCIES: Record<string, Currency> = {
  PKR: { code: 'PKR', symbol: 'Rs. ', rate: 1.0 },
  USD: { code: 'USD', symbol: '$', rate: 0.0036 },
  AED: { code: 'AED', symbol: 'AED ', rate: 0.013 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0028 },
};

export const INITIAL_PRODUCTS: Product[] = [];

export const PRODUCTS = INITIAL_PRODUCTS;

export const PROMO_CODES: Record<string, { discountPercent?: number; discountFixed?: number; description: string }> = {
  AYESHA10: { discountPercent: 10, description: "10% VIP Discount" },
  AYESHA15: { discountPercent: 10, description: "10% VIP Discount" },
  GLAMOUR: { discountFixed: 500, description: "Rs. 500 Discount Voucher" },
};

export const BRAND_STORY = {
  title: 'Shopping By Ayesha',
  subtitle: 'The House of Glamour, Jewellery & Couture',
  description: 'Shopping By Ayesha was founded with a dedicated passion: offering stunning high-fashion attire, magnificent bridal and formal jewellery, and luxury designer bags with unmatched reliability and 100% Cash on Delivery nationwide.',
  pillars: [
    {
      title: 'Handcrafted Perfection',
      description: 'Every jhumka, bridal set, choker, and embroidered dress is curated with utmost care for lasting beauty.'
    },
    {
      title: '100% Cash on Delivery',
      description: 'Safe, honest shopping. You pay only when you receive your order at your doorstep with zero advance risk.'
    },
    {
      title: 'Direct WhatsApp Service',
      description: 'Personalized customer service and instant order confirmation directly over WhatsApp anytime.'
    }
  ],
  pressQuotes: [
    {
      quote: 'Shopping By Ayesha has revolutionized direct-to-consumer luxury festive fashion with seamless COD.',
      publication: 'Fashion Trends Asia'
    },
    {
      quote: 'Distinctive neon glamour aesthetic combined with regal South Asian bridal craftsmanship.',
      publication: 'Luxe Tribune'
    },
    {
      quote: 'Trusted by thousands for authentic jewellery pieces and breathtaking formal dresses.',
      publication: 'Style & Jewels Review'
    }
  ]
};
