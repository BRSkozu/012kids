'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { WORRIES, searchWorries } from '@/data/worries';
import { ARTICLES } from '@/data/articles';

export default function WorrySearch() {
  const [query, setQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const stages = [
    { id: '0stage', label: '0〜2歳', color: '#FFB3B3' },
    { id: 'pre', label: '3〜5歳', color: '#FFD9A0' },
    { id: 'early', label: '6〜8歳', color: '#FFFAA0' },
    { id: 'mid', label: '9〜10歳', color: '#A8E6CF' },
    { id: 'upper', label: '11〜12歳', color: '#A0C4FF' },
  ];

  const filteredWorries = useMemo(() => {
    let results = query ? searchWorries(query) : WORRIES;
    if (selectedStage) {
      results = results.filter((w) => w.stage.includes(selectedStage));
    }
    return results;
  }, [query, selectedStage]);

  const getArticleTitle = (id: string) => {
    return ARTICLES.find((a) => a.id === id)?.title ?? '';
  };

  const getArticleSlug = (id: string) => {
    return ARTICLES.find((a) => a.id === id)?.slug ?? '';
  };

  return (
    <div>
      {/* Search input */}
      <div className="relative mb-4">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="お悩みを入力してみてください（例：夜泣き、離乳食、いじめ）"
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-orange-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
        />
      </div>

      {/* Stage filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedStage(null)}
          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
            selectedStage === null
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-orange-50 text-gray-600 hover:bg-orange-100'
          }`}
        >
          すべて
        </button>
        {stages.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedStage(selectedStage === s.id ? null : s.id)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              selectedStage === s.id
                ? 'ring-2 ring-offset-1 ring-[var(--color-primary)]'
                : 'hover:opacity-80'
            }`}
            style={{ backgroundColor: s.color, color: '#2d2a26' }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Worry list */}
      <div className="space-y-3">
        {filteredWorries.map((worry) => (
          <div
            key={worry.id}
            className="bg-white rounded-xl border border-orange-100 p-4 hover:shadow-sm transition-shadow"
          >
            <p className="font-medium text-gray-900 text-sm mb-2">
              「{worry.text}」
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {worry.stage.map((s) => {
                const stageInfo = stages.find((st) => st.id === s);
                return (
                  <span
                    key={s}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: stageInfo?.color ?? '#eee', color: '#2d2a26' }}
                  >
                    {stageInfo?.label}
                  </span>
                );
              })}
            </div>
            <div className="space-y-1.5">
              {worry.relatedArticleIds.map((articleId) => {
                const slug = getArticleSlug(articleId);
                const title = getArticleTitle(articleId);
                if (!slug) return null;
                return (
                  <Link
                    key={articleId}
                    href={`/articles/${slug}`}
                    className="flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="line-clamp-1">{title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {filteredWorries.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            <p>該当するお悩みが見つかりませんでした。</p>
            <p className="mt-1">別のキーワードで検索してみてください。</p>
          </div>
        )}
      </div>
    </div>
  );
}
