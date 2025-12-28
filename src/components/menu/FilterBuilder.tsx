import { useState } from 'react';
import { ItemType, EffectType, ItemRarity } from '@core/types/Item';
import { FilterType, FilterOperator, ItemFilter, FilterLogic } from './ItemFilter';
import { Button } from '@components/common/Button';

interface FilterBuilderProps {
  filters: ItemFilter[];
  logic: FilterLogic;
  onFiltersChange: (filters: ItemFilter[]) => void;
  onLogicChange: (logic: FilterLogic) => void;
}

const FILTER_TYPE_LABELS: Record<FilterType, string> = {
  baseAttack: 'Attack',
  baseDefense: 'Defense',
  price: 'Price',
  hasEffect: 'Effect',
  effectValue: 'Effect Value',
  itemType: 'Type',
  hasStacking: 'Stacking Value',
  rarity: 'Rarity',
};

const OPERATORS: FilterOperator[] = ['>', '<', '>=', '<=', '=', '!='];

const EFFECT_TYPES: EffectType[] = [
  'damage',
  'block',
  'heal',
  'vampire',
  'attackMultiply',
  'defenseMultiply',
  'speedBoost',
  'tempPower',
  'stack',
  'luck',
  'preventLifeLoss',
  'reduceOpponentAttack',
  'moneyBonus',
  'moneyMultiplier',
  'maxHPBonus',
];

const ITEM_TYPES: ItemType[] = [ItemType.Attack, ItemType.Defense, ItemType.Passive];

const RARITIES: ItemRarity[] = [
  ItemRarity.Common,
  ItemRarity.Rare,
  ItemRarity.Epic,
  ItemRarity.Legendary,
];

export function FilterBuilder({ filters, logic, onFiltersChange, onLogicChange }: FilterBuilderProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const addFilter = () => {
    const newFilter: ItemFilter = {
      id: `filter-${Date.now()}`,
      type: 'baseAttack',
      operator: '>',
      value: 0,
    };
    onFiltersChange([...filters, newFilter]);
    setIsExpanded(true);
  };

  const removeFilter = (id: string) => {
    onFiltersChange(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, updates: Partial<ItemFilter>) => {
    onFiltersChange(filters.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold">Filters</h3>
          {filters.length > 0 && (
            <span className="text-sm text-gray-400">
              ({filters.length} active)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {filters.length > 0 && (
            <>
              <Button variant="danger" onClick={clearAllFilters} className="text-sm px-3 py-1">
                Clear All
              </Button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              >
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>
            </>
          )}
          <Button variant="primary" onClick={addFilter} className="text-sm px-3 py-1">
            + Add Filter
          </Button>
        </div>
      </div>

      {filters.length > 1 && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-400">Combine filters with:</span>
          <div className="flex gap-2">
            <button
              onClick={() => onLogicChange('AND')}
              className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                logic === 'AND'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              AND
            </button>
            <button
              onClick={() => onLogicChange('OR')}
              className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                logic === 'OR'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              OR
            </button>
          </div>
        </div>
      )}

      {isExpanded && filters.length > 0 && (
        <div className="space-y-3 border-t border-gray-700 pt-4">
          {filters.map((filter, index) => (
            <FilterRow
              key={filter.id}
              filter={filter}
              index={index}
              logic={logic}
              showLogic={index > 0 && filters.length > 1}
              onUpdate={(updates) => updateFilter(filter.id, updates)}
              onRemove={() => removeFilter(filter.id)}
            />
          ))}
        </div>
      )}

      {!isExpanded && filters.length > 0 && (
        <div className="text-sm text-gray-400 border-t border-gray-700 pt-3">
          Click "Expand" to view and edit filters
        </div>
      )}
    </div>
  );
}

interface FilterRowProps {
  filter: ItemFilter;
  index: number;
  logic: FilterLogic;
  showLogic: boolean;
  onUpdate: (updates: Partial<ItemFilter>) => void;
  onRemove: () => void;
}

function FilterRow({ filter, showLogic, logic, onUpdate, onRemove }: FilterRowProps) {
  const requiresOperator = ['baseAttack', 'baseDefense', 'price', 'effectValue', 'hasStacking'].includes(filter.type);
  const requiresEffectType = ['hasEffect', 'effectValue'].includes(filter.type);
  const requiresValue = ['baseAttack', 'baseDefense', 'price', 'effectValue', 'hasStacking'].includes(filter.type);
  const requiresItemType = filter.type === 'itemType';
  const requiresRarity = filter.type === 'rarity';

  return (
    <div className="flex items-center gap-2 flex-wrap bg-gray-900 p-3 rounded border border-gray-700">
      {showLogic && (
        <span className="text-xs font-bold text-blue-400 px-2 py-1 bg-gray-800 rounded">
          {logic}
        </span>
      )}

      {/* Filter Type */}
      <select
        value={filter.type}
        onChange={(e) => {
          const newType = e.target.value as FilterType;
          const updates: Partial<ItemFilter> = { type: newType };

          // Reset values based on new type
          if (newType === 'hasEffect') {
            updates.effectType = 'damage';
            updates.operator = undefined;
            updates.value = undefined;
            updates.rarity = undefined;
          } else if (newType === 'itemType') {
            updates.value = ItemType.Attack;
            updates.operator = undefined;
            updates.effectType = undefined;
            updates.rarity = undefined;
          } else if (newType === 'rarity') {
            updates.rarity = ItemRarity.Common;
            updates.operator = undefined;
            updates.value = undefined;
            updates.effectType = undefined;
          } else if (newType === 'effectValue') {
            updates.effectType = 'damage';
            updates.operator = '>';
            updates.value = 0;
            updates.rarity = undefined;
          } else {
            updates.operator = '>';
            updates.value = 0;
            updates.effectType = undefined;
            updates.rarity = undefined;
          }

          onUpdate(updates);
        }}
        className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
      >
        {Object.entries(FILTER_TYPE_LABELS)
          .sort(([, labelA], [, labelB]) => labelA.localeCompare(labelB))
          .map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
      </select>

      {/* Effect Type (for hasEffect and effectValue) */}
      {requiresEffectType && (
        <select
          value={filter.effectType || 'damage'}
          onChange={(e) => onUpdate({ effectType: e.target.value as EffectType })}
          className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
        >
          {EFFECT_TYPES.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      )}

      {/* Operator */}
      {requiresOperator && (
        <select
          value={filter.operator || '>'}
          onChange={(e) => onUpdate({ operator: e.target.value as FilterOperator })}
          className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm w-16"
        >
          {OPERATORS.map(op => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
      )}

      {/* Value (numeric) */}
      {requiresValue && (
        <input
          type="number"
          value={filter.value as number || 0}
          onChange={(e) => onUpdate({ value: parseFloat(e.target.value) || 0 })}
          className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm w-24"
        />
      )}

      {/* Item Type */}
      {requiresItemType && (
        <select
          value={filter.value as string || ItemType.Attack}
          onChange={(e) => onUpdate({ value: e.target.value })}
          className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
        >
          {ITEM_TYPES.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      )}

      {/* Rarity */}
      {requiresRarity && (
        <select
          value={filter.rarity || ItemRarity.Common}
          onChange={(e) => onUpdate({ rarity: e.target.value as ItemRarity })}
          className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm capitalize"
        >
          {RARITIES.map(rarity => (
            <option key={rarity} value={rarity} className="capitalize">
              {rarity}
            </option>
          ))}
        </select>
      )}

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="ml-auto text-red-400 hover:text-red-300 text-sm px-2 py-1 hover:bg-gray-800 rounded transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
