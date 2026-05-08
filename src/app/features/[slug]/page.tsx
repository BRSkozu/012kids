import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { FEATURES, FEATURE_TYPE_LABELS, getFeatureBySlug } from '@/data/features';
import { getArticleBySlug } from '@/lib/articles';
import ArticleCard from '@/components/articles/ArticleCard';
import Breadcrumb, { generateBreadcrumbLd } from '@/components/ui/Breadcrumb';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const bp = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function generateStaticParams() {
  return FEATURES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);
  if (!feature) return { title: '特集が見つかりません' };

  const pageUrl = `https://012.kids/features/${feature.slug}`;
  return {
    title: feature.title,
    description: feature.description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${feature.title} - 012.kids`,
      description: feature.description,
      url: pageUrl,
      type: 'website',
    },
  };
}

export default async function FeaturePage({ params }: PageProps) {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);
  if (!feature) notFound();

  const articles = feature.articleSlugs
    .map((s) => getArticleBySlug(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const breadcrumbItems = [
    { label: '特集', href: '/features' },
    { label: feature.title },
  ];
  const breadcrumbLd = generateBreadcrumbLd(breadcrumbItems);
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: feature.title,
    description: feature.description,
    url: `https://012.kids/features/${feature.slug}`,
    isPartOf: { '@type': 'WebSite', name: '012.kids', url: 'https://012.kids' },
    numberOfItems: articles.length,
    hasPart: articles.map((a) => ({
      '@type': 'Article',
      headline: a.title,
      url: `https://012.kids/articles/${a.slug}`,
      datePublished: a.publishedAt,
      dateModified: a.updatedAt,
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />

      <section className="relative py-12 md:py-16 overflow-hidden bg-[var(--color-warm-cream)]">
        {feature.image && (
          <div className="absolute inset-0">
            <Image
              src={`${bp}${feature.image}`}
              alt=""
              fill
              className="object-cover object-center opacity-30"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,253,247,0.9)] via-[rgba(255,253,247,0.85)] to-[rgba(255,253,247,0.95)]" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
          <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-xs font-medium mb-3">
            {FEATURE_TYPE_LABELS[feature.type]}
          </span>
          <h1
            className="text-3xl md:text-4xl text-[var(--color-foreground)]"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
          >
            {feature.title}
          </h1>
          <p className="text-[var(--color-foreground-muted)] mt-3 max-w-3xl leading-relaxed">{feature.description}</p>
          {feature.tags && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {feature.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/80 text-[var(--color-foreground-soft)]">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {articles.length === 0 ? (
          <p className="text-[var(--color-foreground-muted)]">この特集の記事は準備中です。</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {articles.map((article, i) => (
              <div key={article.id} className="relative">
                <span className="absolute -top-2 -left-2 z-10 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold shadow-md">
                  {i + 1}
                </span>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
