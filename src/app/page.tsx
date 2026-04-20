import Image from 'next/image';
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
import { getCategoryPhoto } from '@/data/photos';
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/5" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-serif)', textShadow: '0 1px 6px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.5)' }}>
                          {cat.icon} {cat.label}
                        </h3>
                        <p className="text-xs mt-0.5 tracking-wider font-medium" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}>{categoryCounts[cat.id] || 0}件</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-[var(--color-surface)] text-center">
                      <span className="text-2xl mb-2 block">{cat.icon}</span>
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

      {/* Newsletter */}
      <NewsletterSignup />

      {/* Closing About Banner */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2
              className="text-[22px] md:text-[26px] text-[var(--color-foreground)] leading-[1.3]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              012.kidsが大切にしていること
            </h2>
            <p className="mt-2 text-sm text-[var(--color-foreground-soft)] leading-[1.85]">
              公的機関や専門家の情報をもとに、子育てに役立つ情報をわかりやすくお届けします。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0 md:gap-0 rounded-2xl overflow-hidden border border-[var(--color-paper-edge)]">
            {[
              { label: '参考元の明示', desc: '情報の出どころを明記', color: '#C66B1F', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              )},
              { label: '中立な立場', desc: '商業的偏りなし', color: '#5B7FA5', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
                </svg>
              )},
              { label: '最新の情報', desc: '常にアップデート', color: '#4A9B6E', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
              )},
              { label: '安心の設計', desc: '子どもを守るサイト', color: '#8B6BAE', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              )},
              { label: 'すべての家族に', desc: '多様な家族に寄り添う', color: '#D4856A', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              )},
            ].map((item, i) => (
              <div
                key={item.label}
                className="flex md:flex-col items-center md:items-center gap-3 md:gap-0 px-5 py-4 md:py-6 bg-[var(--color-surface)] md:border-r last:border-r-0 border-b md:border-b-0 last:border-b-0 border-[var(--color-paper-edge)] text-left md:text-center"
              >
                <div
                  className="shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center md:mb-3 text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p
                    className="text-sm text-[var(--color-foreground)]"
                    style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/editorial-policy"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary-dark)] hover:text-[var(--color-primary)] transition-colors"
            >
              編集方針を詳しく見る
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
