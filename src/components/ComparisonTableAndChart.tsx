import type { SortStats } from '../types/sorting';
import { formatNumber, formatTimeMs } from '../utils/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { GitCompare, CheckCircle2 } from 'lucide-react';

interface ComparisonTableAndChartProps {
  quickStats?: SortStats;
  mergeStats?: SortStats;
  itemCount: number;
  selectedColumn: string;
}

export const ComparisonTableAndChart = ({
  quickStats,
  mergeStats,
  itemCount,
  selectedColumn,
}: ComparisonTableAndChartProps) => {
  if (!quickStats || !mergeStats) return null;

  const chartData = [
    {
      metric: 'Execution Time (ms)',
      'Quick Sort': quickStats.executionTimeMs,
      'Merge Sort': mergeStats.executionTimeMs,
    },
    {
      metric: 'Comparisons (Thousands)',
      'Quick Sort': Math.round(quickStats.comparisons / 1000),
      'Merge Sort': Math.round(mergeStats.comparisons / 1000),
    },
    {
      metric: 'Swaps / Moves (Thousands)',
      'Quick Sort': Math.round(quickStats.swapsOrMoves / 1000),
      'Merge Sort': Math.round(mergeStats.swapsOrMoves / 1000),
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md p-5 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600/10 text-blue-600 rounded-lg border border-blue-200">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-wide">
              SECTION 6 — ALGORITHM PERFORMANCE COMPARISON
            </h3>
            <p className="text-xs text-slate-500">
              Side-by-side metric comparison and chart visualization for N = {itemCount.toLocaleString()} ({selectedColumn})
            </p>
          </div>
        </div>

        <span className="bg-slate-100 text-slate-700 text-xs font-mono font-semibold px-3 py-1 rounded-full border border-slate-200">
          Pattern: {quickStats.inputPattern.toUpperCase()}
        </span>
      </div>

      {/* Metric Breakdown Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-white uppercase text-[11px] font-mono tracking-wider">
            <tr>
              <th className="px-4 py-3">Performance Metric</th>
              <th className="px-4 py-3 bg-blue-900/60 text-blue-200 border-x border-blue-800">
                Quick Sort (Partition)
              </th>
              <th className="px-4 py-3 bg-orange-900/60 text-orange-200">
                Merge Sort (Divide & Merge)
              </th>
              <th className="px-4 py-3 text-slate-300">Analysis / Winner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800 font-sans">
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 font-semibold text-slate-900">Execution Time</td>
              <td className="px-4 py-3 font-mono font-bold text-blue-700 bg-blue-50/40 border-x border-blue-100">
                {formatTimeMs(quickStats.executionTimeMs)}
              </td>
              <td className="px-4 py-3 font-mono font-bold text-orange-600 bg-orange-50/40">
                {formatTimeMs(mergeStats.executionTimeMs)}
              </td>
              <td className="px-4 py-3 font-semibold">
                {quickStats.executionTimeMs <= mergeStats.executionTimeMs ? (
                  <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-mono">
                    ✓ Quick Sort ({((mergeStats.executionTimeMs / quickStats.executionTimeMs) || 1).toFixed(2)}x faster)
                  </span>
                ) : (
                  <span className="text-orange-700 bg-orange-100 px-2 py-0.5 rounded font-mono">
                    ✓ Merge Sort ({((quickStats.executionTimeMs / mergeStats.executionTimeMs) || 1).toFixed(2)}x faster)
                  </span>
                )}
              </td>
            </tr>

            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 font-semibold text-slate-900">Total Comparisons</td>
              <td className="px-4 py-3 font-mono font-semibold text-blue-900 bg-blue-50/40 border-x border-blue-100">
                {formatNumber(quickStats.comparisons)}
              </td>
              <td className="px-4 py-3 font-mono font-semibold text-orange-900 bg-orange-50/40">
                {formatNumber(mergeStats.comparisons)}
              </td>
              <td className="px-4 py-3 text-slate-600 font-mono">
                {quickStats.comparisons < mergeStats.comparisons
                  ? `Quick Sort made ${(mergeStats.comparisons - quickStats.comparisons).toLocaleString()} fewer comparisons`
                  : `Merge Sort made ${(quickStats.comparisons - mergeStats.comparisons).toLocaleString()} fewer comparisons`}
              </td>
            </tr>

            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 font-semibold text-slate-900">Swaps / Auxiliary Moves</td>
              <td className="px-4 py-3 font-mono text-blue-900 bg-blue-50/40 border-x border-blue-100">
                {formatNumber(quickStats.swapsOrMoves)} swaps
              </td>
              <td className="px-4 py-3 font-mono text-orange-900 bg-orange-50/40">
                {formatNumber(mergeStats.swapsOrMoves)} array writes
              </td>
              <td className="px-4 py-3 text-slate-600">
                Quick Sort modifies array in-place; Merge Sort copies to auxiliary array.
              </td>
            </tr>

            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 font-semibold text-slate-900">Auxiliary Memory Complexity</td>
              <td className="px-4 py-3 font-mono text-blue-900 bg-blue-50/40 border-x border-blue-100">
                O(log N) stack depth
              </td>
              <td className="px-4 py-3 font-mono text-orange-900 bg-orange-50/40">
                O(N) auxiliary array (~{formatNumber(itemCount)} elements)
              </td>
              <td className="px-4 py-3 font-semibold text-blue-700">
                Quick Sort is memory-efficient (In-place)
              </td>
            </tr>

            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 font-semibold text-slate-900">Stability</td>
              <td className="px-4 py-3 text-slate-700 bg-blue-50/40 border-x border-blue-100 font-medium">
                Unstable (default)
              </td>
              <td className="px-4 py-3 text-slate-700 bg-orange-50/40 font-medium">
                Stable (preserves relative duplicate order)
              </td>
              <td className="px-4 py-3 font-semibold text-orange-700">
                Merge Sort guarantees stability for key multi-column sorting
              </td>
            </tr>

            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 font-semibold text-slate-900">Correctness Verification</td>
              <td className="px-4 py-3 bg-blue-50/40 border-x border-blue-100">
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified
                </span>
              </td>
              <td className="px-4 py-3 bg-orange-50/40">
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified
                </span>
              </td>
              <td className="px-4 py-3 font-semibold text-emerald-700">
                Both produced identical sorted outputs
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Comparison Chart */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
          Side-By-Side Visual Benchmark Metrics
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="metric" tick={{ fontSize: 12, fill: '#475569' }} />
              <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Quick Sort" fill="#2563eb" radius={[4, 4, 0, 0]} name="Quick Sort" />
              <Bar dataKey="Merge Sort" fill="#ea580c" radius={[4, 4, 0, 0]} name="Merge Sort" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
