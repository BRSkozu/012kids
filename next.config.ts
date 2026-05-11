import type { NextConfig } from "next";

const isStaticExport = process.env.GITHUB_PAGES === 'true';

/**
 * 統合した旧記事 → 統合後記事への恒久リダイレクト (308)。
 * 静的エクスポートでは無効。Vercel 等のサーバーモードで有効。
 *
 * 統合の経緯:
 *   - 月齢別/年齢別シリーズが内容的に重複していたため、年齢横断の
 *     まとめ記事に統合した（2026-05）。
 */
const CONSOLIDATION_REDIRECTS = [
  // baby-development-month-2..11 → baby-development-by-month
  ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((m) => ({
    source: `/articles/baby-development-month-${m}`,
    destination: '/articles/baby-development-by-month',
    permanent: true,
  })),
  // toy-guide-toy (age-based) → age-appropriate-toy-guide
  ...['0to6m', '6to12m', '1y', '2y', '3y', '4y', '5y', '6y'].map((a) => ({
    source: `/articles/toy-guide-toy-${a}`,
    destination: '/articles/age-appropriate-toy-guide',
    permanent: true,
  })),
  // child-development-age-2..12 → child-development-by-age
  ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((y) => ({
    source: `/articles/child-development-age-${y}`,
    destination: '/articles/child-development-by-age',
    permanent: true,
  })),
  // book-Ny-picture-book → picture-books-by-age
  ...[0, 1, 2, 3, 4, 5, 6].map((y) => ({
    source: `/articles/book-${y}y-picture-book`,
    destination: '/articles/picture-books-by-age',
    permanent: true,
  })),
  // school-life-elementary-1y..6y → elementary-school-life-by-grade
  ...[1, 2, 3, 4, 5, 6].map((y) => ({
    source: `/articles/school-life-elementary-${y}y`,
    destination: '/articles/elementary-school-life-by-grade',
    permanent: true,
  })),
  // school-life-nursery-0y..2y → nursery-school-life-by-age
  ...[0, 1, 2].map((y) => ({
    source: `/articles/school-life-nursery-${y}y`,
    destination: '/articles/nursery-school-life-by-age',
    permanent: true,
  })),
];

const nextConfig: NextConfig = {
  // GitHub Pages fallback: set GITHUB_PAGES=true to enable static export + basePath
  ...(isStaticExport ? {
    output: 'export' as const,
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  } : {
    async redirects() {
      return CONSOLIDATION_REDIRECTS;
    },
  }),
  images: {
    // Static export cannot run the image optimizer; Vercel/Node deploys can.
    unoptimized: isStaticExport,
  },
};

export default nextConfig;
