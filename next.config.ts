import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages fallback: set GITHUB_PAGES=true to enable static export + basePath
  ...(process.env.GITHUB_PAGES === 'true' ? {
    output: 'export' as const,
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
