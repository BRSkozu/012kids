'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ArticleCard from '@/components/articles/ArticleCard';
import WorrySearch from '@/components/search/WorrySearch';
import { AGE_STAGES } from '@/data/stages';
import { CATEGORIES } from '@/data/categories';
import { ARTICLES } from '@/data/articles';
import { AgeStage, ContentCategory } from '@/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialTab = searchParams.get('tab') === 'worry' ? 'worry' : 'keyword';
  const [query, setQuery] = useState(initialQuery);
  const [selectedStage, setSelectedStage] = useState<AgeStage | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | 'all'>('all');
  const [tab, setTab] = useState<'keyword' | 'worry'>(initialTab);

  const results = useMemo(() => {
    if (!query.trim() && selectedStage === 'all' && selectedCategory === 'all') {
      return [];
    }

    let filtered = [...ARTICLES];

    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.categories.some((c) => c.toLowerCase().includes(q))
      );
    }

    if (selectedStage !== 'all') {
      filtered = filtered.filter((a) => a.stage === selectedStage);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((a) =>
        a.categories.includes(selectedCategory as ContentCategory)
      );
    }

    return filtered;
  }, [query, selectedStage, selectedCategory]);

  const showResults = query.trim() || selectedStage !== 'all' || selectedCategory !== 'all';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">記事を検索</h1>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('keyword')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'keyword'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-orange-50 text-gray-600 hover:bg-orange-100'
          }`}
        >
          キーワードで検索
        </button>
        <button
          onClick={() => setTab('worry')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'worry'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-orange-50 text-gray-600 hover:bg-orange-100'
          }`}
        >
          お悩みから探す
        </button>
      </div>

      {tab === 'worry' ? (
        <WorrySearch />
      ) : (
        <>
          {/* Search Input */}
          <div className="relative mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="キーワードで検索（例：離乳食、発達、習い事）"
              className="w-full px-5 py-4 rounded-xl border border-orange-200 text-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
              autoFocus
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">年齢帯</label>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedStage('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedStage === 'all'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-orange-50 text-gray-600 hover:bg-orange-100'
                  }`}
                >
                  全年齢
                </button>
                {AGE_STAGES.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedStage(stage.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedStage === stage.id
                        ? 'ring-2 ring-[var(--color-primary)]'
                        : ''
                    }`}
                    style={{ backgroundColor: `${stage.color}${selectedStage === stage.id ? '' : '66'}` }}
                  >
                    {stage.ageRange}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">カテゴリ</label>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-orange-50 text-gray-600 hover:bg-orange-100'
                  }`}
                >
                  全カテゴリ
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-orange-50 text-gray-600 hover:bg-orange-100'
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          {showResults ? (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {results.length}件の記事が見つかりました
              </p>
              {results.length === 0 ? (
                <div className="text-center py-16 bg-orange-50 rounded-xl">
                  <p className="text-gray-500 text-lg mb-2">
                    該当する記事が見つかりませんでした
                  </p>
                  <p className="text-sm text-gray-400">
                    別のキーワードで検索するか、フィルタを変更してみてください
                  </p>
                  <button
                    onClick={() => setTab('worry')}
                    className="mt-4 text-sm text-[var(--color-primary)] hover:underline"
                  >
                    「お悩みから探す」も試してみる →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="compact" />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">キーワードを入力して検索してください</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['離乳食', '発達', '習い事', 'プログラミング', 'いじめ', 'アレルギー', '受験'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 bg-orange-50 text-gray-600 rounded-full text-sm hover:bg-orange-100 transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
              <div className="mt-6 pt-6 border-t border-orange-100">
                <button
                  onClick={() => setTab('worry')}
                  className="text-sm text-[var(--color-primary)] hover:underline"
                >
                  お悩みから記事を探すこともできます →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-8">読み込み中...</div>}>
      <SearchContent />
    </Suspense>
  );
}
