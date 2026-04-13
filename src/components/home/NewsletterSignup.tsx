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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#fff6ea] via-white to-[#eef4ff] border border-orange-100 p-8 md:p-10">
        <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-orange-100/60 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-blue-100/50 blur-2xl pointer-events-none" />

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-primary)] mb-2">
              Weekly digest
            </p>
            <h2 className="text-2xl md:text-[26px] font-bold text-gray-900 leading-tight mb-3">
              週に1通、
              <br className="hidden md:block" />
              「検索する前」にそっと届く。
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              公的機関の新着情報、今週読まれた記事、季節のお悩み先取りをまとめて。
              広告なし、いつでも解除できます。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block">
              <span className="sr-only">メールアドレス</span>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-orange-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
            </label>
            <button
              type="submit"
              className="w-full bg-[var(--color-primary)] text-white text-sm font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all hover:shadow-md hover:shadow-orange-200/50"
            >
              無料で登録する
            </button>
            {status === 'success' && (
              <p className="text-xs text-green-600 text-center">
                ✓ 登録リクエストを受け付けました。配信開始時にお届けします。
              </p>
            )}
            {status === 'invalid' && (
              <p className="text-xs text-red-500 text-center">
                メールアドレスの形式をご確認ください。
              </p>
            )}
            <p className="text-[11px] text-gray-400 text-center leading-relaxed">
              登録すると<a href="/privacy" className="underline hover:text-[var(--color-primary)]">プライバシーポリシー</a>に同意したものとみなします。
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
