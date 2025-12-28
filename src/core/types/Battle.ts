import { Player } from './Player';

export type BattleEventType =
  | 'attack'
  | 'block'
  | 'effect'
  | 'speedIncrease'
  | 'damageMultiplier'
  | 'heal'
  | 'turnStart'
  | 'turnEnd';

export interface BattleEventDetail {
  itemId?: string;
  itemName?: string;
  itemEmoji?: string;
  rawDamage?: number;
  blockAmount?: number;
  blockPercent?: number;
  finalDamage?: number;
  healAmount?: number;
  healer?: 'player' | 'opponent'; // Track who is doing the healing
  effectDescription?: string;
}

export interface BattleEvent {
  turn: number;
  attacker: 'player' | 'opponent';
  type: BattleEventType;
  details: BattleEventDetail[];
  currentPlayerHP?: number;
  currentOpponentHP?: number;
  message: string;
}

export interface BattleState {
  round: number;
  turn: number;
  player: Player;
  opponent: Player;
  events: BattleEvent[];
  isComplete: boolean;
  winner?: 'player' | 'opponent' | 'draw';
  playerHPHistory: number[];
  opponentHPHistory: number[];
  speedMultiplier: number;
  damageMultiplier: number;
}
