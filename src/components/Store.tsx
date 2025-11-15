import { useState, useEffect } from 'react'
import { useCurrencyStore } from '../store/useCurrencyStore'
import { useInventoryStore } from '../store/useInventoryStore'
import { useStoreStore } from '../store/useStoreStore'
import { useGameFlowStore } from '../store/useGameFlowStore'
import { gameFlowManager } from '../systems/gameFlow'
import type { Store, StoreItem } from '../types/stores'
import StoreContextMenu from './StoreContextMenu'
import StoreTooltip from './StoreTooltip'
import './Store.css'

interface StoreProps {
  store: Store | null
  backgroundImage: string | null
}

/**
 * Store - Displays store inventory in a grid format
 * Overlays the main image window with a translucent interface
 */
function Store({ store, backgroundImage }: StoreProps) {
  const coins = useCurrencyStore((state) => state.coins)
  const canAfford = useCurrencyStore((state) => state.canAfford)
  const removeCoins = useCurrencyStore((state) => state.removeCoins)
  const addItem = useInventoryStore((state) => state.addItem)
  const initializeStoreStock = useStoreStore((state) => state.initializeStoreStock)
  const getStock = useStoreStore((state) => state.getStock)
  const decreaseStock = useStoreStore((state) => state.decreaseStock)
  const examineItem = useGameFlowStore((state) => state.examineItem)

  const [contextMenu, setContextMenu] = useState<{
    item: ReturnType<typeof gameFlowManager.getItemById>
    storeItem: StoreItem
    position: { x: number; y: number }
  } | null>(null)

  const [tooltip, setTooltip] = useState<{
    item: ReturnType<typeof gameFlowManager.getItemById>
    storeItem: StoreItem
    position: { x: number; y: number }
  } | null>(null)

  // Initialize store stock when store changes
  useEffect(() => {
    if (store) {
      initializeStoreStock(store.id)
    }
  }, [store, initializeStoreStock])

  if (!store) return null

  const handleBuyItem = (storeItem: StoreItem, quantity: number = 1) => {
    const item = gameFlowManager.getItemById(storeItem.itemId)
    if (!item) {
      return
    }

    // Check how many the player can afford
    const maxAffordable = Math.floor(coins / storeItem.price)
    if (maxAffordable <= 0) {
      return
    }

    // Adjust quantity to what player can afford
    const adjustedQuantity = Math.min(quantity, maxAffordable)

    // Check stock
    const currentStock = getStock(store.id, storeItem.itemId)
    if (currentStock !== undefined && currentStock < adjustedQuantity) {
      // Adjust quantity to available stock
      const finalQuantity = Math.min(adjustedQuantity, currentStock)
      if (finalQuantity <= 0) {
        return
      }
      
      // Buy what's available
      const finalPrice = storeItem.price * finalQuantity
      if (decreaseStock(store.id, storeItem.itemId, finalQuantity)) {
        if (removeCoins(finalPrice)) {
          addItem(item, finalQuantity)
        }
      }
      return
    }

    // Decrease stock
    if (!decreaseStock(store.id, storeItem.itemId, adjustedQuantity)) {
      return
    }

    // Remove coins and add items
    const totalPrice = storeItem.price * adjustedQuantity
    if (removeCoins(totalPrice)) {
      // Add all items at once - addItem handles stacking
      addItem(item, adjustedQuantity)
    }
  }

  const handleContextMenuAction = (action: 'examine' | 'buy', quantity?: number) => {
    if (!contextMenu) return

    if (action === 'examine') {
      const item = contextMenu.item
      if (item) {
        examineItem(item.name, item.description, item.examineImage)
      }
    } else if (action === 'buy' && quantity) {
      handleBuyItem(contextMenu.storeItem, quantity)
    }
  }

  const handleSlotRightClick = (e: React.MouseEvent, storeItem: StoreItem) => {
    e.preventDefault()
    const item = gameFlowManager.getItemById(storeItem.itemId)
    if (!item) return

    setContextMenu({
      item,
      storeItem,
      position: { x: e.clientX, y: e.clientY },
    })
  }

  return (
    <div className="store-overlay">
      {backgroundImage && (
        <div 
          className="store-background" 
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className="store-interface">
        <div className="store-header">
          <h2 className="store-name">{store.name}</h2>
          <div className="store-coins">
            <span className="coin-icon">🪙</span>
            <span className="coin-amount">{coins}</span>
          </div>
        </div>
        <div className="store-grid">
          {(() => {
            const allItems = new Map<string, { itemId: string; price: number; stock?: number }>()
            const storeState = useStoreStore.getState()
            const storeStock = storeState.storeStock[store.id] || {}
            const storePrices = storeState.storePrices[store.id] || {}
            
            store.items.forEach(storeItem => {
              allItems.set(storeItem.itemId, { ...storeItem })
            })
            
            Object.keys(storeStock).forEach(itemId => {
              if (!allItems.has(itemId) && storePrices[itemId] !== undefined) {
                allItems.set(itemId, {
                  itemId,
                  price: storePrices[itemId],
                  stock: storeStock[itemId],
                })
              }
            })
            
            return Array.from(allItems.values()).map((storeItem, index) => {
              const item = gameFlowManager.getItemById(storeItem.itemId)
              if (!item) return null

              const currentStock = getStock(store.id, storeItem.itemId)
              const stock = currentStock !== undefined ? currentStock : storeItem.stock
              const affordable = canAfford(storeItem.price)
              const inStock = stock === undefined || stock > 0

              return (
                <div
                  key={`${storeItem.itemId}-${index}`}
                  className={`store-item-slot ${!affordable || !inStock ? 'disabled' : ''}`}
                  onClick={() => affordable && inStock && handleBuyItem(storeItem, 1)}
                  onContextMenu={(e) => handleSlotRightClick(e, storeItem)}
                  onMouseEnter={(e) => {
                    setTooltip({
                      item,
                      storeItem,
                      position: { x: e.clientX, y: e.clientY },
                    })
                  }}
                  onMouseMove={(e) => {
                    if (tooltip) {
                      setTooltip({
                        item,
                        storeItem,
                        position: { x: e.clientX, y: e.clientY },
                      })
                    }
                  }}
                  onMouseLeave={() => {
                    setTooltip(null)
                  }}
                >
                  {stock !== undefined && (
                    <div className="store-item-stock">{stock}</div>
                  )}
                  <div className="store-item-icon">{item.icon || '📦'}</div>
                  <div className="store-item-info">
                    <div className="store-item-price">{storeItem.price} 🪙</div>
                  </div>
                </div>
              )
            })
          })()}
        </div>
      </div>
      {contextMenu && contextMenu.item && (
        <StoreContextMenu
          item={contextMenu.item}
          storeItem={contextMenu.storeItem}
          position={contextMenu.position}
          onAction={handleContextMenuAction}
          onClose={() => setContextMenu(null)}
        />
      )}
      {tooltip && tooltip.item && (
        <StoreTooltip
          item={tooltip.item}
          storeItem={tooltip.storeItem}
          storeId={store.id}
          position={tooltip.position}
        />
      )}
    </div>
  )
}

export default Store

