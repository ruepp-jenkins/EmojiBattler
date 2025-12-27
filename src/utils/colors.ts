import { ItemRarity, EffectType, Item } from '@core/types/Item';
import { GAME_CONSTANTS } from './constants';

export function getRarityColor(rarity: ItemRarity): string {
  return GAME_CONSTANTS.RARITY_COLORS[rarity];
}

export function getStatColor(statType: 'attack' | 'defense' | 'heal' | 'speed' | 'money'): string {
  return GAME_CONSTANTS.STAT_COLORS[statType];
}

export function getRarityTextClass(rarity: ItemRarity): string {
  const colorMap = {
    common: 'text-white',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-red-400',
  };
  return colorMap[rarity];
}

export function getRarityBorderClass(rarity: ItemRarity): string {
  const colorMap = {
    common: 'border-white',
    rare: 'border-blue-400',
    epic: 'border-purple-400',
    legendary: 'border-red-400',
  };
  return colorMap[rarity];
}

export function getRarityBgClass(rarity: ItemRarity): string {
  const colorMap = {
    common: 'bg-gray-700',
    rare: 'bg-blue-900/30',
    epic: 'bg-purple-900/30',
    legendary: 'bg-red-900/30',
  };
  return colorMap[rarity];
}

/**
 * Get text color class for an effect type
 */
export function getEffectTypeTextClass(effectType: EffectType): string {
  const colorMap: Record<EffectType, string> = {
    damage: 'text-red-400',
    block: 'text-blue-400',
    heal: 'text-green-400',
    vampire: 'text-pink-400',
    attackMultiply: 'text-orange-400',
    defenseMultiply: 'text-cyan-400',
    speedBoost: 'text-yellow-400',
    tempPower: 'text-purple-400',
    stack: 'text-amber-400',
    luck: 'text-emerald-400',
    preventLifeLoss: 'text-rose-400',
    reduceOpponentAttack: 'text-indigo-400',
    moneyBonus: 'text-yellow-300',
    moneyMultiplier: 'text-yellow-200',
  };
  return colorMap[effectType];
}

/**
 * Determine the primary effect type of an item for color-coding
 */
export function getPrimaryEffectType(item: Item): EffectType | null {
  // Priority order for determining primary effect
  const priorityOrder: EffectType[] = [
    'moneyMultiplier',   // Money multiplier (temporary)
    'moneyBonus',        // Money items are always yellow
    'preventLifeLoss',   // Life save is critical
    'damage',            // Attack items
    'attackMultiply',
    'stack',
    'vampire',
    'block',             // Defense items
    'defenseMultiply',
    'heal',
    'speedBoost',
    'tempPower',
    'luck',
    'reduceOpponentAttack',
  ];

  // Find first matching effect in priority order
  for (const effectType of priorityOrder) {
    const hasEffect = item.effects.some(e => e.effectType === effectType);
    if (hasEffect) {
      return effectType;
    }
  }

  // Fallback to base stats if no effects
  if (item.baseAttack > item.baseDefense) {
    return 'damage';
  } else if (item.baseDefense > item.baseAttack) {
    return 'block';
  }

  return null;
}

/**
 * Get the color class for an item's name based on its primary effect
 */
export function getItemNameColorClass(item: Item): string {
  const primaryEffect = getPrimaryEffectType(item);
  if (primaryEffect) {
    return getEffectTypeTextClass(primaryEffect);
  }
  // Fallback to rarity color
  return getRarityTextClass(item.rarity);
}
