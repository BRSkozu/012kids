import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/ui/BackToTop';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import './globals.css';

const siteUrl = 'https://012.kids';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    canonical: siteUrl,
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#C66B1F" />
        {/* AI/LLM crawler discovery */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
        <meta name="ai-content-declaration" content="human-authored, AI-assisted editing" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&family=Noto+Sans+JP:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: '012.kids',
                url: 'https://012.kids',
                description: '0歳から12歳の子どもに関わるすべての方に向けて、子育て・教育情報をまとめて紹介するサイト',
                inLanguage: 'ja',
                publisher: { '@id': 'https://012.kids/#organization' },
                potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: 'https://012.kids/search?q={search_term_string}',
                  },
                  'query-input': 'required name=search_term_string',
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                '@id': 'https://012.kids/#organization',
                name: '012.kids 編集部',
                url: 'https://012.kids',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://012.kids/ogp.png',
                  width: 1200,
                  height: 630,
                },
                description: '0歳から12歳の子どもに関わるすべての方に向けて、公的機関や専門家の発信する子育て・教育情報をわかりやすくまとめて紹介するサイトです。',
              },
            ]),
          }}
        />
      </head>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[var(--color-primary)] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
        >
          メインコンテンツへスキップ
        </a>
        <GoogleAnalytics />
        <Header />
        <main id="main-content" className="min-h-screen">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
