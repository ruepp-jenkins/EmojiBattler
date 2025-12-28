import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useItemTooltip } from '@context/ItemTooltipContext';
import { getRarityBorderClass, getItemNameColorClass } from '@utils/colors';
import { formatMoney } from '@utils/formatting';
import { getItemNameWithAbilities } from '@utils/itemAbilities';

export function ItemTooltipDisplay() {
  const { tooltipState } = useItemTooltip();
  const { item, mouseX, mouseY, options } = tooltipState;
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Calculate position when tooltip appears or changes
  useEffect(() => {
    if (item && tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const VIEWPORT_MARGIN = 8;
      const CURSOR_OFFSET = 12;

      let x = mouseX + CURSOR_OFFSET;
      let y = mouseY + CURSOR_OFFSET;

      // Check if tooltip would overflow right edge
      if (x + tooltipRect.width > viewportWidth - VIEWPORT_MARGIN) {
        // Try positioning to the left of cursor
        x = mouseX - tooltipRect.width - CURSOR_OFFSET;
      }

      // Check if tooltip would overflow left edge
      if (x < VIEWPORT_MARGIN) {
        x = VIEWPORT_MARGIN;
      }

      // Check if tooltip would overflow bottom edge
      if (y + tooltipRect.height > viewportHeight - VIEWPORT_MARGIN) {
        // Try positioning above cursor
        y = mouseY - tooltipRect.height - CURSOR_OFFSET;
      }

      // Check if tooltip would overflow top edge
      if (y < VIEWPORT_MARGIN) {
        y = VIEWPORT_MARGIN;
      }

      // Clamp to viewport bounds
      const maxX = viewportWidth - tooltipRect.width - VIEWPORT_MARGIN;
      const maxY = viewportHeight - tooltipRect.height - VIEWPORT_MARGIN;
      x = Math.max(VIEWPORT_MARGIN, Math.min(x, maxX));
      y = Math.max(VIEWPORT_MARGIN, Math.min(y, maxY));

      setPosition({ x, y });
    }
  }, [item, mouseX, mouseY]);

  // Don't render if no item
  if (!item) return null;

  const borderClass = getRarityBorderClass(item.rarity);
  const nameColorClass = getItemNameColorClass(item);
  const isBroken = item.effects.some(e => e.isBroken);

  // Calculate total stats including passive effects
  const totalAttack = item.baseAttack + item.effects
    .filter(e => e.effectType === 'damage' && (!e.trigger || e.trigger === 'passive'))
    .reduce((sum, e) => sum + (e.value || 0), 0);

  const totalDefense = item.baseDefense + item.effects
    .filter(e => e.effectType === 'block' && (!e.trigger || e.trigger === 'passive'))
    .reduce((sum, e) => sum + (e.value || 0), 0);

  const tooltip = (
    <div
      ref={tooltipRef}
      className={`fixed z-[9999] bg-gray-900 border-2 ${borderClass} rounded-lg p-3 shadow-xl w-64 pointer-events-none`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="text-lg font-bold mb-2 flex items-center gap-2">
        <span className="text-2xl">
          {item.emoji}
          {isBroken && <span className="text-sm ml-1">💔</span>}
        </span>
        <span className={`${nameColorClass} ${isBroken ? 'line-through' : ''}`}>{getItemNameWithAbilities(item)}</span>
      </div>

      <div className="text-sm mb-2">
        <span className="text-gray-400">Type:</span>{' '}
        <span className="capitalize">{item.type}</span>
      </div>

      <div className="text-sm mb-2">
        <span className="text-gray-400">Rarity:</span>{' '}
        <span className="capitalize">{item.rarity}</span>
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

      {/* Effects */}
      {item.effects.length > 0 && (
        <div className="text-sm mt-2 border-t border-gray-700 pt-2">
          <div className="text-gray-400 mb-1 font-semibold">Effects:</div>
          {item.effects.map((effect, idx) => (
            <div key={idx} className="text-xs text-gray-300 ml-2 mb-1">
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

      {/* Description */}
      <div className="text-xs text-gray-400 mt-2 italic border-t border-gray-700 pt-2">
        {item.description}
      </div>

      {/* Pricing */}
      {options.showPrice && (
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

      {!item.canSell && options.showPrice && (
        <div className="text-xs text-red-400 mt-1">Cannot sell (used/broken)</div>
      )}
    </div>
  );

  // Render tooltip using portal to document body
  return createPortal(tooltip, document.body);
}
