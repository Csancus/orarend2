import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { ScheduleEvent } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  startDate?: string;
  endDate?: string;
  event?: ScheduleEvent;
}

export function EventDialog({ open, onClose, startDate, endDate, event }: Props) {
  const children = useStore((s) => s.children);
  const addEvent = useStore((s) => s.addEvent);
  const updateEvent = useStore((s) => s.updateEvent);
  const deleteEvent = useStore((s) => s.deleteEvent);

  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (event) {
      setSelectedChildIds(event.childIds);
      setStart(toLocalDatetime(event.start));
      setEnd(toLocalDatetime(event.end));
      setNotes(event.notes ?? '');
    } else {
      setSelectedChildIds([]);
      setStart(startDate ? toLocalDatetime(startDate) : '');
      setEnd(endDate ? toLocalDatetime(endDate) : '');
      setNotes('');
    }
  }, [event, startDate, endDate]);

  const toggleChild = (id: string) => {
    setSelectedChildIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const buildTitle = () => {
    return selectedChildIds
      .map((id) => children.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const handleSave = () => {
    if (selectedChildIds.length === 0 || !start || !end) return;
    const data = {
      childIds: selectedChildIds,
      title: buildTitle(),
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      notes: notes.trim() || undefined,
    };
    if (event) {
      updateEvent(event.id, data);
    } else {
      addEvent(data);
    }
    onClose();
  };

  const handleDelete = () => {
    if (event && confirm('Biztosan törlöd ezt az eseményt?')) {
      deleteEvent(event.id);
      onClose();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold m-0">
              {event ? 'Esemény szerkesztése' : 'Új esemény'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 rounded hover:bg-gray-100">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kezdés</label>
                <input
                  type="datetime-local"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Befejezés</label>
                <input
                  type="datetime-local"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gyerekek kiválasztása *
              </label>
              {children.length === 0 ? (
                <p className="text-xs text-gray-400">
                  Először adj hozzá gyerekeket az oldalsávban.
                </p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-1 border border-gray-200 rounded-lg p-2">
                  {children.map((child) => (
                    <label
                      key={child.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedChildIds.includes(child.id)}
                        onChange={() => toggleChild(child.id)}
                        className="rounded"
                      />
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: child.color }}
                      />
                      <span className="text-sm">{child.name}</span>
                      {child.group && (
                        <span className="text-xs text-gray-400">({child.group})</span>
                      )}
                    </label>
                  ))}
                </div>
              )}
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

          <div className="flex justify-between mt-5">
            <div>
              {event && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={15} />
                  Törlés
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Mégse
              </button>
              <button
                onClick={handleSave}
                disabled={selectedChildIds.length === 0 || !start || !end}
                className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mentés
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function toLocalDatetime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) {
    // If it's already a local format like "2024-01-15", handle it
    if (iso.length === 10) return iso + 'T09:00';
    return iso;
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
