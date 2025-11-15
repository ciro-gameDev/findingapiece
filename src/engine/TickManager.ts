/**
 * TickManager - Handles tick-based timing system for combat
 * 
 * The tick system allows for quasi-turn-based combat where actions
 * occur on specific ticks, with configurable tick speed for difficulty.
 */

type TickCallback = (tick: number) => void;

class TickManager {
  private currentTick: number;
  private tickSpeed: number;
  private isRunning: boolean;
  private tickInterval: NodeJS.Timeout | null;
  private listeners: Set<TickCallback>;

  constructor() {
    this.currentTick = 0;
    this.tickSpeed = 600; // milliseconds per tick (default: medium speed)
    this.isRunning = false;
    this.tickInterval = null;
    this.listeners = new Set();
  }

  /**
   * Start the tick system
   */
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.tickInterval = setInterval(() => {
      this.currentTick++;
      this.notifyListeners();
    }, this.tickSpeed);
  }

  /**
   * Stop the tick system
   */
  stop(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  /**
   * Reset the tick counter
   */
  reset(): void {
    this.currentTick = 0;
  }

  /**
   * Set tick speed (difficulty setting)
   * @param speed - Milliseconds per tick (lower = faster/harder)
   */
  setTickSpeed(speed: number): void {
    this.tickSpeed = speed;
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  /**
   * Get current tick
   * @returns Current tick number
   */
  getCurrentTick(): number {
    return this.currentTick;
  }

  /**
   * Subscribe to tick events
   * @param callback - Function to call on each tick
   * @returns Unsubscribe function
   */
  subscribe(callback: TickCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners of a new tick
   */
  private notifyListeners(): void {
    // Create a copy of the listeners set to avoid issues if listeners
    // unsubscribe themselves during iteration
    const listenersCopy = Array.from(this.listeners);
    listenersCopy.forEach(callback => {
      try {
        callback(this.currentTick);
      } catch (error) {
        console.error('Error in tick listener:', error);
      }
    });
  }
}

// Singleton instance
export const tickManager = new TickManager();

