import { useRef, useState } from 'react';
import type { DatasetInfo, ActiveTab, DomainType } from '../types/sorting';
import { parseCSVFile } from '../utils/csvParser';
import { generateSyntheticMLDataset } from '../algorithms/generator';
import {
  Upload,
  CheckCircle2,
  ArrowRight,
  Table,
  Info
} from 'lucide-react';

interface DatasetSectionProps {
  dataset: DatasetInfo;
  setDataset: (dataset: DatasetInfo) => void;
  selectedColumn: string;
  setSelectedColumn: (col: string) => void;
  setDatasetSize: (size: number) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const DatasetSection = ({
  dataset,
  setDataset,
  selectedColumn,
  setSelectedColumn,
  setDatasetSize,
  setActiveTab,
  onToast,
}: DatasetSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedDomain, setSelectedDomain] = useState<DomainType>(dataset.domain || 'student');

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
      onToast(`Loaded custom CSV dataset: ${parsed.name} (${parsed.recordsCount.toLocaleString()} rows)`, 'success');
    } catch (err: any) {
      onToast(err?.message || 'Failed to parse uploaded CSV file.', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGenerateDomain = (domain: DomainType, size: number) => {
    setSelectedDomain(domain);
    const newDs = generateSyntheticMLDataset(size, domain);
    setDataset(newDs);
    setSelectedColumn(newDs.selectedColumn);
    setDatasetSize(size);
    onToast(`Generated ${newDs.domainLabel} dataset (${size.toLocaleString()} rows, ${newDs.columns.length} domain columns)`, 'success');
  };

  const colMeta = dataset.columnDictionary[selectedColumn];

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Panel Headers */}
      <div className="flex items-center space-x-2">
        <span className="bg-rose-400 text-slate-950 text-xs font-black font-mono px-2.5 py-1 rounded-md border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          02 & 03
        </span>
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider font-mono">
          Dataset Configuration & Domain Machine Learning Generator
        </h2>
      </div>

      {/* Robust 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0 items-stretch">
        {/* PANEL 02: CSV Upload & Feature Selector */}
        <div className="bg-rose-100 border-2 border-slate-950 rounded-2xl p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-5 flex flex-col justify-between w-full min-w-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-950 pb-3">
              <div className="flex items-center space-x-2">
                <span className="bg-slate-950 text-rose-300 w-6 h-6 rounded-full flex items-center justify-center font-mono font-black text-xs">
                  02
                </span>
                <h3 className="text-base font-black text-slate-950 uppercase font-sans">
                  DATASET CONFIGURATION
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-rose-300 text-slate-950 px-2 py-0.5 rounded border border-slate-950">
                Upload CSV / Feature Pick
              </span>
            </div>

            <p className="text-xs text-slate-800 font-medium">
              Upload custom CSV files or configure target feature columns for sorting benchmark evaluation.
            </p>

            {/* Drag & Drop Upload Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="bg-white border-2 border-dashed border-slate-950 rounded-xl p-5 text-center space-y-2 cursor-pointer hover:bg-rose-50 transition shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv"
                className="hidden"
              />
              <div className="p-2.5 bg-rose-400 text-slate-950 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] inline-block">
                <Upload className="w-5 h-5" />
              </div>

              <div>
                <p className="text-xs font-black text-slate-950">
                  {isUploading ? 'Parsing CSV File...' : 'Drag & drop custom CSV file here'}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">Supports CSV files up to 100MB</p>
              </div>

              <button
                type="button"
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition cursor-pointer"
              >
                Browse Files
              </button>
            </div>

            {/* Target Column Selector */}
            <div className="bg-white border-2 border-slate-950 rounded-xl p-4 space-y-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-950">Target Numeric Feature Column:</span>
                <span className="text-[10px] font-mono text-slate-500 font-bold">
                  {dataset.numericColumns.length} domain features
                </span>
              </div>

              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-950 rounded-lg px-3 py-2 text-xs font-black text-slate-950 focus:ring-2 focus:ring-rose-500 outline-none font-mono"
              >
                {dataset.numericColumns.map((col) => (
                  <option key={col} value={col}>
                    {col} {dataset.columnDictionary[col] ? `(${dataset.columnDictionary[col].label} - ${dataset.columnDictionary[col].unit})` : ''}
                  </option>
                ))}
              </select>

              {/* Data Dictionary Card for Selected Feature */}
              {colMeta && (
                <div className="bg-amber-100 border-2 border-slate-950 rounded-lg p-3 space-y-1 font-mono text-[11px] text-slate-950">
                  <div className="flex items-center justify-between font-bold border-b border-slate-950 pb-1">
                    <span className="text-amber-900 uppercase">Column Specification</span>
                    <span className="bg-amber-300 px-1.5 py-0.5 rounded border border-slate-950 text-[10px]">
                      {colMeta.unit}
                    </span>
                  </div>
                  <p className="text-slate-800 font-sans text-xs">{colMeta.description}</p>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 pt-0.5">
                    <span>Expected Min: {colMeta.minVal.toLocaleString()}</span>
                    <span>Expected Max: {colMeta.maxVal.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PANEL 03: Domain Machine Learning Generator */}
        <div className="bg-amber-100 border-2 border-slate-950 rounded-2xl p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-5 flex flex-col justify-between w-full min-w-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-950 pb-3">
              <div className="flex items-center space-x-2">
                <span className="bg-slate-950 text-amber-300 w-6 h-6 rounded-full flex items-center justify-center font-mono font-black text-xs">
                  03
                </span>
                <h3 className="text-base font-black text-slate-950 uppercase font-sans">
                  SYNTHETIC DATASET GENERATION
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-300 text-slate-950 px-2 py-0.5 rounded border border-slate-950">
                Domain Machine Learning
              </span>
            </div>

            {/* Presets & Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-950 mb-1">Domain & Schema:</label>
                <select
                  value={selectedDomain}
                  onChange={(e) => {
                    const dom = e.target.value as DomainType;
                    setSelectedDomain(dom);
                    handleGenerateDomain(dom, dataset.recordsCount);
                  }}
                  className="w-full bg-white border-2 border-slate-950 rounded-lg px-2.5 py-2 text-xs font-bold text-slate-950"
                >
                  <option value="student">Student Academic Performance</option>
                  <option value="salary">Corporate Employee Salaries</option>
                  <option value="ratings">E-Commerce Customer Ratings</option>
                  <option value="ecommerce">Global E-Commerce Transactions</option>
                  <option value="financial">Financial Credit & Loan Risk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-950 mb-1">Dataset Size:</label>
                <select
                  value={dataset.recordsCount}
                  onChange={(e) => handleGenerateDomain(selectedDomain, Number(e.target.value))}
                  className="w-full bg-white border-2 border-slate-950 rounded-lg px-3 py-2 text-xs font-black text-slate-950 font-mono"
                >
                  <option value={1000}>1,000 (1K)</option>
                  <option value={10000}>10,000 (10K)</option>
                  <option value={50000}>50,000 (50K)</option>
                  <option value={100000}>100,000 (100K)</option>
                  <option value={500000}>500,000 (500K)</option>
                  <option value={1000000}>1,000,000 (1M)</option>
                </select>
              </div>
            </div>

            {/* Description Pill */}
            <div className="bg-white border-2 border-slate-950 rounded-xl p-3 text-xs text-slate-950 flex items-center gap-2 font-medium">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{dataset.description}</span>
            </div>

            {/* Sample Data Table Preview */}
            <div className="bg-white border-2 border-slate-950 rounded-xl p-3 space-y-2 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex items-center justify-between text-xs font-bold text-slate-950">
                <span className="flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5 text-amber-600" />
                  <span>{dataset.domainLabel} Preview ({dataset.recordsCount.toLocaleString()} Total)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">Showing top 5 rows</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] font-mono">
                  <thead className="bg-amber-100 border-b-2 border-slate-950 uppercase text-[10px]">
                    <tr>
                      {dataset.columns.slice(0, 6).map((col) => (
                        <th
                          key={col}
                          className={`p-1.5 ${col === selectedColumn ? 'bg-amber-300 text-slate-950 font-black border-x border-slate-950' : ''}`}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {dataset.data.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-amber-50">
                        {dataset.columns.slice(0, 6).map((col) => (
                          <td
                            key={col}
                            className={`p-1.5 ${col === selectedColumn ? 'font-bold text-blue-700 bg-amber-50 border-x border-slate-300' : ''}`}
                          >
                            {typeof row[col] === 'number' ? Number(row[col]).toLocaleString() : String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Success Banner matching Panel 03 Wireframe */}
            <div className="bg-emerald-300 border-2 border-slate-950 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-black text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-950 shrink-0" />
                <span>Dataset active: {dataset.recordsCount.toLocaleString()} records • {dataset.columns.length} domain columns</span>
              </span>
              <span className="bg-slate-950 text-amber-300 font-mono text-[10px] px-2 py-0.5 rounded uppercase shrink-0">
                Target: {selectedColumn}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Workflow Bar */}
      <div className="flex items-center justify-end pt-2">
        <button
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        >
          <span>NEXT: INPUT & SETTINGS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
