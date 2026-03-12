import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '記事を検索 - キーワード・お悩みから探す',
  description:
    'キーワードやお悩みから、子育て・教育に関する記事を検索できます。離乳食、発達、習い事、アレルギーなど気になるテーマで探してみましょう。',
  alternates: {
    canonical: 'https://012.kids/search',
  },
  openGraph: {
    title: '記事を検索 - 012.kids',
    description: 'キーワードやお悩みから子育て・教育の記事を検索',
    url: 'https://012.kids/search',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
