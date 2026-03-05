import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '編集部について',
  description: '012.kids編集部についてのご紹介。公的機関や専門家の発信情報をもとに、子育てに役立つ情報をわかりやすくまとめています。',
};

export default function EditorialTeamPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">編集部について</h1>
      <p className="text-gray-500 mb-8">
        012.kidsの記事は、編集部が公的機関や専門家の発信情報をもとに独自にまとめています。
      </p>

      <div className="bg-[var(--color-warm-cream)] rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">012.kids 編集部</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          012.kidsは、0歳から12歳の子どもに関わるすべての方に向けて、
          子育て・教育に関する公的機関（厚生労働省、文部科学省、WHO など）や
          専門家の発信情報をわかりやすくまとめて紹介する「情報まとめサイト」です。
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mt-3">
          掲載している記事は、編集部が各種情報源をもとに独自にまとめたものです。
          各機関や専門家が当サイトの記事を直接監修・承認しているわけではありません。
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-orange-100 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-2">記事の作成プロセス</h3>
          <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
            <li>公的機関や専門家の発信情報を収集・調査</li>
            <li>情報をわかりやすくまとめて記事を作成</li>
            <li>参考にした情報源を明記</li>
            <li>定期的に内容を見直し・更新</li>
          </ol>
        </div>

        <div className="bg-white border border-orange-100 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-2">お問い合わせ</h3>
          <p className="text-sm text-gray-700 mb-3">
            記事の誤りや改善のご提案がありましたら、お気軽にご連絡ください。
          </p>
          <Link
            href="/contact"
            className="inline-block text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            お問い合わせフォームへ →
          </Link>
        </div>
      </div>
    </div>
  );
}
