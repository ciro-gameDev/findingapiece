/**
 * Store state management - Tracks store stock and manages store data
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import storesData from '../data/stores.json';
import type { Store } from '../types/stores';

interface StoreState {
  // Store stock tracking: storeId -> itemId -> current stock
  storeStock: Record<string, Record<string, number>>;
  
  // Store prices for sold items: storeId -> itemId -> price
  storePrices: Record<string, Record<string, number>>;
  
  // Initialize stock from store data
  initializeStoreStock: (storeId: string) => void;
  
  // Get current stock for an item
  getStock: (storeId: string, itemId: string) => number | undefined;
  
  // Get price for an item in a store
  getPrice: (storeId: string, itemId: string) => number | undefined;
  
  // Decrease stock (returns true if successful, false if out of stock)
  decreaseStock: (storeId: string, itemId: string, quantity: number) => boolean;
  
  // Increase stock (for sold items)
  increaseStock: (storeId: string, itemId: string, quantity: number, price: number) => void;
  
  // Reset stock to initial values
  resetStoreStock: (storeId: string) => void;
}

export const useStoreStore = create<StoreState>()(
  persist(
    (set, get) => ({
      storeStock: {},
      storePrices: {},

      initializeStoreStock: (storeId) => {
        const state = get();
        // Only initialize if not already initialized
        if (state.storeStock[storeId]) {
          return;
        }

        const stores = (storesData as { stores: Store[] }).stores;
        const store = stores.find(s => s.id === storeId);
        if (!store) return;

        const stock: Record<string, number> = {};
        store.items.forEach(item => {
          if (item.stock !== undefined) {
            stock[item.itemId] = item.stock;
          }
        });

        set((state) => ({
          storeStock: {
            ...state.storeStock,
            [storeId]: stock,
          },
        }));
      },

      getStock: (storeId, itemId) => {
        const state = get();
        return state.storeStock[storeId]?.[itemId];
      },

      getPrice: (storeId, itemId) => {
        const state = get();
        return state.storePrices[storeId]?.[itemId];
      },

      decreaseStock: (storeId, itemId, quantity) => {
        const state = get();
        const currentStock = state.storeStock[storeId]?.[itemId];
        
        // If stock is undefined, it's unlimited
        if (currentStock === undefined) {
          return true;
        }

        // Check if enough stock
        if (currentStock < quantity) {
          return false;
        }

        // Decrease stock
        set((state) => ({
          storeStock: {
            ...state.storeStock,
            [storeId]: {
              ...state.storeStock[storeId],
              [itemId]: currentStock - quantity,
            },
          },
        }));

        return true;
      },

      increaseStock: (storeId, itemId, quantity, price) => {
        const state = get();
        const currentStock = state.storeStock[storeId]?.[itemId] || 0;
        
        set((state) => ({
          storeStock: {
            ...state.storeStock,
            [storeId]: {
              ...state.storeStock[storeId],
              [itemId]: currentStock + quantity,
            },
          },
          storePrices: {
            ...state.storePrices,
            [storeId]: {
              ...state.storePrices[storeId],
              [itemId]: price,
            },
          },
        }));
      },

      resetStoreStock: (storeId) => {
        const stores = (storesData as { stores: Store[] }).stores;
        const store = stores.find(s => s.id === storeId);
        if (!store) return;

        const stock: Record<string, number> = {};
        store.items.forEach(item => {
          if (item.stock !== undefined) {
            stock[item.itemId] = item.stock;
          }
        });

        set((state) => ({
          storeStock: {
            ...state.storeStock,
            [storeId]: stock,
          },
        }));
      },
    }),
    {
      name: 'store-storage',
    }
  )
);

