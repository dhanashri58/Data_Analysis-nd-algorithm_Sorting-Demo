import type { PivotStrategy, InputPattern, SortStats } from '../types/sorting';
import { runQuickSort } from '../algorithms/quickSort';
import { runMergeSort } from '../algorithms/mergeSort';

export interface ExecuteParams {
  type: 'RUN_SINGLE' | 'RUN_COMPARISON' | 'RUN_MULTI_SIZE';
  algorithm?: 'Quick Sort' | 'Merge Sort';
  array: number[];
  pivotStrategy?: PivotStrategy;
  inputPattern?: InputPattern;
  datasetSizes?: number[];
  onProgress?: (message: string, percent: number) => void;
}

export interface ExecuteResult {
  quickStats?: SortStats;
  mergeStats?: SortStats;
  singleStats?: SortStats;
  sortedArray?: number[];
  multiSizeResults?: Array<{
    size: number;
    formattedSize: string;
    quickTime: number;
    mergeTime: number;
    quickComparisons: number;
    mergeComparisons: number;
    quickSwaps: number;
    mergeMoves: number;
  }>;
}

export function executeBenchmarkAsync(params: ExecuteParams): Promise<ExecuteResult> {
  return new Promise((resolve, reject) => {
    const {
      type,
      algorithm,
      array,
      pivotStrategy = 'random',
      inputPattern = 'random',
      datasetSizes,
      onProgress,
    } = params;

    if (window.Worker) {
      try {
        const worker = new Worker(new URL('./sortWorker.ts', import.meta.url), {
          type: 'module',
        });

        worker.onmessage = (e) => {
          const res = e.data;
          if (res.type === 'PROGRESS') {
            if (onProgress) {
              onProgress(res.progressMessage || 'Processing...', res.progressPercent || 50);
            }
          } else if (res.type === 'SUCCESS') {
            worker.terminate();
            resolve({
              quickStats: res.quickStats,
              mergeStats: res.mergeStats,
              singleStats: res.singleStats,
              sortedArray: res.sortedArray,
              multiSizeResults: res.multiSizeResults,
            });
          } else if (res.type === 'ERROR') {
            worker.terminate();
            reject(new Error(res.error || 'Worker benchmark failed'));
          }
        };

        worker.onerror = (err) => {
          worker.terminate();
          console.warn('Worker error, falling back to main thread execution:', err);
          executeInMainThread(params).then(resolve).catch(reject);
        };

        worker.postMessage({
          type,
          algorithm,
          array,
          pivotStrategy,
          inputPattern,
          datasetSizes,
        });

        return;
      } catch (err) {
        console.warn('Failed to construct Worker, using main thread fallback:', err);
      }
    }

    executeInMainThread(params).then(resolve).catch(reject);
  });
}

async function executeInMainThread(params: ExecuteParams): Promise<ExecuteResult> {
  const {
    type,
    algorithm,
    array,
    pivotStrategy = 'random',
    inputPattern = 'random',
    datasetSizes,
    onProgress,
  } = params;

  await new Promise((r) => setTimeout(r, 10));

  if (type === 'RUN_SINGLE') {
    if (onProgress) onProgress(`Running ${algorithm}...`, 50);
    let result;
    if (algorithm === 'Quick Sort') {
      result = runQuickSort(array, pivotStrategy, inputPattern);
    } else {
      result = runMergeSort(array, inputPattern);
    }
    return {
      singleStats: result.stats,
      sortedArray: result.sortedArray,
    };
  } else if (type === 'RUN_COMPARISON') {
    if (onProgress) onProgress('Running Quick Sort...', 25);
    const qRes = runQuickSort(array, pivotStrategy, inputPattern);

    await new Promise((r) => setTimeout(r, 10));
    if (onProgress) onProgress('Running Merge Sort...', 75);
    const mRes = runMergeSort(array, inputPattern);

    return {
      quickStats: qRes.stats,
      mergeStats: mRes.stats,
    };
  } else if (type === 'RUN_MULTI_SIZE' && datasetSizes) {
    const multiSizeResults = [];
    for (let i = 0; i < datasetSizes.length; i++) {
      const sz = datasetSizes[i];
      if (onProgress) {
        onProgress(`Benchmarking ${sz.toLocaleString()} items...`, Math.round(((i + 1) / datasetSizes.length) * 100));
      }
      await new Promise((r) => setTimeout(r, 10));

      const sub = array.length >= sz ? array.slice(0, sz) : array;
      const qRes = runQuickSort(sub, pivotStrategy, inputPattern);
      const mRes = runMergeSort(sub, inputPattern);

      const formattedSize = sz >= 1000000 ? `${sz / 1000000}M` : `${sz / 1000}K`;

      multiSizeResults.push({
        size: sz,
        formattedSize,
        quickTime: qRes.stats.executionTimeMs,
        mergeTime: mRes.stats.executionTimeMs,
        quickComparisons: qRes.stats.comparisons,
        mergeComparisons: mRes.stats.comparisons,
        quickSwaps: qRes.stats.swapsOrMoves,
        mergeMoves: mRes.stats.swapsOrMoves,
      });
    }

    return { multiSizeResults };
  }

  throw new Error('Invalid execute type');
}
