import Link from 'next/link';
import { Article, ArticleMeta } from '@/types';
import StageBadge from '@/components/ui/StageBadge';

import CategoryTag from '@/components/ui/CategoryTag';
import { getCategoryIllustration } from '@/components/illustrations/CategoryIllustrations';

interface ArticleCardProps {
  article: Article | ArticleMeta;
  variant?: 'default' | 'featured' | 'compact' | 'list';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const Illustration = getCategoryIllustration(article.categories[0]);

  if (variant === 'list') {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group flex items-center gap-4 p-3 rounded-lg hover:bg-orange-50/60 transition-colors border-b border-gray-100 last:border-b-0"
      >
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
            {article.title}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{article.excerpt}</p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <StageBadge stage={article.stage} size="sm" />
          {article.categories.slice(0, 1).map((cat) => (
            <CategoryTag key={cat} category={cat} />
          ))}
          <span className="text-xs text-gray-400 whitespace-nowrap">{article.readingTime}分</span>
        </div>
        <span className="shrink-0 text-gray-400 group-hover:text-[var(--color-primary)] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="flex gap-4 p-4 rounded-xl hover:bg-orange-50/50 transition-colors group"
      >
        <div className="w-20 h-20 rounded-lg bg-orange-50 shrink-0 flex items-center justify-center overflow-hidden">
          <Illustration size={64} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
            {article.title}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <StageBadge stage={article.stage} size="sm" />
            <span className="text-xs text-gray-400">{article.readingTime}分で読めます</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group block rounded-2xl overflow-hidden bg-white border border-orange-100 hover:shadow-lg hover:shadow-orange-100/50 transition-shadow"
      >
        <div className="aspect-[16/9] bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
          <Illustration size={120} />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <StageBadge stage={article.stage} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 mb-2">
            {article.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.excerpt}</p>
          <div className="flex items-center gap-2 flex-wrap">
            {article.categories.map((cat) => (
              <CategoryTag key={cat} category={cat} />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
            <span>{article.readingTime}分で読めます</span>
            <span>{article.publishedAt}</span>
          </div>
        </div>
      </Link>
    );
  }

  // Default
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block rounded-xl overflow-hidden bg-white border border-orange-100 hover:shadow-md hover:shadow-orange-100/50 transition-shadow"
    >
      <div className="aspect-[2/1] bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <Illustration size={96} />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <StageBadge stage={article.stage} />
        </div>
        <h3 className="font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 mb-1">
          {article.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{article.excerpt}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {article.categories.slice(0, 2).map((cat) => (
            <CategoryTag key={cat} category={cat} />
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-400">
          <span>{article.readingTime}分</span>
        </div>
      </div>
    </Link>
  );
}
