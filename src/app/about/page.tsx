import { Metadata } from 'next';
import Link from 'next/link';
import { AGE_STAGES } from '@/data/stages';

export const metadata: Metadata = {
  title: 'このサイトについて',
  description: '012.kidsは0歳から12歳の子どもに関わるすべての方に向けて、公的機関や専門家の情報をわかりやすくまとめて紹介する情報サイトです。',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">このサイトについて</h1>

      {/* What is this site */}
      <section className="mb-12">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-[var(--color-primary)] mb-3">012.kidsは「情報まとめサイト」です</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            当サイトは、子育て・教育に関する公的機関（厚生労働省、文部科学省、WHO など）や
            専門家の発信情報を、子育て中のパパ・ママにわかりやすい形でまとめて紹介するサイトです。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mt-2">
            掲載している記事は、012.kids編集部が各種情報源をもとに独自にまとめたものです。
            各機関や専門家が当サイトの記事を直接監修・承認しているわけではありません。
            元の情報については、各記事の「参考にした情報」欄をご確認ください。
          </p>
        </div>
      </section>

      {/* Domain Meaning */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">「012.kids」に込めた想い</h2>
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold shrink-0">
              0→2
            </div>
            <div>
              <h3 className="font-bold text-gray-900">ステップアップの象徴</h3>
              <p className="text-sm text-gray-600">
                赤ちゃんが立ち、歩き、走るように。子どもの成長に寄り添いたいという思いを込めています。
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm shrink-0">
              0-12
            </div>
            <div>
              <h3 className="font-bold text-gray-900">0歳から12歳まで</h3>
              <p className="text-sm text-gray-600">
                乳幼児から小学校卒業まで、子育ての情報をひとつのサイトで探せるようにしたいと考えています。
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold shrink-0">
              .kids
            </div>
            <div>
              <h3 className="font-bold text-gray-900">子ども向けの安心ドメイン</h3>
              <p className="text-sm text-gray-600">
                .kids ドメインは、子ども・家族向けの安心感を大切にしたドメインです。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">やりたいこと</h2>
        <div className="bg-[var(--color-primary)] text-white rounded-xl p-8 text-center">
          <p className="text-xl font-bold leading-relaxed">
            0歳から12歳の子どもに関わる
            <br />
            すべての方に、わかりやすく
            <br />
            信頼できる情報をまとめて届けたい
          </p>
        </div>
      </section>

      {/* What we do and don't do */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">私たちがやること・やらないこと</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <h3 className="font-bold text-green-800 mb-3">やること</h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li>* 公的機関や専門家の情報をわかりやすくまとめる</li>
              <li>* 参考にした情報源を明記する</li>
              <li>* 記事内容を定期的に見直す</li>
              <li>* 誤りがあれば速やかに訂正する</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <h3 className="font-bold text-red-800 mb-3">やらないこと</h3>
            <ul className="space-y-2 text-sm text-red-700">
              <li>* 医療行為の代替となるアドバイス</li>
              <li>* 特定商品・サービスへの誘導</li>
              <li>* 他機関が承認したかのような表示</li>
              <li>* 子育てに「唯一の正解」を押しつけること</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Age Stages */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">年齢帯で情報を整理</h2>
        <p className="text-gray-600 mb-4">
          お子さまの年齢に合った情報を探しやすいよう、5つの年齢帯で記事を分類しています。
        </p>
        <div className="space-y-3">
          {AGE_STAGES.map((stage) => (
            <Link
              key={stage.id}
              href={`/age-guide/${stage.id}`}
              className="flex items-center gap-4 p-4 rounded-xl hover:shadow-md transition-shadow"
              style={{ backgroundColor: stage.colorLight }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0"
                style={{ backgroundColor: stage.color }}
              >
                {stage.ageRange.split('〜')[0]}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {stage.label}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    {stage.ageRange}
                  </span>
                </h3>
                <p className="text-sm text-gray-600">{stage.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Who is this for */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">こんな方に読んでほしい</h2>
        <div className="space-y-3">
          {[
            '0〜12歳のお子さんを育てているパパ・ママ',
            '保育士・幼稚園教諭・小学校の先生',
            'おじいちゃん・おばあちゃん、子どもに関わるすべての方',
          ].map((desc) => (
            <div key={desc} className="bg-[var(--color-warm-cream)] rounded-xl p-4">
              <p className="text-sm text-gray-700">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center bg-[var(--color-warm-cream)] rounded-xl p-8">
        <p className="text-gray-600 mb-4">
          編集方針について詳しく知りたい方はこちら
        </p>
        <Link
          href="/editorial-policy"
          className="inline-block bg-[var(--color-primary)] text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          編集方針を見る
        </Link>
      </div>
    </div>
  );
}
