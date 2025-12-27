import { useGame } from '@context/GameContext';
import { Button } from '@components/common/Button';
import { GameEngine } from '@core/GameEngine';
import { formatDuration } from '@utils/formatting';

export function GameOverScreen() {
  const { gameState, returnToMenu } = useGame();

  if (!gameState) return null;

  const stats = GameEngine.getGameStats(gameState);
  const playerWon = gameState.currentRound >= gameState.maxRounds;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full card">
        {/* Title */}
        {playerWon && (
          <>
            <div className="text-8xl text-center mb-4">🏆</div>
            <h2 className="text-5xl font-bold text-yellow-400 text-center mb-2">Victory!</h2>
            <p className="text-xl text-center text-gray-400 mb-8">
              You completed all {gameState.maxRounds} rounds!
            </p>
          </>
        )}

        {!playerWon && (
          <>
            <div className="text-8xl text-center mb-4">💀</div>
            <h2 className="text-5xl font-bold text-red-400 text-center mb-2">Game Over</h2>
            <p className="text-xl text-center text-gray-400 mb-8">
              You survived {gameState.currentRound - 1} rounds
            </p>
          </>
        )}

        {/* Difficulty & Duration */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card bg-gray-800 text-center">
            <div className="text-sm text-gray-400">Difficulty</div>
            <div className="text-xl font-bold capitalize">{gameState.difficulty.level}</div>
          </div>

          <div className="card bg-gray-800 text-center">
            <div className="text-sm text-gray-400">Duration</div>
            <div className="text-xl font-bold">{formatDuration(stats.gameDuration)}</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Battles Won" value={stats.battlesWon} color="text-green-400" />
          <StatCard title="Battles Lost" value={stats.battlesLost} color="text-red-400" />
          <StatCard title="Damage Dealt" value={stats.totalDamageDealt} color="text-orange-400" />
          <StatCard
            title="Damage Received"
            value={stats.totalDamageReceived}
            color="text-purple-400"
          />
          <StatCard title="Items Bought" value={stats.totalItemsBought} color="text-blue-400" />
          <StatCard
            title="Money Spent"
            value={`$${stats.totalMoneySpent}`}
            color="text-yellow-400"
          />
          <StatCard title="Lives Lost" value={stats.livesLost} color="text-red-400" />
          <StatCard title="Final Round" value={gameState.currentRound} color="text-cyan-400" />
        </div>

        {/* Battle Timeline */}
        <div className="card bg-gray-800 mb-6">
          <h3 className="text-lg font-bold mb-3">Battle Timeline</h3>
          <div className="flex flex-wrap gap-2">
            {gameState.battleTimeline.map((battle, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
                  battle.playerWon ? 'bg-green-600' : 'bg-red-600'
                }`}
                title={`Round ${battle.round}: ${battle.playerWon ? 'Won' : 'Lost'}${
                  battle.lostLife ? ' - Lost Life' : ''
                }`}
              >
                {battle.lostLife ? '💀' : battle.playerWon ? '✓' : '✗'}
              </div>
            ))}
          </div>
        </div>

        {/* Skill Points Earned */}
        {playerWon && gameState.skillPoints > 0 && (
          <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                +{gameState.skillPoints} Skill Points Earned!
              </div>
              <div className="text-sm text-gray-300">
                Use skill points to unlock permanent upgrades
              </div>
            </div>
          </div>
        )}

        {/* Return to Menu */}
        <Button variant="primary" onClick={returnToMenu} className="w-full text-lg py-4">
          Return to Main Menu
        </Button>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="card bg-gray-800 text-center">
      <div className="text-xs text-gray-400 mb-1">{title}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
