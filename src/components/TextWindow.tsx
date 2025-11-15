import { useEffect } from 'react'
import { useKeybindStore } from '../store/useKeybindStore'
import type { ContinueBackConfig } from '../types/game'
import './TextWindow.css'

interface TextWindowProps {
  text: string
  onContinue: () => void
  onBack: () => void
  continueConfig: ContinueBackConfig | null
  backConfig: ContinueBackConfig | null
}

/**
 * TextWindow - Main text display component
 * Displays story text and event descriptions
 * Includes continue and back buttons with configurable keybinds
 * Button availability and actions are configured by the current event
 */
function TextWindow({ text, onContinue, onBack, continueConfig, backConfig }: TextWindowProps) {
  const continueKeybind = useKeybindStore((state) => state.continueKeybind)
  const backKeybind = useKeybindStore((state) => state.backKeybind)

  const hasContinue = continueConfig !== null && continueConfig !== undefined
  const hasBack = backConfig !== null && backConfig !== undefined

  const continueText = continueConfig?.text || 'Continue'
  const backText = backConfig?.text || 'Back'

  // Set up continue keybind (only when enabled)
  useEffect(() => {
    if (!hasContinue || !onContinue) return

    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if typing in an input field
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }

      // Check if the pressed key matches the continue keybind
      const key = event.key
      // Handle spacebar (can be ' ' or 'Spacebar')
      if (continueKeybind === ' ') {
        if (key === ' ' || key === 'Spacebar') {
          event.preventDefault()
          onContinue()
        }
      } else if (key === continueKeybind || key.toLowerCase() === continueKeybind.toLowerCase()) {
        event.preventDefault()
        onContinue()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [hasContinue, onContinue, continueKeybind])

  // Set up back keybind (only when enabled)
  useEffect(() => {
    if (!hasBack || !onBack) return

    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if typing in an input field
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }

      // Check if the pressed key matches the back keybind
      const key = event.key
      if (key === backKeybind || (backKeybind === 'Backspace' && key === 'Backspace')) {
        event.preventDefault()
        onBack()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [hasBack, onBack, backKeybind])

  // Format keybind for display
  const formatKeybind = (keybind: string): string => {
    if (keybind === ' ') return 'SPACE'
    if (keybind === 'Backspace') return 'BACKSPACE'
    return keybind.toUpperCase()
  }

  return (
    <div className="text-window">
      <div className="text-content">
        {text && (
          <div className="text-message">
            {text.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )}
      </div>
      <div className="continue-section">
        <button
          className={`continue-button ${!hasContinue ? 'disabled' : ''}`}
          onClick={() => hasContinue && onContinue && onContinue()}
          disabled={!hasContinue}
          title={hasContinue ? `Press ${formatKeybind(continueKeybind)} to ${continueText.toLowerCase()}` : "Continue not available"}
        >
          <span className="continue-keybind">{formatKeybind(continueKeybind)}</span>
          <span className="continue-text">{continueText}</span>
        </button>

        <button
          className={`back-button ${!hasBack ? 'disabled' : ''}`}
          onClick={() => hasBack && onBack && onBack()}
          disabled={!hasBack}
          title={hasBack ? `Press ${formatKeybind(backKeybind)} to ${backText.toLowerCase()}` : "Back not available"}
        >
          <span className="back-keybind">{formatKeybind(backKeybind)}</span>
          <span className="back-text">{backText}</span>
        </button>
      </div>
    </div>
  )
}

export default TextWindow

