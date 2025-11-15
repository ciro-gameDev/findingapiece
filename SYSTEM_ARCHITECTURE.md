# High-Level System Architecture

## Core Systems

### 1. Game Engine (`engine/`)
- **TickManager**: Handles tick-based timing system
  - Configurable tick speed (difficulty setting)
  - Tick counter and timing
  - Action queue management
- **GameLoop**: Main game loop for combat
  - Processes actions on ticks
  - Handles cooldowns
  - Manages combat state transitions
- **EventSystem**: Handles random/scripted events during movement

### 2. Combat System (`systems/combat/`)
- **CombatState**: Current combat state (player HP, enemy HP, active effects)
- **ActionProcessor**: Processes combat actions (attack, spell, potion)
  - RNG hit calculation
  - Damage calculation
  - Cooldown application
- **ActionConfig**: Player's configured combat actions (1-3 actions)
- **CombatResolver**: Resolves simultaneous actions on same tick

### 3. Skill System (`systems/skills/`)
- **SkillManager**: Manages all skills
  - XP tracking
  - Level calculation
  - Ability unlocks
  - Stat bonuses
- **Skill Types**:
  - Combat (affects damage, accuracy)
  - Foraging (gathering resources)
  - Alchemy (potion making)
- **SkillData**: Skill definitions (XP curves, unlock requirements)

### 4. Inventory System (`systems/inventory/`)
- **InventoryGrid**: M×N grid storage
  - Item placement
  - Stack management
  - Quantity limits
- **ItemManager**: Item definitions and interactions
  - Item types (weapon, armor, consumable, material)
  - Stackable vs non-stackable
  - Item combinations/recipes
- **EquipmentManager**: Equipped items
  - Equipment slots (weapon, armor pieces)
  - Stat calculation from equipment
  - Visual equipment interface
- **ItemInteraction**:
  - Left-click default actions (use/wield/eat/drink)
  - Right-click context menu (all available actions)

### 5. World System (`systems/world/`)
- **LocationManager**: Manages game locations
  - Location graph (town → forest → hidden creek → deepwoods)
  - Arrow-based navigation
  - Location descriptions
- **EventManager**: Handles location events
  - Random events on movement
  - Scripted story events
  - Event triggers and conditions
- **StoryManager**: Main storyline tracking
  - Quest progression
  - Multiple endings tracking
  - Story flags

### 6. Character System (`systems/character/`)
- **CharacterState**: Player character data
  - Stats (HP, combat stats, etc.)
  - Appearance (hairstyle, skin tone, etc.)
  - Portrait generation/selection
- **PortraitSystem**: Dynamic portrait rendering
  - Base portrait selection
  - Appearance modifiers
  - Equipment visibility (optional)

### 7. Save/Load System (`systems/save/`)
- **SaveManager**: Handles save/load operations
  - Multiple save slots
  - Serialization of game state
  - Save versioning
- **SaveData**: Save file structure
  - Character state
  - Inventory
  - Skills
  - Story progress
  - Location
  - Combat state (if in combat)

## UI Components (`components/`)

### Core UI
- **TextWindow**: Main text display area
  - Scrollable text history
  - Choice buttons
  - Event descriptions
- **ImageDisplay**: Scene/event image display
  - Static image rendering
  - Portrait overlays
  - Future: video support

### Gameplay UI
- **CombatInterface**: Combat-specific UI
  - Action buttons (1-3 configured actions)
  - HP bars
  - Cooldown indicators
  - Tick indicator
- **InventoryGrid**: Visual inventory display
  - Drag and drop (optional)
  - Item icons
  - Quantity displays
  - Context menu
- **EquipmentPanel**: Equipped items display
  - Equipment slots
  - Visual representation
- **SkillPanel**: Skills display
  - Skill levels
  - XP progress
  - Unlocked abilities

### Navigation UI
- **LocationMap**: Arrow-based navigation
  - Available directions
  - Current location display
- **ActionMenu**: General action menu
  - Inventory access
  - Skills view
  - Settings
  - Save/Load

### Settings UI
- **SettingsPanel**: Game settings
  - Tick speed adjustment (difficulty)
  - Other preferences

## Data Structures (`data/`)

### Static Game Data
- **items.json**: Item definitions
  - Name, description, image
  - Type, stackable, max quantity
  - Stats, effects
  - Combination recipes
- **locations.json**: Location definitions
  - Name, description, image
  - Connected locations
  - Available actions
- **events.json**: Event definitions
  - Random events
  - Scripted events
  - Triggers and conditions
- **skills.json**: Skill definitions
  - XP curves
  - Unlock requirements
  - Stat bonuses
- **combatActions.json**: Available combat actions
  - Action types
  - Cooldowns
  - Effects

## State Management (`store/`)

### Zustand Stores
- **useGameStore**: Core game state
  - Current location
  - In combat flag
  - Game mode (exploration vs combat)
- **useInventoryStore**: Inventory state
  - Items in inventory
  - Equipment
- **useSkillStore**: Skills state
  - Skill levels and XP
- **useCombatStore**: Combat state
  - Player HP, enemy data
  - Active cooldowns
  - Current tick
- **useCharacterStore**: Character state
  - Stats
  - Appearance
- **useStoryStore**: Story progression
  - Completed quests
  - Story flags
  - Ending conditions

## Data Flow

### Combat Flow
1. Player selects action → Action queued for next available tick
2. Tick occurs → Process player action + enemy action simultaneously
3. Calculate hits (RNG) → Apply damage → Update cooldowns
4. Check win/loss conditions → Continue or exit combat

### Movement Flow
1. Player selects direction → Move to new location
2. Check for events → Trigger random or scripted event
3. Update location state → Display new location description/image
4. Update available actions

### Inventory Flow
1. Player clicks item → Check item type → Execute default action
2. Right-click item → Show context menu → Player selects action
3. Item combination → Check recipe → Create new item
4. Equipment change → Update character stats → Update portrait

## MVP Scope

### Phase 1: Foundation
- Basic React + Vite setup
- Text window and image display
- Simple location navigation
- Basic inventory grid (no interactions yet)

### Phase 2: Core Systems
- Tick-based combat system
- Basic skill system (1-2 skills)
- Inventory interactions (use, equip)
- Save/load system

### Phase 3: Content
- Multiple locations
- Combat encounters
- Item system with some items
- Basic storyline

### Future Enhancements
- More skills
- Crafting system
- More complex combat actions
- Character appearance customization
- Video support
- Animations

