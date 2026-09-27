import type { InputPattern, PivotStrategy } from '../types/sorting';
import { Sliders, Shuffle, ArrowUpRight, ArrowDownRight, Target, Info } from 'lucide-react';

interface InputPatternConfigProps {
  inputPattern: InputPattern;
  setInputPattern: (pattern: InputPattern) => void;
  pivotStrategy: PivotStrategy;
  setPivotStrategy: (pivot: PivotStrategy) => void;
  datasetSize: number;
  setDatasetSize: (size: number) => void;
}

export const InputPatternConfig = ({
  inputPattern,
  setInputPattern,
  pivotStrategy,
  setPivotStrategy,
}: InputPatternConfigProps) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-600/30 rounded-lg border border-amber-500/40 text-amber-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              SECTION 2 — INPUT CHARACTERISTICS & PIVOT STRATEGY
            </h2>
            <p className="text-xs text-slate-300">
              Configure arrangement pattern and pivot strategy to test algorithm edge cases
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Input Pattern */}
        <div className="md:col-span-6 space-y-3">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Input Data Arrangement (Pattern):
          </label>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setInputPattern('random')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition text-center cursor-pointer ${
                inputPattern === 'random'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/40'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Shuffle className={`w-4 h-4 ${inputPattern === 'random' ? 'text-blue-600' : 'text-slate-500'}`} />
              <span className="font-bold text-xs">Random</span>
              <span className="text-[10px] text-slate-500">Standard Unsorted</span>
            </button>

            <button
              onClick={() => setInputPattern('sorted')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition text-center cursor-pointer ${
                inputPattern === 'sorted'
                  ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/40'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <ArrowUpRight className={`w-4 h-4 ${inputPattern === 'sorted' ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span className="font-bold text-xs">Sorted</span>
              <span className="text-[10px] text-slate-500">Ascending Order</span>
            </button>

            <button
              onClick={() => setInputPattern('reverse')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition text-center cursor-pointer ${
                inputPattern === 'reverse'
                  ? 'border-orange-600 bg-orange-50/80 text-orange-900 ring-2 ring-orange-500/40'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <ArrowDownRight className={`w-4 h-4 ${inputPattern === 'reverse' ? 'text-orange-600' : 'text-slate-500'}`} />
              <span className="font-bold text-xs">Reverse Sorted</span>
              <span className="text-[10px] text-slate-500">Descending Order</span>
            </button>
          </div>
        </div>

        {/* Quick Sort Pivot Strategy */}
        <div className="md:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Quick Sort Pivot Strategy:
            </label>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
              Key Factor
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPivotStrategy('random')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition text-center cursor-pointer ${
                pivotStrategy === 'random'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/40'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Target className={`w-4 h-4 ${pivotStrategy === 'random' ? 'text-blue-600' : 'text-slate-500'}`} />
              <span className="font-bold text-xs">Randomized</span>
              <span className="text-[10px] text-slate-500">Avoids O(n²)</span>
            </button>

            <button
              onClick={() => setPivotStrategy('median3')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition text-center cursor-pointer ${
                pivotStrategy === 'median3'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/40'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Target className={`w-4 h-4 ${pivotStrategy === 'median3' ? 'text-blue-600' : 'text-slate-500'}`} />
              <span className="font-bold text-xs">Median-of-3</span>
              <span className="text-[10px] text-slate-500">First, Mid, Last</span>
            </button>

            <button
              onClick={() => setPivotStrategy('last')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition text-center cursor-pointer ${
                pivotStrategy === 'last'
                  ? 'border-red-600 bg-red-50/80 text-red-900 ring-2 ring-red-500/40'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Target className={`w-4 h-4 ${pivotStrategy === 'last' ? 'text-red-600' : 'text-slate-500'}`} />
              <span className="font-bold text-xs">Last Element</span>
              <span className="text-[10px] text-red-600 font-semibold">O(n²) on Sorted!</span>
            </button>
          </div>
        </div>

        {/* Explanatory Note */}
        <div className="md:col-span-12 bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start space-x-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Presentation Insight:</strong> Using <em>Last Element</em> pivot strategy on <em>Sorted</em> or <em>Reverse Sorted</em> input demonstrates Quick Sort's worst-case <strong>O(n²)</strong> time complexity due to unbalanced partitioning, whereas <em>Merge Sort</em> maintains consistent <strong>O(n log n)</strong> performance regardless of input ordering.
          </p>
        </div>
      </div>
    </div>
  );
};
