export function formatNumber(num: number): string {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString();
}

export function formatTimeMs(ms: number): string {
  if (ms === undefined || ms === null) return '0 ms';
  if (ms < 1) {
    return `${ms.toFixed(3)} ms`;
  } else if (ms < 1000) {
    return `${ms.toFixed(2)} ms`;
  } else {
    return `${(ms / 1000).toFixed(3)} s`;
  }
}

export function formatDatasetSize(size: number): string {
  if (size >= 1000000) {
    return `${size / 1000000}M`;
  } else if (size >= 1000) {
    return `${size / 1000}K`;
  }
  return String(size);
}
