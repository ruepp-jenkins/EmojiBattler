import { useState } from 'react';
import { useGame } from '@context/GameContext';
import { SaveManager } from '@core/save/SaveManager';
import { Difficulty, DIFFICULTY_PRESETS, DifficultyLevel } from '@core/types/Difficulty';
import { Button } from '@components/common/Button';
import { SkillsPanel } from '@components/menu/SkillsPanel';

export function MainMenu() {
  const { startNewGame, continueGame, persistentData, purchaseSkill } = useGame();
  const [showDifficultySelect, setShowDifficultySelect] = useState(false);
  const [showSkills, setShowSkills] = useState(false);

  const hasSave = SaveManager.hasSave();
  const saveInfo = SaveManager.getSaveInfo();

  const handleStartGame = (level: DifficultyLevel, tormentLevel?: number) => {
    const difficultyPreset = DIFFICULTY_PRESETS[level];
    const difficulty: Difficulty = {
      level,
      tormentLevel,
      ...difficultyPreset,
    };

    startNewGame(difficulty);
  };

  if (showDifficultySelect) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card">
          <h2 className="text-3xl font-bold mb-6 text-center">Select Difficulty</h2>

          <div className="space-y-4">
            <DifficultyButton
              level="normal"
              description="50% optimal AI, normal stats"
              onClick={() => handleStartGame('normal')}
            />

            <DifficultyButton
              level="hard"
              description="70% optimal AI, +10% stats, +$50"
              onClick={() => handleStartGame('hard')}
            />

            <DifficultyButton
              level="expert"
              description="85% optimal AI, +20% stats, +$100"
              onClick={() => handleStartGame('expert')}
            />

            <DifficultyButton
              level="master"
              description="95% optimal AI, +30% stats, +$150"
              onClick={() => handleStartGame('master')}
            />

            <DifficultyButton
              level="torment"
              description="100% optimal AI, +50% stats, +$200 (Hardest!)"
              onClick={() => handleStartGame('torment', 1)}
            />
          </div>

          <div className="mt-6">
            <Button variant="secondary" onClick={() => setShowDifficultySelect(false)}>
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showSkills) {
    return (
      <SkillsPanel
        totalSkillPoints={persistentData.totalSkillPoints}
        permanentSkills={persistentData.permanentSkills}
        onPurchaseSkill={purchaseSkill}
        onClose={() => setShowSkills(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold mb-4">⚔️ EmojyBattler ⚔️</h1>
        <p className="text-xl text-gray-400 mb-8">Auto Battler Game</p>

        <div className="space-y-4">
          <Button variant="primary" onClick={() => setShowDifficultySelect(true)} className="w-full">
            Start New Game
          </Button>

          {hasSave && (
            <Button variant="success" onClick={continueGame} className="w-full">
              Continue Game
              {saveInfo.exists && (
                <span className="block text-sm text-gray-300 mt-1">
                  Round {saveInfo.round} • {saveInfo.difficulty} • {saveInfo.lives} ❤
                </span>
              )}
            </Button>
          )}

          <Button variant="secondary" onClick={() => setShowSkills(true)} className="w-full">
            Skills ({persistentData.totalSkillPoints} points)
          </Button>

          <div className="mt-8 text-sm text-gray-500">
            <p>100 unique items • 5 difficulties • Smart AI</p>
            <p className="mt-2">Made with React + TypeScript</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DifficultyButton({
  level,
  description,
  onClick,
}: {
  level: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors text-left"
    >
      <div className="font-bold text-lg capitalize mb-1">{level}</div>
      <div className="text-sm text-gray-400">{description}</div>
    </button>
  );
}
