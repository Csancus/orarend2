import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Child, ScheduleEvent } from '../types';
import { getNextColor } from '../lib/colors';

interface StoreState {
  children: Child[];
  events: ScheduleEvent[];
  addChild: (name: string, group?: string, notes?: string) => void;
  updateChild: (id: string, updates: Partial<Omit<Child, 'id'>>) => void;
  deleteChild: (id: string) => void;
  importChildren: (rows: { name: string; group?: string; notes?: string }[]) => void;
  addEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<Omit<ScheduleEvent, 'id'>>) => void;
  deleteEvent: (id: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      children: [],
      events: [],

      addChild: (name, group, notes) => {
        const usedColors = get().children.map((c) => c.color);
        const child: Child = {
          id: crypto.randomUUID(),
          name,
          group,
          notes,
          color: getNextColor(usedColors),
        };
        set((s) => ({ children: [...s.children, child] }));
      },

      updateChild: (id, updates) => {
        set((s) => ({
          children: s.children.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      deleteChild: (id) => {
        set((s) => ({
          children: s.children.filter((c) => c.id !== id),
          events: s.events.map((e) => ({
            ...e,
            childIds: e.childIds.filter((cid) => cid !== id),
          })).filter((e) => e.childIds.length > 0),
        }));
      },

      importChildren: (rows) => {
        const currentColors = get().children.map((c) => c.color);
        const newChildren: Child[] = rows.map((row, i) => ({
          id: crypto.randomUUID(),
          name: row.name,
          group: row.group,
          notes: row.notes,
          color: getNextColor([...currentColors, ...rows.slice(0, i).map((_, j) => getNextColor([...currentColors, ...Array(j).fill('')]))]),
        }));
        // Simpler color assignment
        const allUsed = [...currentColors];
        for (const child of newChildren) {
          child.color = getNextColor(allUsed);
          allUsed.push(child.color);
        }
        set((s) => ({ children: [...s.children, ...newChildren] }));
      },

      addEvent: (event) => {
        set((s) => ({
          events: [...s.events, { ...event, id: crypto.randomUUID() }],
        }));
      },

      updateEvent: (id, updates) => {
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }));
      },

      deleteEvent: (id) => {
        set((s) => ({ events: s.events.filter((e) => e.id !== id) }));
      },
    }),
    { name: 'orarend-store' }
  )
);
