/**
 * TickManager - Handles tick-based timing system for combat
 * 
 * The tick system allows for quasi-turn-based combat where actions
 * occur on specific ticks, with configurable tick speed for difficulty.
 */

class TickManager {
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
  start() {
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
  stop() {
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
  reset() {
    this.currentTick = 0;
  }

  /**
   * Set tick speed (difficulty setting)
   * @param {number} speed - Milliseconds per tick (lower = faster/harder)
   */
  setTickSpeed(speed) {
    this.tickSpeed = speed;
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  /**
   * Get current tick
   * @returns {number} Current tick number
   */
  getCurrentTick() {
    return this.currentTick;
  }

  /**
   * Subscribe to tick events
   * @param {Function} callback - Function to call on each tick
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners of a new tick
   */
  notifyListeners() {
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

