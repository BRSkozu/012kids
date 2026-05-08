import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/data/categories';
import { getCategoryPhoto } from '@/data/photos';
import { getArticleCountByCategory } from '@/lib/articles';
import Breadcrumb, { generateBreadcrumbLd } from '@/components/ui/Breadcrumb';

const PAGE_URL = 'https://012.kids/category';

export const metadata: Metadata = {
  title: 'カテゴリ一覧',
  description: '発達・食育・教育・健康・メンタル・デジタル・社会・暮らし・妊娠出産の9カテゴリ別に、子育て情報を整理しています。',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'カテゴリ一覧 - 012.kids',
    description: '9カテゴリで子育て情報を整理しています',
    url: PAGE_URL,
    type: 'website',
  },
};

export default function CategoryIndexPage() {
  const counts = getArticleCountByCategory();
  const breadcrumbItems = [{ label: 'カテゴリ' }];
  const breadcrumbLd = generateBreadcrumbLd(breadcrumbItems);
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'カテゴリ一覧',
    description: '発達・食育・教育・健康・メンタル・デジタル・社会・暮らし・妊娠出産の9カテゴリ',
    url: PAGE_URL,
    isPartOf: { '@type': 'WebSite', name: '012.kids', url: 'https://012.kids' },
    hasPart: CATEGORIES.map((c) => ({
      '@type': 'WebPage',
      name: c.label,
      url: `https://012.kids/category/${c.id}`,
      description: c.description,
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />

      <section className="bg-gradient-to-b from-[var(--color-warm-cream)] to-[var(--color-surface)] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl md:text-4xl text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
            カテゴリから探す
          </h1>
          <p className="text-[var(--color-foreground-muted)] mt-3 max-w-2xl">
            子育て・教育に関する情報を9つのカテゴリに分けて整理しています。気になるテーマからお選びください。
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const count = counts[cat.id] ?? 0;
            const photo = getCategoryPhoto(cat.id);
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="group block rounded-2xl overflow-hidden border border-[var(--color-paper-edge)] bg-[var(--color-surface)] hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[16/9] bg-[var(--color-warm-cream)]">
                  {photo && (
                    <Image
                      src={photo}
                      alt=""
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  <div className="absolute top-3 left-3 w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/90 shadow-md">
                    {cat.icon}
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-xl text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                    {cat.label}
                  </h2>
                  <p className="text-sm text-[var(--color-foreground-muted)] mt-2 line-clamp-2">{cat.description}</p>
                  <p className="text-xs text-[var(--color-foreground-muted)] mt-4">記事 {count} 件</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
