export type PivotStrategy = 'random' | 'median3' | 'last' | 'first';

export type InputPattern = 'random' | 'sorted' | 'reverse';

export type DatasetSize = 1000 | 10000 | 50000 | 100000 | 500000 | 1000000;

export type DomainType = 'student' | 'salary' | 'ratings' | 'ecommerce' | 'financial' | 'custom';

export interface ColumnMeta {
  colName: string;
  label: string;
  description: string;
  unit: string;
  minVal: number;
  maxVal: number;
}

export interface MLRecord {
  id: number;
  [key: string]: string | number;
}

export interface DatasetInfo {
  name: string;
  domain: DomainType;
  domainLabel: string;
  description: string;
  recordsCount: number;
  columns: string[];
  numericColumns: string[];
  selectedColumn: string;
  columnDictionary: Record<string, ColumnMeta>;
  data: MLRecord[];
  isCustomCSV: boolean;
}

export interface BenchmarkEnvironment {
  userAgent: string;
  hardwareConcurrency: number;
  deviceMemoryGb: number;
  engine: string;
  runsPerTest: number;
}

export interface SortStats {
  algorithm: 'Quick Sort' | 'Merge Sort';
  executionTimeMs: number;
  meanExecutionTimeMs: number;
  medianExecutionTimeMs: number;
  stdDevMs: number;
  comparisons: number;
  swapsOrMoves: number;
  maxRecursionDepth: number;
  isSortedCorrectly: boolean;
  checksumInvariant: boolean;
  itemCount: number;
  pivotStrategy?: PivotStrategy;
  inputPattern: InputPattern;
  timestamp: number;
  runsCount: number;
  environment: BenchmarkEnvironment;
}

export interface RuleBasedObservation {
  title: string;
  primaryObservation: string;
  technicalReason: string;
  daTheoryConnect: string;
  recommendation: string;
}

export interface SizeBenchmarkResult {
  size: number;
  formattedSize: string;
  quickTime: number;
  mergeTime: number;
  quickComparisons: number;
  mergeComparisons: number;
  quickSwaps: number;
  mergeMoves: number;
}

export interface PatternBenchmarkResult {
  pattern: InputPattern;
  patternLabel: string;
  quickTime: number;
  mergeTime: number;
  quickComparisons: number;
  mergeComparisons: number;
}

export interface VisStep {
  array: number[];
  activeIndices: number[]; // indices being compared or merged
  pivotIndex?: number;    // index of pivot for Quick Sort
  iPointer?: number;      // index of i (boundary pointer for elements <= pivot, can be -1 at start)
  jPointer?: number;      // index of j (scan pointer)
  kPointer?: number;      // index of k (placement pointer for Merge Sort)
  partitionRange?: [number, number]; // [low, high]
  mergedIndices?: number[]; // indices that have been placed in final sorted order
  message: string;
  stepPhase?: 'init' | 'compare' | 'increment_i' | 'swap' | 'pivot_placed' | 'sorted';
  swappedIndices?: [number, number];
}

export type ActiveTab = 'home' | 'dataset' | 'settings' | 'visualize' | 'results' | 'analysis';
