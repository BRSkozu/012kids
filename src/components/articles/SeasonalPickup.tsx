import Link from 'next/link';
import Image from 'next/image';
import { Article, ArticleMeta } from '@/types';
import { SeasonalTheme } from '@/data/seasonal-content';
import StageBadge from '@/components/ui/StageBadge';
import ReadingTime from '@/components/ui/ReadingTime';
import { getStagePhoto, getCategoryPhoto } from '@/data/photos';

interface SeasonalPickupProps {
  theme: SeasonalTheme;
  articles: (Article | ArticleMeta)[];
}

export default function SeasonalPickup({ theme, articles }: SeasonalPickupProps) {
  if (articles.length === 0) return null;

  const hero = articles[0];
  const rest = articles.slice(1, 7);
  const heroPhoto = getStagePhoto(hero.stage) || getCategoryPhoto(hero.categories[0]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{theme.icon}</span>
        <h2
          className="text-lg text-[var(--color-foreground)]"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
        >
          {theme.title}
        </h2>
      </div>
      <p className="text-sm text-[var(--color-foreground-soft)] mb-5 ml-7 leading-relaxed">{theme.subtitle}</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* メイン記事 */}
        <Link
          href={`/articles/${hero.slug}`}
          className="group lg:col-span-2 block rounded-xl overflow-hidden border border-[var(--color-paper-edge)] bg-[var(--color-surface)] hover:shadow-[0_16px_36px_-16px_rgba(31,36,57,0.25)] transition-all"
        >
          {heroPhoto ? (
            <div className="aspect-[16/10] relative overflow-hidden">
              <Image src={heroPhoto} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 1024px) 100vw, 40vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <StageBadge stage={hero.stage} size="sm" />
              </div>
            </div>
          ) : (
            <div className="p-4 pb-0">
              <StageBadge stage={hero.stage} size="sm" />
            </div>
          )}
          <div className="p-4">
            <h3
              className="text-base text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors line-clamp-2 leading-snug"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              {hero.title}
            </h3>
            <p className="text-sm text-[var(--color-foreground-soft)] mt-1.5 line-clamp-2 leading-relaxed">{hero.excerpt}</p>
            <div className="mt-2">
              <ReadingTime minutes={hero.readingTime} />
            </div>
          </div>
        </Link>

        {/* サブ記事 */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {rest.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group flex lg:flex-col gap-3 lg:gap-0 rounded-xl border border-[var(--color-paper-edge)] bg-[var(--color-surface)] hover:shadow-[0_10px_24px_-14px_rgba(31,36,57,0.2)] transition-all overflow-hidden"
            >
              <div className="lg:hidden w-20 shrink-0 flex items-center justify-center p-3">
                <StageBadge stage={article.stage} size="sm" />
              </div>
              <div className="hidden lg:block p-3 pb-0">
                <StageBadge stage={article.stage} size="sm" />
              </div>
              <div className="py-3 pr-3 lg:px-3 lg:pb-3 lg:pt-1.5 min-w-0">
                <h4
                  className="text-sm text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors line-clamp-2 leading-snug"
                  style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
                >
                  {article.title}
                </h4>
                <div className="mt-1">
                  <ReadingTime minutes={article.readingTime} variant="short" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
