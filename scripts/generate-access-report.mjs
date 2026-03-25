/**
 * GA4 アクセスレポート生成スクリプト
 *
 * Google Analytics Data API (GA4) から昨日のアクセスデータを取得し、
 * HTML形式のレポートを標準出力に出力する。
 *
 * 環境変数:
 *   GA_SERVICE_ACCOUNT_JSON - サービスアカウントのJSON鍵
 *   GA_PROPERTY_ID          - GA4 プロパティID
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';

// --- 設定 ---
const credentials = JSON.parse(process.env.GA_SERVICE_ACCOUNT_JSON);
const propertyId = process.env.GA_PROPERTY_ID;

const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

/**
 * YYYY-MM-DD 形式の日付文字列を返す (JST)
 */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * JST で「昨日」と「一昨日」の日付を取得
 */
function getDates() {
  const now = new Date();
  // JST = UTC + 9
  const jstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  const yesterday = new Date(jstNow);
  yesterday.setDate(yesterday.getDate() - 1);

  const dayBefore = new Date(jstNow);
  dayBefore.setDate(dayBefore.getDate() - 2);

  return {
    yesterday: formatDate(yesterday),
    dayBefore: formatDate(dayBefore),
    yesterdayDisplay: `${yesterday.getFullYear()}年${yesterday.getMonth() + 1}月${yesterday.getDate()}日`,
  };
}

/**
 * GA4 からメトリクスを取得
 */
async function fetchMetrics(startDate, endDate) {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'sessions' },
      { name: 'activeUsers' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
    ],
  });

  const row = response.rows?.[0];
  if (!row) {
    return { pageviews: 0, sessions: 0, users: 0, avgDuration: 0, bounceRate: 0 };
  }
  return {
    pageviews: parseInt(row.metricValues[0].value, 10),
    sessions: parseInt(row.metricValues[1].value, 10),
    users: parseInt(row.metricValues[2].value, 10),
    avgDuration: parseFloat(row.metricValues[3].value),
    bounceRate: parseFloat(row.metricValues[4].value),
  };
}

/**
 * トップページを取得
 */
async function fetchTopPages(startDate, endDate, limit = 20) {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'activeUsers' },
    ],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit,
  });

  return (response.rows || []).map((row) => ({
    path: row.dimensionValues[0].value,
    title: row.dimensionValues[1].value,
    pageviews: parseInt(row.metricValues[0].value, 10),
    users: parseInt(row.metricValues[1].value, 10),
  }));
}

/**
 * 参照元を取得
 */
async function fetchReferrers(startDate, endDate) {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'sessionSource' }],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
    ],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 15,
  });

  return (response.rows || []).map((row) => ({
    source: row.dimensionValues[0].value,
    sessions: parseInt(row.metricValues[0].value, 10),
    users: parseInt(row.metricValues[1].value, 10),
  }));
}

/**
 * デバイスカテゴリ別を取得
 */
async function fetchDevices(startDate, endDate) {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'deviceCategory' }],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
    ],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  });

  return (response.rows || []).map((row) => ({
    device: row.dimensionValues[0].value,
    sessions: parseInt(row.metricValues[0].value, 10),
    users: parseInt(row.metricValues[1].value, 10),
  }));
}

/**
 * 数値にカンマ区切りを追加
 */
function num(n) {
  return Number(n).toLocaleString('ja-JP');
}

/**
 * 秒数を「○分○秒」に変換
 */
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}分${s}秒` : `${s}秒`;
}

/**
 * 前日比の差分表示
 */
function diff(current, previous) {
  const d = current - previous;
  if (d === 0) return '<span style="color:#888;">±0</span>';
  if (d > 0) return `<span style="color:#e74c3c;">▲ +${num(d)}</span>`;
  return `<span style="color:#3498db;">▼ ${num(d)}</span>`;
}

function diffPercent(current, previous) {
  if (previous === 0) return '';
  const pct = ((current - previous) / previous * 100).toFixed(1);
  const d = current - previous;
  if (d === 0) return '<span style="color:#888;">±0%</span>';
  if (d > 0) return `<span style="color:#e74c3c;">▲ +${pct}%</span>`;
  return `<span style="color:#3498db;">▼ ${pct}%</span>`;
}

/**
 * デバイス名を日本語に変換
 */
function deviceLabel(device) {
  const map = { desktop: 'デスクトップ', mobile: 'モバイル', tablet: 'タブレット' };
  return map[device] || device;
}

/**
 * HTML レポートを生成
 */
function generateHTML({ dates, metrics, prevMetrics, topPages, referrers, devices }) {
  const totalDeviceSessions = devices.reduce((s, d) => s + d.sessions, 0);

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>012.kids アクセスレポート - ${dates.yesterdayDisplay}</title>
<style>
  body { font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; margin: 0; padding: 0; background: #f5f5f5; color: #333; }
  .container { max-width: 700px; margin: 0 auto; background: #fff; }
  .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 30px 24px; text-align: center; }
  .header h1 { margin: 0 0 4px 0; font-size: 22px; font-weight: 700; }
  .header p { margin: 0; font-size: 14px; opacity: 0.85; }
  .content { padding: 24px; }
  .summary { display: flex; gap: 12px; margin-bottom: 28px; }
  .summary-card { flex: 1; background: #f8f9fa; border-radius: 10px; padding: 16px; text-align: center; border: 1px solid #e9ecef; }
  .summary-card .label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .summary-card .value { font-size: 28px; font-weight: 700; color: #333; line-height: 1.2; }
  .summary-card .change { font-size: 11px; margin-top: 4px; }
  .section { margin-bottom: 28px; }
  .section h2 { font-size: 16px; font-weight: 700; color: #333; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 2px solid #6366f1; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: #f8f9fa; color: #555; font-weight: 600; text-align: left; padding: 8px 10px; border-bottom: 2px solid #dee2e6; }
  td { padding: 7px 10px; border-bottom: 1px solid #eee; }
  tr:hover td { background: #f8f9ff; }
  .rank { color: #999; font-weight: 600; width: 30px; text-align: center; }
  .page-path { color: #6366f1; font-size: 11px; word-break: break-all; }
  .page-title { font-weight: 500; max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .bar-bg { background: #eee; border-radius: 4px; height: 8px; width: 100%; }
  .bar-fill { background: linear-gradient(90deg, #6366f1, #8b5cf6); border-radius: 4px; height: 8px; }
  .device-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .device-label { width: 120px; font-size: 13px; font-weight: 500; }
  .device-bar { flex: 1; }
  .device-pct { width: 60px; text-align: right; font-size: 13px; font-weight: 600; color: #555; }
  .footer { background: #f8f9fa; padding: 16px 24px; text-align: center; font-size: 11px; color: #aaa; border-top: 1px solid #eee; }
  .meta-row { display: flex; justify-content: space-between; font-size: 12px; color: #888; margin-bottom: 16px; }
  @media (max-width: 600px) {
    .summary { flex-direction: column; }
    .page-title { max-width: 180px; }
  }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>012.kids アクセスレポート</h1>
    <p>${dates.yesterdayDisplay}（前日比較付き）</p>
  </div>
  <div class="content">

    <div class="meta-row">
      <span>対象期間: ${dates.yesterday}</span>
      <span>比較期間: ${dates.dayBefore}</span>
    </div>

    <!-- サマリー -->
    <div class="summary">
      <div class="summary-card">
        <div class="label">ページビュー</div>
        <div class="value">${num(metrics.pageviews)}</div>
        <div class="change">${diff(metrics.pageviews, prevMetrics.pageviews)} ${diffPercent(metrics.pageviews, prevMetrics.pageviews)}</div>
      </div>
      <div class="summary-card">
        <div class="label">セッション</div>
        <div class="value">${num(metrics.sessions)}</div>
        <div class="change">${diff(metrics.sessions, prevMetrics.sessions)} ${diffPercent(metrics.sessions, prevMetrics.sessions)}</div>
      </div>
      <div class="summary-card">
        <div class="label">ユーザー数</div>
        <div class="value">${num(metrics.users)}</div>
        <div class="change">${diff(metrics.users, prevMetrics.users)} ${diffPercent(metrics.users, prevMetrics.users)}</div>
      </div>
    </div>

    <!-- 追加指標 -->
    <div class="section">
      <h2>その他の指標</h2>
      <table>
        <tr>
          <th>指標</th>
          <th class="num">昨日</th>
          <th class="num">前日</th>
          <th class="num">前日比</th>
        </tr>
        <tr>
          <td>平均セッション時間</td>
          <td class="num">${formatDuration(metrics.avgDuration)}</td>
          <td class="num">${formatDuration(prevMetrics.avgDuration)}</td>
          <td class="num">${diff(Math.round(metrics.avgDuration), Math.round(prevMetrics.avgDuration))}秒</td>
        </tr>
        <tr>
          <td>直帰率</td>
          <td class="num">${(metrics.bounceRate * 100).toFixed(1)}%</td>
          <td class="num">${(prevMetrics.bounceRate * 100).toFixed(1)}%</td>
          <td class="num">${((metrics.bounceRate - prevMetrics.bounceRate) * 100).toFixed(1)}pt</td>
        </tr>
      </table>
    </div>

    <!-- Top 20 ページ -->
    <div class="section">
      <h2>人気ページ TOP ${topPages.length}</h2>
      <table>
        <tr>
          <th class="rank">#</th>
          <th>ページ</th>
          <th class="num">PV</th>
          <th class="num">UU</th>
        </tr>
        ${topPages
          .map(
            (p, i) => `<tr>
          <td class="rank">${i + 1}</td>
          <td>
            <div class="page-title">${escapeHtml(p.title)}</div>
            <div class="page-path">${escapeHtml(p.path)}</div>
          </td>
          <td class="num">${num(p.pageviews)}</td>
          <td class="num">${num(p.users)}</td>
        </tr>`
          )
          .join('\n')}
      </table>
    </div>

    <!-- 参照元 -->
    <div class="section">
      <h2>参照元（リファラー）</h2>
      <table>
        <tr>
          <th class="rank">#</th>
          <th>ソース</th>
          <th class="num">セッション</th>
          <th class="num">ユーザー</th>
        </tr>
        ${referrers
          .map(
            (r, i) => `<tr>
          <td class="rank">${i + 1}</td>
          <td>${escapeHtml(r.source)}</td>
          <td class="num">${num(r.sessions)}</td>
          <td class="num">${num(r.users)}</td>
        </tr>`
          )
          .join('\n')}
      </table>
    </div>

    <!-- デバイス -->
    <div class="section">
      <h2>デバイス構成</h2>
      ${devices
        .map((d) => {
          const pct = totalDeviceSessions > 0 ? (d.sessions / totalDeviceSessions * 100).toFixed(1) : 0;
          return `<div class="device-row">
        <div class="device-label">${deviceLabel(d.device)}</div>
        <div class="device-bar">
          <div class="bar-bg"><div class="bar-fill" style="width:${pct}%"></div></div>
        </div>
        <div class="device-pct">${pct}%</div>
      </div>`;
        })
        .join('\n')}
    </div>

  </div>
  <div class="footer">
    このレポートは 012.kids の Google Analytics (GA4) データから自動生成されました。
  </div>
</div>
</body>
</html>`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// --- メイン処理 ---
async function main() {
  const dates = getDates();

  // 昨日と一昨日のデータを並行取得
  const [metrics, prevMetrics, topPages, referrers, devices] = await Promise.all([
    fetchMetrics(dates.yesterday, dates.yesterday),
    fetchMetrics(dates.dayBefore, dates.dayBefore),
    fetchTopPages(dates.yesterday, dates.yesterday, 20),
    fetchReferrers(dates.yesterday, dates.yesterday),
    fetchDevices(dates.yesterday, dates.yesterday),
  ]);

  const html = generateHTML({ dates, metrics, prevMetrics, topPages, referrers, devices });

  // 標準出力に HTML を出力（ワークフローでファイルにリダイレクト）
  process.stdout.write(html);
}

main().catch((err) => {
  console.error('レポート生成エラー:', err);
  process.exit(1);
});
