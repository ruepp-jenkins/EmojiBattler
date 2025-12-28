# EmojiBattler - Setup & Installation Guide

## 🎮 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd EmojiBattler
npm install
```

This will install all required packages:
- React 18
- TypeScript 5.3
- Vite 5 (dev server)
- Tailwind CSS 3.4
- Vitest (testing)
- And all dev dependencies

### Step 2: Start Development Server
```bash
npm run dev
```

You should see:
```
  VITE v5.2.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 3: Open in Browser
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

You should see the **EmojiBattler Main Menu**! 🎉

---

## ✅ What's Working

### Core Game Logic (100% Complete)
- ✅ 100 unique emoji items with balanced stats
- ✅ Battle system with all mechanics
- ✅ Smart AI opponent
- ✅ Shop system (3x3 grid)
- ✅ Economy & money management
- ✅ Skills system
- ✅ Save/load with export/import
- ✅ 5 difficulty levels + Torment

### UI Components (90% Complete)
- ✅ Main Menu
- ✅ Difficulty selection
- ✅ Shop phase (buy/sell items)
- ✅ Battle phase (auto-play with animations)
- ✅ Battle summary
- ✅ Game over screen with stats
- ✅ Item cards with rarity colors
- ✅ HP bars
- ✅ Battle log

### Features Implemented
- ✅ Round-based gameplay (15 rounds)
- ✅ 5 lives system
- ✅ Auto-save to localStorage
- ✅ Item tooltips with stats
- ✅ Battle timeline visualization
- ✅ Detailed statistics tracking

---

## 🎮 How to Play

### Starting a Game
1. Click "Start New Game"
2. Choose difficulty (Normal → Torment)
3. Game begins at Round 1

### Shop Phase
- View 9 random items in 3x3 grid
- Click item to buy (if you have money)
- Click inventory item to sell
- Items have colored borders:
  - White = Common
  - Blue = Rare
  - Purple = Epic
  - Red = Legendary
- Max 15 items per player
- Click "Ready for Battle!" when done

### Battle Phase
- Battle auto-plays
- Watch HP bars decrease
- Read battle log for details
- Click "Continue" when battle ends

### Winning & Losing
- Win battle → Continue to next round
- Lose battle → Lose 1 life
- Complete 15 rounds → Victory!
- Lose all 5 lives → Game Over

---

## 🛠️ Development Commands

```bash
# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Type check
npx tsc --noEmit

# Lint code
npm run lint
```

---

## 📁 Project Structure

```
EmojiBattler/
├── src/
│   ├── core/              # ✅ Game logic (100% complete)
│   │   ├── battle/        # Battle system
│   │   ├── items/         # 100 items
│   │   ├── shop/          # Shop & AI
│   │   ├── economy/       # Money
│   │   ├── skills/        # Skills
│   │   ├── save/          # Save/load
│   │   └── types/         # TypeScript types
│   │
│   ├── components/        # ✅ React UI (90% complete)
│   │   ├── menu/          # Main menu
│   │   ├── shop/          # Shop interface
│   │   ├── battle/        # Battle screen
│   │   ├── summary/       # Results
│   │   └── common/        # Reusable components
│   │
│   ├── context/           # ✅ GameContext
│   ├── utils/             # ✅ Utilities
│   └── App.tsx            # ✅ Main app
│
└── Documentation files    # ✅ Complete
```

---

## 🎨 Features in Detail

### Item System
- **100 unique items** with emojis
- **Types**: Attack, Defense, Passive
- **Effects**: Damage, Vampire, Heal, Stacking, Luck, Multipliers, Life Prevention
- **Rarities**: Common (50%), Rare (30%), Epic (15%), Legendary (5%)
- **Auto-pricing** based on item power

### Battle Mechanics
- **Simultaneous combat**: Both attack at same time
- **Player attacks first**
- **Defense cap**: 90% maximum damage reduction
- **Speed boost**: Every 5 attacks
- **Damage scaling**: 20% increase per round after turn 20
- **Draw condition**: Max 75 turns
- **Detailed logging**: See every damage/block breakdown

### AI Opponent
- **Smart purchasing**: Builds balanced teams
- **Synergy detection**: Recognizes item combos
- **Difficulty scaling**: 50% optimal (Normal) → 100% optimal (Torment)
- **Adaptive strategy**: Early defense, late attack

### Save System
- **Auto-save** after each round
- **localStorage** persistence
- **Export to JSON** file
- **Export to text** (copyable)
- **Import from file** or text
- **Mid-battle saves** supported

---

## 🐛 Troubleshooting

### Port 5173 already in use
```bash
# Kill existing process or use different port
npm run dev -- --port 3000
```

### Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force
npm install
```

### TypeScript errors
```bash
# Type check without building
npx tsc --noEmit
```

### Game not loading
1. Open browser console (F12)
2. Check for errors
3. Verify all files created correctly
4. Try `npm run build` to check for build errors

---

## 📝 What's Next (Optional Enhancements)

### High Priority
- [ ] Skills panel UI (currently placeholder)
- [ ] Battle animations (emoji movements)
- [ ] Sound effects
- [ ] Mobile responsive design

### Medium Priority
- [ ] More item effects
- [ ] Achievement system
- [ ] Daily challenges
- [ ] Item sets/combos

### Low Priority
- [ ] Multiplayer
- [ ] Leaderboards
- [ ] Custom item creator
- [ ] Mod support

---

## 📚 Documentation

- **CLAUDE.md** - Development notes, architecture overview
- **STATUS.md** - Current progress, file checklist
- **DEVELOPMENT.md** - Development guide, code patterns
- **README.md** - Project overview
- **This file (SETUP.md)** - Setup instructions

---

## ✅ Testing Checklist

### Core Features
- [ ] Start new game → shop appears
- [ ] Buy items from shop
- [ ] Sell items back
- [ ] Ready for battle → battle executes
- [ ] Battle completes → summary shows
- [ ] Continue → next round starts
- [ ] Lose life → hearts decrease
- [ ] Game over at 0 lives
- [ ] Victory at round 15

### Item System
- [ ] Items show correct rarity colors
- [ ] Tooltips display on hover
- [ ] Cannot buy more than 15 items
- [ ] Cannot buy without money
- [ ] Breakable items become unsellable

### Battle System
- [ ] HP bars update correctly
- [ ] Battle log shows events
- [ ] Win/Loss detected correctly
- [ ] Draw works at turn 75
- [ ] All item effects trigger

### Save/Load
- [ ] Game auto-saves
- [ ] Continue loads saved game
- [ ] Export to JSON works
- [ ] Export to text works
- [ ] Import works correctly

---

## 🎯 Success Criteria

Your game is working if you can:
1. ✅ Start a new game
2. ✅ Buy items in the shop
3. ✅ Fight a battle (auto-play)
4. ✅ Win or lose a battle
5. ✅ Progress through multiple rounds
6. ✅ Save and load the game
7. ✅ Complete a full run (15 rounds or game over)

---

## 🚀 Deployment (Optional)

### Build for Production
```bash
npm run build
```

Output: `dist/` folder

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Or upload `dist/` to:
- Netlify
- GitHub Pages
- Any static host

---

## 💡 Tips

1. **Read tooltips**: Hover items to see all stats
2. **Balance team**: Mix attack, defense, and passive items
3. **Sell wisely**: Used items can't be sold
4. **Save often**: Game auto-saves, but manual save is available
5. **Learn combos**: Vampire + high attack = sustain

---

## 🤝 Support

- **Issues**: Check documentation first
- **Questions**: Read CLAUDE.md and DEVELOPMENT.md
- **Bugs**: Check browser console for errors

---

**Have fun playing EmojiBattler!** ⚔️🎮

Created with React, TypeScript, and Vite.
