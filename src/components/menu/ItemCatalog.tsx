import { useMemo, useState } from 'react';
import { ItemDatabase } from '@core/items/ItemDatabase';
import { Item, ItemType, ItemRarity } from '@core/types/Item';
import { Button } from '@components/common/Button';
import { ItemCard } from '@components/common/ItemCard';
import { ItemHoverWrapper } from '@components/common/ItemHoverWrapper';
import { FilterBuilder } from './FilterBuilder';
import { applyFilters, ItemFilter, FilterLogic } from './ItemFilter';

interface ItemCatalogProps {
  onClose: () => void;
}

const RARITY_ORDER: ItemRarity[] = [
  ItemRarity.Legendary,
  ItemRarity.Epic,
  ItemRarity.Rare,
  ItemRarity.Common,
];

const TYPE_LABELS: Record<ItemType, string> = {
  [ItemType.Attack]: '⚔️ Attack Items',
  [ItemType.Defense]: '🛡️ Defense Items',
  [ItemType.Passive]: '💎 Passive Items',
};

export function ItemCatalog({ onClose }: ItemCatalogProps) {
  const [filters, setFilters] = useState<ItemFilter[]>([]);
  const [filterLogic, setFilterLogic] = useState<FilterLogic>('AND');

  const groupedItems = useMemo(() => {
    let allItems = ItemDatabase.getAllItems();

    // Apply filters
    if (filters.length > 0) {
      allItems = applyFilters(allItems, { filters, logic: filterLogic });
    }

    // Group by type
    const byType: Record<ItemType, Item[]> = {
      [ItemType.Attack]: [],
      [ItemType.Defense]: [],
      [ItemType.Passive]: [],
    };

    allItems.forEach((item) => {
      byType[item.type].push(item);
    });

    // Sort each group by rarity (best first)
    Object.keys(byType).forEach((type) => {
      byType[type as ItemType].sort((a, b) => {
        const rarityDiff = RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity);
        if (rarityDiff !== 0) return rarityDiff;
        // If same rarity, sort by name
        return a.name.localeCompare(b.name);
      });
    });

    return byType;
  }, [filters, filterLogic]);

  const totalItems = Object.values(groupedItems).reduce((sum, items) => sum + items.length, 0);
  const allItemsCount = ItemDatabase.getAllItems().length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Item Catalog</h1>
            <p className="text-gray-400">
              Showing {totalItems} of {allItemsCount} items
              {filters.length > 0 && <span className="text-yellow-400 ml-2">(filtered)</span>}
            </p>
          </div>
          <Button variant="secondary" onClick={onClose}>
            Back to Menu
          </Button>
        </div>

        {/* Filter Builder */}
        <FilterBuilder
          filters={filters}
          logic={filterLogic}
          onFiltersChange={setFilters}
          onLogicChange={setFilterLogic}
        />

        {/* Attack Items */}
        <ItemTypeSection
          type={ItemType.Attack}
          items={groupedItems[ItemType.Attack]}
        />

        {/* Defense Items */}
        <ItemTypeSection
          type={ItemType.Defense}
          items={groupedItems[ItemType.Defense]}
        />

        {/* Passive Items */}
        <ItemTypeSection
          type={ItemType.Passive}
          items={groupedItems[ItemType.Passive]}
        />
      </div>
    </div>
  );
}

interface ItemTypeSectionProps {
  type: ItemType;
  items: Item[];
}

function ItemTypeSection({ type, items }: ItemTypeSectionProps) {
  // Hide section if no items
  if (items.length === 0) {
    return null;
  }

  // Group by rarity for display
  const itemsByRarity = useMemo(() => {
    const byRarity: Record<ItemRarity, Item[]> = {
      [ItemRarity.Legendary]: [],
      [ItemRarity.Epic]: [],
      [ItemRarity.Rare]: [],
      [ItemRarity.Common]: [],
    };

    items.forEach((item) => {
      byRarity[item.rarity].push(item);
    });

    return byRarity;
  }, [items]);

  const rarityCounts = useMemo(() => {
    return RARITY_ORDER.map(rarity => ({
      rarity,
      count: itemsByRarity[rarity].length,
    })).filter(({ count }) => count > 0);
  }, [itemsByRarity]);

  return (
    <div className="mb-8">
      <div className="border-b border-gray-700 pb-2 mb-4">
        <h2 className="text-2xl font-bold">{TYPE_LABELS[type]}</h2>
        <div className="flex gap-4 mt-2 text-sm text-gray-400">
          {rarityCounts.map(({ rarity, count }) => (
            <span key={rarity} className="capitalize">
              {rarity}: {count}
            </span>
          ))}
        </div>
      </div>

      {RARITY_ORDER.map((rarity) => {
        const rarityItems = itemsByRarity[rarity];
        if (rarityItems.length === 0) return null;

        return (
          <div key={rarity} className="mb-6">
            <h3 className="text-lg font-semibold capitalize mb-3 text-gray-300">{rarity}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {rarityItems.map((item) => (
                <ItemHoverWrapper key={item.id} item={item} showPrice>
                  <ItemCard item={item} showPrice />
                </ItemHoverWrapper>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
