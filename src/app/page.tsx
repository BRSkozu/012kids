import Link from 'next/link';
import AgeSelector from '@/components/age-selector/AgeSelector';
import ArticleCard from '@/components/articles/ArticleCard';
import SeasonalPickup from '@/components/articles/SeasonalPickup';
import FirstTimeSection from '@/components/home/FirstTimeSection';
import AgePillNav from '@/components/home/AgePillNav';
import WorryCardSection from '@/components/home/WorryCardSection';
import TrustBlock from '@/components/home/TrustBlock';
import ScrollTracker from '@/components/home/ScrollTracker';
import RecentlyViewed from '@/components/home/RecentlyViewed';
import ProfileOnboarding from '@/components/home/ProfileOnboarding';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import SectionHeader from '@/components/ui/SectionHeader';
import StageCategoryIllustration from '@/components/illustrations/StageCategoryIllustration';
import { getFeaturedArticles, getLatestArticles, getAllArticlesSync, getArticleCountByCategory } from '@/lib/articles';
import { CATEGORIES } from '@/data/categories';
import { getCurrentSeasonalTheme, getSeasonalScore } from '@/data/seasonal-content';

export default function HomePage() {
  const allArticles = getAllArticlesSync();
  const totalCount = allArticles.length;
  const featured = getFeaturedArticles().slice(0, 3);
  const latest = getLatestArticles(6);
  const categoryCounts = getArticleCountByCategory();
  const ranking = [...allArticles]
    .sort((a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0))
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

      {/* Hero + Age Selector (with rotating empathetic copy) */}
      <AgeSelector />

      {/* Age Pill Navigation */}
      <AgePillNav />

      {/* First Time User Section */}
      <FirstTimeSection />

      {/* Personalization: profile onboarding or welcome back */}
      <ProfileOnboarding />

      {/* Compact site-meta line (was a full banner) */}
      <section className="max-w-5xl mx-auto px-4 -mt-2 mb-6">
        <p className="text-center text-xs text-[var(--color-foreground-muted)] tracking-wider">
          公的機関・専門家の情報を編集してお届け ·{' '}
          <span className="font-semibold text-[var(--color-primary-dark)]">
            {totalCount.toLocaleString()}記事掲載中
          </span>{' '}
          ·{' '}
          <Link href="/articles" className="underline hover:text-[var(--color-primary-dark)]">
            記事一覧を見る
          </Link>
        </p>
      </section>

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
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="group block p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-paper-edge)] card-hover text-center"
              >
                <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform duration-300 inline-block">{cat.icon}</span>
                <h3
                  className="text-sm text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors"
                  style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
                >
                  {cat.label}
                </h3>
                <p className="text-xs text-[var(--color-primary-dark)] mt-1 font-medium tracking-wider">
                  {categoryCounts[cat.id] || 0}件
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSignup />

      {/* Closing About Banner */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-center border border-[var(--color-paper-edge)] bg-[var(--color-warm-cream)]">
          <div className="absolute inset-0 starry-pattern opacity-60 pointer-events-none" />
          <div className="lamp-glow top-[-6rem] right-[-4rem] w-[18rem] h-[18rem] bg-[#F5D9B1] opacity-40 pointer-events-none" />
          <div className="lamp-glow bottom-[-6rem] left-[-4rem] w-[16rem] h-[16rem] bg-[#C8D1E8] opacity-30 pointer-events-none" />
          <div className="absolute -top-8 -right-6 opacity-60 pointer-events-none">
            <StageCategoryIllustration stage="pre" category="education" size={140} />
          </div>
          <div className="absolute -bottom-8 -left-6 opacity-60 pointer-events-none">
            <StageCategoryIllustration stage="mid" category="mental" size={140} />
          </div>
          <div className="relative">
            <p
              className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.22em] uppercase text-[var(--color-primary-dark)] mb-3"
              style={{ fontFamily: 'var(--font-gothic)' }}
            >
              <span className="inline-block w-6 h-px bg-[var(--color-primary)]" />
              Our Promise
              <span className="inline-block w-6 h-px bg-[var(--color-primary)]" />
            </p>
            <h2
              className="text-[26px] md:text-[32px] text-[var(--color-foreground)] mb-3 leading-[1.25]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              012.kidsの約束
            </h2>
            <p className="text-sm text-[var(--color-foreground-soft)] mb-6 max-w-2xl mx-auto leading-[1.9]">
              公的機関や専門家の情報をもとに、子育てに役立つ情報をわかりやすくまとめてお届けします。
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 max-w-4xl mx-auto">
              {[
                { label: '参考元の明示', desc: '情報の出どころを明記', icon: '📋' },
                { label: '中立な立場', desc: '商業的偏りのない情報', icon: '⚖️' },
                { label: '最新の情報', desc: '常にアップデート', icon: '🔄' },
                { label: '安心の設計', desc: '子どもを守るサイト設計', icon: '🛡️' },
                { label: 'すべての家族に', desc: '多様な家族に寄り添う', icon: '🏠' },
              ].map((item) => (
                <div key={item.label} className="group">
                  <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform duration-300 inline-block">{item.icon}</span>
                  <p
                    className="text-[var(--color-primary-dark)] text-sm"
                    style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs text-[var(--color-foreground-muted)] mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <Link
              href="/editorial-policy"
              className="btn-lamp mt-8 inline-flex"
            >
              編集方針を見る
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
