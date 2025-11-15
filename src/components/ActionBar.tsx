import { useEffect } from 'react'
import { useKeybindStore } from '../store/useKeybindStore'
import type { Choice } from '../types/game'
import './ActionBar.css'

interface ActionBarProps {
  choices?: Choice[]
  onChoiceSelect: (choice: Choice) => void
}

/**
 * ActionBar - Displays 6 action buttons in a 2x3 grid with keyboard bindings
 * Always shows 6 buttons, greying out unused slots
 */
function ActionBar({ choices = [], onChoiceSelect }: ActionBarProps) {
  const keybinds = useKeybindStore((state) => state.keybinds)

  // Set up keyboard event listeners
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if typing in an input field
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }

      const key = event.key.toLowerCase()
      const slotIndex = keybinds.indexOf(key)
      
      if (slotIndex !== -1 && slotIndex < choices.length && choices[slotIndex]) {
        event.preventDefault()
        onChoiceSelect && onChoiceSelect(choices[slotIndex])
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [keybinds, choices, onChoiceSelect])

  // Always show 6 buttons, pad with empty slots if needed
  const displayChoices = Array(6).fill(null).map((_, index) => 
    choices[index] || null
  )

  return (
    <div className="action-bar">
      <div className="action-buttons-grid">
        {displayChoices.map((choice, index) => {
          const keybind = keybinds[index] || ''
          const isDisabled = !choice
          
          return (
            <button
              key={index}
              className={`action-button ${isDisabled ? 'disabled' : ''}`}
              onClick={() => !isDisabled && onChoiceSelect && onChoiceSelect(choice)}
              disabled={isDisabled}
              title={isDisabled ? 'No action assigned' : `Press ${keybind.toUpperCase()} to activate`}
            >
              <span className="action-keybind">{keybind.toUpperCase()}</span>
              <span className="action-text">{choice?.text || '—'}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ActionBar

