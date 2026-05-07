#!/usr/bin/env node
/**
 * Conditionally activates server-only route handlers.
 *
 * Next.js requires the file to be named exactly `route.ts` to register a
 * route handler. We keep the canonical source as `route.runtime.ts` so it is
 * never picked up by the bundler unless this script copies it into place.
 *
 * - Static export build (GITHUB_PAGES=true): leaves `route.ts` absent so
 *   Next.js does not error on the POST handler. Forms must POST to an
 *   external endpoint via NEXT_PUBLIC_CONTACT_ENDPOINT.
 * - Dynamic deploy (Vercel etc.): copies `route.runtime.ts` -> `route.ts`.
 */
import fs from 'fs';
import path from 'path';

const ROUTES = [
  'src/app/api/contact',
];

const isStaticExport = process.env.GITHUB_PAGES === 'true';

for (const rel of ROUTES) {
  const dir = path.join(process.cwd(), rel);
  const src = path.join(dir, 'route.runtime.ts');
  const dst = path.join(dir, 'route.ts');

  if (!fs.existsSync(src)) continue;

  if (isStaticExport) {
    if (fs.existsSync(dst)) {
      fs.rmSync(dst);
      console.log(`[prepare-api-routes] removed ${rel}/route.ts (static export)`);
    }
  } else {
    fs.copyFileSync(src, dst);
    console.log(`[prepare-api-routes] activated ${rel}/route.ts`);
  }
}
