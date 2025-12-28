import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSkillTooltip } from '@context/SkillTooltipContext';
import { formatMoney } from '@utils/formatting';

export function SkillTooltipDisplay() {
  const { tooltipState } = useSkillTooltip();
  const { skill, currentLevel, isMaxed, canAfford, mouseX, mouseY } = tooltipState;
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Calculate position when tooltip appears or changes
  useEffect(() => {
    if (skill && tooltipRef.current) {
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
  }, [skill, mouseX, mouseY]);

  // Don't render if no skill
  if (!skill) return null;

  const nextValue = skill.effect.value * (currentLevel + 1);
  const currentValue = skill.effect.value * currentLevel;

  const getEffectDescription = () => {
    switch (skill.effect.type) {
      case 'baseAttack':
        return currentLevel > 0
          ? `+${currentValue} → +${nextValue} base attack`
          : `+${nextValue} base attack`;
      case 'baseDefense':
        return currentLevel > 0
          ? `+${currentValue} → +${nextValue} base defense`
          : `+${nextValue} base defense`;
      case 'maxHP':
        return currentLevel > 0
          ? `+${currentValue} → +${nextValue} max HP`
          : `+${nextValue} max HP`;
      case 'startingMoney':
        return currentLevel > 0
          ? `+${formatMoney(currentValue)} → +${formatMoney(nextValue)} starting money`
          : `+${formatMoney(nextValue)} starting money`;
      case 'moneyPerRound':
        return currentLevel > 0
          ? `+${formatMoney(currentValue)} → +${formatMoney(nextValue)} per round`
          : `+${formatMoney(nextValue)} per round`;
      case 'attackMultiplier':
        const currentPercent = Math.round(currentValue * 100);
        const nextPercent = Math.round(nextValue * 100);
        return currentLevel > 0
          ? `+${currentPercent}% → +${nextPercent}% attack multiplier`
          : `+${nextPercent}% attack multiplier`;
      case 'defenseMultiplier':
        const currentDefPercent = Math.round(currentValue * 100);
        const nextDefPercent = Math.round(nextValue * 100);
        return currentLevel > 0
          ? `+${currentDefPercent}% → +${nextDefPercent}% defense multiplier`
          : `+${nextDefPercent}% defense multiplier`;
      default:
        return 'Unknown effect';
    }
  };

  const getSkillIcon = (skillId: string): string => {
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
  };

  const tooltip = (
    <div
      ref={tooltipRef}
      className="fixed z-[9999] bg-gray-900 border-2 border-purple-600 rounded-lg p-3 shadow-xl w-64 pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="text-lg font-bold mb-2 flex items-center gap-2">
        <span className="text-2xl">{getSkillIcon(skill.id)}</span>
        <span className="text-purple-400">{skill.name}</span>
      </div>

      <div className="text-sm mb-2">
        <span className="text-gray-400">Level:</span>{' '}
        <span className={`font-bold ${isMaxed ? 'text-yellow-400' : 'text-purple-300'}`}>
          {currentLevel} / {skill.maxLevel}
        </span>
        {isMaxed && <span className="text-yellow-400 ml-2">✨ MAX</span>}
      </div>

      <div className="text-sm mb-2">
        <span className="text-gray-400">Cost:</span>{' '}
        <span className="text-purple-300 font-bold">{skill.cost} pts</span>
      </div>

      <div className="text-sm border-t border-gray-700 pt-2 mt-2 mb-2">
        <div className="text-gray-400 mb-1 text-xs font-semibold">Effect:</div>
        <div className="text-gray-300">{getEffectDescription()}</div>
      </div>

      <div className="text-xs text-gray-400 italic border-t border-gray-700 pt-2">
        {skill.description}
      </div>

      {!isMaxed && !canAfford && (
        <div className="text-xs text-red-400 mt-2 border-t border-gray-700 pt-2">
          Not enough skill points
        </div>
      )}

      {!isMaxed && canAfford && (
        <div className="text-xs text-green-400 font-bold mt-2 border-t border-gray-700 pt-2">
          Click to upgrade!
        </div>
      )}
    </div>
  );

  // Render tooltip using portal to document body
  return createPortal(tooltip, document.body);
}
