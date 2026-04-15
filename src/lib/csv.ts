import Papa from 'papaparse';

export interface CsvRow {
  name: string;
  group?: string;
  notes?: string;
}

export function parseCsv(file: File): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const rows: CsvRow[] = results.data
          .filter((row) => row.name?.trim())
          .map((row) => ({
            name: row.name.trim(),
            group: row.group?.trim() || undefined,
            notes: row.notes?.trim() || undefined,
          }));
        resolve(rows);
      },
      error(err) {
        reject(err);
      },
    });
  });
}
