import type { NextConfig } from "next";

const isStaticExport = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  // GitHub Pages fallback: set GITHUB_PAGES=true to enable static export + basePath
  ...(isStaticExport ? {
    output: 'export' as const,
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  } : {}),
  images: {
    // Static export cannot run the image optimizer; Vercel/Node deploys can.
    unoptimized: isStaticExport,
  },
};

export default nextConfig;
