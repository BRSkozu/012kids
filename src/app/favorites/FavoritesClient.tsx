'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ArticleCard from '@/components/articles/ArticleCard';
import { getFavorites, clearFavorites } from '@/lib/userProfile';
import type { ArticleMeta } from '@/types';

interface Props {
  articles: ArticleMeta[];
}

export default function FavoritesClient({ articles }: Props) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setSlugs(getFavorites());
    const onChange = () => setSlugs(getFavorites());
    window.addEventListener('012kids:favorites-updated', onChange);
    return () => window.removeEventListener('012kids:favorites-updated', onChange);
  }, []);

  if (!mounted) {
    return <div className="h-32 rounded-xl bg-orange-50/40 animate-pulse-soft" />;
  }

  const saved = slugs
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter(Boolean) as ArticleMeta[];

  if (saved.length === 0) {
    return (
      <div className="text-center py-16 bg-orange-50/40 rounded-2xl">
        <div className="text-5xl mb-3">♡</div>
        <p className="text-gray-500 mb-2">お気に入りに追加した記事はまだありません</p>
        <p className="text-xs text-gray-400 mb-6">
          記事カードのハートマーク ♡ をタップすると、ここに保存されます
        </p>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          記事を探しに行く
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{saved.length}件の記事を保存中</p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('お気に入りの記事をすべてクリアしますか？')) {
              clearFavorites();
              setSlugs([]);
            }
          }}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors underline"
        >
          すべてクリア
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {saved.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </>
  );
}
