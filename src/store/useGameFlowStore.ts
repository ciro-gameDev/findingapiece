/**
 * Game Flow Store - React state for game flow management
 */

import { create } from 'zustand';
import { gameFlowManager } from '../systems/gameFlow';
import { useInventoryStore } from './useInventoryStore';
import type { GameEvent, Choice, ContinueBackConfig } from '../types/game';
import type { Store } from '../types/stores';

interface GameFlowState {
  // Current event state
  currentEvent: GameEvent | undefined;
  currentText: string;
  currentImage: string | null;
  currentChoices: Choice[];
  continueConfig: ContinueBackConfig | null;
  backConfig: ContinueBackConfig | null;
  inventoryAccessible: boolean;

  // Examine state
  isExamining: boolean;
  examineText: string | null;
  examineImage: string | null;
  previousText: string | null;
  previousImage: string | null;

  // Store state
  currentStore: Store | null;

  // Actions
  handleChoice: (choice: Choice) => void;
  handleContinue: () => void;
  handleBack: () => void;
  navigateTo: (eventId: string) => void;
  examineItem: (itemName: string, itemDescription: string, itemImage?: string) => void;
  closeExamine: () => void;
}

export const useGameFlowStore = create<GameFlowState>((set, get) => {
  const currentEvent = gameFlowManager.getCurrentEvent();
  return {
  // Current event state
  currentEvent: currentEvent,
  currentText: gameFlowManager.getEventText(),
  currentImage: gameFlowManager.getEventImage(),
  currentChoices: gameFlowManager.getChoices(),
  continueConfig: gameFlowManager.getContinueConfig(),
  backConfig: gameFlowManager.getBackConfig(),
  inventoryAccessible: gameFlowManager.isInventoryAccessible(),

  // Examine state
  isExamining: false,
  examineText: null,
  examineImage: null,
  previousText: null,
  previousImage: null,

  // Store state
  currentStore: currentEvent ? gameFlowManager.getStoreByEventId(currentEvent.id) : null,

  // Actions
  handleChoice: (choice) => {
    if (choice.action === 'add_item' && choice.itemId) {
      const item = gameFlowManager.getItemById(choice.itemId);
      if (item) {
        const quantity = item.quantity || 1;
        useInventoryStore.getState().addItem(item, quantity);
      }
    }

    const newEvent = gameFlowManager.handleChoice(choice);
    if (newEvent) {
      const store = gameFlowManager.getStoreByEventId(newEvent.id);
      set({
        currentEvent: newEvent,
        currentText: gameFlowManager.getEventText(),
        currentImage: gameFlowManager.getEventImage(),
        currentChoices: gameFlowManager.getChoices(),
        continueConfig: gameFlowManager.getContinueConfig(),
        backConfig: gameFlowManager.getBackConfig(),
        inventoryAccessible: gameFlowManager.isInventoryAccessible(),
        currentStore: store,
      });
    }
  },

  handleContinue: () => {
    const state = get();
    // If examining, close examine instead of continuing
    if (state.isExamining) {
      state.closeExamine();
      return;
    }

    const newEvent = gameFlowManager.handleContinue();
    if (newEvent) {
      const store = gameFlowManager.getStoreByEventId(newEvent.id);
      set({
        currentEvent: newEvent,
        currentText: gameFlowManager.getEventText(),
        currentImage: gameFlowManager.getEventImage(),
        currentChoices: gameFlowManager.getChoices(),
        continueConfig: gameFlowManager.getContinueConfig(),
        backConfig: gameFlowManager.getBackConfig(),
        inventoryAccessible: gameFlowManager.isInventoryAccessible(),
        currentStore: store,
      });
    }
  },

  handleBack: () => {
    const newEvent = gameFlowManager.handleBack();
    if (newEvent) {
      const store = gameFlowManager.getStoreByEventId(newEvent.id);
      set({
        currentEvent: newEvent,
        currentText: gameFlowManager.getEventText(),
        currentImage: gameFlowManager.getEventImage(),
        currentChoices: gameFlowManager.getChoices(),
        continueConfig: gameFlowManager.getContinueConfig(),
        backConfig: gameFlowManager.getBackConfig(),
        inventoryAccessible: gameFlowManager.isInventoryAccessible(),
        currentStore: store,
      });
    }
  },

  navigateTo: (eventId) => {
    const newEvent = gameFlowManager.navigateTo(eventId);
    if (newEvent) {
      const store = gameFlowManager.getStoreByEventId(newEvent.id);
      set({
        currentEvent: newEvent,
        currentText: gameFlowManager.getEventText(),
        currentImage: gameFlowManager.getEventImage(),
        currentChoices: gameFlowManager.getChoices(),
        continueConfig: gameFlowManager.getContinueConfig(),
        backConfig: gameFlowManager.getBackConfig(),
        inventoryAccessible: gameFlowManager.isInventoryAccessible(),
        currentStore: store,
      });
    }
  },

  examineItem: (itemName, itemDescription, itemImage) => {
    const state = get();
    // Save current state
    set({
      isExamining: true,
      examineText: `${itemName}\n\n${itemDescription}`,
      examineImage: itemImage || null,
      previousText: state.currentText,
      previousImage: state.currentImage,
      // Clear choices and continue/back configs while examining
      currentChoices: [],
      continueConfig: {
        text: 'Close',
        action: 'custom',
        target: null,
      },
      backConfig: null,
    });
  },

  closeExamine: () => {
    const state = get();
    // Restore previous state
    set({
      isExamining: false,
      examineText: null,
      examineImage: null,
      currentText: state.previousText || gameFlowManager.getEventText(),
      currentImage: state.previousImage || gameFlowManager.getEventImage(),
      currentChoices: gameFlowManager.getChoices(),
      continueConfig: gameFlowManager.getContinueConfig(),
      backConfig: gameFlowManager.getBackConfig(),
      previousText: null,
      previousImage: null,
    });
  },
}});

