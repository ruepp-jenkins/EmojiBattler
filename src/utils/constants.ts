export const GAME_CONSTANTS = {
  // Game progression
  MAX_ROUNDS: 15,
  MAX_ITEMS: 15,
  MAX_LIVES: 5,

  // Battle mechanics
  MAX_BATTLE_TURNS: 75,
  MAX_DEFENSE_PERCENT: 0.9,
  SPEED_INCREASE_INTERVAL: 5,
  SPEED_INCREASE_VALUE: 0.1, // 10% speed increase
  DAMAGE_MULTIPLIER_START: 20,
  DAMAGE_MULTIPLIER_VALUE: 0.2, // 20% per round after turn 20

  // Player starting stats
  STARTING_HP: 100,
  STARTING_MONEY: 200,
  STARTING_ATTACK: 10,
  STARTING_DEFENSE: 5,
  MONEY_PER_ROUND: 100,

  // Shop
  SHOP_SIZE: 9, // 3x3 grid

  // Rarity colors
  RARITY_COLORS: {
    common: '#FFFFFF',
    rare: '#3B82F6',
    epic: '#A855F7',
    legendary: '#EF4444',
  },

  // Stat colors
  STAT_COLORS: {
    attack: '#EF4444',
    defense: '#3B82F6',
    heal: '#22C55E',
    speed: '#FACC15',
    money: '#F59E0B',
  },

  // Rarity distribution for item generation
  RARITY_DISTRIBUTION: {
    common: 0.5,
    rare: 0.3,
    epic: 0.15,
    legendary: 0.05,
  },

  // Save version for migration
  SAVE_VERSION: '1.0.0',
} as const;

export const LOCAL_STORAGE_KEYS = {
  SAVE_GAME: 'emojy-battler-save',
  PERSISTENT_DATA: 'emojy-battler-persistent',
} as const;
