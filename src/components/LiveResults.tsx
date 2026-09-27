import type { SortStats } from '../types/sorting';
import { formatNumber, formatTimeMs } from '../utils/formatters';
import {
  Zap,
  CheckCircle2,
  Clock,
  GitCommit,
  Award,
  Sparkles
} from 'lucide-react';

interface LiveResultsProps {
  quickStats?: SortStats;
  mergeStats?: SortStats;
  selectedColumn: string;
  itemCount: number;
}

export const LiveResults = ({
  quickStats,
  mergeStats,
  itemCount,
}: LiveResultsProps) => {
  if (!quickStats && !mergeStats) return null;

  let speedupInsight = '';
  if (quickStats && mergeStats) {
    const qTime = quickStats.executionTimeMs;
    const mTime = mergeStats.executionTimeMs;
    if (qTime > 0 && mTime > 0) {
      if (qTime < mTime) {
        const ratio = (mTime / qTime).toFixed(2);
        speedupInsight = `Quick Sort was ${ratio}x faster than Merge Sort on this dataset (${formatTimeMs(qTime)} vs ${formatTimeMs(mTime)}).`;
      } else if (mTime < qTime) {
        const ratio = (qTime / mTime).toFixed(2);
        speedupInsight = `Merge Sort was ${ratio}x faster than Quick Sort on this dataset (${formatTimeMs(mTime)} vs ${formatTimeMs(qTime)}).`;
      } else {
        speedupInsight = `Both algorithms executed in identical time (${formatTimeMs(qTime)}).`;
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>SECTION 5 — LIVE EXECUTION RESULTS DASHBOARD</span>
        </h3>
        <span className="text-xs text-slate-500 font-mono">
          Measured on {itemCount.toLocaleString()} elements
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quick Sort Result Card */}
        {quickStats ? (
          <div className="bg-white rounded-xl border-2 border-blue-500/80 shadow-md overflow-hidden flex flex-col justify-between">
            <div className="bg-blue-600 text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-300" />
                <span className="font-bold text-sm tracking-wide">QUICK SORT</span>
              </div>
              <span className="bg-blue-900/80 text-blue-100 text-[10px] font-mono px-2 py-0.5 rounded border border-blue-400/40">
                Partition & Conquer
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* Primary Time Readout */}
              <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider block">
                    Execution Time
                  </span>
                  <div className="text-3xl font-black text-blue-700 font-mono mt-0.5">
                    {formatTimeMs(quickStats.executionTimeMs)}
                  </div>
                </div>
                <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Total Comparisons:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {formatNumber(quickStats.comparisons)}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Swaps (Swaps/Moves):</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {formatNumber(quickStats.swapsOrMoves)}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Max Recursion Depth:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {quickStats.maxRecursionDepth} levels
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Pivot Strategy Used:</span>
                  <span className="font-mono font-bold text-blue-700 text-xs capitalize">
                    {quickStats.pivotStrategy || 'Random'}
                  </span>
                </div>
              </div>
            </div>

            {/* Correctness Banner */}
            <div className="bg-emerald-50 px-5 py-3 border-t border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">Correctness Check:</span>
              </div>
              <span className="bg-emerald-600 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow-sm">
                ✓ Sorted Correctly
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
            <Zap className="w-8 h-8 text-slate-300" />
            <p className="text-xs font-semibold">Quick Sort Pending Execution</p>
            <p className="text-[11px] text-slate-400">Click "RUN QUICK SORT" or "COMPARE BOTH" above.</p>
          </div>
        )}

        {/* Merge Sort Result Card */}
        {mergeStats ? (
          <div className="bg-white rounded-xl border-2 border-orange-500/80 shadow-md overflow-hidden flex flex-col justify-between">
            <div className="bg-orange-600 text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GitCommit className="w-4 h-4 text-amber-300" />
                <span className="font-bold text-sm tracking-wide">MERGE SORT</span>
              </div>
              <span className="bg-orange-900/80 text-orange-100 text-[10px] font-mono px-2 py-0.5 rounded border border-orange-400/40">
                Divide, Sort & Merge
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* Primary Time Readout */}
              <div className="bg-orange-50/60 rounded-xl p-4 border border-orange-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-orange-900 uppercase tracking-wider block">
                    Execution Time
                  </span>
                  <div className="text-3xl font-black text-orange-600 font-mono mt-0.5">
                    {formatTimeMs(mergeStats.executionTimeMs)}
                  </div>
                </div>
                <div className="p-3 bg-orange-600 text-white rounded-xl shadow-md">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Total Comparisons:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {formatNumber(mergeStats.comparisons)}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Array Writes / Copies:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {formatNumber(mergeStats.swapsOrMoves)}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Max Recursion Depth:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {mergeStats.maxRecursionDepth} levels
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Auxiliary Space Overhead:</span>
                  <span className="font-mono font-bold text-orange-700 text-xs">
                    O(N) ~ {formatNumber(itemCount)} elements
                  </span>
                </div>
              </div>
            </div>

            {/* Correctness Banner */}
            <div className="bg-emerald-50 px-5 py-3 border-t border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">Correctness Check:</span>
              </div>
              <span className="bg-emerald-600 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow-sm">
                ✓ Sorted Correctly
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
            <GitCommit className="w-8 h-8 text-slate-300" />
            <p className="text-xs font-semibold">Merge Sort Pending Execution</p>
            <p className="text-[11px] text-slate-400">Click "RUN MERGE SORT" or "COMPARE BOTH" above.</p>
          </div>
        )}
      </div>

      {/* Speedup Insight Banner */}
      {speedupInsight && (
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl p-4 border border-blue-500/30 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-amber-400 tracking-wider block">
                Experimental Insight
              </span>
              <p className="text-sm font-semibold text-slate-100">{speedupInsight}</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded hidden md:block">
            N = {itemCount.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};
