import type { PivotStrategy, InputPattern, SortStats } from '../types/sorting';
import { runQuickSort } from '../algorithms/quickSort';
import { runMergeSort } from '../algorithms/mergeSort';

export interface WorkerMessageRequest {
  type: 'RUN_SINGLE' | 'RUN_COMPARISON' | 'RUN_MULTI_SIZE';
  algorithm?: 'Quick Sort' | 'Merge Sort';
  array: number[];
  pivotStrategy?: PivotStrategy;
  inputPattern?: InputPattern;
  datasetSizes?: number[];
  columnName?: string;
}

export interface WorkerMessageResponse {
  type: 'SUCCESS' | 'PROGRESS' | 'ERROR';
  algorithm?: string;
  quickStats?: SortStats;
  mergeStats?: SortStats;
  singleStats?: SortStats;
  sortedArray?: number[];
  progressMessage?: string;
  progressPercent?: number;
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
  error?: string;
}

self.onmessage = (e: MessageEvent<WorkerMessageRequest>) => {
  const { type, algorithm, array, pivotStrategy = 'random', inputPattern = 'random', datasetSizes } = e.data;

  try {
    if (type === 'RUN_SINGLE') {
      self.postMessage({
        type: 'PROGRESS',
        progressMessage: `Running ${algorithm} on ${array.length.toLocaleString()} elements...`,
        progressPercent: 30,
      } as WorkerMessageResponse);

      let result;
      if (algorithm === 'Quick Sort') {
        result = runQuickSort(array, pivotStrategy, inputPattern);
      } else {
        result = runMergeSort(array, inputPattern);
      }

      self.postMessage({
        type: 'SUCCESS',
        algorithm,
        singleStats: result.stats,
        sortedArray: array.length <= 10000 ? result.sortedArray : undefined,
      } as WorkerMessageResponse);
    } else if (type === 'RUN_COMPARISON') {
      self.postMessage({
        type: 'PROGRESS',
        progressMessage: `Running Quick Sort on ${array.length.toLocaleString()} elements...`,
        progressPercent: 20,
      } as WorkerMessageResponse);

      const quickResult = runQuickSort(array, pivotStrategy, inputPattern);

      self.postMessage({
        type: 'PROGRESS',
        progressMessage: `Running Merge Sort on ${array.length.toLocaleString()} elements...`,
        progressPercent: 60,
      } as WorkerMessageResponse);

      const mergeResult = runMergeSort(array, inputPattern);

      self.postMessage({
        type: 'PROGRESS',
        progressMessage: `Verifying sorted results...`,
        progressPercent: 90,
      } as WorkerMessageResponse);

      self.postMessage({
        type: 'SUCCESS',
        quickStats: quickResult.stats,
        mergeStats: mergeResult.stats,
      } as WorkerMessageResponse);
    } else if (type === 'RUN_MULTI_SIZE' && datasetSizes) {
      const multiSizeResults = [];
      const totalSteps = datasetSizes.length;

      for (let i = 0; i < datasetSizes.length; i++) {
        const sz = datasetSizes[i];
        const percent = Math.round(((i + 1) / totalSteps) * 100);

        self.postMessage({
          type: 'PROGRESS',
          progressMessage: `Benchmarking dataset size ${sz.toLocaleString()} (${i + 1}/${totalSteps})...`,
          progressPercent: percent,
        } as WorkerMessageResponse);

        const subArray = array.length >= sz ? array.slice(0, sz) : array;

        const qRes = runQuickSort(subArray, pivotStrategy, inputPattern);
        const mRes = runMergeSort(subArray, inputPattern);

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

      self.postMessage({
        type: 'SUCCESS',
        multiSizeResults,
      } as WorkerMessageResponse);
    }
  } catch (err: any) {
    self.postMessage({
      type: 'ERROR',
      error: err?.message || 'Error occurred during worker execution.',
    } as WorkerMessageResponse);
  }
};
