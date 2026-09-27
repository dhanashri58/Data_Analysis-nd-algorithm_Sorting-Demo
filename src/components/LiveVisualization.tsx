import { useState, useEffect } from 'react';
import type { VisStep } from '../types/sorting';
import {
  generateQuickSortVisSteps,
  generateMergeSortVisSteps
} from '../algorithms/visualizationGenerator';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Info
} from 'lucide-react';

interface LiveVisualizationProps {
  pivotStrategy: string;
}

export const LiveVisualization = ({ pivotStrategy }: LiveVisualizationProps) => {
  const [algo, setAlgo] = useState<'Quick Sort' | 'Merge Sort'>('Quick Sort');
  const [sampleSize, setSampleSize] = useState<number>(40);
  const [speedMs, setSpeedMs] = useState<number>(50);
  const [steps, setSteps] = useState<VisStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [sampleArray, setSampleArray] = useState<number[]>(() => {
    return Array.from({ length: 40 }, () => Math.floor(12 + Math.random() * 88));
  });

  useEffect(() => {
    let generatedSteps: VisStep[] = [];
    if (algo === 'Quick Sort') {
      generatedSteps = generateQuickSortVisSteps(sampleArray, pivotStrategy);
    } else {
      generatedSteps = generateMergeSortVisSteps(sampleArray);
    }
    setSteps(generatedSteps);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [sampleArray, algo, pivotStrategy]);

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setTimeout(() => {
        setCurrentStepIdx((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speedMs);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentStepIdx, steps, speedMs]);

  const handleShuffleSample = () => {
    const newArr = Array.from({ length: sampleSize }, () => Math.floor(12 + Math.random() * 88));
    setSampleArray(newArr);
  };

  const handleSampleSizeChange = (newSize: number) => {
    setSampleSize(newSize);
    const newArr = Array.from({ length: newSize }, () => Math.floor(12 + Math.random() * 88));
    setSampleArray(newArr);
  };

  const currentStep = steps[currentStepIdx] || {
    array: sampleArray,
    activeIndices: [],
    message: 'Ready to visualize step-by-step partition and merge operations.',
  };

  const maxVal = Math.max(...currentStep.array, 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden p-6 space-y-5">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl shadow-md">
            <Play className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white tracking-wide">
                STEP-BY-STEP ALGORITHM VISUALIZATION
              </h3>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                Interactive Pointers
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Visualizes internal pointers ({algo === 'Quick Sort' ? 'i, j, and Pivot' : 'Left i, Right j, and Placement k'}) on representative samples
            </p>
          </div>
        </div>

        {/* Algorithm Switcher */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setAlgo('Quick Sort')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              algo === 'Quick Sort' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quick Sort
          </button>
          <button
            onClick={() => setAlgo('Merge Sort')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              algo === 'Merge Sort' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Merge Sort
          </button>
        </div>
      </div>

      {/* Representative Sample Banner */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-semibold">
            Visualization uses a representative sample ({sampleSize} elements); full execution benchmark runs on up to 1,000,000 dataset rows.
          </span>
        </div>
        <span className="text-[11px] font-mono text-blue-800 bg-blue-100/90 px-2.5 py-1 rounded-lg font-bold shrink-0 self-start sm:self-auto border border-blue-200">
          Step {currentStepIdx + 1} / {steps.length}
        </span>
      </div>

      {/* Animation Controls Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 font-extrabold text-xs px-4 py-2.5 rounded-xl text-white shadow-md transition active:scale-95 cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play Animation'}</span>
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIdx(0);
            }}
            className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300 transition cursor-pointer"
            title="Reset to step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              if (currentStepIdx > 0) setCurrentStepIdx((p) => p - 1);
            }}
            disabled={currentStepIdx === 0}
            className="p-2.5 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 rounded-xl border border-slate-300 transition cursor-pointer"
            title="Step Back"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              if (currentStepIdx < steps.length - 1) setCurrentStepIdx((p) => p + 1);
            }}
            disabled={currentStepIdx >= steps.length - 1}
            className="p-2.5 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 rounded-xl border border-slate-300 transition cursor-pointer"
            title="Step Forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleShuffleSample}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100/80 px-3.5 py-2.5 rounded-xl border border-blue-200 transition cursor-pointer"
          >
            Generate New Sample
          </button>
        </div>

        {/* Speed & Sample Controls */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-semibold">Speed:</span>
            <div className="flex bg-white rounded-lg border border-slate-300 p-0.5 shadow-inner">
              {[
                { label: 'Slow', ms: 150 },
                { label: 'Medium', ms: 50 },
                { label: 'Fast', ms: 15 },
                { label: 'Turbo', ms: 3 },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSpeedMs(s.ms)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                    speedMs === s.ms ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-semibold">Items:</span>
            <div className="flex bg-white rounded-lg border border-slate-300 p-0.5 shadow-inner">
              {[30, 40, 60, 80].map((sz) => (
                <button
                  key={sz}
                  onClick={() => handleSampleSizeChange(sz)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                    sampleSize === sz ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Step Message Box & Pointers Summary */}
      <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl border border-slate-800 space-y-2 shadow-inner">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-start space-x-2">
            <span className="text-amber-400 font-bold font-mono text-xs shrink-0 mt-0.5">● STATUS:</span>
            <span className="text-slate-200 text-xs font-mono leading-relaxed">{currentStep.message}</span>
          </div>

          {/* Pointer State Badges */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0 text-[11px] font-mono">
            {currentStep.pivotIndex !== undefined && (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold">
                Pivot: arr[{currentStep.pivotIndex}] = {currentStep.array[currentStep.pivotIndex]}
              </span>
            )}

            {currentStep.iPointer !== undefined && (
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded font-bold">
                Pointer i: {currentStep.iPointer}
              </span>
            )}

            {currentStep.jPointer !== undefined && (
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded font-bold">
                Pointer j: {currentStep.jPointer}
              </span>
            )}

            {currentStep.kPointer !== undefined && (
              <span className="bg-orange-500/20 text-orange-300 border border-orange-500/40 px-2 py-0.5 rounded font-bold">
                Pointer k: {currentStep.kPointer}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Vertical Bars Canvas Box */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 min-h-[340px] flex flex-col justify-end relative shadow-2xl">
        {/* Active Partition Subarray Range Bar */}
        {currentStep.partitionRange && (
          <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
            <span>Active Range Subarray: Index [{currentStep.partitionRange[0]} .. {currentStep.partitionRange[1]}]</span>
            <span className="text-slate-500">Elements &le; Pivot move left of i; Elements &gt; Pivot remain right</span>
          </div>
        )}

        <div className="flex items-end justify-center space-x-1 h-64 w-full pt-8">
          {currentStep.array.map((val, idx) => {
            const heightPercent = Math.max(8, Math.round((val / maxVal) * 100));

            const isPivot = currentStep.pivotIndex === idx;
            const isIPointer = currentStep.iPointer === idx;
            const isJPointer = currentStep.jPointer === idx;
            const isKPointer = currentStep.kPointer === idx;
            const isMerged = currentStep.mergedIndices?.includes(idx);
            const isActive = currentStep.activeIndices?.includes(idx);

            let barColor = 'bg-slate-600';
            if (isPivot) {
              barColor = 'bg-amber-400 shadow-lg shadow-amber-400/50 ring-2 ring-amber-300';
            } else if (isIPointer) {
              barColor = 'bg-purple-500 shadow-md shadow-purple-500/50 ring-2 ring-purple-300';
            } else if (isJPointer) {
              barColor = 'bg-cyan-400 shadow-md shadow-cyan-400/50 ring-2 ring-cyan-300';
            } else if (isKPointer) {
              barColor = 'bg-orange-500 shadow-md shadow-orange-500/50 ring-2 ring-orange-300';
            } else if (isMerged) {
              barColor = 'bg-emerald-500 opacity-90';
            } else if (isActive) {
              barColor = 'bg-blue-400 shadow-md shadow-blue-400/40';
            }

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-end transition-all duration-75 group relative"
                style={{ height: '100%' }}
              >
                {/* Pointer Callout Badges above bars */}
                <div className="absolute -top-6 flex flex-col items-center z-10 pointer-events-none">
                  {isPivot && (
                    <span className="bg-amber-400 text-slate-950 font-mono text-[9px] font-black px-1 rounded shadow uppercase">
                      Pivot
                    </span>
                  )}
                  {isIPointer && !isPivot && (
                    <span className="bg-purple-500 text-white font-mono text-[9px] font-black px-1 rounded shadow">
                      i
                    </span>
                  )}
                  {isJPointer && !isPivot && (
                    <span className="bg-cyan-400 text-slate-950 font-mono text-[9px] font-black px-1 rounded shadow">
                      j
                    </span>
                  )}
                  {isKPointer && !isPivot && (
                    <span className="bg-orange-500 text-white font-mono text-[9px] font-black px-1 rounded shadow">
                      k
                    </span>
                  )}
                </div>

                <div
                  className={`w-full rounded-t-sm ${barColor} transition-all duration-100 relative`}
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none z-20 whitespace-nowrap">
                    idx {idx}: {val}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Color Legend */}
        <div className="flex flex-wrap items-center justify-center gap-5 mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-300">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-amber-400 border border-amber-300 inline-block" />
            <span className="font-semibold text-amber-300">Pivot Value</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-purple-500 inline-block" />
            <span className="font-semibold text-purple-300">Pointer i (&le; Pivot Boundary)</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-cyan-400 inline-block" />
            <span className="font-semibold text-cyan-300">Pointer j (Scanning Index)</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
            <span className="font-semibold text-emerald-300">Sorted / Final Placement</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-slate-600 inline-block" />
            <span>Unsorted Subarray</span>
          </div>
        </div>
      </div>
    </div>
  );
};
