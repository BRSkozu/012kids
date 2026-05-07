import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { AGE_STAGES } from '@/data/stages';
import { getStagePhoto } from '@/data/photos';
import { getArticleCountByStage } from '@/lib/articles';
import Breadcrumb, { generateBreadcrumbLd } from '@/components/ui/Breadcrumb';

const PAGE_URL = 'https://012.kids/age-guide';

export const metadata: Metadata = {
  title: '年齢別ガイド一覧',
  description: '0〜12歳のお子さま向けに、5つの年齢ステージごとの子育て・教育情報をまとめました。年齢に合った記事を一覧でご覧いただけます。',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: '年齢別ガイド一覧 - 012.kids',
    description: '0〜12歳の5ステージ別に子育て・教育情報を整理しています',
    url: PAGE_URL,
    type: 'website',
  },
};

export default function AgeGuideIndexPage() {
  const counts = getArticleCountByStage();
  const breadcrumbItems = [{ label: '年齢別ガイド' }];
  const breadcrumbLd = generateBreadcrumbLd(breadcrumbItems);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <section className="bg-gradient-to-b from-[var(--color-warm-cream)] to-[var(--color-surface)] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl md:text-4xl text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
            年齢別ガイド
          </h1>
          <p className="text-[var(--color-foreground-muted)] mt-3 max-w-2xl">
            0歳から12歳までを5つの成長ステージに分け、それぞれに合った子育て・教育情報をまとめました。
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AGE_STAGES.map((stage) => {
            const count = counts[stage.id] ?? 0;
            const photo = getStagePhoto(stage.id);
            return (
              <Link
                key={stage.id}
                href={`/age-guide/${stage.id}`}
                className="group block rounded-2xl overflow-hidden border border-[var(--color-paper-edge)] bg-[var(--color-surface)] hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[16/9]" style={{ backgroundColor: stage.colorLight }}>
                  {photo && (
                    <Image
                      src={photo}
                      alt=""
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  <div
                    className="absolute top-3 left-3 w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-md"
                    style={{ backgroundColor: stage.color, color: '#1a1a2e' }}
                  >
                    {stage.ageRange.split('〜')[0]}
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-xl text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                    {stage.label}
                  </h2>
                  <p className="text-sm text-[var(--color-foreground-soft)] mt-1">{stage.ageRange}</p>
                  <p className="text-sm text-[var(--color-foreground-muted)] mt-2 line-clamp-2">{stage.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {stage.themes.slice(0, 4).map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-warm-cream)] text-[var(--color-foreground-soft)]">
                        {t}
                      </span>
                    ))}
                  </div>
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
