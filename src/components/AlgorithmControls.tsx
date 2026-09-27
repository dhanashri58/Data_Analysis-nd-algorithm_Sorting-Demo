import type { PivotStrategy, InputPattern } from '../types/sorting';
import { Play, Zap, GitCompare, ShieldCheck, Loader2, Sparkles, ArrowRight } from 'lucide-react';

interface AlgorithmControlsProps {
  onRunQuickSort: () => void;
  onRunMergeSort: () => void;
  onRunBoth: () => void;
  isRunning: boolean;
  progressMessage: string;
  progressPercent: number;
  pivotStrategy: PivotStrategy;
  inputPattern: InputPattern;
  itemCount: number;
  selectedColumn: string;
  onSelectPresetScenario?: (scenario: '100k_random' | '500k_large' | 'worst_case') => void;
}

export const AlgorithmControls = ({
  onRunQuickSort,
  onRunMergeSort,
  onRunBoth,
  isRunning,
  progressMessage,
  progressPercent,
  pivotStrategy,
  inputPattern,
  itemCount,
  selectedColumn,
  onSelectPresetScenario,
}: AlgorithmControlsProps) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/15 text-amber-600 rounded-lg">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              BENCHMARK EXECUTION CONTROLS
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Executes pure custom recursive algorithms on <strong className="text-slate-800 font-mono">{itemCount.toLocaleString()}</strong> rows (<span className="text-blue-600 font-semibold">{selectedColumn}</span> feature)
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] bg-slate-100 px-3 py-1.5 rounded-full text-slate-700 font-mono font-medium self-start sm:self-auto border border-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Manual Algorithms (No Array.sort())</span>
        </div>
      </div>

      {/* Quick Demo Scenarios Shortcuts */}
      {onSelectPresetScenario && (
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Demo Presets</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">1-Click Test Scenarios</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => onSelectPresetScenario('100k_random')}
              className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/50 text-slate-800 text-left font-semibold transition cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="block font-bold text-slate-900 text-xs">100K Random Records</span>
                <span className="text-[10px] text-slate-500 font-normal">Standard ML Score Feature</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-blue-500 shrink-0 ml-1" />
            </button>

            <button
              onClick={() => onSelectPresetScenario('500k_large')}
              className="p-2.5 rounded-lg border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/50 text-slate-800 text-left font-semibold transition cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="block font-bold text-slate-900 text-xs">500K Large Scale</span>
                <span className="text-[10px] text-slate-500 font-normal">High Volume Dataset</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-1" />
            </button>

            <button
              onClick={() => onSelectPresetScenario('worst_case')}
              className="p-2.5 rounded-lg border border-slate-200 hover:border-red-400 bg-white hover:bg-red-50/50 text-slate-800 text-left font-semibold transition cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="block font-bold text-red-700 text-xs">Worst-Case Quick Sort</span>
                <span className="text-[10px] text-red-600 font-normal">Reverse Input + Last Pivot</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-red-500 shrink-0 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Main Execution Buttons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Main Compare Both Button */}
        <button
          onClick={onRunBoth}
          disabled={isRunning}
          className="md:col-span-6 group relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 hover:from-slate-800 hover:to-blue-900 disabled:bg-slate-400 text-white p-5 rounded-2xl shadow-lg border border-blue-500/30 transition-all duration-150 transform active:scale-[0.99] text-left disabled:cursor-not-allowed cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <GitCompare className="w-4 h-4" />
              Side-By-Side Comparison
            </span>
            <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-sm">
              PRIMARY DEMO
            </span>
          </div>

          <div className="my-2">
            <div className="text-xl font-black text-white tracking-wide">COMPARE QUICK VS MERGE</div>
            <p className="text-xs text-slate-300 mt-1">
              Executes both algorithms simultaneously & validates output non-decreasing order.
            </p>
          </div>

          <div className="text-[11px] text-blue-300 font-mono flex items-center gap-2 pt-2 border-t border-slate-800">
            <span>Pattern: <strong className="text-white uppercase">{inputPattern}</strong></span>
            <span>•</span>
            <span>Pivot: <strong className="text-white uppercase">{pivotStrategy}</strong></span>
          </div>
        </button>

        {/* Quick Sort Button */}
        <button
          onClick={onRunQuickSort}
          disabled={isRunning}
          className="md:col-span-3 group relative overflow-hidden bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white p-4 rounded-2xl shadow-md transition-all duration-150 transform active:scale-[0.99] text-left disabled:cursor-not-allowed cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider">Partition</span>
            <Play className="w-4 h-4 text-blue-200 group-hover:translate-x-0.5 transition fill-current" />
          </div>
          <div className="text-base font-bold text-white mt-1">RUN QUICK SORT</div>
          <div className="text-[10px] text-blue-100 font-mono mt-1">
            Pivot: {pivotStrategy.toUpperCase()}
          </div>
        </button>

        {/* Merge Sort Button */}
        <button
          onClick={onRunMergeSort}
          disabled={isRunning}
          className="md:col-span-3 group relative overflow-hidden bg-orange-600 hover:bg-orange-700 disabled:bg-slate-400 text-white p-4 rounded-2xl shadow-md transition-all duration-150 transform active:scale-[0.99] text-left disabled:cursor-not-allowed cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-orange-200 uppercase tracking-wider">Divide & Merge</span>
            <Play className="w-4 h-4 text-orange-200 group-hover:translate-x-0.5 transition fill-current" />
          </div>
          <div className="text-base font-bold text-white mt-1">RUN MERGE SORT</div>
          <div className="text-[10px] text-orange-100 font-mono mt-1">
            O(N log N) Guaranteed
          </div>
        </button>
      </div>

      {/* Progress Overlay */}
      {isRunning && (
        <div className="bg-slate-900 text-white p-4 rounded-xl border border-blue-500/40 shadow-inner space-y-2 animate-pulse-subtle">
          <div className="flex items-center justify-between text-xs font-medium">
            <div className="flex items-center space-x-2 text-blue-300">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span className="font-semibold text-white">{progressMessage || 'Running benchmark on Web Worker...'}</span>
            </div>
            <span className="font-mono text-amber-400 font-bold">{progressPercent}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-blue-500 via-amber-500 to-orange-500 h-2 rounded-full transition-all duration-200"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
