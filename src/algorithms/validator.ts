export interface ValidationReport {
  isValid: boolean;
  message: string;
  min: number;
  max: number;
  mean: number;
  elementCount: number;
}

export function validateSortedArray(arr: number[]): ValidationReport {
  const n = arr.length;
  if (n === 0) {
    return {
      isValid: true,
      message: 'Empty array is trivially sorted.',
      min: 0,
      max: 0,
      mean: 0,
      elementCount: 0,
    };
  }

  let isValid = true;
  let min = arr[0];
  let max = arr[0];
  let sum = arr[0];

  for (let i = 1; i < n; i++) {
    sum += arr[i];
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];

    if (arr[i] < arr[i - 1]) {
      isValid = false;
    }
  }

  return {
    isValid,
    message: isValid
      ? `✓ Verified: All ${n.toLocaleString()} elements are in non-decreasing order.`
      : `✗ Validation failed: Order violation detected.`,
    min,
    max,
    mean: parseFloat((sum / n).toFixed(2)),
    elementCount: n,
  };
}
