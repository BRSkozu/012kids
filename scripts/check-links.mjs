#!/usr/bin/env node
/**
 * Link Checker for 012.kids
 *
 * 3 種類のリンクを検証する:
 *   1. 外部 URL (frontmatter references + recommended-links)
 *   2. 内部 slug (relatedSlugs が実在する記事を指しているか)
 *   3. 記事本文中の Markdown リンク [text](url)
 *
 * Usage:
 *   node scripts/check-links.mjs                  # 全チェック (外部URLはHEAD)
 *   node scripts/check-links.mjs --skip-external  # 外部URLスキップ (高速)
 *   node scripts/check-links.mjs --strict         # エラーがあれば exit 1
 *   node scripts/check-links.mjs --concurrency 20 # 同時接続数 (default 10)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'articles');
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const SKIP_EXTERNAL = args.includes('--skip-external');
const STRICT = args.includes('--strict');
const concIdx = args.indexOf('--concurrency');
const CONCURRENCY = concIdx >= 0 ? parseInt(args[concIdx + 1], 10) : 10;

// ---------------------------------------------------------------------------
// Collect all articles
// ---------------------------------------------------------------------------
function getAllArticles() {
  const articles = [];
  const categories = fs.readdirSync(CONTENT_DIR).filter(d =>
    fs.statSync(path.join(CONTENT_DIR, d)).isDirectory()
  );
  for (const cat of categories) {
    const catDir = path.join(CONTENT_DIR, cat);
    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.mdx'));
    for (const file of files) {
      const filePath = path.join(catDir, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      articles.push({
        filePath: path.relative(CONTENT_DIR, filePath),
        slug: data.slug,
        data,
        content,
      });
    }
  }
  return articles;
}

// ---------------------------------------------------------------------------
// 1. Collect all external URLs
// ---------------------------------------------------------------------------
function collectExternalUrls(articles) {
  const urls = new Map(); // url -> Set<source>

  const add = (url, source) => {
    if (!url || !url.startsWith('http')) return;
    if (!urls.has(url)) urls.set(url, new Set());
    urls.get(url).add(source);
  };

  // From article frontmatter references
  for (const a of articles) {
    if (Array.isArray(a.data.references)) {
      for (const ref of a.data.references) {
        add(ref.url, `${a.filePath} [reference: ${ref.title || '?'}]`);
      }
    }
  }

  // From recommended-links.ts (parse as text since it's TS)
  try {
    const rlPath = path.join(DATA_DIR, 'recommended-links.ts');
    const rlContent = fs.readFileSync(rlPath, 'utf-8');
    const urlMatches = rlContent.matchAll(/url:\s*'([^']+)'/g);
    for (const m of urlMatches) {
      add(m[1], 'recommended-links.ts');
    }
  } catch { /* skip if not found */ }

  // From article body markdown links
  for (const a of articles) {
    const linkPattern = /\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g;
    let m;
    while ((m = linkPattern.exec(a.content)) !== null) {
      add(m[2], `${a.filePath} [body link: ${m[1] || '?'}]`);
    }
  }

  return urls;
}

// ---------------------------------------------------------------------------
// 2. Check internal slug references
// ---------------------------------------------------------------------------
function checkInternalSlugs(articles) {
  const allSlugs = new Set(articles.map(a => a.slug));
  const issues = [];

  for (const a of articles) {
    if (Array.isArray(a.data.relatedSlugs)) {
      for (const slug of a.data.relatedSlugs) {
        if (slug && !allSlugs.has(slug)) {
          issues.push({
            file: a.filePath,
            type: 'broken_slug',
            detail: `relatedSlugs に存在しない slug: "${slug}"`,
          });
        }
      }
    }

    // Body内の内部リンク /articles/xxx
    const internalPattern = /\[([^\]]*)\]\(\/articles\/([^)]+)\)/g;
    let m;
    while ((m = internalPattern.exec(a.content)) !== null) {
      const linked = m[2].replace(/\/$/, '');
      if (!allSlugs.has(linked)) {
        issues.push({
          file: a.filePath,
          type: 'broken_internal_link',
          detail: `本文中に存在しない内部リンク: /articles/${linked}`,
        });
      }
    }
  }

  return issues;
}

// ---------------------------------------------------------------------------
// 3. External URL checker (HEAD with fallback to GET)
// ---------------------------------------------------------------------------
async function checkUrl(url, timeout = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    // Try HEAD first (faster)
    let res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': '012kids-link-checker/1.0 (+https://012.kids)',
      },
    });

    // Some servers reject HEAD, fall back to GET
    if (res.status === 405 || res.status === 403) {
      res = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        redirect: 'follow',
        headers: {
          'User-Agent': '012kids-link-checker/1.0 (+https://012.kids)',
        },
      });
    }

    clearTimeout(timer);
    return { url, status: res.status, ok: res.status < 400 };
  } catch (err) {
    clearTimeout(timer);
    return { url, status: 0, ok: false, error: err.name === 'AbortError' ? 'timeout' : err.message };
  }
}

// Domains known to block bot/HEAD requests with 403
const BOT_BLOCKED_DOMAINS = new Set([
  'www.mhlw.go.jp', 'www.mext.go.jp', 'www8.cao.go.jp', 'www.who.int',
  'www.niid.go.jp', 'www.ncchd.go.jp', 'www.jpeds.or.jp', 'www.cfa.go.jp',
  'www.soumu.go.jp', 'www.nier.go.jp', 'www.maff.go.jp', 'www.env.go.jp',
  'www.caa.go.jp', 'www.niph.go.jp', 'www.jsog.or.jp', 'www.jpa-web.org',
  'www.gakkohoken.jp', 'www.shiruporuto.jp', 'berd.benesse.jp',
  'benesse.jp', 'toyokeizai.net', 'president.jp', 'www.nhk.or.jp',
  'www.meiji.co.jp', 'kids.gakken.co.jp',
]);

function isBotBlocked(url, status) {
  if (status !== 403) return false;
  try {
    const host = new URL(url).hostname;
    return BOT_BLOCKED_DOMAINS.has(host) || host.endsWith('.go.jp');
  } catch { return false; }
}

async function checkExternalUrls(urlMap) {
  const entries = Array.from(urlMap.entries());
  const broken = [];
  const botBlocked = [];
  let checked = 0;

  for (let i = 0; i < entries.length; i += CONCURRENCY) {
    const batch = entries.slice(i, i + CONCURRENCY);
    const promises = batch.map(([url]) => checkUrl(url));
    const batchResults = await Promise.all(promises);

    for (const r of batchResults) {
      checked++;
      if (!r.ok) {
        const entry = {
          url: r.url,
          status: r.status,
          error: r.error,
          sources: Array.from(urlMap.get(r.url)),
        };
        if (isBotBlocked(r.url, r.status)) {
          botBlocked.push(entry);
        } else {
          broken.push(entry);
        }
      }
      if (checked % 50 === 0) {
        process.stdout.write(`  ${checked}/${entries.length} checked...\r`);
      }
    }

    if (i + CONCURRENCY < entries.length) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  return { broken, botBlocked };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('🔗 012.kids リンクチェッカー');
  console.log('────────────────────────────────────────────────────────────');

  const articles = getAllArticles();
  console.log(`📄 記事数: ${articles.length}`);

  // Internal slug check
  console.log('\n📌 内部リンク・slug チェック...');
  const slugIssues = checkInternalSlugs(articles);
  if (slugIssues.length === 0) {
    console.log('  ✅ 内部リンクの問題なし');
  } else {
    console.log(`  ⚠️  ${slugIssues.length}件の問題:`);
    for (const issue of slugIssues) {
      console.log(`    ${issue.file}: ${issue.detail}`);
    }
  }

  // External URL check
  let externalBroken = 0;
  let externalBotBlocked = 0;
  if (SKIP_EXTERNAL) {
    console.log('\n🌐 外部URLチェック: スキップ (--skip-external)');
  } else {
    const urlMap = collectExternalUrls(articles);
    console.log(`\n🌐 外部URLチェック (${urlMap.size}件のユニークURL)...`);
    const { broken, botBlocked } = await checkExternalUrls(urlMap);
    externalBroken = broken.length;
    externalBotBlocked = botBlocked.length;

    if (broken.length === 0) {
      console.log('  ✅ 実質的なリンク切れなし');
    } else {
      console.log(`\n  ❌ ${broken.length}件のリンク切れ/問題:`);
      for (const b of broken) {
        const statusLabel = b.error || `HTTP ${b.status}`;
        console.log(`\n    [${statusLabel}] ${b.url}`);
        for (const src of b.sources) {
          console.log(`      ← ${src}`);
        }
      }
    }

    if (botBlocked.length > 0) {
      console.log(`\n  ℹ️  ${botBlocked.length}件は官公庁/機関サイトの bot ブロック (403):`);
      const byDomain = new Map();
      for (const b of botBlocked) {
        try {
          const host = new URL(b.url).hostname;
          byDomain.set(host, (byDomain.get(host) || 0) + 1);
        } catch { /* skip */ }
      }
      for (const [domain, count] of [...byDomain.entries()].sort((a, b) => b[1] - a[1])) {
        console.log(`    ${domain}: ${count}件`);
      }
      console.log('    → これらは実際にはアクセス可能ですが、bot リクエストを拒否しています');
    }
  }

  // Summary
  console.log('\n────────────────────────────────────────────────────────────');
  console.log(`📊 内部リンク問題: ${slugIssues.length}件`);
  if (!SKIP_EXTERNAL) {
    console.log(`📊 外部リンク切れ: ${externalBroken}件`);
    console.log(`📊 bot ブロック (403, 要手動確認): ${externalBotBlocked}件`);
  }
  const totalReal = slugIssues.length + externalBroken;

  if (STRICT && totalReal > 0) {
    console.log('\n❌ --strict モードのためエラー終了します');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
