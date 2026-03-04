import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '012.kids - 子ども向け総合教育情報プラットフォーム',
    template: '%s | 012.kids',
  },
  description:
    '0歳から12歳の子どもに関わるすべての大人に、偏りのない正確な最新の教育情報を届ける。発達・食育・教育・健康・メンタルなど、信頼できる情報を年齢別に整理して提供します。',
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
  ],
  openGraph: {
    title: '012.kids - 子ども向け総合教育情報プラットフォーム',
    description: '0歳から12歳の成長に寄り添う、信頼できる教育情報',
    siteName: '012.kids',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '012.kids - 子ども向け総合教育情報プラットフォーム',
    description: '0歳から12歳の成長に寄り添う、信頼できる教育情報',
  },
  robots: {
    index: true,
    follow: true,
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
      </head>
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
