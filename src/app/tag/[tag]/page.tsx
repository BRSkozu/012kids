import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getArticlesByTag, getTagsForSSG, getAllTagsWithCounts } from '@/lib/articles';
import ArticleCard from '@/components/articles/ArticleCard';
import Breadcrumb, { generateBreadcrumbLd } from '@/components/ui/Breadcrumb';

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
      images: [{ url: 'https://012.kids/ogp.png', width: 1200, height: 630 }],
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

  const breadcrumbItems = [
    { label: 'タグ' },
    { label: `#${tag}` },
  ];
  const breadcrumbLd = generateBreadcrumbLd(breadcrumbItems);

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

      <section className="bg-gradient-to-b from-[var(--color-warm-cream)] to-[var(--color-surface)] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />

          <h1 className="text-3xl text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
            <span className="text-[var(--color-primary-dark)]">#</span>{tag}
          </h1>
          <p className="text-[var(--color-foreground-muted)] mt-2">{articles.length}件の記事</p>
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
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-paper-edge)] p-6 sticky top-4">
              <h3 className="text-[var(--color-foreground)] mb-4" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>人気のタグ</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((t) => (
                  <Link
                    key={t.tag}
                    href={`/tag/${encodeURIComponent(t.tag)}`}
                    className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                      t.tag === tag
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-warm-cream)] text-[var(--color-foreground-soft)] hover:bg-[var(--color-surface)]'
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
