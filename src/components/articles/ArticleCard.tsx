import Link from 'next/link';
import { Article, ArticleMeta } from '@/types';
import StageBadge from '@/components/ui/StageBadge';
import CategoryTag from '@/components/ui/CategoryTag';
import ReadingTime from '@/components/ui/ReadingTime';
import { getCategoryIllustration } from '@/components/illustrations/CategoryIllustrations';
import { getStageById } from '@/data/stages';

interface ArticleCardProps {
  article: Article | ArticleMeta;
  variant?: 'default' | 'featured' | 'compact' | 'list' | 'related-hero' | 'related-card';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const Illustration = getCategoryIllustration(article.categories[0]);
  const stageInfo = getStageById(article.stage);

  if (variant === 'list') {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group flex items-center gap-4 p-3 rounded-lg hover:bg-orange-50/60 transition-all duration-200 border-b border-gray-100 last:border-b-0"
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
          <ReadingTime minutes={article.readingTime} variant="short" />
        </div>
        <span className="shrink-0 text-gray-400 group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all duration-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </Link>
    );
  }

  if (variant === 'related-hero') {
    return (
      <article className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
        <Link href={`/articles/${article.slug}`} className="block">
          <div
            className="aspect-[16/9] flex items-center justify-center relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${stageInfo.colorLight}, ${stageInfo.color}30)` }}
          >
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, ${stageInfo.color} 1px, transparent 1px), radial-gradient(circle at 80% 20%, ${stageInfo.color} 1px, transparent 1px)`,
              backgroundSize: '40px 40px, 60px 60px',
            }} />
            <div className="group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <Illustration size={100} />
            </div>
            <div className="absolute top-3 left-3">
              <StageBadge stage={article.stage} size="md" />
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {article.categories.slice(0, 2).map((cat) => (
                <CategoryTag key={cat} category={cat} />
              ))}
            </div>
            <h3 className="text-base font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 mb-2">
              {article.title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">{article.excerpt}</p>
            <div className="mt-3"><ReadingTime minutes={article.readingTime} /></div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'related-card') {
    return (
      <article className="group rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
        <Link href={`/articles/${article.slug}`} className="flex gap-0">
          <div
            className="w-24 sm:w-28 shrink-0 flex items-center justify-center relative overflow-hidden"
            style={{ background: `linear-gradient(160deg, ${stageInfo.colorLight}, ${stageInfo.color}40)` }}
          >
            <div className="group-hover:scale-110 transition-transform duration-400">
              <Illustration size={56} />
            </div>
          </div>
          <div className="p-3 sm:p-4 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1.5">
              <StageBadge stage={article.stage} size="sm" />
              {article.categories.slice(0, 1).map((cat) => (
                <CategoryTag key={cat} category={cat} />
              ))}
            </div>
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
              {article.title}
            </h3>
            <div className="mt-1.5"><ReadingTime minutes={article.readingTime} /></div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="rounded-xl hover:bg-orange-50/50 transition-all duration-200 group">
        <Link
          href={`/articles/${article.slug}`}
          className="flex gap-4 p-4"
        >
          <div
            className="w-20 h-20 rounded-lg shrink-0 flex items-center justify-center overflow-hidden group-hover:shadow-md transition-shadow duration-200"
            style={{ backgroundColor: stageInfo.colorLight }}
          >
            <Illustration size={64} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
              {article.title}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <StageBadge stage={article.stage} size="sm" />
              <ReadingTime minutes={article.readingTime} />
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="group rounded-2xl overflow-hidden bg-white border border-orange-100 card-hover">
        <Link href={`/articles/${article.slug}`} className="block">
          <div className="aspect-[16/9] bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
            <div className="group-hover:scale-110 transition-transform duration-500">
              <Illustration size={120} />
            </div>
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
            <footer className="mt-3 flex items-center justify-between text-xs text-gray-400">
              <ReadingTime minutes={article.readingTime} />
              <time dateTime={article.publishedAt}>{article.publishedAt}</time>
            </footer>
          </div>
        </Link>
      </article>
    );
  }

  // Default
  return (
    <article className="group rounded-xl overflow-hidden bg-white border border-orange-100 card-hover">
      <Link href={`/articles/${article.slug}`} className="block">
        <div className="aspect-[2/1] bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center relative overflow-hidden">
          <div className="group-hover:scale-110 transition-transform duration-500">
            <Illustration size={96} />
          </div>
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
          <footer className="mt-2">
            <ReadingTime minutes={article.readingTime} variant="short" />
          </footer>
        </div>
      </Link>
    </article>
  );
}
