import { Player, PlayerCalculatedStats } from '@core/types/Player';
import { EffectTrigger } from '@core/types/Item';
import { GAME_CONSTANTS } from '@utils/constants';

export interface DamageResult {
  rawDamage: number;
  blockAmount: number;
  blockPercent: number;
  finalDamage: number;
  breakdown: {
    baseDamage: number;
    itemDamages: { itemId: string; itemName: string; itemEmoji: string; damage: number }[];
    multipliers: number;
    effectDamages: { itemId: string; itemName: string; itemEmoji: string; damage: number }[];
  };
  blockBreakdown: {
    baseBlock: number;
    itemBlocks: { itemId: string; itemName: string; itemEmoji: string; block: number }[];
    multipliers: number;
  };
}

export class DamageCalculator {
  /**
   * Calculate the stats for a player including all bonuses
   */
  static calculatePlayerStats(player: Player): PlayerCalculatedStats {
    const { stats, items } = player;

    // Base stats
    let totalAttack = stats.baseAttack;
    let totalDefense = stats.baseDefense;
    let attackMultiplier = 1.0;
    let defenseMultiplier = 1.0;

    // Add item base stats
    for (const item of items) {
      totalAttack += item.baseAttack;
      totalDefense += item.baseDefense;

      // Check for multiplier effects
      for (const effect of item.effects) {
        if (effect.trigger === EffectTrigger.Passive) {
          if (effect.effectType === 'attackMultiply') {
            attackMultiplier += effect.value;
          } else if (effect.effectType === 'defenseMultiply') {
            defenseMultiplier += effect.value;
          }
        }

        // Add stacked attack
        if (effect.effectType === 'stack' && effect.currentStacks) {
          totalAttack += effect.currentStacks * effect.value;
        }
      }
    }

    // Apply multipliers
    totalAttack = Math.round(totalAttack * attackMultiplier);
    totalDefense = Math.round(totalDefense * defenseMultiplier);

    // Calculate defense percent (capped at 90%)
    const defensePercent = Math.min(totalDefense / 100, GAME_CONSTANTS.MAX_DEFENSE_PERCENT);

    return {
      totalAttack,
      totalDefense,
      defensePercent,
      attackMultiplier,
      defenseMultiplier,
      breakdown: {
        base: {
          attack: stats.baseAttack,
          defense: stats.baseDefense,
        },
        skills: {
          attack: 0, // TODO: Add skill bonuses
          defense: 0,
        },
        items: {
          attack: totalAttack - stats.baseAttack,
          defense: totalDefense - stats.baseDefense,
        },
      },
    };
  }

  /**
   * Calculate damage dealt by attacker to defender
   */
  static calculateDamage(
    attacker: Player,
    defender: Player,
    speedMultiplier: number = 1,
    damageMultiplier: number = 1
  ): DamageResult {
    // Calculate raw damage
    const baseDamage = Math.round(attacker.stats.baseAttack * speedMultiplier);
    const itemDamages: { itemId: string; itemName: string; itemEmoji: string; damage: number }[] = [];
    const effectDamages: { itemId: string; itemName: string; itemEmoji: string; damage: number }[] = [];

    let rawDamage = baseDamage;

    // Track base damage from each item
    for (const item of attacker.items) {
      if (item.baseAttack > 0) {
        const itemAttack = Math.round(item.baseAttack * speedMultiplier);
        rawDamage += itemAttack;
        itemDamages.push({
          itemId: item.id,
          itemName: item.name,
          itemEmoji: item.emoji,
          damage: itemAttack,
        });
      }
    }

    // Add damage from OnAttack effects
    for (const item of attacker.items) {
      for (const effect of item.effects) {
        if (effect.trigger === EffectTrigger.OnAttack && effect.effectType === 'damage') {
          const effectDamage = this.calculateEffectDamage(effect);
          if (effectDamage > 0) {
            rawDamage += effectDamage;
            effectDamages.push({
              itemId: item.id,
              itemName: item.name,
              itemEmoji: item.emoji,
              damage: effectDamage,
            });
          }
        }

        // Add temporary power effects
        if (effect.effectType === 'tempPower' && effect.duration && effect.duration > 0) {
          rawDamage += effect.value;
          effectDamages.push({
            itemId: item.id,
            itemName: item.name,
            itemEmoji: item.emoji,
            damage: effect.value,
          });
        }

        // Add stacking damage
        if (effect.effectType === 'stack' && effect.currentStacks && effect.currentStacks > 0) {
          const stackDamage = effect.currentStacks * effect.value;
          rawDamage += stackDamage;
          effectDamages.push({
            itemId: item.id,
            itemName: item.name,
            itemEmoji: item.emoji,
            damage: stackDamage,
          });
        }
      }
    }

    // Apply damage multiplier (for late game scaling)
    rawDamage = Math.round(rawDamage * damageMultiplier);

    // Calculate defender's block
    const defenderStats = this.calculatePlayerStats(defender);
    const baseBlock = defender.stats.baseDefense;
    const itemBlocks: { itemId: string; itemName: string; itemEmoji: string; block: number }[] = [];

    let blockAmount = baseBlock;

    // Track base defense from each item
    for (const item of defender.items) {
      if (item.baseDefense > 0) {
        blockAmount += item.baseDefense;
        itemBlocks.push({
          itemId: item.id,
          itemName: item.name,
          itemEmoji: item.emoji,
          block: item.baseDefense,
        });
      }
    }

    // Add block from OnDefend effects
    for (const item of defender.items) {
      for (const effect of item.effects) {
        if (effect.trigger === EffectTrigger.OnDefend && effect.effectType === 'block') {
          const effectBlock = this.calculateEffectDamage(effect);
          if (effectBlock > 0) {
            blockAmount += effectBlock;
            itemBlocks.push({
              itemId: item.id,
              itemName: item.name,
              itemEmoji: item.emoji,
              block: effectBlock,
            });
          }
        }
      }
    }

    // Calculate block percent (capped at 90%)
    const blockPercent = Math.min(blockAmount / 100, GAME_CONSTANTS.MAX_DEFENSE_PERCENT);

    // Calculate final damage
    const blockedDamage = Math.round(rawDamage * blockPercent);
    const finalDamage = Math.max(1, rawDamage - blockedDamage); // Always deal at least 1 damage

    return {
      rawDamage,
      blockAmount,
      blockPercent,
      finalDamage,
      breakdown: {
        baseDamage,
        itemDamages,
        multipliers: damageMultiplier,
        effectDamages,
      },
      blockBreakdown: {
        baseBlock,
        itemBlocks,
        multipliers: defenderStats.defenseMultiplier,
      },
    };
  }

  /**
   * Calculate damage from an effect (handles luck-based effects)
   */
  private static calculateEffectDamage(effect: any): number {
    if (effect.chance !== undefined) {
      // Luck-based effect
      if (Math.random() < effect.chance) {
        return effect.value;
      }
      return 0;
    }
    return effect.value;
  }

  /**
   * Calculate heal amount for an item effect
   */
  static calculateHeal(_player: Player, effect: any, damageDealt?: number): number {
    if (effect.effectType === 'heal') {
      return effect.value;
    } else if (effect.effectType === 'vampire' && damageDealt) {
      return Math.round(damageDealt * effect.value);
    }
    return 0;
  }

  /**
   * Apply heal to player (capped at maxHP)
   */
  static applyHeal(player: Player, healAmount: number): number {
    const newHP = Math.min(player.stats.maxHP, player.stats.currentHP + healAmount);
    const actualHeal = newHP - player.stats.currentHP;
    player.stats.currentHP = newHP;
    return actualHeal;
  }

  /**
   * Apply damage to player
   */
  static applyDamage(player: Player, damage: number): void {
    player.stats.currentHP = Math.max(0, player.stats.currentHP - damage);
  }

  /**
   * Calculate speed multiplier based on attack count
   */
  static calculateSpeedMultiplier(attackCount: number): number {
    const intervals = Math.floor(attackCount / GAME_CONSTANTS.SPEED_INCREASE_INTERVAL);
    return 1 + intervals * GAME_CONSTANTS.SPEED_INCREASE_VALUE;
  }

  /**
   * Calculate damage multiplier for late game scaling
   */
  static calculateDamageMultiplier(turn: number): number {
    if (turn < GAME_CONSTANTS.DAMAGE_MULTIPLIER_START) {
      return 1;
    }
    const rounds = Math.floor((turn - GAME_CONSTANTS.DAMAGE_MULTIPLIER_START) / 2); // One round = 2 attacks
    return 1 + rounds * GAME_CONSTANTS.DAMAGE_MULTIPLIER_VALUE;
  }
}
