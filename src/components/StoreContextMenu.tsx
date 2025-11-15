import { useEffect, useRef, useState } from 'react'
import type { Item } from '../types/items'
import type { StoreItem } from '../types/stores'
import './StoreContextMenu.css'

interface StoreContextMenuProps {
  item: Item
  storeItem: StoreItem
  position: { x: number; y: number }
  onAction: (action: 'examine' | 'buy', quantity?: number) => void
  onClose: () => void
}

/**
 * StoreContextMenu - Context menu for store item actions (right-click)
 * Shows examine and buy quantity options
 */
function StoreContextMenu({ item, storeItem, position, onAction, onClose }: StoreContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [adjustedPosition, setAdjustedPosition] = useState(position)

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

  const handleActionClick = (action: 'examine' | 'buy', quantity?: number) => {
    onAction(action, quantity)
    onClose()
  }

  const buyQuantities = [1, 5, 10, 50]

  return (
    <div
      ref={menuRef}
      className="store-context-menu"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
    >
      <div className="context-menu-header">
        <span className="item-name">{item.name}</span>
        <span className="item-price">{storeItem.price} 🪙</span>
      </div>
      <div className="context-menu-divider" />
      <div className="context-menu-actions">
        <button
          className="context-menu-action"
          onClick={() => handleActionClick('examine')}
        >
          Examine
        </button>
        <div className="context-menu-divider" />
        <div className="buy-options">
          <div className="buy-options-label">Buy:</div>
          {buyQuantities.map((qty) => (
            <button
              key={qty}
              className="context-menu-action buy-action"
              onClick={() => handleActionClick('buy', qty)}
            >
              Buy {qty}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StoreContextMenu

