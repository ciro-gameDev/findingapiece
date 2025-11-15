import { useEffect, useRef, useState } from 'react'
import { gameFlowManager } from '../systems/gameFlow'
import { useStoreStore } from '../store/useStoreStore'
import type { Item, ItemAction } from '../types/items'
import type { Store } from '../types/stores'
import './ItemTooltip.css'

interface ItemTooltipProps {
  item: Item
  position: { x: number; y: number }
  currentStore?: Store | null
}

/**
 * ItemTooltip - Custom tooltip that appears on mouseover
 * Automatically adjusts position to stay within viewport
 */
function ItemTooltip({ item, position, currentStore }: ItemTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [adjustedPosition, setAdjustedPosition] = useState(position)
  const storePrices = useStoreStore((state) => currentStore ? (state.storePrices[currentStore.id] || {}) : {})

  const formatActionName = (action: ItemAction): string => {
    const actionNames: Record<ItemAction, string> = {
      use: 'Use',
      examine: 'Examine',
      drop: 'Drop',
      equip: 'Equip',
      unequip: 'Unequip',
      eat: 'Eat',
      drink: 'Drink',
      sell: 'Sell',
    }
    return actionNames[action] || action
  }

  // Check if item can be sold and get price
  const canSell = currentStore && gameFlowManager.storeStocksItem(currentStore.id, item.id)
  const storePrice = canSell 
    ? (gameFlowManager.getStoreItemPrice(currentStore.id, item.id, storePrices) || 0)
    : null
  const sellPrice = storePrice ? Math.floor(storePrice / 2) : null

  useEffect(() => {
    if (!tooltipRef.current) return

    const tooltip = tooltipRef.current
    const rect = tooltip.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Default offset (10px right, 10px down from cursor)
    const offsetX = 10
    const offsetY = 10

    let adjustedX = position.x + offsetX
    let adjustedY = position.y + offsetY

    // Calculate expected right and bottom edges
    const expectedRight = adjustedX + rect.width
    const expectedBottom = adjustedY + rect.height

    // Check right edge overflow
    if (expectedRight > viewportWidth) {
      // Flip to left side of cursor
      adjustedX = position.x - rect.width - offsetX
      // Ensure it doesn't go off left edge
      if (adjustedX < 0) {
        adjustedX = 10
      }
    }

    // Check left edge overflow (after potential adjustment)
    if (adjustedX < 0) {
      adjustedX = 10
    }

    // Recalculate bottom with potentially adjusted X
    const finalRight = adjustedX + rect.width
    if (finalRight > viewportWidth) {
      adjustedX = viewportWidth - rect.width - 10
      if (adjustedX < 0) adjustedX = 10
    }

    // Check bottom edge overflow
    if (expectedBottom > viewportHeight) {
      // Flip to top side of cursor
      adjustedY = position.y - rect.height - offsetY
      // Ensure it doesn't go off top edge
      if (adjustedY < 0) {
        adjustedY = 10
      }
    }

    // Check top edge overflow (after potential adjustment)
    if (adjustedY < 0) {
      adjustedY = 10
    }

    // Recalculate bottom with potentially adjusted Y
    const finalBottom = adjustedY + rect.height
    if (finalBottom > viewportHeight) {
      adjustedY = viewportHeight - rect.height - 10
      if (adjustedY < 0) adjustedY = 10
    }

    setAdjustedPosition({ x: adjustedX, y: adjustedY })
  }, [position])

  return (
    <div
      ref={tooltipRef}
      className="item-tooltip"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
    >
      <div className="tooltip-item-name">{item.name}</div>
      {canSell && sellPrice !== null ? (
        <>
          <div className="tooltip-item-action">Sell 1</div>
          <div className="tooltip-item-price">{sellPrice} 🪙</div>
        </>
      ) : (
        <div className="tooltip-item-action">
          {formatActionName(item.defaultAction)}
        </div>
      )}
      {item.quantity && item.quantity > 1 && (
        <div className="tooltip-item-quantity">Quantity: {item.quantity}</div>
      )}
    </div>
  )
}

export default ItemTooltip

