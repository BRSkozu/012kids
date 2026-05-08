'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ARTICLES } from '@/data/articles';
import { CATEGORIES } from '@/data/categories';
import ArticleCard from '@/components/articles/ArticleCard';

interface Props {
  onPickTag: (tag: string) => void;
  onSwitchToWorry: () => void;
}

export default function SearchEmptyState({ onPickTag, onSwitchToWorry }: Props) {
  const popularArticles = useMemo(
    () =>
      [...ARTICLES]
        .sort((a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0))
        .slice(0, 6),
    []
  );

  const popularTags = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of ARTICLES) {
      for (const t of a.tags ?? []) counts[t] = (counts[t] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 16)
      .map(([tag]) => tag);
  }, []);

  return (
    <div className="space-y-10 py-2">
      {/* Popular tags */}
      <section>
        <h2
          className="text-base text-[var(--color-foreground)] mb-3"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
        >
          よく検索されるキーワード
        </h2>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onPickTag(tag)}
              className="px-3 py-1.5 bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] text-[var(--color-foreground-soft)] rounded-full text-sm hover:bg-[var(--color-surface)] hover:border-[var(--color-primary-light)] transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </section>

      {/* Popular articles */}
      <section>
        <h2
          className="text-base text-[var(--color-foreground)] mb-3"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
        >
          人気の記事
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {popularArticles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2
          className="text-base text-[var(--color-foreground)] mb-3"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
        >
          カテゴリから探す
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-paper-edge)] bg-[var(--color-surface)] text-sm text-[var(--color-foreground-soft)] hover:bg-[var(--color-warm-cream)] hover:border-[var(--color-primary-light)] transition-colors"
            >
              <span aria-hidden="true">{cat.icon}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Switch to worry */}
      <section className="pt-6 border-t border-[var(--color-paper-edge)] text-center">
        <p className="text-sm text-[var(--color-foreground-muted)] mb-2">
          具体的な悩みから記事を探すこともできます
        </p>
        <button
          onClick={onSwitchToWorry}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          お悩みから探す
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>
    </div>
  );
}
