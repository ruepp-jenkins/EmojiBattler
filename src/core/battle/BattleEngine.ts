import { Player } from '@core/types/Player';
import { BattleState } from '@core/types/Battle';
import { EffectTrigger } from '@core/types/Item';
import { GAME_CONSTANTS } from '@utils/constants';
import { DamageCalculator } from './DamageCalculator';
import { ItemEffects, EffectApplicationResult } from './ItemEffects';
import { BattleLogger } from './BattleLogger';

export class BattleEngine {
  /**
   * Execute a complete battle between player and opponent
   */
  static executeBattle(player: Player, opponent: Player, round: number): BattleState {
    // Deep clone players to avoid mutating original state
    const battlePlayer = this.clonePlayer(player);
    const battleOpponent = this.clonePlayer(opponent);

    // Initialize battle state
    const battle: BattleState = {
      round,
      turn: 0,
      player: battlePlayer,
      opponent: battleOpponent,
      events: [],
      isComplete: false,
      playerHPHistory: [battlePlayer.stats.currentHP],
      opponentHPHistory: [battleOpponent.stats.currentHP],
      speedMultiplier: 1,
      damageMultiplier: 1,
    };

    // Reset battle-specific effects
    ItemEffects.resetBattleEffects(battlePlayer);
    ItemEffects.resetBattleEffects(battleOpponent);

    // Apply OnBattleStart effects
    this.applyBattleStartEffects(battle);

    // Main battle loop - each attack is a separate turn
    while (battle.turn < GAME_CONSTANTS.MAX_BATTLE_TURNS && !battle.isComplete) {
      const isPlayerTurn = battle.turn % 2 === 0; // Even turns = player, odd turns = opponent

      // Turn start event
      battle.events.push(BattleLogger.createTurnStartEvent(battle.turn));

      // Apply OnTurnStart effects
      this.applyTurnStartEffects(battle);

      // Execute attack based on whose turn it is
      if (isPlayerTurn) {
        // Player's turn
        if (battlePlayer.stats.currentHP > 0) {
          this.executeAttack(battle, battlePlayer, battleOpponent, 'player');
        }

        // Check if opponent is defeated
        if (battleOpponent.stats.currentHP <= 0) {
          battle.isComplete = true;
          battle.winner = 'player';
          break;
        }
      } else {
        // Opponent's turn
        if (battleOpponent.stats.currentHP > 0) {
          this.executeAttack(battle, battleOpponent, battlePlayer, 'opponent');
        }

        // Check if player is defeated
        if (battlePlayer.stats.currentHP <= 0) {
          battle.isComplete = true;
          battle.winner = 'opponent';
          break;
        }
      }

      // Apply OnTurnEnd effects
      this.applyTurnEndEffects(battle);

      // Check for speed increase (every 10 turns now since each attack is a turn)
      if ((battle.turn + 1) % (GAME_CONSTANTS.SPEED_INCREASE_INTERVAL * 2) === 0) {
        battle.speedMultiplier = DamageCalculator.calculateSpeedMultiplier(battle.turn + 1);
        battle.events.push(
          BattleLogger.createSpeedIncreaseEvent(battle.turn, 'player', battle.speedMultiplier)
        );
      }

      // Check for damage multiplier increase (every 4 turns now)
      if (
        battle.turn >= GAME_CONSTANTS.DAMAGE_MULTIPLIER_START * 2 &&
        (battle.turn - GAME_CONSTANTS.DAMAGE_MULTIPLIER_START * 2) % 4 === 0
      ) {
        const newMultiplier = DamageCalculator.calculateDamageMultiplier(battle.turn / 2);
        if (newMultiplier > battle.damageMultiplier) {
          battle.damageMultiplier = newMultiplier;
          battle.events.push(
            BattleLogger.createDamageMultiplierEvent(battle.turn, 'player', battle.damageMultiplier)
          );
        }
      }

      // Record HP history
      battle.playerHPHistory.push(battlePlayer.stats.currentHP);
      battle.opponentHPHistory.push(battleOpponent.stats.currentHP);

      battle.turn++;
    }

    // If we reached max turns, it's a draw
    if (battle.turn >= GAME_CONSTANTS.MAX_BATTLE_TURNS && !battle.isComplete) {
      battle.isComplete = true;
      battle.winner = 'draw';
      battle.events.push({
        turn: battle.turn,
        attacker: 'player',
        type: 'effect',
        details: [],
        message: '⏱️ Battle lasted too long! It\'s a draw!',
      });
    }

    // Apply OnBattleEnd effects
    this.applyBattleEndEffects(battle);

    // Update breakable items duration
    ItemEffects.updateBreakableItems(battlePlayer);
    ItemEffects.updateBreakableItems(battleOpponent);

    // Update player stats for tracking
    if (battle.winner === 'player') {
      player.stats.totalDamageDealt += battleOpponent.stats.maxHP - battleOpponent.stats.currentHP;
      player.stats.totalDamageReceived += player.stats.maxHP - battlePlayer.stats.currentHP;
    } else if (battle.winner === 'opponent') {
      player.stats.totalDamageReceived += player.stats.maxHP - battlePlayer.stats.currentHP;
      player.stats.totalDamageDealt += battleOpponent.stats.maxHP - battleOpponent.stats.currentHP;
    }

    return battle;
  }

  /**
   * Execute a single attack
   */
  private static executeAttack(
    battle: BattleState,
    attacker: Player,
    defender: Player,
    attackerSide: 'player' | 'opponent'
  ): void {
    // Calculate damage
    const damageResult = DamageCalculator.calculateDamage(
      attacker,
      defender,
      battle.speedMultiplier,
      battle.damageMultiplier
    );

    // Apply damage
    DamageCalculator.applyDamage(defender, damageResult.finalDamage);

    // Update stats
    attacker.stats.attackCount++;

    // Apply OnHit effects (before attack event to get HP values)
    const hitEffects = ItemEffects.applyEffects(
      EffectTrigger.OnHit,
      attacker,
      defender,
      battle.turn,
      damageResult.finalDamage
    );

    // Apply vampire/lifesteal effects
    const attackEffects = ItemEffects.applyEffects(
      EffectTrigger.OnAttack,
      attacker,
      defender,
      battle.turn,
      damageResult.finalDamage
    );

    // Apply OnBlock effects for defender
    let blockEffects: EffectApplicationResult = { events: [], preventLifeLoss: false };
    if (damageResult.blockPercent > 0) {
      blockEffects = ItemEffects.applyEffects(
        EffectTrigger.OnBlock,
        defender,
        attacker,
        battle.turn
      );
    }

    // Apply OnDefend effects
    const defendEffects = ItemEffects.applyEffects(
      EffectTrigger.OnDefend,
      defender,
      attacker,
      battle.turn
    );

    // Log attack event with healing details included
    const attackEvent = BattleLogger.createAttackEvent(
      battle.turn,
      attackerSide,
      damageResult,
      battle.player.stats.currentHP,
      battle.opponent.stats.currentHP
    );

    // Consolidate all healing events into the attack event
    const allEffects = [
      ...hitEffects.events,
      ...attackEffects.events,
      ...blockEffects.events,
      ...defendEffects.events
    ];

    // Extract healing details from effect events and add to attack event
    const healingDetails = allEffects
      .filter(e => e.type === 'heal')
      .flatMap(e => e.details);

    if (healingDetails.length > 0) {
      attackEvent.details.push(...healingDetails);
    }

    // Add only non-healing effect events as separate events
    const nonHealingEffects = allEffects.filter(e => e.type !== 'heal');
    battle.events.push(attackEvent);
    battle.events.push(...nonHealingEffects);
  }

  /**
   * Apply battle start effects
   */
  private static applyBattleStartEffects(battle: BattleState): void {
    const playerEffects = ItemEffects.applyEffects(
      EffectTrigger.OnBattleStart,
      battle.player,
      battle.opponent,
      battle.turn
    );
    battle.events.push(...playerEffects.events);

    const opponentEffects = ItemEffects.applyEffects(
      EffectTrigger.OnBattleStart,
      battle.opponent,
      battle.player,
      battle.turn
    );
    battle.events.push(...opponentEffects.events);
  }

  /**
   * Apply turn start effects
   */
  private static applyTurnStartEffects(battle: BattleState): void {
    const playerEffects = ItemEffects.applyEffects(
      EffectTrigger.OnTurnStart,
      battle.player,
      battle.opponent,
      battle.turn
    );
    battle.events.push(...playerEffects.events);

    const opponentEffects = ItemEffects.applyEffects(
      EffectTrigger.OnTurnStart,
      battle.opponent,
      battle.player,
      battle.turn
    );
    battle.events.push(...opponentEffects.events);
  }

  /**
   * Apply turn end effects
   */
  private static applyTurnEndEffects(battle: BattleState): void {
    const playerEffects = ItemEffects.applyEffects(
      EffectTrigger.OnTurnEnd,
      battle.player,
      battle.opponent,
      battle.turn
    );
    battle.events.push(...playerEffects.events);

    const opponentEffects = ItemEffects.applyEffects(
      EffectTrigger.OnTurnEnd,
      battle.opponent,
      battle.player,
      battle.turn
    );
    battle.events.push(...opponentEffects.events);
  }

  /**
   * Apply battle end effects
   */
  private static applyBattleEndEffects(battle: BattleState): void {
    const playerEffects = ItemEffects.applyEffects(
      EffectTrigger.OnBattleEnd,
      battle.player,
      battle.opponent,
      battle.turn
    );
    battle.events.push(...playerEffects.events);

    const opponentEffects = ItemEffects.applyEffects(
      EffectTrigger.OnBattleEnd,
      battle.opponent,
      battle.player,
      battle.turn
    );
    battle.events.push(...opponentEffects.events);
  }

  /**
   * Deep clone a player for battle simulation
   */
  private static clonePlayer(player: Player): Player {
    return {
      ...player,
      stats: { ...player.stats },
      items: player.items.map((item) => ({
        ...item,
        effects: item.effects.map((effect) => ({ ...effect })),
      })),
      skills: [...player.skills],
    };
  }
}
