'use client';

import { useEffect } from 'react';
import { recordArticleView } from '@/lib/readingHistory';

interface Props {
  slug: string;
  title: string;
}

/**
 * Client-only component that records an article view in localStorage.
 * Keeps server components free of any browser state; rendered once per article page.
 */
export default function ArticleViewTracker({ slug, title }: Props) {
  useEffect(() => {
    recordArticleView(slug, title);
  }, [slug, title]);

  return null;
}
