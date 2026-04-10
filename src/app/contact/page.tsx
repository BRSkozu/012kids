'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    type: 'general',
    name: '',
    email: '',
    articleUrl: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to an API
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">送信完了</h1>
        <p className="text-gray-500">
          お問い合わせありがとうございます。内容を確認の上、必要に応じてご連絡いたします。
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'お問い合わせ' }]} />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">お問い合わせ・訂正依頼</h1>
      <p className="text-gray-500 mb-8">
        記事の誤り、改善提案、その他お問い合わせはこちらからお送りください。
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            お問い合わせ種別
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm"
          >
            <option value="general">一般的なお問い合わせ</option>
            <option value="correction">記事の訂正依頼</option>
            <option value="error">誤情報の報告</option>
            <option value="suggestion">改善提案</option>
            <option value="collaboration">コラボレーション・ご提案</option>
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            お名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
            placeholder="田中 太郎"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
            placeholder="example@email.com"
          />
        </div>

        {/* Article URL */}
        {(formData.type === 'correction' || formData.type === 'error') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              該当記事のURL
            </label>
            <input
              type="url"
              value={formData.articleUrl}
              onChange={(e) => setFormData({ ...formData, articleUrl: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
              placeholder="https://012.kids/articles/..."
            />
          </div>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm resize-vertical"
            placeholder="お問い合わせ内容をご記入ください"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[var(--color-primary)] text-white font-medium py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          送信する
        </button>
      </form>

      <div className="mt-8 p-4 bg-gray-50 rounded-xl text-xs text-gray-500">
        <p className="font-medium mb-1">個人情報の取り扱いについて</p>
        <p>
          お預かりした個人情報は、お問い合わせへの回答にのみ使用し、第三者への提供は行いません。
          詳しくは個人情報保護方針をご確認ください。
        </p>
      </div>
    </div>
  );
}
