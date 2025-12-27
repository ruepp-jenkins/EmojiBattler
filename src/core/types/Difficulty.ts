export type DifficultyLevel = 'normal' | 'hard' | 'expert' | 'master' | 'torment';

export interface Difficulty {
  level: DifficultyLevel;
  tormentLevel?: number; // For torment mode
  aiSkillPoints: number;
  aiMoneyBonus: number;
  aiStatMultiplier: number;
  aiOptimalPlayPercent: number; // 0-1 representing how optimal AI plays
}

export interface DifficultyProgress {
  highestWon: {
    normal: boolean;
    hard: boolean;
    expert: boolean;
    master: boolean;
    torment: number; // Highest torment level won
  };
}

export const DIFFICULTY_PRESETS: Record<DifficultyLevel, Omit<Difficulty, 'level' | 'tormentLevel'>> = {
  normal: {
    aiSkillPoints: 0,
    aiMoneyBonus: 0,
    aiStatMultiplier: 1.0,
    aiOptimalPlayPercent: 0.5,
  },
  hard: {
    aiSkillPoints: 5,
    aiMoneyBonus: 50,
    aiStatMultiplier: 1.1,
    aiOptimalPlayPercent: 0.7,
  },
  expert: {
    aiSkillPoints: 10,
    aiMoneyBonus: 100,
    aiStatMultiplier: 1.2,
    aiOptimalPlayPercent: 0.85,
  },
  master: {
    aiSkillPoints: 15,
    aiMoneyBonus: 150,
    aiStatMultiplier: 1.3,
    aiOptimalPlayPercent: 0.95,
  },
  torment: {
    aiSkillPoints: 20,
    aiMoneyBonus: 200,
    aiStatMultiplier: 1.5,
    aiOptimalPlayPercent: 1.0,
  },
};
