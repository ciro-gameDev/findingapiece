import TextWindow from './components/TextWindow'
import ImageDisplay from './components/ImageDisplay'
import ActionBar from './components/ActionBar'
import Inventory from './components/Inventory'
import Store from './components/Store'
import { useGameFlowStore } from './store/useGameFlowStore'
import './App.css'

function App() {
  const {
    currentText,
    currentImage,
    currentChoices,
    continueConfig,
    backConfig,
    inventoryAccessible,
    isExamining,
    examineText,
    examineImage,
    currentStore,
    handleChoice,
    handleContinue,
    handleBack
  } = useGameFlowStore()

  // Use examine content if examining, otherwise use normal content
  const displayText = isExamining && examineText ? examineText : currentText
  // If examining, use examineImage if provided, otherwise keep current image
  const displayImage = isExamining 
    ? (examineImage || currentImage) 
    : currentImage

  // Check if we're in a store
  const isInStore = currentStore !== null

  return (
    <div className="app">
      <main className="app-main">
        <div className="game-container">
          {/* Left Sidebar */}
          <div className="sidebar sidebar-left">
            <div className="ui-panel character-portrait">
              <ImageDisplay 
                imageSrc="/assets/placeholder.svg" 
                alt="Character Portrait"
                className="portrait"
              />
            </div>
            <div className="ui-panel status-area">
              <div className="panel-label">Status Area (HP/MP/etc)</div>
            </div>
            <div className="ui-panel equipment-display">
              <div className="panel-label">Equipment Display</div>
            </div>
          </div>

          {/* Center Column */}
          <div className="center-column">
            <div className="center-top">
              <div className="ui-panel main-image">
                {isInStore ? (
                  <Store 
                    store={currentStore}
                    backgroundImage={displayImage}
                  />
                ) : (
                  <ImageDisplay 
                    imageSrc={displayImage || "/assets/placeholder.svg"} 
                    alt="Main Scene Image"
                    className="scene"
                  />
                )}
              </div>
            </div>
            <div className="center-bottom">
              <div className="ui-panel action-bar">
                <ActionBar 
                  choices={isInStore ? [] : currentChoices}
                  onChoiceSelect={handleChoice}
                />
              </div>
              <div className="ui-panel main-text">
                <TextWindow 
                  text={displayText}
                  onContinue={handleContinue}
                  onBack={handleBack}
                  continueConfig={continueConfig}
                  backConfig={backConfig}
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="sidebar sidebar-right">
            <div className="ui-panel world-map">
              <ImageDisplay 
                imageSrc="/assets/placeholder.svg" 
                alt="World Map / Enemy Portrait"
                className="map"
              />
            </div>
            <div className="ui-panel skills-display">
              <div className="panel-label">Compact Skills Display</div>
            </div>
            <div className="ui-panel inventory">
              <Inventory isAccessible={inventoryAccessible} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

