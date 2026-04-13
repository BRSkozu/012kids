'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import { getReadingHistory, clearReadingHistory, type ReadingHistoryEntry } from '@/lib/readingHistory';

/**
 * "最近読んだ記事" — shown only when localStorage has entries.
 * Server-rendered nothing; hydrates on the client to avoid flash on first visit.
 */
export default function RecentlyViewed() {
  const [entries, setEntries] = useState<ReadingHistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage after mount (SSR can't access it).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(getReadingHistory().slice(0, 6));
  }, []);

  const handleClear = () => {
    clearReadingHistory();
    setEntries([]);
  };

  if (!mounted || entries.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <SectionHeader
        accentColor="bg-purple-400"
        kicker="Recently viewed"
        title="最近読んだ記事"
        description="あなたがこの端末で読んだ記事の履歴です（端末内にのみ保存）"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {entries.map((entry) => {
          const d = new Date(entry.viewedAt);
          const rel = formatRelative(d);
          return (
            <Link
              key={entry.slug}
              href={`/articles/${entry.slug}`}
              className="group flex items-center gap-3 p-3 rounded-xl bg-white border border-purple-100 card-hover"
            >
              <span className="shrink-0 w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 leading-snug">
                  {entry.title}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{rel}</p>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-4 text-right">
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-gray-400 hover:text-[var(--color-primary)] transition-colors underline"
        >
          履歴をクリア
        </button>
      </div>
    </section>
  );
}

function formatRelative(d: Date): string {
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'たった今';
  if (mins < 60) return `${mins}分前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}日前`;
  return d.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
}
