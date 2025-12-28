import { Player } from '@core/types/Player';
import { DamageCalculator } from '@core/battle/DamageCalculator';
import { SkillTooltip } from '@components/common/SkillTooltip';
import { getSkillEmoji } from '@utils/skillDisplay';

interface StatBreakdownProps {
  player: Player;
  currentHP: number;
  speedMultiplier: number;
  damageMultiplier: number;
  isOpponent?: boolean;
}

export function StatBreakdown({
  player,
  currentHP,
  speedMultiplier,
  damageMultiplier,
  isOpponent = false
}: StatBreakdownProps) {
  // Calculate stat breakdown using DamageCalculator
  const stats = DamageCalculator.calculatePlayerStats(player);

  const labelColor = isOpponent ? 'text-red-400' : 'text-green-400';

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      {/* Header */}
      <div className={`text-lg font-bold mb-3 ${labelColor}`}>
        {isOpponent ? 'Opponent (AI)' : 'You'}
      </div>

      {/* HP Display */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-1">Health Points</div>
        <div className="text-2xl font-bold">
          <span className={currentHP > player.stats.maxHP / 2 ? 'text-green-400' : 'text-red-400'}>
            {currentHP}
          </span>
          <span className="text-gray-500"> / {player.stats.maxHP}</span>
        </div>
        {/* HP Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              currentHP > player.stats.maxHP / 2 ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.max(0, (currentHP / player.stats.maxHP) * 100)}%` }}
          />
        </div>
      </div>

      {/* Attack Stats */}
      <div className="mb-3">
        <div className="text-sm font-semibold text-red-400 mb-1">Attack</div>
        <div className="text-xl font-bold">{stats.totalAttack}</div>
        <div className="text-xs text-gray-400">
          {(() => {
            if (stats.attackMultiplier > 1.0) {
              const rawTotal = Math.round(stats.totalAttack / stats.attackMultiplier);
              const rawItems = rawTotal - player.stats.baseAttack;
              const multiplierBonus = stats.totalAttack - rawTotal;
              return `Base: ${player.stats.baseAttack} + Items: ${rawItems} + Multiplier (${stats.attackMultiplier.toFixed(2)}): ${multiplierBonus}`;
            } else {
              const rawItems = stats.totalAttack - player.stats.baseAttack;
              return `Base: ${player.stats.baseAttack} + Items: ${rawItems}`;
            }
          })()}
        </div>
      </div>

      {/* Defense Stats */}
      <div className="mb-3">
        <div className="text-sm font-semibold text-blue-400 mb-1">Defense</div>
        <div className="text-xl font-bold">{stats.totalDefense} points</div>
        <div className="text-lg font-semibold text-blue-300">
          = {Math.round(stats.defensePercent * 100)}% damage reduction
        </div>
        <div className="text-xs text-gray-400">
          Base: {player.stats.baseDefense} + Items: {stats.breakdown.items.defense}
          {stats.defenseMultiplier > 1.0 && ` (×${stats.defenseMultiplier.toFixed(2)} applied)`}
        </div>
        {stats.defensePercent >= 0.9 && (
          <div className="text-xs text-yellow-400 mt-1">⚠️ Capped at 90%</div>
        )}
        <div className="text-xs text-gray-500 mt-1 italic">
          Blocks {Math.round(stats.defensePercent * 100)}% of incoming damage
        </div>
      </div>

      {/* Multipliers */}
      {(speedMultiplier > 1 || damageMultiplier > 1) && (
        <div className="border-t border-gray-700 pt-3 mt-3">
          <div className="text-sm font-semibold text-purple-400 mb-2">Active Multipliers</div>
          {speedMultiplier > 1 && (
            <div className="text-xs text-gray-300">
              ⚡ Speed: ×{speedMultiplier.toFixed(1)}
            </div>
          )}
          {damageMultiplier > 1 && (
            <div className="text-xs text-gray-300">
              💥 Damage: ×{damageMultiplier.toFixed(1)}
            </div>
          )}
        </div>
      )}

      {/* Skills Display */}
      {player.skills && player.skills.length > 0 && (
        <div className="border-t border-gray-700 pt-3 mt-3">
          <div className="text-sm font-semibold text-purple-400 mb-2">Skills</div>
          <div className="flex flex-wrap gap-2">
            {player.skills.map((skill, idx) => (
              <SkillTooltip key={idx} skill={skill}>
                <div className="relative cursor-help">
                  <span className="text-2xl">{getSkillEmoji(skill.skillId)}</span>
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {skill.level}
                  </span>
                </div>
              </SkillTooltip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
