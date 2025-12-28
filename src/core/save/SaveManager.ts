import { SaveGame, GameState, PersistentData } from '@core/types/GameState';
import { DifficultyProgress } from '@core/types/Difficulty';
import { LOCAL_STORAGE_KEYS, GAME_CONSTANTS } from '@utils/constants';

export class SaveManager {
  /**
   * Save game to localStorage
   */
  static saveToLocalStorage(
    gameState: GameState,
    persistentData: PersistentData
  ): boolean {
    try {
      const saveGame: SaveGame = {
        version: GAME_CONSTANTS.SAVE_VERSION,
        gameState,
        difficultyProgress: persistentData.difficultyProgress,
        totalSkillPoints: persistentData.totalSkillPoints,
        permanentSkills: persistentData.permanentSkills,
        timestamp: Date.now(),
      };

      const saveString = JSON.stringify(saveGame);
      localStorage.setItem(LOCAL_STORAGE_KEYS.SAVE_GAME, saveString);

      // Also save persistent data separately
      const persistentString = JSON.stringify(persistentData);
      localStorage.setItem(LOCAL_STORAGE_KEYS.PERSISTENT_DATA, persistentString);

      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }

  /**
   * Load game from localStorage
   */
  static loadFromLocalStorage(): SaveGame | null {
    try {
      const saveString = localStorage.getItem(LOCAL_STORAGE_KEYS.SAVE_GAME);

      if (!saveString) {
        return null;
      }

      const saveGame = JSON.parse(saveString) as SaveGame;

      // Validate save game
      if (!this.validateSave(saveGame)) {
        console.error('Invalid save game');
        return null;
      }

      // Check version and migrate if needed
      if (saveGame.version !== GAME_CONSTANTS.SAVE_VERSION) {
        console.log(`Migrating save from ${saveGame.version} to ${GAME_CONSTANTS.SAVE_VERSION}`);
        // TODO: Implement migration logic if needed
      }

      return saveGame;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }

  /**
   * Load persistent data from localStorage
   */
  static loadPersistentData(): PersistentData | null {
    try {
      const persistentString = localStorage.getItem(LOCAL_STORAGE_KEYS.PERSISTENT_DATA);

      if (!persistentString) {
        return this.createDefaultPersistentData();
      }

      const persistentData = JSON.parse(persistentString) as PersistentData;
      return persistentData;
    } catch (error) {
      console.error('Failed to load persistent data:', error);
      return this.createDefaultPersistentData();
    }
  }

  /**
   * Create default persistent data
   */
  private static createDefaultPersistentData(): PersistentData {
    return {
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
  }

  /**
   * Check if a save exists
   */
  static hasSave(): boolean {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.SAVE_GAME) !== null;
  }

  /**
   * Delete save from localStorage
   */
  static deleteSave(): boolean {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.SAVE_GAME);
      return true;
    } catch (error) {
      console.error('Failed to delete save:', error);
      return false;
    }
  }

  /**
   * Export save game to JSON string
   */
  static exportToJSON(saveGame: SaveGame): string {
    return JSON.stringify(saveGame, null, 2);
  }

  /**
   * Import save game from JSON string
   */
  static importFromJSON(jsonString: string): SaveGame | null {
    try {
      const saveGame = JSON.parse(jsonString) as SaveGame;

      if (!this.validateSave(saveGame)) {
        console.error('Invalid save game format');
        return null;
      }

      return saveGame;
    } catch (error) {
      console.error('Failed to import save game:', error);
      return null;
    }
  }

  /**
   * Export save game to base64 encoded string (for copying)
   */
  static exportToText(saveGame: SaveGame): string {
    const json = JSON.stringify(saveGame);
    return btoa(json); // Base64 encode
  }

  /**
   * Import save game from base64 encoded string
   */
  static importFromText(textString: string): SaveGame | null {
    try {
      const json = atob(textString); // Base64 decode
      const saveGame = JSON.parse(json) as SaveGame;

      if (!this.validateSave(saveGame)) {
        console.error('Invalid save game format');
        return null;
      }

      return saveGame;
    } catch (error) {
      console.error('Failed to import save game from text:', error);
      return null;
    }
  }

  /**
   * Validate save game structure
   */
  private static validateSave(saveGame: any): saveGame is SaveGame {
    if (!saveGame || typeof saveGame !== 'object') {
      return false;
    }

    // Check required fields
    if (!saveGame.version || !saveGame.gameState || !saveGame.timestamp) {
      return false;
    }

    // Check gameState structure
    const gs = saveGame.gameState;
    if (
      !gs.phase ||
      !gs.player ||
      gs.currentRound === undefined ||
      gs.maxRounds === undefined
    ) {
      return false;
    }

    // Check player structure
    if (!gs.player.stats || !Array.isArray(gs.player.items)) {
      return false;
    }

    // Ensure shop-related arrays exist (add defaults if missing for backward compatibility)
    if (!Array.isArray(gs.playerShopInventory)) {
      gs.playerShopInventory = [];
    }
    if (!Array.isArray(gs.aiShopInventory)) {
      gs.aiShopInventory = [];
    }
    if (!Array.isArray(gs.purchasedShopItemIds)) {
      gs.purchasedShopItemIds = [];
    }
    if (!Array.isArray(gs.soldItems)) {
      gs.soldItems = [];
    }

    return true;
  }

  /**
   * Save persistent data (skills, difficulty progress)
   */
  static savePersistentData(persistentData: PersistentData): boolean {
    try {
      const persistentString = JSON.stringify(persistentData);
      localStorage.setItem(LOCAL_STORAGE_KEYS.PERSISTENT_DATA, persistentString);
      return true;
    } catch (error) {
      console.error('Failed to save persistent data:', error);
      return false;
    }
  }

  /**
   * Update persistent data after game completion
   */
  static updatePersistentData(
    current: PersistentData,
    skillPointsEarned: number,
    newProgress: DifficultyProgress
  ): PersistentData {
    return {
      ...current,
      totalSkillPoints: current.totalSkillPoints + skillPointsEarned,
      difficultyProgress: newProgress,
    };
  }

  /**
   * Download save game as file
   */
  static downloadSaveFile(saveGame: SaveGame, filename: string = 'emojybattler-save.json'): void {
    const json = this.exportToJSON(saveGame);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Read save game from file
   */
  static async readSaveFile(file: File): Promise<SaveGame | null> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const saveGame = this.importFromJSON(content);
          resolve(saveGame);
        } catch (error) {
          console.error('Failed to read save file:', error);
          resolve(null);
        }
      };

      reader.onerror = () => {
        console.error('File reading failed');
        resolve(null);
      };

      reader.readAsText(file);
    });
  }

  /**
   * Get save game info without loading full state
   */
  static getSaveInfo(): {
    exists: boolean;
    timestamp?: number;
    round?: number;
    difficulty?: string;
    lives?: number;
  } {
    const saveString = localStorage.getItem(LOCAL_STORAGE_KEYS.SAVE_GAME);

    if (!saveString) {
      return { exists: false };
    }

    try {
      const saveGame = JSON.parse(saveString) as SaveGame;

      return {
        exists: true,
        timestamp: saveGame.timestamp,
        round: saveGame.gameState.currentRound,
        difficulty: saveGame.gameState.difficulty.level,
        lives: saveGame.gameState.player.stats.lives,
      };
    } catch (error) {
      return { exists: false };
    }
  }
}
