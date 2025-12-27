import { BattleEvent, BattleEventDetail } from '@core/types/Battle';
import { DamageResult } from './DamageCalculator';

export class BattleLogger {
  /**
   * Create an attack event with detailed breakdown
   */
  static createAttackEvent(
    turn: number,
    attacker: 'player' | 'opponent',
    damageResult: DamageResult,
    playerHP: number,
    opponentHP: number
  ): BattleEvent {
    const details: BattleEventDetail[] = [];

    // Add base damage
    details.push({
      rawDamage: damageResult.breakdown.baseDamage,
      effectDescription: 'Base Attack',
    });

    // Add item damages (base attack from items)
    for (const itemDamage of damageResult.breakdown.itemDamages) {
      details.push({
        itemId: itemDamage.itemId,
        itemName: itemDamage.itemName,
        itemEmoji: itemDamage.itemEmoji,
        rawDamage: itemDamage.damage,
        effectDescription: 'Item Attack',
      });
    }

    // Add effect damages (special effects)
    for (const effectDamage of damageResult.breakdown.effectDamages) {
      details.push({
        itemId: effectDamage.itemId,
        itemName: effectDamage.itemName,
        itemEmoji: effectDamage.itemEmoji,
        rawDamage: effectDamage.damage,
        effectDescription: 'Effect Damage',
      });
    }

    // Add block breakdown
    if (damageResult.blockAmount > 0) {
      details.push({
        blockAmount: damageResult.blockBreakdown.baseBlock,
        blockPercent: damageResult.blockPercent,
        effectDescription: 'Base Defense',
      });

      for (const itemBlock of damageResult.blockBreakdown.itemBlocks) {
        details.push({
          itemId: itemBlock.itemId,
          itemName: itemBlock.itemName,
          itemEmoji: itemBlock.itemEmoji,
          blockAmount: itemBlock.block,
          effectDescription: 'Item/Effect Block',
        });
      }
    }

    // Final damage detail
    details.push({
      finalDamage: damageResult.finalDamage,
      effectDescription: 'Final Damage',
    });

    const message = this.createAttackMessage(
      attacker,
      damageResult.rawDamage,
      damageResult.blockPercent,
      damageResult.finalDamage
    );

    return {
      turn,
      attacker,
      type: 'attack',
      details,
      currentPlayerHP: playerHP,
      currentOpponentHP: opponentHP,
      message,
    };
  }

  /**
   * Create a turn start event
   */
  static createTurnStartEvent(turn: number): BattleEvent {
    return {
      turn,
      attacker: 'player',
      type: 'turnStart',
      details: [],
      message: `--- Turn ${Math.floor(turn / 2) + 1} ---`,
    };
  }

  /**
   * Create a speed increase event
   */
  static createSpeedIncreaseEvent(
    turn: number,
    attacker: 'player' | 'opponent',
    newMultiplier: number
  ): BattleEvent {
    return {
      turn,
      attacker,
      type: 'speedIncrease',
      details: [
        {
          effectDescription: `Speed increased to ${Math.round(newMultiplier * 100)}%`,
        },
      ],
      message: `⚡ Speed increased! Attacks now deal ${Math.round(newMultiplier * 100)}% damage!`,
    };
  }

  /**
   * Create a damage multiplier event
   */
  static createDamageMultiplierEvent(
    turn: number,
    attacker: 'player' | 'opponent',
    newMultiplier: number
  ): BattleEvent {
    return {
      turn,
      attacker,
      type: 'damageMultiplier',
      details: [
        {
          effectDescription: `Damage multiplier: ${Math.round(newMultiplier * 100)}%`,
        },
      ],
      message: `💥 Battle intensifies! Damage multiplier increased to ${Math.round(newMultiplier * 100)}%!`,
    };
  }

  /**
   * Create attack message
   */
  private static createAttackMessage(
    attacker: 'player' | 'opponent',
    rawDamage: number,
    blockPercent: number,
    finalDamage: number
  ): string {
    const attackerName = attacker === 'player' ? 'You' : 'Opponent';
    const defenderName = attacker === 'player' ? 'Opponent' : 'You';

    if (blockPercent > 0) {
      return `${attackerName} attack for ${rawDamage} damage. ${defenderName} block ${Math.round(blockPercent * 100)}% (${finalDamage} damage dealt).`;
    } else {
      return `${attackerName} attack for ${finalDamage} damage!`;
    }
  }

  /**
   * Format battle log for display
   */
  static formatBattleLog(events: BattleEvent[]): string {
    return events.map((event) => this.formatEvent(event)).join('\n');
  }

  /**
   * Format a single event
   */
  static formatEvent(event: BattleEvent): string {
    let output = `[Turn ${event.turn}] ${event.message}`;

    if (event.details.length > 0) {
      for (const detail of event.details) {
        if (detail.itemName) {
          output += `\n  ${detail.itemEmoji} ${detail.itemName}`;

          if (detail.rawDamage) {
            output += `: +${detail.rawDamage} dmg`;
          }
          if (detail.blockAmount) {
            output += `: +${detail.blockAmount} block`;
          }
          if (detail.healAmount) {
            output += `: +${detail.healAmount} heal`;
          }
          if (detail.effectDescription) {
            output += ` (${detail.effectDescription})`;
          }
        }
      }
    }

    if (event.currentPlayerHP !== undefined) {
      output += `\n  Player HP: ${event.currentPlayerHP}`;
    }
    if (event.currentOpponentHP !== undefined) {
      output += `\n  Opponent HP: ${event.currentOpponentHP}`;
    }

    return output;
  }
}
