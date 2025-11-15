/**
 * Game Flow Manager - Handles event/scene transitions and game state
 */

import eventsData from '../data/events.json';
import itemsData from '../data/items.json';
import storesData from '../data/stores.json';
import type { GameEvent, Choice, ContinueBackConfig } from '../types/game';
import type { Item } from '../types/items';
import type { Store } from '../types/stores';

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
        if (choice.target) {
          return this.navigateTo(choice.target);
        }
        break;
      
      case 'open_inventory':
        return this.getCurrentEvent() || null;
      
      case 'add_item':
        if (choice.target) {
          return this.navigateTo(choice.target);
        }
        return this.getCurrentEvent() || null;
      
      case 'combat':
        return this.getCurrentEvent() || null;
      
      default:
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
   * Check if inventory is accessible
   * Default: accessible unless event type is 'dialogue' or inventoryAccessible is explicitly false
   */
  isInventoryAccessible(): boolean {
    const currentEvent = this.getCurrentEvent();
    if (!currentEvent) {
      return true; // Default to accessible
    }

    // If explicitly set, use that value
    if (currentEvent.inventoryAccessible !== undefined) {
      return currentEvent.inventoryAccessible;
    }

    // Default: disable for dialogue events
    if (currentEvent.type === 'dialogue') {
      return false;
    }

    // Default: accessible for other event types
    return true;
  }

  /**
   * Handle continue action
   */
  handleContinue(): GameEvent | null {
    const continueConfig = this.getContinueConfig();
    if (!continueConfig) {
      return this.getCurrentEvent() || null;
    }

    if (continueConfig.action === 'navigate' && continueConfig.target) {
      return this.navigateTo(continueConfig.target);
    }
    
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

    if (backConfig.action === 'navigate' && backConfig.target) {
      return this.navigateTo(backConfig.target);
    }
    
    return this.getCurrentEvent() || null;
  }

  /**
   * Get item by ID
   */
  getItemById(itemId: string): Item | null {
    const items = (itemsData as { items: Item[] }).items;
    return items.find(item => item.id === itemId) || null;
  }

  /**
   * Get store by event ID
   */
  getStoreByEventId(eventId: string): Store | null {
    const stores = (storesData as { stores: Store[] }).stores;
    return stores.find(store => store.id === eventId) || null;
  }

  /**
   * Check if current event is a store
   */
  isStore(): boolean {
    const currentEvent = this.getCurrentEvent();
    if (!currentEvent) return false;
    return this.getStoreByEventId(currentEvent.id) !== null;
  }

  /**
   * Get store item price by item ID
   * Returns null if store doesn't stock the item (unless it's a general store)
   * For general store, checks storePrices first, then uses default
   */
  getStoreItemPrice(storeId: string, itemId: string, storePrices?: Record<string, number>): number | null {
    const store = this.getStoreByEventId(storeId);
    if (!store) return null;
    
    // Check if store stocks the item
    const storeItem = store.items.find(item => item.itemId === itemId);
    if (storeItem) {
      return storeItem.price;
    }
    
    if (store.isGeneralStore) {
      if (storePrices && storePrices[itemId] !== undefined) {
        return storePrices[itemId];
      }
      return 10;
    }
    
    return null;
  }

  /**
   * Check if a store stocks an item or accepts it (general store)
   */
  storeStocksItem(storeId: string, itemId: string): boolean {
    const store = this.getStoreByEventId(storeId);
    if (!store) return false;
    
    // General store accepts any item
    if (store.isGeneralStore) {
      return true;
    }
    
    // Other stores only accept items they stock
    return store.items.some(item => item.itemId === itemId);
  }

  /**
   * Check if store is a general store
   */
  isGeneralStore(storeId: string): boolean {
    const store = this.getStoreByEventId(storeId);
    return store?.isGeneralStore === true;
  }
}

// Singleton instance
export const gameFlowManager = new GameFlowManager();

