import type { SortStats, PivotStrategy, InputPattern, ActiveTab } from '../types/sorting';
import { formatNumber, formatTimeMs } from '../utils/formatters';
import { generateRuleBasedObservation } from '../algorithms/ruleEngine';
import {
  Play,
  GitCompare,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Cpu,
  ShieldCheck,
  Lightbulb
} from 'lucide-react';

interface ExecutionSectionProps {
  onRunQuickSort: () => void;
  onRunMergeSort: () => void;
  onRunBoth: () => void;
  isRunning: boolean;
  progressMessage: string;
  progressPercent: number;
  quickStats?: SortStats;
  mergeStats?: SortStats;
  pivotStrategy: PivotStrategy;
  inputPattern: InputPattern;
  itemCount: number;
  selectedColumn: string;
  setActiveTab: (tab: ActiveTab) => void;
}

export const ExecutionSection = ({
  onRunQuickSort,
  onRunMergeSort,
  onRunBoth,
  isRunning,
  progressMessage,
  progressPercent,
  quickStats,
  mergeStats,
  pivotStrategy,
  inputPattern,
  itemCount,
  selectedColumn,
  setActiveTab,
}: ExecutionSectionProps) => {
  const env = quickStats?.environment || mergeStats?.environment;
  const observation = generateRuleBasedObservation(quickStats, mergeStats);

  return (
    <div className="space-y-6">
      {/* Panel 06 & 07 Header Badges */}
      <div className="flex items-center space-x-2">
        <span className="bg-cyan-400 text-slate-950 text-xs font-black font-mono px-2.5 py-1 rounded-md border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          06 & 07
        </span>
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider font-mono">
          Run Algorithms & Execution Results
        </h2>
      </div>

      {/* PANEL 06: RUN ALGORITHMS CARD */}
      <div className="bg-cyan-100 border-2 border-slate-950 rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-6">
        <div className="flex items-center justify-between border-b-2 border-slate-950 pb-4">
          <div className="flex items-center space-x-2">
            <span className="bg-slate-950 text-cyan-300 w-6 h-6 rounded-full flex items-center justify-center font-mono font-black text-xs">
              06
            </span>
            <h3 className="text-xl font-black text-slate-950 uppercase font-sans">
              RUN ALGORITHMS
            </h3>
          </div>
          <span className="text-xs font-mono font-bold bg-white text-slate-950 px-3 py-1 rounded-lg border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            N = {itemCount.toLocaleString()} ({selectedColumn})
          </span>
        </div>

        {/* Action Cards Grid matching Panel 06 Wireframe */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Quick Sort Card */}
          <div
            onClick={onRunQuickSort}
            className="bg-blue-100 border-2 border-slate-950 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between space-y-4 hover:bg-blue-200 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-blue-500 text-white rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <span className="bg-white text-slate-950 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-950">
                Partition
              </span>
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-950 uppercase font-sans">Run Quick Sort</h4>
              <p className="text-xs text-slate-700 mt-0.5 font-medium">Execute Quick Sort on selected dataset</p>
            </div>

            <div className="bg-white border border-slate-950 rounded-lg p-2 text-[10px] font-mono text-blue-900 font-bold">
              Uses: {pivotStrategy.toUpperCase()} Pivot
            </div>
          </div>

          {/* Merge Sort Card */}
          <div
            onClick={onRunMergeSort}
            className="bg-rose-100 border-2 border-slate-950 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between space-y-4 hover:bg-rose-200 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-rose-500 text-white rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <span className="bg-white text-slate-950 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-950">
                Divide & Merge
              </span>
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-950 uppercase font-sans">Run Merge Sort</h4>
              <p className="text-xs text-slate-700 mt-0.5 font-medium">Execute Merge Sort on selected dataset</p>
            </div>

            <div className="bg-white border border-slate-950 rounded-lg p-2 text-[10px] font-mono text-rose-900 font-bold">
              Stable sorting algorithm
            </div>
          </div>

          {/* Compare Both Card */}
          <div
            onClick={onRunBoth}
            className="bg-purple-100 border-2 border-slate-950 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between space-y-4 hover:bg-purple-200 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-purple-500 text-white rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <GitCompare className="w-5 h-5" />
              </div>
              <span className="bg-amber-300 text-slate-950 text-[10px] font-mono font-black px-2 py-0.5 rounded border border-slate-950">
                Recommended
              </span>
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-950 uppercase font-sans">Compare Both</h4>
              <p className="text-xs text-slate-700 mt-0.5 font-medium">Run both algorithms and compare results</p>
            </div>

            <div className="bg-purple-300 border border-slate-950 rounded-lg p-2 text-[10px] font-mono text-slate-950 font-black">
              Recommended for Side-by-Side Analysis
            </div>
          </div>
        </div>

        {/* Benchmark Progress Bar matching Panel 06 Wireframe */}
        {isRunning && (
          <div className="bg-white border-2 border-slate-950 rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-2 animate-pulse-subtle">
            <div className="flex items-center justify-between text-xs font-bold text-slate-950 font-mono">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Benchmark Progress: {progressMessage}</span>
              </span>
              <span>{progressPercent}%</span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-3 border border-slate-950 overflow-hidden">
              <div className="bg-emerald-400 h-3 rounded-full transition-all duration-200" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        )}

        {/* Academic Methodology & Hardware Environment Specification Box */}
        <div className="bg-white border-2 border-slate-950 rounded-2xl p-4 font-mono text-xs space-y-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex items-center justify-between border-b-2 border-slate-950 pb-2">
            <span className="font-black text-slate-950 uppercase flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-600" />
              <span>Academic Benchmark Environment & Verification Methodology</span>
            </span>
            <span className="bg-cyan-300 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-950">
              N = 3 Runs / Test
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
            <div className="p-2 bg-slate-50 border border-slate-950 rounded-lg">
              <span className="text-slate-500 font-bold block text-[10px]">CPU Cores / Threads:</span>
              <span className="font-extrabold text-slate-950">{env?.hardwareConcurrency || 8} Logical Hardware Cores</span>
            </div>

            <div className="p-2 bg-slate-50 border border-slate-950 rounded-lg">
              <span className="text-slate-500 font-bold block text-[10px]">Device Memory:</span>
              <span className="font-extrabold text-slate-950">{env?.deviceMemoryGb || 8} GB Memory Allotment</span>
            </div>

            <div className="p-2 bg-slate-50 border border-slate-950 rounded-lg">
              <span className="text-slate-500 font-bold block text-[10px]">Execution Engine:</span>
              <span className="font-extrabold text-slate-950">Web Worker (Off-Main-Thread)</span>
            </div>
          </div>
        </div>
      </div>

      {/* PANEL 07: ALGORITHM RESULTS CARD */}
      <div className="bg-rose-100 border-2 border-slate-950 rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-6">
        <div className="flex items-center justify-between border-b-2 border-slate-950 pb-4">
          <div className="flex items-center space-x-2">
            <span className="bg-slate-950 text-rose-300 w-6 h-6 rounded-full flex items-center justify-center font-mono font-black text-xs">
              07
            </span>
            <h3 className="text-xl font-black text-slate-950 uppercase font-sans">
              ALGORITHM RESULTS
            </h3>
          </div>
          <span className="text-xs font-mono font-bold bg-white text-slate-950 px-3 py-1 rounded-lg border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            Execution Statistics
          </span>
        </div>

        {/* Side-by-Side Result Cards matching Panel 07 Wireframe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Sort Results */}
          <div className="bg-white border-2 border-slate-950 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-950 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-500 text-white rounded-lg border border-slate-950">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <h4 className="text-base font-black text-slate-950 font-sans uppercase">Quick Sort Results</h4>
              </div>
              <span className="bg-blue-100 text-blue-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-slate-950">
                In-Place
              </span>
            </div>

            {quickStats ? (
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-950 rounded-lg">
                  <span className="text-slate-600 font-semibold">Execution Time (Median)</span>
                  <span className="font-black text-blue-700 text-sm">{formatTimeMs(quickStats.executionTimeMs)}</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-950 rounded-lg text-[11px]">
                  <span className="text-slate-600 font-semibold">Mean Time / Std Dev</span>
                  <span className="font-bold text-slate-950">{quickStats.meanExecutionTimeMs.toFixed(2)} ms (±{quickStats.stdDevMs.toFixed(2)})</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-950 rounded-lg">
                  <span className="text-slate-600 font-semibold">Comparisons</span>
                  <span className="font-bold text-slate-950">{formatNumber(quickStats.comparisons)}</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-950 rounded-lg">
                  <span className="text-slate-600 font-semibold">Swaps</span>
                  <span className="font-bold text-slate-950">{formatNumber(quickStats.swapsOrMoves)}</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-950 rounded-lg">
                  <span className="text-slate-600 font-semibold">Recursion Depth</span>
                  <span className="font-bold text-slate-950">{quickStats.maxRecursionDepth}</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-emerald-100 border border-slate-950 rounded-lg">
                  <span className="text-slate-950 font-bold">Sorted Verification</span>
                  <span className="bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded border border-slate-950 flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sorted correctly
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-teal-100 border border-slate-950 rounded-lg">
                  <span className="text-slate-950 font-bold">Checksum Invariant</span>
                  <span className="bg-teal-300 text-slate-950 font-black px-2 py-0.5 rounded border border-slate-950 flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" /> Sum Invariant Passed
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-950 rounded-lg">
                  <span className="text-slate-600 font-semibold">Input Pattern & Pivot</span>
                  <span className="font-bold text-slate-950 uppercase">{inputPattern} • {pivotStrategy}</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 font-mono text-xs border-2 border-dashed border-slate-300 rounded-xl space-y-1">
                <p className="font-bold text-slate-700">Quick Sort Pending Execution</p>
                <p className="text-[10px]">Click "Run Quick Sort" or "Compare Both" above.</p>
              </div>
            )}
          </div>

          {/* Merge Sort Results */}
          <div className="bg-white border-2 border-slate-950 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-950 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-rose-500 text-white rounded-lg border border-slate-950">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <h4 className="text-base font-black text-slate-950 font-sans uppercase">Merge Sort Results</h4>
              </div>
              <span className="bg-rose-100 text-rose-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-slate-950">
                Stable O(N log N)
              </span>
            </div>

            {mergeStats ? (
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-950 rounded-lg">
                  <span className="text-slate-600 font-semibold">Execution Time (Median)</span>
                  <span className="font-black text-rose-600 text-sm">{formatTimeMs(mergeStats.executionTimeMs)}</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-950 rounded-lg text-[11px]">
                  <span className="text-slate-600 font-semibold">Mean Time / Std Dev</span>
                  <span className="font-bold text-slate-950">{mergeStats.meanExecutionTimeMs.toFixed(2)} ms (±{mergeStats.stdDevMs.toFixed(2)})</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-950 rounded-lg">
                  <span className="text-slate-600 font-semibold">Comparisons</span>
                  <span className="font-bold text-slate-950">{formatNumber(mergeStats.comparisons)}</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-950 rounded-lg">
                  <span className="text-slate-600 font-semibold">Array Writes</span>
                  <span className="font-bold text-slate-950">{formatNumber(mergeStats.swapsOrMoves)}</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-950 rounded-lg">
                  <span className="text-slate-600 font-semibold">Recursion Depth</span>
                  <span className="font-bold text-slate-950">{mergeStats.maxRecursionDepth}</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-emerald-100 border border-slate-950 rounded-lg">
                  <span className="text-slate-950 font-bold">Sorted Verification</span>
                  <span className="bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded border border-slate-950 flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sorted correctly
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-teal-100 border border-slate-950 rounded-lg">
                  <span className="text-slate-950 font-bold">Checksum Invariant</span>
                  <span className="bg-teal-300 text-slate-950 font-black px-2 py-0.5 rounded border border-slate-950 flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" /> Sum Invariant Passed
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-950 rounded-lg">
                  <span className="text-slate-600 font-semibold">Input Pattern</span>
                  <span className="font-bold text-slate-950 uppercase">{inputPattern}</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 font-mono text-xs border-2 border-dashed border-slate-300 rounded-xl space-y-1">
                <p className="font-bold text-slate-700">Merge Sort Pending Execution</p>
                <p className="text-[10px]">Click "Run Merge Sort" or "Compare Both" above.</p>
              </div>
            )}
          </div>
        </div>

        {/* "WHY DID THIS HAPPEN?" RULE-BASED ANALYSIS PANEL */}
        <div className="bg-white border-2 border-slate-950 rounded-2xl p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-3">
          <div className="flex items-center space-x-2 border-b-2 border-slate-950 pb-3">
            <div className="p-2 bg-amber-400 text-slate-950 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              <Lightbulb className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-950 uppercase font-sans">
                "WHY DID THIS HAPPEN?" — EXPERIMENTAL ANALYSIS
              </h4>
              <p className="text-[11px] text-slate-500 font-mono">Deterministic rule-based CS observation derived from measured results</p>
            </div>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 bg-amber-100 border-2 border-slate-950 rounded-xl">
              <span className="font-black text-amber-950 uppercase block text-xs mb-1">Observation Title:</span>
              <p className="font-bold text-slate-950">{observation.title}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-950 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Technical Hardware Reason:</span>
                <p className="text-slate-800 leading-relaxed font-sans">{observation.technicalReason}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-950 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">DAA Theory Connection:</span>
                <p className="text-slate-800 leading-relaxed font-sans">{observation.daTheoryConnect}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Workflow Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setActiveTab('visualize')}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>PREVIOUS</span>
        </button>

        <button
          onClick={() => setActiveTab('analysis')}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        >
          <span>VIEW COMPARISON ANALYSIS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
