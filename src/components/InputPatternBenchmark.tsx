import { useState } from 'react';
import type { PatternBenchmarkResult, DatasetInfo, PivotStrategy, InputPattern } from '../types/sorting';
import { executeBenchmarkAsync } from '../workers/sortWorkerManager';
import { extractAndTransformColumn } from '../algorithms/generator';
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
import { Sliders, Play, Loader2, Target } from 'lucide-react';

interface InputPatternBenchmarkProps {
  dataset: DatasetInfo;
  selectedColumn: string;
  pivotStrategy: PivotStrategy;
  setPivotStrategy: (pivot: PivotStrategy) => void;
  datasetSize: number;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const InputPatternBenchmark = ({
  dataset,
  selectedColumn,
  pivotStrategy,
  setPivotStrategy,
  datasetSize,
  onToast,
}: InputPatternBenchmarkProps) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [, setProgressMsg] = useState<string>('');
  const [results, setResults] = useState<PatternBenchmarkResult[]>([]);

  const handleRunPatternBenchmark = async () => {
    setIsRunning(true);
    setProgressMsg('Benchmarking input patterns (Random, Sorted, Reverse Sorted)...');

    const testSize = pivotStrategy === 'last' ? Math.min(datasetSize, 20000) : datasetSize;

    const patterns: InputPattern[] = ['random', 'sorted', 'reverse'];
    const patternResults: PatternBenchmarkResult[] = [];

    try {
      for (let i = 0; i < patterns.length; i++) {
        const pat = patterns[i];
        setProgressMsg(`Testing input pattern: ${pat.toUpperCase()} (${i + 1}/3)...`);

        const transformedArray = extractAndTransformColumn(dataset.data, selectedColumn, pat);
        const testArr = transformedArray.length >= testSize ? transformedArray.slice(0, testSize) : transformedArray;

        const res = await executeBenchmarkAsync({
          type: 'RUN_COMPARISON',
          array: testArr,
          pivotStrategy,
          inputPattern: pat,
        });

        if (res.quickStats && res.mergeStats) {
          patternResults.push({
            pattern: pat,
            patternLabel: pat === 'random' ? 'Random' : pat === 'sorted' ? 'Sorted' : 'Reverse Sorted',
            quickTime: res.quickStats.executionTimeMs,
            mergeTime: res.mergeStats.executionTimeMs,
            quickComparisons: res.quickStats.comparisons,
            mergeComparisons: res.mergeStats.comparisons,
          });
        }
      }

      setResults(patternResults);
      onToast(`Input pattern analysis complete for ${testSize.toLocaleString()} records!`, 'success');
    } catch (err: any) {
      onToast(err?.message || 'Input pattern test failed.', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-600/10 text-amber-600 rounded-xl border border-amber-200">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-wide">
              SECTION 8 — INPUT CHARACTERISTICS & PIVOT STRATEGY TEST
            </h2>
            <p className="text-xs text-slate-500">
              Analyze how pre-sorted or reverse-sorted input arrangements affect Quick Sort vs Merge Sort
            </p>
          </div>
        </div>

        <button
          onClick={handleRunPatternBenchmark}
          disabled={isRunning}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition active:scale-95 cursor-pointer disabled:cursor-not-allowed"
        >
          {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current text-amber-400" />}
          <span>{isRunning ? 'Analyzing Patterns...' : 'COMPARE INPUT PATTERNS'}</span>
        </button>
      </div>

      {/* Pivot Strategy Switcher Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-blue-600" />
            <span>Select Quick Sort Pivot Strategy for Pattern Test:</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Active: <strong className="text-blue-700">{pivotStrategy.toUpperCase()}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setPivotStrategy('random')}
            className={`p-3 rounded-lg border text-left transition cursor-pointer ${
              pivotStrategy === 'random'
                ? 'bg-blue-600 text-white border-blue-600 shadow'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="font-bold text-xs">Randomized Pivot (Default)</div>
            <p className={`text-[11px] mt-0.5 ${pivotStrategy === 'random' ? 'text-blue-100' : 'text-slate-500'}`}>
              Picks random pivot. Prevents O(n²) worst-case on pre-sorted input.
            </p>
          </button>

          <button
            onClick={() => setPivotStrategy('median3')}
            className={`p-3 rounded-lg border text-left transition cursor-pointer ${
              pivotStrategy === 'median3'
                ? 'bg-blue-600 text-white border-blue-600 shadow'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="font-bold text-xs">Median-of-Three</div>
            <p className={`text-[11px] mt-0.5 ${pivotStrategy === 'median3' ? 'text-blue-100' : 'text-slate-500'}`}>
              Picks median of low, mid, high. Great practical performance.
            </p>
          </button>

          <button
            onClick={() => setPivotStrategy('last')}
            className={`p-3 rounded-lg border text-left transition cursor-pointer ${
              pivotStrategy === 'last'
                ? 'bg-red-600 text-white border-red-600 shadow'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="font-bold text-xs flex items-center justify-between">
              <span>Last Element Pivot</span>
              <span className="bg-red-900/60 text-white text-[10px] px-1.5 py-0.2 rounded font-mono">
                O(n²)
              </span>
            </div>
            <p className={`text-[11px] mt-0.5 ${pivotStrategy === 'last' ? 'text-red-100' : 'text-slate-500'}`}>
              Picks last element. Triggers extreme worst-case on sorted data!
            </p>
          </button>
        </div>
      </div>

      {/* Cause & Effect Flow Visual */}
      <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-2">
        <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
          Theoretical Mechanism: How Input Pattern Drives Performance
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[10px]">1. Input Pattern</span>
            <span className="font-bold text-white">Random / Sorted / Reverse</span>
          </div>
          <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[10px]">2. Pivot Behavior</span>
            <span className="font-bold text-blue-300">Balanced vs Unbalanced Split</span>
          </div>
          <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[10px]">3. Comparisons</span>
            <span className="font-bold text-amber-300">O(n log n) vs O(n²)</span>
          </div>
          <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[10px]">4. Final Execution</span>
            <span className="font-bold text-emerald-300">Real Execution Time (ms)</span>
          </div>
        </div>
      </div>

      {/* Chart & Table Results */}
      {results.length > 0 ? (
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
              Execution Time Across Input Patterns (ms)
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="patternLabel" tick={{ fontSize: 12, fill: '#334155' }} />
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
                  <Bar dataKey="quickTime" fill="#2563eb" name="Quick Sort Time (ms)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mergeTime" fill="#ea580c" name="Merge Sort Time (ms)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-900 text-white uppercase text-[11px] font-mono tracking-wider">
                <tr>
                  <th className="px-4 py-3">Input Pattern</th>
                  <th className="px-4 py-3 bg-blue-900/60 text-blue-200">Quick Sort Time</th>
                  <th className="px-4 py-3 bg-orange-900/60 text-orange-200">Merge Sort Time</th>
                  <th className="px-4 py-3">Quick Comparisons</th>
                  <th className="px-4 py-3">Merge Comparisons</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800 font-mono">
                {results.map((r) => (
                  <tr key={r.pattern} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{r.patternLabel}</td>
                    <td className="px-4 py-3 font-bold text-blue-700 bg-blue-50/40">
                      {formatTimeMs(r.quickTime)}
                    </td>
                    <td className="px-4 py-3 font-bold text-orange-600 bg-orange-50/40">
                      {formatTimeMs(r.mergeTime)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatNumber(r.quickComparisons)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatNumber(r.mergeComparisons)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500 space-y-2">
          <Sliders className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Input Pattern Benchmark Ready</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click "COMPARE INPUT PATTERNS" above to evaluate how Quick Sort and Merge Sort respond to Random, Sorted, and Reverse Sorted dataset arrangements.
          </p>
        </div>
      )}
    </div>
  );
};
