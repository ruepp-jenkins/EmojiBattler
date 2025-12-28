import { Item } from '@core/types/Item';
import { getRarityBorderClass, getRarityBgClass, getItemNameColorClass } from '@utils/colors';
import { getItemNameWithAbilities } from '@utils/itemAbilities';

interface ItemMiniCardProps {
  item: Item;
}

export function ItemMiniCard({ item }: ItemMiniCardProps) {

  const borderClass = getRarityBorderClass(item.rarity);
  const bgClass = getRarityBgClass(item.rarity);
  const nameColorClass = getItemNameColorClass(item);
  const isBroken = item.effects.some(e => e.isBroken);

  return (
    <div
      className={`relative ${bgClass} border ${borderClass} rounded p-2 flex items-center gap-2 ${
        isBroken ? 'opacity-60' : ''
      }`}
    >
      {/* Emoji */}
      <div className="text-2xl">
        {item.emoji}
        {isBroken && <span className="text-xs">💔</span>}
      </div>

      {/* Name and Stats */}
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-semibold truncate ${nameColorClass} ${isBroken ? 'line-through' : ''}`}>
          {getItemNameWithAbilities(item)}
        </div>
        <div className="text-xs text-gray-400 flex gap-2">
          {item.baseAttack > 0 && <span className="text-red-400">⚔️{item.baseAttack}</span>}
          {item.baseDefense > 0 && <span className="text-blue-400">🛡️{item.baseDefense}</span>}
        </div>
      </div>
    </div>
  );
}
