import { ShopTransaction } from '@core/types/GameState';
import { Player } from '@core/types/Player';
import { formatMoney } from '@utils/formatting';
import { GAME_CONSTANTS } from '@utils/constants';
import { ItemHoverWrapper } from './ItemHoverWrapper';
import { ItemMiniCard } from '@components/battle/ItemMiniCard';

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewType: 'player' | 'opponent';
  transactions: ShopTransaction[];
  currentRound: number;
  maxRounds: number;
  opponent?: Player;
}

export function TransactionHistoryModal({
  isOpen,
  onClose,
  viewType,
  transactions,
  currentRound,
  maxRounds,
  opponent,
}: TransactionHistoryModalProps) {
  if (!isOpen) return null;

  const isPlayerHistory = viewType === 'player';
  const title = isPlayerHistory ? '💰 Your Transaction History' : '🤖 Opponent Transaction History';
  const nextRoundIncome = GAME_CONSTANTS.MONEY_PER_ROUND;

  // Filter transactions by source
  const filteredTransactions = transactions.filter(t => t.source === viewType);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg p-6 w-[640px] max-h-[80vh] overflow-y-auto border-2 border-yellow-600"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-yellow-400">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Info box at top - income for player, current money for opponent */}
        {isPlayerHistory ? (
          currentRound < maxRounds && (
            <div className="bg-green-900/20 border border-green-600 rounded-lg p-3 mb-4">
              <div className="text-sm text-gray-400 mb-1">Next Shop Phase Income</div>
              <div className="text-xl font-bold text-green-400">+{formatMoney(nextRoundIncome)}</div>
            </div>
          )
        ) : (
          opponent && (
            <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-3 mb-4">
              <div className="text-sm text-gray-400 mb-1">Current Money</div>
              <div className="text-xl font-bold text-yellow-400">{formatMoney(opponent.stats.money)}</div>
            </div>
          )
        )}

        <div className="space-y-4">
          {/* Transaction history by round */}
          {[...Array(currentRound)].map((_, roundIndex) => {
            const round = roundIndex + 1;
            const roundTransactions = filteredTransactions.filter(t => t.round === round);

            if (roundTransactions.length === 0) return null;

            return (
              <div key={round} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="text-lg font-bold text-purple-400 mb-3">Round {round}</div>
                <div className="space-y-2">
                  {roundTransactions.map((transaction, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {transaction.type === 'money_received' && (
                        <>
                          <span className="text-green-400">💵</span>
                          <span className="text-gray-300">
                            Received {formatMoney(transaction.amount!)}
                          </span>
                        </>
                      )}
                      {transaction.type === 'item_bought' && transaction.item && (
                        <>
                          <span className="text-green-400">✓</span>
                          <ItemHoverWrapper item={transaction.item}>
                            <ItemMiniCard item={transaction.item} />
                          </ItemHoverWrapper>
                          <span className="text-gray-400">
                            -{formatMoney(transaction.item.price)}
                          </span>
                        </>
                      )}
                      {transaction.type === 'item_sold' && transaction.item && (
                        <>
                          <span className="text-red-400">✗</span>
                          <ItemHoverWrapper item={transaction.item}>
                            <div className="relative inline-block">
                              <ItemMiniCard item={transaction.item} />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-0.5 bg-red-500 rotate-[-15deg]"></div>
                              </div>
                            </div>
                          </ItemHoverWrapper>
                          <span className="text-green-400">
                            +{formatMoney(Math.floor(transaction.item.price * 0.5))}
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Show current items for opponent if no transactions yet */}
          {!isPlayerHistory && opponent && filteredTransactions.length === 0 && (
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="text-lg font-bold text-red-400 mb-3">Current Items ({opponent.items.length}/15)</div>
              <div className="space-y-2">
                {opponent.items.map((item) => (
                  <ItemHoverWrapper key={item.id} item={item}>
                    <ItemMiniCard item={item} />
                  </ItemHoverWrapper>
                ))}
                {opponent.items.length === 0 && (
                  <div className="text-gray-500 text-sm text-center py-2">No items</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
