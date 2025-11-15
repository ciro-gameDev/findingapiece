/**
 * Currency store - Manages player money/coins
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrencyState {
  coins: number;
  addCoins: (amount: number) => void;
  removeCoins: (amount: number) => boolean; // Returns true if successful, false if insufficient funds
  canAfford: (amount: number) => boolean;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      // Starting coins
      coins: 100,

      addCoins: (amount) => {
        set((state) => ({
          coins: state.coins + amount,
        }));
      },

      removeCoins: (amount) => {
        const state = get();
        if (state.coins >= amount) {
          set({ coins: state.coins - amount });
          return true;
        }
        return false;
      },

      canAfford: (amount) => {
        return get().coins >= amount;
      },
    }),
    {
      name: 'currency-storage',
    }
  )
);

