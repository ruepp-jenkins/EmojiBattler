import { GameState, BattleTimeline } from '@core/types/GameState';
import { Player } from '@core/types/Player';
import { Difficulty, DifficultyProgress } from '@core/types/Difficulty';
import { Item } from '@core/types/Item';
import { AppliedSkill } from '@core/types/Skills';
import { BattleEngine } from './battle/BattleEngine';
import { ShopGenerator } from './shop/ShopGenerator';
import { AIShopStrategy } from './shop/AIShopStrategy';
import { MoneyManager } from './economy/MoneyManager';
import { SkillManager } from './skills/SkillManager';
import { ItemEffects } from './battle/ItemEffects';
import { GAME_CONSTANTS } from '@utils/constants';

export class GameEngine {
  /**
   * Initialize a new game
   */
  static initializeGame(
    difficulty: Difficulty,
    permanentSkills: AppliedSkill[]
  ): GameState {
    // Create player
    const player = this.createPlayer(permanentSkills);

    // Initialize game state
    const gameState: GameState = {
      phase: 'shop',
      currentRound: 1,
      maxRounds: GAME_CONSTANTS.MAX_ROUNDS,
      difficulty,
      player,
      opponent: undefined,
      currentBattle: undefined,
      playerShopInventory: [],
      aiShopInventory: [],
      purchasedShopItemIds: [],
      soldItems: [],
      shopTransactionLog: [],
      skillPoints: 0,
      consecutiveWins: 0,
      battleTimeline: [],
      gameStartTime: Date.now(),
    };

    // Create AI opponent
    gameState.opponent = this.createAIOpponent(difficulty, permanentSkills);

    // Generate separate shops for player and AI (excluding their owned items)
    gameState.playerShopInventory = ShopGenerator.generateShop(player.items, 1);
    gameState.aiShopInventory = ShopGenerator.generateShop(gameState.opponent.items, 1);

    // AI makes initial purchases for round 1
    if (gameState.opponent) {
      this.performAIShopping(gameState, difficulty, 1);
    }

    return gameState;
  }

  /**
   * Create a player with permanent skills applied
   */
  private static createPlayer(permanentSkills: AppliedSkill[]): Player {
    const player: Player = {
      stats: {
        baseAttack: GAME_CONSTANTS.STARTING_ATTACK,
        baseDefense: GAME_CONSTANTS.STARTING_DEFENSE,
        currentHP: GAME_CONSTANTS.STARTING_HP,
        maxHP: GAME_CONSTANTS.STARTING_HP,
        speed: 1,
        attackCount: 0,
        lives: GAME_CONSTANTS.MAX_LIVES,
        money: GAME_CONSTANTS.STARTING_MONEY,
        totalDamageDealt: 0,
        totalDamageReceived: 0,
        totalDamageBlocked: 0,
        totalMoneySpent: 0,
        totalItemsBought: 0,
      },
      items: [],
      skills: permanentSkills,
      isAI: false,
    };

    // Apply permanent skills
    SkillManager.applySkills(player, permanentSkills);

    // Add starting money bonus
    player.stats.money += SkillManager.getStartingMoneyBonus(permanentSkills);

    return player;
  }

  /**
   * Create AI opponent
   */
  private static createAIOpponent(
    difficulty: Difficulty,
    _playerSkills: AppliedSkill[]
  ): Player {
    // AI gets skill points based on difficulty
    const aiSkills: AppliedSkill[] = [];

    // AI base stats are multiplied by difficulty
    const opponent: Player = {
      stats: {
        baseAttack: Math.round(GAME_CONSTANTS.STARTING_ATTACK * difficulty.aiStatMultiplier),
        baseDefense: Math.round(GAME_CONSTANTS.STARTING_DEFENSE * difficulty.aiStatMultiplier),
        currentHP: GAME_CONSTANTS.STARTING_HP,
        maxHP: GAME_CONSTANTS.STARTING_HP,
        speed: 1,
        attackCount: 0,
        lives: GAME_CONSTANTS.MAX_LIVES,
        money: GAME_CONSTANTS.STARTING_MONEY + difficulty.aiMoneyBonus,
        totalDamageDealt: 0,
        totalDamageReceived: 0,
        totalDamageBlocked: 0,
        totalMoneySpent: 0,
        totalItemsBought: 0,
      },
      items: [],
      skills: aiSkills,
      isAI: true,
      difficulty,
    };

    return opponent;
  }

  /**
   * Handle AI shopping with buy and sell logic
   */
  private static performAIShopping(
    gameState: GameState,
    difficulty: Difficulty,
    round: number
  ): void {
    if (!gameState.opponent) return;

    const aiPlayer = gameState.opponent;
    const shop = gameState.aiShopInventory;

    // Get desired purchases
    const aiPurchases = AIShopStrategy.selectPurchases(
      shop,
      aiPlayer,
      difficulty,
      round
    );

    for (const itemToBuy of aiPurchases) {
      // Check if AI is at max capacity
      if (aiPlayer.items.length >= GAME_CONSTANTS.MAX_ITEMS) {
        // Find worst item to potentially sell
        let worstItem: Item | null = null;
        let worstScore = Infinity;

        // Score all sellable items and find the worst one
        for (const ownedItem of aiPlayer.items) {
          // Skip items that can't be sold
          if (!ownedItem.canSell) continue;

          const score = this.scoreAIItem(ownedItem, aiPlayer, difficulty, round);
          if (score < worstScore) {
            worstScore = score;
            worstItem = ownedItem;
          }
        }

        // Check if we should sell the worst item for the new one
        if (worstItem && AIShopStrategy.shouldSellItem(worstItem, itemToBuy, aiPlayer, difficulty, round)) {
          MoneyManager.sellItem(aiPlayer, worstItem);
          this.updatePlayerMaxHP(aiPlayer);
        } else {
          // Can't or shouldn't sell anything, skip this purchase
          continue;
        }
      }

      // Purchase the item
      if (MoneyManager.purchaseItem(aiPlayer, itemToBuy)) {
        this.updatePlayerMaxHP(aiPlayer);

        // Remove from AI shop inventory
        const index = shop.findIndex((i) => i.id === itemToBuy.id);
        if (index !== -1) {
          shop.splice(index, 1);
        }
      }
    }
  }

  /**
   * Score an item for AI decision making (wrapper for AIShopStrategy)
   */
  private static scoreAIItem(
    item: Item,
    _aiPlayer: Player,
    _difficulty: Difficulty,
    _round: number
  ): number {
    // Use reflection to access private method, or duplicate scoring logic
    // For simplicity, we'll use a basic scoring
    let score = item.baseAttack * 3 + item.baseDefense * 2.5;

    for (const effect of item.effects) {
      switch (effect.effectType) {
        case 'damage':
          score += effect.value * 4;
          break;
        case 'block':
          score += effect.value * 3.5;
          break;
        case 'heal':
          score += effect.value * 5;
          break;
        case 'vampire':
          score += effect.value * 100;
          break;
        case 'attackMultiply':
        case 'defenseMultiply':
          score += effect.value * 150;
          break;
      }
    }

    return score;
  }

  /**
   * Start the shop phase
   */
  static startShopPhase(gameState: GameState): void {
    gameState.phase = 'shop';

    // Reset shop tracking for new round
    gameState.purchasedShopItemIds = [];
    gameState.soldItems = [];

    // Award round money to player
    const basePlayerMoney = GAME_CONSTANTS.MONEY_PER_ROUND +
      SkillManager.getMoneyPerRoundBonus(gameState.player.skills) +
      this.getMoneyBonusFromItems(gameState.player);
    const playerMultiplier = this.getMoneyMultiplierFromItems(gameState.player);
    const playerMoneyEarned = Math.round(basePlayerMoney * playerMultiplier);
    gameState.player.stats.money += playerMoneyEarned;

    // Log money received
    gameState.shopTransactionLog.push({
      round: gameState.currentRound,
      type: 'money_received',
      amount: playerMoneyEarned,
      timestamp: Date.now(),
    });

    // Update duration-based money items (like Lucky Charm)
    this.updateMoneyItemDurations(gameState.player);

    // Generate fresh shop for player (excludes player's owned items)
    gameState.playerShopInventory = ShopGenerator.generateShop(
      gameState.player.items,
      gameState.currentRound
    );

    // Award money to AI opponent and generate AI shop
    if (gameState.opponent) {
      const aiMoneyEarned = GAME_CONSTANTS.MONEY_PER_ROUND +
        (gameState.difficulty?.aiMoneyBonus || 0);
      gameState.opponent.stats.money += aiMoneyEarned;

      // Generate fresh shop for AI (excludes AI's owned items)
      gameState.aiShopInventory = ShopGenerator.generateShop(
        gameState.opponent.items,
        gameState.currentRound
      );

      // AI makes purchases (and sells if at max capacity)
      this.performAIShopping(gameState, gameState.difficulty!, gameState.currentRound);
    }
  }

  /**
   * Purchase an item from the player's shop
   */
  static purchaseItem(gameState: GameState, item: Item): boolean {
    if (!MoneyManager.purchaseItem(gameState.player, item)) {
      return false;
    }

    // Track purchased item (leave empty slot in shop)
    gameState.purchasedShopItemIds.push(item.id);

    // Log transaction
    gameState.shopTransactionLog.push({
      round: gameState.currentRound,
      type: 'item_bought',
      item: { ...item }, // Clone item to preserve state
      timestamp: Date.now(),
    });

    // Update player's maxHP if the item has maxHPBonus
    this.updatePlayerMaxHP(gameState.player);

    return true;
  }

  /**
   * Sell an item back to the shop
   */
  static sellItem(gameState: GameState, item: Item): boolean {
    if (!MoneyManager.sellItem(gameState.player, item)) {
      return false;
    }

    // Add to sold items section
    gameState.soldItems.push(item);

    // Log transaction
    gameState.shopTransactionLog.push({
      round: gameState.currentRound,
      type: 'item_sold',
      item: { ...item }, // Clone item to preserve state
      timestamp: Date.now(),
    });

    // Update player's maxHP if the item had maxHPBonus
    this.updatePlayerMaxHP(gameState.player);

    return true;
  }

  /**
   * Start the battle phase
   */
  static startBattle(gameState: GameState): void {
    if (!gameState.opponent) {
      throw new Error('No opponent available for battle');
    }

    gameState.phase = 'battle';

    // Reset player HP for battle
    gameState.player.stats.currentHP = gameState.player.stats.maxHP;
    gameState.opponent.stats.currentHP = gameState.opponent.stats.maxHP;

    // Execute battle
    gameState.currentBattle = BattleEngine.executeBattle(
      gameState.player,
      gameState.opponent,
      gameState.currentRound
    );

    // Keep phase as 'battle' - let BattlePhase component control the transition
    // BattlePhase will show the battle UI and call endRound when user clicks Continue
  }

  /**
   * End the current round and handle results
   */
  static endRound(gameState: GameState): void {
    if (!gameState.currentBattle) {
      throw new Error('No battle to end');
    }

    const battle = gameState.currentBattle;
    const playerWon = battle.winner === 'player' || battle.winner === 'draw';
    const lostLife = !playerWon && !this.preventLifeLoss(gameState.player);

    // Record battle in timeline
    const timelineEntry: BattleTimeline = {
      round: gameState.currentRound,
      playerWon,
      playerHP: battle.player.stats.currentHP,
      opponentHP: battle.opponent.stats.currentHP,
      lostLife,
    };
    gameState.battleTimeline.push(timelineEntry);

    // Award skill points for winning battles
    if (playerWon) {
      gameState.consecutiveWins += 1;
      const skillPointsEarned = this.calculateSkillPointsForBattle(
        gameState.difficulty,
        gameState.consecutiveWins
      );
      gameState.skillPoints += skillPointsEarned;
    } else {
      // Reset consecutive wins on loss
      gameState.consecutiveWins = 0;
    }

    // Handle life loss
    if (lostLife) {
      gameState.player.stats.lives -= 1;

      // Check for game over
      if (gameState.player.stats.lives <= 0) {
        gameState.phase = 'gameOver';
        return;
      }
    }

    // Check if game is won (completed all rounds)
    if (gameState.currentRound >= gameState.maxRounds) {
      gameState.phase = 'gameOver';
      return;
    }

    // Advance to next round
    gameState.currentRound += 1;

    // Start next shop phase
    this.startShopPhase(gameState);
  }

  /**
   * Check if player has life prevention item
   */
  private static preventLifeLoss(player: Player): boolean {
    return ItemEffects.hasLifePreventionItem(player);
  }

  /**
   * Calculate total money bonus from items with moneyBonus effects
   */
  private static getMoneyBonusFromItems(player: Player): number {
    let bonus = 0;
    for (const item of player.items) {
      for (const effect of item.effects) {
        if (effect.trigger === 'passive' && effect.effectType === 'moneyBonus') {
          bonus += effect.value;
        }
      }
    }
    return bonus;
  }

  /**
   * Calculate total money multiplier from items with moneyMultiplier effects
   */
  private static getMoneyMultiplierFromItems(player: Player): number {
    let multiplier = 1;
    for (const item of player.items) {
      for (const effect of item.effects) {
        if (effect.trigger === 'passive' && effect.effectType === 'moneyMultiplier') {
          if (!effect.isBroken) {
            multiplier *= effect.value;
          }
        }
      }
    }
    return multiplier;
  }

  /**
   * Calculate total max HP bonus from items with maxHPBonus effects
   */
  private static getMaxHPBonusFromItems(player: Player): number {
    let bonus = 0;
    for (const item of player.items) {
      for (const effect of item.effects) {
        if (effect.trigger === 'passive' && effect.effectType === 'maxHPBonus') {
          bonus += effect.value;
        }
      }
    }
    return bonus;
  }

  /**
   * Update player's maxHP based on items and skills
   */
  private static updatePlayerMaxHP(player: Player): void {
    const itemBonus = this.getMaxHPBonusFromItems(player);
    const baseMaxHP = GAME_CONSTANTS.STARTING_HP;

    // Get skill bonus directly from player's skills
    const skillBonus = SkillManager.getSkillSummary(player.skills).maxHP;

    // Set new maxHP = base + skills + items
    player.stats.maxHP = baseMaxHP + skillBonus + itemBonus;

    // Ensure currentHP doesn't exceed maxHP
    if (player.stats.currentHP > player.stats.maxHP) {
      player.stats.currentHP = player.stats.maxHP;
    }
  }

  /**
   * Update duration-based money items and break them if needed
   */
  private static updateMoneyItemDurations(player: Player): void {
    for (const item of player.items) {
      for (const effect of item.effects) {
        if (effect.effectType === 'moneyMultiplier' && effect.breakable && !effect.isBroken) {
          // Initialize duration if not set
          if (effect.currentDuration === undefined) {
            effect.currentDuration = 0;
          }

          // Increment duration
          effect.currentDuration++;

          // Check if item should break
          if (effect.maxDuration && effect.currentDuration >= effect.maxDuration) {
            effect.isBroken = true;
            item.canSell = false;
          }
        }
      }
    }
  }

  /**
   * Calculate skill points earned for winning a battle
   * Normal: 1 point every 3rd win
   * Hard: 1 point every 2nd win
   * Expert: 1 point per win
   * Master: 2 points per win
   * Torment: 4 points per win
   */
  private static calculateSkillPointsForBattle(
    difficulty: Difficulty,
    consecutiveWins: number
  ): number {
    switch (difficulty.level) {
      case 'normal':
        // Award 1 point every 3rd win
        return consecutiveWins % 3 === 0 ? 1 : 0;

      case 'hard':
        // Award 1 point every 2nd win
        return consecutiveWins % 2 === 0 ? 1 : 0;

      case 'expert':
        // Award 1 point per win
        return 1;

      case 'master':
        // Award 2 points per win
        return 2;

      case 'torment':
        // Award 4 points per win (base torment difficulty)
        return 4;

      default:
        return 0;
    }
  }

  /**
   * Update difficulty progress after game completion
   */
  static updateDifficultyProgress(
    progress: DifficultyProgress,
    difficulty: Difficulty,
    won: boolean
  ): DifficultyProgress {
    if (!won) return progress;

    const newProgress = { ...progress };

    switch (difficulty.level) {
      case 'normal':
        newProgress.highestWon.normal = true;
        break;
      case 'hard':
        newProgress.highestWon.hard = true;
        break;
      case 'expert':
        newProgress.highestWon.expert = true;
        break;
      case 'master':
        newProgress.highestWon.master = true;
        break;
      case 'torment':
        if (difficulty.tormentLevel) {
          newProgress.highestWon.torment = Math.max(
            newProgress.highestWon.torment,
            difficulty.tormentLevel
          );
        }
        break;
    }

    return newProgress;
  }

  /**
   * Check if a difficulty can be selected
   */
  static canSelectDifficulty(
    difficulty: Difficulty,
    progress: DifficultyProgress
  ): boolean {
    // All difficulties except torment are always available
    if (difficulty.level !== 'torment') {
      return true;
    }

    // Torment can only be selected up to highest won + 2
    const tormentLevel = difficulty.tormentLevel || 1;
    const highestWon = progress.highestWon.torment;

    return tormentLevel <= highestWon + 2;
  }

  /**
   * Get game statistics
   */
  static getGameStats(gameState: GameState) {
    const totalBattles = gameState.battleTimeline.length;
    const battlesWon = gameState.battleTimeline.filter((b) => b.playerWon).length;
    const battlesLost = totalBattles - battlesWon;
    const livesLost = GAME_CONSTANTS.MAX_LIVES - gameState.player.stats.lives;

    return {
      totalBattles,
      battlesWon,
      battlesLost,
      livesLost,
      totalDamageDealt: gameState.player.stats.totalDamageDealt,
      totalDamageReceived: gameState.player.stats.totalDamageReceived,
      totalDamageBlocked: gameState.player.stats.totalDamageBlocked,
      totalMoneySpent: gameState.player.stats.totalMoneySpent,
      totalItemsBought: gameState.player.stats.totalItemsBought,
      currentRound: gameState.currentRound,
      gameDuration: Date.now() - gameState.gameStartTime,
    };
  }
}
