import Link from 'next/link';
import { Article, ArticleMeta } from '@/types';
import { SeasonalTheme } from '@/data/seasonal-content';
import StageBadge from '@/components/ui/StageBadge';
import CategoryTag from '@/components/ui/CategoryTag';

interface SeasonalPickupProps {
  theme: SeasonalTheme;
  articles: (Article | ArticleMeta)[];
}

export default function SeasonalPickup({ theme, articles }: SeasonalPickupProps) {
  if (articles.length === 0) return null;

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient} py-10 rounded-2xl border border-[var(--color-paper-edge)]`}>
      <div className="absolute inset-0 starry-pattern opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{theme.icon}</span>
          <h2
            className={`text-xl ${theme.textColor}`}
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
          >
            {theme.title}
          </h2>
        </div>
        <p className="text-sm text-[var(--color-foreground-soft)] mb-6 ml-9 leading-relaxed">{theme.subtitle}</p>

        {/* メイン記事（1件目） */}
        <Link
          href={`/articles/${articles[0].slug}`}
          className="group block bg-[rgba(255,253,247,0.85)] backdrop-blur rounded-xl border border-[var(--color-paper-edge)] shadow-[0_10px_24px_-14px_rgba(31,36,57,0.22)] hover:shadow-[0_16px_34px_-16px_rgba(31,36,57,0.28)] transition-all p-5 mb-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <StageBadge stage={articles[0].stage} size="sm" />
            {articles[0].categories.slice(0, 2).map((cat) => (
              <CategoryTag key={cat} category={cat} />
            ))}
            <span className="ml-auto text-xs text-[var(--color-foreground-muted)]">{articles[0].readingTime}分で読める</span>
          </div>
          <h3
            className="text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
          >
            {articles[0].title}
          </h3>
          <p className="text-sm text-[var(--color-foreground-soft)] mt-1 line-clamp-2 leading-relaxed">{articles[0].excerpt}</p>
        </Link>

        {/* サブ記事（2件目以降） */}
        {articles.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {articles.slice(1).map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group bg-[rgba(255,253,247,0.7)] backdrop-blur rounded-xl border border-[var(--color-paper-edge)] hover:bg-[rgba(255,253,247,0.92)] hover:shadow-[0_10px_24px_-14px_rgba(31,36,57,0.22)] transition-all p-4"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <StageBadge stage={article.stage} size="sm" />
                  <span className="text-xs text-[var(--color-foreground-muted)]">{article.readingTime}分</span>
                </div>
                <h4
                  className="text-sm text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors line-clamp-2"
                  style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
                >
                  {article.title}
                </h4>
                <p className="text-xs text-[var(--color-foreground-soft)] mt-1 line-clamp-2 leading-relaxed">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
