import { useState, useRef, useEffect } from 'react';
import { Item } from '@core/types/Item';
import { getRarityBorderClass, getRarityBgClass, getItemNameColorClass } from '@utils/colors';

interface ItemMiniCardProps {
  item: Item;
  showTooltip?: boolean;
}

export function ItemMiniCard({ item, showTooltip = true }: ItemMiniCardProps) {
  const [showItemTooltip, setShowItemTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Calculate tooltip position
  useEffect(() => {
    if (showItemTooltip && showTooltip && cardRef.current && tooltipRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Position to the right or left of the card
      let x = cardRect.right + 8;
      let y = cardRect.top;

      // If would overflow right edge, position to left instead
      if (x + tooltipRect.width > viewportWidth - 8) {
        x = cardRect.left - tooltipRect.width - 8;
      }

      // Ensure doesn't overflow left edge
      if (x < 8) {
        x = 8;
      }

      setTooltipPosition({ x, y });
    }
  }, [showItemTooltip, showTooltip]);

  const borderClass = getRarityBorderClass(item.rarity);
  const bgClass = getRarityBgClass(item.rarity);
  const nameColorClass = getItemNameColorClass(item);
  const isBroken = item.effects.some(e => e.isBroken);

  return (
    <div
      ref={cardRef}
      className={`relative ${bgClass} border ${borderClass} rounded p-2 flex items-center gap-2 ${
        isBroken ? 'opacity-60' : ''
      }`}
      onMouseEnter={() => showTooltip && setShowItemTooltip(true)}
      onMouseLeave={() => showTooltip && setShowItemTooltip(false)}
    >
      {/* Emoji */}
      <div className="text-2xl">
        {item.emoji}
        {isBroken && <span className="text-xs">💔</span>}
      </div>

      {/* Name and Stats */}
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-semibold truncate ${nameColorClass} ${isBroken ? 'line-through' : ''}`}>
          {item.name}
        </div>
        <div className="text-xs text-gray-400 flex gap-2">
          {item.baseAttack > 0 && <span className="text-red-400">⚔️{item.baseAttack}</span>}
          {item.baseDefense > 0 && <span className="text-blue-400">🛡️{item.baseDefense}</span>}
        </div>
      </div>

      {/* Compact Tooltip */}
      {showItemTooltip && showTooltip && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] bg-gray-900 border border-gray-700 rounded-lg p-2 shadow-xl w-48"
          style={{
            zIndex: 99999,
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`
          }}
        >
          <div className="text-sm font-bold mb-1 flex items-center gap-1">
            <span className="text-lg">{item.emoji}</span>
            <span className={nameColorClass}>{item.name}</span>
          </div>

          <div className="text-xs text-gray-400 mb-1 capitalize">{item.type}</div>

          {(item.baseAttack > 0 || item.baseDefense > 0) && (
            <div className="text-xs space-y-0.5 mb-1">
              {item.baseAttack > 0 && (
                <div>
                  <span className="text-red-400">Attack:</span> +{item.baseAttack}
                </div>
              )}
              {item.baseDefense > 0 && (
                <div>
                  <span className="text-blue-400">Defense:</span> +{item.baseDefense}
                </div>
              )}
            </div>
          )}

          {item.effects.length > 0 && (
            <div className="text-xs border-t border-gray-700 pt-1 mt-1">
              <div className="text-gray-400 mb-0.5">Effects:</div>
              {item.effects.slice(0, 3).map((effect, idx) => (
                <div key={idx} className="text-xs text-gray-300 truncate">
                  • {effect.effectType}
                  {effect.value && `: ${effect.value}`}
                </div>
              ))}
              {item.effects.length > 3 && (
                <div className="text-xs text-gray-500">... +{item.effects.length - 3} more</div>
              )}
            </div>
          )}

          <div className="text-xs text-gray-500 mt-1 italic truncate">{item.description}</div>
        </div>
      )}
    </div>
  );
}
