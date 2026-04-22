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

  // Fill related articles up to 6
  if (relatedArticles.length < 6) {
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
    const needed = 6 - relatedArticles.length;
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
            className={`mt-4 text-2xl md:text-[2.2rem] leading-[1.25] ${heroPhoto ? 'text-white' : ''}`}
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

      {/* Share Buttons (top) */}
      <div className="mb-6">
        <ShareButtons
          url={`https://012.kids/articles/${article.slug}`}
          title={article.title}
        />
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


      {/* Recommended Links */}
      <RecommendedLinks links={getRecommendedLinks(article.categories, 8, article.tags)} currentSlug={article.slug} />

      {/* Tags + Share (unified footer) */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${encodeURIComponent(tag)}`}
              className="text-xs bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] text-[var(--color-primary-dark)] px-2.5 py-1 rounded-full hover:bg-[var(--color-surface)] hover:border-[var(--color-primary-light)] transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
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
          <section className="bg-gradient-to-b from-[var(--color-warm-bg)] to-transparent pt-8 pb-4 -mx-4 px-4 md:-mx-0 md:px-0 md:rounded-2xl mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">🌱</span>
              <h3
                className="text-base text-[var(--color-foreground)]"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                次のステージ：{nextStage.label}（{nextStage.ageRange}）
              </h3>
            </div>
            <p className="text-xs text-[var(--color-foreground-muted)] mb-4">
              お子さんが成長したら、こちらもどうぞ
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {nextStageArticles.map((a) => (
                <Link
                  key={a.id}
                  href={`/articles/${a.slug}`}
                  className="group rounded-xl border border-[var(--color-paper-edge)] bg-[var(--color-surface)] p-4 hover:shadow-md transition-all"
                >
                  <StageBadge stage={a.stage} size="sm" />
                  <p
                    className="text-sm text-[var(--color-foreground)] mt-2 group-hover:text-[var(--color-primary-dark)] transition-colors line-clamp-2"
                    style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
                  >
                    {a.title}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="pt-6 mb-6">
          <h3
            className="text-base text-[var(--color-foreground)] mb-4"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
          >
            あわせて読みたい
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedArticles.slice(0, 6).map((a) => (
              <ArticleCard key={a.id} article={a} variant="related-card" />
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <p className="mt-6 mb-4 text-xs text-[var(--color-foreground-muted)] leading-relaxed">
        当サイトの情報は公的機関や専門家の発信をもとに編集部が独自にまとめたものです。各情報源の機関が監修・承認したものではありません。健康や発達について心配がある場合は医師や専門家にご相談ください。
      </p>
    </div>
    </>
  );
}
