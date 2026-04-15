import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { Child } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, group?: string, notes?: string) => void;
  child?: Child;
}

export function ChildForm({ open, onClose, onSave, child }: Props) {
  const [name, setName] = useState(child?.name ?? '');
  const [group, setGroup] = useState(child?.group ?? '');
  const [notes, setNotes] = useState(child?.notes ?? '');

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), group.trim() || undefined, notes.trim() || undefined);
    setName('');
    setGroup('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold m-0">
              {child ? 'Gyerek szerkesztése' : 'Új gyerek'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 rounded hover:bg-gray-100">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Név *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Gyerek neve"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Csoport</label>
              <input
                type="text"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="pl. 1. osztály"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Megjegyzés</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Opcionális megjegyzés"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Mégse
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mentés
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
