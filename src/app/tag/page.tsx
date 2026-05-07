import { Metadata } from 'next';
import Link from 'next/link';
import { getAllTagsWithCounts } from '@/lib/articles';
import Breadcrumb, { generateBreadcrumbLd } from '@/components/ui/Breadcrumb';

const PAGE_URL = 'https://012.kids/tag';

export const metadata: Metadata = {
  title: 'タグ一覧',
  description: '012.kids の記事に付けられたタグの一覧です。気になるキーワードから関連記事を探せます。',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'タグ一覧 - 012.kids',
    description: '記事を横断する全タグの一覧',
    url: PAGE_URL,
    type: 'website',
  },
};

export default function TagIndexPage() {
  const tags = getAllTagsWithCounts().filter((t) => t.count >= 2);
  const total = tags.length;
  const maxCount = tags[0]?.count ?? 1;

  const breadcrumbItems = [{ label: 'タグ' }];
  const breadcrumbLd = generateBreadcrumbLd(breadcrumbItems);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <section className="bg-gradient-to-b from-[var(--color-warm-cream)] to-[var(--color-surface)] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl md:text-4xl text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
            タグから探す
          </h1>
          <p className="text-[var(--color-foreground-muted)] mt-3">
            {total} 個のタグ（2件以上の記事に付与されているもの）
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {tags.length === 0 ? (
          <p className="text-[var(--color-foreground-muted)]">タグがありません</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => {
              const weight = 0.7 + 0.6 * (t.count / maxCount);
              return (
                <Link
                  key={t.tag}
                  href={`/tag/${encodeURIComponent(t.tag)}`}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-warm-cream)] text-[var(--color-foreground-soft)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                  style={{ fontSize: `${weight}rem` }}
                >
                  <span className="opacity-60 mr-1">#</span>
                  {t.tag}
                  <span className="ml-2 text-xs opacity-60">{t.count}</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
