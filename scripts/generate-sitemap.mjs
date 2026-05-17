#!/usr/bin/env node
/**
 * Generate public/sitemap.xml from the route list in src/App.tsx + the paper IDs
 * declared in src/data/pastpapers/papers.ts and src/data/papers/index.ts.
 *
 * Spec §17 + §22: a real sitemap covering every paper, topic, theory entry.
 * Run on demand and as part of build (see package.json scripts).
 *
 * No external deps; pure string parsing — robust to TS evolution as long as
 * the paper-id literals match the regex shape we extract.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE = 'https://timboi14masterclass.vercel.app';
const NOW = new Date().toISOString().slice(0, 10);

// Top-level static routes pulled from src/App.tsx by hand — easier to maintain
// here than to dynamically parse the lazy() bag in App.tsx. Mirror this when
// new routes ship.
const STATIC_ROUTES = [
  { path: '/',            priority: 1.0, changefreq: 'weekly' },
  { path: '/start',       priority: 0.8, changefreq: 'monthly' },
  { path: '/study-guide', priority: 0.8, changefreq: 'monthly' },
  { path: '/playbook',    priority: 0.8, changefreq: 'monthly' },
  { path: '/training',    priority: 0.8, changefreq: 'weekly' },
  { path: '/practice',    priority: 0.8, changefreq: 'weekly' },
  { path: '/past-papers', priority: 0.9, changefreq: 'weekly' },
  { path: '/scout',       priority: 0.7, changefreq: 'weekly' },
  { path: '/boot-room',   priority: 0.7, changefreq: 'weekly' },
  { path: '/war-room',    priority: 0.7, changefreq: 'monthly' },
  { path: '/theory',      priority: 0.8, changefreq: 'monthly' },
  { path: '/cards',       priority: 0.7, changefreq: 'weekly' },
  { path: '/memory',      priority: 0.6, changefreq: 'monthly' },
  { path: '/memory-lab',  priority: 0.6, changefreq: 'monthly' },
  { path: '/formulas',    priority: 0.8, changefreq: 'monthly' },
  { path: '/pitfalls',    priority: 0.8, changefreq: 'monthly' },
  { path: '/syllabus',    priority: 0.8, changefreq: 'monthly' },
  { path: '/examiner',    priority: 0.7, changefreq: 'monthly' },
  { path: '/exam-skills', priority: 0.7, changefreq: 'monthly' },
  { path: '/mock',        priority: 0.7, changefreq: 'monthly' },
  { path: '/training/mock', priority: 0.7, changefreq: 'monthly' },
  { path: '/form-guide',  priority: 0.7, changefreq: 'weekly' },
  { path: '/progress',    priority: 0.6, changefreq: 'weekly' },
  { path: '/revision',    priority: 0.7, changefreq: 'weekly' },
  { path: '/revision/papers', priority: 0.7, changefreq: 'weekly' },
  { path: '/revision/topics', priority: 0.7, changefreq: 'weekly' },
  { path: '/course',      priority: 0.6, changefreq: 'monthly' },
  { path: '/debrief',     priority: 0.5, changefreq: 'monthly' },
  // /settings is intentionally NOT in the sitemap — disallowed in robots.txt.
];

// Topic IDs from src/data/topics.ts — these are the /topic/:id routes.
async function extractTopicIds() {
  const src = await fs.readFile(path.join(ROOT, 'src/data/topics.ts'), 'utf8');
  // Match top-level entries like `id: 'apv',` (with single-quoted slug values).
  return uniq(matchAll(src, /^\s+id:\s*'([a-z][a-z0-9-]+)'/gm));
}

// Paper IDs from the Q-pack file (src/data/pastpapers/papers.ts). Top-level
// papers are emitted at column 4 indentation; step IDs inside them are deeper.
// Filter by indentation to pick only paper-level ones.
async function extractPaperIds() {
  const src = await fs.readFile(path.join(ROOT, 'src/data/pastpapers/papers.ts'), 'utf8');
  const ids = [];
  for (const m of src.matchAll(/^(?<indent>\s+)id:\s*'(?<id>[a-z][a-z0-9-]+)'/gm)) {
    if (m.groups && m.groups.indent.length <= 4) {
      ids.push(m.groups.id);
    }
  }
  return uniq(ids);
}

// Paper IDs from src/data/papers/index.ts (ACCA-linked papers — sd-2025, etc.).
async function extractAccaPaperIds() {
  const src = await fs.readFile(path.join(ROOT, 'src/data/papers/index.ts'), 'utf8');
  // Match `id: 'sd-2025',` style at column 4 indentation (top-level entries).
  const ids = [];
  for (const m of src.matchAll(/^(?<indent>\s+)id:\s*'(?<id>[a-z][a-z0-9-]+)'/gm)) {
    if (m.groups && m.groups.indent.length <= 4) {
      ids.push(m.groups.id);
    }
  }
  return uniq(ids);
}

function uniq(xs) { return Array.from(new Set(xs)); }
function matchAll(src, re) { return Array.from(src.matchAll(re), (m) => m[1]); }

function urlEntry(loc, priority, changefreq) {
  return `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${NOW}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

async function main() {
  const [topicIds, paperIds, accaIds] = await Promise.all([
    extractTopicIds().catch(() => []),
    extractPaperIds().catch(() => []),
    extractAccaPaperIds().catch(() => []),
  ]);

  const entries = [];
  for (const r of STATIC_ROUTES) entries.push(urlEntry(r.path, r.priority, r.changefreq));
  for (const id of topicIds) entries.push(urlEntry(`/topic/${id}`, 0.6, 'monthly'));
  for (const id of paperIds.concat(accaIds)) {
    entries.push(urlEntry(`/revision/papers/${id}`, 0.7, 'monthly'));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

  await fs.writeFile(path.join(ROOT, 'public/sitemap.xml'), xml);

  process.stdout.write(
    `sitemap.xml: ${STATIC_ROUTES.length} static + ${topicIds.length} topics + ${paperIds.length + accaIds.length} papers = ${STATIC_ROUTES.length + topicIds.length + paperIds.length + accaIds.length} URLs\n`,
  );
}

main().catch((e) => {
  process.stderr.write(`sitemap generation failed: ${e?.stack || e}\n`);
  process.exit(1);
});
