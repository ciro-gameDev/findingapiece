/**
 * Inventory store - Manages player inventory and equipment
 * 
 * Manages:
 * - Inventory grid (M×N)
 * - Item storage
 * - Equipment slots
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INVENTORY_WIDTH = 8;
const INVENTORY_HEIGHT = 6;

export const useInventoryStore = create(
  persist(
    (set, get) => ({
      // Inventory grid (width × height)
      inventory: Array(INVENTORY_HEIGHT * INVENTORY_WIDTH).fill(null),
      
      // Equipment slots
      equipment: {
        weapon: null,
        armor: null,
        // Add more slots as needed
      },
      
      // Actions
      addItem: (item, quantity = 1) => {
        const state = get();
        // TODO: Implement item addition logic
        // - Check for stackable items
        // - Find empty slot or stack
        // - Handle quantity limits
        console.log('Add item:', item, quantity);
      },
      
      removeItem: (slotIndex, quantity = 1) => {
        const state = get();
        const newInventory = [...state.inventory];
        // TODO: Implement item removal logic
        set({ inventory: newInventory });
      },
      
      moveItem: (fromIndex, toIndex) => {
        const state = get();
        const newInventory = [...state.inventory];
        [newInventory[fromIndex], newInventory[toIndex]] = 
          [newInventory[toIndex], newInventory[fromIndex]];
        set({ inventory: newInventory });
      },
      
      equipItem: (item, slot) => {
        set((state) => ({
          equipment: { ...state.equipment, [slot]: item }
        }));
      },
      
      unequipItem: (slot) => {
        set((state) => ({
          equipment: { ...state.equipment, [slot]: null }
        }));
      },
    }),
    {
      name: 'inventory-storage',
    }
  )
);

