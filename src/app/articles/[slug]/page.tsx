import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllArticlesSync, getArticleBySlug, getArticleContentHtml } from '@/lib/articles';
import { getStageById } from '@/data/stages';
import StageBadge from '@/components/ui/StageBadge';
import CategoryTag from '@/components/ui/CategoryTag';
import ArticleCard from '@/components/articles/ArticleCard';
import { getArticleIllustration } from '@/components/illustrations/ArticleIllustrations';
import ShareButtons from '@/components/articles/ShareButtons';
import TableOfContents from '@/components/articles/TableOfContents';
import ReadingProgress from '@/components/articles/ReadingProgress';
import RecommendedLinks from '@/components/articles/RecommendedLinks';
import { getRecommendedLinks } from '@/data/recommended-links';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllArticlesSync().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: '記事が見つかりません' };

  const siteUrl = 'https://012.kids';
  const articleUrl = `${siteUrl}/articles/${article.slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: ['012.kids 編集部'],
      section: article.categories[0],
      tags: article.tags,
      url: articleUrl,
      images: [
        {
          url: `${siteUrl}/ogp/articles/${article.slug}.png`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [`${siteUrl}/ogp/articles/${article.slug}.png`],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const stage = getStageById(article.stage);
  const allArticles = getAllArticlesSync();
  let relatedArticles = article.relatedArticleIds
    .map((id) => allArticles.find((a) => a.id === id || a.slug === id))
    .filter(Boolean) as typeof allArticles;

  // Fill related articles up to 10
  if (relatedArticles.length < 10) {
    const existingIds = new Set([article.id, ...relatedArticles.map((a) => a.id)]);
    const candidates = allArticles
      .filter((a) => !existingIds.has(a.id))
      .map((a) => {
        let score = 0;
        if (a.stage === article.stage) score += 2;
        if (a.categories.some((c) => article.categories.includes(c))) score += 3;
        if (a.tags?.some((t) => article.tags?.includes(t))) score += 1;
        return { article: a, score };
      })
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score || (b.article.score?.total ?? 0) - (a.article.score?.total ?? 0));
    const needed = 10 - relatedArticles.length;
    relatedArticles = [...relatedArticles, ...candidates.slice(0, needed).map((c) => c.article)];
  }

  let contentHtml = await getArticleContentHtml(article.content);

  // Post-process: style "012.kidsの本音" sections with editorial callout box
  contentHtml = contentHtml.replace(
    /<h2([^>]*)>(012\.kidsの本音)<\/h2>/g,
    `<div class="honne-section"><h2$1><span class="honne-badge">忖度なし</span>$2</h2>`
  );
  // Close the honne-section div before the next h2
  contentHtml = contentHtml.replace(
    /(<div class="honne-section">[\s\S]*?)(<h2[^>]*>(?!<span class="honne-badge"))/g,
    '$1</div>$2'
  );
  // If honne-section is the last section, close before end
  if (contentHtml.includes('<div class="honne-section">') && !contentHtml.includes('</div><!--honne-->')) {
    const lastHonneIdx = contentHtml.lastIndexOf('<div class="honne-section">');
    const nextH2After = contentHtml.indexOf('<h2', lastHonneIdx + 30);
    if (nextH2After === -1) {
      // honne section goes to end - close before blockquote or end
      const lastBlockquote = contentHtml.lastIndexOf('<blockquote>');
      if (lastBlockquote > lastHonneIdx) {
        contentHtml = contentHtml.slice(0, lastBlockquote) + '</div>' + contentHtml.slice(lastBlockquote);
      }
    }
  }

  // Post-process: remove MDX "おすすめサイト・参考リンク" section (rendered by RecommendedLinks component instead)
  contentHtml = contentHtml.replace(
    /<h2[^>]*>おすすめサイト[^<]*<\/h2>[\s\S]*?(?=<h2|<hr|$)/,
    ''
  );

  // Post-process: remove intro blockquote mentioning おすすめサイト
  contentHtml = contentHtml.replace(
    /<blockquote>\s*<p>[^<]*おすすめサイト[^<]*<\/p>\s*<\/blockquote>/,
    ''
  );

  // Post-process: make all external links open in new tab
  contentHtml = contentHtml.replace(
    /<a href="(https?:\/\/[^"]+)"(?![^>]*target)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer"'
  );

  // Post-process: wrap tables in scrollable container for mobile
  contentHtml = contentHtml.replace(
    /<table>/g,
    '<div class="table-wrapper"><table>'
  );
  contentHtml = contentHtml.replace(
    /<\/table>/g,
    '</table></div>'
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: `https://012.kids/ogp/articles/${article.slug}.png`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Organization', name: '012.kids 編集部', url: 'https://012.kids' },
    publisher: {
      '@type': 'Organization',
      name: '012.kids',
      logo: { '@type': 'ImageObject', url: 'https://012.kids/ogp.png' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://012.kids/articles/${article.slug}`,
    },
    keywords: article.tags.join(', '),
    articleSection: article.categories[0],
    wordCount: article.content.split(/\s+/).length,
    inLanguage: 'ja',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.article-content h2', '.article-content > p:first-of-type'],
    },
    isAccessibleForFree: true,
  };

  // Extract FAQ pairs from content headings for FAQPage schema
  const faqMatches = [...article.content.matchAll(/##\s+(.+?\？)\s*\n([\s\S]*?)(?=\n##|\n---|\Z)/g)];
  const faqLd = faqMatches.length >= 2
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqMatches.slice(0, 10).map((m) => ({
          '@type': 'Question',
          name: m[1].trim(),
          acceptedAnswer: {
            '@type': 'Answer',
            text: m[2].replace(/[#*\[\]]/g, '').trim().slice(0, 300),
          },
        })),
      }
    : null;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'TOP', item: 'https://012.kids' },
      { '@type': 'ListItem', position: 2, name: '記事一覧', item: 'https://012.kids/articles' },
      { '@type': 'ListItem', position: 3, name: stage.label, item: `https://012.kids/age-guide/${article.stage}` },
      { '@type': 'ListItem', position: 4, name: article.title },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}
      {/* Reading Progress + Back to Top */}
      <ReadingProgress />

      {/* 2-column layout: sidebar TOC + main content */}
      <div className="lg:flex lg:gap-8">
        {/* Sticky sidebar TOC (desktop only) */}
        <aside className="hidden lg:block lg:w-56 flex-shrink-0">
          <div className="sticky top-24">
            <TableOfContents />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">

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

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <StageBadge stage={article.stage} size="md" />
          {article.categories.map((cat) => (
            <CategoryTag key={cat} category={cat} />
          ))}
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3">
              {article.title}
            </h1>
            <p className="text-gray-600 mb-3">{article.excerpt}</p>
          </div>
          <div className="hidden md:flex flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 items-center justify-center">
            {(() => { const Illustration = getArticleIllustration(article.slug); return <Illustration size={52} />; })()}
          </div>
        </div>

        {/* Meta info + attribution */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-[var(--color-primary)]">編</span>
            012.kids 編集部
          </span>
          <span>公開: {article.publishedAt}</span>
          {article.updatedAt !== article.publishedAt && (
            <span>更新: {article.updatedAt}</span>
          )}
          <span>{article.readingTime}分で読めます</span>
        </div>

        <div className="p-2.5 bg-[var(--color-warm-cream)] rounded-lg text-xs text-gray-500 border border-orange-100">
          この記事は、公的機関・専門家・研究機関などの情報をもとに編集部が独自にまとめたものです。元の情報は下部の「参考にした情報源」をご確認ください。
        </div>
      </header>

      {/* Mobile: Table of Contents inline */}
      <div className="lg:hidden">
        <TableOfContents />
      </div>

      {/* Article Content */}
      <article
        className="article-content mb-12"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

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
        <h3 className="text-sm font-semibold text-gray-700 mb-3">参考にした情報源（{article.source.references.length}件）</h3>
        <div className="bg-[var(--color-warm-cream)] rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">{article.source.name}</p>
          <ul className="space-y-2">
            {article.source.references.map((ref, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                  ref.stance === 'positive' ? 'bg-blue-400' :
                  ref.stance === 'cautious' ? 'bg-amber-400' :
                  'bg-gray-400'
                }`} />
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

      {/* Recommended Links */}
      <RecommendedLinks links={getRecommendedLinks(article.categories, 10, article.tags)} currentSlug={article.slug} />

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {article.tags.map((tag) => (
          <Link
            key={tag}
            href={`/tag/${encodeURIComponent(tag)}`}
            className="text-xs bg-orange-50 text-[var(--color-primary-dark)] px-3 py-1 rounded-full hover:bg-orange-100 transition-colors"
          >
            #{tag}
          </Link>
        ))}
      </div>

      {/* Share Buttons */}
      <div className="mb-8 py-4 border-t border-b border-orange-100">
        <ShareButtons
          url={`https://012.kids/articles/${article.slug}`}
          title={article.title}
        />
      </div>

        </div>{/* end main content */}
      </div>{/* end 2-column layout */}

      {/* Related Articles - full width */}
      {relatedArticles.length > 0 && (
        <div className="border-t border-orange-100 pt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-2">あわせて読みたい</h3>
          <p className="text-sm text-gray-500 mb-4">同じテーマの記事をチェック</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
