'use client';

import { useState, useMemo } from 'react';
import ArticleCard from '@/components/articles/ArticleCard';
import { AGE_STAGES } from '@/data/stages';
import { CATEGORIES } from '@/data/categories';
import { AgeStage, ContentCategory, ArticleMeta } from '@/types';

interface Props {
  articles: ArticleMeta[];
}

export default function ArticlesPageClient({ articles }: Props) {
  const [selectedStage, setSelectedStage] = useState<AgeStage | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'score'>('newest');

  const filteredArticles = useMemo(() => {
    let result = [...articles];

    if (selectedStage !== 'all') {
      result = result.filter((a) => a.stage === selectedStage);
    }

    if (selectedCategory !== 'all') {
      result = result.filter((a) => a.categories.includes(selectedCategory as ContentCategory));
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
      case 'score':
        result.sort((a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0));
        break;
      case 'popular':
        result.sort((a, b) => b.readingTime - a.readingTime);
        break;
    }

    return result;
  }, [articles, selectedStage, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">記事一覧</h1>
      <p className="text-gray-500 mb-8">
        {filteredArticles.length}件の記事が見つかりました
      </p>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-8 space-y-4">
        {/* Age Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">年齢帯</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStage('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStage === 'all'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              すべて
            </button>
            {AGE_STAGES.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedStage === stage.id
                    ? 'ring-2 ring-offset-1 ring-gray-400 scale-105'
                    : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: selectedStage === stage.id ? stage.color : `${stage.color}66`,
                }}
              >
                {stage.ageRange}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">カテゴリ</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              すべて
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">並び替え</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
          >
            <option value="newest">新着順</option>
            <option value="score">信頼度順</option>
            <option value="popular">人気順</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">条件に一致する記事が見つかりませんでした</p>
          <button
            onClick={() => {
              setSelectedStage('all');
              setSelectedCategory('all');
            }}
            className="mt-4 text-[var(--color-primary)] hover:underline text-sm"
          >
            フィルタをリセット
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
