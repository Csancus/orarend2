import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { parseCsv } from '../../lib/csv';
import { useStore } from '../../store/useStore';

export function CsvImport() {
  const inputRef = useRef<HTMLInputElement>(null);
  const importChildren = useStore((s) => s.importChildren);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const rows = await parseCsv(file);
      if (rows.length === 0) {
        alert('Nem található gyerek a CSV fájlban. Ellenőrizd, hogy van "name" oszlop.');
        return;
      }
      importChildren(rows);
      alert(`${rows.length} gyerek importálva!`);
    } catch {
      alert('Hiba a CSV fájl olvasásakor.');
    }

    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFile}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-600"
      >
        <Upload size={14} />
        CSV import
      </button>
    </>
  );
}
