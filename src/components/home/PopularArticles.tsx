import Link from 'next/link';
import TrackingLink from '@/components/ui/TrackingLink';

interface PopularArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  stage: string;
}

const STAGE_LABELS: Record<string, { label: string; color: string }> = {
  '0stage': { label: '0〜2歳', color: '#FFB3B3' },
  'pre': { label: '3〜5歳', color: '#FFD9A0' },
  'early': { label: '6〜8歳', color: '#FFFAA0' },
  'mid': { label: '9〜10歳', color: '#A8E6CF' },
  'upper': { label: '11〜12歳', color: '#A0C4FF' },
};

export default function PopularArticles({ articles }: { articles: PopularArticle[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <p
            className="text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--color-primary-dark)] mb-2 inline-flex items-center gap-2"
            style={{ fontFamily: 'var(--font-gothic)' }}
          >
            <span className="inline-block w-5 h-px bg-[var(--color-primary)]" />
            Popular
          </p>
          <h2
            className="text-[26px] md:text-[32px] leading-[1.25] text-[var(--color-foreground)]"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
          >
            よく読まれている記事
          </h2>
          <p className="mt-2 text-sm md:text-[15px] text-[var(--color-foreground-soft)] leading-[1.85]">みんなが気になっている人気の記事</p>
        </div>
        <Link
          href="/articles?sort=popular"
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary-dark)] hover:text-[var(--color-primary)] group"
        >
          <span className="border-b border-transparent group-hover:border-current">すべて見る</span>
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article) => {
          const stageInfo = STAGE_LABELS[article.stage];
          return (
            <TrackingLink
              key={article.id}
              href={`/articles/${article.slug}`}
              trackingType="popular"
              trackingId={article.id}
              trackingExtra={stageInfo?.label}
              className="group block rounded-xl p-5 bg-[var(--color-surface)] border border-[var(--color-paper-edge)] card-hover"
            >
              {stageInfo && (
                <span
                  className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mb-3 border border-[var(--color-paper-edge)]"
                  style={{ backgroundColor: stageInfo.color, color: 'var(--color-foreground)' }}
                >
                  {stageInfo.label}
                </span>
              )}
              <h3
                className="text-sm text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors line-clamp-2"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                {article.title}
              </h3>
              <p className="text-xs text-[var(--color-foreground-soft)] mt-2 line-clamp-2 leading-relaxed">{article.excerpt}</p>
            </TrackingLink>
          );
        })}
      </div>
    </section>
  );
}
