import Papa from 'papaparse';
import type { DatasetInfo, MLRecord, ColumnMeta } from '../types/sorting';

export function parseCSVFile(file: File): Promise<DatasetInfo> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        try {
          if (!results.data || results.data.length === 0) {
            return reject(new Error('Uploaded CSV file is empty.'));
          }

          const rawRows = results.data as Record<string, any>[];
          const columns = results.meta.fields || Object.keys(rawRows[0] || {});

          if (columns.length === 0) {
            return reject(new Error('No valid columns found in CSV file.'));
          }

          const numericColumns: string[] = [];
          const columnDictionary: Record<string, ColumnMeta> = {};

          columns.forEach((col) => {
            let isNumeric = true;
            let sampleCount = 0;
            let minVal = Infinity;
            let maxVal = -Infinity;

            for (let i = 0; i < Math.min(rawRows.length, 100); i++) {
              const val = rawRows[i][col];
              if (val !== null && val !== undefined && val !== '') {
                sampleCount++;
                const num = Number(val);
                if (isNaN(num)) {
                  isNumeric = false;
                  break;
                } else {
                  if (num < minVal) minVal = num;
                  if (num > maxVal) maxVal = num;
                }
              }
            }

            if (isNumeric && sampleCount > 0) {
              numericColumns.push(col);
              columnDictionary[col] = {
                colName: col,
                label: col,
                description: `Custom uploaded numeric feature column: ${col}`,
                unit: 'val',
                minVal: isFinite(minVal) ? minVal : 0,
                maxVal: isFinite(maxVal) ? maxVal : 100,
              };
            }
          });

          if (numericColumns.length === 0) {
            return reject(new Error('No numeric columns detected in CSV. Quick Sort and Merge Sort require a numeric column.'));
          }

          const data: MLRecord[] = rawRows.map((row, idx) => {
            const rec: MLRecord = {
              id: idx + 1,
            };

            columns.forEach((col) => {
              const val = row[col];
              if (typeof val === 'number') {
                rec[col] = val;
              } else if (val !== null && val !== undefined) {
                const parsed = Number(val);
                rec[col] = isNaN(parsed) ? String(val) : parsed;
              }
            });

            return rec;
          });

          const defaultCol = numericColumns.find((c) => c.toLowerCase() !== 'id') || numericColumns[0];

          resolve({
            name: file.name,
            domain: 'custom',
            domainLabel: 'Custom Uploaded CSV Dataset',
            description: `User uploaded CSV dataset containing ${data.length.toLocaleString()} records and ${columns.length} features.`,
            recordsCount: data.length,
            columns,
            numericColumns,
            selectedColumn: defaultCol,
            columnDictionary,
            data,
            isCustomCSV: true,
          });
        } catch (err: any) {
          reject(new Error(err?.message || 'Failed to parse CSV file.'));
        }
      },
      error: (err) => {
        reject(new Error(err.message || 'PapaParse failed to read file.'));
      },
    });
  });
}
