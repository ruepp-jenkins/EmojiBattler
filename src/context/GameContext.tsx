import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameState, PersistentData } from '@core/types/GameState';
import { Difficulty } from '@core/types/Difficulty';
import { Item } from '@core/types/Item';
import { GameEngine } from '@core/GameEngine';
import { SaveManager } from '@core/save/SaveManager';
import { SkillManager } from '@core/skills/SkillManager';

interface GameContextType {
  gameState: GameState | null;
  persistentData: PersistentData;

  // Actions
  startNewGame: (difficulty: Difficulty) => void;
  continueGame: () => void;
  purchaseItem: (item: Item) => boolean;
  sellItem: (item: Item) => boolean;
  startBattle: () => void;
  transitionToSummary: () => void;
  endRound: () => void;
  saveGame: () => void;
  loadGame: () => void;
  returnToMenu: () => void;
  purchaseSkill: (skillId: string) => boolean;
  importSaveGame: (saveGame: import('@core/types/GameState').SaveGame) => void;
  getCurrentSaveGame: () => import('@core/types/GameState').SaveGame | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [persistentData, setPersistentData] = useState<PersistentData>(() => {
    const loaded = SaveManager.loadPersistentData();
    return loaded || {
      difficultyProgress: {
        highestWon: {
          normal: false,
          hard: false,
          expert: false,
          master: false,
          torment: 0,
        },
      },
      totalSkillPoints: 0,
      permanentSkills: [],
    };
  });

  // Auto-save on state changes
  useEffect(() => {
    if (gameState) {
      SaveManager.saveToLocalStorage(gameState, persistentData);
    }
  }, [gameState, persistentData]);

  const startNewGame = (difficulty: Difficulty) => {
    const newGame = GameEngine.initializeGame(difficulty, persistentData.permanentSkills);
    setGameState(newGame);
  };

  const continueGame = () => {
    const savedGame = SaveManager.loadFromLocalStorage();
    if (savedGame) {
      setGameState(savedGame.gameState);
      setPersistentData({
        difficultyProgress: savedGame.difficultyProgress,
        totalSkillPoints: savedGame.totalSkillPoints,
        permanentSkills: savedGame.permanentSkills,
      });
    }
  };

  const purchaseItem = (item: Item): boolean => {
    if (!gameState) return false;

    const success = GameEngine.purchaseItem(gameState, item);
    if (success) {
      setGameState({ ...gameState });
    }
    return success;
  };

  const sellItem = (item: Item): boolean => {
    if (!gameState) return false;

    const success = GameEngine.sellItem(gameState, item);
    if (success) {
      setGameState({ ...gameState });
    }
    return success;
  };

  const startBattle = () => {
    if (!gameState) return;

    GameEngine.startBattle(gameState);
    setGameState({ ...gameState });
  };

  const transitionToSummary = () => {
    if (!gameState) return;

    gameState.phase = 'summary';
    setGameState({ ...gameState });
  };

  const endRound = () => {
    if (!gameState) return;

    GameEngine.endRound(gameState);

    // Check if game is over
    if (gameState.phase === 'gameOver') {
      // Award skill points if won
      if (gameState.currentRound >= gameState.maxRounds) {
        const skillPointsEarned = gameState.skillPoints;
        const newProgress = GameEngine.updateDifficultyProgress(
          persistentData.difficultyProgress,
          gameState.difficulty,
          true
        );

        setPersistentData({
          ...persistentData,
          totalSkillPoints: persistentData.totalSkillPoints + skillPointsEarned,
          difficultyProgress: newProgress,
        });
      }
    }

    setGameState({ ...gameState });
  };

  const saveGame = () => {
    if (gameState) {
      SaveManager.saveToLocalStorage(gameState, persistentData);
    }
  };

  const loadGame = () => {
    continueGame();
  };

  const returnToMenu = () => {
    setGameState(null);
  };

  const purchaseSkill = (skillId: string): boolean => {
    const result = SkillManager.purchaseSkill(
      skillId,
      persistentData.permanentSkills,
      persistentData.totalSkillPoints
    );

    if (result.success && result.updatedSkills && result.remainingPoints !== undefined) {
      setPersistentData({
        ...persistentData,
        permanentSkills: result.updatedSkills,
        totalSkillPoints: result.remainingPoints,
      });
      SaveManager.savePersistentData({
        ...persistentData,
        permanentSkills: result.updatedSkills,
        totalSkillPoints: result.remainingPoints,
      });
      return true;
    }

    return false;
  };

  const importSaveGame = (saveGame: import('@core/types/GameState').SaveGame) => {
    setGameState(saveGame.gameState);
    setPersistentData({
      difficultyProgress: saveGame.difficultyProgress,
      totalSkillPoints: saveGame.totalSkillPoints,
      permanentSkills: saveGame.permanentSkills,
    });
    SaveManager.saveToLocalStorage(saveGame.gameState, {
      difficultyProgress: saveGame.difficultyProgress,
      totalSkillPoints: saveGame.totalSkillPoints,
      permanentSkills: saveGame.permanentSkills,
    });
  };

  const getCurrentSaveGame = (): import('@core/types/GameState').SaveGame | null => {
    if (!gameState) return null;

    return {
      version: '1.0.0',
      gameState,
      difficultyProgress: persistentData.difficultyProgress,
      totalSkillPoints: persistentData.totalSkillPoints,
      permanentSkills: persistentData.permanentSkills,
      timestamp: Date.now(),
    };
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        persistentData,
        startNewGame,
        continueGame,
        purchaseItem,
        sellItem,
        startBattle,
        transitionToSummary,
        endRound,
        saveGame,
        loadGame,
        returnToMenu,
        purchaseSkill,
        importSaveGame,
        getCurrentSaveGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
