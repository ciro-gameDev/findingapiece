import { useEffect, useRef, useState } from 'react'
import { useStoreStore } from '../store/useStoreStore'
import type { Item } from '../types/items'
import type { StoreItem } from '../types/stores'
import './StoreTooltip.css'

interface StoreTooltipProps {
  item: Item
  storeItem: StoreItem
  storeId: string
  position: { x: number; y: number }
}

/**
 * StoreTooltip - Custom tooltip for store items
 * Shows item name and "Buy 1" as the left-click action
 */
function StoreTooltip({ item, storeItem, storeId, position }: StoreTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [adjustedPosition, setAdjustedPosition] = useState(position)
  const getStock = useStoreStore((state) => state.getStock)
  
  const currentStock = getStock(storeId, storeItem.itemId)
  const stock = currentStock !== undefined ? currentStock : storeItem.stock

  useEffect(() => {
    if (!tooltipRef.current) return

    const tooltip = tooltipRef.current
    const rect = tooltip.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    const offsetX = 10
    const offsetY = 10

    let adjustedX = position.x + offsetX
    let adjustedY = position.y + offsetY

    const expectedRight = adjustedX + rect.width
    const expectedBottom = adjustedY + rect.height

    if (expectedRight > viewportWidth) {
      adjustedX = position.x - rect.width - offsetX
      if (adjustedX < 0) adjustedX = 10
    }

    if (adjustedX < 0) {
      adjustedX = 10
    }

    if (expectedBottom > viewportHeight) {
      adjustedY = position.y - rect.height - offsetY
      if (adjustedY < 0) adjustedY = 10
    }

    if (adjustedY < 0) {
      adjustedY = 10
    }

    setAdjustedPosition({ x: adjustedX, y: adjustedY })
  }, [position])

  return (
    <div
      ref={tooltipRef}
      className="store-tooltip"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
    >
      <div className="tooltip-item-name">{item.name}</div>
      <div className="tooltip-item-action">Buy 1</div>
      <div className="tooltip-item-price">{storeItem.price} 🪙</div>
      {stock !== undefined && (
        <div className="tooltip-item-stock">{stock} in stock</div>
      )}
    </div>
  )
}

export default StoreTooltip

