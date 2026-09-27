import type { VisStep } from '../types/sorting';

/**
 * Generates exact, academically defensible step-by-step visualization for Quick Sort.
 * Uses Lomuto Partitioning Scheme with explicit i and j pointers, incrementation steps,
 * element swaps, and partition boundary tracking.
 */
export function generateQuickSortVisSteps(initialArray: number[], pivotStrategy: string = 'random'): VisStep[] {
  const steps: VisStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sortedIndices = new Set<number>();

  steps.push({
    array: [...arr],
    activeIndices: [],
    iPointer: -1,
    jPointer: 0,
    message: 'Initial array state. Click Play or Step Forward to visualize Quick Sort Lomuto partitioning.',
    stepPhase: 'init',
  });

  function swap(a: number, b: number) {
    if (a !== b) {
      const temp = arr[a];
      arr[a] = arr[b];
      arr[b] = temp;
    }
  }

  function choosePivotIndex(low: number, high: number): number {
    if (pivotStrategy === 'first') return low;
    if (pivotStrategy === 'last') return high;
    if (pivotStrategy === 'median3') {
      const mid = Math.floor((low + high) / 2);
      const valA = arr[low], valB = arr[mid], valC = arr[high];
      if ((valA >= valB && valA <= valC) || (valA <= valB && valA >= valC)) return low;
      if ((valB >= valA && valB <= valC) || (valB <= valA && valB >= valC)) return mid;
      return high;
    }
    return low + Math.floor(Math.random() * (high - low + 1));
  }

  function partition(low: number, high: number): number {
    const chosenIdx = choosePivotIndex(low, high);
    if (chosenIdx !== high) {
      swap(chosenIdx, high);
    }
    const pivotValue = arr[high];

    let i = low - 1;

    // Initialization step for this partition sub-array
    steps.push({
      array: [...arr],
      activeIndices: [high],
      pivotIndex: high,
      iPointer: i,
      jPointer: low,
      partitionRange: [low, high],
      mergedIndices: Array.from(sortedIndices),
      message: `Sub-array [${low}..${high}]: Selected Pivot P = arr[${high}] = ${pivotValue}. Initialized boundary pointer i = ${i}, scan pointer j = ${low}.`,
      stepPhase: 'init',
    });

    for (let j = low; j < high; j++) {
      // Step A: Compare arr[j] vs Pivot P
      steps.push({
        array: [...arr],
        activeIndices: [j, high],
        pivotIndex: high,
        iPointer: i,
        jPointer: j,
        partitionRange: [low, high],
        mergedIndices: Array.from(sortedIndices),
        message: `Scanning j = ${j} (arr[j] = ${arr[j]}). Comparing with Pivot P = ${pivotValue}.`,
        stepPhase: 'compare',
      });

      if (arr[j] <= pivotValue) {
        // Step B1: Increment i
        i++;
        steps.push({
          array: [...arr],
          activeIndices: [i, j],
          pivotIndex: high,
          iPointer: i,
          jPointer: j,
          partitionRange: [low, high],
          mergedIndices: Array.from(sortedIndices),
          message: `arr[j=${j}] (${arr[j]}) ≤ Pivot P (${pivotValue}). Incremented boundary pointer i to ${i}.`,
          stepPhase: 'increment_i',
        });

        // Step B2: Swap arr[i] and arr[j] if i !== j
        if (i !== j) {
          const valI = arr[i];
          const valJ = arr[j];
          swap(i, j);

          steps.push({
            array: [...arr],
            activeIndices: [i, j],
            pivotIndex: high,
            iPointer: i,
            jPointer: j,
            partitionRange: [low, high],
            mergedIndices: Array.from(sortedIndices),
            swappedIndices: [i, j],
            message: `Swapped arr[i=${i}] (${valI}) and arr[j=${j}] (${valJ}). Region [${low}..${i}] now contains elements ≤ Pivot P (${pivotValue}).`,
            stepPhase: 'swap',
          });
        }
      } else {
        // Step C: arr[j] > pivotValue
        steps.push({
          array: [...arr],
          activeIndices: [j],
          pivotIndex: high,
          iPointer: i,
          jPointer: j,
          partitionRange: [low, high],
          mergedIndices: Array.from(sortedIndices),
          message: `arr[j=${j}] (${arr[j]}) > Pivot P (${pivotValue}). Pointer i remains at ${i}. Element arr[j] placed in region > Pivot P.`,
          stepPhase: 'compare',
        });
      }
    }

    // Final Pivot Placement: Swap pivot from high to i+1
    const finalPivotPos = i + 1;
    const oldPivotVal = arr[high];
    const oldBoundaryVal = arr[finalPivotPos];

    swap(finalPivotPos, high);
    sortedIndices.add(finalPivotPos);

    steps.push({
      array: [...arr],
      activeIndices: [finalPivotPos],
      pivotIndex: finalPivotPos,
      iPointer: finalPivotPos,
      partitionRange: [low, high],
      mergedIndices: Array.from(sortedIndices),
      swappedIndices: [finalPivotPos, high],
      message: `Partition Complete: Swapped Pivot P (${oldPivotVal}) from index ${high} to final sorted position index ${finalPivotPos} (swapped with ${oldBoundaryVal}). Sub-arrays [${low}..${finalPivotPos - 1}] (≤ ${oldPivotVal}) and [${finalPivotPos + 1}..${high}] (> ${oldPivotVal}) isolated.`,
      stepPhase: 'pivot_placed',
    });

    return finalPivotPos;
  }

  function quickSortHelper(low: number, high: number) {
    if (low < high) {
      const p = partition(low, high);
      quickSortHelper(low, p - 1);
      quickSortHelper(p + 1, high);
    } else if (low === high) {
      sortedIndices.add(low);
      steps.push({
        array: [...arr],
        activeIndices: [low],
        mergedIndices: Array.from(sortedIndices),
        message: `Single element sub-array [${low}] with value ${arr[low]} is in final sorted position.`,
        stepPhase: 'sorted',
      });
    }
  }

  quickSortHelper(0, n - 1);

  steps.push({
    array: [...arr],
    activeIndices: [],
    mergedIndices: Array.from({ length: n }, (_, idx) => idx),
    message: '✓ Quick Sort Complete: All elements partitioned and fully sorted in ascending order.',
    stepPhase: 'sorted',
  });

  return steps;
}

/**
 * Generates step-by-step visualization for Merge Sort.
 */
export function generateMergeSortVisSteps(initialArray: number[]): VisStep[] {
  const steps: VisStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sortedIndicesSet = new Set<number>();

  steps.push({
    array: [...arr],
    activeIndices: [],
    message: 'Initial array state for Merge Sort divide-and-conquer visualization.',
    stepPhase: 'init',
  });

  function merge(low: number, mid: number, high: number) {
    steps.push({
      array: [...arr],
      activeIndices: [low, mid, high],
      partitionRange: [low, high],
      mergedIndices: Array.from(sortedIndicesSet),
      message: `Subarray Merging: Merging sorted left half [${low}..${mid}] with sorted right half [${mid + 1}..${high}].`,
      stepPhase: 'init',
    });

    const left = arr.slice(low, mid + 1);
    const right = arr.slice(mid + 1, high + 1);

    let i = 0, j = 0, k = low;

    while (i < left.length && j < right.length) {
      const leftIdx = low + i;
      const rightIdx = mid + 1 + j;

      steps.push({
        array: [...arr],
        activeIndices: [leftIdx, rightIdx],
        iPointer: leftIdx,
        jPointer: rightIdx,
        kPointer: k,
        partitionRange: [low, high],
        mergedIndices: Array.from(sortedIndicesSet),
        message: `Comparing Left element ${left[i]} (idx ${leftIdx}) vs Right element ${right[j]} (idx ${rightIdx}).`,
        stepPhase: 'compare',
      });

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }

      steps.push({
        array: [...arr],
        activeIndices: [k],
        kPointer: k,
        partitionRange: [low, high],
        mergedIndices: Array.from(sortedIndicesSet),
        message: `Placed smaller element ${arr[k]} into position ${k}.`,
        stepPhase: 'swap',
      });

      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      steps.push({
        array: [...arr],
        activeIndices: [k],
        kPointer: k,
        partitionRange: [low, high],
        mergedIndices: Array.from(sortedIndicesSet),
        message: `Copied remaining left element ${arr[k]} into position ${k}.`,
        stepPhase: 'swap',
      });
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      steps.push({
        array: [...arr],
        activeIndices: [k],
        kPointer: k,
        partitionRange: [low, high],
        mergedIndices: Array.from(sortedIndicesSet),
        message: `Copied remaining right element ${arr[k]} into position ${k}.`,
        stepPhase: 'swap',
      });
      j++;
      k++;
    }

    for (let idx = low; idx <= high; idx++) {
      sortedIndicesSet.add(idx);
    }

    steps.push({
      array: [...arr],
      activeIndices: [],
      partitionRange: [low, high],
      mergedIndices: Array.from(sortedIndicesSet),
      message: `Merge Complete: Range [${low}..${high}] is now ordered.`,
      stepPhase: 'sorted',
    });
  }

  function mergeSortHelper(low: number, high: number) {
    if (low < high) {
      const mid = Math.floor((low + high) / 2);
      steps.push({
        array: [...arr],
        activeIndices: [low, mid, high],
        partitionRange: [low, high],
        mergedIndices: Array.from(sortedIndicesSet),
        message: `Divide Step: Splitting range [${low}..${high}] into [${low}..${mid}] and [${mid + 1}..${high}].`,
        stepPhase: 'init',
      });

      mergeSortHelper(low, mid);
      mergeSortHelper(mid + 1, high);
      merge(low, mid, high);
    }
  }

  mergeSortHelper(0, n - 1);

  steps.push({
    array: [...arr],
    activeIndices: [],
    mergedIndices: Array.from({ length: n }, (_, idx) => idx),
    message: '✓ Merge Sort Complete: All sub-arrays merged and fully sorted in ascending order.',
    stepPhase: 'sorted',
  });

  return steps;
}
