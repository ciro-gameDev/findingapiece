/**
 * Game Flow Manager - Handles event/scene transitions and game state
 */

import eventsData from '../data/events.json';
import type { GameEvent, Choice, ContinueBackConfig } from '../types/game';

class GameFlowManager {
  private events: Map<string, GameEvent>;
  private currentEventId: string;

  constructor() {
    this.events = new Map();
    this.currentEventId = 'town_start';
    
    // Load events into map for quick lookup
    (eventsData as { events: GameEvent[] }).events.forEach(event => {
      this.events.set(event.id, event);
    });
  }

  /**
   * Get current event
   */
  getCurrentEvent(): GameEvent | undefined {
    return this.events.get(this.currentEventId);
  }

  /**
   * Navigate to a new event/scene
   */
  navigateTo(eventId: string): GameEvent | null {
    if (this.events.has(eventId)) {
      this.currentEventId = eventId;
      return this.getCurrentEvent() || null;
    }
    console.warn(`Event ${eventId} not found`);
    return null;
  }

  /**
   * Handle a choice selection
   */
  handleChoice(choice: Choice | null): GameEvent | null {
    if (!choice || !choice.action) {
      return null;
    }

    switch (choice.action) {
      case 'navigate':
        if (choice.target) {
          return this.navigateTo(choice.target);
        }
        break;
      
      case 'skill_check':
        // TODO: Implement skill check logic
        if (choice.target) {
          return this.navigateTo(choice.target);
        }
        break;
      
      case 'open_inventory':
        // TODO: Open inventory UI
        return this.getCurrentEvent() || null;
      
      case 'combat':
        // TODO: Enter combat mode
        return this.getCurrentEvent() || null;
      
      default:
        console.warn(`Unknown action: ${choice.action}`);
        return this.getCurrentEvent() || null;
    }

    return this.getCurrentEvent() || null;
  }

  /**
   * Get formatted choices for ActionBar (always 6 slots)
   */
  getChoices(): Choice[] {
    const currentEvent = this.getCurrentEvent();
    if (!currentEvent || !currentEvent.choices) {
      return [];
    }
    return currentEvent.choices;
  }

  /**
   * Get current event text
   */
  getEventText(): string {
    const currentEvent = this.getCurrentEvent();
    if (!currentEvent) {
      return "Error: Event not found";
    }

    let text = currentEvent.title ? `${currentEvent.title}\n\n` : '';
    text += currentEvent.description || '';
    
    return text;
  }

  /**
   * Get current event image
   */
  getEventImage(): string | null {
    const currentEvent = this.getCurrentEvent();
    return currentEvent?.image || null;
  }

  /**
   * Get continue button configuration
   */
  getContinueConfig(): ContinueBackConfig | null {
    const currentEvent = this.getCurrentEvent();
    return currentEvent?.continue || null;
  }

  /**
   * Get back button configuration
   */
  getBackConfig(): ContinueBackConfig | null {
    const currentEvent = this.getCurrentEvent();
    return currentEvent?.back || null;
  }

  /**
   * Handle continue action
   */
  handleContinue(): GameEvent | null {
    const continueConfig = this.getContinueConfig();
    if (!continueConfig) {
      return this.getCurrentEvent() || null;
    }

    // Handle continue action based on type
    if (continueConfig.action === 'navigate' && continueConfig.target) {
      return this.navigateTo(continueConfig.target);
    }
    
    // Add more continue action types as needed
    return this.getCurrentEvent() || null;
  }

  /**
   * Handle back action
   */
  handleBack(): GameEvent | null {
    const backConfig = this.getBackConfig();
    if (!backConfig) {
      return this.getCurrentEvent() || null;
    }

    // Handle back action based on type
    if (backConfig.action === 'navigate' && backConfig.target) {
      return this.navigateTo(backConfig.target);
    }
    
    // Add more back action types as needed
    return this.getCurrentEvent() || null;
  }
}

// Singleton instance
export const gameFlowManager = new GameFlowManager();

