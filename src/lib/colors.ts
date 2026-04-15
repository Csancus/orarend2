export const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#14b8a6',
  '#e11d48', '#84cc16', '#a855f7', '#0ea5e9', '#d946ef',
];

export function getNextColor(usedColors: string[]): string {
  const available = COLORS.filter((c) => !usedColors.includes(c));
  if (available.length > 0) return available[0];
  return COLORS[usedColors.length % COLORS.length];
}
