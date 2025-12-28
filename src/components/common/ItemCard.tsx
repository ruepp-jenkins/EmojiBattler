import { Item } from '@core/types/Item';
import { getRarityBorderClass, getRarityBgClass, getItemNameColorClass } from '@utils/colors';
import { formatMoney } from '@utils/formatting';

interface ItemCardProps {
  item: Item;
  onClick?: () => void;
  showPrice?: boolean;
  disabled?: boolean;
}

export function ItemCard({ item, onClick, showPrice = false, disabled = false }: ItemCardProps) {

  const borderClass = getRarityBorderClass(item.rarity);
  const bgClass = getRarityBgClass(item.rarity);
  const nameColorClass = getItemNameColorClass(item);
  const isBroken = item.effects.some(e => e.isBroken);

  return (
    <div
      className={`relative card ${bgClass} border-2 ${borderClass} p-3 cursor-pointer hover:scale-105 transition-transform ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${isBroken ? 'opacity-60' : ''}`}
      onClick={disabled ? undefined : onClick}
    >
      {/* Emoji */}
      <div className="text-4xl text-center mb-2">
        {item.emoji}
        {isBroken && <span className="text-sm ml-1">💔</span>}
      </div>

      {/* Name */}
      <div className={`text-sm font-semibold text-center ${nameColorClass} truncate ${isBroken ? 'line-through' : ''}`}>
        {item.name}
      </div>

      {/* Price */}
      {showPrice && (
        <div className="text-xs text-center mt-1 text-yellow-400">
          {formatMoney(item.price)}
        </div>
      )}
    </div>
  );
}
