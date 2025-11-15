import { useEffect, useRef, useState } from 'react'
import { gameFlowManager } from '../systems/gameFlow'
import { useStoreStore } from '../store/useStoreStore'
import type { Item, ItemAction } from '../types/items'
import type { Store } from '../types/stores'
import './ItemContextMenu.css'

interface ItemContextMenuProps {
  item: Item
  slotIndex: number
  position: { x: number; y: number }
  currentStore: Store | null
  onAction: (action: ItemAction, item: Item, slotIndex: number, quantity?: number) => void
  onClose: () => void
}

/**
 * ItemContextMenu - Context menu for item actions (right-click)
 * Automatically adjusts position to stay within viewport
 */
function ItemContextMenu({ item, slotIndex, position, currentStore, onAction, onClose }: ItemContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [adjustedPosition, setAdjustedPosition] = useState(position)
  const storePrices = useStoreStore((state) => currentStore ? (state.storePrices[currentStore.id] || {}) : {})

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    // Add listeners after a short delay to avoid immediate closure
    const timeout = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }, 10)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  // Adjust position to keep menu on screen
  useEffect(() => {
    if (!menuRef.current) return

    const menu = menuRef.current
    const rect = menu.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const padding = 10

    let adjustedX = position.x
    let adjustedY = position.y

    // Adjust horizontal position
    if (adjustedX + rect.width > viewportWidth) {
      adjustedX = Math.max(padding, viewportWidth - rect.width - padding)
    }
    if (adjustedX < padding) {
      adjustedX = padding
    }

    // Adjust vertical position
    if (adjustedY + rect.height > viewportHeight) {
      adjustedY = Math.max(padding, viewportHeight - rect.height - padding)
    }
    if (adjustedY < padding) {
      adjustedY = padding
    }

    setAdjustedPosition({ x: adjustedX, y: adjustedY })
  }, [position])

  const handleActionClick = (action: ItemAction, quantity?: number) => {
    onAction(action, item, slotIndex, quantity)
    onClose()
  }

  return (
    <div
      ref={menuRef}
      className="item-context-menu"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
    >
      <div className="context-menu-header">
        <span className="item-name">{item.name}</span>
        {item.quantity && item.quantity > 1 && (
          <span className="item-quantity">x{item.quantity}</span>
        )}
      </div>
      <div className="context-menu-divider" />
      <div className="context-menu-actions">
        {item.availableActions
          .filter(action => {
            // Hide 'use' and 'drop' when in store
            if (currentStore && (action === 'use' || action === 'drop')) {
              return false
            }
            return true
          })
          .map((action) => (
            <button
              key={action}
              className="context-menu-action"
              onClick={() => handleActionClick(action)}
            >
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </button>
          ))}
        {currentStore && gameFlowManager.storeStocksItem(currentStore.id, item.id) && (
          <>
            <div className="context-menu-divider" />
            <div className="sell-options">
              <div className="sell-options-label">Sell:</div>
              {[1, 5, 10, 50].map((qty) => {
                const storePrice = gameFlowManager.getStoreItemPrice(currentStore.id, item.id, storePrices) || 0
                const sellPrice = Math.floor(storePrice / 2) * qty
                return (
                  <button
                    key={qty}
                    className="context-menu-action sell-action"
                    onClick={() => handleActionClick('sell', qty)}
                  >
                    Sell {qty} ({sellPrice} 🪙)
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ItemContextMenu

