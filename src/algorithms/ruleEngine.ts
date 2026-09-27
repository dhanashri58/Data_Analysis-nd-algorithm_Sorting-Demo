import type { SortStats, RuleBasedObservation } from '../types/sorting';

/**
 * Generates deterministic, rule-based CS analysis observations derived strictly from
 * measured benchmark statistics, selected pivot strategy, and input arrangement.
 */
export function generateRuleBasedObservation(
  quickStats?: SortStats,
  mergeStats?: SortStats
): RuleBasedObservation {
  if (!quickStats || !mergeStats) {
    return {
      title: 'Benchmark Pending Execution',
      primaryObservation: 'Run both algorithms side-by-side to generate empirical observations.',
      technicalReason: 'Analysis engine evaluates execution time, comparisons, swaps, and recursion tree depth.',
      daTheoryConnect: 'Design & Analysis of Algorithms (DAA) divide-and-conquer principles.',
      recommendation: 'Execute "Compare Both" on the active dataset.',
    };
  }

  const qTime = quickStats.executionTimeMs;
  const mTime = mergeStats.executionTimeMs;
  const qComps = quickStats.comparisons;
  const mComps = mergeStats.comparisons;
  const qDepth = quickStats.maxRecursionDepth;
  const pattern = quickStats.inputPattern;
  const pivot = quickStats.pivotStrategy || 'random';
  const count = quickStats.itemCount;

  // Case 1: Worst-case O(N^2) Quick Sort trigger
  if ((pattern === 'reverse' || pattern === 'sorted') && (pivot === 'last' || pivot === 'first')) {
    return {
      title: 'O(N²) Quadratic Degradation Detected in Quick Sort',
      primaryObservation: `Quick Sort executed in ${qTime.toFixed(2)} ms with ${qComps.toLocaleString()} comparisons and a deep recursion depth of ${qDepth}, whereas Merge Sort completed in ${mTime.toFixed(2)} ms.`,
      technicalReason: `Selecting '${pivot}' pivot on a '${pattern}' dataset forces maximally unbalanced sub-arrays (1 element vs N-1 elements) at every partitioning step. This causes the recursion tree depth to grow linearly to O(N) instead of O(log N).`,
      daTheoryConnect: 'DAA Theorem: Quick Sort recurrence T(N) = T(N-1) + O(N) resolves to O(N²) quadratic time complexity when pivot selection consistently picks extreme values.',
      recommendation: 'Switch Quick Sort pivot strategy to "Randomized" or "Median-of-Three" to guarantee balanced O(N log N) expected partitioning on ordered datasets.',
    };
  }

  // Case 2: Quick Sort significantly faster (Cache Locality advantage)
  if (qTime < mTime) {
    const speedup = (mTime / Math.max(0.01, qTime)).toFixed(2);
    return {
      title: `Quick Sort Outperformed Merge Sort (${speedup}x Faster)`,
      primaryObservation: `Quick Sort finished in ${qTime.toFixed(2)} ms (${qComps.toLocaleString()} comparisons), beating Merge Sort at ${mTime.toFixed(2)} ms on ${count.toLocaleString()} elements.`,
      technicalReason: 'Quick Sort performs in-place element swapping within contiguous memory blocks, demonstrating high CPU L1/L2 cache locality and zero auxiliary heap allocations. Merge Sort incurs memory bus overhead during temporary array merging.',
      daTheoryConnect: 'DAA Memory Hierarchy: In-place partitioning minimizes cache line invalidations. While both algorithms are O(N log N) on average, Quick Sort has smaller constant factors.',
      recommendation: 'Use Quick Sort for general-purpose in-memory sorting where stability is not strictly required.',
    };
  }

  // Case 3: Merge Sort faster or more consistent
  const ratio = (qTime / Math.max(0.01, mTime)).toFixed(2);
  return {
    title: `Merge Sort Outperformed Quick Sort (${ratio}x Faster)`,
    primaryObservation: `Merge Sort finished in ${mTime.toFixed(2)} ms (${mComps.toLocaleString()} comparisons), outperforming Quick Sort at ${qTime.toFixed(2)} ms on ${count.toLocaleString()} elements.`,
    technicalReason: 'Merge Sort guarantees strict divide-and-conquer binary splitting at mid-points (N/2), avoiding pivot comparison overhead and branch mispredictions during partitioning.',
    daTheoryConnect: 'DAA Master Theorem: Merge Sort recurrence T(N) = 2T(N/2) + O(N) yields deterministic O(N log N) bound in all worst, average, and best case arrangements.',
    recommendation: 'Prefer Merge Sort when guaranteed linearithmic upper-bounds or element stability (preserving relative order of equal keys) is required.',
  };
}
