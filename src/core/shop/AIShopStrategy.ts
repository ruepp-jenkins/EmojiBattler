import { Player } from '@core/types/Player';
import { Item, ItemType, ItemRarity } from '@core/types/Item';
import { Difficulty } from '@core/types/Difficulty';
import { GAME_CONSTANTS } from '@utils/constants';

interface ItemScore {
  item: Item;
  score: number;
}

export class AIShopStrategy {
  /**
   * AI selects items to purchase from shop
   */
  static selectPurchases(
    shopInventory: Item[],
    aiPlayer: Player,
    difficulty: Difficulty,
    round: number
  ): Item[] {
    let availableMoney = aiPlayer.stats.money;
    const currentItemCount = aiPlayer.items.length;

    // Calculate how many items AI can buy
    const maxItems = GAME_CONSTANTS.MAX_ITEMS - currentItemCount;

    if (maxItems <= 0) {
      return []; // AI already has max items
    }

    // Score all affordable items
    const affordableItems = shopInventory.filter((item) => item.price <= availableMoney);

    if (affordableItems.length === 0) {
      return []; // Nothing affordable
    }

    // Score each item
    const scoredItems = affordableItems.map((item) => ({
      item,
      score: this.scoreItem(item, aiPlayer, difficulty, round),
    }));

    // Apply difficulty-based decision making
    const selectedItems = this.applyDifficultyStrategy(
      scoredItems,
      difficulty,
      availableMoney,
      maxItems
    );

    // Ensure balanced composition
    const balancedItems = this.ensureBalance(selectedItems, aiPlayer, round);

    return balancedItems;
  }

  /**
   * Score an item based on its value to the AI
   */
  private static scoreItem(
    item: Item,
    aiPlayer: Player,
    _difficulty: Difficulty,
    round: number
  ): number {
    let score = 0;

    // Base value from stats
    score += item.baseAttack * 3;
    score += item.baseDefense * 2.5;

    // Value from effects
    for (const effect of item.effects) {
      switch (effect.effectType) {
        case 'damage':
          score += effect.value * 4 * (effect.chance || 1);
          break;
        case 'block':
          score += effect.value * 3.5 * (effect.chance || 1);
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
        case 'stack':
          score += effect.value * (effect.maxStacks || 10) * 2.5;
          break;
        case 'preventLifeLoss':
          score += 400;
          break;
        case 'reduceOpponentAttack':
          score += effect.value * 10;
          break;
      }
    }

    // Synergy bonus
    score += this.calculateSynergy(item, aiPlayer.items);

    // Round-based strategy adjustment
    score = this.applyRoundStrategy(score, item, round);

    // Rarity bonus
    const rarityBonus = {
      [ItemRarity.Common]: 1.0,
      [ItemRarity.Rare]: 1.1,
      [ItemRarity.Epic]: 1.2,
      [ItemRarity.Legendary]: 1.3,
    };
    score *= rarityBonus[item.rarity];

    // Price efficiency (value per cost)
    const efficiency = score / item.price;
    score *= Math.sqrt(efficiency); // Favor cost-effective items

    return score;
  }

  /**
   * Calculate synergy with existing items
   */
  private static calculateSynergy(item: Item, existingItems: Item[]): number {
    let synergy = 0;

    // Vampire synergy: more vampire effects = better
    const hasVampire = item.effects.some((e) => e.effectType === 'vampire');
    const vampireCount = existingItems.filter((i) =>
      i.effects.some((e) => e.effectType === 'vampire')
    ).length;
    if (hasVampire && vampireCount > 0) {
      synergy += vampireCount * 20;
    }

    // Stacking synergy: multiple stacking items work well together
    const hasStack = item.effects.some((e) => e.effectType === 'stack');
    const stackCount = existingItems.filter((i) =>
      i.effects.some((e) => e.effectType === 'stack')
    ).length;
    if (hasStack && stackCount > 0) {
      synergy += stackCount * 15;
    }

    // Multiplier synergy: multipliers are better with higher base stats
    const hasMultiplier = item.effects.some(
      (e) => e.effectType === 'attackMultiply' || e.effectType === 'defenseMultiply'
    );
    if (hasMultiplier) {
      const totalStats = existingItems.reduce(
        (sum, i) => sum + i.baseAttack + i.baseDefense,
        0
      );
      synergy += Math.sqrt(totalStats) * 5;
    }

    // Heal synergy: healing is better when you have high max HP
    const hasHeal = item.effects.some((e) => e.effectType === 'heal');
    if (hasHeal) {
      synergy += existingItems.filter((i) => i.baseDefense > 10).length * 10;
    }

    return synergy;
  }

  /**
   * Apply round-based strategy
   * Early rounds: favor defense
   * Mid rounds: balanced
   * Late rounds: favor attack
   */
  private static applyRoundStrategy(score: number, item: Item, round: number): number {
    if (round <= 5) {
      // Early game: favor defense
      if (item.type === ItemType.Defense) {
        score *= 1.3;
      } else if (item.type === ItemType.Attack) {
        score *= 0.9;
      }
    } else if (round >= 11) {
      // Late game: favor attack
      if (item.type === ItemType.Attack) {
        score *= 1.3;
      } else if (item.type === ItemType.Defense) {
        score *= 0.9;
      }
    }

    return score;
  }

  /**
   * Apply difficulty-based selection strategy
   */
  private static applyDifficultyStrategy(
    scoredItems: ItemScore[],
    difficulty: Difficulty,
    availableMoney: number,
    maxItems: number
  ): Item[] {
    const optimalPercent = difficulty.aiOptimalPlayPercent;

    // Sort by score descending
    const sorted = [...scoredItems].sort((a, b) => b.score - a.score);

    const selected: Item[] = [];
    let spent = 0;

    for (const { item, score: _score } of sorted) {
      // Check if we can afford and have space
      if (spent + item.price > availableMoney || selected.length >= maxItems) {
        break;
      }

      // Optimal AI: always pick best items
      // Suboptimal AI: occasionally skip good items
      const shouldPick = Math.random() < optimalPercent || selected.length === 0;

      if (shouldPick) {
        selected.push(item);
        spent += item.price;
      }
    }

    return selected;
  }

  /**
   * Ensure balanced item composition
   * Target: 40-60% attack, 30-40% defense, 10-20% passive
   */
  private static ensureBalance(
    items: Item[],
    aiPlayer: Player,
    _round: number
  ): Item[] {
    if (items.length === 0) return items;

    // Calculate current composition
    const allItems = [...aiPlayer.items, ...items];
    const total = allItems.length;

    const attackCount = allItems.filter((i) => i.type === ItemType.Attack).length;
    const defenseCount = allItems.filter((i) => i.type === ItemType.Defense).length;
    const passiveCount = allItems.filter((i) => i.type === ItemType.Passive).length;

    const attackPercent = attackCount / total;
    const defensePercent = defenseCount / total;
    const passivePercent = passiveCount / total;

    // Check if balance is off
    const needsMoreAttack = attackPercent < 0.35;
    const needsMoreDefense = defensePercent < 0.25;
    const tooManyPassive = passivePercent > 0.25;

    if (!needsMoreAttack && !needsMoreDefense && !tooManyPassive) {
      return items; // Balance is fine
    }

    // Rebalance: prioritize attack or defense as needed
    const balanced: Item[] = [];

    // First, add items we need more of
    if (needsMoreAttack) {
      balanced.push(...items.filter((i) => i.type === ItemType.Attack));
    }
    if (needsMoreDefense) {
      balanced.push(...items.filter((i) => i.type === ItemType.Defense));
    }

    // Then add passives if not too many
    if (!tooManyPassive) {
      balanced.push(...items.filter((i) => i.type === ItemType.Passive));
    }

    // Fill remaining with other items
    for (const item of items) {
      if (!balanced.includes(item)) {
        balanced.push(item);
      }
    }

    return balanced;
  }

  /**
   * Decide if AI should sell an item to buy something better
   */
  static shouldSellItem(
    itemToSell: Item,
    itemToBuy: Item,
    aiPlayer: Player,
    difficulty: Difficulty,
    round: number
  ): boolean {
    // Don't sell breakable items that can't be sold
    if (!itemToSell.canSell) {
      return false;
    }

    // Score both items
    const sellScore = this.scoreItem(itemToSell, aiPlayer, difficulty, round);
    const buyScore = this.scoreItem(itemToBuy, aiPlayer, difficulty, round);

    // Calculate if AI can afford the swap (current money + sell value >= buy price)
    const sellValue = Math.floor(itemToSell.price / 2);
    const canAfford = aiPlayer.stats.money + sellValue >= itemToBuy.price;

    if (!canAfford) {
      return false;
    }

    // AI difficulty affects how good the new item needs to be
    // Lower difficulty = needs much better item (1.5x)
    // Higher difficulty = needs slightly better item (1.1x)
    const improvementThreshold = 1.5 - (difficulty.aiOptimalPlayPercent * 0.4);

    // Buy if new item is better enough for this difficulty level
    return buyScore > sellScore * improvementThreshold;
  }
}
