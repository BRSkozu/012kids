# 012.kids 本番デプロイ手順

## 概要

- **ホスティング**: Vercel（メイン） / GitHub Pages（プレビュー）
- **ドメイン**: 012.kids（お名前.com で管理）
- **SSL**: Vercel が自動で Let's Encrypt 証明書を発行

---

## 環境変数

`.env.example` にすべての環境変数のサンプルを記載しています。ローカル開発では `.env.local` にコピーしてください。Vercel では Project Settings → Environment Variables から設定します。

| 変数 | 必須 | 用途 |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | 推奨 | Google Analytics 4 測定 ID |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | 任意 | お問い合わせ送信先のオーバーライド（GitHub Pages 用） |
| `RESEND_API_KEY` | 任意 | Resend で問い合わせメールを送信する場合 |
| `CONTACT_TO_EMAIL` | `RESEND_API_KEY` 設定時必須 | 問い合わせの宛先 |
| `CONTACT_FROM_EMAIL` | 任意 | 送信元（既定: `noreply@012.kids`） |
| `GITHUB_PAGES` | GH Pages のみ | 静的書き出しモードを有効化 |
| `NEXT_PUBLIC_BASE_PATH` | GH Pages のみ | サブパス配信用（例: `/012kids`） |
| `SHOW_DRAFTS` | ローカルのみ | 下書き記事を表示 |

> 注: GitHub Pages デプロイでは `/api/contact` が使えないため、`NEXT_PUBLIC_CONTACT_ENDPOINT` に Formspree 等の外部フォームサービス URL を設定してください。

---

## ステップ1: Vercel にプロジェクトを接続

1. [vercel.com](https://vercel.com) にアクセスし、GitHub アカウントでログイン
2. 「Add New Project」→ GitHub リポジトリ `012kids` をインポート
3. 設定はデフォルトのままでOK（Next.js を自動検出）
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`（自動検出）
   - Output Directory: 自動
4. 「Deploy」をクリック

これで `012kids-xxxxx.vercel.app` のような仮URLでサイトが公開されます。

---

## ステップ2: Vercel にカスタムドメインを設定

1. Vercel ダッシュボード → プロジェクト → 「Settings」→「Domains」
2. `012.kids` を入力して「Add」
3. Vercel が必要な DNS レコードを表示してくれます（通常は以下）：

### 設定するDNSレコード

| タイプ | ホスト名 | 値 |
|--------|---------|-----|
| **A** | `@`（空 or `012.kids`） | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

> ※ Vercel の画面に表示されるIPアドレスを必ず確認してください。変更される場合があります。

---

## ステップ3: お名前.com で DNS 設定

### 手順

1. [お名前.com Navi](https://navi.onamae.com/) にログイン
2. 「ドメイン一覧」→ `012.kids` を選択
3. 「DNS設定/転送設定」→「DNSレコード設定を利用する」→「設定する」
4. 以下のレコードを追加：

#### A レコード（ルートドメイン）
- **ホスト名**: （空欄のまま）
- **TYPE**: A
- **VALUE**: `76.76.21.21`
- **TTL**: 3600

#### CNAME レコード（www サブドメイン）
- **ホスト名**: `www`
- **TYPE**: CNAME
- **VALUE**: `cname.vercel-dns.com`
- **TTL**: 3600

5. 「追加」→「確認画面へ進む」→「設定する」

### 既存のレコードについて
- ペパボ等の既存 A レコード / ネームサーバー設定がある場合は、
  **Vercel 向けのレコードに変更（上書き）** してください
- お名前.com のネームサーバーを使う場合はそのままでOK
- もしペパボのネームサーバーを使っている場合は、
  お名前.com のネームサーバーに戻す必要があります：
  - `dns1.onamae.com`
  - `dns2.onamae.com`

---

## ステップ4: SSL 証明書の確認

1. DNS 設定後、Vercel が自動で SSL 証明書を発行します（数分〜最大48時間）
2. Vercel ダッシュボード → Domains で「Valid Configuration」の緑チェックを確認
3. `https://012.kids` にアクセスして表示を確認

---

## ステップ5: 動作確認チェックリスト

- [ ] `https://012.kids` でトップページが表示される
- [ ] `https://www.012.kids` が `https://012.kids` にリダイレクトされる
- [ ] 記事ページ（例: `/articles/baby-sleep-training-guide`）が表示される
- [ ] OGP画像が正しく表示される（[OGP確認ツール](https://ogp.me/)等で確認）
- [ ] Google Search Console にサイトを登録
- [ ] Google Analytics が動作している

---

## 補足: GitHub Pages（プレビュー用）

GitHub Pages は引き続きプレビュー環境として使えます。
- URL: `https://BRSkozu.github.io/012kids/`
- main ブランチへの push で自動デプロイ
- basePath: `/012kids` 付きで動作

---

## トラブルシューティング

### DNS が反映されない
- お名前.com の DNS 反映は通常 数分〜数時間（最大72時間）
- `dig 012.kids` コマンドで現在の DNS 設定を確認可能

### SSL エラーが出る
- DNS 反映前に HTTPS アクセスするとエラーになります
- Vercel ダッシュボードの Domains ページでステータスを確認

### 既存サイトとの切り替え
- ペパボで別のサイトを運用中の場合、DNS を切り替えると旧サイトにはアクセスできなくなります
- 切り替え前に旧サイトのバックアップを取っておくことを推奨します
