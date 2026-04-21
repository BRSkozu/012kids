import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AGE_STAGES } from '@/data/stages';
import { ABOUT_PHOTO } from '@/data/photos';
import Breadcrumb from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'このサイトについて',
  description: '012.kidsは0歳から12歳の子どもに関わるすべての方に向けて、公的機関や専門家の情報をわかりやすくまとめて紹介する情報サイトです。',
  alternates: { canonical: 'https://012.kids/about' },
  openGraph: {
    title: 'このサイトについて | 012.kids',
    description: '012.kidsは0歳から12歳の子どもに関わるすべての方に向けて、公的機関や専門家の情報をわかりやすくまとめて紹介する情報サイトです。',
    url: 'https://012.kids/about',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'このサイトについて' }]} />
      <h1
        className="text-3xl text-[var(--color-foreground)] mb-8"
        style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
      >
        このサイトについて
      </h1>

      {/* What is this site */}
      <section className="mb-12">
        <div className="bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] rounded-xl p-6 mb-8 relative overflow-hidden">
          <div className="lamp-glow top-[-4rem] right-[-4rem] w-[14rem] h-[14rem] bg-[#F5D9B1] opacity-40 pointer-events-none" />
          <h2
            className="relative text-lg text-[var(--color-primary-dark)] mb-3"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
          >
            012.kidsは「情報まとめサイト」です
          </h2>
          <p className="relative text-sm text-[var(--color-foreground)] leading-relaxed">
            当サイトは、子育て・教育に関する公的機関（厚生労働省、文部科学省、WHO など）や
            専門家の発信情報を、子育て中のパパ・ママにわかりやすい形でまとめて紹介するサイトです。
          </p>
          <p className="relative text-sm text-[var(--color-foreground-soft)] leading-relaxed mt-2">
            掲載している記事は、012.kids編集部が各種情報源をもとに独自にまとめたものです。
            各機関や専門家が当サイトの記事を直接監修・承認しているわけではありません。
            元の情報については、各記事の「参考にした情報」欄をご確認ください。
          </p>
        </div>
      </section>

      {/* Domain Meaning */}
      <section className="mb-12">
        <h2
          className="text-xl text-[var(--color-foreground)] mb-4"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
        >
          「012.kids」に込めた想い
        </h2>
        <div className="bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] rounded-xl p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold shrink-0 shadow-[0_8px_18px_-10px_rgba(198,107,31,0.5)]">
              0→2
            </div>
            <div>
              <h3
                className="text-[var(--color-foreground)]"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                ステップアップの象徴
              </h3>
              <p className="text-sm text-[var(--color-foreground-soft)] leading-relaxed">
                赤ちゃんが立ち、歩き、走るように。子どもの成長に寄り添いたいという思いを込めています。
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-[0_8px_18px_-10px_rgba(198,107,31,0.5)]">
              0-12
            </div>
            <div>
              <h3
                className="text-[var(--color-foreground)]"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                0歳から12歳まで
              </h3>
              <p className="text-sm text-[var(--color-foreground-soft)] leading-relaxed">
                乳幼児から小学校卒業まで、子育ての情報をひとつのサイトで探せるようにしたいと考えています。
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-[0_8px_18px_-10px_rgba(198,107,31,0.5)]">
              .kids
            </div>
            <div>
              <h3
                className="text-[var(--color-foreground)]"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                子ども向けの安心ドメイン
              </h3>
              <p className="text-sm text-[var(--color-foreground-soft)] leading-relaxed">
                .kids ドメインは、子ども・家族向けの安心感を大切にしたドメインです。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mb-12">
        <h2
          className="text-xl text-[var(--color-foreground)] mb-4"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
        >
          やりたいこと
        </h2>
        <div className="relative bg-[var(--color-night)] text-white rounded-xl p-8 text-center overflow-hidden min-h-[240px] flex items-center justify-center">
          <Image
            src={ABOUT_PHOTO}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 896px) 100vw, 896px"
          />
          <div className="absolute inset-0 bg-[var(--color-night)]/70" />
          <div className="lamp-glow top-[-4rem] left-[-4rem] w-[16rem] h-[16rem] bg-[var(--color-primary-light)] opacity-30 pointer-events-none" />
          <div className="starry-pattern absolute inset-0 opacity-15 pointer-events-none" />
          <p
            className="relative text-xl leading-relaxed"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
          >
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
        <h2
          className="text-xl text-[var(--color-foreground)] mb-4"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
        >
          私たちがやること・やらないこと
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#DFEBE0] border border-[#C5DCC7] rounded-xl p-5">
            <h3
              className="text-[#3A6B42] mb-3"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              やること
            </h3>
            <ul className="space-y-2 text-sm text-[#3A6B42] leading-relaxed">
              <li>* 公的機関や専門家の情報をわかりやすくまとめる</li>
              <li>* 参考にした情報源を明記する</li>
              <li>* 記事内容を定期的に見直す</li>
              <li>* 誤りがあれば速やかに訂正する</li>
            </ul>
          </div>
          <div className="bg-[#F6E1E1] border border-[#E8C5C5] rounded-xl p-5">
            <h3
              className="text-[#8C3A4E] mb-3"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              やらないこと
            </h3>
            <ul className="space-y-2 text-sm text-[#8C3A4E] leading-relaxed">
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
        <h2
          className="text-xl text-[var(--color-foreground)] mb-4"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
        >
          年齢帯で情報を整理
        </h2>
        <p className="text-[var(--color-foreground-soft)] mb-4 leading-relaxed">
          お子さまの年齢に合った情報を探しやすいよう、5つの年齢帯で記事を分類しています。
        </p>
        <div className="space-y-3">
          {AGE_STAGES.map((stage) => (
            <Link
              key={stage.id}
              href={`/age-guide/${stage.id}`}
              className="flex items-center gap-4 p-4 rounded-xl hover:shadow-[0_12px_28px_-16px_rgba(31,36,57,0.25)] transition-shadow border border-[var(--color-paper-edge)]"
              style={{ backgroundColor: stage.colorLight }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0"
                style={{ backgroundColor: stage.color }}
              >
                {stage.ageRange.split('〜')[0]}
              </div>
              <div>
                <h3
                  className="text-[var(--color-foreground)]"
                  style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
                >
                  {stage.label}
                  <span className="text-sm font-normal text-[var(--color-foreground-soft)] ml-2">
                    {stage.ageRange}
                  </span>
                </h3>
                <p className="text-sm text-[var(--color-foreground-soft)] leading-relaxed">{stage.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Who is this for */}
      <section className="mb-12">
        <h2
          className="text-xl text-[var(--color-foreground)] mb-4"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
        >
          こんな方に読んでほしい
        </h2>
        <div className="space-y-3">
          {[
            '0〜12歳のお子さんを育てているパパ・ママ',
            '保育士・幼稚園教諭・小学校の先生',
            'おじいちゃん・おばあちゃん、子どもに関わるすべての方',
          ].map((desc) => (
            <div
              key={desc}
              className="bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] rounded-xl p-4"
            >
              <p className="text-sm text-[var(--color-foreground)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] rounded-xl p-8 relative overflow-hidden">
        <div className="lamp-glow top-[-4rem] right-[-4rem] w-[14rem] h-[14rem] bg-[#F5D9B1] opacity-40 pointer-events-none" />
        <p className="relative text-[var(--color-foreground-soft)] mb-4 leading-relaxed">
          編集方針について詳しく知りたい方はこちら
        </p>
        <Link href="/editorial-policy" className="btn-lamp inline-flex">
          編集方針を見る
        </Link>
      </div>
    </div>
  );
}
