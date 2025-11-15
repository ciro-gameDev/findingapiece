/**
 * Game Flow Store - React state for game flow management
 */

import { create } from 'zustand';
import { gameFlowManager } from '../systems/gameFlow';
import type { GameEvent, Choice, ContinueBackConfig } from '../types/game';

interface GameFlowState {
  // Current event state
  currentEvent: GameEvent | undefined;
  currentText: string;
  currentImage: string | null;
  currentChoices: Choice[];
  continueConfig: ContinueBackConfig | null;
  backConfig: ContinueBackConfig | null;

  // Helper to check if there are choices (uses current state)
  hasChoices: () => boolean;

  // Actions
  handleChoice: (choice: Choice) => void;
  handleContinue: () => void;
  handleBack: () => void;
  navigateTo: (eventId: string) => void;
}

export const useGameFlowStore = create<GameFlowState>((set, get) => ({
  // Current event state
  currentEvent: gameFlowManager.getCurrentEvent(),
  currentText: gameFlowManager.getEventText(),
  currentImage: gameFlowManager.getEventImage(),
  currentChoices: gameFlowManager.getChoices(),
  continueConfig: gameFlowManager.getContinueConfig(),
  backConfig: gameFlowManager.getBackConfig(),

  // Helper to check if there are choices (uses current state)
  hasChoices: () => {
    const state = get();
    return state.currentChoices && state.currentChoices.length > 0;
  },

  // Actions
  handleChoice: (choice) => {
    const newEvent = gameFlowManager.handleChoice(choice);
    if (newEvent) {
      set({
        currentEvent: newEvent,
        currentText: gameFlowManager.getEventText(),
        currentImage: gameFlowManager.getEventImage(),
        currentChoices: gameFlowManager.getChoices(),
        continueConfig: gameFlowManager.getContinueConfig(),
        backConfig: gameFlowManager.getBackConfig(),
      });
    }
  },

  handleContinue: () => {
    const newEvent = gameFlowManager.handleContinue();
    if (newEvent) {
      set({
        currentEvent: newEvent,
        currentText: gameFlowManager.getEventText(),
        currentImage: gameFlowManager.getEventImage(),
        currentChoices: gameFlowManager.getChoices(),
        continueConfig: gameFlowManager.getContinueConfig(),
        backConfig: gameFlowManager.getBackConfig(),
      });
    }
  },

  handleBack: () => {
    const newEvent = gameFlowManager.handleBack();
    if (newEvent) {
      set({
        currentEvent: newEvent,
        currentText: gameFlowManager.getEventText(),
        currentImage: gameFlowManager.getEventImage(),
        currentChoices: gameFlowManager.getChoices(),
        continueConfig: gameFlowManager.getContinueConfig(),
        backConfig: gameFlowManager.getBackConfig(),
      });
    }
  },

  navigateTo: (eventId) => {
    const newEvent = gameFlowManager.navigateTo(eventId);
    if (newEvent) {
      set({
        currentEvent: newEvent,
        currentText: gameFlowManager.getEventText(),
        currentImage: gameFlowManager.getEventImage(),
        currentChoices: gameFlowManager.getChoices(),
        continueConfig: gameFlowManager.getContinueConfig(),
        backConfig: gameFlowManager.getBackConfig(),
      });
    }
  },
}));

