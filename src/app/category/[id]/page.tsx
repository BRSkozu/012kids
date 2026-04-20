import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CATEGORIES, getCategoryById } from '@/data/categories';
import { getArticlesByCategory } from '@/lib/articles';
import { AGE_STAGES } from '@/data/stages';
import { getCategoryPhoto } from '@/data/photos';
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
      <section className="relative bg-gradient-to-b from-[var(--color-warm-cream)] to-[var(--color-surface)] py-12 overflow-hidden">
        {getCategoryPhoto(id) && (
          <div className="absolute inset-0">
            <Image
              src={getCategoryPhoto(id)!}
              alt=""
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(255,253,247,0.92)] via-[rgba(255,253,247,0.85)] to-[rgba(255,253,247,0.6)]" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="flex items-center gap-4">
            <span className="text-5xl drop-shadow-sm">{cat.icon}</span>
            <div>
              <h1 className="text-3xl text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>{cat.label}</h1>
              <p className="text-[var(--color-foreground-soft)] mt-1">{cat.description}</p>
              <p className="text-sm text-[var(--color-foreground-muted)] mt-1">{articles.length}件の記事</p>
            </div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {articles.length === 0 ? (
              <div className="text-center py-12 bg-[var(--color-warm-cream)] rounded-xl">
                <p className="text-[var(--color-foreground-muted)]">このカテゴリの記事はまだありません</p>
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
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-paper-edge)] p-6 mb-6">
              <h3 className="text-[var(--color-foreground)] mb-3" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>他のカテゴリ</h3>
              <div className="space-y-1">
                {CATEGORIES.filter((c) => c.id !== id).map((c) => (
                  <Link
                    key={c.id}
                    href={`/category/${c.id}`}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-[var(--color-foreground-soft)] hover:bg-[var(--color-warm-cream)] transition-colors"
                  >
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-paper-edge)] p-6">
              <h3 className="text-[var(--color-foreground)] mb-3" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>年齢別ガイド</h3>
              <div className="space-y-2">
                {AGE_STAGES.map((s) => (
                  <Link
                    key={s.id}
                    href={`/age-guide/${s.id}`}
                    className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[var(--color-warm-cream)] transition-colors"
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: s.color }}
                    >
                      {s.ageRange.split('〜')[0]}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-foreground)]">{s.label}</p>
                      <p className="text-xs text-[var(--color-foreground-muted)]">{s.ageRange}</p>
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
