# Finding a Peace - HTML-Based RPG

A text-based choose-your-own-adventure RPG with combat, skills, and inventory systems.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **Vanilla JavaScript** - Game engine (no external game framework)

## Project Structure

```
src/
├── components/        # React UI components
│   ├── TextWindow.jsx
│   ├── ImageDisplay.jsx
│   ├── InventoryGrid.jsx
│   ├── CombatInterface.jsx
│   └── ...
├── systems/          # Game systems
│   ├── combat/       # Combat system
│   ├── skills/       # Skill system
│   ├── inventory/    # Inventory system
│   ├── world/        # World/location system
│   ├── character/    # Character system
│   └── save/         # Save/load system
├── engine/           # Core game engine
│   ├── TickManager.js
│   ├── GameLoop.js
│   └── EventSystem.js
├── data/             # Game data (JSON files)
│   ├── items.json
│   ├── locations.json
│   ├── events.json
│   └── ...
├── store/            # Zustand stores
│   ├── useGameStore.js
│   ├── useInventoryStore.js
│   └── ...
├── hooks/            # Custom React hooks
├── utils/            # Helper functions
└── App.jsx           # Main app component
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts the development server with hot reload.

### Build

```bash
npm run build
```

Creates an optimized production build in the `dist/` folder. This can be zipped and distributed for offline use.

### Preview Production Build

```bash
npm run preview
```

Test the production build locally.

## Development Phases

### Phase 1: Foundation (Current)
- ✅ Project setup
- ⏳ Basic UI components (TextWindow, ImageDisplay)
- ⏳ Simple location navigation
- ⏳ Basic inventory grid (visual only)

### Phase 2: Core Systems
- Tick-based combat system
- Basic skill system (1-2 skills)
- Inventory interactions
- Save/load system

### Phase 3: Content
- Multiple locations
- Combat encounters
- Item system
- Basic storyline

## Key Features

- **Tick-Based Combat**: Runescape-style combat with configurable tick speed
- **Skill System**: Multiple skills with XP, levels, and unlocks
- **Grid Inventory**: M×N grid with stackable items and context menus
- **Open World**: Arrow-based navigation between locations
- **Save System**: Multiple save slots with local storage
- **Offline Capable**: All assets bundled for offline play

## Documentation

- [Tech Stack Details](./TECH_STACK.md)
- [System Architecture](./SYSTEM_ARCHITECTURE.md)

