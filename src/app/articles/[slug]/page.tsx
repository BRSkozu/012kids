import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { ARTICLES, getArticleBySlug } from '@/data/articles';
import { getStageById } from '@/data/stages';
import StageBadge from '@/components/ui/StageBadge';
import ScoreBadge from '@/components/ui/ScoreBadge';
import CategoryTag from '@/components/ui/CategoryTag';
import ArticleCard from '@/components/articles/ArticleCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: '記事が見つかりません' };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: article.author ? [article.author.name] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const stage = getStageById(article.stage);
  const relatedArticles = article.relatedArticleIds
    .map((id) => ARTICLES.find((a) => a.id === id))
    .filter(Boolean) as typeof ARTICLES;

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i}>{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i}>{line.slice(4)}</h3>;
      }
      if (line.startsWith('> ')) {
        return <blockquote key={i} dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
      }
      if (line.startsWith('- ')) {
        return null; // handled by list grouping below
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
    });
  };

  // Group list items
  const contentHtml = article.content.split('\n\n').map((block, i) => {
    const lines = block.split('\n');
    if (lines.every((l) => l.startsWith('- '))) {
      return (
        <ul key={i}>
          {lines.map((l, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: l.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          ))}
        </ul>
      );
    }
    if (lines.some((l) => l.startsWith('- ')) && lines.some((l) => !l.startsWith('- '))) {
      return (
        <div key={i}>
          {lines.map((l, j) => {
            if (l.startsWith('- ')) return <ul key={j}><li dangerouslySetInnerHTML={{ __html: l.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /></ul>;
            if (l.startsWith('## ')) return <h2 key={j}>{l.slice(3)}</h2>;
            if (l.startsWith('### ')) return <h3 key={j}>{l.slice(4)}</h3>;
            if (l.startsWith('> ')) return <blockquote key={j} dangerouslySetInnerHTML={{ __html: l.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
            if (l.match(/^\d+\. /)) return <ol key={j}><li dangerouslySetInnerHTML={{ __html: l.replace(/^\d+\. /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /></ol>;
            if (l.trim() === '') return null;
            return <p key={j} dangerouslySetInnerHTML={{ __html: l.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
          })}
        </div>
      );
    }
    return <div key={i}>{renderContent(block)}</div>;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-700">TOP</Link>
        <span>/</span>
        <Link href="/articles" className="hover:text-gray-700">記事一覧</Link>
        <span>/</span>
        <Link href={`/age-guide/${article.stage}`} className="hover:text-gray-700">
          {stage.label}
        </Link>
        <span>/</span>
        <span className="text-gray-400 truncate">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <StageBadge stage={article.stage} size="md" />
          <ScoreBadge score={article.score.total} showLabel />
          {article.categories.map((cat) => (
            <CategoryTag key={cat} category={cat} />
          ))}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
          {article.title}
        </h1>

        <p className="text-gray-600 text-lg mb-4">{article.excerpt}</p>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span>公開: {article.publishedAt}</span>
          {article.updatedAt !== article.publishedAt && (
            <span>更新: {article.updatedAt}</span>
          )}
          <span>{article.readingTime}分で読めます</span>
        </div>

        {/* Author / Supervisor */}
        {(article.author || article.supervisor) && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl flex flex-wrap gap-6">
            {article.author && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-[var(--color-primary)]">
                  {article.author.name[0]}
                </div>
                <div>
                  <p className="text-xs text-gray-500">執筆</p>
                  <p className="text-sm font-medium">{article.author.name}</p>
                  <p className="text-xs text-gray-500">{article.author.title}</p>
                </div>
              </div>
            )}
            {article.supervisor && article.supervisor.id !== article.author?.id && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700">
                  {article.supervisor.name[0]}
                </div>
                <div>
                  <p className="text-xs text-gray-500">監修</p>
                  <p className="text-sm font-medium">{article.supervisor.name}</p>
                  <p className="text-xs text-gray-500">{article.supervisor.title}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Article Content */}
      <article className="article-content mb-12">
        {contentHtml}
      </article>

      {/* Source */}
      <div className="border-t border-gray-200 pt-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">情報元・出典</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm">
            <span className="font-medium">{article.source.organization}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            発行日: {article.source.publishedDate}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {article.source.url}
          </p>
        </div>
      </div>

      {/* Quality Score Detail */}
      <div className="border-t border-gray-200 pt-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">品質スコア詳細</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: '信頼性', value: article.score.reliability, max: 30 },
            { label: '中立性', value: article.score.neutrality, max: 25 },
            { label: '新規性', value: article.score.freshness, max: 20 },
            { label: '年齢適合', value: article.score.ageRelevance, max: 15 },
            { label: '読みやすさ', value: article.score.readability, max: 10 },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-lg font-bold text-[var(--color-primary)]">
                {item.value}<span className="text-xs text-gray-400">/{item.max}</span>
              </p>
              <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary)] rounded-full"
                  style={{ width: `${(item.value / item.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          総合スコア: {article.score.total}/100 点
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {article.tags.map((tag) => (
          <Link
            key={tag}
            href={`/search?q=${encodeURIComponent(tag)}`}
            className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            #{tag}
          </Link>
        ))}
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">関連記事</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedArticles.map((a) => (
              <ArticleCard key={a.id} article={a} variant="compact" />
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
        <p className="font-semibold mb-1">ご注意</p>
        <p>
          当サイトの情報は一般的な参考情報であり、個別の医療アドバイスではありません。
          お子さまの健康や発達について心配がある場合は、必ず医師や専門家にご相談ください。
        </p>
      </div>
    </div>
  );
}
