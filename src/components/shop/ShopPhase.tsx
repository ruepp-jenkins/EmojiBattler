import { useState } from 'react';
import { useGame } from '@context/GameContext';
import { Item } from '@core/types/Item';
import { Player } from '@core/types/Player';
import { ItemCard } from '@components/common/ItemCard';
import { Button } from '@components/common/Button';
import { formatMoney } from '@utils/formatting';
import { GAME_CONSTANTS } from '@utils/constants';
import { getItemNameColorClass, getRarityBorderClass, getRarityBgClass } from '@utils/colors';

export function ShopPhase() {
  const { gameState, purchaseItem, sellItem, startBattle } = useGame();
  const [hoveredShopItem, setHoveredShopItem] = useState<Item | null>(null);

  if (!gameState) return null;

  const { player, shopInventory, currentRound, maxRounds } = gameState;

  const handleBuyItem = (item: Item) => {
    if (player.items.length >= GAME_CONSTANTS.MAX_ITEMS) {
      alert('Cannot buy more items! Maximum 15 items.');
      return;
    }

    if (player.stats.money < item.price) {
      alert('Not enough money!');
      return;
    }

    purchaseItem(item);
  };

  const handleSellItem = (item: Item) => {
    if (!item.canSell) {
      alert('Cannot sell this item (used or broken)');
      return;
    }

    sellItem(item);
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

            <div className="text-2xl font-bold text-yellow-400">
              {formatMoney(player.stats.money)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Hover Preview Panel */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Item Preview</h2>
            {hoveredShopItem ? (
              <div className={`card ${getRarityBgClass(hoveredShopItem.rarity)} border-2 ${getRarityBorderClass(hoveredShopItem.rarity)} p-4`}>
                <div className="text-5xl text-center mb-3">{hoveredShopItem.emoji}</div>
                <div className={`text-lg font-bold text-center mb-3 ${getItemNameColorClass(hoveredShopItem)}`}>
                  {hoveredShopItem.name}
                </div>

                <div className="text-sm mb-2">
                  <span className="text-gray-400">Type:</span>{' '}
                  <span className="capitalize">{hoveredShopItem.type}</span>
                </div>

                <div className="text-sm mb-2">
                  <span className="text-gray-400">Rarity:</span>{' '}
                  <span className="capitalize">{hoveredShopItem.rarity}</span>
                </div>

                {hoveredShopItem.baseAttack > 0 && (
                  <div className="text-sm mb-1">
                    <span className="text-red-400">Attack:</span> +{hoveredShopItem.baseAttack}
                  </div>
                )}

                {hoveredShopItem.baseDefense > 0 && (
                  <div className="text-sm mb-1">
                    <span className="text-blue-400">Defense:</span> +{hoveredShopItem.baseDefense}
                  </div>
                )}

                {hoveredShopItem.effects.length > 0 && (
                  <div className="text-sm mt-3">
                    <div className="text-gray-400 mb-1 font-semibold">Effects:</div>
                    {hoveredShopItem.effects.map((effect, idx) => (
                      <div key={idx} className="text-xs text-gray-300 ml-2 mb-1">
                        • {effect.effectType}
                        {effect.value && effect.effectType === 'moneyMultiplier' && ` ${effect.value}x`}
                        {effect.value && effect.effectType !== 'moneyMultiplier' && `: ${effect.value}`}
                        {effect.chance && ` (${Math.round(effect.chance * 100)}%)`}
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-xs text-gray-400 mt-3 italic">{hoveredShopItem.description}</div>

                <div className="text-base mt-3 text-yellow-400 font-bold text-center">
                  {formatMoney(hoveredShopItem.price)}
                </div>
              </div>
            ) : (
              <div className="card bg-gray-800 border-gray-600 p-4 h-64 flex items-center justify-center">
                <span className="text-gray-500 text-sm text-center">Hover over an item to see details</span>
              </div>
            )}
          </div>

          {/* Shop Grid (3x3) */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 self-start">Shop</h2>
            <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
              {shopInventory.map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredShopItem(item)}
                  onMouseLeave={() => setHoveredShopItem(null)}
                >
                  <ItemCard
                    item={item}
                    showPrice
                    onClick={() => handleBuyItem(item)}
                    disabled={
                      player.stats.money < item.price ||
                      player.items.length >= GAME_CONSTANTS.MAX_ITEMS
                    }
                    hideTooltip
                  />
                </div>
              ))}

              {/* Fill empty slots */}
              {Array.from({ length: Math.max(0, 9 - shopInventory.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="card bg-gray-800 border-gray-700 h-32"></div>
              ))}
            </div>
          </div>

          {/* Inventory & Stats */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              Inventory ({player.items.length}/{GAME_CONSTANTS.MAX_ITEMS})
            </h2>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {player.items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={() => handleSellItem(item)}
                />
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
