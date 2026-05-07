import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: '編集部について',
  description: '012.kids編集部についてのご紹介。公的機関や専門家の発信情報をもとに、子育てに役立つ情報をわかりやすくまとめています。',
  alternates: { canonical: 'https://012.kids/editorial-team' },
  openGraph: {
    title: '編集部について | 012.kids',
    description: '012.kids編集部についてのご紹介。公的機関や専門家の発信情報をもとに、子育てに役立つ情報をわかりやすくまとめています。',
    url: 'https://012.kids/editorial-team',
  },
};

export default function EditorialTeamPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: '編集部について' }]} />
      <h1 className="text-3xl text-[var(--color-foreground)] mb-2" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>編集部について</h1>
      <p className="text-[var(--color-foreground-muted)] mb-8">
        012.kidsの記事は、編集部が公的機関や専門家の発信情報をもとに独自にまとめています。
      </p>

      <div className="bg-[var(--color-warm-cream)] rounded-xl p-6 mb-8">
        <h2 className="text-lg text-[var(--color-foreground)] mb-3" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>012.kids 編集部</h2>
        <p className="text-sm text-[var(--color-foreground)] leading-relaxed">
          012.kidsは、0歳から12歳の子どもに関わるすべての方に向けて、
          子育て・教育に関する公的機関（厚生労働省、文部科学省、WHO など）や
          専門家の発信情報をわかりやすくまとめて紹介する「情報まとめサイト」です。
        </p>
        <p className="text-sm text-[var(--color-foreground)] leading-relaxed mt-3">
          掲載している記事は、編集部が各種情報源をもとに独自にまとめたものです。
          各機関や専門家が当サイトの記事を直接監修・承認しているわけではありません。
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-[var(--color-surface)] border border-[var(--color-paper-edge)] rounded-xl p-6">
          <h3 className="text-[var(--color-foreground)] mb-2" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>記事の作成プロセス</h3>
          <ol className="space-y-2 text-sm text-[var(--color-foreground)] list-decimal list-inside">
            <li>公的機関や専門家の発信情報を収集・調査</li>
            <li>情報をわかりやすくまとめて記事を作成</li>
            <li>参考にした情報源を明記</li>
            <li>定期的に内容を見直し・更新</li>
          </ol>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-paper-edge)] rounded-xl p-6">
          <h3 className="text-[var(--color-foreground)] mb-2" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>お問い合わせ</h3>
          <p className="text-sm text-[var(--color-foreground)] mb-3">
            記事の誤りや改善のご提案がありましたら、お気軽にご連絡ください。
          </p>
          <Link
            href="/contact"
            className="inline-block text-sm font-medium text-[var(--color-primary-dark)] hover:underline"
          >
            お問い合わせフォームへ →
          </Link>
        </div>
      </div>
    </div>
  );
}
