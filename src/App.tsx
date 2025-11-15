import TextWindow from './components/TextWindow'
import ImageDisplay from './components/ImageDisplay'
import ActionBar from './components/ActionBar'
import { useGameFlowStore } from './store/useGameFlowStore'
import './App.css'

function App() {
  const {
    currentText,
    currentImage,
    currentChoices,
    continueConfig,
    backConfig,
    handleChoice,
    handleContinue,
    handleBack
  } = useGameFlowStore()

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
                <ImageDisplay 
                  imageSrc={currentImage || "/assets/placeholder.svg"} 
                  alt="Main Scene Image"
                  className="scene"
                />
              </div>
            </div>
            <div className="center-bottom">
              <div className="ui-panel action-bar">
                <ActionBar 
                  choices={currentChoices}
                  onChoiceSelect={handleChoice}
                />
              </div>
              <div className="ui-panel main-text">
                <TextWindow 
                  text={currentText}
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
              <div className="panel-label">Inventory</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

