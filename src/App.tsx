import { useState } from 'react';
import type {
  DatasetInfo,
  InputPattern,
  PivotStrategy,
  SortStats,
  ActiveTab
} from './types/sorting';
import { generateSyntheticMLDataset, extractAndTransformColumn } from './algorithms/generator';
import { executeBenchmarkAsync } from './workers/sortWorkerManager';

// Components
import { HeaderNav } from './components/HeaderNav';
import { GuidedDemoBar } from './components/GuidedDemoBar';
import { HeroSection } from './components/HeroSection';
import { DatasetSection } from './components/DatasetSection';
import { SettingsSection } from './components/SettingsSection';
import { VisualizationSection } from './components/VisualizationSection';
import { ExecutionSection } from './components/ExecutionSection';
import { AnalysisSection } from './components/AnalysisSection';
import { DataPreviewTable } from './components/DataPreviewTable';
import { ComplexityReference } from './components/ComplexityReference';
import { PresentationMode } from './components/PresentationMode';
import { GridView9Panels } from './components/GridView9Panels';
import { Toast, type ToastMessage } from './components/Toast';

export function App() {
  // Main State
  const [dataset, setDataset] = useState<DatasetInfo>(() => generateSyntheticMLDataset(100000, 'student'));
  const [selectedColumn, setSelectedColumn] = useState<string>('score');
  const [datasetSize, setDatasetSize] = useState<number>(100000);
  const [inputPattern, setInputPattern] = useState<InputPattern>('random');
  const [pivotStrategy, setPivotStrategy] = useState<PivotStrategy>('random');

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isGridView, setIsGridView] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);

  // Results State
  const [quickStats, setQuickStats] = useState<SortStats | undefined>(undefined);
  const [mergeStats, setMergeStats] = useState<SortStats | undefined>(undefined);
  const [sortedArrayOutput, setSortedArrayOutput] = useState<number[] | undefined>(undefined);

  // Execution Worker State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = String(Date.now() + Math.random());
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Run Single Algorithm
  const handleRunSingle = async (algo: 'Quick Sort' | 'Merge Sort') => {
    setIsRunning(true);
    setProgressPercent(10);
    setProgressMsg(`Extracting ${selectedColumn} feature array (${dataset.domainLabel})...`);

    const fullArray = extractAndTransformColumn(dataset.data, selectedColumn, inputPattern);

    try {
      const res = await executeBenchmarkAsync({
        type: 'RUN_SINGLE',
        algorithm: algo,
        array: fullArray,
        pivotStrategy,
        inputPattern,
        onProgress: (msg, pct) => {
          setProgressMsg(msg);
          setProgressPercent(pct);
        },
      });

      if (algo === 'Quick Sort' && res.singleStats) {
        setQuickStats(res.singleStats);
        if (res.sortedArray) setSortedArrayOutput(res.sortedArray);
        addToast(`Quick Sort executed in ${res.singleStats.executionTimeMs.toFixed(2)} ms!`, 'success');
      } else if (algo === 'Merge Sort' && res.singleStats) {
        setMergeStats(res.singleStats);
        if (res.sortedArray) setSortedArrayOutput(res.sortedArray);
        addToast(`Merge Sort executed in ${res.singleStats.executionTimeMs.toFixed(2)} ms!`, 'success');
      }
    } catch (err: any) {
      addToast(err?.message || `${algo} benchmark failed.`, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  // Run Both Side-by-Side
  const handleRunBoth = async () => {
    setIsRunning(true);
    setProgressPercent(10);
    setProgressMsg(`Extracting ${dataset.domainLabel} feature data (${dataset.recordsCount.toLocaleString()} items)...`);

    const fullArray = extractAndTransformColumn(dataset.data, selectedColumn, inputPattern);

    try {
      const res = await executeBenchmarkAsync({
        type: 'RUN_COMPARISON',
        array: fullArray,
        pivotStrategy,
        inputPattern,
        onProgress: (msg, pct) => {
          setProgressMsg(msg);
          setProgressPercent(pct);
        },
      });

      if (res.quickStats && res.mergeStats) {
        setQuickStats(res.quickStats);
        setMergeStats(res.mergeStats);
        addToast(
          `Comparison complete! Quick Sort: ${res.quickStats.executionTimeMs.toFixed(2)}ms | Merge Sort: ${res.mergeStats.executionTimeMs.toFixed(2)}ms`,
          'success'
        );
      }
    } catch (err: any) {
      addToast(err?.message || 'Comparison benchmark failed.', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-amber-300">
      {/* App Header Bar */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'grid') setActiveTab(tab);
        }}
        onOpenPresentationMode={() => setIsPresentationOpen(true)}
        datasetName={dataset.name}
        recordsCount={dataset.recordsCount}
        selectedColumn={selectedColumn}
        isGridView={isGridView}
        setIsGridView={setIsGridView}
      />

      {/* Benchmark Steps Workflow Assistant Bar */}
      <GuidedDemoBar
        setActiveTab={(tab) => {
          setIsGridView(false);
          setActiveTab(tab);
        }}
        onOpenPresentationMode={() => setIsPresentationOpen(true)}
        onSelectDatasetSize={(sz) => {
          setDataset(generateSyntheticMLDataset(sz, dataset.domain));
          setDatasetSize(sz);
        }}
        onSelectInputPattern={setInputPattern}
        onSelectPivotStrategy={setPivotStrategy}
        onRunComparison={handleRunBoth}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 space-y-6">
        {/* 9-PANEL SHEET GRID OVERVIEW MODE */}
        {isGridView ? (
          <GridView9Panels
            dataset={dataset}
            setDataset={setDataset}
            selectedColumn={selectedColumn}
            setSelectedColumn={setSelectedColumn}
            datasetSize={datasetSize}
            setDatasetSize={setDatasetSize}
            inputPattern={inputPattern}
            setInputPattern={setInputPattern}
            pivotStrategy={pivotStrategy}
            setPivotStrategy={setPivotStrategy}
            quickStats={quickStats}
            mergeStats={mergeStats}
            onUpdateStats={(q, m) => {
              setQuickStats(q);
              setMergeStats(m);
            }}
            onRunQuickSort={() => handleRunSingle('Quick Sort')}
            onRunMergeSort={() => handleRunSingle('Merge Sort')}
            onRunBoth={handleRunBoth}
            isRunning={isRunning}
            progressMsg={progressMsg}
            progressPercent={progressPercent}
            setActiveTab={(tab) => {
              setIsGridView(false);
              setActiveTab(tab);
            }}
            onOpenPresentationMode={() => setIsPresentationOpen(true)}
            onToast={addToast}
            onSelectPanel={(tab) => {
              setIsGridView(false);
              setActiveTab(tab);
            }}
          />
        ) : (
          <>
            {/* PANEL 01: HOME / HERO */}
            {activeTab === 'home' && (
              <HeroSection
                setActiveTab={setActiveTab}
                onOpenPresentationMode={() => setIsPresentationOpen(true)}
              />
            )}

            {/* PANELS 02 & 03: DATASET CONFIGURATION & GENERATION */}
            {activeTab === 'dataset' && (
              <DatasetSection
                dataset={dataset}
                setDataset={setDataset}
                selectedColumn={selectedColumn}
                setSelectedColumn={setSelectedColumn}
                setDatasetSize={setDatasetSize}
                setActiveTab={setActiveTab}
                onToast={addToast}
              />
            )}

            {/* PANEL 04: SETTINGS */}
            {activeTab === 'settings' && (
              <SettingsSection
                inputPattern={inputPattern}
                setInputPattern={setInputPattern}
                pivotStrategy={pivotStrategy}
                setPivotStrategy={setPivotStrategy}
                datasetSize={datasetSize}
                setDatasetSize={setDatasetSize}
                setActiveTab={setActiveTab}
              />
            )}

            {/* PANEL 05: VISUALIZATION */}
            {activeTab === 'visualize' && (
              <VisualizationSection
                dataset={dataset}
                selectedColumn={selectedColumn}
                inputPattern={inputPattern}
                pivotStrategy={pivotStrategy}
                setActiveTab={setActiveTab}
              />
            )}

            {/* PANELS 06 & 07: EXECUTION & RESULTS */}
            {activeTab === 'results' && (
              <div className="space-y-6">
                <ExecutionSection
                  onRunQuickSort={() => handleRunSingle('Quick Sort')}
                  onRunMergeSort={() => handleRunSingle('Merge Sort')}
                  onRunBoth={handleRunBoth}
                  isRunning={isRunning}
                  progressMessage={progressMsg}
                  progressPercent={progressPercent}
                  quickStats={quickStats}
                  mergeStats={mergeStats}
                  pivotStrategy={pivotStrategy}
                  inputPattern={inputPattern}
                  itemCount={dataset.recordsCount}
                  selectedColumn={selectedColumn}
                  setActiveTab={setActiveTab}
                />

                <DataPreviewTable
                  dataset={dataset}
                  sortedArray={sortedArrayOutput}
                  selectedColumn={selectedColumn}
                />
              </div>
            )}

            {/* PANEL 08: ANALYSIS & SCALING BENCHMARK */}
            {activeTab === 'analysis' && (
              <div className="space-y-6">
                <AnalysisSection
                  dataset={dataset}
                  selectedColumn={selectedColumn}
                  pivotStrategy={pivotStrategy}
                  inputPattern={inputPattern}
                  setActiveTab={setActiveTab}
                  onOpenPresentationMode={() => setIsPresentationOpen(true)}
                  onToast={addToast}
                />

                <ComplexityReference />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-6 border-t-2 border-slate-950 text-xs mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 font-mono">
            <span className="font-extrabold text-white">SortAnalyser</span>
            <span>• Design & Analysis of Algorithms</span>
            <span>• Benchmark Suite</span>
          </div>
          <p className="text-slate-500 font-mono text-[11px]">
            Real algorithm execution engine implemented in pure TypeScript with Web Worker benchmarking.
          </p>
        </div>
      </footer>

      {/* Fullscreen Presentation Mode (Panel 09) */}
      {isPresentationOpen && (
        <PresentationMode
          dataset={dataset}
          selectedColumn={selectedColumn}
          inputPattern={inputPattern}
          setInputPattern={setInputPattern}
          pivotStrategy={pivotStrategy}
          setPivotStrategy={setPivotStrategy}
          quickStats={quickStats}
          mergeStats={mergeStats}
          onUpdateStats={(q, m) => {
            setQuickStats(q);
            setMergeStats(m);
          }}
          onClose={() => setIsPresentationOpen(false)}
          setActiveTab={setActiveTab}
          onToast={addToast}
        />
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
