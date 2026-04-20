import Link from 'next/link';
import { Article, ArticleMeta } from '@/types';
import StageBadge from '@/components/ui/StageBadge';
import CategoryTag from '@/components/ui/CategoryTag';
import ReadingTime from '@/components/ui/ReadingTime';
import FavoriteButton from '@/components/articles/FavoriteButton';
import { getStageById } from '@/data/stages';

interface ArticleCardProps {
  article: Article | ArticleMeta;
  variant?: 'default' | 'featured' | 'compact' | 'list' | 'related-hero' | 'related-card';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const stageInfo = getStageById(article.stage);

  if (variant === 'list') {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--color-warm-cream)] transition-all duration-200 border-b border-[var(--color-paper-edge)] last:border-b-0"
      >
        <div className="min-w-0 flex-1">
          <h3
            className="text-[15px] text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors line-clamp-1 leading-snug"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
          >
            {article.title}
          </h3>
          <p className="text-xs text-[var(--color-foreground-muted)] line-clamp-1 mt-0.5">{article.excerpt}</p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <StageBadge stage={article.stage} size="sm" />
          {article.categories.slice(0, 1).map((cat) => (
            <CategoryTag key={cat} category={cat} />
          ))}
          <ReadingTime minutes={article.readingTime} variant="short" />
        </div>
        <span className="shrink-0 text-[var(--color-foreground-muted)] group-hover:text-[var(--color-primary-dark)] group-hover:translate-x-0.5 transition-all duration-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </Link>
    );
  }

  if (variant === 'related-hero') {
    return (
      <article className="group rounded-xl border border-[var(--color-paper-edge)] bg-[var(--color-surface)] hover:shadow-[0_12px_28px_-12px_rgba(31,36,57,0.18)] transition-all duration-200">
        <Link href={`/articles/${article.slug}`} className="block p-4">
          <div className="flex items-center gap-2 mb-2">
            <StageBadge stage={article.stage} size="sm" />
            {article.categories.slice(0, 1).map((cat) => (
              <CategoryTag key={cat} category={cat} />
            ))}
            <span className="ml-auto"><ReadingTime minutes={article.readingTime} variant="short" /></span>
          </div>
          <h3
            className="text-[15px] text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors line-clamp-2 leading-snug"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
          >
            {article.title}
          </h3>
          <p className="text-sm text-[var(--color-foreground-soft)] line-clamp-2 leading-relaxed mt-1.5">{article.excerpt}</p>
        </Link>
      </article>
    );
  }

  if (variant === 'related-card') {
    return (
      <article className="group rounded-xl hover:bg-[var(--color-warm-cream)] transition-all duration-200 border border-[var(--color-paper-edge)] bg-[var(--color-surface)]">
        <Link href={`/articles/${article.slug}`} className="flex items-start gap-3 p-3">
          <div
            className="shrink-0 w-1 self-stretch rounded-full"
            style={{ backgroundColor: stageInfo.color }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <StageBadge stage={article.stage} size="sm" />
              <ReadingTime minutes={article.readingTime} variant="short" />
            </div>
            <h3
              className="text-sm text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors line-clamp-2 leading-snug"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
            >
              {article.title}
            </h3>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="rounded-xl hover:bg-[var(--color-warm-cream)] transition-all duration-200 group">
        <Link href={`/articles/${article.slug}`} className="flex gap-3 p-4">
          <div
            className="shrink-0 w-1 self-stretch rounded-full"
            style={{ backgroundColor: stageInfo.color }}
          />
          <div className="min-w-0">
            <h3
              className="text-[15px] text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors line-clamp-2 leading-snug"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
            >
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
      <article className="relative group rounded-2xl overflow-hidden border border-[var(--color-paper-edge)] card-hover bg-[var(--color-surface)]">
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton slug={article.slug} />
        </div>
        <Link href={`/articles/${article.slug}`} className="block">
          <div
            className="h-3 w-full"
            style={{ background: `linear-gradient(90deg, ${stageInfo.color}, ${stageInfo.colorLight})` }}
          />
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <StageBadge stage={article.stage} />
              {article.categories.slice(0, 2).map((cat) => (
                <CategoryTag key={cat} category={cat} />
              ))}
            </div>
            <h3
              className="text-lg text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors line-clamp-2 mb-2 leading-snug"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              {article.title}
            </h3>
            <p className="text-sm text-[var(--color-foreground-soft)] line-clamp-3 mb-3 leading-relaxed">{article.excerpt}</p>
            <footer className="flex items-center justify-between text-xs text-[var(--color-foreground-muted)]">
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
    <article className="relative group rounded-2xl overflow-hidden border border-[var(--color-paper-edge)] card-hover bg-[var(--color-surface)]">
      <div className="absolute top-2.5 right-2.5 z-10">
        <FavoriteButton slug={article.slug} />
      </div>
      <Link href={`/articles/${article.slug}`} className="block">
        <div
          className="h-2 w-full"
          style={{ background: `linear-gradient(90deg, ${stageInfo.color}, ${stageInfo.colorLight})` }}
        />
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <StageBadge stage={article.stage} size="sm" />
            {article.categories.slice(0, 2).map((cat) => (
              <CategoryTag key={cat} category={cat} />
            ))}
          </div>
          <h3
            className="text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors line-clamp-2 mb-1.5 leading-snug"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1rem' }}
          >
            {article.title}
          </h3>
          <p className="text-sm text-[var(--color-foreground-soft)] line-clamp-2 mb-2 leading-relaxed">{article.excerpt}</p>
          <footer>
            <ReadingTime minutes={article.readingTime} variant="short" />
          </footer>
        </div>
      </Link>
    </article>
  );
}
