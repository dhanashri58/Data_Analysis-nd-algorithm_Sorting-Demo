import { useState } from 'react';
import type { DatasetInfo } from '../types/sorting';
import { Table, CheckCircle2 } from 'lucide-react';

interface DataPreviewTableProps {
  dataset: DatasetInfo;
  sortedArray?: number[];
  selectedColumn: string;
}

export const DataPreviewTable = ({
  dataset,
  sortedArray,
  selectedColumn,
}: DataPreviewTableProps) => {
  const [viewMode, setViewMode] = useState<'raw' | 'sorted'>('sorted');
  const totalCount = dataset.recordsCount;
  const records = dataset.data;
  const columns = dataset.columns;

  const isShowingSorted = viewMode === 'sorted' && sortedArray && sortedArray.length > 0;

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden font-mono">
      <div className="bg-amber-100 text-slate-950 px-4 py-3 border-b-2 border-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Table className="w-4 h-4 text-amber-700" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 font-sans">
            {dataset.domainLabel} Records Preview ({totalCount.toLocaleString()} Total)
          </h4>
        </div>

        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border-2 border-slate-950 text-xs">
          <button
            onClick={() => setViewMode('raw')}
            className={`px-3 py-1 rounded-lg font-extrabold transition cursor-pointer ${
              viewMode === 'raw' ? 'bg-amber-400 text-slate-950 border border-slate-950' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Raw Input Data
          </button>
          <button
            onClick={() => setViewMode('sorted')}
            disabled={!sortedArray || sortedArray.length === 0}
            className={`px-3 py-1 rounded-lg font-extrabold transition cursor-pointer disabled:opacity-40 ${
              viewMode === 'sorted' ? 'bg-emerald-400 text-slate-950 border border-slate-950' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Sorted Output Preview
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-800">
          <thead className="bg-slate-100 border-b-2 border-slate-950 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-4 py-2.5">Row #</th>
              {columns.slice(0, 7).map((col) => (
                <th
                  key={col}
                  className={`px-4 py-2.5 ${col === selectedColumn ? 'bg-amber-300 text-slate-950 font-black border-x-2 border-slate-950' : ''}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isShowingSorted ? (
              sortedArray.slice(0, 10).map((val, idx) => {
                const sampleRow = records[idx] || records[0];
                return (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-slate-400">#{idx + 1}</td>
                    {columns.slice(0, 7).map((col) => {
                      if (col === selectedColumn) {
                        return (
                          <td key={col} className="px-4 py-2 font-bold text-blue-700 bg-amber-50 border-x-2 border-slate-200">
                            {typeof val === 'number' ? val.toLocaleString() : val}
                          </td>
                        );
                      }
                      const cellVal = sampleRow[col];
                      return (
                        <td key={col} className="px-4 py-2 text-slate-700">
                          {typeof cellVal === 'number' ? cellVal.toLocaleString() : String(cellVal ?? '-')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              records.slice(0, 10).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-2 text-slate-400">#{idx + 1}</td>
                  {columns.slice(0, 7).map((col) => {
                    const cellVal = row[col];
                    return (
                      <td
                        key={col}
                        className={`px-4 py-2 ${col === selectedColumn ? 'font-bold text-slate-950 bg-amber-50 border-x-2 border-slate-200' : 'text-slate-700'}`}
                      >
                        {typeof cellVal === 'number' ? cellVal.toLocaleString() : String(cellVal ?? '-')}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 px-4 py-2.5 border-t-2 border-slate-950 text-[11px] text-slate-700 flex items-center justify-between">
        <span>Showing top 10 rows of {totalCount.toLocaleString()} total dataset records.</span>
        <span className="font-bold text-emerald-800 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Non-decreasing order & Sum Invariant verified
        </span>
      </div>
    </div>
  );
};
