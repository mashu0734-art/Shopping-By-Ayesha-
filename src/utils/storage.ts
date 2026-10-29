/**
 * Ultra-reliable client-side storage using native browser IndexedDB
 * with transparent localStorage fallback.
 * 
 * Solves the 5MB QuotaExceededError in mobile browsers when saving
 * high-resolution product photos and multiple gallery pictures.
 */

import { Product } from '../types';

const DB_NAME = 'SBA_Boutique_DB_v1';
const STORE_NAME = 'products';
const LOCAL_STORAGE_KEY = 'sba_products';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Loads all products from IndexedDB first; if empty or unsupported,
 * falls back to localStorage.
 */
export async function loadSavedProducts(): Promise<Product[] | null> {
  try {
    const db = await openDatabase();
    const items = await new Promise<Product[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    if (items && items.length > 0) {
      return items;
    }
  } catch (err) {
    console.warn('IndexedDB read failed, falling back to localStorage', err);
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('localStorage read error', err);
  }

  return null;
}

/**
 * Persists products to IndexedDB (virtually unlimited quota),
 * and safely updates localStorage with compressed/trimmed items
 * without throwing QuotaExceededError.
 */
export async function saveProductsReliably(products: Product[]): Promise<void> {
  // 1. Save to IndexedDB (primary, safe for multiple large photos)
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    for (const p of products) {
      store.put(p);
    }
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB write error', err);
  }

  // 2. Safe localStorage backup (catch QuotaExceeded gracefully)
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch (quotaErr) {
    // If photos are too large for localStorage's 5MB limit, store lightweight version
    try {
      const trimmed = products.map((p) => ({
        ...p,
        images: (p.images || []).slice(0, 2),
        image: (p.images && p.images[0]) || p.image || '',
      }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // IndexedDB already has the full data, safe to ignore
    }
  }
}
