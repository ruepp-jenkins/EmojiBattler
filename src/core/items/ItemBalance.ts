import { Item, ItemRarity } from '@core/types/Item';

export interface BalanceReport {
  isBalanced: boolean;
  warnings: string[];
  suggestions: string[];
  stats: {
    total: number;
    averagePower: number;
    averagePrice: number;
    priceToValueCorrelation: number;
  };
}

export class ItemBalance {
  /**
   * Calculate the power level of an item for balancing purposes
   */
  static calculateItemPower(item: Item): number {
    let power = 0;

    // Base stats
    power += item.baseAttack * 1.5;
    power += item.baseDefense * 1.2;

    // Effect power
    for (const effect of item.effects) {
      power += this.calculateEffectPower(effect, item);
    }

    return power;
  }

  private static calculateEffectPower(effect: any, _item: Item): number {
    let power = 0;
    const multiplier = effect.chance || 1;

    switch (effect.effectType) {
      case 'damage':
        power = effect.value * 3 * multiplier;
        break;
      case 'block':
        power = effect.value * 3 * multiplier;
        break;
      case 'heal':
        power = effect.value * 4;
        break;
      case 'vampire':
        power = effect.value * 80; // Percentage based
        break;
      case 'attackMultiply':
      case 'defenseMultiply':
        power = effect.value * 150; // Multiplicative effects are powerful
        break;
      case 'stack':
        const maxValue = effect.value * (effect.maxStacks || 10);
        power = maxValue * 2;
        break;
      case 'tempPower':
        power = effect.value * (effect.duration || 5) * 1.5;
        break;
      case 'preventLifeLoss':
        power = 300; // Very valuable
        break;
      case 'reduceOpponentAttack':
        power = effect.value * 8;
        break;
      case 'speedBoost':
        power = effect.value * 80;
        break;
    }

    return power;
  }

  /**
   * Validate the balance of all items
   */
  static validateBalance(items: Item[]): BalanceReport {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Calculate stats
    const powers = items.map((item) => this.calculateItemPower(item));
    const prices = items.map((item) => item.price);

    const averagePower = powers.reduce((a, b) => a + b, 0) / powers.length;
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Check price-to-power correlation
    const correlation = this.calculateCorrelation(powers, prices);

    // Validate rarity distribution
    const rarityCount = {
      common: items.filter((i) => i.rarity === ItemRarity.Common).length,
      rare: items.filter((i) => i.rarity === ItemRarity.Rare).length,
      epic: items.filter((i) => i.rarity === ItemRarity.Epic).length,
      legendary: items.filter((i) => i.rarity === ItemRarity.Legendary).length,
    };

    const total = items.length;
    const rarityPercent = {
      common: rarityCount.common / total,
      rare: rarityCount.rare / total,
      epic: rarityCount.epic / total,
      legendary: rarityCount.legendary / total,
    };

    // Check if distribution is reasonable (common > rare > epic > legendary)
    if (rarityPercent.common < 0.25) {
      warnings.push('Too few common items. Should be at least 25% of total.');
    }
    if (rarityPercent.legendary > 0.20) {
      warnings.push('Too many legendary items. Should be less than 20% of total.');
    }

    // Check for overpowered items
    items.forEach((item) => {
      const power = this.calculateItemPower(item);
      const pricePerPower = item.price / power;

      // Check if price matches power level
      if (pricePerPower < 0.5) {
        warnings.push(`${item.name} (${item.emoji}) may be underpriced for its power.`);
      } else if (pricePerPower > 3) {
        warnings.push(`${item.name} (${item.emoji}) may be overpriced for its power.`);
      }

      // Check for items with excessive power for their rarity
      const expectedPower = {
        [ItemRarity.Common]: 30,
        [ItemRarity.Rare]: 60,
        [ItemRarity.Epic]: 100,
        [ItemRarity.Legendary]: 150,
      };

      if (power > expectedPower[item.rarity] * 1.5) {
        warnings.push(
          `${item.name} (${item.emoji}) has excessive power (${Math.round(power)}) for ${item.rarity} rarity.`
        );
      }
    });

    // Suggestions
    if (correlation < 0.7) {
      suggestions.push(
        'Price-to-power correlation is low. Consider adjusting prices to better reflect item power.'
      );
    }

    if (items.length < 90) {
      suggestions.push(`Add ${90 - items.length} more items to reach the target of 90+ items.`);
    }

    const isBalanced = warnings.length === 0 && correlation >= 0.7;

    return {
      isBalanced,
      warnings,
      suggestions,
      stats: {
        total: items.length,
        averagePower: Math.round(averagePower),
        averagePrice: Math.round(averagePrice),
        priceToValueCorrelation: Math.round(correlation * 100) / 100,
      },
    };
  }

  /**
   * Calculate Pearson correlation coefficient
   */
  private static calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
    const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) return 0;
    return numerator / denominator;
  }

  /**
   * Get recommended price for an item based on its power
   */
  static getRecommendedPrice(item: Item): number {
    const power = this.calculateItemPower(item);

    // Base price per power point
    const basePricePerPower = 2;

    // Rarity multiplier
    const rarityMultiplier = {
      [ItemRarity.Common]: 0.8,
      [ItemRarity.Rare]: 1.2,
      [ItemRarity.Epic]: 1.8,
      [ItemRarity.Legendary]: 2.5,
    };

    return Math.round(power * basePricePerPower * rarityMultiplier[item.rarity]);
  }
}
