import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface ContactPayload {
  type?: string;
  name?: string;
  email?: string;
  articleUrl?: string;
  message?: string;
  hp?: string;
}

const TYPE_LABELS: Record<string, string> = {
  general: '一般的なお問い合わせ',
  correction: '記事の訂正依頼',
  error: '誤情報の報告',
  suggestion: '改善提案',
  collaboration: 'コラボレーション・ご提案',
};

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: Request) {
  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (body.hp) {
    return NextResponse.json({ ok: true });
  }

  const type = (body.type || 'general').trim();
  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const articleUrl = (body.articleUrl || '').trim();
  const message = (body.message || '').trim();

  if (!name || name.length > 100) {
    return NextResponse.json({ error: 'お名前を入力してください（100文字以内）' }, { status: 400 });
  }
  if (!isEmail(email) || email.length > 254) {
    return NextResponse.json({ error: '正しいメールアドレスを入力してください' }, { status: 400 });
  }
  if (!message || message.length > 5000) {
    return NextResponse.json({ error: '内容を入力してください（5000文字以内）' }, { status: 400 });
  }
  if (!TYPE_LABELS[type]) {
    return NextResponse.json({ error: '種別が不正です' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'noreply@012.kids';

  if (!apiKey || !toEmail) {
    console.log('[contact] received (no email provider configured):', {
      type, name, email, articleUrl, messageLen: message.length,
    });
    return NextResponse.json({ ok: true });
  }

  const subject = `[012.kids] ${TYPE_LABELS[type]} - ${name}`;
  const text = [
    `種別: ${TYPE_LABELS[type]}`,
    `お名前: ${name}`,
    `メール: ${email}`,
    articleUrl ? `該当記事: ${articleUrl}` : null,
    '',
    '--- 内容 ---',
    message,
  ]
    .filter(Boolean)
    .join('\n');
  const html = `
    <h2>${escapeHtml(TYPE_LABELS[type])}</h2>
    <p><strong>お名前:</strong> ${escapeHtml(name)}<br>
    <strong>メール:</strong> ${escapeHtml(email)}<br>
    ${articleUrl ? `<strong>該当記事:</strong> ${escapeHtml(articleUrl)}<br>` : ''}</p>
    <hr>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error('[contact] Resend error:', res.status, errBody);
    return NextResponse.json({ error: '送信に失敗しました。時間をおいて再度お試しください。' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
