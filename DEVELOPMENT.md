# EmojyBattler - Development Guide

## Quick Start

```bash
# Navigate to project
cd c:\Users\stefa\Documents\EmojyBattler

# Install dependencies
npm install

# Start development server
npm run dev

# In another terminal, run tests
npm test

# Build for production
npm run build
```

---

## Project Structure

```
EmojyBattler/
├── src/
│   ├── core/                   # ✅ COMPLETE - Pure game logic
│   │   ├── types/              # TypeScript interfaces
│   │   ├── battle/             # Battle system
│   │   ├── items/              # Item database (100 items)
│   │   ├── shop/               # Shop & AI
│   │   ├── economy/            # Money system
│   │   ├── skills/             # Skill tree
│   │   ├── save/               # Save/load
│   │   └── GameEngine.ts       # Main coordinator
│   │
│   ├── components/             # 🚧 IN PROGRESS - React UI
│   │   ├── common/             # Reusable components
│   │   ├── menu/               # Menu screens
│   │   ├── shop/               # Shop interface
│   │   ├── battle/             # Battle display
│   │   ├── player/             # Player info
│   │   └── summary/            # Results screens
│   │
│   ├── hooks/                  # 🚧 TODO - Custom hooks
│   ├── context/                # 🚧 TODO - React context
│   ├── utils/                  # ✅ COMPLETE - Utilities
│   ├── styles/                 # ✅ COMPLETE - Global CSS
│   ├── App.tsx                 # 🚧 IN PROGRESS - Root component
│   └── main.tsx                # ✅ COMPLETE - Entry point
│
├── tests/                      # ⏸️ TODO - Test files
├── public/                     # Static assets
└── Config files                # ✅ COMPLETE

Legend:
✅ COMPLETE - Fully implemented
🚧 IN PROGRESS - Partially done
⏸️ TODO - Not started
```

---

## Development Workflow

### Step-by-Step Guide to Continue

#### 1. Create GameContext (NEXT TASK)

**File**: `src/context/GameContext.tsx`

**Purpose**: Provide global game state to all components

**Template**:
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameState, PersistentData } from '@core/types/GameState';
import { Difficulty } from '@core/types/Difficulty';
import { Item } from '@core/types/Item';
import { GameEngine } from '@core/GameEngine';
import { SaveManager } from '@core/save/SaveManager';

interface GameContextType {
  gameState: GameState | null;
  persistentData: PersistentData;

  // Actions
  startNewGame: (difficulty: Difficulty) => void;
  continueGame: () => void;
  purchaseItem: (item: Item) => void;
  sellItem: (item: Item) => void;
  startBattle: () => void;
  endRound: () => void;
  saveGame: () => void;
  loadGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [persistentData, setPersistentData] = useState<PersistentData>(() => {
    return SaveManager.loadPersistentData() || {
      difficultyProgress: {...},
      totalSkillPoints: 0,
      permanentSkills: [],
    };
  });

  // Implement actions...

  return (
    <GameContext.Provider value={{...}}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
```

#### 2. Create useGameState Hook

**File**: `src/hooks/useGameState.ts`

**Purpose**: Manage game state and actions

**Key Functions**:
- `startNewGame(difficulty)` - Initialize new game
- `purchaseItem(item)` - Buy item from shop
- `sellItem(item)` - Sell item back
- `startBattle()` - Execute battle
- `endRound()` - Handle round completion
- `saveGame()` - Persist to localStorage
- `loadGame()` - Load from localStorage

#### 3. Create Common Components

**Button.tsx**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Button({ variant = 'primary', onClick, children, disabled }: ButtonProps) {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    success: 'btn-success',
  };

  return (
    <button
      className={variantClasses[variant]}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

**ItemCard.tsx**:
- Display emoji prominently
- Show name and price
- Colored border based on rarity
- Hover tooltip with stats
- Click handler for buy/sell

#### 4. Create MainMenu

**File**: `src/components/menu/MainMenu.tsx`

**Features**:
- "Start New Game" button → DifficultySelect
- "Continue" button (if save exists)
- "Skills" button → SkillsPanel
- "Save/Load" button → SaveLoadPanel

#### 5. Create ShopPhase

**File**: `src/components/shop/ShopPhase.tsx`

**Layout**:
```
┌─────────────────────────────────────┐
│ Round X/15    Lives: ❤❤❤❤❤   $XXX │
├─────────────────────────────────────┤
│                                     │
│  [Item] [Item] [Item]              │
│  [Item] [Item] [Item]   Inventory  │
│  [Item] [Item] [Item]   [Items...] │
│                                     │
│  Player Stats: Attack/Defense       │
│  [Ready for Battle Button]          │
└─────────────────────────────────────┘
```

**Features**:
- 3x3 grid of shop items
- Click item to buy (if affordable)
- Show inventory on right
- Click inventory item to sell
- Display player stats
- "Ready for Battle" button

#### 6. Create BattlePhase

**File**: `src/components/battle/BattlePhase.tsx`

**Features**:
- Auto-play battle (execute on mount)
- Animate through battle events
- Show HP bars for both sides
- Display battle log (scrollable)
- "Continue" button after battle ends
- Win/Loss/Draw indicator

#### 7. Create BattleSummary

**File**: `src/components/summary/BattleSummary.tsx`

**Features**:
- Show battle result (Won/Lost/Draw)
- Display final HP
- Show lives remaining
- "Continue to Shop" button
- Game Over screen if lives = 0

#### 8. Wire Up App.tsx

**File**: `src/App.tsx`

**Routing**:
```typescript
function App() {
  const { gameState } = useGame();

  if (!gameState) {
    return <MainMenu />;
  }

  switch (gameState.phase) {
    case 'menu':
      return <MainMenu />;
    case 'shop':
      return <ShopPhase />;
    case 'battle':
      return <BattlePhase />;
    case 'summary':
      return <BattleSummary />;
    case 'gameOver':
      return <GameOverScreen />;
  }
}
```

---

## Code Style Guide

### TypeScript
- Use strict mode (already configured)
- Define interfaces for all props
- Use enums for constants
- Avoid `any` type

### React
- Functional components only
- Use hooks (no class components)
- Keep components small and focused
- Extract reusable logic to custom hooks

### Naming Conventions
- **Components**: PascalCase (`ItemCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useGameState.ts`)
- **Files**: Match component name
- **Props interfaces**: `[Component]Props`

### File Organization
```typescript
// 1. Imports
import React from 'react';
import { Item } from '@core/types/Item';

// 2. Types/Interfaces
interface ItemCardProps {
  item: Item;
  onClick: () => void;
}

// 3. Component
export function ItemCard({ item, onClick }: ItemCardProps) {
  // Logic
  return (
    // JSX
  );
}

// 4. Helper functions (if any)
```

---

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific file
npm test ItemDatabase.test.ts

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Writing Tests

**Example**: `tests/core/battle/BattleEngine.test.ts`
```typescript
import { describe, test, expect } from 'vitest';
import { BattleEngine } from '@core/battle/BattleEngine';

describe('BattleEngine', () => {
  test('player attacks first', () => {
    // Setup
    const player = createTestPlayer();
    const opponent = createTestPlayer();

    // Execute
    const battle = BattleEngine.executeBattle(player, opponent, 1);

    // Assert
    expect(battle.events[0].attacker).toBe('player');
  });

  test('defense caps at 90%', () => {
    // Test implementation
  });
});
```

---

## Common Tasks

### Adding a New Item
1. Edit `src/core/items/ItemDatabase.ts`
2. Add to `CORE_ITEMS` array
3. Define emoji, name, rarity, type, stats, effects
4. Price auto-calculated

### Adding a New Skill
1. Edit `src/core/skills/SkillTree.ts`
2. Add to `SKILL_TREE` array
3. Implement effect in `SkillManager.applySkills()`

### Adding a New Effect Type
1. Add to `EffectType` in `src/core/types/Item.ts`
2. Handle in `src/core/battle/ItemEffects.ts`
3. Update damage calculation if needed
4. Update balance calculator

### Debugging Battle Issues
1. Check `BattleEngine.executeBattle()` events
2. Verify `DamageCalculator` inputs
3. Log battle state at each turn
4. Use `BattleLogger.formatBattleLog()` for readable output

---

## Build & Deploy

### Development Build
```bash
npm run dev
```
- Hot reload enabled
- Source maps included
- Tailwind JIT mode

### Production Build
```bash
npm run build
```
- Output: `dist/` folder
- Minified and optimized
- Tree-shaken
- No source maps

### Preview Production Build
```bash
npm run preview
```

### Deploy
1. Build: `npm run build`
2. Upload `dist/` folder to hosting
3. Hosting options:
   - Vercel (recommended)
   - Netlify
   - GitHub Pages
   - Any static host

---

## Troubleshooting

### TypeScript Errors
```bash
# Type check without build
npx tsc --noEmit

# Fix auto-fixable issues
npm run lint -- --fix
```

### Build Errors
- Check imports use `@` aliases correctly
- Verify all paths are absolute, not relative
- Check for circular dependencies

### Runtime Errors
- Check browser console
- Verify GameEngine state transitions
- Check item effects are valid
- Verify save/load data structure

### Performance Issues
- Check battle doesn't run in infinite loop
- Verify React components use proper memoization
- Check item database loads only once

---

## Git Workflow

### Commits
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add ItemCard component with rarity colors"

# Push to remote
git push
```

### Commit Message Format
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance

---

## Resources

### Documentation
- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/
- Tailwind: https://tailwindcss.com/
- Vite: https://vitejs.dev/
- Vitest: https://vitest.dev/

### Icons & Emojis
- Emojipedia: https://emojipedia.org/
- Unicode: https://unicode.org/emoji/charts/

### Game Balance
See `CLAUDE.md` for item balance formulas and constants.

---

## Contact & Support

- **Issues**: Create issue in repository
- **Questions**: Check CLAUDE.md and STATUS.md first
- **Pull Requests**: Welcome! Follow code style guide

---

## Checklist for New Developer

- [ ] Read README.md
- [ ] Read CLAUDE.md (architecture overview)
- [ ] Read STATUS.md (current progress)
- [ ] Read this file (DEVELOPMENT.md)
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Verify game logic works (check browser console)
- [ ] Start with GameContext.tsx

---

**Happy Coding!** 🎮⚔️
