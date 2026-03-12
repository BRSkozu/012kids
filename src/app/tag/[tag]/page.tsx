import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getArticlesByTag, getTagsForSSG, getAllTagsWithCounts } from '@/lib/articles';
import ArticleCard from '@/components/articles/ArticleCard';

interface PageProps {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  return getTagsForSSG(2).map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const articles = getArticlesByTag(tag);
  if (articles.length === 0) return { title: 'タグが見つかりません' };

  const pageUrl = `https://012.kids/tag/${encodeURIComponent(tag)}`;
  return {
    title: `「${tag}」の記事一覧（${articles.length}件）`,
    description: `「${tag}」に関する子育て・教育記事の一覧です。公的機関や専門家の情報をもとにまとめた${articles.length}件の記事を掲載しています。`,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `「${tag}」の記事一覧 - 012.kids`,
      description: `「${tag}」に関する子育て・教育記事${articles.length}件`,
      url: pageUrl,
      type: 'website',
    },
    robots: articles.length >= 2 ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const articles = getArticlesByTag(tag);
  if (articles.length === 0) notFound();

  const allTags = getAllTagsWithCounts().filter((t) => t.count >= 2).slice(0, 50);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'TOP', item: 'https://012.kids' },
      { '@type': 'ListItem', position: 2, name: 'タグ' },
      { '@type': 'ListItem', position: 3, name: tag },
    ],
  };

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `「${tag}」の記事一覧`,
    description: `「${tag}」に関する子育て・教育記事`,
    url: `https://012.kids/tag/${encodeURIComponent(tag)}`,
    numberOfItems: articles.length,
    isPartOf: { '@type': 'WebSite', name: '012.kids', url: 'https://012.kids' },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />

      <section className="bg-gradient-to-b from-orange-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-700">TOP</Link>
            <span className="mx-2">/</span>
            <span>タグ</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-700">#{tag}</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-[var(--color-primary)]">#</span>{tag}
          </h1>
          <p className="text-gray-500 mt-2">{articles.length}件の記事</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>

          <aside>
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">人気のタグ</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((t) => (
                  <Link
                    key={t.tag}
                    href={`/tag/${encodeURIComponent(t.tag)}`}
                    className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                      t.tag === tag
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-orange-50 text-gray-600 hover:bg-orange-100'
                    }`}
                  >
                    #{t.tag}
                    <span className="ml-1 opacity-60">{t.count}</span>
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
