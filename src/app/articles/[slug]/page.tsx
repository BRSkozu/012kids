import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { ARTICLES, getArticleBySlug } from '@/data/articles';
import { getStageById } from '@/data/stages';
import StageBadge from '@/components/ui/StageBadge';
import ScoreBadge from '@/components/ui/ScoreBadge';
import CategoryTag from '@/components/ui/CategoryTag';
import ArticleCard from '@/components/articles/ArticleCard';
import { getArticleIllustration } from '@/components/illustrations/ArticleIllustrations';

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
      authors: ['012.kids 編集部'],
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
        return null;
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
        <Link href="/" className="hover:text-[var(--color-primary)]">TOP</Link>
        <span>/</span>
        <Link href="/articles" className="hover:text-[var(--color-primary)]">記事一覧</Link>
        <span>/</span>
        <Link href={`/age-guide/${article.stage}`} className="hover:text-[var(--color-primary)]">
          {stage.label}
        </Link>
        <span>/</span>
        <span className="text-gray-400 truncate">{article.title}</span>
      </nav>

      {/* Matome disclaimer banner */}
      <div className="mb-6 p-3 bg-[var(--color-warm-cream)] rounded-xl text-sm text-gray-600 border border-orange-100">
        この記事は、公的機関や専門家の発信情報をもとに012.kids編集部が独自にまとめたものです。元の情報についてはページ下部の「参考にした情報」をご確認ください。
      </div>

      {/* Hero Illustration */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center py-8">
        {(() => { const Illustration = getArticleIllustration(article.slug); return <Illustration size={180} />; })()}
      </div>

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

        {/* Editorial attribution */}
        <div className="mt-4 p-3 bg-[var(--color-warm-cream)] rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
            編
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">012.kids 編集部</p>
            <p className="text-xs text-gray-500">公的機関・専門家の情報をもとにまとめています</p>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="article-content mb-12">
        {contentHtml}
      </article>

      {/* Perspectives (opinion patterns) */}
      {article.source.perspectives && (
        <div className="border-t border-orange-100 pt-6 mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">さまざまな見方・意見</h3>
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-xs font-bold">+</span>
                <p className="text-sm font-medium text-blue-800">多くの機関が支持する見方</p>
              </div>
              <p className="text-sm text-blue-700">{article.source.perspectives.positive}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-bold">=</span>
                <p className="text-sm font-medium text-gray-700">中立的な見方</p>
              </div>
              <p className="text-sm text-gray-600">{article.source.perspectives.neutral}</p>
            </div>
            {article.source.perspectives.cautious && (
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 text-xs font-bold">!</span>
                  <p className="text-sm font-medium text-amber-800">一方でこんな意見も</p>
                </div>
                <p className="text-sm text-amber-700">{article.source.perspectives.cautious}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* References */}
      <div className="border-t border-orange-100 pt-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">参考にした情報（{article.source.references.length}件）</h3>
        <div className="bg-[var(--color-warm-cream)] rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">{article.source.name}</p>
          <ul className="space-y-2">
            {article.source.references.map((ref, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="mt-1 w-2 h-2 rounded-full flex-shrink-0 bg-gray-300" />
                <div>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-primary)] hover:underline font-medium"
                  >
                    {ref.title}
                  </a>
                  <span className="text-xs text-gray-500 ml-2">{ref.org}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-orange-100 flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> 支持的</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300" /> 中立</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> 慎重</span>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            ※ 上記は参考にした情報源です。記事の内容は012.kids編集部が独自にまとめたものであり、各機関が本記事を監修・承認したものではありません。
          </p>
        </div>
      </div>

      {/* Quality Score Detail */}
      <div className="border-t border-orange-100 pt-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">品質スコア詳細</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: '信頼性', value: article.score.reliability, max: 30 },
            { label: '中立性', value: article.score.neutrality, max: 25 },
            { label: '新規性', value: article.score.freshness, max: 20 },
            { label: '年齢適合', value: article.score.ageRelevance, max: 15 },
            { label: '読みやすさ', value: article.score.readability, max: 10 },
          ].map((item) => (
            <div key={item.label} className="bg-[var(--color-warm-cream)] rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-lg font-bold text-[var(--color-primary)]">
                {item.value}<span className="text-xs text-gray-400">/{item.max}</span>
              </p>
              <div className="mt-1 h-1.5 bg-orange-100 rounded-full overflow-hidden">
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
            className="text-xs bg-orange-50 text-[var(--color-primary-dark)] px-3 py-1 rounded-full hover:bg-orange-100 transition-colors"
          >
            #{tag}
          </Link>
        ))}
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="border-t border-orange-100 pt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">関連記事</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedArticles.map((a) => (
              <ArticleCard key={a.id} article={a} variant="compact" />
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-800">
        <p className="font-semibold mb-1">ご利用にあたって</p>
        <p>
          当サイトは子育て・教育に関する情報をまとめて紹介する「情報まとめサイト」です。
          掲載情報は公的機関や専門家の発信をもとに編集部が独自にまとめたものであり、
          各情報源の機関が本サイトを監修・承認したものではありません。
          お子さまの健康や発達について心配がある場合は、必ず医師や専門家にご相談ください。
        </p>
      </div>
    </div>
  );
}
