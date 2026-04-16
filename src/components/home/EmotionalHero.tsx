'use client';

import { useEffect, useState } from 'react';

/**
 * Rotating empathetic hero messages.
 * Cycles through "夜泣きで検索した夜…" style parent-worry scenarios to show
 * visitors that the site understands real moments of parenting anxiety.
 */
const EMPATHETIC_MESSAGES = [
  {
    moment: '夜泣きで検索した夜も、',
    promise: '信頼できる情報だけを。',
    tone: '#FFB3B3',
  },
  {
    moment: '離乳食が進まない朝も、',
    promise: '焦らず進める道しるべを。',
    tone: '#FFD9A0',
  },
  {
    moment: '初めての発熱で不安な夜も、',
    promise: '専門家の根拠ある答えを。',
    tone: '#FFB3B3',
  },
  {
    moment: '「うちの子、大丈夫?」と迷う日も、',
    promise: '発達の目安をわかりやすく。',
    tone: '#A8E6CF',
  },
  {
    moment: '小学校入学が近づく季節も、',
    promise: '先輩家庭の知恵をそっと。',
    tone: '#FFFAA0',
  },
  {
    moment: 'スマホとの付き合い方に悩む時も、',
    promise: '家族のルール作りを一緒に。',
    tone: '#A0C4FF',
  },
  {
    moment: '反抗期に心が疲れる日も、',
    promise: 'ひとりじゃないと伝えたい。',
    tone: '#A0C4FF',
  },
  {
    moment: '友達関係に悩む子どもの横で、',
    promise: '親ができることを静かに。',
    tone: '#A8E6CF',
  },
];

export default function EmotionalHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Randomize the starting message once on mount, then rotate.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex(Math.floor(Math.random() * EMPATHETIC_MESSAGES.length));
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % EMPATHETIC_MESSAGES.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  const msg = EMPATHETIC_MESSAGES[index];

  return (
    <div className="mt-6 max-w-xl mx-auto">
      <div
        key={index}
        className="relative rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-sm px-5 py-4 md:px-6 md:py-5 animate-fade-in text-left"
        style={{ borderLeft: `4px solid ${msg.tone}` }}
      >
        <p className="text-[15px] md:text-base leading-relaxed text-gray-700">
          <span className="font-medium text-gray-900">{msg.moment}</span>
          <br />
          <span className="text-[var(--color-primary)] font-bold">{msg.promise}</span>
        </p>
        <div className="mt-3 flex items-center gap-1.5" aria-hidden="true">
          {EMPATHETIC_MESSAGES.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-[var(--color-primary)]' : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-500 text-center">
        公的機関と専門家のソースを明記。広告・商業誘導なしで、あなたの「検索した夜」に寄り添います。
      </p>
    </div>
  );
}
