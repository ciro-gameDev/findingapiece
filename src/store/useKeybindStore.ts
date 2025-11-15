/**
 * Keybind store - Manages keyboard shortcuts for action buttons
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_KEYBINDS = ['q', 'w', 'e', 'a', 's', 'd'];
const DEFAULT_CONTINUE_KEYBIND = ' ';
const DEFAULT_BACK_KEYBIND = 'Backspace';

interface KeybindState {
  keybinds: string[];
  continueKeybind: string;
  backKeybind: string;
  setKeybind: (slotIndex: number, key: string) => void;
  setKeybinds: (newKeybinds: string[]) => void;
  setContinueKeybind: (key: string) => void;
  setBackKeybind: (key: string) => void;
  resetKeybinds: () => void;
}

export const useKeybindStore = create<KeybindState>()(
  persist(
    (set) => ({
      // Keybinds for the 6 action slots (in order: q, w, e, a, s, d)
      keybinds: DEFAULT_KEYBINDS,
      
      // Continue and back button keybinds
      continueKeybind: DEFAULT_CONTINUE_KEYBIND,
      backKeybind: DEFAULT_BACK_KEYBIND,
      
      // Actions
      setKeybind: (slotIndex, key) => {
        set((state) => {
          const newKeybinds = [...state.keybinds];
          newKeybinds[slotIndex] = key.toLowerCase();
          return { keybinds: newKeybinds };
        });
      },
      
      setKeybinds: (newKeybinds) => {
        set({ keybinds: newKeybinds.map(k => k.toLowerCase()) });
      },
      
      setContinueKeybind: (key) => {
        set({ continueKeybind: key });
      },
      
      setBackKeybind: (key) => {
        set({ backKeybind: key });
      },
      
      resetKeybinds: () => {
        set({ 
          keybinds: DEFAULT_KEYBINDS,
          continueKeybind: DEFAULT_CONTINUE_KEYBIND,
          backKeybind: DEFAULT_BACK_KEYBIND,
        });
      },
    }),
    {
      name: 'keybind-storage',
    }
  )
);

