import { Button } from '@components/common/Button';
import { SKILL_TREE } from '@core/skills/SkillTree';
import { AppliedSkill } from '@core/types/Skills';

interface SkillsPanelProps {
  totalSkillPoints: number;
  permanentSkills: AppliedSkill[];
  onPurchaseSkill: (skillId: string) => boolean;
  onClose: () => void;
}

export function SkillsPanel({
  totalSkillPoints,
  permanentSkills,
  onPurchaseSkill,
  onClose,
}: SkillsPanelProps) {
  // Get current level of a skill
  const getSkillLevel = (skillId: string): number => {
    const playerSkill = permanentSkills.find((s) => s.skillId === skillId);
    return playerSkill?.level || 0;
  };

  // Calculate cost for next level
  const getNextLevelCost = (skillId: string): number => {
    const skill = SKILL_TREE.find((s) => s.id === skillId);
    return skill?.cost || 0;
  };

  // Check if skill can be upgraded
  const canUpgrade = (skillId: string): boolean => {
    const skill = SKILL_TREE.find((s) => s.id === skillId);
    if (!skill) return false;

    const currentLevel = getSkillLevel(skillId);
    const cost = getNextLevelCost(skillId);

    return currentLevel < skill.maxLevel && totalSkillPoints >= cost;
  };

  // Format effect value for display
  const formatEffectValue = (effectType: string, value: number, currentLevel: number): string => {
    const totalValue = value * currentLevel;

    switch (effectType) {
      case 'attackMultiplier':
      case 'defenseMultiplier':
        return `+${(totalValue * 100).toFixed(0)}%`;
      default:
        return `+${totalValue}`;
    }
  };

  // Group skills by category
  const basicStats = SKILL_TREE.slice(0, 3);
  const economy = SKILL_TREE.slice(3, 5);
  const multipliers = SKILL_TREE.slice(5, 7);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="max-w-4xl w-full bg-gray-900 rounded-lg p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Skill Tree</h2>
          <div className="text-xl">
            <span className="text-yellow-400 font-bold">{totalSkillPoints}</span>
            <span className="text-gray-400"> Skill Points</span>
          </div>
        </div>

        <p className="text-gray-400 mb-6">
          Permanent upgrades that persist across all runs. Earn skill points by completing games!
        </p>

        {/* Basic Stats */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-blue-400 mb-3">⚔️ Basic Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {basicStats.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                currentLevel={getSkillLevel(skill.id)}
                onUpgrade={() => onPurchaseSkill(skill.id)}
                canUpgrade={canUpgrade(skill.id)}
                formatEffectValue={formatEffectValue}
              />
            ))}
          </div>
        </div>

        {/* Economy */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-yellow-400 mb-3">💰 Economy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {economy.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                currentLevel={getSkillLevel(skill.id)}
                onUpgrade={() => onPurchaseSkill(skill.id)}
                canUpgrade={canUpgrade(skill.id)}
                formatEffectValue={formatEffectValue}
              />
            ))}
          </div>
        </div>

        {/* Multipliers */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-purple-400 mb-3">✨ Multipliers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {multipliers.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                currentLevel={getSkillLevel(skill.id)}
                onUpgrade={() => onPurchaseSkill(skill.id)}
                canUpgrade={canUpgrade(skill.id)}
                formatEffectValue={formatEffectValue}
              />
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-center">
          <Button variant="secondary" onClick={onClose} className="px-8">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

interface SkillCardProps {
  skill: {
    id: string;
    name: string;
    description: string;
    cost: number;
    maxLevel: number;
    effect: {
      type: string;
      value: number;
    };
  };
  currentLevel: number;
  onUpgrade: () => void;
  canUpgrade: boolean;
  formatEffectValue: (effectType: string, value: number, currentLevel: number) => string;
}

function SkillCard({
  skill,
  currentLevel,
  onUpgrade,
  canUpgrade,
  formatEffectValue,
}: SkillCardProps) {
  const isMaxed = currentLevel >= skill.maxLevel;
  const nextLevelValue = formatEffectValue(skill.effect.type, skill.effect.value, currentLevel + 1);
  const currentTotalValue = formatEffectValue(skill.effect.type, skill.effect.value, currentLevel);

  return (
    <div
      className={`card p-4 ${
        isMaxed
          ? 'bg-green-900/20 border-green-500'
          : canUpgrade
            ? 'bg-gray-800 border-gray-600 hover:border-yellow-400'
            : 'bg-gray-800/50 border-gray-700'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-lg">{skill.name}</h4>
        <div className="text-sm">
          <span className={currentLevel > 0 ? 'text-green-400' : 'text-gray-500'}>
            {currentLevel}
          </span>
          <span className="text-gray-500">/{skill.maxLevel}</span>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-3">{skill.description}</p>

      {currentLevel > 0 && (
        <div className="text-sm text-green-400 mb-2">Current: {currentTotalValue}</div>
      )}

      {!isMaxed && (
        <div className="text-sm text-gray-300 mb-3">Next: {nextLevelValue}</div>
      )}

      {isMaxed ? (
        <div className="text-center text-green-400 font-bold py-2">✓ MAXED</div>
      ) : (
        <Button
          variant={canUpgrade ? 'primary' : 'secondary'}
          onClick={onUpgrade}
          disabled={!canUpgrade}
          className="w-full text-sm py-2"
        >
          Upgrade ({skill.cost} pts)
        </Button>
      )}
    </div>
  );
}
