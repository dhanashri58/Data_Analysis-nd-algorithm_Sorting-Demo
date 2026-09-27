import type { InputPattern, PivotStrategy, ActiveTab } from '../types/sorting';
import {
  Shuffle,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Info,
  CheckCircle2,
  Zap,
  GitCommit
} from 'lucide-react';

interface SettingsSectionProps {
  inputPattern: InputPattern;
  setInputPattern: (pattern: InputPattern) => void;
  pivotStrategy: PivotStrategy;
  setPivotStrategy: (pivot: PivotStrategy) => void;
  datasetSize: number;
  setDatasetSize: (size: number) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const SettingsSection = ({
  inputPattern,
  setInputPattern,
  pivotStrategy,
  setPivotStrategy,
  setActiveTab,
}: SettingsSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Panel 04 Header Badge */}
      <div className="flex items-center space-x-2">
        <span className="bg-indigo-400 text-slate-950 text-xs font-black font-mono px-2.5 py-1 rounded-md border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          04
        </span>
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider font-mono">
          Input & Algorithm Settings
        </h2>
      </div>

      <div className="bg-indigo-100 border-2 border-slate-950 rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-6">
        <div className="flex items-center justify-between border-b-2 border-slate-950 pb-4">
          <div className="flex items-center space-x-2">
            <span className="bg-slate-950 text-indigo-300 w-6 h-6 rounded-full flex items-center justify-center font-mono font-black text-xs">
              04
            </span>
            <h3 className="text-xl font-black text-slate-950 uppercase font-sans">
              INPUT & ALGORITHM PARAMETERS
            </h3>
          </div>
          <span className="text-xs font-mono font-bold bg-indigo-300 text-slate-950 px-3 py-1 rounded-lg border border-slate-950">
            Configure Edge Cases
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Input Pattern Selector Card */}
          <div className="md:col-span-6 bg-white border-2 border-slate-950 rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4">
            <label className="block text-xs font-black text-slate-950 uppercase tracking-wider">
              Input Data Pattern (Arrangement):
            </label>

            <div className="space-y-2.5">
              <label
                onClick={() => setInputPattern('random')}
                className={`p-3.5 rounded-xl border-2 flex items-center justify-between transition cursor-pointer ${
                  inputPattern === 'random'
                    ? 'border-slate-950 bg-blue-100 text-slate-950 font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg border-2 border-slate-950 ${inputPattern === 'random' ? 'bg-blue-400' : 'bg-slate-200'}`}>
                    <Shuffle className="w-4 h-4 text-slate-950" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Random (Default)</span>
                    <span className="text-[11px] text-slate-600 font-normal">Elements in random order</span>
                  </div>
                </div>
                {inputPattern === 'random' && <CheckCircle2 className="w-4 h-4 text-blue-700" />}
              </label>

              <label
                onClick={() => setInputPattern('sorted')}
                className={`p-3.5 rounded-xl border-2 flex items-center justify-between transition cursor-pointer ${
                  inputPattern === 'sorted'
                    ? 'border-slate-950 bg-emerald-100 text-slate-950 font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg border-2 border-slate-950 ${inputPattern === 'sorted' ? 'bg-emerald-400' : 'bg-slate-200'}`}>
                    <ArrowUpRight className="w-4 h-4 text-slate-950" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Sorted</span>
                    <span className="text-[11px] text-slate-600 font-normal">Elements in ascending order</span>
                  </div>
                </div>
                {inputPattern === 'sorted' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
              </label>

              <label
                onClick={() => setInputPattern('reverse')}
                className={`p-3.5 rounded-xl border-2 flex items-center justify-between transition cursor-pointer ${
                  inputPattern === 'reverse'
                    ? 'border-slate-950 bg-rose-100 text-slate-950 font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg border-2 border-slate-950 ${inputPattern === 'reverse' ? 'bg-rose-400' : 'bg-slate-200'}`}>
                    <ArrowDownRight className="w-4 h-4 text-slate-950" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Reverse Sorted</span>
                    <span className="text-[11px] text-slate-600 font-normal">Elements in descending order</span>
                  </div>
                </div>
                {inputPattern === 'reverse' && <CheckCircle2 className="w-4 h-4 text-rose-700" />}
              </label>
            </div>
          </div>

          {/* Pivot Strategy & Algorithm Parameters */}
          <div className="md:col-span-6 bg-white border-2 border-slate-950 rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>Quick Sort Settings:</span>
                </span>
                <span className="text-[10px] font-mono font-bold bg-amber-200 text-slate-950 px-2 py-0.5 rounded border border-slate-950">
                  Key Factor
                </span>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-700">Pivot Selection Strategy:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'random', label: 'Randomized', note: 'Avoids O(N²)' },
                    { id: 'median3', label: 'Median-3', note: 'Balanced' },
                    { id: 'last', label: 'Last Item', note: 'O(N²) on sorted' },
                  ].map((piv) => (
                    <button
                      key={piv.id}
                      onClick={() => setPivotStrategy(piv.id as PivotStrategy)}
                      className={`p-2.5 rounded-xl border-2 text-center transition cursor-pointer ${
                        pivotStrategy === piv.id
                          ? piv.id === 'last' ? 'bg-rose-400 border-slate-950 text-slate-950 font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'bg-blue-400 border-slate-950 text-slate-950 font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-bold'
                      }`}
                    >
                      <span className="text-xs font-bold block">{piv.label}</span>
                      <span className="text-[9px] block text-slate-800 font-mono mt-0.5">{piv.note}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Merge Sort Settings Box */}
              <div className="pt-3 border-t-2 border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-950">
                  <span className="flex items-center gap-1.5">
                    <GitCommit className="w-4 h-4 text-rose-600" />
                    <span>Merge Sort Settings:</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                    O(N log N) Guaranteed
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  Guaranteed divide-and-conquer runtime regardless of input arrangement. Allocates $O(N)$ auxiliary memory.
                </p>
              </div>
            </div>

            {/* Note Box */}
            <div className="bg-amber-100 border-2 border-slate-950 rounded-xl p-3 text-xs text-amber-950 flex items-start space-x-2 font-mono">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p>
                <strong>Experimental Insight:</strong> Selecting <em>Last Element</em> pivot strategy on <em>Reverse Sorted</em> input forces unbalanced sub-arrays, triggering Quick Sort's worst-case <strong>O(N²)</strong> runtime!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Workflow Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setActiveTab('dataset')}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>PREVIOUS</span>
        </button>

        <button
          onClick={() => setActiveTab('visualize')}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        >
          <span>NEXT: VISUALIZE ANIMATION</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
