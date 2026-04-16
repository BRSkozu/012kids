import { ContentCategory } from '@/types';
import { getCategoryById } from '@/data/categories';

interface CategoryTagProps {
  category: ContentCategory;
}

export default function CategoryTag({ category }: CategoryTagProps) {
  const info = getCategoryById(category);
  if (!info) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs text-[var(--color-foreground-soft)] bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] px-2 py-0.5 rounded-full">
      <span>{info.icon}</span>
      <span>{info.label}</span>
    </span>
  );
}
