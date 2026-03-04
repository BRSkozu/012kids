import { Metadata } from 'next';
import Link from 'next/link';
import { AGE_STAGES } from '@/data/stages';

export const metadata: Metadata = {
  title: '012.kidsについて',
  description: '012.kidsは0歳から12歳の子どもに関わるすべての大人に、偏りのない正確な最新の教育情報を届けるプラットフォームです。',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">012.kidsについて</h1>

      {/* Domain Meaning */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">ドメイン「012.kids」に込めた想い</h2>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold shrink-0">
              0→2
            </div>
            <div>
              <h3 className="font-bold text-gray-900">ステップアップの象徴</h3>
              <p className="text-sm text-gray-600">
                赤ちゃんが立ち、歩き、走るように。子どもの成長過程を段階的にサポートするという思想を表しています。
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
                乳幼児から小学校卒業まで、子育ての全期間をカバーするワンストップ情報源を目指しています。
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold shrink-0">
              .kids
            </div>
            <div>
              <h3 className="font-bold text-gray-900">子ども向けの安心TLD</h3>
              <p className="text-sm text-gray-600">
                .kids ドメインは、子ども向け・家族向けの安心・信頼を想起させるドメイン拡張子です。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">ミッション</h2>
        <div className="bg-[var(--color-primary)] text-white rounded-xl p-8 text-center">
          <p className="text-xl font-bold leading-relaxed">
            0歳から12歳の子どもに関わる
            <br />
            すべての大人に、偏りのない・正確な・
            <br />
            最新の教育情報を届ける
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">ビジョン</h2>
        <p className="text-gray-600 leading-relaxed">
          日本最大の子育て・教育情報プラットフォームとなり、子どもの成長に伴走するメディアになることを目指しています。
        </p>
      </section>

      {/* Values */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">5つの原則</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { title: '中立性', desc: '商業的偏りのない、公正な情報提供' },
            { title: '科学的根拠', desc: 'エビデンスに基づいた信頼できる情報' },
            { title: '最新性', desc: '常にアップデートされる最新情報' },
            { title: '安全性', desc: '子どもの安全を最優先に考えた設計' },
            { title: '多様性', desc: 'すべての家族形態に寄り添う情報' },
          ].map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-xl border border-gray-200 p-4 text-center"
            >
              <h3 className="font-bold text-[var(--color-primary)]">{value.title}</h3>
              <p className="text-xs text-gray-500 mt-2">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Age Stages */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">年齢帯セグメント</h2>
        <p className="text-gray-600 mb-4">
          サイト全体を5つの年齢帯で分類し、お子さまの年齢に合った情報を提供します。
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

      {/* Target Users */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">ターゲットユーザー</h2>
        <div className="space-y-3">
          {[
            { label: 'Primary', desc: '0〜12歳の子を持つ保護者（特に20代後半〜40代）' },
            { label: 'Secondary', desc: '保育士・幼稚園教諭・小学校教師・学童指導員' },
            { label: 'Tertiary', desc: '祖父母・子どもに関わるすべての大人' },
          ].map((user) => (
            <div key={user.label} className="bg-gray-50 rounded-xl p-4">
              <span className="text-xs font-medium text-[var(--color-primary)] bg-blue-50 px-2 py-0.5 rounded">
                {user.label}
              </span>
              <p className="text-sm text-gray-700 mt-1">{user.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center bg-gray-50 rounded-xl p-8">
        <p className="text-gray-600 mb-4">
          012.kidsの編集方針について詳しく知りたい方はこちら
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
