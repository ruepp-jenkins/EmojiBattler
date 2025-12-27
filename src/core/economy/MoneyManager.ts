import { Player } from '@core/types/Player';
import { Item } from '@core/types/Item';
import { GAME_CONSTANTS } from '@utils/constants';

export class MoneyManager {
  /**
   * Award money to player at the start of a round
   */
  static awardRoundMoney(player: Player, _round: number): number {
    const moneyEarned = GAME_CONSTANTS.MONEY_PER_ROUND;
    player.stats.money += moneyEarned;
    return moneyEarned;
  }

  /**
   * Check if player can afford an item
   */
  static canAfford(player: Player, item: Item): boolean {
    return player.stats.money >= item.price;
  }

  /**
   * Purchase an item
   */
  static purchaseItem(player: Player, item: Item): boolean {
    if (!this.canAfford(player, item)) {
      return false;
    }

    if (player.items.length >= GAME_CONSTANTS.MAX_ITEMS) {
      return false;
    }

    player.stats.money -= item.price;
    player.stats.totalMoneySpent += item.price;
    player.stats.totalItemsBought += 1;
    player.items.push(item);

    return true;
  }

  /**
   * Sell an item back to the shop
   */
  static sellItem(player: Player, item: Item): boolean {
    const itemIndex = player.items.findIndex((i) => i.id === item.id);

    if (itemIndex === -1) {
      return false;
    }

    if (!item.canSell) {
      return false; // Can't sell used breakable items
    }

    player.items.splice(itemIndex, 1);
    player.stats.money += item.price;

    return true;
  }

  /**
   * Get player's current money
   */
  static getMoney(player: Player): number {
    return player.stats.money;
  }

  /**
   * Set player's money (for initialization or cheats)
   */
  static setMoney(player: Player, amount: number): void {
    player.stats.money = Math.max(0, amount);
  }
}
