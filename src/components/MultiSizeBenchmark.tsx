import { useState } from 'react';
import type { SizeBenchmarkResult, DatasetInfo, PivotStrategy, InputPattern } from '../types/sorting';
import { executeBenchmarkAsync } from '../workers/sortWorkerManager';
import { extractAndTransformColumn } from '../algorithms/generator';
import { formatNumber, formatTimeMs } from '../utils/formatters';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  Play,
  Download,
  Loader2,
  Table
} from 'lucide-react';

interface MultiSizeBenchmarkProps {
  dataset: DatasetInfo;
  selectedColumn: string;
  pivotStrategy: PivotStrategy;
  inputPattern: InputPattern;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const MultiSizeBenchmark = ({
  dataset,
  selectedColumn,
  pivotStrategy,
  inputPattern,
  onToast,
}: MultiSizeBenchmarkProps) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [results, setResults] = useState<SizeBenchmarkResult[]>([]);
  const [use1M, setUse1M] = useState<boolean>(false);

  const handleRunScalingTest = async () => {
    setIsRunning(true);
    setProgressPercent(5);
    setProgressMsg('Preparing dataset scaling array...');

    const sizesToTest = use1M
      ? [1000, 10000, 50000, 100000, 500000, 1000000]
      : [1000, 10000, 50000, 100000, 500000];

    let fullArray = extractAndTransformColumn(dataset.data, selectedColumn, inputPattern);
    const maxSizeNeeded = sizesToTest[sizesToTest.length - 1];

    if (fullArray.length < maxSizeNeeded) {
      const expanded: number[] = [];
      while (expanded.length < maxSizeNeeded) {
        expanded.push(...fullArray);
      }
      fullArray = expanded.slice(0, maxSizeNeeded);
    }

    try {
      const res = await executeBenchmarkAsync({
        type: 'RUN_MULTI_SIZE',
        array: fullArray,
        pivotStrategy,
        inputPattern,
        datasetSizes: sizesToTest,
        onProgress: (msg, pct) => {
          setProgressMsg(msg);
          setProgressPercent(pct);
        },
      });

      if (res.multiSizeResults) {
        setResults(res.multiSizeResults);
        onToast(`Size scaling test complete! Benchmark results generated across ${sizesToTest.length} sizes.`, 'success');
      }
    } catch (err: any) {
      onToast(err?.message || 'Scaling test failed.', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleExportCSV = () => {
    if (results.length === 0) return;
    const headers = 'Dataset Size,Quick Time (ms),Merge Time (ms),Quick Comparisons,Merge Comparisons,Quick Swaps,Merge Moves\n';
    const rows = results
      .map(
        (r) =>
          `${r.formattedSize},${r.quickTime},${r.mergeTime},${r.quickComparisons},${r.mergeComparisons},${r.quickSwaps},${r.mergeMoves}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sorting_Benchmark_Scaling_${selectedColumn}_${inputPattern}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('Exported benchmark CSV file.', 'info');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-600/10 text-blue-600 rounded-xl border border-blue-200">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-wide">
              SECTION 7 — MULTI-SIZE SCALING BENCHMARK (1K to 1M RECORDS)
            </h2>
            <p className="text-xs text-slate-500">
              Measures execution time and total comparisons as input scale increases exponentially
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-2 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={use1M}
              onChange={(e) => setUse1M(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span>Include 1,000,000 (1M) Test</span>
          </label>

          <button
            onClick={handleRunScalingTest}
            disabled={isRunning}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:bg-slate-400 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition active:scale-95 cursor-pointer disabled:cursor-not-allowed"
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isRunning ? 'Benchmarking...' : 'RUN SIZE SCALING TEST'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <div className="bg-slate-900 text-white p-4 rounded-xl border border-blue-500/40 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-blue-300">{progressMsg}</span>
            <span className="font-mono text-amber-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-blue-500 via-amber-500 to-orange-500 h-2 rounded-full transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Benchmark Results */}
      {results.length > 0 ? (
        <div className="space-y-6">
          {/* Scaling Line Chart */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Execution Time Scaling Curve (ms vs Dataset Size)
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">
                Column: {selectedColumn} • Pivot: {pivotStrategy.toUpperCase()}
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="formattedSize" tick={{ fontSize: 12, fill: '#334155' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#334155' }} unit=" ms" />
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
                  <Line
                    type="monotone"
                    dataKey="quickTime"
                    name="Quick Sort Time (ms)"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mergeTime"
                    name="Merge Sort Time (ms)"
                    stroke="#ea580c"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Results Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Table className="w-4 h-4 text-blue-600" />
                <span>Multi-Size Benchmark Data Matrix</span>
              </h4>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition border border-slate-300 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV Data</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-900 text-white uppercase text-[11px] font-mono tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Dataset Size</th>
                    <th className="px-4 py-3 bg-blue-900/60 text-blue-200">Quick Sort Time</th>
                    <th className="px-4 py-3 bg-orange-900/60 text-orange-200">Merge Sort Time</th>
                    <th className="px-4 py-3">Quick Comparisons</th>
                    <th className="px-4 py-3">Merge Comparisons</th>
                    <th className="px-4 py-3 text-slate-300">Fastest Algorithm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {results.map((r) => {
                    const isQuickFaster = r.quickTime <= r.mergeTime;
                    return (
                      <tr key={r.size} className="hover:bg-slate-50 font-mono">
                        <td className="px-4 py-3 font-bold text-slate-900">{r.formattedSize} ({r.size.toLocaleString()})</td>
                        <td className="px-4 py-3 font-bold text-blue-700 bg-blue-50/40">
                          {formatTimeMs(r.quickTime)}
                        </td>
                        <td className="px-4 py-3 font-bold text-orange-600 bg-orange-50/40">
                          {formatTimeMs(r.mergeTime)}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{formatNumber(r.quickComparisons)}</td>
                        <td className="px-4 py-3 text-slate-600">{formatNumber(r.mergeComparisons)}</td>
                        <td className="px-4 py-3 font-sans font-semibold">
                          {isQuickFaster ? (
                            <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-[11px]">
                              ✓ Quick Sort ({((r.mergeTime / r.quickTime) || 1).toFixed(2)}x)
                            </span>
                          ) : (
                            <span className="text-orange-700 bg-orange-100 px-2 py-0.5 rounded text-[11px]">
                              ✓ Merge Sort ({((r.quickTime / r.mergeTime) || 1).toFixed(2)}x)
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500 space-y-2">
          <TrendingUp className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Size Scaling Benchmark Not Yet Executed</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click "RUN SIZE SCALING TEST" above to measure Quick Sort and Merge Sort across 1K, 10K, 50K, 100K, 500K, and 1M records in real-time.
          </p>
        </div>
      )}
    </div>
  );
};
