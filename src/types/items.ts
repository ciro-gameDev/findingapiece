/**
 * Item type definitions
 */

export type ItemType = 'consumable' | 'weapon' | 'armor' | 'material' | 'misc'

export type ItemAction = 'use' | 'examine' | 'drop' | 'equip' | 'unequip' | 'eat' | 'drink' | 'sell'

export interface Item {
  id: string
  name: string
  description: string
  type: ItemType
  icon: string // Icon to display (emoji or image path)
  image?: string
  examineImage?: string // Optional image to display when examining the item
  quantity?: number
  maxStack?: number
  defaultAction: ItemAction
  availableActions: ItemAction[]
}

