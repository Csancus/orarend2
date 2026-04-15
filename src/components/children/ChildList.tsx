import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ChildForm } from './ChildForm';
import { CsvImport } from './CsvImport';
import type { Child } from '../../types';

export function ChildList() {
  const children = useStore((s) => s.children);
  const addChild = useStore((s) => s.addChild);
  const updateChild = useStore((s) => s.updateChild);
  const deleteChild = useStore((s) => s.deleteChild);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Child | undefined>();

  const handleAdd = (name: string, group?: string, notes?: string) => {
    addChild(name, group, notes);
  };

  const handleEdit = (name: string, group?: string, notes?: string) => {
    if (editing) {
      updateChild(editing.id, { name, group, notes });
      setEditing(undefined);
    }
  };

  const handleDelete = (child: Child) => {
    if (confirm(`Biztosan törlöd "${child.name}"-t? Az összes hozzárendelt esemény is módosul.`)) {
      deleteChild(child.id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-800 m-0">Gyerekek</h2>
        <div className="flex gap-1.5">
          <CsvImport />
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            <Plus size={14} />
            Új
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {children.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">
            Adj hozzá gyerekeket vagy importálj CSV-ből
          </p>
        )}
        {children.map((child) => (
          <div
            key={child.id}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 group"
          >
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: child.color }}
            />
            <div className="flex-1 min-w-0">
              <span className="text-sm text-gray-800 truncate block">{child.name}</span>
              {child.group && (
                <span className="text-xs text-gray-400">{child.group}</span>
              )}
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => { setEditing(child); }}
                className="p-1 rounded hover:bg-gray-200"
              >
                <Pencil size={13} className="text-gray-500" />
              </button>
              <button
                onClick={() => handleDelete(child)}
                className="p-1 rounded hover:bg-red-100"
              >
                <Trash2 size={13} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ChildForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleAdd}
      />

      {editing && (
        <ChildForm
          open={true}
          onClose={() => setEditing(undefined)}
          onSave={handleEdit}
          child={editing}
        />
      )}
    </div>
  );
}
