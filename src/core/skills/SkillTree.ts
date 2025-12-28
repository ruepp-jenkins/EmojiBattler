import { Skill } from '@core/types/Skills';

/**
 * Complete skill tree with all available skills
 */
export const SKILL_TREE: Skill[] = [
  // === BASIC STATS ===
  {
    id: 'base_attack',
    name: 'Power Training',
    description: 'Through rigorous training and discipline, you have honed your combat prowess. Each session makes your strikes hit harder and your technique more refined.',
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
    description: 'Years of conditioning have toughened your body and sharpened your reflexes. You can withstand blows that would fell lesser warriors.',
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
    description: 'Your life force burns brighter than others. A robust constitution and unwavering determination allow you to endure far more punishment in battle.',
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
    description: 'Fortune favors you from the start. Whether through inheritance, shrewd investments, or lucky finds, you begin each journey with deeper pockets.',
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
    description: 'Your reputation grows with each victory. Sponsors and admirers reward your success, ensuring a steady flow of coin between battles.',
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
    description: 'True mastery transcends mere strength. You have learned to strike with precision and purpose, amplifying the effectiveness of every weapon and technique.',
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
    description: 'Like a fortress that grows stronger with each siege, your defensive capabilities multiply. Every shield, every guard becomes more effective in your hands.',
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
