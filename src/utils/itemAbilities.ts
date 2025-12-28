import { Item, EffectType } from '@core/types/Item';

/**
 * Mapping of effect types to their emoji representations
 */
const EFFECT_EMOJIS: Record<EffectType, string> = {
  damage: '⚔️',
  block: '🛡️',
  heal: '💚',
  vampire: '🧛',
  attackMultiply: '💪',
  defenseMultiply: '🛡️',
  speedBoost: '⚡',
  tempPower: '⏰',
  stack: '📈',
  luck: '🍀',
  preventLifeLoss: '👼',
  reduceOpponentAttack: '🔻',
  moneyBonus: '💰',
  moneyMultiplier: '💎',
  maxHPBonus: '❤️',
};

/**
 * Get unique ability emojis for an item
 * Returns a string of emojis representing the item's special abilities
 */
export function getItemAbilityEmojis(item: Item): string {
  const abilityEmojis = new Set<string>();

  for (const effect of item.effects) {
    // Skip basic passive effects that are just stat boosts
    if (effect.trigger === 'passive' &&
        (effect.effectType === 'damage' || effect.effectType === 'block')) {
      continue;
    }

    // Add emoji for this effect type
    const emoji = EFFECT_EMOJIS[effect.effectType];
    if (emoji) {
      abilityEmojis.add(emoji);
    }
  }

  return Array.from(abilityEmojis).join('');
}

/**
 * Get item name with ability emoji prefixes
 */
export function getItemNameWithAbilities(item: Item): string {
  const abilityEmojis = getItemAbilityEmojis(item);
  return abilityEmojis ? `${abilityEmojis} ${item.name}` : item.name;
}
