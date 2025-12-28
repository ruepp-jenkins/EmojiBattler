import { Player } from './Player';
import { Item } from './Item';
import { BattleState } from './Battle';
import { Difficulty, DifficultyProgress } from './Difficulty';
import { AppliedSkill } from './Skills';

export type GamePhase = 'menu' | 'shop' | 'battle' | 'summary' | 'gameOver';

export interface BattleTimeline {
  round: number;
  playerWon: boolean;
  playerHP: number;
  opponentHP: number;
  lostLife: boolean;
}

export interface GameState {
  phase: GamePhase;
  currentRound: number;
  maxRounds: number;
  difficulty: Difficulty;
  player: Player;
  opponent?: Player;
  currentBattle?: BattleState;
  playerShopInventory: Item[]; // Player's shop (unique items, excludes owned items)
  aiShopInventory: Item[]; // AI's shop (unique items, excludes AI's owned items)
  skillPoints: number;
  consecutiveWins: number; // Track wins for "every Nth battle" skill point rewards
  battleTimeline: BattleTimeline[];
  gameStartTime: number;
  lastSaveTime?: number;
}

export interface SaveGame {
  version: string; // For migration compatibility
  gameState: GameState;
  difficultyProgress: DifficultyProgress;
  totalSkillPoints: number;
  permanentSkills: AppliedSkill[];
  timestamp: number;
}

export interface PersistentData {
  difficultyProgress: DifficultyProgress;
  totalSkillPoints: number;
  permanentSkills: AppliedSkill[];
}
