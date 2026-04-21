import Image from 'next/image';
import Link from 'next/link';
import AgeSelector from '@/components/age-selector/AgeSelector';
import ArticleCard from '@/components/articles/ArticleCard';
import SeasonalPickup from '@/components/articles/SeasonalPickup';
import FirstTimeSection from '@/components/home/FirstTimeSection';
import WorryCardSection from '@/components/home/WorryCardSection';
import TrustBlock from '@/components/home/TrustBlock';
import ScrollTracker from '@/components/home/ScrollTracker';
import RecentlyViewed from '@/components/home/RecentlyViewed';
import SectionHeader from '@/components/ui/SectionHeader';
import { getCategoryPhoto } from '@/data/photos';
import { getFeaturedArticles, getLatestArticles, getAllArticlesSync, getArticleCountByCategory } from '@/lib/articles';
import { CATEGORIES } from '@/data/categories';
import { getCurrentSeasonalTheme, getSeasonalScore } from '@/data/seasonal-content';

export default function HomePage() {
  const allArticles = getAllArticlesSync();
  const featured = getFeaturedArticles().slice(0, 3);
  const latest = getLatestArticles(6);
  const categoryCounts = getArticleCountByCategory();
  const featuredSlugs = new Set(featured.map((a) => a.slug));
  const ranking = [...allArticles]
    .sort((a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0))
    .filter((a) => !featuredSlugs.has(a.slug))
    .slice(0, 5);

  const seasonalTheme = getCurrentSeasonalTheme();
  const seasonalArticles = allArticles
    .map((a) => ({
      article: a,
      score: getSeasonalScore(a.tags ?? [], a.title, seasonalTheme),
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || (b.article.score?.total ?? 0) - (a.article.score?.total ?? 0))
    .slice(0, 7)
    .map((s) => s.article);

  const rankingLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '人気記事ランキング - 012.kids',
    description: '0歳〜12歳の子育て・教育に関する人気記事トップ5',
    numberOfItems: ranking.length,
    itemListElement: ranking.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://012.kids/articles/${a.slug}`,
      name: a.title,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(rankingLd) }} />
      <ScrollTracker />

      {/* Hero: catchcopy + search + age buttons + trust badges */}
      <AgeSelector />

      {/* First Time User Section */}
      <FirstTimeSection />

      {/* お悩みから探す */}
      <WorryCardSection />

      {/* 直近の閲覧履歴 (localStorage) */}
      <RecentlyViewed />

      {/* Seasonal Pickup */}
      {seasonalArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <SeasonalPickup theme={seasonalTheme} articles={seasonalArticles} />
        </section>
      )}

      {/* Featured + Ranking unified strip (replaces 3 separate sections) */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <SectionHeader
          kicker="Editor's Pick"
          title="今、読まれている記事"
          description="編集部セレクト × みんなに支持されているトップ記事"
          seeAllHref="/articles?sort=popular"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((article) => (
              <ArticleCard key={article.id} article={article} variant="featured" />
            ))}
          </div>
          <aside className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-paper-edge)] p-5 relative overflow-hidden">
            <div className="lamp-glow top-[-4rem] right-[-4rem] w-[12rem] h-[12rem] bg-[#F5D9B1] opacity-40 pointer-events-none" />
            <h3
              className="relative flex items-center gap-2 text-[var(--color-foreground)] mb-4"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold shadow-[0_4px_10px_-4px_rgba(198,107,31,0.6)]">
                #
              </span>
              人気ランキング
            </h3>
            <ol className="relative space-y-3">
              {ranking.map((article, i) => (
                <li key={article.id}>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="group flex items-start gap-3"
                  >
                    <span
                      className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i < 3
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--color-warm-cream)] text-[var(--color-primary-dark)] border border-[var(--color-paper-edge)]'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="text-sm text-[var(--color-foreground-soft)] group-hover:text-[var(--color-primary-dark)] transition-colors line-clamp-2 leading-snug"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {article.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <Link
              href="/articles?sort=popular"
              className="relative mt-5 block text-center text-xs font-medium text-[var(--color-primary-dark)] hover:text-[var(--color-primary)]"
            >
              ランキングをすべて見る →
            </Link>
          </aside>
        </div>
      </section>

      {/* 信頼性訴求 (moved down — shown after content preview) */}
      <TrustBlock />

      {/* Latest Articles */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            accentColor="bg-green-400"
            kicker="New"
            title="新着記事"
            description="最近公開・更新された記事"
            seeAllHref="/articles?sort=newest"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories (compact) */}
      <section className="bg-[var(--color-warm-bg)] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            accentColor="bg-blue-400"
            kicker="Browse"
            title="カテゴリから探す"
            description="気になるテーマの記事を見つけましょう"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {CATEGORIES.map((cat) => {
              const photo = getCategoryPhoto(cat.id);
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  className="group block rounded-xl overflow-hidden border border-[var(--color-paper-edge)] card-hover relative"
                >
                  {photo ? (
                    <div className="aspect-[4/3] relative">
                      <Image src={photo} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 20vw" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm px-3 py-2.5">
                        <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-serif)', color: '#fff' }}>
                          {cat.label}
                        </h3>
                        <p className="text-xs mt-0.5 tracking-wider font-medium text-white/80">{categoryCounts[cat.id] || 0}件</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-[var(--color-surface)] text-center">
                      <h3 className="text-sm text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>{cat.label}</h3>
                      <p className="text-xs text-[var(--color-primary-dark)] mt-1">{categoryCounts[cat.id] || 0}件</p>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p
            className="text-sm text-[var(--color-foreground-soft)] leading-[2]"
          >
            012.kidsは、公的機関や専門家の情報をもとに編集しています。
            <br className="hidden md:inline" />
            出典の明記・広告なし・定期的な更新を基本方針としています。
          </p>
          <Link
            href="/editorial-policy"
            className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-[var(--color-primary-dark)] hover:text-[var(--color-primary)] transition-colors"
          >
            編集方針について
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
