/**
 * Main game store - Core game state
 * 
 * Manages:
 * - Current location
 * - Game mode (exploration vs combat)
 * - General game state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type GameMode = 'exploration' | 'combat';

interface GameSettings {
  tickSpeed: number; // milliseconds per tick
}

interface GameState {
  currentLocation: string;
  gameMode: GameMode;
  inCombat: boolean;
  settings: GameSettings;
  setLocation: (location: string) => void;
  setGameMode: (mode: GameMode) => void;
  setInCombat: (inCombat: boolean) => void;
  setTickSpeed: (speed: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      // Current location
      currentLocation: 'town',
      
      // Game mode: 'exploration' | 'combat'
      gameMode: 'exploration',
      
      // In combat flag
      inCombat: false,
      
      // Game settings
      settings: {
        tickSpeed: 600, // milliseconds per tick
      },
      
      // Actions
      setLocation: (location) => set({ currentLocation: location }),
      setGameMode: (mode) => set({ gameMode: mode }),
      setInCombat: (inCombat) => set({ inCombat, gameMode: inCombat ? 'combat' : 'exploration' }),
      setTickSpeed: (speed) => set((state) => ({
        settings: { ...state.settings, tickSpeed: speed }
      })),
    }),
    {
      name: 'game-storage', // localStorage key
      partialize: (state) => ({
        // Only persist certain fields
        currentLocation: state.currentLocation,
        settings: state.settings,
      }),
    }
  )
);

