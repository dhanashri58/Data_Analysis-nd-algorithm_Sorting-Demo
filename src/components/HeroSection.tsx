import type { ActiveTab } from '../types/sorting';
import {
  ArrowRight,
  PlayCircle,
  Database,
  BarChart3,
  Zap,
  GitCommit,
  Sparkles
} from 'lucide-react';

interface HeroSectionProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenPresentationMode: () => void;
}

export const HeroSection = ({ setActiveTab }: HeroSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Panel 01 Header Badge */}
      <div className="flex items-center space-x-2">
        <span className="bg-emerald-400 text-slate-950 text-xs font-black font-mono px-2.5 py-1 rounded-md border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          01
        </span>
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider font-mono">
          SortAnalyser Overview & Features
        </h2>
      </div>

      {/* Main Hero Card Container */}
      <div className="bg-emerald-100 border-2 border-slate-950 rounded-2xl p-6 sm:p-10 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-300 text-slate-950 px-3 py-1 rounded-full border-2 border-slate-950 text-xs font-black font-mono shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Divide-and-Conquer Algorithm Suite</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-none uppercase font-sans">
                SORT ANALYSER
              </h1>
              <div className="text-2xl sm:text-3xl font-black text-blue-700 tracking-tight">
                Quick Sort <span className="text-slate-950">vs</span> <span className="text-rose-600">Merge Sort</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-800 font-medium max-w-xl leading-relaxed">
              Explore. Compare. Understand. Benchmark two foundational divide-and-conquer sorting algorithms on real and synthetic ML feature datasets with interactive step visualizations.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('dataset')}
                className="flex items-center gap-2 bg-rose-500 hover:bg-rose-400 text-white font-black text-sm px-6 py-3 rounded-xl border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('visualize')}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-950 font-black text-sm px-6 py-3 rounded-xl border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 text-emerald-600 fill-current" />
                <span>WATCH VISUAL DEMO</span>
              </button>
            </div>
          </div>

          {/* Right Graphical Visual Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
            <div className="w-full bg-white border-2 border-slate-950 rounded-2xl p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-950 pb-3">
                <span className="font-mono font-black text-xs text-slate-900 uppercase">Comparison Matrix</span>
                <span className="bg-cyan-300 text-slate-950 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-slate-950">
                  Empirical Test
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="bg-blue-100 border-2 border-slate-950 p-3 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] space-y-1">
                  <div className="flex items-center gap-1 text-blue-900 font-extrabold text-xs">
                    <Zap className="w-3.5 h-3.5 text-blue-600 fill-current" />
                    <span>Quick Sort</span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-semibold">In-Place Partition</div>
                  <div className="text-[10px] text-blue-800 font-bold">O(N log N) Avg</div>
                </div>

                <div className="bg-rose-100 border-2 border-slate-950 p-3 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] space-y-1">
                  <div className="flex items-center gap-1 text-rose-900 font-extrabold text-xs">
                    <GitCommit className="w-3.5 h-3.5 text-rose-600" />
                    <span>Merge Sort</span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-semibold">Divide & Merge</div>
                  <div className="text-[10px] text-rose-800 font-bold">O(N log N) Stable</div>
                </div>
              </div>

              <div className="bg-amber-100 border-2 border-slate-950 p-3 rounded-xl text-center font-mono text-xs font-bold text-slate-950">
                "SAME DATA. DIFFERENT APPROACHES. BETTER INSIGHTS."
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Highlight Feature Cards (Panel 01 Bottom Row) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-cyan-100 border-2 border-slate-950 rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-2">
          <div className="flex items-center space-x-2 text-cyan-950 font-black">
            <div className="p-2 bg-cyan-400 rounded-lg border-2 border-slate-950">
              <Database className="w-4 h-4 text-slate-950" />
            </div>
            <h3 className="text-sm uppercase tracking-wider font-mono">Real ML Datasets</h3>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-medium">
            Upload custom CSV files or generate large ML feature tables up to 1,000,000 records.
          </p>
        </div>

        <div className="bg-purple-100 border-2 border-slate-950 rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-2">
          <div className="flex items-center space-x-2 text-purple-950 font-black">
            <div className="p-2 bg-purple-400 rounded-lg border-2 border-slate-950">
              <PlayCircle className="w-4 h-4 text-slate-950" />
            </div>
            <h3 className="text-sm uppercase tracking-wider font-mono">Interactive Step Animation</h3>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-medium">
            Observe pointer $i, j, P$ movements and partition boundaries step-by-step in real time.
          </p>
        </div>

        <div className="bg-amber-100 border-2 border-slate-950 rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-2">
          <div className="flex items-center space-x-2 text-amber-950 font-black">
            <div className="p-2 bg-amber-400 rounded-lg border-2 border-slate-950">
              <BarChart3 className="w-4 h-4 text-slate-950" />
            </div>
            <h3 className="text-sm uppercase tracking-wider font-mono">Performance Analysis</h3>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-medium">
            Measure execution times, comparison counts, memory complexity, and size scaling curves.
          </p>
        </div>
      </div>
    </div>
  );
};
