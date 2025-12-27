export enum ItemRarity {
  Common = 'common',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
}

export enum ItemType {
  Attack = 'attack',
  Defense = 'defense',
  Passive = 'passive',
}

export enum EffectTrigger {
  OnAttack = 'onAttack',
  OnDefend = 'onDefend',
  OnHit = 'onHit',
  OnBlock = 'onBlock',
  OnTurnStart = 'onTurnStart',
  OnTurnEnd = 'onTurnEnd',
  OnBattleStart = 'onBattleStart',
  OnBattleEnd = 'onBattleEnd',
  Passive = 'passive',
}

export type EffectType =
  | 'damage'
  | 'block'
  | 'heal'
  | 'vampire'
  | 'attackMultiply'
  | 'defenseMultiply'
  | 'speedBoost'
  | 'tempPower'
  | 'stack'
  | 'luck'
  | 'preventLifeLoss'
  | 'reduceOpponentAttack'
  | 'moneyBonus' // Passive bonus money per round
  | 'moneyMultiplier'; // Multiplies money earned (with duration and breakable)

export interface ItemEffect {
  trigger: EffectTrigger;
  effectType: EffectType;
  value: number;
  duration?: number; // For temporary effects (in turns)
  chance?: number; // For luck-based effects (0-1)
  stackable?: boolean;
  currentStacks?: number;
  maxStacks?: number;
  breakable?: boolean; // Item breaks after use
  isBroken?: boolean;
  maxDuration?: number; // Max rounds item can last (for breakable power items)
  currentDuration?: number; // Current round count
}

export interface Item {
  id: string;
  emoji: string;
  name: string;
  rarity: ItemRarity;
  type: ItemType;
  baseAttack: number;
  baseDefense: number;
  effects: ItemEffect[];
  price: number;
  description: string; // Human-readable description for tooltip
  canSell: boolean; // False for used breakable items
}
