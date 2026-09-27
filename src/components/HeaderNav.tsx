import type { ActiveTab } from '../types/sorting';
import {
  Home,
  Database,
  Sliders,
  PlayCircle,
  BarChart2,
  TrendingUp,
  MonitorPlay,
  Grid,
  Layers
} from 'lucide-react';

interface HeaderNavProps {
  activeTab: ActiveTab | 'grid';
  setActiveTab: (tab: ActiveTab | 'grid') => void;
  onOpenPresentationMode: () => void;
  datasetName: string;
  recordsCount: number;
  selectedColumn: string;
  isGridView: boolean;
  setIsGridView: (grid: boolean) => void;
}

export const HeaderNav = ({
  activeTab,
  setActiveTab,
  onOpenPresentationMode,
  datasetName,
  recordsCount,
  selectedColumn,
  isGridView,
  setIsGridView,
}: HeaderNavProps) => {
  return (
    <header className="sticky top-0 z-40 bg-amber-50 text-slate-950 border-b-2 border-slate-950 shadow-[0_4px_0_0_rgba(15,23,42,1)] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
          {/* Logo Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => {
              setIsGridView(false);
              setActiveTab('home');
            }}
          >
            <div className="p-2 bg-emerald-400 text-slate-950 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] font-black group-hover:bg-emerald-300 transition">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-950 font-sans uppercase">
                  SortAnalyser
                </span>
                <span className="bg-cyan-300 text-slate-950 text-[11px] font-black font-mono px-2 py-0.5 rounded-md border-2 border-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                  Quick vs Merge
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium hidden sm:block">
                Algorithm Benchmarking & Step Visualization
              </p>
            </div>
          </div>

          {/* Active Dataset Spec Pills */}
          <div className="hidden lg:flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-xs text-slate-950 font-mono">
            <span className="text-slate-600 font-bold">Dataset:</span>
            <span className="font-extrabold text-slate-950 max-w-[130px] truncate">{datasetName}</span>
            <span className="text-slate-400">•</span>
            <span className="text-blue-700 font-extrabold">{recordsCount.toLocaleString()} rows</span>
            <span className="text-slate-400">•</span>
            <span className="bg-amber-200 text-slate-950 px-2 py-0.5 rounded border border-slate-950 font-bold uppercase">
              {selectedColumn}
            </span>
          </div>

          {/* View Toggle & Presentation Launcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGridView(!isGridView)}
              className={`flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-xl border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                isGridView
                  ? 'bg-cyan-300 text-slate-950'
                  : 'bg-white hover:bg-slate-100 text-slate-950'
              }`}
              title="Toggle between single panel mode and full 9-panel wireframe sheet view"
            >
              <Grid className="w-4 h-4" />
              <span>{isGridView ? 'Single Panel' : '9-Panel Grid View'}</span>
            </button>

            <button
              onClick={onOpenPresentationMode}
              className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-4 py-2 rounded-xl border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <MonitorPlay className="w-4 h-4" />
              <span className="hidden sm:inline">PRESENTATION MODE</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        {!isGridView && (
          <nav className="flex space-x-1 border-t-2 border-slate-950 pt-2 pb-2 overflow-x-auto scrollbar-none text-xs font-black">
            {[
              { id: 'home', label: 'HOME', icon: Home, badge: '01', bgActive: 'bg-emerald-400' },
              { id: 'dataset', label: 'DATASET', icon: Database, badge: '02-03', bgActive: 'bg-rose-300' },
              { id: 'settings', label: 'SETTINGS', icon: Sliders, badge: '04', bgActive: 'bg-indigo-300' },
              { id: 'visualize', label: 'VISUALIZE', icon: PlayCircle, badge: '05', bgActive: 'bg-teal-300' },
              { id: 'results', label: 'RESULTS', icon: BarChart2, badge: '06-07', bgActive: 'bg-cyan-300' },
              { id: 'analysis', label: 'ANALYSIS', icon: TrendingUp, badge: '08', bgActive: 'bg-amber-300' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setIsGridView(false);
                    setActiveTab(tab.id as ActiveTab);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap border-2 border-slate-950 ${
                    isActive
                      ? `${tab.bgActive} text-slate-950 font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] translate-y-[-1px]`
                      : 'bg-white hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-950 font-black ${
                      isActive ? 'bg-slate-950 text-white' : 'bg-slate-200 text-slate-950'
                    }`}
                  >
                    {tab.badge}
                  </span>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};
