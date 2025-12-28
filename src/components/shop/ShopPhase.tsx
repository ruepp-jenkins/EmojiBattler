import { useGame } from '@context/GameContext';
import { useItemTooltip } from '@context/ItemTooltipContext';
import { Item } from '@core/types/Item';
import { Player } from '@core/types/Player';
import { ShopTransaction } from '@core/types/GameState';
import { ItemCard } from '@components/common/ItemCard';
import { ItemHoverWrapper } from '@components/common/ItemHoverWrapper';
import { SkillHoverWrapper } from '@components/common/SkillHoverWrapper';
import { Button } from '@components/common/Button';
import { formatMoney } from '@utils/formatting';
import { GAME_CONSTANTS } from '@utils/constants';
import { getAllSkills } from '@core/skills/SkillTree';

export function ShopPhase() {
  const { gameState, purchaseItem, sellItem, startBattle, persistentData, purchaseSkill } = useGame();
  const { hideTooltip } = useItemTooltip();

  const allSkills = getAllSkills();

  if (!gameState) return null;

  const { player, playerShopInventory, purchasedShopItemIds, soldItems, currentRound, maxRounds, shopTransactionLog } = gameState;

  const handleBuyItem = (item: Item) => {
    if (player.items.length >= GAME_CONSTANTS.MAX_ITEMS) {
      alert('Cannot buy more items! Maximum 15 items.');
      return;
    }

    if (player.stats.money < item.price) {
      alert('Not enough money!');
      return;
    }

    hideTooltip();
    purchaseItem(item);
  };

  const handleSellItem = (item: Item) => {
    if (!item.canSell) {
      alert('Cannot sell this item (used or broken)');
      return;
    }

    hideTooltip();
    sellItem(item);
  };

  const handleBuyBackItem = (item: Item) => {
    if (player.items.length >= GAME_CONSTANTS.MAX_ITEMS) {
      alert('Cannot buy more items! Maximum 15 items.');
      return;
    }

    if (player.stats.money < item.price) {
      alert('Not enough money!');
      return;
    }

    hideTooltip();

    // Buy back the sold item
    purchaseItem(item);

    // Remove from sold items list
    const soldIndex = gameState.soldItems.findIndex((i) => i.id === item.id);
    if (soldIndex !== -1) {
      gameState.soldItems.splice(soldIndex, 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold">
            Round {currentRound} / {maxRounds}
          </div>

          <div className="flex items-center gap-6">
            <div className="text-xl">
              Lives:{' '}
              {Array.from({ length: player.stats.lives }).map((_, i) => (
                <span key={i} className="text-red-500">
                  ❤
                </span>
              ))}
            </div>

            {/* Skills */}
            <div className="flex items-center gap-1 text-xl">
              <span className="mr-1">Skills:</span>
              {allSkills.map((skill) => {
                const appliedSkill = persistentData.permanentSkills.find(s => s.skillId === skill.id);
                const currentLevel = appliedSkill?.level || 0;
                const canAfford = persistentData.totalSkillPoints >= skill.cost;
                const isMaxed = currentLevel >= skill.maxLevel;
                const skillIcon = getSkillIcon(skill.id);

                return (
                  <SkillHoverWrapper
                    key={skill.id}
                    skill={skill}
                    currentLevel={currentLevel}
                    canAfford={canAfford}
                    isMaxed={isMaxed}
                  >
                    <div
                      className="relative cursor-pointer"
                      onClick={() => {
                        if (!isMaxed && canAfford) {
                          if (purchaseSkill(skill.id)) {
                            // Success
                          } else {
                            alert('Cannot purchase skill!');
                          }
                        }
                      }}
                    >
                      <span className="text-2xl">{skillIcon}</span>
                      {currentLevel > 0 && (
                        <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-purple-400">
                          {currentLevel}
                        </div>
                      )}
                    </div>
                  </SkillHoverWrapper>
                );
              })}
              <span className="text-xs text-purple-300 ml-1">({persistentData.totalSkillPoints} pts)</span>
            </div>

            <div className="text-2xl font-bold text-yellow-400">
              {formatMoney(player.stats.money)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shop Grid (3x3) */}
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 self-start">Shop</h2>
            <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
              {[...playerShopInventory].sort((a, b) => b.price - a.price).map((item) => {
                const isPurchased = purchasedShopItemIds.includes(item.id);
                return isPurchased ? (
                  <div key={item.id} className="card bg-gray-800 border-gray-700 h-32"></div>
                ) : (
                  <ItemHoverWrapper key={item.id} item={item} showPrice>
                    <ItemCard
                      item={item}
                      showPrice
                      onClick={() => handleBuyItem(item)}
                      disabled={
                        player.stats.money < item.price ||
                        player.items.length >= GAME_CONSTANTS.MAX_ITEMS
                      }
                    />
                  </ItemHoverWrapper>
                );
              })}

              {/* Fill empty slots */}
              {Array.from({ length: Math.max(0, 9 - playerShopInventory.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="card bg-gray-800 border-gray-700 h-32"></div>
              ))}
            </div>

            {/* Sold Items Section */}
            {soldItems.length > 0 && (
              <div className="w-full max-w-2xl mt-6">
                <h3 className="text-lg font-bold mb-3">Sold Items</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[...soldItems].sort((a, b) => b.price - a.price).map((item, index) => (
                    <ItemHoverWrapper key={`${item.id}-sold-${index}`} item={item} showPrice>
                      <ItemCard
                        item={item}
                        showPrice
                        onClick={() => handleBuyBackItem(item)}
                        disabled={
                          player.stats.money < item.price ||
                          player.items.length >= GAME_CONSTANTS.MAX_ITEMS
                        }
                      />
                    </ItemHoverWrapper>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Inventory & Stats */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              Inventory ({player.items.length}/{GAME_CONSTANTS.MAX_ITEMS})
            </h2>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {player.items.map((item) => (
                <ItemHoverWrapper key={item.id} item={item} showPrice>
                  <ItemCard
                    item={item}
                    onClick={() => handleSellItem(item)}
                  />
                </ItemHoverWrapper>
              ))}
            </div>

            {/* Player Stats */}
            <div className="card mb-4">
              <h3 className="text-lg font-bold mb-3">Player Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">HP:</span>
                  <span>
                    {player.stats.currentHP} / {player.stats.maxHP}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-400">Attack:</span>
                  <span>{calculateTotalAttack(player)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-400">Defense:</span>
                  <span>{calculateTotalDefense(player)}</span>
                </div>
              </div>
            </div>

            {/* Transaction Log */}
            <div className="card mb-4">
              <h3 className="text-lg font-bold mb-3">Transaction Log</h3>
              <div className="space-y-1 text-xs max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                {shopTransactionLog.length === 0 ? (
                  <div className="text-gray-500 text-center py-2">No transactions yet</div>
                ) : (
                  [...shopTransactionLog].reverse().map((transaction, idx) => (
                    <TransactionLogEntry key={idx} transaction={transaction} />
                  ))
                )}
              </div>
            </div>

            {/* Ready Button */}
            <Button variant="success" onClick={startBattle} className="w-full text-lg py-4">
              Ready for Battle! ⚔️
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TransactionLogEntry({ transaction }: { transaction: ShopTransaction }) {
  const { showTooltip, hideTooltip } = useItemTooltip();

  if (transaction.type === 'money_received') {
    return (
      <div className="flex items-center gap-2 text-green-400 py-1 border-b border-gray-700">
        <span className="text-lg">💰</span>
        <span>Round {transaction.round}:</span>
        <span className="font-semibold">+{formatMoney(transaction.amount || 0)}</span>
      </div>
    );
  }

  if (transaction.type === 'item_bought' && transaction.item) {
    return (
      <div
        className="flex items-center gap-2 text-blue-400 py-1 border-b border-gray-700 cursor-help"
        onMouseEnter={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          showTooltip(transaction.item!, rect.left, rect.top, { showPrice: true });
        }}
        onMouseLeave={hideTooltip}
      >
        <span className="text-lg">{transaction.item.emoji}</span>
        <span>Round {transaction.round}:</span>
        <span>Bought {transaction.item.name}</span>
        <span className="text-red-400 ml-auto">-{formatMoney(transaction.item.price)}</span>
      </div>
    );
  }

  if (transaction.type === 'item_sold' && transaction.item) {
    return (
      <div
        className="flex items-center gap-2 text-yellow-400 py-1 border-b border-gray-700 cursor-help"
        onMouseEnter={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          showTooltip(transaction.item!, rect.left, rect.top, { showPrice: true });
        }}
        onMouseLeave={hideTooltip}
      >
        <span className="text-lg">{transaction.item.emoji}</span>
        <span>Round {transaction.round}:</span>
        <span>Sold {transaction.item.name}</span>
        <span className="text-green-400 ml-auto">+{formatMoney(Math.floor(transaction.item.price / 2))}</span>
      </div>
    );
  }

  return null;
}

function calculateTotalAttack(player: Player): number {
  let total = player.stats.baseAttack;
  for (const item of player.items) {
    total += item.baseAttack;
  }
  return total;
}

function calculateTotalDefense(player: Player): number {
  let total = player.stats.baseDefense;
  for (const item of player.items) {
    total += item.baseDefense;
  }
  return total;
}

function getSkillIcon(skillId: string): string {
  switch (skillId) {
    case 'base_attack':
      return '⚔️';
    case 'base_defense':
      return '🛡️';
    case 'max_hp':
      return '❤️';
    case 'starting_money':
      return '💰';
    case 'money_per_round':
      return '💵';
    case 'attack_multiplier':
      return '💪';
    case 'defense_multiplier':
      return '🏰';
    default:
      return '⭐';
  }
}
