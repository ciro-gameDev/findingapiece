/**
 * Type definitions for game data structures
 */

export type EventType = 'location' | 'event' | 'combat' | 'dialogue'

export type ActionType = 'navigate' | 'skill_check' | 'open_inventory' | 'combat' | 'custom'

export interface Choice {
  id: string
  text: string
  action: ActionType
  target: string | null
}

export interface ContinueBackConfig {
  text: string
  action: ActionType
  target: string | null
}

export interface GameEvent {
  id: string
  type: EventType
  title: string
  description: string
  image: string
  choices: Choice[]
  continue: ContinueBackConfig | null
  back: ContinueBackConfig | null
}

export interface EventsData {
  events: GameEvent[]
}

