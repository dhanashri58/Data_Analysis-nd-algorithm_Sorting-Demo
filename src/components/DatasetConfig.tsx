import { useRef, useState } from 'react';
import type { DatasetInfo, DatasetSize } from '../types/sorting';
import { parseCSVFile } from '../utils/csvParser';
import { generateSyntheticMLDataset } from '../algorithms/generator';
import {
  Upload,
  CheckCircle2,
  Database
} from 'lucide-react';

interface DatasetConfigProps {
  dataset: DatasetInfo;
  setDataset: (dataset: DatasetInfo) => void;
  selectedColumn: string;
  setSelectedColumn: (col: string) => void;
  datasetSize: number;
  setDatasetSize: (size: number) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const DatasetConfig = ({
  dataset,
  setDataset,
  selectedColumn,
  setSelectedColumn,
  setDatasetSize,
  onToast,
}: DatasetConfigProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const parsed = await parseCSVFile(file);
      setDataset(parsed);
      if (parsed.numericColumns.length > 0) {
        setSelectedColumn(parsed.selectedColumn);
      }
      setDatasetSize(parsed.recordsCount);
      onToast(`Successfully loaded CSV dataset: ${parsed.name} (${parsed.recordsCount.toLocaleString()} rows)`, 'success');
    } catch (err: any) {
      onToast(err?.message || 'Failed to parse uploaded CSV file.', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGenerateSynthetic = (size: number) => {
    const synthetic = generateSyntheticMLDataset(size);
    setDataset(synthetic);
    setSelectedColumn(synthetic.selectedColumn);
    setDatasetSize(size);
    onToast(`Generated synthetic ML dataset with ${size.toLocaleString()} records.`, 'info');
  };

  const handleLoadPreset = (presetName: string, size: number, defaultCol: string) => {
    const synthetic = generateSyntheticMLDataset(size);
    synthetic.name = presetName;
    synthetic.selectedColumn = defaultCol;
    setDataset(synthetic);
    setSelectedColumn(defaultCol);
    setDatasetSize(size);
    onToast(`Loaded preset dataset: ${presetName}`, 'success');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="bg-slate-900 text-white px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600/30 rounded-lg border border-blue-500/40 text-blue-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              SECTION 1 — DATASET CONFIGURATION
            </h2>
            <p className="text-xs text-slate-300">
              Upload custom CSV or generate large synthetic ML datasets for benchmarking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-700 transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>{isUploading ? 'Parsing CSV...' : 'Upload Custom CSV'}</span>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Preset Datasets */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Preset Datasets (Ready for Demo)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => handleLoadPreset('Student_Performance.csv', 100000, 'score')}
              className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                dataset.name.includes('Student') && dataset.recordsCount === 100000
                  ? 'border-blue-500 bg-blue-50/70 text-blue-900 ring-1 ring-blue-500'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-900">Student Performance</span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                  100K
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">100,000 rows • Column: Score</p>
            </button>

            <button
              onClick={() => handleLoadPreset('Employee_Salaries.csv', 500000, 'salary')}
              className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                dataset.name.includes('Employee') || dataset.recordsCount === 500000
                  ? 'border-blue-500 bg-blue-50/70 text-blue-900 ring-1 ring-blue-500'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-900">Employee Salaries</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                  500K
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">500,000 rows • Column: Salary</p>
            </button>

            <button
              onClick={() => handleLoadPreset('Customer_Ratings_ML.csv', 1000000, 'rating')}
              className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                dataset.recordsCount === 1000000
                  ? 'border-blue-500 bg-blue-50/70 text-blue-900 ring-1 ring-blue-500'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-900">Customer ML Ratings</span>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                  1,000,000 (1M)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">1,000,000 rows • Column: Rating</p>
            </button>
          </div>
        </div>

        {/* Dataset Controls & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Active Dataset Overview */}
          <div className="md:col-span-6 bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Current Loaded Dataset
              </span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {dataset.isCustomCSV ? 'Uploaded CSV' : 'Generated Synthetic ML'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[11px] text-slate-500 block">Dataset File:</span>
                <span className="font-semibold text-slate-800 text-xs font-mono truncate block" title={dataset.name}>
                  {dataset.name}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block">Total Records:</span>
                <span className="font-mono font-bold text-blue-700 text-sm">
                  {dataset.recordsCount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Column Picker */}
            <div className="pt-2 border-t border-slate-200">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Select Numeric Feature Column for Sorting:
              </label>
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                {dataset.numericColumns.map((col) => (
                  <option key={col} value={col}>
                    {col} (numeric feature)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Synthetic Size Switcher */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Generate / Resize Synthetic Dataset
              </label>
              <span className="text-[11px] text-slate-500">Pick Target Size</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {([1000, 10000, 50000, 100000, 500000, 1000000] as DatasetSize[]).map((sz) => {
                const label = sz >= 1000000 ? '1M Records' : `${sz / 1000}K Records`;
                const isSelected = dataset.recordsCount === sz;
                return (
                  <button
                    key={sz}
                    onClick={() => handleGenerateSynthetic(sz)}
                    className={`py-2 px-2.5 rounded-lg border text-xs font-semibold font-mono transition text-center cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              Synthetic data contains realistic multi-feature numerical distributions (Age, Salary, Score, Experience, Rating, StudyHours) rather than sequential integers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
