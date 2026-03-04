import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { AGE_STAGES, getStageById } from '@/data/stages';
import { getArticlesByStage } from '@/data/articles';
import { CATEGORIES } from '@/data/categories';
import { AgeStage } from '@/types';
import ArticleCard from '@/components/articles/ArticleCard';
import StageBadge from '@/components/ui/StageBadge';

interface PageProps {
  params: Promise<{ stage: string }>;
}

export function generateStaticParams() {
  return AGE_STAGES.map((s) => ({ stage: s.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { stage: stageId } = await params;
  const stage = AGE_STAGES.find((s) => s.id === stageId);
  if (!stage) return { title: 'ページが見つかりません' };

  return {
    title: `${stage.label}（${stage.ageRange}）年齢別ガイド`,
    description: `${stage.ageRange}のお子さまに関する情報をまとめました。${stage.description}`,
  };
}

export default async function AgeGuidePage({ params }: PageProps) {
  const { stage: stageId } = await params;
  const stage = AGE_STAGES.find((s) => s.id === stageId);
  if (!stage) notFound();

  const articles = getArticlesByStage(stageId);
  const stageInfo = getStageById(stageId as AgeStage);

  return (
    <div>
      {/* Hero Banner */}
      <section
        className="py-12 md:py-20"
        style={{ backgroundColor: stage.colorLight }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-700">TOP</Link>
            <span className="mx-2">/</span>
            <span>年齢別ガイド</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-700">{stage.label}</span>
          </nav>

          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold shrink-0"
              style={{ backgroundColor: stage.color }}
            >
              {stage.ageRange.split('〜')[0]}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {stage.label}
              </h1>
              <p className="text-lg text-gray-600 mt-1">{stage.ageRange}</p>
              <p className="text-gray-500 mt-2 max-w-2xl">{stage.description}</p>
            </div>
          </div>

          {/* Themes */}
          <div className="mt-6 flex flex-wrap gap-2">
            {stage.themes.map((theme) => (
              <span
                key={theme}
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: stage.color, color: '#1a1a2e' }}
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Guide Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {stage.ageRange}の記事
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({articles.length}件)
              </span>
            </h2>

            {articles.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-400">この年齢帯の記事はまだありません</p>
                <Link href="/articles" className="text-sm text-[var(--color-primary)] hover:underline mt-2 inline-block">
                  すべての記事を見る
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            {/* Age Guide Box */}
            <div
              className="rounded-xl p-6 mb-6"
              style={{ backgroundColor: stageInfo.colorLight }}
            >
              <h3 className="font-bold text-gray-900 mb-3">
                {stage.ageRange}のこの時期に知っておきたいこと
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {stage.id === '0stage' && (
                  <>
                    <li>- 月齢ごとの発達の目安と個人差</li>
                    <li>- 睡眠リズムの整え方</li>
                    <li>- 離乳食の進め方</li>
                    <li>- 予防接種スケジュール</li>
                    <li>- 保育園選びのポイント</li>
                  </>
                )}
                {stage.id === 'pre' && (
                  <>
                    <li>- 遊びを通じた学びの大切さ</li>
                    <li>- ことばの発達を促す関わり方</li>
                    <li>- 幼稚園・保育園選び</li>
                    <li>- トイレトレーニング</li>
                    <li>- 友達との関わりの始まり</li>
                  </>
                )}
                {stage.id === 'early' && (
                  <>
                    <li>- 小学校入学準備</li>
                    <li>- 読み書き・算数の基礎</li>
                    <li>- 家庭学習の習慣づくり</li>
                    <li>- 生活リズムの確立</li>
                    <li>- 安全な通学のための教育</li>
                  </>
                )}
                {stage.id === 'mid' && (
                  <>
                    <li>- 学習内容の高度化への対応</li>
                    <li>- 習い事の選び方</li>
                    <li>- 友人関係の悩みへの寄り添い</li>
                    <li>- デジタルリテラシーの基礎</li>
                    <li>- 自己肯定感を育む関わり</li>
                  </>
                )}
                {stage.id === 'upper' && (
                  <>
                    <li>- 中学進学に向けた準備</li>
                    <li>- 自主学習力の育成</li>
                    <li>- 思春期のメンタルケア</li>
                    <li>- SNSとの向き合い方</li>
                    <li>- 受験を考える際のポイント</li>
                  </>
                )}
              </ul>
            </div>

            {/* Category Links */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-3">カテゴリから探す</h3>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/articles?category=${cat.id}`}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Other Stages */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-3">他の年齢帯</h3>
              <div className="space-y-2">
                {AGE_STAGES.filter((s) => s.id !== stageId).map((s) => (
                  <Link
                    key={s.id}
                    href={`/age-guide/${s.id}`}
                    className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: s.color }}
                    >
                      {s.ageRange.split('〜')[0]}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{s.label}</p>
                      <p className="text-xs text-gray-500">{s.ageRange}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
