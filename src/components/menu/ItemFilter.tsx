import { Item, EffectType, ItemRarity } from '@core/types/Item';

export type FilterOperator = '>' | '<' | '>=' | '<=' | '=' | '!=';
export type FilterLogic = 'AND' | 'OR';

export type FilterType =
  | 'baseAttack'
  | 'baseDefense'
  | 'price'
  | 'hasEffect'
  | 'effectValue'
  | 'itemType'
  | 'hasStacking'
  | 'rarity';

export interface ItemFilter {
  id: string;
  type: FilterType;
  operator?: FilterOperator;
  value?: number | string;
  effectType?: EffectType;
  rarity?: ItemRarity;
}

export interface FilterState {
  filters: ItemFilter[];
  logic: FilterLogic;
}

export function applyFilters(items: Item[], filterState: FilterState): Item[] {
  if (filterState.filters.length === 0) {
    return items;
  }

  return items.filter(item => {
    const results = filterState.filters.map(filter => matchesFilter(item, filter));

    if (filterState.logic === 'AND') {
      return results.every(r => r);
    } else {
      return results.some(r => r);
    }
  });
}

function matchesFilter(item: Item, filter: ItemFilter): boolean {
  switch (filter.type) {
    case 'baseAttack':
      return compareNumbers(item.baseAttack, filter.operator!, filter.value as number);

    case 'baseDefense':
      return compareNumbers(item.baseDefense, filter.operator!, filter.value as number);

    case 'price':
      return compareNumbers(item.price, filter.operator!, filter.value as number);

    case 'hasEffect':
      return item.effects.some(e => e.effectType === filter.effectType);

    case 'effectValue':
      if (!filter.effectType) return false;
      const effect = item.effects.find(e => e.effectType === filter.effectType);
      if (!effect) return false;
      return compareNumbers(effect.value, filter.operator!, filter.value as number);

    case 'itemType':
      return item.type === filter.value;

    case 'hasStacking':
      const stackEffect = item.effects.find(e => e.effectType === 'stack');
      if (!stackEffect) return false;
      return compareNumbers(stackEffect.value, filter.operator!, filter.value as number);

    case 'rarity':
      return item.rarity === filter.rarity;

    default:
      return true;
  }
}

function compareNumbers(itemValue: number, operator: FilterOperator, filterValue: number): boolean {
  switch (operator) {
    case '>':
      return itemValue > filterValue;
    case '<':
      return itemValue < filterValue;
    case '>=':
      return itemValue >= filterValue;
    case '<=':
      return itemValue <= filterValue;
    case '=':
      return itemValue === filterValue;
    case '!=':
      return itemValue !== filterValue;
    default:
      return true;
  }
}
