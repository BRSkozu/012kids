# 012.kids

子ども向け総合教育情報プラットフォーム

## Overview

012.kids は 0歳から12歳の子どもに関わるすべての大人に、偏りのない・正確な・最新の教育情報を届けるプラットフォームです。

- **ドメイン**: 012.kids
- **ターゲット**: 0歳〜12歳の保護者・教育者
- **コンセプト**: 成長ステップ「0・1・2」に沿った偏りのない優良教育情報の集約

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Fonts**: Noto Sans JP + Inter (Google Fonts)
- **Deployment**: Vercel / Cloudflare Pages

## Features (MVP)

- 年齢帯セレクター (0〜12歳) でパーソナライズされたコンテンツ表示
- 5つの年齢ステージ: 0 Stage, Pre Stage, Early Stage, Mid Stage, Upper Stage
- 8つのコンテンツカテゴリ: 発達・食育・教育・健康・メンタル・デジタル・社会・専門家
- AI品質スコアリング表示 (信頼性・中立性・新規性・年齢適合性・読みやすさ)
- 記事一覧 (フィルタ・ソート機能)
- 記事詳細 (出典表示・品質スコア・関連記事)
- 年齢別ガイドページ
- 全文検索 (年齢・カテゴリフィルタ)
- 専門家紹介ページ
- 編集方針ページ
- お問い合わせ・訂正依頼フォーム
- SEO最適化 (sitemap.xml, robots.txt, 構造化データ, OGP)
- レスポンシブデザイン (モバイルファースト)
- WCAG 2.1 AA 対応

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # TOP page with age selector
│   ├── articles/          # Article listing & detail
│   ├── age-guide/         # Age-based guide pages
│   ├── search/            # Search page
│   ├── about/             # About page
│   ├── editorial-policy/  # Editorial policy
│   ├── experts/           # Expert profiles
│   ├── contact/           # Contact form
│   ├── sitemap.ts         # Auto-generated sitemap
│   └── robots.ts          # robots.txt
├── components/
│   ├── layout/            # Header, Footer
│   ├── ui/                # StageBadge, ScoreBadge, CategoryTag
│   ├── articles/          # ArticleCard
│   ├── age-selector/      # AgeSelector
│   └── search/            # Search components
├── data/                  # Mock data (stages, categories, articles, experts)
└── types/                 # TypeScript type definitions
```

## Build

```bash
npm run build
```

## 5 Age Stages

| Stage | Age Range | Color |
|-------|-----------|-------|
| 0 Stage | 0〜2歳 | #FFB3B3 (Pink) |
| Pre Stage | 3〜5歳 | #FFD9A0 (Orange) |
| Early Stage | 6〜8歳 | #FFFAA0 (Yellow) |
| Mid Stage | 9〜10歳 | #A8E6CF (Green) |
| Upper Stage | 11〜12歳 | #A0C4FF (Blue) |
