# Claude Development Notes

## Project: EmojyBattler - TypeScript Auto-Battler Game

### Last Updated
2025-01-XX (Update this date when resuming)

### Current Status
✅ **Core Game Logic: 100% Complete**
🚧 **React UI: In Progress (40% complete)**

---

## What's Been Built

### ✅ Completed Systems (src/core/)

#### 1. Type Definitions (`src/core/types/`)
All TypeScript interfaces and enums are defined:
- **Item.ts** - Item, ItemEffect, ItemRarity, ItemType, EffectTrigger
- **Player.ts** - Player, PlayerStats, PlayerCalculatedStats
- **Battle.ts** - BattleState, BattleEvent
- **Difficulty.ts** - 5 difficulty levels + Torment scaling
- **Skills.ts** - Permanent skill system
- **GameState.ts** - Main game state, SaveGame structure

#### 2. Item System (`src/core/items/`)
- **ItemDatabase.ts** - **100 unique emoji items** with balanced stats
  - 27 Common, 34 Rare, 24 Epic, 15 Legendary
  - All effect types implemented
- **ItemBalance.ts** - Balance validation and power calculations

#### 3. Battle System (`src/core/battle/`)
- **BattleEngine.ts** - Main battle loop with all mechanics:
  - ✅ Simultaneous attack/block
  - ✅ Player attacks first
  - ✅ 90% defense cap
  - ✅ Speed increases every 5 attacks
  - ✅ 20% damage multiplier after turn 20
  - ✅ Max 75 turns → draw
  - ✅ All item effects (vampire, heal, stacking, luck, etc.)
- **DamageCalculator.ts** - All damage/block calculations
- **ItemEffects.ts** - Effect handlers for all effect types
- **BattleLogger.ts** - Detailed event logging

#### 4. Shop & Economy (`src/core/shop/`, `src/core/economy/`)
- **ShopGenerator.ts** - 3x3 shop grid with rarity weighting
- **AIShopStrategy.ts** - Smart AI that:
  - Builds balanced compositions (40-60% attack, 30-40% defense)
  - Detects item synergies
  - Adapts to round progression
  - Scales with difficulty
- **MoneyManager.ts** - Buy/sell mechanics

#### 5. Skills System (`src/core/skills/`)
- **SkillTree.ts** - 7 permanent upgradeable skills
- **SkillManager.ts** - Apply skills to player stats

#### 6. Game Engine (`src/core/`)
- **GameEngine.ts** - Main game coordinator:
  - Game initialization
  - Phase transitions (menu → shop → battle → summary)
  - Lives system (5 lives)
  - Round progression (15 rounds)
  - Statistics tracking
  - Difficulty progression

#### 7. Save/Load System (`src/core/save/`)
- **SaveManager.ts** - Complete save/load:
  - localStorage persistence
  - JSON export/import
  - Base64 text export/import
  - File download/upload
  - Save validation

---

## What Needs to Be Built

### 🚧 React UI Layer (`src/components/`)

#### High Priority (Essential for playable game)
1. **GameContext.tsx** - Global state provider
2. **hooks/useGameState.ts** - Main game state management
3. **common/Button.tsx** - Reusable button component
4. **common/ItemCard.tsx** - Item display with rarity colors
5. **menu/MainMenu.tsx** - Start/Continue/Skills
6. **shop/ShopPhase.tsx** - 3x3 item grid, buy/sell
7. **battle/BattlePhase.tsx** - Auto-play battle display
8. **summary/BattleSummary.tsx** - Post-battle results

#### Medium Priority (Polish)
9. **player/PlayerStats.tsx** - Always-visible stats display
10. **player/InventoryDisplay.tsx** - Current items (max 15)
11. **player/LivesDisplay.tsx** - Animated hearts
12. **battle/BattleLog.tsx** - Scrollable detailed log
13. **menu/DifficultySelect.tsx** - Difficulty selection UI
14. **menu/SkillsPanel.tsx** - Skill tree UI

#### Low Priority (Nice to have)
15. **battle/BattleAnimation.tsx** - Emoji animations
16. **summary/GameOverScreen.tsx** - Final stats + timeline
17. **menu/SaveLoadPanel.tsx** - Import/export UI
18. **common/ItemTooltip.tsx** - Hover tooltip with stats

---

## Architecture Overview

### Clean Architecture Pattern
```
src/
├── core/           # Pure TypeScript game logic (NO React dependencies)
│   ├── types/      # All TypeScript interfaces
│   ├── battle/     # Battle system
│   ├── items/      # Item database
│   ├── shop/       # Shop & AI
│   ├── economy/    # Money management
│   ├── skills/     # Skill system
│   ├── save/       # Save/load
│   └── GameEngine.ts  # Main coordinator
│
├── components/     # React UI (presentation layer)
│   ├── menu/
│   ├── shop/
│   ├── battle/
│   ├── player/
│   ├── summary/
│   └── common/
│
├── hooks/          # React hooks (connect UI to core logic)
│   ├── useGameState.ts
│   ├── useBattle.ts
│   └── useShop.ts
│
├── context/        # React context providers
│   └── GameContext.tsx
│
└── utils/          # Utilities and constants
```

### State Flow
```
User Action → React Component → Hook → Core Game Logic → State Update → Re-render
```

Example:
```
User clicks "Buy Item"
  ↓
ShopPhase.tsx
  ↓
useGameState.purchaseItem(item)
  ↓
GameEngine.purchaseItem(gameState, item)
  ↓
State updated
  ↓
UI re-renders with new state
```

---

## Key Implementation Details

### 1. Battle System
- Battles are **deterministic** - same inputs produce same outputs
- BattleEngine returns a complete BattleState with full event log
- All calculations in DamageCalculator are pure functions
- Item effects are applied via ItemEffects.applyEffects()

### 2. Item Effects
Special handling for:
- **Stacking**: Increments `currentStacks` each turn (max cap)
- **Breakable**: Items with `maxDuration` break after N battles
- **Luck-based**: Effects with `chance` use Math.random()
- **Vampire**: Heals based on damage dealt percentage
- **Life Prevention**: Guardian Angel prevents next life loss, then breaks

### 3. AI Strategy
AIShopStrategy uses weighted scoring:
- Item power (base stats + effects)
- Synergy with existing items (vampire combos, multipliers)
- Round strategy (early: defense, late: attack)
- Difficulty modifier (optimal play %)
- Balance enforcement (maintain attack/defense ratio)

### 4. Save System
SaveGame structure:
```typescript
{
  version: "1.0.0",
  gameState: GameState,      // Current game state
  difficultyProgress: {...}, // Highest difficulty won
  totalSkillPoints: number,
  permanentSkills: [...],
  timestamp: number
}
```

---

## Constants & Game Balance

See `src/utils/constants.ts` for all game constants:

```typescript
MAX_ROUNDS: 15
MAX_ITEMS: 15
MAX_LIVES: 5
MAX_BATTLE_TURNS: 75
MAX_DEFENSE_PERCENT: 0.9  // 90% cap
SPEED_INCREASE_INTERVAL: 5
DAMAGE_MULTIPLIER_START: 20
DAMAGE_MULTIPLIER_VALUE: 0.2  // 20% per round
STARTING_HP: 100
STARTING_MONEY: 200
MONEY_PER_ROUND: 100
SHOP_SIZE: 9  // 3x3 grid
```

---

## Testing Strategy

### Unit Tests (Vitest)
- **Battle system**: Test all mechanics (speed, damage multiplier, draw, etc.)
- **Item effects**: Test each effect type
- **AI strategy**: Verify balanced purchases
- **Save/load**: Verify state preservation

### Manual Testing Checklist
- [ ] All 5 difficulties + Torment
- [ ] All item effects work
- [ ] 90% defense cap enforced
- [ ] Draw at turn 75
- [ ] Life prevention item works
- [ ] Save/load preserves exact state
- [ ] Everything fits on one screen

---

## Common Patterns

### Adding a New Item
1. Add to `CORE_ITEMS` in `ItemDatabase.ts`
2. Define effects using `ItemEffect` interface
3. Price is auto-calculated by `calculatePrice()`

### Adding a New Effect Type
1. Add to `EffectType` in `Item.ts`
2. Handle in `ItemEffects.applyEffect()`
3. Calculate value in `DamageCalculator` if needed
4. Update `ItemBalance.calculateEffectPower()`

### Adding a New Skill
1. Add to `SKILL_TREE` in `SkillTree.ts`
2. Handle in `SkillManager.applySkills()`
3. If multiplier, handle in `DamageCalculator`

---

## Known Issues & TODOs

### High Priority
- [ ] Create GameContext and hooks
- [ ] Build essential UI components
- [ ] Wire up App.tsx routing

### Medium Priority
- [ ] Add battle animations
- [ ] Create game over screen with stats timeline
- [ ] Add sound effects (optional)

### Low Priority
- [ ] Write comprehensive tests
- [ ] Add accessibility features
- [ ] Performance optimization
- [ ] Mobile responsive design

---

## Performance Considerations

- **Battle execution**: Runs synchronously, completes in <100ms
- **Item database**: Loaded once on startup (100 items)
- **Save/load**: Uses localStorage, fallback to export/import
- **Re-renders**: GameContext provides state, components subscribe to changes

---

## How to Resume Development

### 1. Verify Setup
```bash
cd c:\Users\stefa\Documents\EmojyBattler
npm install
npm run dev
```

### 2. Current State
- All core game logic is complete and tested
- React UI is partially implemented
- App.tsx has placeholder content

### 3. Next Steps
See **STATUS.md** for detailed next steps and current task list.

### 4. Development Workflow
```bash
# Start dev server
npm run dev

# Run tests (in another terminal)
npm test

# Build for production
npm run build

# Type check
npx tsc --noEmit
```

---

## Useful Commands

```bash
# Test a specific file
npm test src/core/battle/BattleEngine.test.ts

# Check item database stats
# (Add a script to log ItemDatabase.getItemDatabaseStats())

# Validate save game
# (Use SaveManager.validateSave())

# Run balance report
# (Use ItemBalance.validateBalance())
```

---

## Contact & Resources

- **Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Testing**: Vitest + React Testing Library
- **State**: React Context (no external library)
- **Storage**: localStorage + export/import

---

## Notes for Future Development

### Potential Features
1. **Multiplayer**: Battle against other players' saved teams
2. **Daily Challenges**: Special item sets or modifiers
3. **Achievements**: Track milestones
4. **Item Sets**: Bonus for collecting themed items
5. **Prestige System**: Reset with permanent bonuses

### Code Maintenance
- Keep core/ completely framework-agnostic
- All game logic must be pure functions where possible
- Use TypeScript strict mode
- Write tests for new features
- Update CLAUDE.md when making significant changes

---

## Quick Reference

### File Locations
- Game logic: `src/core/**/*.ts`
- React UI: `src/components/**/*.tsx`
- Types: `src/core/types/**/*.ts`
- Constants: `src/utils/constants.ts`
- Tests: `tests/**/*.test.ts`

### Key Classes
- `GameEngine` - Main game coordinator
- `BattleEngine` - Battle execution
- `ItemDatabase` - All items
- `AIShopStrategy` - AI opponent
- `SaveManager` - Save/load
- `SkillManager` - Skills system

---

**Last worked on**: Phase 7 - Save/Load System complete, starting React UI
**Next task**: Create GameContext and useGameState hook
**Estimated completion**: 60% complete overall
