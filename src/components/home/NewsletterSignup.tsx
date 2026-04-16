'use client';

import { useState } from 'react';

/**
 * Newsletter signup block. Front-end only for now — submits to localStorage
 * so we can demonstrate the UX and iterate on copy. A real endpoint can be
 * wired in later without touching the UI.
 */
export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'invalid'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!valid) {
      setStatus('invalid');
      return;
    }
    try {
      const prev = window.localStorage.getItem('012kids_newsletter_pending');
      const list: string[] = prev ? JSON.parse(prev) : [];
      if (!list.includes(trimmed)) list.push(trimmed);
      window.localStorage.setItem('012kids_newsletter_pending', JSON.stringify(list));
    } catch {
      /* ignore */
    }
    setStatus('success');
    setEmail('');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-paper-edge)] bg-[var(--color-warm-cream)] p-8 md:p-10">
        <div className="absolute inset-0 starry-pattern opacity-50 pointer-events-none" />
        <div className="lamp-glow top-[-5rem] right-[-4rem] w-[18rem] h-[18rem] bg-[#F5D9B1] opacity-40 pointer-events-none" />
        <div className="lamp-glow bottom-[-6rem] left-[-4rem] w-[20rem] h-[20rem] bg-[#C8D1E8] opacity-30 pointer-events-none" />

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p
              className="text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--color-primary-dark)] mb-2 inline-flex items-center gap-2"
              style={{ fontFamily: 'var(--font-gothic)' }}
            >
              <span className="inline-block w-5 h-px bg-[var(--color-primary)]" />
              Weekly digest
            </p>
            <h2
              className="text-[26px] md:text-[30px] text-[var(--color-foreground)] leading-[1.3] mb-3"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              週に1通、
              <br className="hidden md:block" />
              <span className="sketched-underline text-[var(--color-primary-dark)]">「検索する前」</span>
              にそっと届く。
            </h2>
            <p className="text-sm text-[var(--color-foreground-soft)] leading-[1.9]">
              公的機関の新着情報、今週読まれた記事、季節のお悩み先取りをまとめて。
              広告なし、いつでも解除できます。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block">
              <span className="sr-only">メールアドレス</span>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  required
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[var(--color-paper-edge)] bg-[var(--color-surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
            </label>
            <button type="submit" className="btn-lamp w-full justify-center">
              無料で登録する
            </button>
            {status === 'success' && (
              <p className="text-xs text-[var(--color-primary-dark)] text-center">
                ✓ 登録リクエストを受け付けました。配信開始時にお届けします。
              </p>
            )}
            {status === 'invalid' && (
              <p className="text-xs text-[#c04444] text-center">
                メールアドレスの形式をご確認ください。
              </p>
            )}
            <p className="text-[11px] text-[var(--color-foreground-muted)] text-center leading-relaxed">
              登録すると<a href="/privacy" className="underline hover:text-[var(--color-primary-dark)]">プライバシーポリシー</a>に同意したものとみなします。
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
