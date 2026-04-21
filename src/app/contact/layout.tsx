import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'お問い合わせ・訂正依頼',
  description: '012.kidsへのお問い合わせ、記事の訂正依頼、改善提案はこちらからお送りください。',
  alternates: { canonical: 'https://012.kids/contact' },
  openGraph: {
    title: 'お問い合わせ | 012.kids',
    description: '012.kidsへのお問い合わせ、記事の訂正依頼、改善提案はこちらからお送りください。',
    url: 'https://012.kids/contact',
  },
  robots: { index: false, follow: true },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
