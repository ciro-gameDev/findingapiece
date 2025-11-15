import './App.css'

function App() {
  return (
    <div className="app">

      <main className="app-main">
        <div className="game-container">
          {/* Left Sidebar */}
          <div className="sidebar sidebar-left">
            <div className="ui-panel character-portrait">
              <div className="panel-label">Character Portrait</div>
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
                <div className="panel-label">Main Image Window</div>
              </div>
            </div>
            <div className="center-bottom">
              <div className="ui-panel action-bar">
                <div className="panel-label">Action Bar</div>
              </div>
              <div className="ui-panel main-text">
                <div className="panel-label">Main Text Display</div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="sidebar sidebar-right">
            <div className="ui-panel world-map">
              <div className="panel-label">World Map / Enemy Portrait</div>
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

