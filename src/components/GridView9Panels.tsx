import type { SortStats, DatasetInfo, InputPattern, PivotStrategy, ActiveTab } from '../types/sorting';
import {
  Maximize2,
  Layers,
  Upload,
  Play,
  CheckCircle2,
  BarChart3,
  Lightbulb,
  MonitorPlay
} from 'lucide-react';

interface GridView9PanelsProps {
  dataset: DatasetInfo;
  setDataset: (dataset: DatasetInfo) => void;
  selectedColumn: string;
  setSelectedColumn: (col: string) => void;
  datasetSize: number;
  setDatasetSize: (size: number) => void;
  inputPattern: InputPattern;
  setInputPattern: (pat: InputPattern) => void;
  pivotStrategy: PivotStrategy;
  setPivotStrategy: (piv: PivotStrategy) => void;
  quickStats?: SortStats;
  mergeStats?: SortStats;
  onUpdateStats: (q: SortStats, m: SortStats) => void;
  onRunQuickSort: () => void;
  onRunMergeSort: () => void;
  onRunBoth: () => void;
  isRunning: boolean;
  progressMsg: string;
  progressPercent: number;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenPresentationMode: () => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onSelectPanel: (panelTab: ActiveTab) => void;
}

export const GridView9Panels = ({
  dataset,
  selectedColumn,
  setSelectedColumn,
  inputPattern,
  setInputPattern,
  pivotStrategy,
  setPivotStrategy,
  quickStats,
  mergeStats,
  onRunBoth,
  onOpenPresentationMode,
  onSelectPanel,
}: GridView9PanelsProps) => {
  return (
    <div className="space-y-6 font-sans w-full min-w-0">
      {/* Overview Banner */}
      <div className="bg-slate-900 text-white border-2 border-slate-950 p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-400 text-slate-950 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] font-black">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-amber-400">9-PANEL WIREFRAME OVERVIEW SHEET</span>
              <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded border border-slate-950">
                1:1 WIREFRAME LAYOUT
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Interactive 3x3 layout of all 9 SortAnalyser system panels. Click any panel's expand button to focus on it.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-slate-400">Panels 01-09 Active</span>
        </div>
      </div>

      {/* 3x3 Grid Matrix matching Wireframe image-1.png */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full min-w-0">
        {/* PANEL 01: HERO / HOME */}
        <div className="bg-emerald-100 border-2 border-slate-950 rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-950 pb-2">
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-400 text-slate-950 font-mono font-black text-xs px-2 py-0.5 rounded border border-slate-950">
                  01
                </span>
                <span className="font-extrabold text-xs uppercase font-mono text-slate-950">
                  Hero Section
                </span>
              </div>
              <button
                onClick={() => onSelectPanel('home')}
                className="p-1 bg-white hover:bg-slate-100 text-slate-950 rounded-lg border border-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] transition cursor-pointer"
                title="Focus Panel 01"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-950 uppercase font-sans tracking-tight">SORT ANALYSER</h3>
              <p className="text-xs font-extrabold text-blue-700">Quick Sort vs Merge Sort</p>
            </div>

            <p className="text-[11px] text-slate-800 leading-relaxed font-medium">
              Explore. Compare. Understand. Sorting algorithms on real and synthetic ML datasets with interactive step visualizations.
            </p>

            <div className="bg-white border-2 border-slate-950 rounded-xl p-3 font-mono text-[11px] text-center font-bold text-slate-950">
              "SAME DATA. DIFFERENT APPROACHES. BETTER INSIGHTS."
            </div>
          </div>

          <button
            onClick={() => onSelectPanel('home')}
            className="w-full bg-rose-500 hover:bg-rose-400 text-white font-black text-xs py-2 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
          >
            GET STARTED →
          </button>
        </div>

        {/* PANEL 02: DATASET CONFIGURATION */}
        <div className="bg-rose-100 border-2 border-slate-950 rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-950 pb-2">
              <div className="flex items-center space-x-2">
                <span className="bg-rose-400 text-slate-950 font-mono font-black text-xs px-2 py-0.5 rounded border border-slate-950">
                  02
                </span>
                <span className="font-extrabold text-xs uppercase font-mono text-slate-950">
                  Dataset Configuration
                </span>
              </div>
              <button
                onClick={() => onSelectPanel('dataset')}
                className="p-1 bg-white hover:bg-slate-100 text-slate-950 rounded-lg border border-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] transition cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white border-2 border-dashed border-slate-950 rounded-xl p-3 text-center space-y-1">
              <Upload className="w-5 h-5 mx-auto text-rose-500" />
              <p className="text-xs font-bold text-slate-950">Drag & drop CSV file here</p>
              <p className="text-[10px] text-slate-500 font-mono">Supports CSV up to 100MB</p>
            </div>

            <div className="bg-white border-2 border-slate-950 rounded-xl p-2.5 text-xs font-mono space-y-1">
              <span className="font-bold text-slate-950 block">Select Numeric Column:</span>
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-950 rounded p-1 font-bold text-slate-950 text-[11px]"
              >
                {dataset.numericColumns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => onSelectPanel('dataset')}
            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
          >
            NEXT: GENERATOR →
          </button>
        </div>

        {/* PANEL 03: SYNTHETIC DATASET GENERATION */}
        <div className="bg-amber-100 border-2 border-slate-950 rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-950 pb-2">
              <div className="flex items-center space-x-2">
                <span className="bg-amber-300 text-slate-950 font-mono font-black text-xs px-2 py-0.5 rounded border border-slate-950">
                  03
                </span>
                <span className="font-extrabold text-xs uppercase font-mono text-slate-950">
                  Synthetic ML Generator
                </span>
              </div>
              <button
                onClick={() => onSelectPanel('dataset')}
                className="p-1 bg-white hover:bg-slate-100 text-slate-950 rounded-lg border border-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] transition cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white border-2 border-slate-950 rounded-xl p-2.5 font-mono text-xs space-y-1">
              <div className="flex justify-between font-bold">
                <span>Active Domain:</span>
                <span className="text-blue-700">{dataset.domainLabel}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Dataset Size:</span>
                <span className="font-bold text-slate-950">{dataset.recordsCount.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-emerald-300 border-2 border-slate-950 rounded-xl p-2 flex items-center gap-1.5 text-[11px] font-black text-slate-950 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span>✓ {dataset.recordsCount.toLocaleString()} records • {dataset.columns.length} columns</span>
            </div>
          </div>

          <button
            onClick={() => onSelectPanel('settings')}
            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
          >
            NEXT: SETTINGS →
          </button>
        </div>

        {/* PANEL 04: INPUT & ALGORITHM SETTINGS */}
        <div className="bg-indigo-100 border-2 border-slate-950 rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-950 pb-2">
              <div className="flex items-center space-x-2">
                <span className="bg-indigo-400 text-slate-950 font-mono font-black text-xs px-2 py-0.5 rounded border border-slate-950">
                  04
                </span>
                <span className="font-extrabold text-xs uppercase font-mono text-slate-950">
                  Input & Settings
                </span>
              </div>
              <button
                onClick={() => onSelectPanel('settings')}
                className="p-1 bg-white hover:bg-slate-100 text-slate-950 rounded-lg border border-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] transition cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="bg-white border-2 border-slate-950 rounded-xl p-2.5 space-y-1">
                <span className="font-bold text-slate-950 block">Input Data Pattern:</span>
                <div className="flex gap-1">
                  {(['random', 'sorted', 'reverse'] as InputPattern[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setInputPattern(p)}
                      className={`flex-1 text-[10px] py-1 rounded font-bold uppercase ${
                        inputPattern === p ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border-2 border-slate-950 rounded-xl p-2.5 space-y-1">
                <span className="font-bold text-slate-950 block">Quick Sort Pivot Strategy:</span>
                <select
                  value={pivotStrategy}
                  onChange={(e) => setPivotStrategy(e.target.value as PivotStrategy)}
                  className="w-full bg-slate-50 border border-slate-950 rounded p-1 font-bold text-[11px] text-slate-950 uppercase"
                >
                  <option value="random">Randomized Pivot</option>
                  <option value="median3">Median-of-Three Pivot</option>
                  <option value="last">Last Element Pivot (O(N²))</option>
                  <option value="first">First Element Pivot</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectPanel('visualize')}
            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
          >
            NEXT: VISUALIZE →
          </button>
        </div>

        {/* PANEL 05: SORTING VISUALIZATION */}
        <div className="bg-teal-100 border-2 border-slate-950 rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-950 pb-2">
              <div className="flex items-center space-x-2">
                <span className="bg-teal-400 text-slate-950 font-mono font-black text-xs px-2 py-0.5 rounded border border-slate-950">
                  05
                </span>
                <span className="font-extrabold text-xs uppercase font-mono text-slate-950">
                  Sorting Visualization
                </span>
              </div>
              <button
                onClick={() => onSelectPanel('visualize')}
                className="p-1 bg-white hover:bg-slate-100 text-slate-950 rounded-lg border border-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] transition cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 h-28 flex items-end justify-center gap-1 border-2 border-slate-950">
              <div className="w-2 bg-slate-600 rounded-t h-[30%]" />
              <div className="w-2 bg-purple-400 rounded-t h-[45%]" />
              <div className="w-2 bg-cyan-300 rounded-t h-[65%]" />
              <div className="w-2 bg-slate-600 rounded-t h-[50%]" />
              <div className="w-2 bg-amber-400 rounded-t h-[85%]" />
              <div className="w-2 bg-emerald-400 rounded-t h-[95%]" />
            </div>

            <div className="flex justify-between font-mono text-[10px] text-slate-800 font-bold">
              <span>● Normal</span>
              <span className="text-cyan-600">● Scanner j</span>
              <span className="text-purple-600">● Boundary i</span>
              <span className="text-amber-600">● Pivot P</span>
              <span className="text-emerald-600">● Sorted</span>
            </div>
          </div>

          <button
            onClick={() => onSelectPanel('visualize')}
            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
          >
            OPEN VISUALIZER →
          </button>
        </div>

        {/* PANEL 06: RUN ALGORITHMS */}
        <div className="bg-cyan-100 border-2 border-slate-950 rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-950 pb-2">
              <div className="flex items-center space-x-2">
                <span className="bg-cyan-400 text-slate-950 font-mono font-black text-xs px-2 py-0.5 rounded border border-slate-950">
                  06
                </span>
                <span className="font-extrabold text-xs uppercase font-mono text-slate-950">
                  Run Algorithms
                </span>
              </div>
              <button
                onClick={() => onSelectPanel('results')}
                className="p-1 bg-white hover:bg-slate-100 text-slate-950 rounded-lg border border-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] transition cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-blue-200 border border-slate-950 p-2 rounded-lg text-center font-black text-blue-950">
                Run Quick Sort
              </div>
              <div className="bg-rose-200 border border-slate-950 p-2 rounded-lg text-center font-black text-rose-950">
                Run Merge Sort
              </div>
            </div>

            <button
              onClick={onRunBoth}
              className="w-full bg-purple-400 hover:bg-purple-300 text-slate-950 font-black text-xs py-2 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>COMPARE BOTH (RUN BENCHMARK)</span>
            </button>
          </div>

          <button
            onClick={() => onSelectPanel('results')}
            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
          >
            VIEW RESULTS →
          </button>
        </div>

        {/* PANEL 07: ALGORITHM RESULTS */}
        <div className="bg-rose-100 border-2 border-slate-950 rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-950 pb-2">
              <div className="flex items-center space-x-2">
                <span className="bg-rose-400 text-slate-950 font-mono font-black text-xs px-2 py-0.5 rounded border border-slate-950">
                  07
                </span>
                <span className="font-extrabold text-xs uppercase font-mono text-slate-950">
                  Algorithm Results
                </span>
              </div>
              <button
                onClick={() => onSelectPanel('results')}
                className="p-1 bg-white hover:bg-slate-100 text-slate-950 rounded-lg border border-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] transition cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
              <div className="bg-white border border-slate-950 p-2 rounded-lg space-y-1">
                <span className="font-bold text-blue-700 block">Quick Sort</span>
                <div className="font-black text-slate-950 text-xs">
                  {quickStats ? `${quickStats.executionTimeMs.toFixed(2)} ms` : '124.32 ms'}
                </div>
                <div className="text-emerald-700 font-bold">✓ Sorted</div>
              </div>

              <div className="bg-white border border-slate-950 p-2 rounded-lg space-y-1">
                <span className="font-bold text-rose-600 block">Merge Sort</span>
                <div className="font-black text-slate-950 text-xs">
                  {mergeStats ? `${mergeStats.executionTimeMs.toFixed(2)} ms` : '158.76 ms'}
                </div>
                <div className="text-emerald-700 font-bold">✓ Sorted</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectPanel('analysis')}
            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
          >
            VIEW SCALING ANALYSIS →
          </button>
        </div>

        {/* PANEL 08: COMPARISON & SCALING ANALYSIS */}
        <div className="bg-amber-100 border-2 border-slate-950 rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-950 pb-2">
              <div className="flex items-center space-x-2">
                <span className="bg-amber-400 text-slate-950 font-mono font-black text-xs px-2 py-0.5 rounded border border-slate-950">
                  08
                </span>
                <span className="font-extrabold text-xs uppercase font-mono text-slate-950">
                  Comparison & Analysis
                </span>
              </div>
              <button
                onClick={() => onSelectPanel('analysis')}
                className="p-1 bg-white hover:bg-slate-100 text-slate-950 rounded-lg border border-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] transition cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white border-2 border-slate-950 rounded-xl p-2.5 font-mono text-[10px] space-y-1">
              <div className="flex items-center gap-1 font-bold text-amber-900">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Multi-Size Scaling Curve (1K to 1M)</span>
              </div>
              <p className="text-slate-600 font-sans leading-tight">
                Empirical complexity analysis across array sizes with CSV log export.
              </p>
            </div>

            <div className="bg-white border-2 border-slate-950 rounded-xl p-2 font-mono text-[10px] space-y-1">
              <span className="font-bold text-slate-950 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-600" />
                <span>CS Rule Insight:</span>
              </span>
              <p className="text-slate-700">Quick Sort exhibits L1/L2 cache locality; Merge Sort maintains $O(N \log N)$ predictability.</p>
            </div>
          </div>

          <button
            onClick={() => onSelectPanel('analysis')}
            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
          >
            OPEN ANALYSIS →
          </button>
        </div>

        {/* PANEL 09: PRESENTATION MODE */}
        <div className="bg-rose-100 border-2 border-slate-950 rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-4 flex flex-col justify-between md:col-span-2 lg:col-span-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-950 pb-2">
              <div className="flex items-center space-x-2">
                <span className="bg-amber-300 text-slate-950 font-mono font-black text-xs px-2 py-0.5 rounded border border-slate-950">
                  09
                </span>
                <span className="font-extrabold text-xs uppercase font-mono text-slate-950">
                  Presentation Mode (Projection View)
                </span>
              </div>
              <button
                onClick={onOpenPresentationMode}
                className="p-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg border border-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] transition cursor-pointer font-bold text-xs px-3 flex items-center gap-1"
              >
                <MonitorPlay className="w-3.5 h-3.5" />
                <span>Launch Presentation View</span>
              </button>
            </div>

            <div className="bg-white border-2 border-slate-950 rounded-xl p-3 font-mono text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>Domain: <strong>{dataset.domainLabel}</strong></span>
                <span>Column: <strong>{selectedColumn}</strong></span>
                <span>Records: <strong>{dataset.recordsCount.toLocaleString()}</strong></span>
              </div>

              <div className="p-2.5 bg-amber-200 border-2 border-slate-950 rounded-lg text-center font-bold text-xs text-slate-950 uppercase">
                "Same data. Different approaches. Better insights."
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
