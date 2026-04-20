import Image from 'next/image';
import Link from 'next/link';
import { Article, ArticleMeta } from '@/types';
import StageBadge from '@/components/ui/StageBadge';
import CategoryTag from '@/components/ui/CategoryTag';
import ReadingTime from '@/components/ui/ReadingTime';
import { getCategoryIllustration } from '@/components/illustrations/CategoryIllustrations';
import StageCategoryIllustration from '@/components/illustrations/StageCategoryIllustration';
import FavoriteButton from '@/components/articles/FavoriteButton';
import { getStageById } from '@/data/stages';
import { getCategoryPhoto, getStagePhoto } from '@/data/photos';

interface ArticleCardProps {
  article: Article | ArticleMeta;
  variant?: 'default' | 'featured' | 'compact' | 'list' | 'related-hero' | 'related-card';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const Illustration = getCategoryIllustration(article.categories[0]);
  const stageInfo = getStageById(article.stage);
  const cardPhoto = getStagePhoto(article.stage) || getCategoryPhoto(article.categories[0]);

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
      <article className="group rounded-2xl overflow-hidden border border-[var(--color-paper-edge)] bg-[var(--color-surface)] hover:shadow-[0_16px_36px_-16px_rgba(31,36,57,0.25)] transition-all duration-300">
        <Link href={`/articles/${article.slug}`} className="block">
          <div className="aspect-[2/1] relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${stageInfo.colorLight}, ${stageInfo.color}30)` }}>
            {cardPhoto ? (
              <>
                <Image src={cardPhoto} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Illustration size={80} />
              </div>
            )}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <StageBadge stage={article.stage} size="sm" />
              {article.categories.slice(0, 1).map((cat) => (
                <CategoryTag key={cat} category={cat} />
              ))}
            </div>
          </div>
          <div className="p-4">
            <h3
              className="text-[15px] text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors line-clamp-2 leading-snug"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              {article.title}
            </h3>
            <p className="text-sm text-[var(--color-foreground-soft)] line-clamp-2 leading-relaxed mt-1.5">{article.excerpt}</p>
            <div className="mt-2"><ReadingTime minutes={article.readingTime} variant="short" /></div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'related-card') {
    return (
      <article className="group rounded-xl overflow-hidden hover:shadow-[0_12px_28px_-16px_rgba(31,36,57,0.2)] transition-all duration-300 border border-[var(--color-paper-edge)] bg-[var(--color-surface)]">
        <Link href={`/articles/${article.slug}`} className="flex gap-0">
          <div className="w-24 sm:w-28 shrink-0 relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${stageInfo.colorLight}, ${stageInfo.color}40)` }}>
            {cardPhoto ? (
              <Image src={cardPhoto} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="120px" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Illustration size={48} />
              </div>
            )}
          </div>
          <div className="p-3 sm:p-4 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1.5">
              <StageBadge stage={article.stage} size="sm" />
              {article.categories.slice(0, 1).map((cat) => (
                <CategoryTag key={cat} category={cat} />
              ))}
            </div>
            <h3
              className="text-sm text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors line-clamp-2"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
            >
              {article.title}
            </h3>
            <div className="mt-1.5"><ReadingTime minutes={article.readingTime} variant="short" /></div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="rounded-xl hover:bg-[var(--color-warm-cream)] transition-all duration-200 group">
        <Link
          href={`/articles/${article.slug}`}
          className="flex gap-4 p-4"
        >
          <div
            className="w-20 h-20 rounded-xl shrink-0 flex items-center justify-center overflow-hidden group-hover:shadow-md transition-shadow duration-200 border border-[var(--color-paper-edge)]"
            style={{ backgroundColor: stageInfo.colorLight }}
          >
            <Illustration size={64} />
          </div>
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
      <article className="relative group rounded-2xl overflow-hidden bg-white border border-[var(--color-paper-edge)] card-hover bg-[var(--color-surface)]">
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton slug={article.slug} />
        </div>
        <Link href={`/articles/${article.slug}`} className="block">
          <div
            className="aspect-[16/9] flex items-center justify-center relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${stageInfo.colorLight}, ${stageInfo.color}30)` }}
          >
            {cardPhoto ? (
              <>
                <Image src={cardPhoto} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                <div className="group-hover:scale-110 transition-transform duration-500">
                  <StageCategoryIllustration stage={article.stage} category={article.categories[0]} size={168} />
                </div>
              </>
            )}
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <StageBadge stage={article.stage} />
            </div>
            <h3
              className="text-lg text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors line-clamp-2 mb-2 leading-snug"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              {article.title}
            </h3>
            <p className="text-sm text-[var(--color-foreground-soft)] line-clamp-2 mb-3 leading-relaxed">{article.excerpt}</p>
            <div className="flex items-center gap-2 flex-wrap">
              {article.categories.map((cat) => (
                <CategoryTag key={cat} category={cat} />
              ))}
            </div>
            <footer className="mt-3 flex items-center justify-between text-xs text-[var(--color-foreground-muted)]">
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
          className="aspect-[2/1] flex items-center justify-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${stageInfo.colorLight}, ${stageInfo.color}25)` }}
        >
          {cardPhoto ? (
            <>
              <Image src={cardPhoto} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
            </>
          ) : (
            <div className="group-hover:scale-110 transition-transform duration-500">
              <StageCategoryIllustration stage={article.stage} category={article.categories[0]} size={132} />
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <StageBadge stage={article.stage} />
          </div>
          <h3
            className="text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors line-clamp-2 mb-1.5 leading-snug"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1rem' }}
          >
            {article.title}
          </h3>
          <p className="text-sm text-[var(--color-foreground-soft)] line-clamp-2 mb-2 leading-relaxed">{article.excerpt}</p>
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
