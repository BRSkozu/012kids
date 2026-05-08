import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { FEATURES, FEATURE_TYPE_LABELS } from '@/data/features';
import Breadcrumb, { generateBreadcrumbLd } from '@/components/ui/Breadcrumb';

const PAGE_URL = 'https://012.kids/features';

export const metadata: Metadata = {
  title: '特集',
  description: '012.kids が編集した特集コレクション。地域特集（東京都23区学童など）、季節特集、深掘りシリーズで、テーマごとに記事を横串でまとめています。',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: '特集 - 012.kids',
    description: '地域・季節・深掘り別の編集特集',
    url: PAGE_URL,
    type: 'website',
  },
};

const bp = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function FeaturesIndexPage() {
  const breadcrumbItems = [{ label: '特集' }];
  const breadcrumbLd = generateBreadcrumbLd(breadcrumbItems);
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '特集',
    description: '編集による横断的なキュレーション特集',
    url: PAGE_URL,
    isPartOf: { '@type': 'WebSite', name: '012.kids', url: 'https://012.kids' },
    hasPart: FEATURES.map((f) => ({
      '@type': 'WebPage',
      name: f.title,
      url: `https://012.kids/features/${f.slug}`,
      description: f.description,
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />

      <section className="bg-gradient-to-b from-[var(--color-warm-cream)] to-[var(--color-surface)] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
          <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--color-primary-dark)] mb-2 inline-flex items-center gap-2">
            <span className="inline-block w-5 h-px bg-[var(--color-primary)]" />
            Features
          </p>
          <h1 className="text-3xl md:text-4xl text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
            特集
          </h1>
          <p className="text-[var(--color-foreground-muted)] mt-3 max-w-2xl">
            012.kids が編集したテーマ別コレクション。地域・季節・深掘りシリーズを集約しています。
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {FEATURES.length === 0 ? (
          <p className="text-[var(--color-foreground-muted)]">特集はまもなく公開します。</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <Link
                key={f.id}
                href={`/features/${f.slug}`}
                className="group block rounded-2xl overflow-hidden border border-[var(--color-paper-edge)] bg-[var(--color-surface)] hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[16/9] bg-[var(--color-warm-cream)]">
                  {f.image && (
                    <Image
                      src={`${bp}${f.image}`}
                      alt=""
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-xs font-medium text-[var(--color-primary-dark)]">
                    {FEATURE_TYPE_LABELS[f.type]}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="text-xl text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                    {f.title}
                  </h2>
                  <p className="text-sm text-[var(--color-foreground-muted)] mt-2 line-clamp-3">{f.description}</p>
                  <p className="text-xs text-[var(--color-foreground-muted)] mt-4">
                    記事 {f.articleSlugs.length} 本 / 更新 {f.updatedAt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
