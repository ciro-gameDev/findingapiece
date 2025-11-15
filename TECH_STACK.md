# Tech Stack Recommendation

## Core Framework: React + Vite

**Why React:**
- You already have experience with it
- Excellent for managing complex UI state (inventory, equipment, text display)
- Component-based architecture fits well with game UI elements
- Strong ecosystem for state management

**Why Vite:**
- Fast development server
- Excellent for bundling assets (images, etc.) for offline deployment
- Simple configuration
- Modern build tooling

## Game Engine Architecture

### Tick System
- **Custom Game Loop**: Use `requestAnimationFrame` or `setInterval` for tick-based combat
- **State Management**: React Context API or Zustand for global game state
- **Tick Manager**: Separate module to handle tick timing, cooldowns, and action queues

### State Management Options

**Option 1: Zustand (Recommended)**
- Lightweight, simple API
- Great for game state (inventory, skills, combat state)
- Easy to persist to localStorage for saves
- Minimal boilerplate

**Option 2: React Context + useReducer**
- Built into React
- More verbose but no external dependencies
- Good for MVP

**Recommendation: Zustand** - Better for complex game state, easier save/load implementation

## Asset Management

- **Images**: Import as static assets, bundled by Vite
- **Videos**: Can be included in public folder, loaded on demand
- **Portraits**: Component-based system that can swap images based on character state

## Save/Load System

- **localStorage**: Multiple save slots stored as JSON
- **Save Format**: Serialize game state (inventory, skills, location, story progress)
- **Versioning**: Include save version for future compatibility

## Styling

- **CSS Modules** or **Tailwind CSS**: For component styling
- **Grid Layout**: CSS Grid for inventory system
- **Responsive**: Ensure it works on different screen sizes

## Project Structure

```
findingapeace/
├── src/
│   ├── components/        # React UI components
│   ├── systems/          # Game systems (combat, skills, inventory)
│   ├── engine/            # Core game engine (tick system, game loop)
│   ├── data/              # Game data (items, locations, events)
│   ├── utils/             # Helper functions
│   ├── hooks/             # Custom React hooks
│   └── store/             # State management (Zustand stores)
├── public/
│   └── assets/            # Images, videos (if not imported)
└── dist/                  # Built output (for offline deployment)
```

## Key Libraries

- **React** (18+): UI framework
- **Vite**: Build tool
- **Zustand**: State management
- **date-fns** (optional): For timestamps in saves
- **No game engine needed**: Custom implementation for better control

## Deployment

- **Build**: `npm run build` creates optimized bundle in `dist/`
- **Offline**: All assets bundled, can be zipped and distributed
- **Hosting**: Can be deployed to any static hosting (GitHub Pages, Netlify, etc.)

## Development Workflow

1. Development: `npm run dev` - Hot reload development server
2. Build: `npm run build` - Production build
3. Preview: `npm run preview` - Test production build locally

