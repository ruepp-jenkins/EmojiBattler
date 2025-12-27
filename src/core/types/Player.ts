import { Item } from './Item';
import { AppliedSkill } from './Skills';
import { Difficulty } from './Difficulty';

export interface PlayerStats {
  baseAttack: number;
  baseDefense: number;
  currentHP: number;
  maxHP: number;
  speed: number;
  attackCount: number;
  lives: number;
  money: number;

  // Accumulated stats for game over screen
  totalDamageDealt: number;
  totalDamageReceived: number;
  totalDamageBlocked: number;
  totalMoneySpent: number;
  totalItemsBought: number;
}

export interface Player {
  stats: PlayerStats;
  items: Item[];
  skills: AppliedSkill[];
  isAI: boolean;
  difficulty?: Difficulty;
}

export interface PlayerCalculatedStats {
  totalAttack: number;
  totalDefense: number;
  defensePercent: number; // Capped at 0.9
  attackMultiplier: number;
  defenseMultiplier: number;
  breakdown: {
    base: { attack: number; defense: number };
    skills: { attack: number; defense: number };
    items: { attack: number; defense: number };
  };
}
