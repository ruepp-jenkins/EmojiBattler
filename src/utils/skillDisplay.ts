import { getSkillById } from '@core/skills/SkillTree';
import { AppliedSkill } from '@core/types/Skills';

/**
 * Emoji mapping for each skill ID
 */
export const SKILL_EMOJIS: Record<string, string> = {
  base_attack: '⚔️',
  base_defense: '🛡️',
  max_hp: '❤️',
  starting_money: '💰',
  money_per_round: '💵',
  attack_multiplier: '⚡',
  defense_multiplier: '🏰',
};

/**
 * Get skill emoji by skill ID
 */
export function getSkillEmoji(skillId: string): string {
  return SKILL_EMOJIS[skillId] || '✨';
}

/**
 * Get detailed skill information for tooltip
 */
export function getSkillTooltipInfo(appliedSkill: AppliedSkill) {
  const skill = getSkillById(appliedSkill.skillId);
  if (!skill) {
    return {
      name: appliedSkill.skillId,
      level: appliedSkill.level,
      description: 'Unknown skill',
      totalEffect: '',
    };
  }

  // Calculate total effect based on level
  const totalValue = skill.effect.value * appliedSkill.level;
  let totalEffect = '';

  switch (skill.effect.type) {
    case 'baseAttack':
      totalEffect = `+${totalValue} base attack`;
      break;
    case 'baseDefense':
      totalEffect = `+${totalValue} base defense`;
      break;
    case 'maxHP':
      totalEffect = `+${totalValue} max HP`;
      break;
    case 'startingMoney':
      totalEffect = `+${totalValue} starting money`;
      break;
    case 'moneyPerRound':
      totalEffect = `+${totalValue} money per round`;
      break;
    case 'attackMultiplier':
      totalEffect = `+${Math.round(totalValue * 100)}% attack damage`;
      break;
    case 'defenseMultiplier':
      totalEffect = `+${Math.round(totalValue * 100)}% defense`;
      break;
    default:
      totalEffect = `+${totalValue}`;
  }

  return {
    name: skill.name,
    level: appliedSkill.level,
    maxLevel: skill.maxLevel,
    description: skill.description,
    totalEffect,
  };
}
