import type { SortStats, InputPattern, BenchmarkEnvironment } from '../types/sorting';

export interface MergeSortResult {
  sortedArray: number[];
  stats: SortStats;
}

function getBenchmarkEnvironment(): BenchmarkEnvironment {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Node/Worker Engine';
  const hardwareConcurrency = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 8;
  const deviceMemoryGb = typeof navigator !== 'undefined' && (navigator as any).deviceMemory ? (navigator as any).deviceMemory : 8;

  return {
    userAgent,
    hardwareConcurrency,
    deviceMemoryGb,
    engine: 'Pure TypeScript (Web Worker Off-Main-Thread)',
    runsPerTest: 3,
  };
}

/**
 * Pure TypeScript Merge Sort algorithm execution engine.
 * Does NOT use JavaScript's built-in Array.sort().
 */
export function runMergeSort(
  inputArray: number[],
  inputPattern: InputPattern = 'random'
): MergeSortResult {
  const n = inputArray.length;

  let initialSum = 0;
  for (let k = 0; k < n; k++) {
    initialSum += inputArray[k];
  }

  const runTimes: number[] = [];
  let finalSortedArr: number[] = [];
  let comparisons = 0;
  let moves = 0;
  let maxRecursionDepth = 0;

  for (let r = 0; r < 3; r++) {
    const arr = [...inputArray];
    const tempArray = new Array(n);
    let localComps = 0;
    let localMoves = 0;
    let localDepth = 0;

    function merge(low: number, mid: number, high: number) {
      let i = low;
      let j = mid + 1;
      let k = low;

      while (i <= mid && j <= high) {
        localComps++;
        if (arr[i] <= arr[j]) {
          tempArray[k] = arr[i];
          i++;
        } else {
          tempArray[k] = arr[j];
          j++;
        }
        k++;
        localMoves++;
      }

      while (i <= mid) {
        tempArray[k] = arr[i];
        i++;
        k++;
        localMoves++;
      }

      while (j <= high) {
        tempArray[k] = arr[j];
        j++;
        k++;
        localMoves++;
      }

      for (let idx = low; idx <= high; idx++) {
        arr[idx] = tempArray[idx];
        localMoves++;
      }
    }

    function mergeSortRecursive(low: number, high: number, currentDepth: number) {
      if (currentDepth > localDepth) {
        localDepth = currentDepth;
      }

      if (low < high) {
        const mid = Math.floor((low + high) / 2);
        mergeSortRecursive(low, mid, currentDepth + 1);
        mergeSortRecursive(mid + 1, high, currentDepth + 1);
        merge(low, mid, high);
      }
    }

    const t0 = performance.now();
    mergeSortRecursive(0, n - 1, 1);
    const t1 = performance.now();
    runTimes.push(Math.max(0.01, t1 - t0));

    if (r === 0) {
      finalSortedArr = arr;
      comparisons = localComps;
      moves = localMoves;
      maxRecursionDepth = localDepth;
    }
  }

  const sumMs = runTimes.reduce((acc, v) => acc + v, 0);
  const meanExecutionTimeMs = parseFloat((sumMs / runTimes.length).toFixed(3));
  const sortedTimes = [...runTimes].sort((a, b) => a - b);
  const medianExecutionTimeMs = sortedTimes[1];
  const variance = runTimes.reduce((acc, v) => acc + Math.pow(v - meanExecutionTimeMs, 2), 0) / runTimes.length;
  const stdDevMs = parseFloat(Math.sqrt(variance).toFixed(3));

  let isSortedCorrectly = true;
  let sortedSum = 0;
  for (let idx = 0; idx < n; idx++) {
    sortedSum += finalSortedArr[idx];
    if (idx < n - 1 && finalSortedArr[idx] > finalSortedArr[idx + 1]) {
      isSortedCorrectly = false;
    }
  }

  const checksumInvariant = Math.abs(initialSum - sortedSum) < 1e-3;

  const stats: SortStats = {
    algorithm: 'Merge Sort',
    executionTimeMs: medianExecutionTimeMs,
    meanExecutionTimeMs,
    medianExecutionTimeMs,
    stdDevMs,
    comparisons,
    swapsOrMoves: moves,
    maxRecursionDepth,
    isSortedCorrectly,
    checksumInvariant,
    itemCount: n,
    inputPattern,
    timestamp: Date.now(),
    runsCount: 3,
    environment: getBenchmarkEnvironment(),
  };

  return {
    sortedArray: finalSortedArr,
    stats,
  };
}
