import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getAllArticlesSync, getArticleBySlug, getArticleContentHtml } from '@/lib/articles';
import { getStageById, AGE_STAGES } from '@/data/stages';
import { getStagePhoto, getCategoryPhoto } from '@/data/photos';
import StageBadge from '@/components/ui/StageBadge';
import CategoryTag from '@/components/ui/CategoryTag';
import Breadcrumb, { generateBreadcrumbLd } from '@/components/ui/Breadcrumb';
import ReadingTime from '@/components/ui/ReadingTime';
import ArticleCard from '@/components/articles/ArticleCard';
import ShareButtons from '@/components/articles/ShareButtons';
import ArticleViewTracker from '@/components/articles/ArticleViewTracker';
import FavoriteButton from '@/components/articles/FavoriteButton';
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

  const breadcrumbItems = [
    { label: '記事一覧', href: '/articles' },
    { label: stage.label, href: `/age-guide/${article.stage}` },
    { label: article.title },
  ];
  const breadcrumbLd = generateBreadcrumbLd(breadcrumbItems);

  const heroPhoto = getStagePhoto(article.stage) || getCategoryPhoto(article.categories[0]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}
      <ReadingProgress />
      <ArticleViewTracker slug={article.slug} title={article.title} />

      {/* Article Hero */}
      <div className="relative overflow-hidden" style={{ backgroundColor: stage.colorLight }}>
        {heroPhoto && (
          <div className="absolute inset-0">
            <Image src={heroPhoto} alt="" fill className="object-cover object-center" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/65" />
          </div>
        )}
        {!heroPhoto && (
          <div className="absolute inset-0 bg-gradient-to-br" style={{ background: `linear-gradient(135deg, ${stage.colorLight}, ${stage.color}40)` }} />
        )}
        <div className="relative max-w-4xl mx-auto px-4 pt-6 pb-10 md:pt-8 md:pb-14">
          <div className={heroPhoto ? '[&_nav]:text-white/70 [&_a:hover]:text-white [&_svg]:text-white/40' : ''}>
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <StageBadge stage={article.stage} size="md" />
            {article.categories.map((cat) => (
              <CategoryTag key={cat} category={cat} />
            ))}
          </div>
          <h1
            className={`mt-4 text-2xl md:text-[2.2rem] leading-[1.25] ${heroPhoto ? 'text-white' : 'text-[var(--color-foreground)]'}`}
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, textShadow: heroPhoto ? '0 2px 12px rgba(0,0,0,0.3)' : 'none' }}
          >
            {article.title}
          </h1>
          <p className={`mt-3 text-[15px] leading-relaxed max-w-2xl ${heroPhoto ? 'text-white/90' : 'text-[var(--color-foreground-soft)]'}`} style={{ textShadow: heroPhoto ? '0 1px 6px rgba(0,0,0,0.3)' : 'none' }}>
            {article.excerpt}
          </p>
          <div className={`mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm ${heroPhoto ? 'text-white/75' : 'text-[var(--color-foreground-muted)]'}`}>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">編</span>
              012.kids 編集部
            </span>
            <span>公開: {article.publishedAt}</span>
            {article.updatedAt !== article.publishedAt && (
              <span>更新: {article.updatedAt}</span>
            )}
            <ReadingTime minutes={article.readingTime} />
          </div>
        </div>
      </div>

    <div className="max-w-6xl mx-auto px-4 py-8">
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

      <div className="flex items-center gap-3 mb-6 mt-2">
        <FavoriteButton slug={article.slug} variant="button" />
        <div className="p-2.5 bg-[var(--color-warm-cream)] rounded-lg text-xs text-[var(--color-foreground-soft)] border border-[var(--color-paper-edge)] leading-relaxed flex-1">
          この記事は、公的機関・専門家・研究機関などの情報をもとに編集部が独自にまとめたものです。
        </div>
      </div>

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
        <div className="border-t border-[var(--color-paper-edge)] pt-6 mb-8">
          <h3
            className="text-sm text-[var(--color-foreground)] mb-3"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
          >
            さまざまな見方・意見
          </h3>
          <div className="space-y-3">
            <div className="bg-[#EEF3FA] border border-[#D8E2F0] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-[#C6D6EC] flex items-center justify-center text-[#3A5A88] text-xs font-bold">+</span>
                <p className="text-sm font-semibold text-[#3A5A88]">多くの機関が支持する見方</p>
              </div>
              <p className="text-sm text-[#3A5A88] leading-relaxed">{article.source.perspectives.positive}</p>
            </div>
            <div className="bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-[var(--color-paper-edge)] flex items-center justify-center text-[var(--color-foreground-soft)] text-xs font-bold">=</span>
                <p className="text-sm font-semibold text-[var(--color-foreground)]">中立的な見方</p>
              </div>
              <p className="text-sm text-[var(--color-foreground-soft)] leading-relaxed">{article.source.perspectives.neutral}</p>
            </div>
            {article.source.perspectives.cautious && (
              <div className="bg-[#F7EED2] border border-[#E5D9B0] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-[#E5D9B0] flex items-center justify-center text-[#7A6315] text-xs font-bold">!</span>
                  <p className="text-sm font-semibold text-[#7A6315]">一方でこんな意見も</p>
                </div>
                <p className="text-sm text-[#7A6315] leading-relaxed">{article.source.perspectives.cautious}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* References */}
      <div className="border-t border-[var(--color-paper-edge)] pt-6 mb-8">
        <h3
          className="text-sm text-[var(--color-foreground)] mb-3"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
        >
          参考にした情報源（{article.source.references.length}件）
        </h3>
        <div className="bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] rounded-lg p-4">
          <p
            className="text-sm text-[var(--color-foreground)] mb-3"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
          >
            {article.source.name}
          </p>
          <ul className="space-y-2">
            {article.source.references.map((ref, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                  ref.stance === 'positive' ? 'bg-[#6B8BC4]' :
                  ref.stance === 'cautious' ? 'bg-[#D4AF37]' :
                  'bg-[var(--color-foreground-muted)]'
                }`} />
                <div>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-primary-dark)] hover:underline font-medium"
                  >
                    {ref.title}
                  </a>
                  <span className="text-xs text-[var(--color-foreground-muted)] ml-2">{ref.org}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-[var(--color-paper-edge)] flex items-center gap-4 text-xs text-[var(--color-foreground-muted)]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#6B8BC4]" /> 支持的</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--color-foreground-muted)]" /> 中立</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D4AF37]" /> 慎重</span>
          </div>
          <p className="text-xs text-[var(--color-foreground-muted)] mt-3 leading-relaxed">
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
            className="text-xs bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] text-[var(--color-primary-dark)] px-3 py-1 rounded-full hover:bg-[var(--color-surface)] hover:border-[var(--color-primary-light)] transition-colors"
          >
            #{tag}
          </Link>
        ))}
      </div>

      {/* Share Buttons */}
      <div className="mb-8 py-4 border-t border-b border-[var(--color-paper-edge)]">
        <ShareButtons
          url={`https://012.kids/articles/${article.slug}`}
          title={article.title}
        />
      </div>

        </div>{/* end main content */}
      </div>{/* end 2-column layout */}

      {/* Growth Navigation - next stage preview */}
      {(() => {
        const stageIdx = AGE_STAGES.findIndex((s) => s.id === article.stage);
        const nextStage = stageIdx >= 0 && stageIdx < AGE_STAGES.length - 1 ? AGE_STAGES[stageIdx + 1] : null;
        if (!nextStage) return null;
        const nextStageArticles = allArticles
          .filter((a) => a.stage === nextStage.id && a.categories.some((c) => article.categories.includes(c)))
          .sort((a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0))
          .slice(0, 3);
        if (nextStageArticles.length === 0) return null;
        return (
          <div className="border-t border-[var(--color-paper-edge)] pt-8 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🌱</span>
              <h3
                className="text-lg text-[var(--color-foreground)]"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                次のステージへ：{nextStage.label}（{nextStage.ageRange}）
              </h3>
            </div>
            <p className="text-sm text-[var(--color-foreground-soft)] mb-4 leading-relaxed">
              お子さんが成長したら、こちらの記事が役立ちます
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {nextStageArticles.map((a) => (
                <Link
                  key={a.id}
                  href={`/articles/${a.slug}`}
                  className="group rounded-xl border border-dashed p-4 hover:shadow-[0_12px_28px_-16px_rgba(31,36,57,0.3)] transition-all"
                  style={{ borderColor: nextStage.color, backgroundColor: nextStage.colorLight + '80' }}
                >
                  <StageBadge stage={a.stage} size="sm" />
                  <p
                    className="text-sm text-[var(--color-foreground)] mt-2 group-hover:text-[var(--color-primary-dark)] transition-colors line-clamp-2"
                    style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
                  >
                    {a.title}
                  </p>
                  <p className="text-xs text-[var(--color-foreground-soft)] mt-1 line-clamp-2 leading-relaxed">{a.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Related Articles - magazine layout */}
      {relatedArticles.length > 0 && (
        <div className="border-t border-[var(--color-paper-edge)] pt-8">
          <h3
            className="text-lg text-[var(--color-foreground)] mb-2"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
          >
            あわせて読みたい
          </h3>
          <p className="text-sm text-[var(--color-foreground-soft)] mb-6 leading-relaxed">同じテーマの記事をチェック</p>
          {/* Hero row: first 2 articles get large cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {relatedArticles.slice(0, 2).map((a) => (
              <ArticleCard key={a.id} article={a} variant="related-hero" />
            ))}
          </div>
          {/* Remaining articles: horizontal compact cards */}
          {relatedArticles.length > 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {relatedArticles.slice(2).map((a) => (
                <ArticleCard key={a.id} article={a} variant="related-card" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] rounded-xl text-sm text-[var(--color-foreground-soft)] leading-relaxed">
        <p
          className="text-[var(--color-foreground)] mb-1"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
        >
          ご利用にあたって
        </p>
        <p>
          当サイトは子育て・教育に関する情報をまとめて紹介する「情報まとめサイト」です。
          掲載情報は公的機関や専門家の発信をもとに編集部が独自にまとめたものであり、
          各情報源の機関が本サイトを監修・承認したものではありません。
          お子さまの健康や発達について心配がある場合は、必ず医師や専門家にご相談ください。
        </p>
      </div>
    </div>
    </>
  );
}
