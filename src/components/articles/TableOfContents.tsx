'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const article = document.querySelector('.article-content');
    if (!article) return;

    const headings = article.querySelectorAll('h2, h3');
    const tocItems: TocItem[] = [];

    headings.forEach((heading, i) => {
      const id = heading.id || `heading-${i}`;
      if (!heading.id) heading.id = id;
      tocItems.push({
        id,
        text: heading.textContent || '',
        level: heading.tagName === 'H2' ? 2 : 3,
      });
    });

    setItems(tocItems);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  if (items.length < 2) return null;

  return (
    <nav className="bg-[var(--color-warm-cream)] rounded-xl p-5 mb-8" aria-label="目次">
      <p className="text-sm font-bold text-gray-700 mb-3">この記事の目次</p>
      <ol className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
            <a
              href={`#${item.id}`}
              className={`block text-sm py-1 border-l-2 pl-3 transition-colors ${
                activeId === item.id
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)] font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
