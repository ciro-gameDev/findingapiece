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
import type { Item } from '../types/items';
import itemsData from '../data/items.json';

const INVENTORY_WIDTH = 4;
const INVENTORY_HEIGHT = 5;

interface Equipment {
  weapon: Item | null;
  armor: Item | null;
  // Add more slots as needed
}

interface InventoryState {
  inventory: (Item | null)[];
  equipment: Equipment;
  addItem: (item: Item, quantity?: number) => void;
  removeItem: (slotIndex: number, quantity?: number) => void;
  moveItem: (fromIndex: number, toIndex: number) => void;
  equipItem: (item: Item, slot: keyof Equipment) => void;
  unequipItem: (slot: keyof Equipment) => void;
  useItem: (slotIndex: number) => void;
  dropItem: (slotIndex: number) => void;
}

const createInitialInventory = (): (Item | null)[] => {
  const items: Item[] = (itemsData as { items: Item[] }).items.map(item => ({
    ...item,
    quantity: item.quantity || undefined,
  }))

  const inventory: (Item | null)[] = Array(INVENTORY_HEIGHT * INVENTORY_WIDTH).fill(null)
  items.forEach((item, index) => {
    if (index < inventory.length) {
      inventory[index] = item
    }
  })
  return inventory
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      inventory: createInitialInventory(),
      
      // Equipment slots
      equipment: {
        weapon: null,
        armor: null,
        // Add more slots as needed
      },
      
      // Actions
      addItem: (item, quantity = 1) => {
        const state = get();
        const newInventory = [...state.inventory];
        
        // If item is stackable, try to add to existing stacks first
        if (item.maxStack) {
          for (let i = 0; i < newInventory.length; i++) {
            const existingItem = newInventory[i];
            if (existingItem && existingItem.id === item.id) {
              // Found existing stack
              const currentQuantity = existingItem.quantity || 1;
              const spaceAvailable = item.maxStack - currentQuantity;
              
              if (spaceAvailable > 0) {
                // Can add to this stack
                const quantityToAdd = Math.min(quantity, spaceAvailable);
                newInventory[i] = {
                  ...existingItem,
                  quantity: currentQuantity + quantityToAdd,
                };
                
                const remaining = quantity - quantityToAdd;
                if (remaining > 0) {
                  // Still have items to add, continue with remaining quantity
                  set({ inventory: newInventory });
                  // Recursively add remaining items
                  state.addItem(item, remaining);
                  return;
                } else {
                  // All items added to this stack
                  set({ inventory: newInventory });
                  return;
                }
              }
            }
          }
        }
        
        // No existing stack found or item not stackable, find empty slot
        for (let i = 0; i < newInventory.length; i++) {
          if (newInventory[i] === null) {
            // Create a copy of the item
            const itemToAdd = { ...item };
            // Set quantity if stackable or if quantity > 1
            if (item.maxStack) {
              itemToAdd.quantity = Math.min(quantity, item.maxStack);
              const remaining = quantity - itemToAdd.quantity;
              if (remaining > 0) {
                // Add this stack, then recursively add remaining
                newInventory[i] = itemToAdd;
                set({ inventory: newInventory });
                state.addItem(item, remaining);
                return;
              }
            } else {
              // Non-stackable: add one at a time
              newInventory[i] = itemToAdd;
              const remaining = quantity - 1;
              if (remaining > 0) {
                set({ inventory: newInventory });
                state.addItem(item, remaining);
                return;
              }
            }
            newInventory[i] = itemToAdd;
            set({ inventory: newInventory });
            return;
          }
        }
      },
      
      removeItem: (slotIndex, _quantity = 1) => {
        const state = get();
        const newInventory = [...state.inventory];
        newInventory[slotIndex] = null;
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

      useItem: (slotIndex) => {
        const state = get();
        const item = state.inventory[slotIndex];
        if (!item) return;

        // Execute default action
        const action = item.defaultAction;
        
        switch (action) {
          case 'use':
            break;
          case 'eat':
          case 'drink':
            // Decrease quantity or remove if quantity is 1
            if (item.quantity && item.quantity > 1) {
              const newInventory = [...state.inventory];
              newInventory[slotIndex] = { ...item, quantity: item.quantity - 1 };
              set({ inventory: newInventory });
            } else {
              state.removeItem(slotIndex);
            }
            break;
          case 'equip':
            if (item.type === 'weapon') {
              state.equipItem(item, 'weapon');
            } else if (item.type === 'armor') {
              state.equipItem(item, 'armor');
            }
            break;
        }
      },

      dropItem: (slotIndex) => {
        const state = get();
        const item = state.inventory[slotIndex];
        if (!item) return;

        state.removeItem(slotIndex);
      },
    }),
    {
      name: 'inventory-storage',
      partialize: (state) => ({
        inventory: state.inventory,
        equipment: state.equipment,
      }),
      // Merge persisted state with initial state
      merge: (persistedState: any, currentState: InventoryState) => {
        // If persisted state has inventory, use it; otherwise use initial
        if (persistedState && persistedState.inventory) {
          return {
            ...currentState,
            inventory: persistedState.inventory,
            equipment: persistedState.equipment || currentState.equipment,
          };
        }
        return currentState;
      },
    }
  )
);

