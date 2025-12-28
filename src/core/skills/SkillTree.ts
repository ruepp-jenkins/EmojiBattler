import { Skill } from '@core/types/Skills';

/**
 * Complete skill tree with all available skills
 */
export const SKILL_TREE: Skill[] = [
  // === BASIC STATS ===
  {
    id: 'base_attack',
    name: 'Power Training',
    description: '+2 base attack per level',
    cost: 2,
    maxLevel: 10,
    effect: {
      type: 'baseAttack',
      value: 2,
    },
  },
  {
    id: 'base_defense',
    name: 'Fortification',
    description: '+2 base defense per level',
    cost: 2,
    maxLevel: 10,
    effect: {
      type: 'baseDefense',
      value: 2,
    },
  },
  {
    id: 'max_hp',
    name: 'Vitality',
    description: '+20 max HP per level',
    cost: 3,
    maxLevel: 5,
    effect: {
      type: 'maxHP',
      value: 20,
    },
  },

  // === ECONOMY ===
  {
    id: 'starting_money',
    name: 'Wealth',
    description: '+50 starting money per level',
    cost: 3,
    maxLevel: 5,
    effect: {
      type: 'startingMoney',
      value: 50,
    },
  },
  {
    id: 'money_per_round',
    name: 'Prosperity',
    description: '+20 money per round',
    cost: 5,
    maxLevel: 5,
    effect: {
      type: 'moneyPerRound',
      value: 20,
    },
  },

  // === MULTIPLIERS ===
  {
    id: 'attack_multiplier',
    name: 'Mastery',
    description: '+5% attack damage per level',
    cost: 5,
    maxLevel: 5,
    effect: {
      type: 'attackMultiplier',
      value: 0.05,
    },
  },
  {
    id: 'defense_multiplier',
    name: 'Resilience',
    description: '+5% defense per level',
    cost: 5,
    maxLevel: 5,
    effect: {
      type: 'defenseMultiplier',
      value: 0.05,
    },
  },
];

/**
 * Get skill by ID
 */
export function getSkillById(skillId: string): Skill | undefined {
  return SKILL_TREE.find((skill) => skill.id === skillId);
}

/**
 * Get all available skills
 */
export function getAllSkills(): Skill[] {
  return [...SKILL_TREE];
}

/**
 * Calculate total cost to max a skill
 */
export function getTotalSkillCost(skill: Skill): number {
  // Cost is: cost + (cost * level) for each level
  let total = 0;
  for (let level = 1; level <= skill.maxLevel; level++) {
    total += skill.cost;
  }
  return total;
}
