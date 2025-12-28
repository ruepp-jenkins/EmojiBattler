import { Item, ItemRarity } from '@core/types/Item';
import { ItemDatabase } from '@core/items/ItemDatabase';
import { GAME_CONSTANTS } from '@utils/constants';

export class ShopGenerator {
  /**
   * Generate a shop inventory of 9 items (3x3 grid)
   * Excludes items that are already owned by the player
   */
  static generateShop(ownedItems: Item[], round: number): Item[] {
    // Get all items from database
    const allItems = ItemDatabase.getAllItems();

    // Filter out items already owned
    const ownedItemIds = new Set(ownedItems.map(item => item.id));
    const availableItems = allItems.filter(item => !ownedItemIds.has(item.id));

    if (availableItems.length === 0) {
      return [];
    }

    // Adjust rarity distribution based on round
    const rarityWeights = this.getRarityWeights(round);

    // Select 9 items with weighted rarity
    const shopItems: Item[] = [];
    const itemPool = [...availableItems];

    for (let i = 0; i < GAME_CONSTANTS.SHOP_SIZE && itemPool.length > 0; i++) {
      const selectedItem = this.selectWeightedItem(itemPool, rarityWeights);

      if (selectedItem) {
        shopItems.push(selectedItem);
        // Remove from pool to avoid duplicates in the same shop
        const index = itemPool.findIndex((item) => item.id === selectedItem.id);
        if (index !== -1) {
          itemPool.splice(index, 1);
        }
      }
    }

    return shopItems;
  }

  /**
   * Get rarity weights based on round progression
   * Early rounds: more common items
   * Late rounds: more rare/epic/legendary items
   */
  private static getRarityWeights(round: number): Record<ItemRarity, number> {
    // Early game (rounds 1-5): 70% common, 25% rare, 5% epic, 0% legendary
    // Mid game (rounds 6-10): 40% common, 40% rare, 15% epic, 5% legendary
    // Late game (rounds 11-15): 20% common, 30% rare, 30% epic, 20% legendary

    if (round <= 5) {
      return {
        [ItemRarity.Common]: 0.70,
        [ItemRarity.Rare]: 0.25,
        [ItemRarity.Epic]: 0.05,
        [ItemRarity.Legendary]: 0.00,
      };
    } else if (round <= 10) {
      return {
        [ItemRarity.Common]: 0.40,
        [ItemRarity.Rare]: 0.40,
        [ItemRarity.Epic]: 0.15,
        [ItemRarity.Legendary]: 0.05,
      };
    } else {
      return {
        [ItemRarity.Common]: 0.20,
        [ItemRarity.Rare]: 0.30,
        [ItemRarity.Epic]: 0.30,
        [ItemRarity.Legendary]: 0.20,
      };
    }
  }

  /**
   * Select an item from the pool with weighted rarity
   */
  private static selectWeightedItem(
    items: Item[],
    rarityWeights: Record<ItemRarity, number>
  ): Item | null {
    if (items.length === 0) return null;

    // Calculate total weight for each item
    const weightedItems = items.map((item) => ({
      item,
      weight: rarityWeights[item.rarity] || 0.01,
    }));

    const totalWeight = weightedItems.reduce((sum, wi) => sum + wi.weight, 0);

    // Select random item based on weights
    let random = Math.random() * totalWeight;

    for (const { item, weight } of weightedItems) {
      random -= weight;
      if (random <= 0) {
        return item;
      }
    }

    // Fallback: return last item
    return weightedItems[weightedItems.length - 1].item;
  }

  /**
   * Refresh shop by returning sold items (optional feature)
   */
  static refreshShop(
    currentShop: Item[],
    soldItems: Item[],
    _availableItems: Item[]
  ): Item[] {
    // Keep items that weren't bought
    const unboughtItems = currentShop.filter(
      (shopItem) => !soldItems.some((sold) => sold.id === shopItem.id)
    );

    // Generate remaining items to fill shop
    const needed = GAME_CONSTANTS.SHOP_SIZE - unboughtItems.length;
    const newItems = ItemDatabase.getRandomItems(
      needed,
      unboughtItems.map((i) => i.id)
    );

    return [...unboughtItems, ...newItems];
  }
}
