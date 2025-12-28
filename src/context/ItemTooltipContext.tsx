import { createContext, useContext, useState, ReactNode } from 'react';
import { Item } from '@core/types/Item';

interface TooltipOptions {
  showPrice?: boolean;
}

interface TooltipState {
  item: Item | null;
  mouseX: number;
  mouseY: number;
  options: TooltipOptions;
}

interface ItemTooltipContextType {
  tooltipState: TooltipState;
  showTooltip: (item: Item, mouseX: number, mouseY: number, options?: TooltipOptions) => void;
  hideTooltip: () => void;
}

const ItemTooltipContext = createContext<ItemTooltipContextType | undefined>(undefined);

export function ItemTooltipProvider({ children }: { children: ReactNode }) {
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    item: null,
    mouseX: 0,
    mouseY: 0,
    options: {},
  });

  const showTooltip = (item: Item, mouseX: number, mouseY: number, options: TooltipOptions = {}) => {
    setTooltipState({
      item,
      mouseX,
      mouseY,
      options,
    });
  };

  const hideTooltip = () => {
    setTooltipState({
      item: null,
      mouseX: 0,
      mouseY: 0,
      options: {},
    });
  };

  return (
    <ItemTooltipContext.Provider value={{ tooltipState, showTooltip, hideTooltip }}>
      {children}
    </ItemTooltipContext.Provider>
  );
}

export function useItemTooltip() {
  const context = useContext(ItemTooltipContext);
  if (context === undefined) {
    throw new Error('useItemTooltip must be used within an ItemTooltipProvider');
  }
  return context;
}
