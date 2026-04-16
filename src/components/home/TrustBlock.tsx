import Link from 'next/link';

export default function TrustBlock() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-paper-edge)] bg-[var(--color-warm-cream)] p-6 md:p-8">
        <div className="lamp-glow top-[-5rem] right-[-3rem] w-[14rem] h-[14rem] bg-[#F5D9B1] opacity-35 pointer-events-none" />
        <p
          className="relative inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--color-primary-dark)] mb-2"
          style={{ fontFamily: 'var(--font-gothic)' }}
        >
          <span className="inline-block w-5 h-px bg-[var(--color-primary)]" />
          Trust
        </p>
        <h2
          className="relative text-xl text-[var(--color-foreground)] mb-4"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
        >
          安心して読める理由
        </h2>
        <ul className="relative space-y-2.5 text-sm text-[var(--color-foreground-soft)] leading-[1.85]">
          {[
            '公的機関・専門家の情報をもとに作成しています',
            '参考元を記事内に明記しています',
            '定期的に内容を見直し・更新しています',
          ].map((text) => (
            <li key={text} className="flex items-start gap-2.5">
              <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[var(--color-surface)] border border-[var(--color-paper-edge)] flex items-center justify-center">
                <svg className="w-3 h-3 text-[var(--color-primary-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {text}
            </li>
          ))}
        </ul>
        <Link
          href="/editorial-policy"
          className="relative inline-flex items-center gap-1.5 mt-5 text-sm font-medium text-[var(--color-primary-dark)] hover:text-[var(--color-primary)] group"
        >
          <span className="border-b border-transparent group-hover:border-current">情報の作成方針を見る</span>
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
