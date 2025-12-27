# EmojyBattler ⚔️

A TypeScript-based auto-battler game where players collect emoji items, battle AI opponents, and progress through increasing difficulties.

## Features

- **90+ Unique Emoji Items**: Attack, defense, and passive items with various rarities and effects
- **Auto-Battle System**: Simultaneous combat with detailed logging
- **Smart AI Opponent**: Adaptive difficulty across 5 levels plus unlimited Torment scaling
- **Persistent Skills**: Earn and spend skill points for permanent upgrades
- **Save/Load System**: localStorage with export/import functionality
- **15 Rounds**: Survive with 5 lives to win
- **Single Screen Design**: Everything visible at once for optimal gameplay

## Tech Stack

- React 18 with TypeScript
- Vite for fast development and builds
- Tailwind CSS for styling
- Vitest for testing
- Clean architecture with separated game logic

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Game Rules

### Game Loop
1. **Shop Phase**: Buy items (3x3 grid, max 15 items)
2. **Battle Phase**: Auto-battle against AI opponent
3. **Summary**: Review battle results
4. Repeat for 15 rounds

### Lives System
- Start with 5 lives
- Lose 1 life per lost battle
- Draw = no life lost
- Game over at 0 lives

### Item System
- **Types**: Attack, Defense, Passive
- **Rarities**: Common (white), Rare (blue), Epic (purple), Legendary (red)
- Each item can only be bought once per run
- Sell items for purchase price (except used breakable items)

### Battle Mechanics
- Simultaneous attack/block each turn
- Defense caps at 90% damage reduction
- Speed increases every 5 attacks
- 20% damage multiplier after 20 attacks
- Max 75 turns → draw

### Difficulties
1. Normal - AI plays at 50% optimal
2. Hard - AI plays at 70% optimal
3. Expert - AI plays at 85% optimal
4. Master - AI plays at 95% optimal
5. Torment (number) - AI plays at 100% optimal + stat bonuses

### Skills
- Earn skill points by completing runs
- Spend points on permanent upgrades (base stats, multipliers, etc.)
- Skills persist across all runs

## Architecture

```
src/
├── core/           # Pure TypeScript game logic (framework-agnostic)
├── components/     # React UI components
├── hooks/          # React hooks connecting UI to game logic
└── utils/          # Utility functions and constants
```

## License

MIT
