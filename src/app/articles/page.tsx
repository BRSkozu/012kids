import { getAllArticlesMeta } from '@/lib/articles';
import ArticlesPageClient from './ArticlesPageClient';

export default function ArticlesPage() {
  const articles = getAllArticlesMeta();
  return <ArticlesPageClient articles={articles} />;
}
