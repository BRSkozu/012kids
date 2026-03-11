import Link from 'next/link';
import AgeSelector from '@/components/age-selector/AgeSelector';
import ArticleCard from '@/components/articles/ArticleCard';
import WorrySearchCompact from '@/components/search/WorrySearchCompact';
import { getFeaturedArticles, getLatestArticles, getAllArticlesSync, getArticleCountByCategory, getArticleCountByStage } from '@/lib/articles';
import { CATEGORIES } from '@/data/categories';
import { AGE_STAGES } from '@/data/stages';

const RECOMMENDED_LINKS = [
  { name: 'こども家庭庁', url: 'https://www.cfa.go.jp/', desc: '子ども政策の司令塔。児童手当・保育・虐待防止など', icon: '🏛️' },
  { name: '厚生労働省（母子保健）', url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kodomo/', desc: '予防接種、乳幼児健診、母子手帳の情報', icon: '🏥' },
  { name: '文部科学省（初等中等教育）', url: 'https://www.mext.go.jp/a_menu/shotou/index.htm', desc: '学習指導要領、学校教育、特別支援教育', icon: '📚' },
  { name: '国立成育医療研究センター', url: 'https://www.ncchd.go.jp/', desc: '小児医療・成育医療の研究最前線', icon: '🔬' },
  { name: '日本小児科学会', url: 'https://www.jpeds.or.jp/', desc: '子どもの病気、予防接種、こどもの救急', icon: '👨‍⚕️' },
  { name: 'e-ヘルスネット（厚労省）', url: 'https://www.e-healthnet.mhlw.go.jp/', desc: '生活習慣病予防・健康情報サイト', icon: '💚' },
  { name: '消費者庁（子どもの事故防止）', url: 'https://www.caa.go.jp/policies/policy/consumer_safety/child/', desc: '子どもの事故・製品安全情報', icon: '⚠️' },
  { name: '国立教育政策研究所', url: 'https://www.nier.go.jp/', desc: '教育に関する調査研究・データ', icon: '📊' },
  { name: '発達障害情報・支援センター', url: 'http://www.rehab.go.jp/ddis/', desc: '発達障害に関する情報提供と支援', icon: '🌱' },
  { name: '日本学校保健会', url: 'https://www.gakkohoken.jp/', desc: '学校における健康管理・保健教育', icon: '🏫' },
];

const MATOME_SECTIONS = [
  {
    title: '年齢別おすすめ記事まとめ',
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
    items: [
      { label: '離乳食・幼児食の進め方', href: '/articles?category=nutrition', desc: '月齢別の進め方、アレルギー対策、レシピ' },
      { label: '子どもの発達が気になるとき', href: '/articles?category=development', desc: '発達の目安、相談先、支援制度' },
      { label: '不登校・いじめへの対応', href: '/articles?category=mental', desc: '兆候の見つけ方、家庭での対応、専門機関' },
      { label: 'スクリーンタイムとデジタル教育', href: '/articles?category=digital', desc: 'ルール作り、安全設定、プログラミング' },
      { label: '妊娠から出産まで', href: '/articles?category=pregnancy', desc: '妊娠経過、出産準備、産後ケア' },
      { label: '共働き家庭の子育て術', href: '/articles?category=lifestyle', desc: '時短、学童、ワークライフバランス' },
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

  return (
    <>
      {/* Hero + Age Selector */}
      <AgeSelector />

      {/* Article Count Banner */}
      <section className="max-w-7xl mx-auto px-4 -mt-2 mb-8">
        <div className="bg-[var(--color-warm-cream)] rounded-xl p-5 border border-orange-100">
          <p className="text-center text-sm text-gray-600">
            012.kidsは、子育て・教育に関する公的機関や専門家の情報をわかりやすくまとめて紹介するサイトです。
          </p>
          <p className="mt-3 text-center text-base font-bold text-[var(--color-primary)]">
            現在 <span className="text-3xl">{totalCount.toLocaleString()}</span> 記事を掲載中
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500">
            {CATEGORIES.map((cat) => (
              <span key={cat.id}>
                {cat.icon} {cat.label}：{categoryCounts[cat.id] || 0}件
              </span>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-gray-400">
            {AGE_STAGES.map((stage) => (
              <span key={stage.id}>
                {stage.ageRange}：{stageCounts[stage.id] || 0}件
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Worry Search */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">お悩みから探す</h2>
        <p className="text-sm text-gray-500 mb-6">同じ悩みを持つパパ・ママの「あるある」から、役立つ記事を見つけましょう</p>
        <WorrySearchCompact />
      </section>

      {/* Matome Sections */}
      <section className="bg-[var(--color-warm-bg)] py-12">
        <div className="max-w-7xl mx-auto px-4">
          {MATOME_SECTIONS.map((section) => (
            <div key={section.title} className="mb-10 last:mb-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {section.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group block p-4 rounded-xl bg-white border border-orange-100 hover:shadow-md hover:border-orange-200 transition-all"
                  >
                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">
                      {item.label}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
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
          <div>
            <h2 className="text-2xl font-bold text-gray-900">注目の記事</h2>
            <p className="text-sm text-gray-500 mt-1">よく読まれている記事をピックアップ</p>
          </div>
          <Link
            href="/articles"
            className="text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            すべて見る →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((article) => (
            <ArticleCard key={article.id} article={article} variant="featured" />
          ))}
        </div>
      </section>

      {/* Latest Articles */}
      <section className="bg-[var(--color-warm-bg)] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">新着記事</h2>
              <p className="text-sm text-gray-500 mt-1">最近公開・更新された記事</p>
            </div>
            <Link
              href="/articles?sort=newest"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              すべて見る →
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">人気記事ランキング</h2>
        <p className="text-sm text-gray-500 mb-6">みんなに読まれている記事トップ10</p>
        <div className="space-y-3">
          {ranking.map((article, i) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-orange-100 hover:shadow-md hover:border-orange-200 transition-all"
            >
              <span
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i < 3
                    ? 'bg-[var(--color-primary)] text-white'
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
              <span className="shrink-0 text-gray-400 group-hover:text-[var(--color-primary)] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories with counts */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">カテゴリから探す</h2>
        <p className="text-sm text-gray-500 mb-8">気になるテーマの記事を見つけましょう</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/articles?category=${cat.id}`}
              className="group block p-5 rounded-xl bg-white border border-orange-100 hover:shadow-md hover:shadow-orange-100/50 hover:border-orange-200 transition-all"
            >
              <span className="text-3xl mb-3 block">{cat.icon}</span>
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
      </section>

      {/* Recommended External Links */}
      <section className="bg-blue-50/50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">おすすめ公的サイト・専門機関リンク集</h2>
          <p className="text-sm text-gray-500 mb-8">信頼できる子育て情報の一次ソースをまとめました</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {RECOMMENDED_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-4 rounded-xl bg-white border border-blue-100 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <span className="text-2xl shrink-0">{link.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                    {link.name}
                    <span className="ml-1 text-xs text-gray-400">↗</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* About Banner */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            012.kidsの約束
          </h2>
          <p className="text-sm text-gray-600 mb-6 max-w-2xl mx-auto">
            公的機関や専門家の情報をもとに、子育てに役立つ情報をわかりやすくまとめてお届けします。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8 max-w-4xl mx-auto">
            {[
              { label: '参考元の明示', desc: '情報の出どころを明記' },
              { label: '中立な立場', desc: '商業的偏りのない情報' },
              { label: '最新の情報', desc: '常にアップデート' },
              { label: '安心の設計', desc: '子どもを守るサイト設計' },
              { label: 'すべての家族に', desc: '多様な家族に寄り添う' },
            ].map((item) => (
              <div key={item.label}>
                <p className="font-bold text-[var(--color-primary)]">{item.label}</p>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link
            href="/editorial-policy"
            className="inline-block mt-8 bg-[var(--color-primary)] text-white text-sm font-medium px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            編集方針を見る
          </Link>
        </div>
      </section>
    </>
  );
}
