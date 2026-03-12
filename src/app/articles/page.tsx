import { Metadata } from 'next';
import { getAllArticlesMeta } from '@/lib/articles';
import ArticlesPageClient from './ArticlesPageClient';

export const metadata: Metadata = {
  title: '記事一覧 - 子育て・教育の全記事',
  description:
    '0歳から12歳の子育て・教育に関する記事一覧です。発達・栄養・健康・教育・デジタル・メンタルなど幅広いテーマで、公的機関や専門家の情報をもとにまとめた記事を掲載しています。',
  alternates: {
    canonical: 'https://012.kids/articles',
  },
  openGraph: {
    title: '記事一覧 - 子育て・教育の全記事',
    description: '0歳〜12歳の子育て・教育に関する記事一覧。年齢別・カテゴリ別に探せます。',
    url: 'https://012.kids/articles',
    type: 'website',
  },
};

export default function ArticlesPage() {
  const articles = getAllArticlesMeta();

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '記事一覧 - 012.kids',
    description: '0歳から12歳の子育て・教育に関する記事一覧',
    url: 'https://012.kids/articles',
    isPartOf: { '@type': 'WebSite', name: '012.kids', url: 'https://012.kids' },
    numberOfItems: articles.length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <ArticlesPageClient articles={articles} />
    </>
  );
}
