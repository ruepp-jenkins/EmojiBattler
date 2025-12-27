import { Player } from '@core/types/Player';
import { AppliedSkill, Skill } from '@core/types/Skills';
import { getSkillById } from './SkillTree';

export interface SkillPurchaseResult {
  success: boolean;
  message: string;
  updatedSkills?: AppliedSkill[];
  remainingPoints?: number;
}

export class SkillManager {
  /**
   * Apply all permanent skills to a player's base stats
   */
  static applySkills(player: Player, skills: AppliedSkill[]): void {
    for (const appliedSkill of skills) {
      const skill = getSkillById(appliedSkill.skillId);
      if (!skill) continue;

      const totalValue = skill.effect.value * appliedSkill.level;

      switch (skill.effect.type) {
        case 'baseAttack':
          player.stats.baseAttack += totalValue;
          break;

        case 'baseDefense':
          player.stats.baseDefense += totalValue;
          break;

        case 'maxHP':
          player.stats.maxHP += totalValue;
          player.stats.currentHP += totalValue; // Also increase current HP
          break;

        case 'startingMoney':
          // This is applied at game start, not here
          break;

        case 'moneyPerRound':
          // This is applied when awarding round money
          break;

        case 'attackMultiplier':
          // This is applied in damage calculation
          break;

        case 'defenseMultiplier':
          // This is applied in damage calculation
          break;
      }
    }
  }

  /**
   * Calculate bonus money from skills
   */
  static getStartingMoneyBonus(skills: AppliedSkill[]): number {
    let bonus = 0;
    for (const appliedSkill of skills) {
      const skill = getSkillById(appliedSkill.skillId);
      if (skill && skill.effect.type === 'startingMoney') {
        bonus += skill.effect.value * appliedSkill.level;
      }
    }
    return bonus;
  }

  /**
   * Calculate bonus money per round from skills
   */
  static getMoneyPerRoundBonus(skills: AppliedSkill[]): number {
    let bonus = 0;
    for (const appliedSkill of skills) {
      const skill = getSkillById(appliedSkill.skillId);
      if (skill && skill.effect.type === 'moneyPerRound') {
        bonus += skill.effect.value * appliedSkill.level;
      }
    }
    return bonus;
  }

  /**
   * Get attack multiplier from skills
   */
  static getAttackMultiplier(skills: AppliedSkill[]): number {
    let multiplier = 1.0;
    for (const appliedSkill of skills) {
      const skill = getSkillById(appliedSkill.skillId);
      if (skill && skill.effect.type === 'attackMultiplier') {
        multiplier += skill.effect.value * appliedSkill.level;
      }
    }
    return multiplier;
  }

  /**
   * Get defense multiplier from skills
   */
  static getDefenseMultiplier(skills: AppliedSkill[]): number {
    let multiplier = 1.0;
    for (const appliedSkill of skills) {
      const skill = getSkillById(appliedSkill.skillId);
      if (skill && skill.effect.type === 'defenseMultiplier') {
        multiplier += skill.effect.value * appliedSkill.level;
      }
    }
    return multiplier;
  }

  /**
   * Check if player can afford to level up a skill
   */
  static canAffordSkill(
    skill: Skill,
    currentLevel: number,
    availablePoints: number
  ): boolean {
    if (currentLevel >= skill.maxLevel) {
      return false;
    }
    return availablePoints >= skill.cost;
  }

  /**
   * Purchase a skill level
   */
  static purchaseSkill(
    skillId: string,
    currentSkills: AppliedSkill[],
    availablePoints: number
  ): SkillPurchaseResult {
    const skill = getSkillById(skillId);

    if (!skill) {
      return {
        success: false,
        message: 'Skill not found',
      };
    }

    // Find current level of this skill
    const existingSkill = currentSkills.find((s) => s.skillId === skillId);
    const currentLevel = existingSkill?.level || 0;

    // Check if can level up
    if (currentLevel >= skill.maxLevel) {
      return {
        success: false,
        message: `${skill.name} is already at max level`,
      };
    }

    // Check if can afford
    if (!this.canAffordSkill(skill, currentLevel, availablePoints)) {
      return {
        success: false,
        message: `Not enough skill points (need ${skill.cost}, have ${availablePoints})`,
      };
    }

    // Apply purchase
    const newSkills = [...currentSkills];
    if (existingSkill) {
      existingSkill.level += 1;
    } else {
      newSkills.push({
        skillId,
        level: 1,
      });
    }

    return {
      success: true,
      message: `${skill.name} leveled up to ${currentLevel + 1}`,
      updatedSkills: newSkills,
      remainingPoints: availablePoints - skill.cost,
    };
  }

  /**
   * Get current level of a skill
   */
  static getSkillLevel(skillId: string, skills: AppliedSkill[]): number {
    const skill = skills.find((s) => s.skillId === skillId);
    return skill?.level || 0;
  }

  /**
   * Calculate total points spent on skills
   */
  static getTotalPointsSpent(skills: AppliedSkill[]): number {
    let total = 0;
    for (const appliedSkill of skills) {
      const skill = getSkillById(appliedSkill.skillId);
      if (skill) {
        total += skill.cost * appliedSkill.level;
      }
    }
    return total;
  }

  /**
   * Get summary of all applied skill bonuses
   */
  static getSkillSummary(skills: AppliedSkill[]): {
    baseAttack: number;
    baseDefense: number;
    maxHP: number;
    startingMoney: number;
    moneyPerRound: number;
    attackMultiplier: number;
    defenseMultiplier: number;
  } {
    return {
      baseAttack: this.getSkillBonus(skills, 'baseAttack'),
      baseDefense: this.getSkillBonus(skills, 'baseDefense'),
      maxHP: this.getSkillBonus(skills, 'maxHP'),
      startingMoney: this.getStartingMoneyBonus(skills),
      moneyPerRound: this.getMoneyPerRoundBonus(skills),
      attackMultiplier: this.getAttackMultiplier(skills) - 1, // Return bonus only
      defenseMultiplier: this.getDefenseMultiplier(skills) - 1,
    };
  }

  /**
   * Get total bonus from skills for a specific type
   */
  private static getSkillBonus(
    skills: AppliedSkill[],
    type: 'baseAttack' | 'baseDefense' | 'maxHP'
  ): number {
    let bonus = 0;
    for (const appliedSkill of skills) {
      const skill = getSkillById(appliedSkill.skillId);
      if (skill && skill.effect.type === type) {
        bonus += skill.effect.value * appliedSkill.level;
      }
    }
    return bonus;
  }
}
