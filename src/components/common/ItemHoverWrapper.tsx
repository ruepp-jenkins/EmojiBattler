import { ReactNode } from 'react';
import { Item } from '@core/types/Item';
import { useItemTooltip } from '@context/ItemTooltipContext';

interface ItemHoverWrapperProps {
  item: Item;
  children: ReactNode;
  showPrice?: boolean;
}

export function ItemHoverWrapper({ item, children, showPrice = false }: ItemHoverWrapperProps) {
  const { showTooltip, hideTooltip } = useItemTooltip();

  const handleMouseEnter = (e: React.MouseEvent) => {
    showTooltip(item, e.clientX, e.clientY, { showPrice });
  };

  const handleMouseLeave = () => {
    hideTooltip();
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {children}
    </div>
  );
}
