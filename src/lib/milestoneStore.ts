/**
 * Milestone check-off state — localStorage per child id.
 * Stored as a map: { [childId]: { [milestoneId]: achievedAt (ISO string) } }
 */

const STORAGE_KEY = '012kids_milestones_v1';

export type MilestoneState = Record<string, Record<string, string>>;

export function getAllMilestoneState(): MilestoneState {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MilestoneState) : {};
  } catch {
    return {};
  }
}

export function getMilestoneState(childId: string): Record<string, string> {
  return getAllMilestoneState()[childId] ?? {};
}

export function toggleMilestone(childId: string, milestoneId: string): boolean {
  if (typeof window === 'undefined') return false;
  const all = getAllMilestoneState();
  const current = all[childId] ?? {};
  const achieved = Boolean(current[milestoneId]);
  if (achieved) {
    delete current[milestoneId];
  } else {
    current[milestoneId] = new Date().toISOString();
  }
  all[childId] = current;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent('012kids:milestones-updated'));
  } catch {
    /* ignore */
  }
  return !achieved;
}

export function resetChildMilestones(childId: string): void {
  if (typeof window === 'undefined') return;
  const all = getAllMilestoneState();
  delete all[childId];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent('012kids:milestones-updated'));
  } catch {
    /* ignore */
  }
}
