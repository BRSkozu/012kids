'use client';

import Link from 'next/link';
import { trackPopularClick } from '@/lib/analytics';

interface PopularArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  stage: string;
}

const STAGE_LABELS: Record<string, { label: string; color: string }> = {
  '0stage': { label: '0〜2歳', color: '#FFB3B3' },
  'pre': { label: '3〜5歳', color: '#FFD9A0' },
  'early': { label: '6〜8歳', color: '#FFFAA0' },
  'mid': { label: '9〜10歳', color: '#A8E6CF' },
  'upper': { label: '11〜12歳', color: '#A0C4FF' },
};

export default function PopularArticles({ articles }: { articles: PopularArticle[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-rose-400 rounded-full" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">よく読まれている記事</h2>
            <p className="text-sm text-gray-500 mt-1">みんなが気になっている人気の記事</p>
          </div>
        </div>
        <Link
          href="/articles?sort=popular"
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          すべて見る
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article) => {
          const stageInfo = STAGE_LABELS[article.stage];
          return (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              onClick={() => trackPopularClick(article.id, stageInfo?.label)}
              className="group block rounded-xl p-5 bg-white border border-orange-100 card-hover"
            >
              {stageInfo && (
                <span
                  className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-3"
                  style={{ backgroundColor: stageInfo.color, color: '#2d2a26' }}
                >
                  {stageInfo.label}
                </span>
              )}
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{article.excerpt}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
