'use client';

import { useState } from 'react';
import Link from 'next/link';
import { WORRIES } from '@/data/worries';
import { ARTICLES } from '@/data/articles';

export default function WorrySearchCompact() {
  const [hoveredWorry, setHoveredWorry] = useState<string | null>(null);

  // Show a curated selection of worries for the homepage
  const popularWorries = WORRIES.slice(0, 8);

  const getArticleSlug = (id: string) => {
    return ARTICLES.find((a) => a.id === id)?.slug ?? '';
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {popularWorries.map((worry) => {
          const firstSlug = getArticleSlug(worry.relatedArticleIds[0]);
          return (
            <Link
              key={worry.id}
              href={firstSlug ? `/articles/${firstSlug}` : '/search?tab=worry'}
              className="relative group"
              onMouseEnter={() => setHoveredWorry(worry.id)}
              onMouseLeave={() => setHoveredWorry(null)}
            >
              <span className="inline-block px-4 py-2 bg-white border border-orange-100 rounded-full text-sm text-gray-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
                {worry.text}
              </span>
              {hoveredWorry === worry.id && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </Link>
          );
        })}
      </div>
      <div className="mt-4 text-center">
        <Link
          href="/search?tab=worry"
          className="text-sm text-[var(--color-primary)] hover:underline"
        >
          もっとお悩みから探す →
        </Link>
      </div>
    </div>
  );
}
