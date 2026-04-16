/**
 * User profile & favorites — localStorage-backed, no server required.
 *
 * Static-site friendly personalization:
 *  - Child profiles (nickname + age) → used to rank & highlight articles.
 *  - Favorite articles → star/save for later.
 *  - Interested categories → sharpen recommendations.
 *
 * Everything lives in localStorage under a single versioned key so we can
 * migrate the schema cleanly later.
 */

import type { AgeStage, ContentCategory } from '@/types';

const STORAGE_KEY = '012kids_profile_v1';
const FAVORITES_KEY = '012kids_favorites_v1';

export interface ChildEntry {
  id: string;
  nickname: string;
  /** Birth year — month optional for privacy */
  birthYear: number;
  birthMonth?: number;
}

export interface UserProfile {
  /** Optional display name for the parent */
  displayName?: string;
  children: ChildEntry[];
  interests: ContentCategory[];
  /** ISO timestamp */
  createdAt: string;
  updatedAt: string;
}

function emptyProfile(): UserProfile {
  const now = new Date().toISOString();
  return { children: [], interests: [], createdAt: now, updatedAt: now };
}

export function getUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    if (!parsed.children) parsed.children = [];
    if (!parsed.interests) parsed.interests = [];
    return parsed;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    const toSave: UserProfile = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    // Fan out to age selector store for backwards compatibility
    if (profile.children.length > 0) {
      const age = computeAgeYears(profile.children[0]);
      if (age !== null) {
        window.localStorage.setItem('012kids_age', String(age));
      }
    }
    window.dispatchEvent(new CustomEvent('012kids:profile-updated'));
  } catch {
    /* ignore */
  }
}

export function clearUserProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('012kids:profile-updated'));
  } catch {
    /* ignore */
  }
}

export function computeAgeYears(child: ChildEntry, now: Date = new Date()): number | null {
  if (!child.birthYear) return null;
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  let age = currentYear - child.birthYear;
  if (child.birthMonth && currentMonth < child.birthMonth) age -= 1;
  if (age < 0) return null;
  return Math.min(age, 12);
}

export function stageForChild(child: ChildEntry): AgeStage | null {
  const age = computeAgeYears(child);
  if (age === null) return null;
  if (age <= 2) return '0stage';
  if (age <= 5) return 'pre';
  if (age <= 8) return 'early';
  if (age <= 10) return 'mid';
  return 'upper';
}

/** Create a new child entry with a generated id */
export function newChild(partial: Omit<ChildEntry, 'id'>): ChildEntry {
  return { id: Math.random().toString(36).slice(2, 10), ...partial };
}

export function createOrUpdateProfile(patch: Partial<UserProfile>): UserProfile {
  const existing = getUserProfile() ?? emptyProfile();
  const merged: UserProfile = {
    ...existing,
    ...patch,
    children: patch.children ?? existing.children,
    interests: patch.interests ?? existing.interests,
  };
  saveUserProfile(merged);
  return merged;
}

// ---------- Favorites ----------

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug);
}

export function toggleFavorite(slug: string): boolean {
  if (typeof window === 'undefined') return false;
  const current = getFavorites();
  const next = current.includes(slug)
    ? current.filter((s) => s !== slug)
    : [slug, ...current];
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('012kids:favorites-updated'));
  } catch {
    return current.includes(slug);
  }
  return next.includes(slug);
}

export function clearFavorites(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(FAVORITES_KEY);
    window.dispatchEvent(new CustomEvent('012kids:favorites-updated'));
  } catch {
    /* ignore */
  }
}
