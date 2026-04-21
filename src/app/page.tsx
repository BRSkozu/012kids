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

  return (
    <>
      <ScrollTracker />

      {/* Hero: catchcopy + search + age buttons + trust badges */}
      <AgeSelector />

      {/* Seasonal Pickup — 季節コンテンツはファーストビュー近くに */}
      {seasonalArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pt-8 pb-4">
          <SeasonalPickup theme={seasonalTheme} articles={seasonalArticles} />
        </section>
      )}

      {/* First Time User Section */}
      <FirstTimeSection />

      {/* お悩みから探す */}
      <WorryCardSection />

      {/* 直近の閲覧履歴 (localStorage) */}
      <RecentlyViewed />

      {/* Featured articles */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <SectionHeader
          kicker="Pick Up"
          title="今、読まれている記事"
          seeAllHref="/articles?sort=popular"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((article) => (
            <ArticleCard key={article.id} article={article} variant="featured" />
          ))}
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
                        <h3 className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
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
