import { useEffect, useState, useRef } from 'react';
import { useGame } from '@context/GameContext';
import { BattleEvent } from '@core/types/Battle';
import { Item } from '@core/types/Item';
import { Button } from '@components/common/Button';
import { StatBreakdown } from './StatBreakdown';
import { ItemMiniCard } from './ItemMiniCard';
import { ItemHoverWrapper } from '@components/common/ItemHoverWrapper';

type BattlePhase = 'preparation' | 'fighting' | 'complete';

// Helper function to find an item by emoji from player/opponent items
function findItemByEmoji(emoji: string, playerItems: Item[], opponentItems: Item[]): Item | undefined {
  return playerItems.find(item => item.emoji === emoji) || opponentItems.find(item => item.emoji === emoji);
}

interface DamageAnimation {
  id: number;
  amount: number;
  isPlayer: boolean;
}

export function BattlePhase() {
  const { gameState, transitionToSummary } = useGame();
  const [battlePhase, setBattlePhase] = useState<BattlePhase>('preparation');
  const [currentTurn, setCurrentTurn] = useState(0);
  const [damageAnimations, setDamageAnimations] = useState<DamageAnimation[]>([]);
  const battleLogRef = useRef<HTMLDivElement>(null);
  const prevPlayerHP = useRef<number>(0);
  const prevOpponentHP = useRef<number>(0);

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

  if (!battle || !gameState) {
    return <div className="text-white">Loading battle...</div>;
  }

  const visibleTurns = turnGroups.slice(0, currentTurn + 1);

  // Get HP values - use final HP when battle is complete, otherwise get from events
  let playerHP = battle.player.stats.maxHP;
  let opponentHP = battle.opponent.stats.maxHP;

  if (battlePhase === 'complete') {
    // Battle is complete, use final HP from battle state
    playerHP = battle.player.stats.currentHP;
    opponentHP = battle.opponent.stats.currentHP;
  } else if (visibleTurns.length > 0) {
    // Battle in progress, get HP from last visible turn's events
    const lastTurnEvents = visibleTurns[visibleTurns.length - 1];
    const lastEvent = lastTurnEvents[lastTurnEvents.length - 1];
    if (lastEvent.currentPlayerHP !== undefined) {
      playerHP = lastEvent.currentPlayerHP;
    }
    if (lastEvent.currentOpponentHP !== undefined) {
      opponentHP = lastEvent.currentOpponentHP;
    }
  }

  // Auto-play turns during fighting phase
  useEffect(() => {
    if (!battle || battlePhase !== 'fighting') return;

    if (currentTurn < maxTurns) {
      const timer = setTimeout(() => {
        setCurrentTurn((prev) => prev + 1);
      }, 600); // Show each turn for 0.6 seconds

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

  // Track HP changes and trigger damage animations
  useEffect(() => {
    if (!battle || battlePhase !== 'fighting') return;

    // Initialize refs on first render
    if (prevPlayerHP.current === 0 && prevOpponentHP.current === 0) {
      prevPlayerHP.current = playerHP;
      prevOpponentHP.current = opponentHP;
      return;
    }

    // Check for player damage
    if (playerHP < prevPlayerHP.current) {
      const damage = prevPlayerHP.current - playerHP;
      setDamageAnimations(prev => [...prev, { id: Date.now(), amount: damage, isPlayer: true }]);
      setTimeout(() => {
        setDamageAnimations(prev => prev.filter(anim => anim.id !== Date.now()));
      }, 1000);
    }

    // Check for opponent damage
    if (opponentHP < prevOpponentHP.current) {
      const damage = prevOpponentHP.current - opponentHP;
      setDamageAnimations(prev => [...prev, { id: Date.now() + 1, amount: damage, isPlayer: false }]);
      setTimeout(() => {
        setDamageAnimations(prev => prev.filter(anim => anim.id !== Date.now() + 1));
      }, 1000);
    }

    // Update previous HP values
    prevPlayerHP.current = playerHP;
    prevOpponentHP.current = opponentHP;
  }, [playerHP, opponentHP, battle, battlePhase]);

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
                    <ItemHoverWrapper key={item.id} item={item}>
                      <ItemMiniCard item={item} />
                    </ItemHoverWrapper>
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
                    <ItemHoverWrapper key={item.id} item={item}>
                      <ItemMiniCard item={item} />
                    </ItemHoverWrapper>
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
          Round {battle.round} - Battle Simulation
        </h2>

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
                  <ItemHoverWrapper key={item.id} item={item}>
                    <ItemMiniCard item={item} />
                  </ItemHoverWrapper>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Battle Log */}
          <div className="space-y-4">
            {/* HP Bars */}
            <div className="grid grid-cols-2 gap-4">
              {/* Player HP */}
              <div className="relative">
                <div className="text-sm font-bold mb-1 text-green-400 flex items-center gap-2">
                  You
                  {playerHP <= 0 && <span className="text-2xl">💀</span>}
                </div>
                <div className="bg-gray-800 rounded-full h-6 overflow-hidden border border-gray-600">
                  <div
                    className="bg-green-500 h-full transition-all duration-300"
                    style={{ width: `${(playerHP / battle.player.stats.maxHP) * 100}%` }}
                  />
                </div>
                <div className="text-xs mt-1 text-gray-400">
                  {playerHP} / {battle.player.stats.maxHP} HP
                </div>
                {/* Damage animations */}
                {damageAnimations
                  .filter(anim => anim.isPlayer)
                  .map(anim => (
                    <div
                      key={anim.id}
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 text-red-500 font-bold text-xl animate-[float-up_1s_ease-out_forwards] pointer-events-none"
                    >
                      💔 -{anim.amount}
                    </div>
                  ))}
              </div>

              {/* Opponent HP */}
              <div className="relative">
                <div className="text-sm font-bold mb-1 text-red-400 flex items-center gap-2">
                  Opponent
                  {opponentHP <= 0 && <span className="text-2xl">💀</span>}
                </div>
                <div className="bg-gray-800 rounded-full h-6 overflow-hidden border border-gray-600">
                  <div
                    className="bg-red-500 h-full transition-all duration-300"
                    style={{ width: `${(opponentHP / battle.opponent.stats.maxHP) * 100}%` }}
                  />
                </div>
                <div className="text-xs mt-1 text-gray-400">
                  {opponentHP} / {battle.opponent.stats.maxHP} HP
                </div>
                {/* Damage animations */}
                {damageAnimations
                  .filter(anim => !anim.isPlayer)
                  .map(anim => (
                    <div
                      key={anim.id}
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 text-red-500 font-bold text-xl animate-[float-up_1s_ease-out_forwards] pointer-events-none"
                    >
                      💔 -{anim.amount}
                    </div>
                  ))}
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
                    playerItems={battle.player.items}
                    opponentItems={battle.opponent.items}
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

                <Button variant="primary" onClick={transitionToSummary} className="text-lg px-8 py-4">
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
                  <ItemHoverWrapper key={item.id} item={item}>
                    <ItemMiniCard item={item} />
                  </ItemHoverWrapper>
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
  playerItems,
  opponentItems,
}: {
  turnEvents: BattleEvent[];
  turnNumber: number;
  isLatest: boolean;
  playerItems: Item[];
  opponentItems: Item[];
}) {
  // Find ALL attack events (both player and opponent)
  const attackEvents = turnEvents.filter((e) => e.type === 'attack');
  const effectEvents = turnEvents.filter(
    (e) => e.type === 'effect' || e.type === 'speedIncrease' || e.type === 'damageMultiplier'
  );

  if (attackEvents.length === 0) {
    // Display other events if no attacks
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

  // Determine whose turn it is (even = player, odd = opponent)
  const isPlayerTurn = turnNumber % 2 === 0;
  const turnLabel = isPlayerTurn ? "Player's Turn" : "Opponent's Turn";
  const turnColor = isPlayerTurn ? "text-green-400" : "text-red-400";

  // Display each attack in the turn
  return (
    <div className={`space-y-3 ${isLatest ? 'animate-pulse' : ''}`}>
      <div className={`${turnColor} font-bold text-lg mb-2`}>
        Turn {Math.floor(turnNumber / 2) + 1} - {turnLabel}
      </div>
      {attackEvents.map((attackEvent, attackIdx) => (
        <AttackDisplay
          key={attackIdx}
          attackEvent={attackEvent}
          isLatest={isLatest && attackIdx === attackEvents.length - 1}
          playerItems={playerItems}
          opponentItems={opponentItems}
        />
      ))}

      {/* Effects Section */}
      {effectEvents.length > 0 && (
        <div className="border border-purple-700 rounded-lg p-3 bg-purple-900/10">
          <div className="text-purple-400 font-semibold text-sm mb-1">✨ Turn Effects</div>
          <div className="ml-2 space-y-1 text-xs">
            {effectEvents.map((event, idx) => (
              <div key={idx} className="text-gray-400">
                {event.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AttackDisplay({
  attackEvent,
  isLatest,
  playerItems,
  opponentItems,
}: {
  attackEvent: BattleEvent;
  isLatest: boolean;
  playerItems: Item[];
  opponentItems: Item[];
}) {

  const isPlayerAttacking = attackEvent.attacker === 'player';
  const attackerName = isPlayerAttacking ? 'You' : 'Opponent';
  const defenderName = isPlayerAttacking ? 'Opponent' : 'You';

  // Calculate damage breakdown
  const damageDetails = attackEvent.details.filter((d) => d.rawDamage !== undefined && d.rawDamage > 0);
  const totalRawDamage = damageDetails.reduce((sum, d) => sum + (d.rawDamage || 0), 0);
  const baseDamage = damageDetails.find((d) => !d.itemName)?.rawDamage || 0;
  const itemDamageDetails = damageDetails.filter((d) => d.itemName);

  // Calculate block breakdown from attack event details
  const blockDetails = attackEvent.details.filter((d) => d.blockAmount !== undefined && d.blockAmount > 0);
  const totalBlock = blockDetails.reduce((sum, d) => sum + (d.blockAmount || 0), 0);
  const blockPercent = blockDetails.find((d) => d.blockPercent !== undefined)?.blockPercent || 0;
  const baseBlock = blockDetails.find((d) => !d.itemName)?.blockAmount || 0;
  const itemBlockDetails = blockDetails.filter((d) => d.itemName);

  // Get final damage
  const finalDamageDetail = attackEvent.details.find((d) => d.finalDamage !== undefined);
  const finalDamage = finalDamageDetail?.finalDamage || 0;

  // Calculate HP lost and actual blocked amount
  const hpLost = finalDamage;
  const blockedAmount = totalRawDamage - finalDamage;

  const borderClasses = isPlayerAttacking ? 'border-green-600 bg-green-900/20' : 'border-red-600 bg-red-900/20';
  const glowClasses = isLatest ? 'shadow-lg shadow-yellow-400/30' : '';

  return (
    <div className={`border-2 rounded-lg p-3 ${borderClasses} ${glowClasses}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="text-base font-bold">
          {attackerName} ⚔️ {defenderName}
        </div>
        <div className={`text-lg font-bold ${hpLost > 0 ? 'text-red-400' : 'text-green-400'}`}>
          {hpLost > 0 ? `-${hpLost}` : '0'} HP
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Damage Section */}
        <div className="bg-red-900/10 border border-red-700/30 rounded p-2">
          <div className="text-red-400 font-semibold text-sm mb-1">⚔️ Attack: {totalRawDamage}</div>
          <div className="space-y-0.5 text-xs">
            {baseDamage > 0 && (
              <div className="text-gray-300">
                Base: <span className="text-red-300 font-semibold">{baseDamage}</span>
              </div>
            )}
            {itemDamageDetails.map((detail, idx) => {
              const item = findItemByEmoji(detail.itemEmoji || '', playerItems, opponentItems);
              return (
                <div key={idx} className="text-gray-300">
                  {item ? (
                    <ItemHoverWrapper item={item}>
                      <span className="cursor-help">{detail.itemEmoji}</span>
                    </ItemHoverWrapper>
                  ) : (
                    <span>{detail.itemEmoji}</span>
                  )}{' '}
                  <span className="text-red-300 font-semibold">+{detail.rawDamage}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Block Section */}
        <div className="bg-blue-900/10 border border-blue-700/30 rounded p-2">
          <div className="text-blue-400 font-semibold text-sm mb-1">
            🛡️ Defense: {totalBlock} ({Math.round(blockPercent * 100)}%)
          </div>
          <div className="space-y-0.5 text-xs">
            {baseBlock > 0 && (
              <div className="text-gray-300">
                Base: <span className="text-blue-300 font-semibold">{baseBlock}</span>
              </div>
            )}
            {itemBlockDetails.map((detail, idx) => {
              const item = findItemByEmoji(detail.itemEmoji || '', playerItems, opponentItems);
              return (
                <div key={idx} className="text-gray-300">
                  {item ? (
                    <ItemHoverWrapper item={item}>
                      <span className="cursor-help">{detail.itemEmoji}</span>
                    </ItemHoverWrapper>
                  ) : (
                    <span>{detail.itemEmoji}</span>
                  )}{' '}
                  <span className="text-blue-300 font-semibold">+{detail.blockAmount}</span>
                </div>
              );
            })}
            {totalBlock === 0 && <div className="text-gray-500 text-xs">No defense</div>}
          </div>
        </div>
      </div>

      {/* Final Damage Result */}
      <div className="mt-2 pt-2 border-t border-gray-600">
        <div className="text-center space-y-0.5">
          <div className="text-xs text-gray-400">
            {totalRawDamage} attack - {blockedAmount} blocked ({Math.round(blockPercent * 100)}%)
          </div>
          <div className="text-yellow-300 font-bold text-base">
            💥 Final Damage: {finalDamage} HP
          </div>
        </div>
      </div>
    </div>
  );
}
