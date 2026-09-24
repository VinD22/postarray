/**
 * Per-route client JavaScript budgets, checked against a finished `next build`.
 *
 * Turbopack prints no per-route sizes, so this reads what the build writes:
 * each route's `page_client-reference-manifest.js` lists the client chunks its
 * layouts, page and boundaries load (`entryJSFiles`), and `build-manifest.json`
 * lists the runtime every route loads (`rootMainFiles`). The union, gzipped, is
 * the route's first-load JavaScript. A route over budget fails the build job.
 *
 * Raise a budget only with a reason in the commit message. For a treemap of
 * what is inside a chunk, run `pnpm --filter @relay/web analyze`.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import vm from 'node:vm';

const KB = 1024;

/**
 * Gzipped first-load JS budget per route, in KiB. These are a ratchet: the
 * measured size when budgets were introduced plus about 5% headroom. Lower a
 * budget when a route gets smaller so the gain cannot quietly be spent.
 */
const budgets = [
  { route: '/', dir: '[locale]/(marketing)', budgetKb: 585 },
  { route: '/pricing', dir: '[locale]/(marketing)/pricing', budgetKb: 580 },
  {
    route: '/specs/x/character-limit',
    dir: '[locale]/(marketing)/specs/[platform]/[constraint]',
    budgetKb: 575,
  },
  {
    route: '/tools/post-preflight',
    dir: '[locale]/(marketing)/tools/post-preflight',
    budgetKb: 590,
  },
  { route: '/home', dir: '[locale]/(app)/home', budgetKb: 610 },
  { route: '/compose', dir: '[locale]/(app)/compose', budgetKb: 700 },
  { route: '/calendar', dir: '[locale]/(app)/calendar', budgetKb: 645 },
];

const nextDir = path.resolve(process.argv[2] ?? '.next');
const sizeCache = new Map();

function gzipSize(relativeFile) {
  const cached = sizeCache.get(relativeFile);
  if (cached !== undefined) return cached;
  const size = gzipSync(readFileSync(path.join(nextDir, relativeFile))).length;
  sizeCache.set(relativeFile, size);
  return size;
}

function readRouteManifest(dir) {
  const file = path.join(nextDir, 'server', 'app', dir, 'page_client-reference-manifest.js');
  const context = { globalThis: {} };
  vm.runInNewContext(readFileSync(file, 'utf8'), context);
  const manifests = Object.values(context.globalThis.__RSC_MANIFEST ?? {});
  if (manifests.length !== 1) throw new Error(`Unexpected client manifest shape in ${file}`);
  return manifests[0];
}

const buildManifest = JSON.parse(readFileSync(path.join(nextDir, 'build-manifest.json'), 'utf8'));
const rootFiles = buildManifest.rootMainFiles ?? [];

let failed = false;
const rows = [];
for (const { route, dir, budgetKb } of budgets) {
  const manifest = readRouteManifest(dir);
  const files = new Set(rootFiles);
  for (const chunks of Object.values(manifest.entryJSFiles ?? {})) {
    for (const chunk of chunks) files.add(chunk);
  }
  let bytes = 0;
  for (const file of files) bytes += gzipSize(file);
  const kb = bytes / KB;
  const over = kb > budgetKb;
  if (over) failed = true;
  rows.push(
    `${over ? 'OVER' : 'ok  '}  ${route.padEnd(28)} ${kb.toFixed(1).padStart(7)} KiB / ${budgetKb} KiB`,
  );
}

process.stdout.write(`First-load JS (gzip) per route\n${rows.join('\n')}\n`);
if (failed) {
  process.stderr.write('One or more routes exceed their JavaScript budget.\n');
  process.exit(1);
}
