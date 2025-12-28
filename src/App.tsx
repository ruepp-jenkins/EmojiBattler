import { GameProvider, useGame } from '@context/GameContext';
import { ItemTooltipProvider } from '@context/ItemTooltipContext';
import { SkillTooltipProvider } from '@context/SkillTooltipContext';
import { ItemTooltipDisplay } from '@components/common/ItemTooltipDisplay';
import { SkillTooltipDisplay } from '@components/common/SkillTooltipDisplay';
import { MainMenu } from '@components/menu/MainMenu';
import { ShopPhase } from '@components/shop/ShopPhase';
import { BattlePhase } from '@components/battle/BattlePhase';
import { BattleSummary } from '@components/summary/BattleSummary';
import { GameOverScreen } from '@components/summary/GameOverScreen';

function GameRouter() {
  const { gameState } = useGame();

  // Show main menu if no game state
  if (!gameState) {
    return <MainMenu />;
  }

  // Route based on game phase
  switch (gameState.phase) {
    case 'menu':
      return <MainMenu />;
    case 'shop':
      return <ShopPhase />;
    case 'battle':
      return <BattlePhase />;
    case 'summary':
      return <BattleSummary />;
    case 'gameOver':
      return <GameOverScreen />;
    default:
      return <MainMenu />;
  }
}

function App() {
  return (
    <ItemTooltipProvider>
      <SkillTooltipProvider>
        <GameProvider>
          <GameRouter />
        </GameProvider>
        <ItemTooltipDisplay />
        <SkillTooltipDisplay />
      </SkillTooltipProvider>
    </ItemTooltipProvider>
  );
}

export default App;
