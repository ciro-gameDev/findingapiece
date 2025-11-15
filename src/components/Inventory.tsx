import { useState } from 'react'
import { useInventoryStore } from '../store/useInventoryStore'
import { useGameFlowStore } from '../store/useGameFlowStore'
import { useCurrencyStore } from '../store/useCurrencyStore'
import { useStoreStore } from '../store/useStoreStore'
import { gameFlowManager } from '../systems/gameFlow'
import type { Item, ItemAction } from '../types/items'
import ItemContextMenu from './ItemContextMenu'
import ItemTooltip from './ItemTooltip'
import './Inventory.css'

interface InventoryProps {
  isAccessible: boolean
}

const INVENTORY_WIDTH = 4
const INVENTORY_HEIGHT = 5

/**
 * Inventory - Displays the player's inventory grid
 * Always visible, but can be disabled (greyed out) during certain events
 */
function Inventory({ isAccessible }: InventoryProps) {
  const inventory = useInventoryStore((state) => state.inventory)
  const moveItem = useInventoryStore((state) => state.moveItem)
  const useItem = useInventoryStore((state) => state.useItem)
  const dropItem = useInventoryStore((state) => state.dropItem)
  const equipItem = useInventoryStore((state) => state.equipItem)
  const examineItem = useGameFlowStore((state) => state.examineItem)
  const currentStore = useGameFlowStore((state) => state.currentStore)
  const addCoins = useCurrencyStore((state) => state.addCoins)
  const getPrice = useStoreStore((state) => state.getPrice)
  const increaseStock = useStoreStore((state) => state.increaseStock)

  const [contextMenu, setContextMenu] = useState<{
    item: Item
    slotIndex: number
    position: { x: number; y: number }
  } | null>(null)

  const [tooltip, setTooltip] = useState<{
    item: Item
    position: { x: number; y: number }
  } | null>(null)

  const handleSlotClick = (index: number) => {
    if (!isAccessible) return
    const item = inventory[index]
    if (!item) return

    // If in store and item can be sold, sell 1 instead of default action
    if (currentStore && gameFlowManager.storeStocksItem(currentStore.id, item.id)) {
      handleSellItem(item, index, 1)
      return
    }

    // Execute default action
    useItem(index)
  }

  const handleSlotRightClick = (e: React.MouseEvent, index: number) => {
    if (!isAccessible) {
      e.preventDefault()
      return
    }
    const item = inventory[index]
    if (!item) {
      e.preventDefault()
      return
    }

    e.preventDefault()
    setContextMenu({
      item,
      slotIndex: index,
      position: { x: e.clientX, y: e.clientY },
    })
  }

  const handleSellItem = (item: Item, _slotIndex: number, quantity: number) => {
    if (!currentStore) return

    let storePrice = getPrice(currentStore.id, item.id)
    
    if (storePrice === undefined) {
      const storePrices = useStoreStore.getState().storePrices[currentStore.id] || {}
      const priceFromStore = gameFlowManager.getStoreItemPrice(currentStore.id, item.id, storePrices)
      if (priceFromStore === null) {
        if (gameFlowManager.isGeneralStore(currentStore.id)) {
          storePrice = 10
        } else {
          return
        }
      } else {
        storePrice = priceFromStore
      }
    }

    const sellPrice = Math.floor(storePrice / 2)
    
    // Count total available items (across all stacks for stackable items)
    const totalAvailable = countTotalItems(item.id)
    
    // Calculate how many items to sell
    const itemsToSell = Math.min(quantity, totalAvailable)

    if (itemsToSell <= 0) return

    const totalSellPrice = sellPrice * itemsToSell
    
    // Add coins
    addCoins(totalSellPrice)
    
    // Remove items from inventory (handles both stackable and non-stackable)
    removeItemsFromInventory(item.id, itemsToSell)
    
    // Add to store stock
    increaseStock(currentStore.id, item.id, itemsToSell, storePrice)
  }

  const countTotalItems = (itemId: string): number => {
    let total = 0
    inventory.forEach(item => {
      if (item && item.id === itemId) {
        total += item.quantity || 1
      }
    })
    return total
  }

  const removeItemsFromInventory = (itemId: string, quantity: number) => {
    const newInventory = [...inventory]
    let remainingToRemove = quantity
    
    for (let i = 0; i < newInventory.length && remainingToRemove > 0; i++) {
      const item = newInventory[i]
      if (item && item.id === itemId) {
        if (item.maxStack && item.quantity) {
          // Stackable item: remove from this stack
          const quantityInStack = item.quantity
          const toRemoveFromStack = Math.min(remainingToRemove, quantityInStack)
          
          if (toRemoveFromStack >= quantityInStack) {
            // Remove entire stack
            newInventory[i] = null
            remainingToRemove -= quantityInStack
          } else {
            // Reduce quantity in stack
            newInventory[i] = {
              ...item,
              quantity: quantityInStack - toRemoveFromStack,
            }
            remainingToRemove -= toRemoveFromStack
          }
        } else {
          // Non-stackable: remove entire item
          newInventory[i] = null
          remainingToRemove -= 1
        }
      }
    }
    
    useInventoryStore.setState({ inventory: newInventory })
  }

  const handleContextMenuAction = (action: ItemAction, item: Item, slotIndex: number, quantity?: number) => {
    switch (action) {
      case 'use':
        useItem(slotIndex)
        break
      case 'examine':
        examineItem(item.name, item.description, item.examineImage)
        break
      case 'drop':
        dropItem(slotIndex)
        break
      case 'equip':
        if (item.type === 'weapon') {
          equipItem(item, 'weapon')
        } else if (item.type === 'armor') {
          equipItem(item, 'armor')
        }
        break
      case 'unequip':
        break
      case 'eat':
      case 'drink':
        useItem(slotIndex)
        break
      case 'sell':
        // Quantity is passed as a parameter
        handleSellItem(item, slotIndex, quantity || 1)
        break
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!isAccessible || !inventory[index]) {
      e.preventDefault()
      return
    }
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (!isAccessible) {
      e.preventDefault()
      return
    }
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    if (!isAccessible) {
      e.preventDefault()
      return
    }
    e.preventDefault()
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)
    if (!isNaN(sourceIndex) && sourceIndex !== targetIndex) {
      moveItem(sourceIndex, targetIndex)
    }
  }

  const coins = useCurrencyStore((state) => state.coins)

  return (
    <>
      <div className={`inventory-container ${!isAccessible ? 'disabled' : ''}`}>
        <div className="inventory-overlay" aria-hidden={isAccessible} />
        <div className="inventory-grid">
          {Array.from({ length: INVENTORY_HEIGHT * INVENTORY_WIDTH }, (_, index) => {
            const item = inventory[index]
            return (
              <div
                key={index}
                className={`inventory-slot ${item ? 'filled' : 'empty'}`}
                onClick={() => handleSlotClick(index)}
                onContextMenu={(e) => handleSlotRightClick(e, index)}
                onMouseEnter={(e) => {
                  if (item && isAccessible) {
                    setTooltip({
                      item,
                      position: { x: e.clientX, y: e.clientY },
                    })
                  }
                }}
                onMouseMove={(e) => {
                  if (item && isAccessible && tooltip) {
                    setTooltip({
                      item,
                      position: { x: e.clientX, y: e.clientY },
                    })
                  }
                }}
                onMouseLeave={() => {
                  setTooltip(null)
                }}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                draggable={isAccessible && !!item}
              >
                {item ? (
                  <div className="inventory-item">
                    <div className="item-icon">{item.icon || '📦'}</div>
                    {item.quantity && item.quantity > 1 && (
                      <div className="item-quantity-badge">{item.quantity}</div>
                    )}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
        <div className="coin-pouch">
          <span className="coin-icon">🪙</span>
          <span className="coin-amount">{coins}</span>
        </div>
      </div>
      {contextMenu && (
        <ItemContextMenu
          item={contextMenu.item}
          slotIndex={contextMenu.slotIndex}
          position={contextMenu.position}
          currentStore={currentStore}
          onAction={(action, item, slotIndex, quantity) => handleContextMenuAction(action, item, slotIndex, quantity)}
          onClose={() => setContextMenu(null)}
        />
      )}
      {tooltip && (
        <ItemTooltip
          item={tooltip.item}
          position={tooltip.position}
          currentStore={currentStore}
        />
      )}
    </>
  )
}

export default Inventory

