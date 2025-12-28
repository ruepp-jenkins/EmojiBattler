import { ReactNode } from 'react';
import { Skill } from '@core/types/Skills';
import { useSkillTooltip } from '@context/SkillTooltipContext';

interface SkillHoverWrapperProps {
  skill: Skill;
  currentLevel: number;
  isMaxed: boolean;
  canAfford: boolean;
  children: ReactNode;
}

export function SkillHoverWrapper({
  skill,
  currentLevel,
  isMaxed,
  canAfford,
  children,
}: SkillHoverWrapperProps) {
  const { showTooltip, hideTooltip } = useSkillTooltip();

  const handleMouseEnter = (e: React.MouseEvent) => {
    showTooltip(skill, currentLevel, isMaxed, canAfford, e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    hideTooltip();
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="inline-block">
      {children}
    </div>
  );
}
