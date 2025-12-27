import { useGame } from '@context/GameContext';
import { Button } from '@components/common/Button';

export function BattleSummary() {
  const { gameState, endRound } = useGame();

  if (!gameState || !gameState.currentBattle) {
    return null;
  }

  const { currentBattle, player } = gameState;
  const { winner } = currentBattle;

  const playerWon = winner === 'player' || winner === 'draw';

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full card text-center">
        {/* Result */}
        {playerWon && (
          <>
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-green-400 mb-6">Victory!</h2>
          </>
        )}

        {!playerWon && (
          <>
            <div className="text-8xl mb-4">💀</div>
            <h2 className="text-4xl font-bold text-red-400 mb-6">Defeat</h2>
          </>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card bg-gray-800">
            <div className="text-sm text-gray-400">Your HP</div>
            <div className="text-2xl font-bold">{currentBattle.player.stats.currentHP}</div>
          </div>

          <div className="card bg-gray-800">
            <div className="text-sm text-gray-400">Opponent HP</div>
            <div className="text-2xl font-bold">{currentBattle.opponent.stats.currentHP}</div>
          </div>

          <div className="card bg-gray-800">
            <div className="text-sm text-gray-400">Lives Remaining</div>
            <div className="text-2xl font-bold">
              {player.stats.lives}{' '}
              {Array.from({ length: player.stats.lives }).map((_, i) => (
                <span key={i} className="text-red-500">
                  ❤
                </span>
              ))}
            </div>
          </div>

          <div className="card bg-gray-800">
            <div className="text-sm text-gray-400">Battle Turns</div>
            <div className="text-2xl font-bold">{currentBattle.turn}</div>
          </div>
        </div>

        {/* Life Loss Warning */}
        {!playerWon && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
            <div className="text-red-400 font-bold">⚠️ You lost 1 life!</div>
            {player.stats.lives === 0 && (
              <div className="text-red-300 mt-2">Game Over - No lives remaining</div>
            )}
          </div>
        )}

        {/* Continue Button */}
        <Button
          variant={playerWon ? 'success' : 'primary'}
          onClick={endRound}
          className="text-lg px-8 py-4"
        >
          {player.stats.lives > 0 ? 'Continue to Next Round' : 'View Final Stats'}
        </Button>
      </div>
    </div>
  );
}
