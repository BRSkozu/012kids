import Link from 'next/link';
import AgeSelector from '@/components/age-selector/AgeSelector';
import ArticleCard from '@/components/articles/ArticleCard';
import SeasonalPickup from '@/components/articles/SeasonalPickup';
import FirstTimeSection from '@/components/home/FirstTimeSection';
import AgePillNav from '@/components/home/AgePillNav';
import WorryCardSection from '@/components/home/WorryCardSection';
import TrustBlock from '@/components/home/TrustBlock';
import PopularArticles from '@/components/home/PopularArticles';
import ScrollTracker from '@/components/home/ScrollTracker';
import { getFeaturedArticles, getLatestArticles, getAllArticlesSync, getArticleCountByCategory, getArticleCountByStage } from '@/lib/articles';
import { CATEGORIES } from '@/data/categories';
import { AGE_STAGES } from '@/data/stages';
import { RECOMMENDED_LINKS as ALL_RECOMMENDED_LINKS } from '@/data/recommended-links';
import { getCurrentSeasonalTheme, getSeasonalScore } from '@/data/seasonal-content';

const MATOME_SECTIONS = [
  {
    title: '年齢別おすすめ記事まとめ',
    icon: '👶',
    items: [
      { label: '0〜2歳：赤ちゃんの育て方まとめ', href: '/articles?stage=0stage', desc: '授乳・離乳食・睡眠・発達の基本' },
      { label: '3〜5歳：幼児期の成長ガイド', href: '/articles?stage=pre', desc: '言葉・しつけ・幼稚園・遊びの工夫' },
      { label: '6〜8歳：小学校低学年の子育て', href: '/articles?stage=early', desc: '入学準備・読み書き・友達関係' },
      { label: '9〜10歳：中学年の学びと心', href: '/articles?stage=mid', desc: '学習習慣・習い事・思春期の入口' },
      { label: '11〜12歳：高学年〜中学進学', href: '/articles?stage=upper', desc: '自主学習・受験・デジタルリテラシー' },
    ],
  },
  {
    title: 'テーマ別まとめ',
    icon: '📖',
    items: [
      { label: '離乳食・幼児食の進め方', href: '/category/nutrition', desc: '月齢別の進め方、アレルギー対策、レシピ' },
      { label: '子どもの発達が気になるとき', href: '/category/development', desc: '発達の目安、相談先、支援制度' },
      { label: '不登校・いじめへの対応', href: '/category/mental', desc: '兆候の見つけ方、家庭での対応、専門機関' },
      { label: 'スクリーンタイムとデジタル教育', href: '/category/digital', desc: 'ルール作り、安全設定、プログラミング' },
      { label: '妊娠から出産まで', href: '/category/pregnancy', desc: '妊娠経過、出産準備、産後ケア' },
      { label: '共働き家庭の子育て術', href: '/category/lifestyle', desc: '時短、学童、ワークライフバランス' },
    ],
  },
];

export default function HomePage() {
  const allArticles = getAllArticlesSync();
  const totalCount = allArticles.length;
  const featured = getFeaturedArticles();
  const latest = getLatestArticles(6);
  const categoryCounts = getArticleCountByCategory();
  const stageCounts = getArticleCountByStage();
  const ranking = [...allArticles]
    .sort((a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0))
    .slice(0, 10);

  // Popular articles for P2 section (top 6)
  const popular = [...allArticles]
    .sort((a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0))
    .slice(0, 6)
    .map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      stage: a.stage,
    }));

  // Seasonal content
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

  // ItemList JSON-LD for ranking rich snippets
  const rankingLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '人気記事ランキング - 012.kids',
    description: '0歳〜12歳の子育て・教育に関する人気記事トップ10',
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

      {/* Hero + Age Selector */}
      <AgeSelector />

      {/* P0: Age Pill Navigation */}
      <AgePillNav />

      {/* P0: はじめての方へ - First Time User Section */}
      <FirstTimeSection />

      {/* Article Count Banner */}
      <section className="max-w-7xl mx-auto px-4 -mt-2 mb-4">
        <div className="glass rounded-2xl p-6 border border-orange-100/60 shadow-sm">
          <p className="text-center text-sm text-gray-600">
            012.kidsは、子育て・教育に関する公的機関や専門家の情報をわかりやすくまとめて紹介するサイトです。
          </p>
          <p className="mt-3 text-center text-base font-bold text-[var(--color-primary)]">
            現在 <span className="text-3xl gradient-text">{totalCount.toLocaleString()}</span> 記事を掲載中
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                {cat.icon} {cat.label}：{categoryCounts[cat.id] || 0}件
              </Link>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-gray-400">
            {AGE_STAGES.map((stage) => (
              <Link
                key={stage.id}
                href={`/age-guide/${stage.id}`}
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                {stage.ageRange}：{stageCounts[stage.id] || 0}件
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* P1: お悩みから探す (icon cards, moved up) */}
      <WorryCardSection />

      {/* P1: 信頼性訴求ブロック */}
      <TrustBlock />

      {/* Seasonal Pickup */}
      {seasonalArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <SeasonalPickup theme={seasonalTheme} articles={seasonalArticles} />
        </section>
      )}

      {/* Matome Sections */}
      <section className="bg-[var(--color-warm-bg)] py-12">
        <div className="max-w-7xl mx-auto px-4">
          {MATOME_SECTIONS.map((section) => (
            <div key={section.title} className="mb-10 last:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {section.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group block p-4 rounded-xl bg-white border border-orange-100 card-hover"
                  >
                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">
                      {item.label}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                    <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                      記事を見る
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Articles */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[var(--color-primary)] rounded-full" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">注目の記事</h2>
              <p className="text-sm text-gray-500 mt-1">よく読まれている記事をピックアップ</p>
            </div>
          </div>
          <Link
            href="/articles"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            すべて見る
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((article) => (
            <ArticleCard key={article.id} article={article} variant="featured" />
          ))}
        </div>
      </section>

      {/* P2: よく読まれている記事 (top 6 with age badges) */}
      <section className="bg-[var(--color-warm-bg)] py-2">
        <PopularArticles articles={popular} />
      </section>

      {/* Latest Articles */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-green-400 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">新着記事</h2>
                <p className="text-sm text-gray-500 mt-1">最近公開・更新された記事</p>
              </div>
            </div>
            <Link
              href="/articles?sort=newest"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              すべて見る
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Ranking */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-6 bg-amber-400 rounded-full" />
          <h2 className="text-2xl font-bold text-gray-900">人気記事ランキング</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6 ml-5">みんなに読まれている記事トップ10</p>
        <div className="space-y-3">
          {ranking.map((article, i) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-orange-100 card-hover"
            >
              <span
                className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                  i < 3
                    ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white'
                    : 'bg-orange-100 text-[var(--color-primary-dark)]'
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors truncate">
                  {article.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{article.excerpt}</p>
              </div>
              <span className="shrink-0 text-gray-400 group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories with counts */}
      <section className="bg-[var(--color-warm-bg)] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 bg-blue-400 rounded-full" />
            <h2 className="text-2xl font-bold text-gray-900">カテゴリから探す</h2>
          </div>
          <p className="text-sm text-gray-500 mb-8 ml-5">気になるテーマの記事を見つけましょう</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="group block p-5 rounded-xl bg-white border border-orange-100 card-hover"
              >
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform duration-300 inline-block">{cat.icon}</span>
                <h3 className="font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">
                  {cat.label}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                <p className="text-xs font-medium text-[var(--color-primary)] mt-2">
                  {categoryCounts[cat.id] || 0}件の記事
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended External Links with Related Articles */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 bg-indigo-400 rounded-full" />
            <h2 className="text-2xl font-bold text-gray-900">おすすめ公的サイト・専門機関リンク集</h2>
          </div>
          <p className="text-sm text-gray-500 mb-8 ml-5">
            信頼できる子育て情報の一次ソースと、関連する012.kids記事をセットでご紹介
          </p>
          <div className="space-y-4">
            {(() => {
              const seen = new Set<string>();
              const picks = ALL_RECOMMENDED_LINKS.filter((link) => {
                const key = link.categories.filter((c) => c !== 'general')[0] || 'general';
                if (seen.has(key) && seen.size > 3) return false;
                seen.add(key);
                return true;
              }).slice(0, 12);

              return picks.map((link) => {
                const related = allArticles
                  .filter((a) =>
                    a.categories.some((c) => link.categories.includes(c))
                  )
                  .sort((a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0))
                  .slice(0, 3);

                const sentimentDot = link.sentiment === 'positive' ? 'bg-blue-400'
                  : link.sentiment === 'cautious' ? 'bg-amber-400' : 'bg-gray-300';
                const sentimentBorder = link.sentiment === 'positive' ? 'border-blue-100'
                  : link.sentiment === 'cautious' ? 'border-amber-100' : 'border-gray-200';

                return (
                  <div key={link.title} className={`rounded-xl bg-white border ${sentimentBorder} overflow-hidden hover:shadow-sm transition-shadow duration-200`}>
                    <div className="p-4 flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`shrink-0 w-2 h-2 rounded-full ${sentimentDot}`} />
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-sm text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {link.title}
                            <span className="ml-1 text-xs text-gray-400">↗</span>
                          </a>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{link.org}</p>
                        <p className="text-xs text-gray-500 mt-1">{link.description}</p>
                      </div>
                    </div>
                    {related.length > 0 && (
                      <div className="border-t border-blue-50 bg-blue-50/30 px-4 py-3">
                        <p className="text-xs font-medium text-gray-500 mb-2">
                          この情報源に関連する012.kids記事
                        </p>
                        <div className="flex flex-col gap-1.5">
                          {related.map((a) => (
                            <Link
                              key={a.id}
                              href={`/articles/${a.slug}`}
                              className="text-xs text-[var(--color-primary)] hover:underline truncate"
                            >
                              {a.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> 支持的</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300" /> 中立</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> 慎重・注意喚起</span>
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/experts"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              すべての参考サイト・専門機関を見る
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About Banner */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 md:p-12 text-center">
          <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              012.kidsの約束
            </h2>
            <p className="text-sm text-gray-600 mb-6 max-w-2xl mx-auto">
              公的機関や専門家の情報をもとに、子育てに役立つ情報をわかりやすくまとめてお届けします。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8 max-w-4xl mx-auto">
              {[
                { label: '参考元の明示', desc: '情報の出どころを明記', icon: '📋' },
                { label: '中立な立場', desc: '商業的偏りのない情報', icon: '⚖️' },
                { label: '最新の情報', desc: '常にアップデート', icon: '🔄' },
                { label: '安心の設計', desc: '子どもを守るサイト設計', icon: '🛡️' },
                { label: 'すべての家族に', desc: '多様な家族に寄り添う', icon: '🏠' },
              ].map((item) => (
                <div key={item.label} className="group">
                  <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform duration-300 inline-block">{item.icon}</span>
                  <p className="font-bold text-[var(--color-primary)]">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
            <Link
              href="/editorial-policy"
              className="inline-flex items-center gap-2 mt-8 bg-[var(--color-primary)] text-white text-sm font-medium px-6 py-3 rounded-lg hover:opacity-90 transition-all hover:shadow-md hover:shadow-orange-200/50"
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
