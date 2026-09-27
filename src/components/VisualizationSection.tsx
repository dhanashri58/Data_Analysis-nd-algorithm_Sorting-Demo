import { useState, useEffect } from 'react';
import type { VisStep, ActiveTab, DatasetInfo, InputPattern } from '../types/sorting';
import {
  generateQuickSortVisSteps,
  generateMergeSortVisSteps
} from '../algorithms/visualizationGenerator';
import { extractAndTransformColumn } from '../algorithms/generator';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Info,
  ArrowLeft,
  ArrowRight,
  Database,
  Layers
} from 'lucide-react';

interface VisualizationSectionProps {
  dataset: DatasetInfo;
  selectedColumn: string;
  inputPattern: InputPattern;
  pivotStrategy: string;
  setActiveTab: (tab: ActiveTab) => void;
}

export const VisualizationSection = ({
  dataset,
  selectedColumn,
  inputPattern,
  pivotStrategy,
  setActiveTab,
}: VisualizationSectionProps) => {
  const [algo, setAlgo] = useState<'Quick Sort' | 'Merge Sort'>('Quick Sort');
  const [sampleSize, setSampleSize] = useState<number>(20);
  const [speedMs, setSpeedMs] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'bars' | 'array'>('bars');
  const [steps, setSteps] = useState<VisStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Custom User Numbers Input
  const [customInputText, setCustomInputText] = useState<string>('8, 3, 5, 1, 9, 14, 2');

  const [sampleArray, setSampleArray] = useState<number[]>(() => {
    const full = extractAndTransformColumn(dataset.data, selectedColumn, inputPattern);
    return full.slice(0, 20);
  });

  // Re-sync sample array whenever active dataset, selected column, or input pattern changes
  useEffect(() => {
    const full = extractAndTransformColumn(dataset.data, selectedColumn, inputPattern);
    setSampleArray(full.slice(0, sampleSize));
  }, [dataset, selectedColumn, inputPattern, sampleSize]);

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
    const full = extractAndTransformColumn(dataset.data, selectedColumn, inputPattern);
    const startIdx = Math.floor(Math.random() * Math.max(1, full.length - sampleSize));
    setSampleArray(full.slice(startIdx, startIdx + sampleSize));
  };

  const handleSampleSizeChange = (newSize: number) => {
    setSampleSize(newSize);
    const full = extractAndTransformColumn(dataset.data, selectedColumn, inputPattern);
    setSampleArray(full.slice(0, newSize));
  };

  const handleApplyCustomNumbers = () => {
    const parsed = customInputText
      .split(',')
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));

    if (parsed.length >= 2) {
      setSampleSize(parsed.length);
      setSampleArray(parsed.slice(0, 30));
    }
  };

  const handleApplyScenario = (type: 'best' | 'worst') => {
    if (type === 'worst') {
      // Reverse pre-sorted array (1 to 20 descending)
      const worstArr = Array.from({ length: 15 }, (_, i) => 15 - i);
      setSampleSize(15);
      setSampleArray(worstArr);
    } else {
      // Random array
      const bestArr = Array.from({ length: 15 }, () => Math.floor(5 + Math.random() * 90));
      setSampleSize(15);
      setSampleArray(bestArr);
    }
  };

  const currentStep = steps[currentStepIdx] || {
    array: sampleArray,
    activeIndices: [],
    iPointer: -1,
    jPointer: 0,
    message: 'Ready to visualize step-by-step partition and merge operations.',
  };

  const maxVal = Math.max(...currentStep.array, 10);
  const colMeta = dataset.columnDictionary[selectedColumn];

  // Calculate Lomuto partition region boundaries for Quick Sort
  const partitionLow = currentStep.partitionRange ? currentStep.partitionRange[0] : 0;
  const partitionHigh = currentStep.partitionRange ? currentStep.partitionRange[1] : sampleArray.length - 1;
  const currentI = currentStep.iPointer !== undefined ? currentStep.iPointer : -1;
  const currentJ = currentStep.jPointer !== undefined ? currentStep.jPointer : 0;
  const currentPivotIdx = currentStep.pivotIndex;

  const progressPercent = steps.length > 1 ? Math.round((currentStepIdx / (steps.length - 1)) * 100) : 0;

  return (
    <div className="space-y-6 w-full min-w-0 font-sans">
      {/* Panel 05 Header Badge */}
      <div className="flex items-center space-x-2">
        <span className="bg-teal-400 text-slate-950 text-xs font-black font-mono px-2.5 py-1 rounded-md border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          05
        </span>
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider font-mono">
          Sorting Visualization Engine (Lomuto Partition)
        </h2>
      </div>

      <div className="bg-teal-100 border-2 border-slate-950 rounded-2xl p-4 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-6 w-full min-w-0">
        {/* Panel Header & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-950 pb-4">
          <div className="flex items-center space-x-2">
            <span className="bg-slate-950 text-teal-300 w-6 h-6 rounded-full flex items-center justify-center font-mono font-black text-xs">
              05
            </span>
            <h3 className="text-xl font-black text-slate-950 uppercase font-sans">
              SORTING VISUALIZATION
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono">
            {/* Bars vs Array Mode Switcher matching image-2.png */}
            <div className="flex bg-white rounded-xl border-2 border-slate-950 p-0.5 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-xs font-black">
              <button
                onClick={() => setViewMode('bars')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  viewMode === 'bars' ? 'bg-slate-950 text-teal-300' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Bars View
              </button>
              <button
                onClick={() => setViewMode('array')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  viewMode === 'array' ? 'bg-slate-950 text-teal-300' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Array View
              </button>
            </div>

            <span className="text-xs font-mono font-bold bg-white text-slate-950 px-3 py-1.5 rounded-lg border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-teal-600" />
              <span>Feature: {selectedColumn} ({colMeta?.unit || 'val'})</span>
            </span>
          </div>
        </div>

        {/* Controls Row & Scenario Presets */}
        <div className="bg-white border-2 border-slate-950 rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-3 font-bold">
              <div>
                <label className="block text-[10px] text-slate-500 uppercase">Algorithm:</label>
                <select
                  value={algo}
                  onChange={(e) => setAlgo(e.target.value as any)}
                  className="bg-slate-50 border-2 border-slate-950 rounded-lg px-2.5 py-1.5 font-mono font-black text-slate-950 cursor-pointer"
                >
                  <option value="Quick Sort">Quick Sort (Lomuto Scheme)</option>
                  <option value="Merge Sort">Merge Sort (Divide-and-Merge)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase">Array Size:</label>
                <select
                  value={sampleSize}
                  onChange={(e) => handleSampleSizeChange(Number(e.target.value))}
                  className="bg-slate-50 border-2 border-slate-950 rounded-lg px-2.5 py-1.5 font-mono font-bold text-slate-950 cursor-pointer"
                >
                  <option value={10}>10 items</option>
                  <option value={15}>15 items</option>
                  <option value={20}>20 items</option>
                  <option value={30}>30 items</option>
                  <option value={40}>40 items</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase">Speed:</label>
                <div className="flex bg-slate-100 rounded-lg border-2 border-slate-950 p-0.5">
                  {[
                    { label: 'Slow', ms: 150 },
                    { label: 'Medium', ms: 50 },
                    { label: 'Fast', ms: 15 },
                    { label: 'Turbo', ms: 3 },
                  ].map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setSpeedMs(s.ms)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                        speedMs === s.ms ? 'bg-slate-950 text-teal-300 font-black' : 'text-slate-700 hover:text-slate-950'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 font-black text-xs px-4 py-2 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition cursor-pointer ${
                  isPlaying ? 'bg-amber-400 text-slate-950' : 'bg-emerald-400 text-slate-950'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIdx(0);
                }}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-950 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition cursor-pointer"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  if (currentStepIdx > 0) setCurrentStepIdx((p) => p - 1);
                }}
                disabled={currentStepIdx === 0}
                className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-950 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition cursor-pointer"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  if (currentStepIdx < steps.length - 1) setCurrentStepIdx((p) => p + 1);
                }}
                disabled={currentStepIdx >= steps.length - 1}
                className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-950 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleShuffleSample}
                className="text-xs font-bold bg-cyan-300 hover:bg-cyan-200 text-slate-950 px-3 py-2 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition cursor-pointer"
              >
                Shuffle
              </button>
            </div>
          </div>

          {/* Preset Cases & Custom Number Input matching image-2.png */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-3 border-t-2 border-slate-100 font-mono text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-700">Preset Scenarios:</span>
              <button
                onClick={() => handleApplyScenario('best')}
                className="bg-emerald-100 hover:bg-emerald-200 text-slate-950 px-3 py-1 rounded-lg border-2 border-slate-950 font-bold cursor-pointer shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
              >
                Best Case
              </button>
              <button
                onClick={() => handleApplyScenario('worst')}
                className="bg-rose-100 hover:bg-rose-200 text-slate-950 px-3 py-1 rounded-lg border-2 border-slate-950 font-bold cursor-pointer shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
              >
                Worst Case O(N²)
              </button>
            </div>

            {/* Custom Numbers Box */}
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <span className="font-bold text-slate-700 shrink-0">Your numbers:</span>
              <input
                type="text"
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
                placeholder="e.g. 8, 3, 5, 1, 9"
                className="bg-slate-50 border-2 border-slate-950 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-950 w-full md:w-44 outline-none"
              />
              <button
                onClick={handleApplyCustomNumbers}
                className="bg-amber-300 hover:bg-amber-400 text-slate-950 px-3 py-1 rounded-lg border-2 border-slate-950 font-black cursor-pointer shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] shrink-0"
              >
                Visualize
              </button>
            </div>
          </div>
        </div>

        {/* Current Step Status & Pointer HUD Box */}
        <div className="bg-slate-950 text-slate-100 p-4 rounded-xl border-2 border-slate-950 space-y-3 font-mono shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="flex items-start space-x-2">
              <span className="text-amber-400 font-bold text-xs shrink-0 mt-0.5">● STATUS:</span>
              <span className="text-slate-200 text-xs leading-relaxed">{currentStep.message}</span>
            </div>

            <div className="flex items-center space-x-3 text-xs font-bold text-slate-300 shrink-0">
              <span>Step {currentStepIdx + 1} / {steps.length}</span>
              <span>•</span>
              <span className="text-amber-400">{progressPercent}%</span>
            </div>
          </div>

          {/* Interactive Progress Scrub Slider matching image-2.png */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>Scrub Step History:</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(0, steps.length - 1)}
              value={currentStepIdx}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentStepIdx(Number(e.target.value));
              }}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg border border-slate-700"
            />
          </div>

          {/* Dynamic Pointer Badges Tracker */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs border-t border-slate-800">
            {/* Pointer i indicator (shows index -1 when initialized off-screen) */}
            <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border-2 ${
              currentI >= 0 ? 'bg-purple-400 text-slate-950 border-slate-950 font-black' : 'bg-slate-800 text-purple-300 border-slate-700 font-bold'
            }`}>
              <span className="text-[10px] uppercase font-extrabold">Boundary Pointer i:</span>
              <span className="bg-slate-950 text-purple-300 px-1.5 rounded text-[11px] font-mono">
                {currentI >= 0 ? `idx ${currentI}` : 'idx -1 (off-screen left)'}
              </span>
            </div>

            {/* Pointer j indicator */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border-2 bg-cyan-300 text-slate-950 border-slate-950 font-black">
              <span className="text-[10px] uppercase font-extrabold">Scan Pointer j:</span>
              <span className="bg-slate-950 text-cyan-300 px-1.5 rounded text-[11px] font-mono">
                idx {currentJ}
              </span>
            </div>

            {/* Pivot Indicator */}
            {currentPivotIdx !== undefined && (
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border-2 bg-amber-400 text-slate-950 border-slate-950 font-black shadow-[1px_1px_0px_0px_rgba(255,255,255,1)]">
                <span className="text-[10px] uppercase font-extrabold">Pivot P:</span>
                <span className="bg-slate-950 text-amber-300 px-1.5 rounded text-[11px] font-mono">
                  arr[{currentPivotIdx}] = {currentStep.array[currentPivotIdx]}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Partition Region Segmentation Bar (Lomuto Scheme Breakdown) */}
        {algo === 'Quick Sort' && (
          <div className="bg-slate-900 border-2 border-slate-950 rounded-xl p-3 font-mono text-xs space-y-2 text-slate-200">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-amber-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Lomuto Partition Boundary Segmentation:</span>
              </span>
              <span className="text-slate-400">Sub-array Range [{partitionLow}..{partitionHigh}]</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[10px]">
              <div className="bg-purple-950/80 border border-purple-500 rounded p-1.5 text-purple-200">
                <span className="font-bold block">Region ≤ Pivot P:</span>
                <span>Indices [{partitionLow} .. {currentI >= partitionLow ? currentI : 'none'}]</span>
              </div>

              <div className="bg-slate-800 border border-slate-600 rounded p-1.5 text-slate-300">
                <span className="font-bold block">Region &gt; Pivot P:</span>
                <span>Indices [{currentI + 1} .. {currentJ - 1 >= currentI + 1 ? currentJ - 1 : 'none'}]</span>
              </div>

              <div className="bg-cyan-950 border border-cyan-400 rounded p-1.5 text-cyan-200">
                <span className="font-bold block">Active Scanner j:</span>
                <span>Index {currentJ} (arr[{currentJ}] = {currentStep.array[currentJ] ?? '-'})</span>
              </div>

              <div className="bg-amber-950 border border-amber-400 rounded p-1.5 text-amber-200">
                <span className="font-bold block">Active Pivot P:</span>
                <span>Index {currentPivotIdx ?? partitionHigh} (arr = {currentPivotIdx !== undefined ? currentStep.array[currentPivotIdx] : '-'})</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Canvas Box: Bars View OR Array View */}
        {viewMode === 'array' ? (
          <div className="bg-slate-950 rounded-2xl p-6 border-2 border-slate-950 space-y-4 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] font-mono text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-amber-400 font-bold text-xs uppercase">Array Memory Representation</span>
              <span className="text-slate-400 text-xs">Size: {currentStep.array.length} items</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 justify-center p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-lg font-bold">[</span>
              {currentStep.array.map((val, idx) => {
                const isPivot = currentStep.pivotIndex === idx;
                const isIPointer = currentI === idx;
                const isJPointer = currentJ === idx;
                const isMerged = currentStep.mergedIndices?.includes(idx);

                let badgeColor = 'bg-slate-800 text-slate-200 border-slate-700';
                if (isPivot) badgeColor = 'bg-amber-400 text-slate-950 font-black border-amber-300 ring-2 ring-amber-300';
                else if (isJPointer) badgeColor = 'bg-cyan-300 text-slate-950 font-black border-cyan-200';
                else if (isIPointer) badgeColor = 'bg-purple-400 text-slate-950 font-black border-purple-300';
                else if (isMerged) badgeColor = 'bg-emerald-400 text-slate-950 font-bold border-emerald-300';

                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className={`px-2.5 py-1 rounded-lg border font-mono text-xs transition ${badgeColor}`}>
                      {val}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-1 font-bold">
                      {isPivot ? 'P' : isIPointer ? 'i' : isJPointer ? 'j' : `#${idx}`}
                    </span>
                  </div>
                );
              })}
              <span className="text-slate-500 text-lg font-bold">]</span>
            </div>
          </div>
        ) : (
          /* Vertical Bars Canvas Box with Values Above Every Bar & Pointer Badges Below */
          <div className="bg-slate-950 rounded-2xl p-4 sm:p-6 border-2 border-slate-950 min-h-[380px] flex flex-col justify-end relative shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
            {/* Off-screen Left Indicator for pointer i = -1 */}
            {algo === 'Quick Sort' && currentI < 0 && (
              <div className="absolute top-3 left-3 z-20 bg-purple-400 text-slate-950 text-[11px] font-mono font-black px-2.5 py-1 rounded-lg border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] flex items-center gap-1">
                <span>i = -1</span>
                <span className="text-[9px] text-purple-900 font-extrabold">(Off-screen left)</span>
              </div>
            )}

            {/* Bar Chart Area */}
            <div className="flex items-end justify-center space-x-1.5 h-64 w-full pt-12 pb-8 relative">
              {currentStep.array.map((val, idx) => {
                const heightPercent = Math.max(10, Math.round((val / maxVal) * 100));

                const isPivot = currentStep.pivotIndex === idx;
                const isIPointer = currentI === idx;
                const isJPointer = currentJ === idx;
                const isMerged = currentStep.mergedIndices?.includes(idx);
                const isActive = currentStep.activeIndices?.includes(idx);
                const isSwapped = currentStep.swappedIndices?.includes(idx);

                // Lomuto Region Categorization
                const inSmallerRegion = algo === 'Quick Sort' && idx >= partitionLow && idx <= currentI;
                const inGreaterRegion = algo === 'Quick Sort' && idx > currentI && idx < currentJ && idx !== currentPivotIdx;

                // Distinct, Bright, Un-missable Bar Fill Colors matching prompt requirement
                let barColor = 'bg-slate-700 border border-slate-800';
                if (isPivot) {
                  barColor = 'bg-amber-400 border-2 border-slate-950 ring-4 ring-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.9)]';
                } else if (isSwapped) {
                  barColor = 'bg-rose-500 border-2 border-slate-950 ring-4 ring-rose-400 animate-bounce';
                } else if (isJPointer) {
                  barColor = 'bg-cyan-400 border-2 border-slate-950 ring-4 ring-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]';
                } else if (isIPointer) {
                  barColor = 'bg-purple-500 border-2 border-slate-950 ring-4 ring-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.8)]';
                } else if (isMerged) {
                  barColor = 'bg-emerald-400 border-2 border-slate-950';
                } else if (isActive) {
                  barColor = 'bg-blue-400 border-2 border-slate-950';
                } else if (inSmallerRegion) {
                  barColor = 'bg-purple-900/90 border-t-2 border-purple-400';
                } else if (inGreaterRegion) {
                  barColor = 'bg-slate-800/80 border-t-2 border-slate-500';
                }

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end group relative" style={{ height: '100%' }}>
                    {/* Exact Value Label Always Visible ABOVE the Bar matching image-2.png */}
                    <div className="absolute -top-7 flex flex-col items-center z-20 pointer-events-none font-mono">
                      <span className={`text-[11px] font-black tracking-tight ${
                        isPivot ? 'text-amber-400 font-extrabold scale-110' : isJPointer ? 'text-cyan-300 font-extrabold' : isIPointer ? 'text-purple-300 font-extrabold' : 'text-slate-300'
                      }`}>
                        {val}
                      </span>
                    </div>

                    {/* Main Bar Element */}
                    <div className={`w-full rounded-t-md ${barColor} transition-all duration-100 relative flex items-end justify-center`} style={{ height: `${heightPercent}%` }}>
                      {/* Hover Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 transition absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-950 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-950 shadow z-30 whitespace-nowrap pointer-events-none">
                        idx {idx}: {val} {colMeta?.unit || ''}
                      </div>
                    </div>

                    {/* Pointer Arrow & Badges BELOW the bar matching image-2.png */}
                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold flex flex-col items-center">
                      {isPivot ? (
                        <div className="flex flex-col items-center">
                          <span className="text-amber-400 leading-none text-[8px]">▲</span>
                          <span className="bg-amber-400 text-slate-950 font-black px-1 rounded border border-slate-950 text-[9px]">pivot</span>
                        </div>
                      ) : isIPointer ? (
                        <div className="flex flex-col items-center">
                          <span className="text-purple-400 leading-none text-[8px]">▲</span>
                          <span className="bg-purple-400 text-slate-950 font-black px-1 rounded border border-slate-950 text-[9px]">i</span>
                        </div>
                      ) : isJPointer ? (
                        <div className="flex flex-col items-center">
                          <span className="text-cyan-300 leading-none text-[8px]">▲</span>
                          <span className="bg-cyan-300 text-slate-950 font-black px-1 rounded border border-slate-950 text-[9px]">j</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[9px]">{idx}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Color Legend Matching Prompt Requirements */}
            <div className="flex flex-wrap items-center justify-center gap-5 mt-8 pt-4 border-t border-slate-800 text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded bg-slate-700 border border-slate-950 inline-block" />
                <span className="text-slate-300">Unprocessed</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded bg-cyan-400 border border-slate-950 inline-block shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                <span className="text-cyan-300 font-bold">Scanner j</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded bg-purple-500 border border-slate-950 inline-block shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                <span className="text-purple-300 font-bold">Boundary i</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded bg-amber-400 border border-slate-950 inline-block shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                <span className="text-amber-300 font-bold">Pivot P</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded bg-emerald-400 border border-slate-950 inline-block" />
                <span className="text-emerald-300 font-bold">Sorted</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded bg-rose-500 border border-slate-950 inline-block" />
                <span className="text-rose-300 font-bold">Swapping</span>
              </div>
            </div>
          </div>
        )}

        {/* Note Banner */}
        <div className="bg-white border-2 border-slate-950 rounded-xl p-3 text-xs text-slate-950 flex items-center gap-2 font-medium shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          <Info className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Visualization runs on a sample slice ({sampleSize} items) extracted directly from the active dataset's <strong>{selectedColumn}</strong> column ({dataset.domainLabel}); benchmark executes on the full dataset.</span>
        </div>
      </div>

      {/* Navigation Workflow Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>PREVIOUS</span>
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        >
          <span>NEXT: EXECUTE & RESULTS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
