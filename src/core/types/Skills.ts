export type SkillEffectType =
  | 'baseAttack'
  | 'baseDefense'
  | 'startingMoney'
  | 'maxHP'
  | 'attackMultiplier'
  | 'defenseMultiplier'
  | 'moneyPerRound';

export interface SkillEffect {
  type: SkillEffectType;
  value: number; // Per level
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  cost: number;
  maxLevel: number;
  effect: SkillEffect;
}

export interface AppliedSkill {
  skillId: string;
  level: number;
}
