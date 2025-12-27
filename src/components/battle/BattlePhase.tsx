import { useEffect, useState, useRef } from 'react';
import { useGame } from '@context/GameContext';
import { BattleEvent, BattleEventDetail } from '@core/types/Battle';
import { Button } from '@components/common/Button';
import { StatBreakdown } from './StatBreakdown';
import { ItemMiniCard } from './ItemMiniCard';

type BattlePhase = 'preparation' | 'fighting' | 'complete';

export function BattlePhase() {
  const { gameState, endRound } = useGame();
  const [battlePhase, setBattlePhase] = useState<BattlePhase>('preparation');
  const [currentTurn, setCurrentTurn] = useState(0);
  const battleLogRef = useRef<HTMLDivElement>(null);

  const battle = gameState?.currentBattle;

  // Group events by turn
  const turnGroups: BattleEvent[][] = [];
  if (battle) {
    battle.events.forEach((event) => {
      if (!turnGroups[event.turn]) {
        turnGroups[event.turn] = [];
      }
      turnGroups[event.turn].push(event);
    });
  }

  const maxTurns = turnGroups.length;

  // Auto-play turns during fighting phase
  useEffect(() => {
    if (!battle || battlePhase !== 'fighting') return;

    if (currentTurn < maxTurns) {
      const timer = setTimeout(() => {
        setCurrentTurn((prev) => prev + 1);
      }, 1500); // Show each turn for 1.5 seconds

      return () => clearTimeout(timer);
    } else {
      setBattlePhase('complete');
    }
  }, [currentTurn, battle, battlePhase, maxTurns]);

  // Auto-scroll to bottom when new turn appears
  useEffect(() => {
    if (battleLogRef.current && battlePhase === 'fighting') {
      battleLogRef.current.scrollTop = battleLogRef.current.scrollHeight;
    }
  }, [currentTurn, battlePhase]);

  if (!battle || !gameState) {
    return <div className="text-white">Loading battle...</div>;
  }

  const visibleTurns = turnGroups.slice(0, currentTurn + 1);

  // Get HP values from the last visible turn's events
  let playerHP = battle.player.stats.maxHP;
  let opponentHP = battle.opponent.stats.maxHP;

  if (visibleTurns.length > 0) {
    const lastTurnEvents = visibleTurns[visibleTurns.length - 1];
    const lastEvent = lastTurnEvents[lastTurnEvents.length - 1];
    if (lastEvent.currentPlayerHP !== undefined) {
      playerHP = lastEvent.currentPlayerHP;
    }
    if (lastEvent.currentOpponentHP !== undefined) {
      opponentHP = lastEvent.currentOpponentHP;
    }
  }

  // Preparation Phase - Show matchup before battle
  if (battlePhase === 'preparation') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-center text-yellow-400">
            Round {battle.round} - Battle Preparation
          </h2>

          <div className="grid grid-cols-3 gap-6 items-center mb-8">
            {/* Player Side */}
            <div className="space-y-4">
              <StatBreakdown
                player={battle.player}
                currentHP={battle.player.stats.maxHP}
                speedMultiplier={1}
                damageMultiplier={1}
                isOpponent={false}
              />

              {/* Player Items */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="text-sm font-semibold text-green-400 mb-3">Your Items</div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {battle.player.items.map((item) => (
                    <ItemMiniCard key={item.id} item={item} showTooltip={true} />
                  ))}
                  {battle.player.items.length === 0 && (
                    <div className="text-gray-500 text-xs text-center py-2">No items</div>
                  )}
                </div>
              </div>
            </div>

            {/* VS Divider */}
            <div className="text-center">
              <div className="text-6xl font-bold mb-4 animate-pulse">⚔️</div>
              <div className="text-3xl font-bold mb-6 text-yellow-400">VS</div>
              <Button
                variant="primary"
                onClick={() => setBattlePhase('fighting')}
                className="text-xl px-8 py-4"
              >
                Start Battle!
              </Button>
            </div>

            {/* Opponent Side */}
            <div className="space-y-4">
              <StatBreakdown
                player={battle.opponent}
                currentHP={battle.opponent.stats.maxHP}
                speedMultiplier={1}
                damageMultiplier={1}
                isOpponent={true}
              />

              {/* Opponent Items */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="text-sm font-semibold text-red-400 mb-3">Opponent Items</div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {battle.opponent.items.map((item) => (
                    <ItemMiniCard key={item.id} item={item} showTooltip={true} />
                  ))}
                  {battle.opponent.items.length === 0 && (
                    <div className="text-gray-500 text-xs text-center py-2">No items</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm">
            Review the matchup and click "Start Battle!" when ready
          </div>
        </div>
      </div>
    );
  }

  // Fighting Phase - 3-column layout with battle log
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Round {battle.round} - Battle in Progress!
        </h2>

        {/* Battle Progress */}
        {battlePhase === 'fighting' && (
          <div className="text-center mb-4">
            <div className="text-yellow-400 font-semibold animate-pulse">
              Turn {currentTurn} / {maxTurns}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentTurn / maxTurns) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* 3-Column Layout */}
        <div className="grid grid-cols-[1fr_2fr_1fr] gap-4">
          {/* Left Column - Player Info */}
          <div className="space-y-4">
            <StatBreakdown
              player={battle.player}
              currentHP={playerHP}
              speedMultiplier={battle.speedMultiplier}
              damageMultiplier={battle.damageMultiplier}
              isOpponent={false}
            />

            {/* Player Items */}
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="text-xs font-semibold text-green-400 mb-2">Your Items</div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {battle.player.items.map((item) => (
                  <ItemMiniCard key={item.id} item={item} showTooltip={true} />
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Battle Log */}
          <div className="space-y-4">
            {/* HP Bars */}
            <div className="grid grid-cols-2 gap-4">
              {/* Player HP */}
              <div>
                <div className="text-sm font-bold mb-1 text-green-400">You</div>
                <div className="bg-gray-800 rounded-full h-6 overflow-hidden border border-gray-600">
                  <div
                    className="bg-green-500 h-full transition-all duration-300"
                    style={{ width: `${(playerHP / battle.player.stats.maxHP) * 100}%` }}
                  />
                </div>
                <div className="text-xs mt-1 text-gray-400">
                  {playerHP} / {battle.player.stats.maxHP} HP
                </div>
              </div>

              {/* Opponent HP */}
              <div>
                <div className="text-sm font-bold mb-1 text-red-400">Opponent</div>
                <div className="bg-gray-800 rounded-full h-6 overflow-hidden border border-gray-600">
                  <div
                    className="bg-red-500 h-full transition-all duration-300"
                    style={{ width: `${(opponentHP / battle.opponent.stats.maxHP) * 100}%` }}
                  />
                </div>
                <div className="text-xs mt-1 text-gray-400">
                  {opponentHP} / {battle.opponent.stats.maxHP} HP
                </div>
              </div>
            </div>

            {/* Battle Log */}
            <div
              ref={battleLogRef}
              className="card bg-gray-800 p-4 max-h-[600px] overflow-y-auto scrollbar-thin scroll-smooth"
            >
              <div className="space-y-4">
                {visibleTurns.map((turnEvents, turnIndex) => (
                  <TurnDisplay
                    key={turnIndex}
                    turnEvents={turnEvents}
                    turnNumber={turnIndex}
                    isLatest={turnIndex === visibleTurns.length - 1 && battlePhase === 'fighting'}
                  />
                ))}
              </div>
            </div>

            {/* Result & Continue */}
            {battlePhase === 'complete' && (
              <div className="text-center py-6">
                {battle.winner === 'player' && (
                  <div className="text-6xl mb-4">🎉 Victory! 🎉</div>
                )}
                {battle.winner === 'opponent' && (
                  <div className="text-6xl mb-4">💀 Defeat 💀</div>
                )}
                {battle.winner === 'draw' && (
                  <div className="text-6xl mb-4">⚔️ Draw ⚔️</div>
                )}

                <Button variant="primary" onClick={endRound} className="text-lg px-8 py-4">
                  Continue
                </Button>
              </div>
            )}
          </div>

          {/* Right Column - Opponent Info */}
          <div className="space-y-4">
            <StatBreakdown
              player={battle.opponent}
              currentHP={opponentHP}
              speedMultiplier={battle.speedMultiplier}
              damageMultiplier={battle.damageMultiplier}
              isOpponent={true}
            />

            {/* Opponent Items */}
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="text-xs font-semibold text-red-400 mb-2">Opponent Items</div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {battle.opponent.items.map((item) => (
                  <ItemMiniCard key={item.id} item={item} showTooltip={true} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TurnDisplay({
  turnEvents,
  turnNumber,
  isLatest,
}: {
  turnEvents: BattleEvent[];
  turnNumber: number;
  isLatest: boolean;
}) {
  // Find attack and related events
  const attackEvent = turnEvents.find((e) => e.type === 'attack');
  const blockEvent = turnEvents.find((e) => e.type === 'block');
  const healEvents = turnEvents.filter((e) => e.type === 'heal');
  const effectEvents = turnEvents.filter(
    (e) => e.type === 'effect' || e.type === 'speedIncrease' || e.type === 'damageMultiplier'
  );

  if (!attackEvent) {
    // Display other events if no attack
    return (
      <div
        className={`border rounded-lg p-3 bg-gray-900/50 ${
          isLatest ? 'border-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse' : 'border-gray-700'
        }`}
      >
        <div className="text-yellow-400 font-bold mb-2">Turn {turnNumber}</div>
        {turnEvents.map((event, idx) => (
          <div key={idx} className="text-sm text-gray-300">
            {event.message}
          </div>
        ))}
      </div>
    );
  }

  const isPlayerAttacking = attackEvent.attacker === 'player';
  const attackerName = isPlayerAttacking ? 'You' : 'Opponent';
  const defenderName = isPlayerAttacking ? 'Opponent' : 'You';

  // Calculate damage breakdown
  const damageDetails = attackEvent.details.filter((d) => d.rawDamage !== undefined && d.rawDamage > 0);
  const totalRawDamage = damageDetails.reduce((sum, d) => sum + (d.rawDamage || 0), 0);
  const baseDamage = damageDetails.find((d) => !d.itemName)?.rawDamage || 0;
  const itemDamageDetails = damageDetails.filter((d) => d.itemName);

  // Calculate block breakdown
  const blockDetails = blockEvent?.details.filter((d) => d.blockAmount !== undefined && d.blockAmount > 0) || [];
  const totalBlock = blockDetails.reduce((sum, d) => sum + (d.blockAmount || 0), 0);
  const baseBlock = blockDetails.find((d) => !d.itemName)?.blockAmount || 0;
  const itemBlockDetails = blockDetails.filter((d) => d.itemName);

  // Get final damage
  const finalDamageDetail = attackEvent.details.find((d) => d.finalDamage !== undefined);
  const finalDamage = finalDamageDetail?.finalDamage || 0;

  // Calculate HP lost
  const hpLost = finalDamage;

  const borderClasses = isPlayerAttacking ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10';
  const glowClasses = isLatest
    ? isPlayerAttacking
      ? 'shadow-lg shadow-green-500/50 animate-pulse'
      : 'shadow-lg shadow-red-500/50 animate-pulse'
    : '';

  return (
    <div className={`border-2 rounded-lg p-4 ${borderClasses} ${glowClasses}`}>
      <div className="flex justify-between items-center mb-3">
        <div className="text-lg font-bold">
          Turn {turnNumber}: {attackerName} attacks {defenderName}
        </div>
        <div className={`text-xl font-bold ${hpLost > 0 ? 'text-red-400' : 'text-gray-500'}`}>-{hpLost} HP</div>
      </div>

      {/* Damage Section */}
      <div className="mb-3">
        <div className="text-red-400 font-semibold text-base mb-2">⚔️ Total Damage: {totalRawDamage}</div>
        <div className="ml-4 space-y-1 text-sm">
          {baseDamage > 0 && (
            <div className="text-gray-300">
              Base Attack: <span className="text-red-300">+{baseDamage}</span>
            </div>
          )}
          {itemDamageDetails.map((detail, idx) => (
            <div key={idx} className="text-gray-300">
              {detail.itemEmoji} {detail.itemName}: <span className="text-red-300">+{detail.rawDamage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Block Section */}
      {totalBlock > 0 && (
        <div className="mb-3">
          <div className="text-blue-400 font-semibold text-base mb-2">
            🛡️ Total Block: {totalBlock} ({blockDetails.find((d) => d.blockPercent)?.blockPercent?.toFixed(0) || 0}%)
          </div>
          <div className="ml-4 space-y-1 text-sm">
            {baseBlock > 0 && (
              <div className="text-gray-300">
                Base Defense: <span className="text-blue-300">+{baseBlock}</span>
              </div>
            )}
            {itemBlockDetails.map((detail, idx) => (
              <div key={idx} className="text-gray-300">
                {detail.itemEmoji} {detail.itemName}: <span className="text-blue-300">+{detail.blockAmount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Healing Section */}
      {healEvents.length > 0 && (
        <div className="mb-3">
          <div className="text-green-400 font-semibold text-base mb-2">💚 Healing</div>
          <div className="ml-4 space-y-1 text-sm">
            {healEvents
              .flatMap((e) => e.details)
              .map(
                (detail, idx) =>
                  detail.healAmount &&
                  detail.healAmount > 0 && (
                    <div key={idx} className="text-gray-300">
                      {detail.itemEmoji} {detail.itemName}: <span className="text-green-300">+{detail.healAmount} HP</span>
                    </div>
                  )
              )}
          </div>
        </div>
      )}

      {/* Effects Section */}
      {effectEvents.length > 0 && (
        <div className="mb-2">
          <div className="text-purple-400 font-semibold text-sm mb-1">✨ Effects</div>
          <div className="ml-4 space-y-1 text-xs">
            {effectEvents.map((event, idx) => (
              <div key={idx} className="text-gray-400">
                {event.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final Damage Result */}
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="text-yellow-300 font-bold">💥 Final Damage Dealt: {finalDamage}</div>
      </div>
    </div>
  );
}
