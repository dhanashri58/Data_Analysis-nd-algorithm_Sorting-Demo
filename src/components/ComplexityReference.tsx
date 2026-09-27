import { BookOpen, Zap, GitCommit } from 'lucide-react';

export const ComplexityReference = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
        <div className="p-2 bg-slate-900 text-white rounded-lg">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-wide">
            SECTION 9 — COMPLEXITY & THEORETICAL REFERENCE
          </h3>
          <p className="text-xs text-slate-500">
            Quick reference guide comparing asymptotic bounds, space requirements, and algorithmic properties
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quick Sort Theory Card */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <h4 className="text-sm font-bold text-blue-900">QUICK SORT</h4>
            </div>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
              Partition-Based
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-white p-2.5 rounded-lg border border-blue-100 shadow-xs">
              <span className="text-[10px] text-slate-500 block">Best Case</span>
              <strong className="text-blue-700 text-sm">O(n log n)</strong>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-blue-100 shadow-xs">
              <span className="text-[10px] text-slate-500 block">Average Case</span>
              <strong className="text-blue-700 text-sm">O(n log n)</strong>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-blue-100 shadow-xs">
              <span className="text-[10px] text-slate-500 block">Worst Case</span>
              <strong className="text-red-600 text-sm">O(n²)</strong>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-center justify-between pt-2 border-t border-blue-100">
              <span className="font-semibold text-slate-600">Auxiliary Space:</span>
              <span className="font-mono font-bold text-blue-900">O(log n) stack (In-place)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600">Stability:</span>
              <span className="font-mono text-slate-800">Unstable (Standard implementation)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600">Key Dependency:</span>
              <span className="font-mono text-blue-800">Pivot Selection Strategy</span>
            </div>
          </div>
        </div>

        {/* Merge Sort Theory Card */}
        <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GitCommit className="w-5 h-5 text-orange-600" />
              <h4 className="text-sm font-bold text-orange-900">MERGE SORT</h4>
            </div>
            <span className="bg-orange-100 text-orange-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
              Merge-Based
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-white p-2.5 rounded-lg border border-orange-100 shadow-xs">
              <span className="text-[10px] text-slate-500 block">Best Case</span>
              <strong className="text-orange-700 text-sm">O(n log n)</strong>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-orange-100 shadow-xs">
              <span className="text-[10px] text-slate-500 block">Average Case</span>
              <strong className="text-orange-700 text-sm">O(n log n)</strong>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-orange-100 shadow-xs">
              <span className="text-[10px] text-slate-500 block">Worst Case</span>
              <strong className="text-orange-700 text-sm">O(n log n)</strong>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-center justify-between pt-2 border-t border-orange-100">
              <span className="font-semibold text-slate-600">Auxiliary Space:</span>
              <span className="font-mono font-bold text-orange-900">O(n) auxiliary array</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600">Stability:</span>
              <span className="font-mono text-emerald-700 font-bold">Stable (Guaranteed)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600">Key Dependency:</span>
              <span className="font-mono text-orange-800">Memory Bandwidth & Allocations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
