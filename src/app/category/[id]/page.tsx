import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES, getCategoryById } from '@/data/categories';
import { getArticlesByCategory } from '@/lib/articles';
import { AGE_STAGES } from '@/data/stages';
import ArticleCard from '@/components/articles/ArticleCard';
import Breadcrumb, { generateBreadcrumbLd } from '@/components/ui/Breadcrumb';

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const cat = getCategoryById(id);
  if (!cat) return { title: 'ページが見つかりません' };

  const pageUrl = `https://012.kids/category/${cat.id}`;
  return {
    title: `${cat.label}の記事一覧 - ${cat.icon} ${cat.description}`,
    description: `${cat.label}に関する子育て・教育記事の一覧です。${cat.description}など、公的機関や専門家の情報をもとにまとめた記事を掲載しています。`,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${cat.label}の記事一覧 - 012.kids`,
      description: `${cat.description}`,
      url: pageUrl,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { id } = await params;
  const cat = getCategoryById(id);
  if (!cat) notFound();

  const articles = getArticlesByCategory(id);

  const breadcrumbItems = [
    { label: 'カテゴリ' },
    { label: cat.label, href: `/category/${cat.id}` },
  ];
  const breadcrumbLd = generateBreadcrumbLd(breadcrumbItems);

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat.label}の記事一覧`,
    description: cat.description,
    url: `https://012.kids/category/${cat.id}`,
    numberOfItems: articles.length,
    isPartOf: { '@type': 'WebSite', name: '012.kids', url: 'https://012.kids' },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-orange-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="flex items-center gap-4">
            <span className="text-5xl">{cat.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{cat.label}</h1>
              <p className="text-gray-600 mt-1">{cat.description}</p>
              <p className="text-sm text-gray-400 mt-1">{articles.length}件の記事</p>
            </div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {articles.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-400">このカテゴリの記事はまだありません</p>
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
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-3">他のカテゴリ</h3>
              <div className="space-y-1">
                {CATEGORIES.filter((c) => c.id !== id).map((c) => (
                  <Link
                    key={c.id}
                    href={`/category/${c.id}`}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-3">年齢別ガイド</h3>
              <div className="space-y-2">
                {AGE_STAGES.map((s) => (
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
