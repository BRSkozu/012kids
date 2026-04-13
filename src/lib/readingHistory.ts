/**
 * Reading history — lightweight localStorage-backed tracker.
 * No user accounts required, no external analytics. Each device keeps its own log
 * in `012kids_reading_history` (JSON array of { slug, title, viewedAt }, capped at 20).
 */

export interface ReadingHistoryEntry {
  slug: string;
  title: string;
  viewedAt: number;
}

const STORAGE_KEY = '012kids_reading_history';
const MAX_ENTRIES = 20;

export function recordArticleView(slug: string, title: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const current: ReadingHistoryEntry[] = raw ? JSON.parse(raw) : [];
    const filtered = current.filter((e) => e.slug !== slug);
    filtered.unshift({ slug, title, viewedAt: Date.now() });
    const trimmed = filtered.slice(0, MAX_ENTRIES);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage blocked / full — silently ignore; history is best-effort.
  }
}

export function getReadingHistory(): ReadingHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: ReadingHistoryEntry[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearReadingHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
