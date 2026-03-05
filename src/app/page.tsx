import Link from 'next/link';
import AgeSelector from '@/components/age-selector/AgeSelector';
import ArticleCard from '@/components/articles/ArticleCard';
import { getFeaturedArticles, getLatestArticles } from '@/data/articles';
import { CATEGORIES } from '@/data/categories';
import { EXPERTS } from '@/data/experts';

export default function HomePage() {
  const featured = getFeaturedArticles();
  const latest = getLatestArticles(6);

  return (
    <>
      {/* Hero + Age Selector */}
      <AgeSelector />

      {/* Matome Site Notice */}
      <section className="max-w-7xl mx-auto px-4 -mt-2 mb-8">
        <div className="bg-[var(--color-warm-cream)] rounded-xl p-4 text-center text-sm text-gray-600 border border-orange-100">
          012.kidsは、子育て・教育に関する公的機関や専門家の情報をわかりやすくまとめて紹介するサイトです。
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

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">カテゴリから探す</h2>
        <p className="text-sm text-gray-500 mb-8">気になるテーマの記事を見つけましょう</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            </Link>
          ))}
        </div>
      </section>

      {/* Experts Preview */}
      <section className="bg-[var(--color-primary)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">編集チーム</h2>
              <p className="text-sm text-orange-200 mt-1">
                各分野の専門家が記事の執筆・監修を担当しています
              </p>
            </div>
            <Link
              href="/experts"
              className="text-sm font-medium text-orange-200 hover:text-white transition-colors"
            >
              チーム紹介 →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {EXPERTS.map((expert) => (
              <div key={expert.id} className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 mx-auto mb-2 flex items-center justify-center text-xl">
                  {expert.name[0]}
                </div>
                <p className="font-semibold text-sm">{expert.name}</p>
                <p className="text-xs text-orange-200">{expert.title}</p>
              </div>
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
