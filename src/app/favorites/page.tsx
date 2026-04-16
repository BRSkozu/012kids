import { Metadata } from 'next';
import { getAllArticlesMeta } from '@/lib/articles';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FavoritesClient from './FavoritesClient';

export const metadata: Metadata = {
  title: 'お気に入りの記事',
  description: 'あなたがこの端末で保存した記事の一覧です。',
  robots: { index: false, follow: false },
};

export default function FavoritesPage() {
  const all = getAllArticlesMeta();
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'お気に入り' }]} />
      <h1
        className="text-3xl text-[var(--color-foreground)] mb-2"
        style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
      >
        お気に入りの記事
      </h1>
      <p className="text-sm text-[var(--color-foreground-soft)] mb-6 leading-relaxed">
        ♡ をタップして保存した記事の一覧です。データはこの端末にのみ保存されています。
      </p>
      <FavoritesClient articles={all} />
    </div>
  );
}
