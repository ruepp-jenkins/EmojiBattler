import { Item, ItemRarity, ItemType, EffectTrigger } from '@core/types/Item';

// Hand-crafted core items with balanced stats
const CORE_ITEMS: Omit<Item, 'price' | 'canSell'>[] = [
  // === COMMON ATTACK ITEMS ===
  {
    id: 'sword',
    emoji: '⚔️',
    name: 'Sword',
    rarity: ItemRarity.Common,
    type: ItemType.Attack,
    baseAttack: 4,
    baseDefense: 0,
    effects: [],
    description: 'A basic sword. Provides steady attack damage.',
  },
  {
    id: 'dagger',
    emoji: '🗡️',
    name: 'Dagger',
    rarity: ItemRarity.Common,
    type: ItemType.Attack,
    baseAttack: 3,
    baseDefense: 0,
    effects: [],
    description: 'Quick and light. Modest attack power.',
  },
  {
    id: 'axe',
    emoji: '🪓',
    name: 'Axe',
    rarity: ItemRarity.Common,
    type: ItemType.Attack,
    baseAttack: 5,
    baseDefense: 0,
    effects: [],
    description: 'Heavy weapon with solid damage output.',
  },
  {
    id: 'bow',
    emoji: '🏹',
    name: 'Bow',
    rarity: ItemRarity.Common,
    type: ItemType.Attack,
    baseAttack: 4,
    baseDefense: 0,
    effects: [],
    description: 'Ranged weapon for consistent damage.',
  },
  {
    id: 'hammer',
    emoji: '🔨',
    name: 'Hammer',
    rarity: ItemRarity.Common,
    type: ItemType.Attack,
    baseAttack: 5,
    baseDefense: 0,
    effects: [],
    description: 'Smash your enemies with blunt force.',
  },

  // === COMMON DEFENSE ITEMS ===
  {
    id: 'shield',
    emoji: '🛡️',
    name: 'Shield',
    rarity: ItemRarity.Common,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 11,
    effects: [],
    description: 'Basic protection against attacks.',
  },
  {
    id: 'armor',
    emoji: '🦺',
    name: 'Armor',
    rarity: ItemRarity.Common,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 14,
    effects: [],
    description: 'Sturdy armor that reduces damage taken.',
  },
  {
    id: 'helmet',
    emoji: '⛑️',
    name: 'Helmet',
    rarity: ItemRarity.Common,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 8,
    effects: [],
    description: 'Protects your head from harm.',
  },
  {
    id: 'wall',
    emoji: '🧱',
    name: 'Wall',
    rarity: ItemRarity.Common,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 10,
    effects: [],
    description: 'A solid wall of defense.',
  },

  // === RARE ATTACK ITEMS ===
  {
    id: 'fire',
    emoji: '🔥',
    name: 'Fire',
    rarity: ItemRarity.Rare,
    type: ItemType.Attack,
    baseAttack: 6,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'damage',
        value: 2,
      },
    ],
    description: 'Burns enemies for additional damage on each attack.',
  },
  {
    id: 'lightning',
    emoji: '⚡',
    name: 'Lightning',
    rarity: ItemRarity.Rare,
    type: ItemType.Attack,
    baseAttack: 8,
    baseDefense: 0,
    effects: [],
    description: 'Strike with the power of thunder!',
  },
  {
    id: 'tornado',
    emoji: '🌪️',
    name: 'Tornado',
    rarity: ItemRarity.Rare,
    type: ItemType.Attack,
    baseAttack: 7,
    baseDefense: 0,
    effects: [],
    description: 'Whirlwind of destruction.',
  },
  {
    id: 'bomb',
    emoji: '💣',
    name: 'Bomb',
    rarity: ItemRarity.Rare,
    type: ItemType.Attack,
    baseAttack: 9,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnBattleStart,
        effectType: 'tempPower',
        value: 10,
        duration: 5,
        breakable: true,
        maxDuration: 3,
        currentDuration: 0,
      },
    ],
    description: 'Explosive power for the first 5 turns. Breaks after 3 battles.',
  },
  {
    id: 'gun',
    emoji: '🔫',
    name: 'Gun',
    rarity: ItemRarity.Rare,
    type: ItemType.Attack,
    baseAttack: 7,
    baseDefense: 0,
    effects: [],
    description: 'Modern firepower for ranged attacks.',
  },

  // === RARE DEFENSE ITEMS ===
  {
    id: 'ice',
    emoji: '🧊',
    name: 'Ice',
    rarity: ItemRarity.Rare,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 17,
    effects: [
      {
        trigger: EffectTrigger.OnDefend,
        effectType: 'reduceOpponentAttack',
        value: 2,
      },
    ],
    description: 'Freezes enemies, reducing their attack power.',
  },
  {
    id: 'mountain',
    emoji: '⛰️',
    name: 'Mountain',
    rarity: ItemRarity.Rare,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 21,
    effects: [],
    description: 'Immovable as a mountain.',
  },
  {
    id: 'castle',
    emoji: '🏰',
    name: 'Castle',
    rarity: ItemRarity.Rare,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 20,
    effects: [],
    description: 'Fortified defenses like a castle wall.',
  },

  // === RARE PASSIVE ITEMS ===
  {
    id: 'heart',
    emoji: '❤️',
    name: 'Heart',
    rarity: ItemRarity.Rare,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'heal',
        value: 4,
      },
    ],
    description: 'Heals 4 HP with each attack.',
  },
  {
    id: 'clover',
    emoji: '🍀',
    name: 'Clover',
    rarity: ItemRarity.Rare,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'damage',
        value: 8,
        chance: 0.3,
      },
    ],
    description: 'Lucky strike! 30% chance to deal 15 bonus damage.',
  },
  {
    id: 'gem',
    emoji: '💎',
    name: 'Gem',
    rarity: ItemRarity.Rare,
    type: ItemType.Passive,
    baseAttack: 3,
    baseDefense: 7,
    effects: [],
    description: 'Provides balanced attack and defense.',
  },

  // === EPIC ATTACK ITEMS ===
  {
    id: 'dragon',
    emoji: '🐉',
    name: 'Dragon',
    rarity: ItemRarity.Epic,
    type: ItemType.Attack,
    baseAttack: 11,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'damage',
        value: 3,
      },
    ],
    description: 'Unleash dragon fire! Massive attack with bonus damage.',
  },
  {
    id: 'volcano',
    emoji: '🌋',
    name: 'Volcano',
    rarity: ItemRarity.Epic,
    type: ItemType.Attack,
    baseAttack: 13,
    baseDefense: 0,
    effects: [],
    description: 'Explosive volcanic fury.',
  },
  {
    id: 'rocket',
    emoji: '🚀',
    name: 'Rocket',
    rarity: ItemRarity.Epic,
    type: ItemType.Attack,
    baseAttack: 10,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'attackMultiply',
        value: 0.15,
      },
    ],
    description: 'Increases all attack damage by 15%.',
  },
  {
    id: 'skull',
    emoji: '💀',
    name: 'Skull',
    rarity: ItemRarity.Epic,
    type: ItemType.Attack,
    baseAttack: 14,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnBattleStart,
        effectType: 'tempPower',
        value: 15,
        duration: 10,
        breakable: true,
        maxDuration: 3,
        currentDuration: 0,
      },
    ],
    description: 'Deadly power for 10 turns. Breaks after 3 battles.',
  },

  // === EPIC DEFENSE ITEMS ===
  {
    id: 'fortress',
    emoji: '🏯',
    name: 'Fortress',
    rarity: ItemRarity.Epic,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 31,
    effects: [],
    description: 'Impenetrable fortress defenses.',
  },
  {
    id: 'diamond_shield',
    emoji: '💠',
    name: 'Diamond Shield',
    rarity: ItemRarity.Epic,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 28,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'defenseMultiply',
        value: 0.15,
      },
    ],
    description: 'Increases all defense by 15%.',
  },

  // === EPIC PASSIVE ITEMS ===
  {
    id: 'vampire',
    emoji: '🧛',
    name: 'Vampire',
    rarity: ItemRarity.Epic,
    type: ItemType.Passive,
    baseAttack: 4,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'vampire',
        value: 0.25,
      },
    ],
    description: 'Heals for 25% of damage dealt.',
  },
  {
    id: 'phoenix',
    emoji: '🔥🦅',
    name: 'Phoenix',
    rarity: ItemRarity.Epic,
    type: ItemType.Passive,
    baseAttack: 5,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'heal',
        value: 5,
      },
    ],
    description: 'Heals 5 HP with each attack.',
  },
  {
    id: 'coin',
    emoji: '🪙',
    name: 'Lucky Coin',
    rarity: ItemRarity.Epic,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'damage',
        value: 13,
        chance: 0.4,
      },
      {
        trigger: EffectTrigger.OnDefend,
        effectType: 'block',
        value: 14,
        chance: 0.4,
      },
    ],
    description: '40% chance for bonus damage or block.',
  },
  {
    id: 'hourglass',
    emoji: '⏳',
    name: 'Hourglass',
    rarity: ItemRarity.Epic,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnTurnStart,
        effectType: 'stack',
        value: 2,
        stackable: true,
        maxStacks: 20,
        currentStacks: 0,
      },
    ],
    description: 'Gains +2 attack each turn (max 20 stacks).',
  },

  // === LEGENDARY ATTACK ITEMS ===
  {
    id: 'crown',
    emoji: '👑',
    name: 'Crown',
    rarity: ItemRarity.Legendary,
    type: ItemType.Attack,
    baseAttack: 15,
    baseDefense: 14,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'attackMultiply',
        value: 0.2,
      },
    ],
    description: 'Royal power! +20% attack and balanced defense.',
  },
  {
    id: 'sun',
    emoji: '☀️',
    name: 'Sun',
    rarity: ItemRarity.Legendary,
    type: ItemType.Attack,
    baseAttack: 18,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'damage',
        value: 5,
      },
    ],
    description: 'Radiant destruction! Massive damage with bonus burn.',
  },
  {
    id: 'galaxy',
    emoji: '🌌',
    name: 'Galaxy',
    rarity: ItemRarity.Legendary,
    type: ItemType.Attack,
    baseAttack: 20,
    baseDefense: 0,
    effects: [],
    description: 'Cosmic power beyond comprehension.',
  },

  // === LEGENDARY DEFENSE ITEMS ===
  {
    id: 'infinity',
    emoji: '♾️',
    name: 'Infinity',
    rarity: ItemRarity.Legendary,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 42,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'heal',
        value: 8,
      },
    ],
    description: 'Endless protection. Heals 8 HP per attack.',
  },

  // === LEGENDARY PASSIVE ITEMS ===
  {
    id: 'guardian_angel',
    emoji: '😇',
    name: 'Guardian Angel',
    rarity: ItemRarity.Legendary,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'preventLifeLoss',
        value: 1,
        breakable: true,
      },
    ],
    description: 'Prevents the next life loss. Breaks after use.',
  },
  {
    id: 'wizard',
    emoji: '🧙',
    name: 'Wizard',
    rarity: ItemRarity.Legendary,
    type: ItemType.Passive,
    baseAttack: 8,
    baseDefense: 21,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'attackMultiply',
        value: 0.25,
      },
      {
        trigger: EffectTrigger.Passive,
        effectType: 'defenseMultiply',
        value: 0.25,
      },
    ],
    description: 'Magical mastery! +25% attack and defense.',
  },
  {
    id: 'rainbow',
    emoji: '🌈',
    name: 'Rainbow',
    rarity: ItemRarity.Legendary,
    type: ItemType.Passive,
    baseAttack: 10,
    baseDefense: 28,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'vampire',
        value: 0.3,
      },
    ],
    description: 'Balanced power with 30% lifesteal.',
  },

  // === ADDITIONAL COMMON ITEMS ===
  {
    id: 'rock',
    emoji: '🪨',
    name: 'Rock',
    rarity: ItemRarity.Common,
    type: ItemType.Attack,
    baseAttack: 3,
    baseDefense: 4,
    effects: [],
    description: 'Simple but effective. Modest attack and defense.',
  },
  {
    id: 'cactus',
    emoji: '🌵',
    name: 'Cactus',
    rarity: ItemRarity.Common,
    type: ItemType.Defense,
    baseAttack: 1,
    baseDefense: 8,
    effects: [
      {
        trigger: EffectTrigger.OnDefend,
        effectType: 'damage',
        value: 1,
      },
    ],
    description: 'Spiky defense that reflects minor damage.',
  },
  {
    id: 'bone',
    emoji: '🦴',
    name: 'Bone',
    rarity: ItemRarity.Common,
    type: ItemType.Attack,
    baseAttack: 4,
    baseDefense: 0,
    effects: [],
    description: 'Ancient weapon of moderate power.',
  },
  {
    id: 'snowflake',
    emoji: '❄️',
    name: 'Snowflake',
    rarity: ItemRarity.Common,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 7,
    effects: [],
    description: 'Cold barrier that slows attacks.',
  },

  // === ADDITIONAL RARE ITEMS ===
  {
    id: 'ninja',
    emoji: '🥷',
    name: 'Ninja',
    rarity: ItemRarity.Rare,
    type: ItemType.Attack,
    baseAttack: 8,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'damage',
        value: 10,
        chance: 0.25,
      },
    ],
    description: 'Swift strikes! 25% chance for critical hit.',
  },
  {
    id: 'ghost',
    emoji: '👻',
    name: 'Ghost',
    rarity: ItemRarity.Rare,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 18,
    effects: [
      {
        trigger: EffectTrigger.OnDefend,
        effectType: 'block',
        value: 21,
        chance: 0.3,
      },
    ],
    description: 'Ethereal form. 30% chance to block extra damage.',
  },
  {
    id: 'robot',
    emoji: '🤖',
    name: 'Robot',
    rarity: ItemRarity.Rare,
    type: ItemType.Passive,
    baseAttack: 5,
    baseDefense: 14,
    effects: [],
    description: 'Mechanical precision. Balanced stats.',
  },
  {
    id: 'alien',
    emoji: '👽',
    name: 'Alien',
    rarity: ItemRarity.Rare,
    type: ItemType.Passive,
    baseAttack: 6,
    baseDefense: 11,
    effects: [],
    description: 'Otherworldly technology.',
  },
  {
    id: 'mushroom',
    emoji: '🍄',
    name: 'Mushroom',
    rarity: ItemRarity.Rare,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'heal',
        value: 3,
      },
    ],
    description: 'Heals 3 HP with each attack.',
  },
  {
    id: 'crystal',
    emoji: '🔮',
    name: 'Crystal Ball',
    rarity: ItemRarity.Rare,
    type: ItemType.Passive,
    baseAttack: 4,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'attackMultiply',
        value: 0.1,
      },
    ],
    description: 'Mystical power boosts attack by 10%.',
  },

  // === ADDITIONAL EPIC ITEMS ===
  {
    id: 'tiger',
    emoji: '🐅',
    name: 'Tiger',
    rarity: ItemRarity.Epic,
    type: ItemType.Attack,
    baseAttack: 12,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'damage',
        value: 15,
        chance: 0.35,
      },
    ],
    description: 'Fierce attacks! 35% chance for massive damage.',
  },
  {
    id: 'lion',
    emoji: '🦁',
    name: 'Lion',
    rarity: ItemRarity.Epic,
    type: ItemType.Attack,
    baseAttack: 13,
    baseDefense: 7,
    effects: [],
    description: 'King of beasts. Raw power.',
  },
  {
    id: 'bear',
    emoji: '🐻',
    name: 'Bear',
    rarity: ItemRarity.Epic,
    type: ItemType.Passive,
    baseAttack: 9,
    baseDefense: 17,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'vampire',
        value: 0.15,
      },
    ],
    description: 'Savage strength with lifesteal.',
  },
  {
    id: 'shark',
    emoji: '🦈',
    name: 'Shark',
    rarity: ItemRarity.Epic,
    type: ItemType.Attack,
    baseAttack: 12,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnHit,
        effectType: 'damage',
        value: 2,
      },
    ],
    description: 'Predatory strikes deal bonus damage when hitting.',
  },
  {
    id: 'octopus',
    emoji: '🐙',
    name: 'Octopus',
    rarity: ItemRarity.Epic,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 25,
    effects: [
      {
        trigger: EffectTrigger.OnDefend,
        effectType: 'reduceOpponentAttack',
        value: 3,
      },
    ],
    description: 'Tentacles weaken enemy attacks.',
  },
  {
    id: 'turtle',
    emoji: '🐢',
    name: 'Turtle',
    rarity: ItemRarity.Epic,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 35,
    effects: [],
    description: 'Impenetrable shell. Maximum defense.',
  },

  // === MORE COMMON ITEMS ===
  {
    id: 'knife',
    emoji: '🔪',
    name: 'Knife',
    rarity: ItemRarity.Common,
    type: ItemType.Attack,
    baseAttack: 3,
    baseDefense: 0,
    effects: [],
    description: 'Sharp and deadly.',
  },
  {
    id: 'wrench',
    emoji: '🔧',
    name: 'Wrench',
    rarity: ItemRarity.Common,
    type: ItemType.Attack,
    baseAttack: 4,
    baseDefense: 3,
    effects: [],
    description: 'Tool of destruction.',
  },
  {
    id: 'scissors',
    emoji: '✂️',
    name: 'Scissors',
    rarity: ItemRarity.Common,
    type: ItemType.Attack,
    baseAttack: 3,
    baseDefense: 0,
    effects: [],
    description: 'Cut through enemies.',
  },
  {
    id: 'magnet',
    emoji: '🧲',
    name: 'Magnet',
    rarity: ItemRarity.Common,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 8,
    effects: [],
    description: 'Attracts and deflects attacks.',
  },
  {
    id: 'lock',
    emoji: '🔒',
    name: 'Lock',
    rarity: ItemRarity.Common,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 10,
    effects: [],
    description: 'Locks down enemy damage.',
  },
  {
    id: 'chain',
    emoji: '⛓️',
    name: 'Chain',
    rarity: ItemRarity.Common,
    type: ItemType.Defense,
    baseAttack: 1,
    baseDefense: 7,
    effects: [],
    description: 'Heavy chains for protection.',
  },

  // === MORE RARE ITEMS ===
  {
    id: 'battery',
    emoji: '🔋',
    name: 'Battery',
    rarity: ItemRarity.Rare,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnTurnStart,
        effectType: 'stack',
        value: 1,
        stackable: true,
        maxStacks: 15,
        currentStacks: 0,
      },
    ],
    description: 'Charges up! Gains +1 attack each turn (max 15).',
  },
  {
    id: 'dice',
    emoji: '🎲',
    name: 'Dice',
    rarity: ItemRarity.Rare,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'damage',
        value: 4,
        chance: 0.5,
      },
      {
        trigger: EffectTrigger.OnDefend,
        effectType: 'block',
        value: 11,
        chance: 0.5,
      },
    ],
    description: 'Roll the dice! 50% chance for bonus attack or defense.',
  },
  {
    id: 'magicwand',
    emoji: '🪄',
    name: 'Magic Wand',
    rarity: ItemRarity.Rare,
    type: ItemType.Attack,
    baseAttack: 7,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'heal',
        value: 2,
      },
    ],
    description: 'Magical attacks that heal 2 HP.',
  },
  {
    id: 'boomerang',
    emoji: '🪃',
    name: 'Boomerang',
    rarity: ItemRarity.Rare,
    type: ItemType.Attack,
    baseAttack: 6,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'damage',
        value: 6,
        chance: 0.5,
      },
    ],
    description: 'Returns for a second strike! 50% chance for double damage.',
  },

  // === MORE EPIC ITEMS ===
  {
    id: 'unicorn',
    emoji: '🦄',
    name: 'Unicorn',
    rarity: ItemRarity.Epic,
    type: ItemType.Passive,
    baseAttack: 8,
    baseDefense: 21,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'heal',
        value: 6,
      },
    ],
    description: 'Heals 6 HP per attack. Balanced stats.',
  },
  {
    id: 'trex',
    emoji: '🦖',
    name: 'T-Rex',
    rarity: ItemRarity.Epic,
    type: ItemType.Attack,
    baseAttack: 14,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'damage',
        value: 3,
      },
    ],
    description: 'Prehistoric power! Devastating attacks.',
  },
  {
    id: 'kraken',
    emoji: '🦑',
    name: 'Kraken',
    rarity: ItemRarity.Epic,
    type: ItemType.Attack,
    baseAttack: 11,
    baseDefense: 11,
    effects: [
      {
        trigger: EffectTrigger.OnHit,
        effectType: 'reduceOpponentAttack',
        value: 4,
      },
    ],
    description: 'Sea monster that weakens foes.',
  },
  {
    id: 'eagle',
    emoji: '🦅',
    name: 'Eagle',
    rarity: ItemRarity.Epic,
    type: ItemType.Attack,
    baseAttack: 10,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'attackMultiply',
        value: 0.2,
      },
    ],
    description: 'Swift strikes! Increases attack damage by 20%.',
  },

  // === MORE LEGENDARY ITEMS ===
  {
    id: 'blackhole',
    emoji: '🕳️',
    name: 'Black Hole',
    rarity: ItemRarity.Legendary,
    type: ItemType.Attack,
    baseAttack: 19,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'damage',
        value: 6,
      },
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'vampire',
        value: 0.2,
      },
    ],
    description: 'Consumes everything! Massive damage with lifesteal.',
  },
  {
    id: 'meteor',
    emoji: '☄️',
    name: 'Meteor',
    rarity: ItemRarity.Legendary,
    type: ItemType.Attack,
    baseAttack: 18,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnBattleStart,
        effectType: 'damage',
        value: 25,
      },
    ],
    description: 'Cataclysmic! 50 instant damage at battle start.',
  },
  {
    id: 'timetravel',
    emoji: '⏰',
    name: 'Time Machine',
    rarity: ItemRarity.Legendary,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnTurnStart,
        effectType: 'stack',
        value: 3,
        stackable: true,
        maxStacks: 30,
        currentStacks: 0,
      },
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'heal',
        value: 4,
      },
    ],
    description: 'Gains +3 attack per turn and heals 4 HP per attack.',
  },
  {
    id: 'godhand',
    emoji: '✨',
    name: 'Divine Touch',
    rarity: ItemRarity.Legendary,
    type: ItemType.Passive,
    baseAttack: 13,
    baseDefense: 35,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'attackMultiply',
        value: 0.3,
      },
      {
        trigger: EffectTrigger.Passive,
        effectType: 'defenseMultiply',
        value: 0.3,
      },
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'vampire',
        value: 0.25,
      },
    ],
    description: 'Ultimate power! +30% stats and lifesteal.',
  },

  // === ADDITIONAL ITEMS TO REACH 90+ ===
  {
    id: 'spider',
    emoji: '🕷️',
    name: 'Spider',
    rarity: ItemRarity.Rare,
    type: ItemType.Attack,
    baseAttack: 7,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnHit,
        effectType: 'damage',
        value: 1,
      },
    ],
    description: 'Venomous bites deal damage over time.',
  },
  {
    id: 'ant',
    emoji: '🐜',
    name: 'Ant Colony',
    rarity: ItemRarity.Common,
    type: ItemType.Attack,
    baseAttack: 2,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnTurnStart,
        effectType: 'stack',
        value: 1,
        stackable: true,
        maxStacks: 10,
        currentStacks: 0,
      },
    ],
    description: 'Small but grows! Gains +1 attack per turn.',
  },
  {
    id: 'bee',
    emoji: '🐝',
    name: 'Bee Swarm',
    rarity: ItemRarity.Rare,
    type: ItemType.Attack,
    baseAttack: 6,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'damage',
        value: 8,
        chance: 0.3,
      },
    ],
    description: 'Buzzing attacks! 30% chance for sting damage.',
  },
  {
    id: 'whale',
    emoji: '🐋',
    name: 'Whale',
    rarity: ItemRarity.Epic,
    type: ItemType.Defense,
    baseAttack: 5,
    baseDefense: 28,
    effects: [],
    description: 'Massive presence. High defense.',
  },
  {
    id: 'elephant',
    emoji: '🐘',
    name: 'Elephant',
    rarity: ItemRarity.Epic,
    type: ItemType.Defense,
    baseAttack: 6,
    baseDefense: 25,
    effects: [],
    description: 'Unstoppable force. Strong and sturdy.',
  },
  {
    id: 'gorilla',
    emoji: '🦍',
    name: 'Gorilla',
    rarity: ItemRarity.Rare,
    type: ItemType.Attack,
    baseAttack: 8,
    baseDefense: 6,
    effects: [],
    description: 'Brute strength. Powerful attacks.',
  },
  {
    id: 'wolf',
    emoji: '🐺',
    name: 'Wolf',
    rarity: ItemRarity.Rare,
    type: ItemType.Attack,
    baseAttack: 7,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'damage',
        value: 2,
      },
    ],
    description: 'Pack hunter. Bonus attack damage.',
  },
  {
    id: 'snake',
    emoji: '🐍',
    name: 'Snake',
    rarity: ItemRarity.Rare,
    type: ItemType.Attack,
    baseAttack: 6,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnHit,
        effectType: 'damage',
        value: 2,
      },
    ],
    description: 'Poisonous fangs deal ongoing damage.',
  },
  {
    id: 'bat',
    emoji: '🦇',
    name: 'Bat',
    rarity: ItemRarity.Rare,
    type: ItemType.Passive,
    baseAttack: 5,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'vampire',
        value: 0.15,
      },
    ],
    description: 'Night hunter. 15% lifesteal.',
  },
  {
    id: 'frog',
    emoji: '🐸',
    name: 'Frog',
    rarity: ItemRarity.Common,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 7,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'heal',
        value: 1,
      },
    ],
    description: 'Heals 1 HP per attack.',
  },
  {
    id: 'penguin',
    emoji: '🐧',
    name: 'Penguin',
    rarity: ItemRarity.Common,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 8,
    effects: [],
    description: 'Waddles into defense.',
  },
  {
    id: 'peacock',
    emoji: '🦚',
    name: 'Peacock',
    rarity: ItemRarity.Epic,
    type: ItemType.Passive,
    baseAttack: 7,
    baseDefense: 20,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'heal',
        value: 4,
      },
    ],
    description: 'Majestic! Balanced stats with healing.',
  },
  {
    id: 'flamingo',
    emoji: '🦩',
    name: 'Flamingo',
    rarity: ItemRarity.Rare,
    type: ItemType.Passive,
    baseAttack: 4,
    baseDefense: 11,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'heal',
        value: 2,
      },
    ],
    description: 'Heals 2 HP per attack.',
  },
  {
    id: 'parrot',
    emoji: '🦜',
    name: 'Parrot',
    rarity: ItemRarity.Rare,
    type: ItemType.Attack,
    baseAttack: 6,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'damage',
        value: 6,
        chance: 0.4,
      },
    ],
    description: 'Mimics attacks! 40% chance for double damage.',
  },
  {
    id: 'butterfly',
    emoji: '🦋',
    name: 'Butterfly',
    rarity: ItemRarity.Common,
    type: ItemType.Passive,
    baseAttack: 2,
    baseDefense: 4,
    effects: [],
    description: 'Delicate but balanced.',
  },
  {
    id: 'ladybug',
    emoji: '🐞',
    name: 'Ladybug',
    rarity: ItemRarity.Common,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'heal',
        value: 1,
      },
    ],
    description: 'Heals 1 HP per attack.',
  },
  {
    id: 'trophy',
    emoji: '🏆',
    name: 'Trophy',
    rarity: ItemRarity.Legendary,
    type: ItemType.Passive,
    baseAttack: 14,
    baseDefense: 39,
    effects: [],
    description: 'Champion\'s prize! Maximum balanced power.',
  },
  {
    id: 'star',
    emoji: '⭐',
    name: 'Star',
    rarity: ItemRarity.Epic,
    type: ItemType.Passive,
    baseAttack: 8,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'attackMultiply',
        value: 0.12,
      },
    ],
    description: 'Shining power! +12% attack.',
  },
  {
    id: 'moon',
    emoji: '🌙',
    name: 'Moon',
    rarity: ItemRarity.Epic,
    type: ItemType.Defense,
    baseAttack: 0,
    baseDefense: 25,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'heal',
        value: 4,
      },
    ],
    description: 'Heals 4 HP per attack.',
  },
  {
    id: 'earth',
    emoji: '🌍',
    name: 'Earth',
    rarity: ItemRarity.Legendary,
    type: ItemType.Defense,
    baseAttack: 8,
    baseDefense: 49,
    effects: [
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'heal',
        value: 7,
      },
    ],
    description: 'Heals 7 HP per attack. Massive defense.',
  },
  {
    id: 'comet',
    emoji: '💫',
    name: 'Comet',
    rarity: ItemRarity.Epic,
    type: ItemType.Attack,
    baseAttack: 12,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'attackMultiply',
        value: 0.15,
      },
    ],
    description: 'Blazing speed! +15% attack damage.',
  },

  // === MONEY ITEMS ===
  {
    id: 'piggybank',
    emoji: '🐷',
    name: 'Piggy Bank',
    rarity: ItemRarity.Common,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'moneyBonus',
        value: 15,
      },
    ],
    description: 'Saves money! +$15 per round.',
  },
  {
    id: 'moneybag',
    emoji: '💰',
    name: 'Money Bag',
    rarity: ItemRarity.Rare,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'moneyBonus',
        value: 30,
      },
    ],
    description: 'Wealth accumulation! +$30 per round.',
  },
  {
    id: 'gem',
    emoji: '💎',
    name: 'Diamond',
    rarity: ItemRarity.Epic,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'moneyBonus',
        value: 50,
      },
    ],
    description: 'Precious gem! +$50 per round.',
  },
  {
    id: 'goldbar',
    emoji: '🏅',
    name: 'Gold Medal',
    rarity: ItemRarity.Epic,
    type: ItemType.Passive,
    baseAttack: 3,
    baseDefense: 7,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'moneyBonus',
        value: 40,
      },
    ],
    description: 'Champion earnings! +$40 per round with minor stats.',
  },
  {
    id: 'crown',
    emoji: '👑',
    name: 'Royal Crown',
    rarity: ItemRarity.Legendary,
    type: ItemType.Passive,
    baseAttack: 5,
    baseDefense: 14,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'moneyBonus',
        value: 75,
      },
    ],
    description: 'Royal wealth! +$75 per round.',
  },
  {
    id: 'coins',
    emoji: '💵',
    name: 'Money Stack',
    rarity: ItemRarity.Rare,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'moneyBonus',
        value: 25,
      },
    ],
    description: 'Cash flow! +$25 per round.',
  },
  {
    id: 'coinjar',
    emoji: '🪙',
    name: 'Coin Jar',
    rarity: ItemRarity.Common,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'moneyBonus',
        value: 20,
      },
    ],
    description: 'Small savings! +$20 per round.',
  },
  {
    id: 'goldcoin',
    emoji: '🥇',
    name: 'Gold Coin',
    rarity: ItemRarity.Rare,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'moneyBonus',
        value: 35,
      },
    ],
    description: 'Golden earnings! +$35 per round.',
  },
  {
    id: 'treasure',
    emoji: '💰',
    name: 'Treasure Chest',
    rarity: ItemRarity.Epic,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'moneyBonus',
        value: 60,
      },
    ],
    description: 'Hidden fortune! +$60 per round.',
  },
  {
    id: 'moneytree',
    emoji: '🌳',
    name: 'Money Tree',
    rarity: ItemRarity.Legendary,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'moneyBonus',
        value: 100,
      },
    ],
    description: 'Grows endless wealth! +$100 per round.',
  },
  {
    id: 'luckycharm',
    emoji: '🍀',
    name: 'Lucky Charm',
    rarity: ItemRarity.Epic,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'moneyMultiplier',
        value: 2, // 2x money multiplier
        breakable: true,
        maxDuration: 3,
        currentDuration: 0,
      },
    ],
    description: 'DOUBLES money for 3 shops, then breaks! Limited time wealth.',
  },

  // === MAX HP ITEMS ===
  // Common HP Items
  {
    id: 'apple',
    emoji: '🍎',
    name: 'Apple',
    rarity: ItemRarity.Common,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'maxHPBonus',
        value: 10,
      },
    ],
    description: 'An apple a day! +10 max HP.',
  },
  {
    id: 'bread',
    emoji: '🍞',
    name: 'Bread',
    rarity: ItemRarity.Common,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'maxHPBonus',
        value: 15,
      },
    ],
    description: 'Staple food. +15 max HP.',
  },
  {
    id: 'cheese',
    emoji: '🧀',
    name: 'Cheese',
    rarity: ItemRarity.Common,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'maxHPBonus',
        value: 12,
      },
    ],
    description: 'Rich in nutrients. +12 max HP.',
  },

  // Rare HP Items
  {
    id: 'pizza',
    emoji: '🍕',
    name: 'Pizza',
    rarity: ItemRarity.Rare,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'maxHPBonus',
        value: 25,
      },
    ],
    description: 'Delicious meal! +25 max HP.',
  },
  {
    id: 'steak',
    emoji: '🥩',
    name: 'Steak',
    rarity: ItemRarity.Rare,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'maxHPBonus',
        value: 30,
      },
    ],
    description: 'Protein power! +30 max HP.',
  },
  {
    id: 'sushi',
    emoji: '🍣',
    name: 'Sushi',
    rarity: ItemRarity.Rare,
    type: ItemType.Passive,
    baseAttack: 2,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'maxHPBonus',
        value: 28,
      },
    ],
    description: 'Fresh and healthy! +28 max HP with minor attack.',
  },
  {
    id: 'cake',
    emoji: '🎂',
    name: 'Cake',
    rarity: ItemRarity.Rare,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'maxHPBonus',
        value: 35,
      },
    ],
    description: 'Sweet celebration! +35 max HP.',
  },

  // Epic HP Items
  {
    id: 'burger',
    emoji: '🍔',
    name: 'Burger',
    rarity: ItemRarity.Epic,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'maxHPBonus',
        value: 45,
      },
    ],
    description: 'Hearty meal! +45 max HP.',
  },
  {
    id: 'ramen',
    emoji: '🍜',
    name: 'Ramen',
    rarity: ItemRarity.Epic,
    type: ItemType.Passive,
    baseAttack: 3,
    baseDefense: 7,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'maxHPBonus',
        value: 40,
      },
    ],
    description: 'Nourishing bowl! +40 max HP with balanced stats.',
  },
  {
    id: 'taco',
    emoji: '🌮',
    name: 'Taco',
    rarity: ItemRarity.Epic,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'maxHPBonus',
        value: 50,
      },
    ],
    description: 'Delicious feast! +50 max HP.',
  },
  {
    id: 'icecream',
    emoji: '🍦',
    name: 'Ice Cream',
    rarity: ItemRarity.Epic,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'maxHPBonus',
        value: 42,
      },
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'heal',
        value: 3,
      },
    ],
    description: '+42 max HP and heals 3 HP per attack.',
  },

  // Legendary HP Items
  {
    id: 'feast',
    emoji: '🍽️',
    name: 'Royal Feast',
    rarity: ItemRarity.Legendary,
    type: ItemType.Passive,
    baseAttack: 5,
    baseDefense: 14,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'maxHPBonus',
        value: 75,
      },
    ],
    description: 'Fit for a king! +75 max HP with balanced stats.',
  },
  {
    id: 'elixir',
    emoji: '🧪',
    name: 'Life Elixir',
    rarity: ItemRarity.Legendary,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 0,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'maxHPBonus',
        value: 100,
      },
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'heal',
        value: 3,
      },
    ],
    description: '+100 max HP and heals 3 HP per attack.',
  },
  {
    id: 'ambrosia',
    emoji: '🍯',
    name: 'Ambrosia',
    rarity: ItemRarity.Legendary,
    type: ItemType.Passive,
    baseAttack: 0,
    baseDefense: 21,
    effects: [
      {
        trigger: EffectTrigger.Passive,
        effectType: 'maxHPBonus',
        value: 80,
      },
      {
        trigger: EffectTrigger.OnAttack,
        effectType: 'heal',
        value: 5,
      },
    ],
    description: 'Food of the gods! +80 max HP, +21 defense, and heals 5 HP on attack.',
  },
];

// Export the database
export class ItemDatabase {
  private static items: Item[] | null = null;

  static getAllItems(): Item[] {
    if (!this.items) {
      this.items = this.initializeItems();
    }
    return [...this.items];
  }

  static getItemById(id: string): Item | undefined {
    return this.getAllItems().find((item) => item.id === id);
  }

  static getItemsByRarity(rarity: ItemRarity): Item[] {
    return this.getAllItems().filter((item) => item.rarity === rarity);
  }

  static getItemsByType(type: ItemType): Item[] {
    return this.getAllItems().filter((item) => item.type === type);
  }

  static getRandomItems(count: number, excludeIds: string[] = []): Item[] {
    const available = this.getAllItems().filter((item) => !excludeIds.includes(item.id));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  private static initializeItems(): Item[] {
    // Import ItemBalance here to avoid circular dependency
    const items = CORE_ITEMS.map((item) => ({
      ...item,
      price: this.calculatePrice(item),
      canSell: true,
    }));

    console.log(`✅ ItemDatabase initialized with ${items.length} items`);
    return items;
  }

  private static calculatePrice(item: Omit<Item, 'price' | 'canSell'>): number {
    // Base price calculation
    let value = item.baseAttack * 3 + item.baseDefense * 3;

    // Add value for effects
    for (const effect of item.effects) {
      switch (effect.effectType) {
        case 'damage':
          value += effect.value * 5 * (effect.chance || 1);
          break;
        case 'block':
          value += effect.value * 5 * (effect.chance || 1);
          break;
        case 'heal':
          value += effect.value * 6;
          break;
        case 'vampire':
          value += effect.value * 100;
          break;
        case 'attackMultiply':
        case 'defenseMultiply':
          value += effect.value * 200;
          break;
        case 'stack':
          value += effect.value * (effect.maxStacks || 10) * 2;
          break;
        case 'tempPower':
          value += effect.value * (effect.duration || 5) * 2;
          break;
        case 'preventLifeLoss':
          value += 500;
          break;
        case 'reduceOpponentAttack':
          value += effect.value * 10;
          break;
        case 'speedBoost':
          value += effect.value * 100;
          break;
        case 'moneyBonus':
          value += effect.value * 3; // Money items are priced at 3x their per-round value
          break;
        case 'moneyMultiplier':
          // Multiplier is very powerful, price based on expected bonus
          // 2x multiplier for 3 rounds = 300 extra gold (assuming 100/round base)
          value += (effect.value - 1) * 100 * (effect.maxDuration || 3) * 4;
          break;
        case 'maxHPBonus':
          value += effect.value * 8; // Max HP is valuable, price at 8x the HP value
          break;
      }
    }

    // Rarity multiplier
    const rarityMultiplier = {
      [ItemRarity.Common]: 1,
      [ItemRarity.Rare]: 1.5,
      [ItemRarity.Epic]: 2.5,
      [ItemRarity.Legendary]: 4,
    };

    return Math.round(value * rarityMultiplier[item.rarity]);
  }
}

// Quick stats
export function getItemDatabaseStats() {
  const items = ItemDatabase.getAllItems();
  const byRarity = {
    common: items.filter((i) => i.rarity === ItemRarity.Common).length,
    rare: items.filter((i) => i.rarity === ItemRarity.Rare).length,
    epic: items.filter((i) => i.rarity === ItemRarity.Epic).length,
    legendary: items.filter((i) => i.rarity === ItemRarity.Legendary).length,
  };
  const byType = {
    attack: items.filter((i) => i.type === ItemType.Attack).length,
    defense: items.filter((i) => i.type === ItemType.Defense).length,
    passive: items.filter((i) => i.type === ItemType.Passive).length,
  };

  return {
    total: items.length,
    byRarity,
    byType,
  };
}
