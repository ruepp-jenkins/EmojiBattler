import { useState, useRef, useEffect } from 'react';
import { Item } from '@core/types/Item';
import { getRarityBorderClass, getRarityBgClass, getItemNameColorClass } from '@utils/colors';
import { formatMoney } from '@utils/formatting';

interface ItemCardProps {
  item: Item;
  onClick?: () => void;
  showPrice?: boolean;
  disabled?: boolean;
  hideTooltip?: boolean;
}

export function ItemCard({ item, onClick, showPrice = false, disabled = false, hideTooltip = false }: ItemCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
    x: number;
    y: number;
  }>({ vertical: 'top', horizontal: 'center', x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Calculate tooltip position to keep it in viewport
  useEffect(() => {
    if (showTooltip && !hideTooltip && cardRef.current && tooltipRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Vertical positioning: check both top and bottom space
      let vertical: 'top' | 'bottom' = 'top';
      const spaceAbove = cardRect.top;
      const spaceBelow = viewportHeight - cardRect.bottom;

      if (spaceAbove < tooltipRect.height + 8 && spaceBelow > spaceAbove) {
        vertical = 'bottom';
      }

      // Horizontal positioning: check left and right overflow
      let horizontal: 'left' | 'center' | 'right' = 'center';
      const cardCenter = cardRect.left + cardRect.width / 2;
      const tooltipHalfWidth = tooltipRect.width / 2;

      if (cardCenter - tooltipHalfWidth < 8) {
        horizontal = 'left'; // Align left edge to card left
      } else if (cardCenter + tooltipHalfWidth > viewportWidth - 8) {
        horizontal = 'right'; // Align right edge to card right
      }

      // Calculate pixel positions for fixed positioning
      let x = 0;
      let y = 0;

      if (horizontal === 'center') {
        x = cardCenter - tooltipHalfWidth;
      } else if (horizontal === 'left') {
        x = cardRect.left;
      } else {
        x = cardRect.right - tooltipRect.width;
      }

      if (vertical === 'top') {
        y = cardRect.top - tooltipRect.height - 8;
      } else {
        y = cardRect.bottom + 8;
      }

      setTooltipPosition({ vertical, horizontal, x, y });
    }
  }, [showTooltip, hideTooltip]);

  const borderClass = getRarityBorderClass(item.rarity);
  const bgClass = getRarityBgClass(item.rarity);
  const nameColorClass = getItemNameColorClass(item);

  // Check if item has broken effects
  const isBroken = item.effects.some(e => e.isBroken);

  // Calculate total stat boosts from base stats and effects
  const totalAttack = item.baseAttack + item.effects
    .filter(e => e.effectType === 'damage' && (!e.trigger || e.trigger === 'Passive'))
    .reduce((sum, e) => sum + (e.value || 0), 0);

  const totalDefense = item.baseDefense + item.effects
    .filter(e => e.effectType === 'block' && (!e.trigger || e.trigger === 'Passive'))
    .reduce((sum, e) => sum + (e.value || 0), 0);

  return (
    <div
      ref={cardRef}
      className={`relative card ${bgClass} border-2 ${borderClass} p-3 cursor-pointer hover:scale-105 transition-transform ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${isBroken ? 'opacity-60' : ''}`}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !hideTooltip && setShowTooltip(true)}
      onMouseLeave={() => !hideTooltip && setShowTooltip(false)}
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

      {/* Tooltip */}
      {showTooltip && !hideTooltip && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] opacity-100 bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl w-64"
          style={{
            zIndex: 99999,
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`
          }}
        >
          <div className="text-lg font-bold mb-2 flex items-center gap-2">
            <span className="text-2xl">{item.emoji}</span>
            <span className={nameColorClass}>{item.name}</span>
          </div>

          <div className="text-sm mb-2">
            <span className="text-gray-400">Type:</span>{' '}
            <span className="capitalize">{item.type}</span>
          </div>

          {/* Base Stats */}
          {(item.baseAttack > 0 || item.baseDefense > 0) && (
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="text-xs text-gray-400 mb-1 font-semibold">Base Stats:</div>
              {item.baseAttack > 0 && (
                <div className="text-sm">
                  <span className="text-red-400">Attack:</span> +{item.baseAttack}
                </div>
              )}
              {item.baseDefense > 0 && (
                <div className="text-sm">
                  <span className="text-blue-400">Defense:</span> +{item.baseDefense}
                </div>
              )}
            </div>
          )}

          {/* Total Stats (including effects) */}
          {(totalAttack > item.baseAttack || totalDefense > item.baseDefense) && (
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="text-xs text-yellow-400 mb-1 font-semibold">Total Stats (with effects):</div>
              {totalAttack > 0 && (
                <div className="text-sm font-bold">
                  <span className="text-red-300">Total Attack:</span> +{totalAttack}
                </div>
              )}
              {totalDefense > 0 && (
                <div className="text-sm font-bold">
                  <span className="text-blue-300">Total Defense:</span> +{totalDefense}
                </div>
              )}
            </div>
          )}

          {item.effects.length > 0 && (
            <div className="text-sm mt-2">
              <div className="text-gray-400 mb-1">Effects:</div>
              {item.effects.map((effect, idx) => (
                <div key={idx} className="text-xs text-gray-300 ml-2">
                  • {effect.effectType}
                  {effect.value && effect.effectType === 'moneyMultiplier' && ` ${effect.value}x`}
                  {effect.value && effect.effectType !== 'moneyMultiplier' && `: ${effect.value}`}
                  {effect.chance && ` (${Math.round(effect.chance * 100)}% chance)`}
                  {effect.maxDuration && (
                    <span className={effect.isBroken ? 'text-red-400' : 'text-yellow-400'}>
                      {' '}[{effect.isBroken ? 'BROKEN' : `${(effect.maxDuration - (effect.currentDuration || 0))} shops left`}]
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="text-xs text-gray-400 mt-2 italic">{item.description}</div>

          {/* Pricing */}
          {showPrice && (
            <div className="text-sm mt-2 pt-2 border-t border-gray-700 space-y-1">
              <div className="text-yellow-400 font-bold">
                Buy Price: {formatMoney(item.price)}
              </div>
              {item.canSell && (
                <div className="text-green-400">
                  Sell Price: {formatMoney(Math.floor(item.price * 0.5))}
                </div>
              )}
            </div>
          )}

          {!item.canSell && (
            <div className="text-xs text-red-400 mt-1">Cannot sell (used/broken)</div>
          )}
        </div>
      )}
    </div>
  );
}
