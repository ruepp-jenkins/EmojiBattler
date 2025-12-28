import { createContext, useContext, useState, ReactNode } from 'react';
import { Skill } from '@core/types/Skills';

interface SkillTooltipState {
  skill: Skill | null;
  currentLevel: number;
  isMaxed: boolean;
  canAfford: boolean;
  mouseX: number;
  mouseY: number;
}

interface SkillTooltipContextType {
  tooltipState: SkillTooltipState;
  showTooltip: (
    skill: Skill,
    currentLevel: number,
    isMaxed: boolean,
    canAfford: boolean,
    mouseX: number,
    mouseY: number
  ) => void;
  hideTooltip: () => void;
}

const SkillTooltipContext = createContext<SkillTooltipContextType | undefined>(undefined);

export function SkillTooltipProvider({ children }: { children: ReactNode }) {
  const [tooltipState, setTooltipState] = useState<SkillTooltipState>({
    skill: null,
    currentLevel: 0,
    isMaxed: false,
    canAfford: false,
    mouseX: 0,
    mouseY: 0,
  });

  const showTooltip = (
    skill: Skill,
    currentLevel: number,
    isMaxed: boolean,
    canAfford: boolean,
    mouseX: number,
    mouseY: number
  ) => {
    setTooltipState({
      skill,
      currentLevel,
      isMaxed,
      canAfford,
      mouseX,
      mouseY,
    });
  };

  const hideTooltip = () => {
    setTooltipState({
      skill: null,
      currentLevel: 0,
      isMaxed: false,
      canAfford: false,
      mouseX: 0,
      mouseY: 0,
    });
  };

  return (
    <SkillTooltipContext.Provider value={{ tooltipState, showTooltip, hideTooltip }}>
      {children}
    </SkillTooltipContext.Provider>
  );
}

export function useSkillTooltip() {
  const context = useContext(SkillTooltipContext);
  if (context === undefined) {
    throw new Error('useSkillTooltip must be used within a SkillTooltipProvider');
  }
  return context;
}
