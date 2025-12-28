import { Player } from '@core/types/Player';
import { Item, EffectTrigger, ItemEffect } from '@core/types/Item';
import { BattleEvent } from '@core/types/Battle';
import { DamageCalculator } from './DamageCalculator';

export interface EffectApplicationResult {
  events: BattleEvent[];
  preventLifeLoss?: boolean;
}

export class ItemEffects {
  /**
   * Apply all effects for a specific trigger
   */
  static applyEffects(
    trigger: EffectTrigger,
    player: Player,
    opponent: Player,
    turn: number,
    damageDealt?: number
  ): EffectApplicationResult {
    const events: BattleEvent[] = [];
    let preventLifeLoss = false;

    for (const item of player.items) {
      // Skip broken items
      if (item.effects.some((e) => e.isBroken)) continue;

      for (const effect of item.effects) {
        if (effect.trigger !== trigger) continue;

        // Apply the effect based on type
        const result = this.applyEffect(effect, item, player, opponent, turn, damageDealt);

        if (result.events.length > 0) {
          events.push(...result.events);
        }

        if (result.preventLifeLoss) {
          preventLifeLoss = true;
        }
      }
    }

    return { events, preventLifeLoss };
  }

  /**
   * Apply a single effect
   */
  private static applyEffect(
    effect: ItemEffect,
    item: Item,
    player: Player,
    _opponent: Player,
    turn: number,
    damageDealt?: number
  ): EffectApplicationResult {
    const events: BattleEvent[] = [];
    const isPlayer = !player.isAI;
    const attacker = isPlayer ? 'player' : 'opponent';

    switch (effect.effectType) {
      case 'heal': {
        const healAmount = DamageCalculator.calculateHeal(player, effect);
        const actualHeal = DamageCalculator.applyHeal(player, healAmount);

        // Always show heal attempts, even if they heal 0 HP (when at max HP)
        events.push({
          turn,
          attacker,
          type: 'heal',
          details: [
            {
              itemId: item.id,
              itemName: item.name,
              itemEmoji: item.emoji,
              healAmount: actualHeal,
              healer: attacker, // Track who is healing
              effectDescription: actualHeal === 0 ? '(at max HP)' : undefined,
            },
          ],
          currentPlayerHP: isPlayer ? player.stats.currentHP : undefined,
          currentOpponentHP: !isPlayer ? player.stats.currentHP : undefined,
          message: actualHeal > 0
            ? `${item.emoji} ${item.name} heals for ${actualHeal} HP!`
            : `${item.emoji} ${item.name} heal blocked (at max HP)`,
        });
        break;
      }

      case 'vampire': {
        if (damageDealt && damageDealt > 0) {
          const healAmount = DamageCalculator.calculateHeal(player, effect, damageDealt);
          const actualHeal = DamageCalculator.applyHeal(player, healAmount);

          // Always show vampire heal attempts, even if they heal 0 HP (when at max HP)
          events.push({
            turn,
            attacker,
            type: 'heal',
            details: [
              {
                itemId: item.id,
                itemName: item.name,
                itemEmoji: item.emoji,
                healAmount: actualHeal,
                healer: attacker, // Track who is healing
                effectDescription:
                  actualHeal === 0
                    ? `Vampire (${Math.round(effect.value * 100)}%) - at max HP`
                    : `Vampire (${Math.round(effect.value * 100)}%)`,
              },
            ],
            currentPlayerHP: isPlayer ? player.stats.currentHP : undefined,
            currentOpponentHP: !isPlayer ? player.stats.currentHP : undefined,
            message:
              actualHeal > 0
                ? `${item.emoji} ${item.name} drains ${actualHeal} HP!`
                : `${item.emoji} ${item.name} vampire heal blocked (at max HP)`,
          });
        }
        break;
      }

      case 'stack': {
        if (effect.stackable) {
          const currentStacks = effect.currentStacks || 0;
          const maxStacks = effect.maxStacks || 10;

          if (currentStacks < maxStacks) {
            effect.currentStacks = currentStacks + 1;

            events.push({
              turn,
              attacker,
              type: 'effect',
              details: [
                {
                  itemId: item.id,
                  itemName: item.name,
                  itemEmoji: item.emoji,
                  effectDescription: `Stack +${effect.value} (${effect.currentStacks}/${maxStacks})`,
                },
              ],
              message: `${item.emoji} ${item.name} gains a stack! (${effect.currentStacks}/${maxStacks})`,
            });
          }
        }
        break;
      }

      case 'tempPower': {
        if (effect.duration !== undefined && effect.duration > 0) {
          effect.duration--;

          if (effect.duration === 0 && effect.breakable) {
            // Mark item as broken
            effect.isBroken = true;
            item.canSell = false;

            events.push({
              turn,
              attacker,
              type: 'effect',
              details: [
                {
                  itemId: item.id,
                  itemName: item.name,
                  itemEmoji: item.emoji,
                  effectDescription: 'Temporary power expired',
                },
              ],
              message: `${item.emoji} ${item.name} power fades away!`,
            });
          }
        }
        break;
      }

      case 'reduceOpponentAttack': {
        // This is applied during damage calculation
        break;
      }

      case 'preventLifeLoss': {
        if (!effect.isBroken) {
          // Mark effect as used
          effect.isBroken = true;
          item.canSell = false;

          events.push({
            turn,
            attacker,
            type: 'effect',
            details: [
              {
                itemId: item.id,
                itemName: item.name,
                itemEmoji: item.emoji,
                effectDescription: 'Life saved!',
              },
            ],
            message: `${item.emoji} ${item.name} prevents life loss!`,
          });

          return { events, preventLifeLoss: true };
        }
        break;
      }

      // Passive effects like attackMultiply, defenseMultiply, speedBoost are handled in DamageCalculator
      case 'attackMultiply':
      case 'defenseMultiply':
      case 'speedBoost':
        break;

      // Damage and block effects are handled in DamageCalculator
      case 'damage':
      case 'block':
        break;
    }

    return { events };
  }

  /**
   * Update breakable items duration at end of battle
   */
  static updateBreakableItems(player: Player): void {
    for (const item of player.items) {
      for (const effect of item.effects) {
        if (effect.breakable && effect.maxDuration !== undefined) {
          effect.currentDuration = (effect.currentDuration || 0) + 1;

          if (effect.currentDuration >= effect.maxDuration) {
            effect.isBroken = true;
            item.canSell = false;
          }
        }
      }
    }
  }

  /**
   * Reset temporary effect states for a new battle
   */
  static resetBattleEffects(player: Player): void {
    for (const item of player.items) {
      for (const effect of item.effects) {
        // Reset stacks
        if (effect.stackable) {
          effect.currentStacks = 0;
        }

        // Reset temporary power duration
        if (effect.effectType === 'tempPower' && effect.maxDuration !== undefined) {
          // Duration is reset per battle, not per round
          if (effect.trigger === EffectTrigger.OnBattleStart) {
            effect.duration = effect.value; // Reset duration
          }
        }
      }
    }
  }

  /**
   * Check if player has a life prevention item
   */
  static hasLifePreventionItem(player: Player): boolean {
    for (const item of player.items) {
      for (const effect of item.effects) {
        if (effect.effectType === 'preventLifeLoss' && !effect.isBroken) {
          return true;
        }
      }
    }
    return false;
  }
}
