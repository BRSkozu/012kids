import { Metadata } from 'next';
import Link from 'next/link';
import GakudoComparisonTable from '@/components/gakudo/GakudoComparisonTable';
import Breadcrumb, { generateBreadcrumbLd } from '@/components/ui/Breadcrumb';
import { GAKUDO_DATA } from '@/data/gakudo';
import { getArticleBySlug } from '@/lib/articles';

const bp = process.env.NEXT_PUBLIC_BASE_PATH || '';
const pageUrl = 'https://012.kids/gakudo';

export const metadata: Metadata = {
  title: '東京都23区 学童保育 一覧・比較',
  description:
    '東京都23区の学童保育（放課後児童クラブ・全児童型放課後事業）を一覧で比較。利用料・時間・対象学年・制度モデルを整理しました。',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: '東京都23区 学童保育 一覧・比較 - 012.kids',
    description:
      '23区の学童保育の制度を一覧で比較。利用料・時間・対象学年・制度モデルを整理しました。',
    url: pageUrl,
    type: 'website',
  },
};

export default function GakudoIndexPage() {
  const breadcrumbItems = [{ label: '23区学童一覧' }];
  const breadcrumbLd = generateBreadcrumbLd(breadcrumbItems);

  const wardsWithArticles = GAKUDO_DATA.filter((w) => w.articleSlug);
  const articleCards = wardsWithArticles
    .map((w) => {
      const article = w.articleSlug ? getArticleBySlug(w.articleSlug) : null;
      return article ? { ward: w.ward, article } : null;
    })
    .filter((x): x is { ward: string; article: NonNullable<ReturnType<typeof getArticleBySlug>> } => Boolean(x));

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <section className="bg-[var(--color-warm-cream)] py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
          <h1
            className="text-3xl md:text-4xl text-[var(--color-foreground)]"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
          >
            東京都23区 学童保育 一覧・比較
          </h1>
          <p className="text-[var(--color-foreground-muted)] mt-3 max-w-3xl leading-relaxed">
            23区の学童保育の制度・利用料・時間・対象学年を一覧で確認できます。
            012.kids
            では順次各区の詳細解説記事を公開中。最新の数値は必ず各区公式サイトでご確認ください。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`${bp}/features/tokyo-23ku-gakudo`}
              className="text-sm px-3 py-1.5 rounded-full bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
            >
              特集ページへ →
            </Link>
            <Link
              href={`${bp}/articles/tokyo-23ku-gakudo-overview`}
              className="text-sm px-3 py-1.5 rounded-full bg-white border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-warm-cream)] transition-colors"
            >
              23区 学童 概観記事 →
            </Link>
            <Link
              href={`${bp}/articles/sho1wall-complete-guide`}
              className="text-sm px-3 py-1.5 rounded-full bg-white border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-warm-cream)] transition-colors"
            >
              小1の壁 完全ガイド →
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <GakudoComparisonTable />
      </section>

      {articleCards.length > 0 && (
        <section className="bg-[var(--color-warm-cream)] py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4">
            <h2
              className="text-2xl md:text-3xl text-[var(--color-foreground)] mb-6"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              区別 詳細記事
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articleCards.map(({ ward, article }) => (
                <Link
                  key={article.slug}
                  href={`${bp}/articles/${article.slug}`}
                  className="block bg-white rounded-lg p-4 border border-[var(--color-border)] hover:shadow-md transition-shadow"
                >
                  <div className="text-xs text-[var(--color-primary)] font-medium mb-1">
                    {ward}
                  </div>
                  <div className="text-sm font-semibold text-[var(--color-foreground)] mb-2 line-clamp-2">
                    {article.title}
                  </div>
                  <p className="text-xs text-[var(--color-foreground-muted)] line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
