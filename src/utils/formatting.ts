export function formatNumber(num: number): string {
  return Math.round(num).toLocaleString();
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatMoney(amount: number): string {
  return `$${formatNumber(amount)}`;
}

export function formatHP(current: number, max: number): string {
  return `${formatNumber(current)} / ${formatNumber(max)}`;
}

export function formatStat(value: number, showPlus: boolean = false): string {
  const formatted = formatNumber(value);
  if (showPlus && value > 0) {
    return `+${formatted}`;
  }
  return formatted;
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
