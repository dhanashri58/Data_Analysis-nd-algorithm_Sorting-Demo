import type { PivotStrategy, SortStats, InputPattern, BenchmarkEnvironment } from '../types/sorting';

export interface QuickSortResult {
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
 * Pure TypeScript Quick Sort algorithm execution engine.
 * Does NOT use JavaScript's built-in Array.sort().
 */
export function runQuickSort(
  inputArray: number[],
  pivotStrategy: PivotStrategy = 'random',
  inputPattern: InputPattern = 'random'
): QuickSortResult {
  const arr = [...inputArray];
  const n = arr.length;

  let comparisons = 0;
  let swaps = 0;
  let maxRecursionDepth = 0;

  // Checksum calculation for invariant check
  let initialSum = 0;
  for (let k = 0; k < n; k++) {
    initialSum += arr[k];
  }

  // Multi-run benchmark execution (3 runs for academic precision)
  const runTimes: number[] = [];
  let finalSortedArr = arr;

  for (let r = 0; r < 3; r++) {
    const runArr = [...inputArray];
    const t0 = performance.now();
    
    // Perform recursion on runArr
    let localDepth = 0;
    let localSwaps = 0;
    let localComps = 0;

    function localSwap(x: number, y: number) {
      if (x !== y) {
        const tmp = runArr[x];
        runArr[x] = runArr[y];
        runArr[y] = tmp;
        localSwaps++;
      }
    }

    function localChoosePivot(l: number, h: number): number {
      if (pivotStrategy === 'first') return l;
      if (pivotStrategy === 'last') return h;
      if (pivotStrategy === 'random') return l + Math.floor(Math.random() * (h - l + 1));
      const m = Math.floor((l + h) / 2);
      localComps += 3;
      const valA = runArr[l], valB = runArr[m], valC = runArr[h];
      if ((valA >= valB && valA <= valC) || (valA <= valB && valA >= valC)) return l;
      if ((valB >= valA && valB <= valC) || (valB <= valA && valB >= valC)) return m;
      return h;
    }

    function localPartition(l: number, h: number): number {
      const pivIdx = localChoosePivot(l, h);
      localSwap(pivIdx, h);
      const pivVal = runArr[h];
      let iIdx = l - 1;
      for (let jIdx = l; jIdx < h; jIdx++) {
        localComps++;
        if (runArr[jIdx] <= pivVal) {
          iIdx++;
          localSwap(iIdx, jIdx);
        }
      }
      localSwap(iIdx + 1, h);
      return iIdx + 1;
    }

    function localRec(l: number, h: number, d: number) {
      if (d > localDepth) localDepth = d;
      if (l < h) {
        const p = localPartition(l, h);
        localRec(l, p - 1, d + 1);
        localRec(p + 1, h, d + 1);
      }
    }

    localRec(0, runArr.length - 1, 1);
    const t1 = performance.now();
    runTimes.push(Math.max(0.01, t1 - t0));

    if (r === 0) {
      finalSortedArr = runArr;
      comparisons = localComps;
      swaps = localSwaps;
      maxRecursionDepth = localDepth;
    }
  }

  // Stats calculation
  const sumMs = runTimes.reduce((acc, v) => acc + v, 0);
  const meanExecutionTimeMs = parseFloat((sumMs / runTimes.length).toFixed(3));
  const sortedTimes = [...runTimes].sort((a, b) => a - b);
  const medianExecutionTimeMs = sortedTimes[1];
  const variance = runTimes.reduce((acc, v) => acc + Math.pow(v - meanExecutionTimeMs, 2), 0) / runTimes.length;
  const stdDevMs = parseFloat(Math.sqrt(variance).toFixed(3));

  // Correctness & Checksum validation
  let isSortedCorrectly = true;
  let sortedSum = 0;
  for (let k = 0; k < n; k++) {
    sortedSum += finalSortedArr[k];
    if (k < n - 1 && finalSortedArr[k] > finalSortedArr[k + 1]) {
      isSortedCorrectly = false;
    }
  }

  const checksumInvariant = Math.abs(initialSum - sortedSum) < 1e-3;

  const stats: SortStats = {
    algorithm: 'Quick Sort',
    executionTimeMs: medianExecutionTimeMs,
    meanExecutionTimeMs,
    medianExecutionTimeMs,
    stdDevMs,
    comparisons,
    swapsOrMoves: swaps,
    maxRecursionDepth,
    isSortedCorrectly,
    checksumInvariant,
    itemCount: n,
    pivotStrategy,
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
