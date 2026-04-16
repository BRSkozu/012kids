import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="パンくずリスト" className="text-sm text-[var(--color-foreground-muted)] mb-6">
      <ol className="flex items-center flex-wrap gap-y-1">
        <li className="flex items-center">
          <Link
            href="/"
            className="hover:text-[var(--color-primary-dark)] transition-colors flex items-center gap-1"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
              />
            </svg>
            <span>TOP</span>
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            <svg
              className="w-3.5 h-3.5 mx-2 text-[var(--color-paper-edge)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-[var(--color-primary-dark)] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[var(--color-foreground-soft)] truncate max-w-[200px] sm:max-w-xs">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Generate Schema.org BreadcrumbList JSON-LD
 */
export function generateBreadcrumbLd(items: BreadcrumbItem[]) {
  const allItems = [{ label: 'TOP', href: 'https://012.kids' }, ...items];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: item.href.startsWith('http') ? item.href : `https://012.kids${item.href}` } : {}),
    })),
  };
}
