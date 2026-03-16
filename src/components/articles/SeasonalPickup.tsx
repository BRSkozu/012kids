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
    <section className={`bg-gradient-to-br ${theme.gradient} py-10 rounded-2xl`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{theme.icon}</span>
          <h2 className={`text-xl font-bold ${theme.textColor}`}>
            {theme.title}
          </h2>
        </div>
        <p className="text-sm text-gray-500 mb-6 ml-9">{theme.subtitle}</p>

        {/* メイン記事（1件目） */}
        <Link
          href={`/articles/${articles[0].slug}`}
          className="group block bg-white/80 backdrop-blur rounded-xl border border-white/50 shadow-sm hover:shadow-md transition-all p-5 mb-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <StageBadge stage={articles[0].stage} size="sm" />
            {articles[0].categories.slice(0, 2).map((cat) => (
              <CategoryTag key={cat} category={cat} />
            ))}
            <span className="ml-auto text-xs text-gray-400">{articles[0].readingTime}分で読める</span>
          </div>
          <h3 className="font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">
            {articles[0].title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{articles[0].excerpt}</p>
        </Link>

        {/* サブ記事（2件目以降） */}
        {articles.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {articles.slice(1).map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group bg-white/60 backdrop-blur rounded-xl border border-white/40 hover:bg-white/80 hover:shadow-sm transition-all p-4"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <StageBadge stage={article.stage} size="sm" />
                  <span className="text-xs text-gray-400">{article.readingTime}分</span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
