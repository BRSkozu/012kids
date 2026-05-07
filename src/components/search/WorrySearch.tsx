'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
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

  const bp = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const FEATURE_CLUSTERS = [
    { label: '学童・放課後', query: '学童', image: `${bp}/photos/worry-gakudo.webp` },
    { label: '小1の壁', query: '小1', image: `${bp}/photos/worry-sho1wall.webp` },
    { label: '保育園', query: '保育園', image: `${bp}/photos/worry-sleep.webp` },
    { label: '幼稚園', query: '幼稚園', image: `${bp}/photos/worry-friends.webp` },
    { label: '受験', query: '受験', image: `${bp}/photos/worry-language.webp` },
    { label: '塾選び', query: '塾', image: `${bp}/photos/worry-screen.webp` },
    { label: '習い事', query: '習い事', image: `${bp}/photos/worry-development.webp` },
  ];

  return (
    <div>
      {/* Feature clusters */}
      <div className="mb-8">
        <p
          className="text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--color-primary-dark)] mb-3 inline-flex items-center gap-2"
          style={{ fontFamily: 'var(--font-gothic)' }}
        >
          <span className="inline-block w-5 h-px bg-[var(--color-primary)]" />
          Topics
        </p>
        <h3
          className="text-lg text-[var(--color-foreground)] mb-4"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
        >
          特集テーマから探す
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {FEATURE_CLUSTERS.map((cluster) => (
            <button
              key={cluster.label}
              onClick={() => setQuery(query === cluster.query ? '' : cluster.query)}
              className={`group flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                query === cluster.query
                  ? 'bg-[var(--color-primary)]/10 border-2 border-[var(--color-primary)] shadow-sm'
                  : 'bg-[var(--color-surface)] border border-[var(--color-paper-edge)] hover:border-[var(--color-primary-light)] hover:shadow-sm'
              }`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-[0_4px_10px_-6px_rgba(31,36,57,0.25)]">
                <Image
                  src={cluster.image}
                  alt={cluster.label}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className={`text-xs text-center leading-tight ${
                  query === cluster.query ? 'text-[var(--color-primary-dark)]' : 'text-[var(--color-foreground)]'
                }`}
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
              >
                {cluster.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search input */}
      <div className="relative mb-4">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="お悩みを入力してみてください（例：夜泣き、離乳食、いじめ）"
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--color-paper-edge)] bg-[var(--color-surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
        />
      </div>

      {/* Stage filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedStage(null)}
          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
            selectedStage === null
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-warm-cream)] text-[var(--color-foreground-soft)] border border-[var(--color-paper-edge)] hover:bg-[var(--color-surface)]'
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
            className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-paper-edge)] p-4 hover:shadow-[0_8px_22px_-14px_rgba(31,36,57,0.25)] hover:border-[var(--color-primary-light)] transition-all"
          >
            <p
              className="text-[var(--color-foreground)] text-sm mb-2"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
            >
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
                    className="flex items-center gap-2 text-sm text-[var(--color-primary-dark)] hover:underline"
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
          <div className="text-center py-8 text-[var(--color-foreground-muted)] text-sm">
            <p>該当するお悩みが見つかりませんでした。</p>
            <p className="mt-1">別のキーワードで検索してみてください。</p>
          </div>
        )}
      </div>
    </div>
  );
}
