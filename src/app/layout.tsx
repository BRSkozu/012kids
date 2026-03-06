import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import './globals.css';

const siteUrl = 'https://012.kids';

export const metadata: Metadata = {
  title: {
    default: '012.kids - 子育て・教育情報まとめサイト',
    template: '%s | 012.kids',
  },
  description:
    '0歳から12歳の子どもに関わるすべての方に向けて、公的機関や専門家の発信する子育て・教育情報をわかりやすくまとめて紹介するサイトです。',
  keywords: [
    '子育て',
    '育児',
    '教育',
    '乳幼児',
    '小学生',
    '発達',
    '食育',
    '健康',
    '子ども',
    '012kids',
    '情報まとめ',
  ],
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: '012.kids - 子育て・教育情報まとめサイト',
    description: '0歳から12歳の成長に寄り添う、子育て・教育情報まとめ',
    siteName: '012.kids',
    locale: 'ja_JP',
    type: 'website',
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/ogp.png`,
        width: 1200,
        height: 630,
        alt: '012.kids - 子育て・教育情報まとめサイト',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '012.kids - 子育て・教育情報まとめサイト',
    description: '0歳から12歳の成長に寄り添う、子育て・教育情報まとめ',
    images: [`${siteUrl}/ogp.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    types: {
      'application/rss+xml': `${siteUrl}/feed.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: '012.kids',
              url: 'https://012.kids',
              description: '0歳から12歳の子どもに関わるすべての方に向けて、子育て・教育情報をまとめて紹介するサイト',
              publisher: {
                '@type': 'Organization',
                name: '012.kids 編集部',
                logo: { '@type': 'ImageObject', url: 'https://012.kids/ogp.png' },
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://012.kids/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
