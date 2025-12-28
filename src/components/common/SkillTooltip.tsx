import { useEffect, useRef, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AppliedSkill } from '@core/types/Skills';
import { getSkillEmoji, getSkillTooltipInfo } from '@utils/skillDisplay';

interface SkillTooltipProps {
  skill: AppliedSkill;
  children: ReactNode;
}

export function SkillTooltip({ skill, children }: SkillTooltipProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const skillInfo = getSkillTooltipInfo(skill);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Calculate position when tooltip appears or mouse moves
  useEffect(() => {
    if (isHovering && tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const VIEWPORT_MARGIN = 8;
      const CURSOR_OFFSET = 12;

      let x = mousePos.x + CURSOR_OFFSET;
      let y = mousePos.y + CURSOR_OFFSET;

      // Check if tooltip would overflow right edge
      if (x + tooltipRect.width > viewportWidth - VIEWPORT_MARGIN) {
        x = mousePos.x - tooltipRect.width - CURSOR_OFFSET;
      }

      // Check if tooltip would overflow left edge
      if (x < VIEWPORT_MARGIN) {
        x = VIEWPORT_MARGIN;
      }

      // Check if tooltip would overflow bottom edge
      if (y + tooltipRect.height > viewportHeight - VIEWPORT_MARGIN) {
        y = mousePos.y - tooltipRect.height - CURSOR_OFFSET;
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
  }, [isHovering, mousePos]);

  const tooltip = isHovering ? (
    <div
      ref={tooltipRef}
      className="fixed z-[9999] bg-gray-900 border-2 border-purple-600 rounded-lg p-3 shadow-xl w-64 pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="text-lg font-bold mb-2 flex items-center gap-2">
        <span className="text-2xl">{getSkillEmoji(skill.skillId)}</span>
        <span className="text-purple-400">{skillInfo.name}</span>
      </div>

      <div className="text-sm mb-2">
        <span className="text-gray-400">Level:</span>{' '}
        <span className="text-white font-bold">{skillInfo.level}</span>
        <span className="text-gray-500"> / {skillInfo.maxLevel}</span>
      </div>

      <div className="border-t border-gray-700 pt-2 mt-2">
        <div className="text-sm text-green-400 font-semibold mb-1">Current Effect:</div>
        <div className="text-sm text-white">{skillInfo.totalEffect}</div>
      </div>

      <div className="text-xs text-gray-400 mt-2 italic border-t border-gray-700 pt-2">
        {skillInfo.description}
      </div>
    </div>
  ) : null;

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="inline-block"
      >
        {children}
      </div>
      {tooltip && createPortal(tooltip, document.body)}
    </>
  );
}
