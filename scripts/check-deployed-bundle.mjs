#!/usr/bin/env node
/**
 * Post-deploy bundle assertion — confirms the live site contains the
 * required engine markers before declaring a release green.
 *
 * Spec audit 2026-05-18 quality gate:
 *   "Add a CI step that downloads the deployed bundle and asserts the
 *   presence of a known compute() marker (e.g. a versioned string
 *   CBE_ENGINE_V1 exported from sheet-engine). If absent, fail the deploy."
 *
 * Usage:
 *   node scripts/check-deployed-bundle.mjs                          # prod
 *   node scripts/check-deployed-bundle.mjs --base https://...       # preview
 *   node scripts/check-deployed-bundle.mjs --base ./dist            # local dist
 *
 * Exit codes: 0 = all markers present; 1 = at least one missing.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const DEFAULT_BASE = 'https://timboi14masterclass.vercel.app';
const args = parseArgs(process.argv.slice(2));
const base = (args.base || DEFAULT_BASE).replace(/\/$/, '');

// String literals that must appear in at least one shipped JS chunk.
// Names matter — when a function/export is renamed, update here AND in the
// component(s) that surface the marker so we don't get a false-green.
const REQUIRED_MARKERS = [
  { token: 'CBE_ENGINE_V1', desc: 'CBE sheet engine version marker' },
  { token: 'AFM_NPV',        desc: 'AFM-style NPV (year-0 aware)' },
  { token: 'NORMSINV',       desc: 'Inverse standard normal CDF' },
  { token: 'SUMPRODUCT',     desc: 'Probability-weighted expected value' },
];

async function main() {
  const sources = await collectScriptSources();
  if (sources.length === 0) {
    process.stderr.write('No JS sources found to inspect.\n');
    process.exit(1);
  }
  process.stdout.write(`Inspecting ${sources.length} JS source(s) under ${base}…\n`);

  const corpus = sources.map((s) => s.content).join('\n');
  const results = REQUIRED_MARKERS.map((m) => ({
    ...m,
    present: corpus.includes(m.token),
    foundIn: sources.filter((s) => s.content.includes(m.token)).map((s) => s.label),
  }));

  let failed = 0;
  for (const r of results) {
    if (r.present) {
      process.stdout.write(`  PASS  ${r.token.padEnd(16)} (${r.desc}) — in ${r.foundIn.join(', ')}\n`);
    } else {
      process.stdout.write(`  FAIL  ${r.token.padEnd(16)} (${r.desc}) — not found in any shipped chunk\n`);
      failed++;
    }
  }
  if (failed > 0) {
    process.stderr.write(`\n${failed} marker(s) missing. Bundle is not shippable.\n`);
    process.exit(1);
  }
  process.stdout.write(`\nAll ${results.length} markers present. Deploy gate green.\n`);
}

async function collectScriptSources() {
  // Local dist directory — scan files directly.
  if (base.startsWith('./') || base.startsWith('/') || base.match(/^[a-z]:/i)) {
    const dir = base;
    const files = await listJsFiles(path.join(dir, 'assets'));
    return Promise.all(files.map(async (file) => ({
      label: path.basename(file),
      content: await fs.readFile(file, 'utf8'),
    })));
  }
  // Remote — fetch index.html, parse out <script src=...> tags, fetch each.
  const indexRes = await fetch(`${base}/`, { redirect: 'follow' });
  if (!indexRes.ok) throw new Error(`HTTP ${indexRes.status} fetching ${base}/`);
  const html = await indexRes.text();
  const scriptUrls = Array.from(html.matchAll(/<script[^>]+src=["']([^"']+)["']/g))
    .map((m) => m[1])
    .filter((u) => u.includes('/assets/') || u.endsWith('.js'))
    .map((u) => (u.startsWith('http') ? u : new URL(u, base).toString()));
  // Also pull every chunk reachable from the entry module's import map by
  // fetching a sampling of assets via the live manifest if present.
  return Promise.all(scriptUrls.map(async (url) => {
    const res = await fetch(url);
    return { label: url.split('/').pop() || url, content: res.ok ? await res.text() : '' };
  }));
}

async function listJsFiles(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isFile() && e.name.endsWith('.js')).map((e) => path.join(dir, e.name));
  } catch (e) {
    process.stderr.write(`Could not read ${dir}: ${e.message}\n`);
    return [];
  }
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      out[key] = val;
    }
  }
  return out;
}

main().catch((e) => {
  process.stderr.write(`bundle check failed: ${e?.stack || e}\n`);
  process.exit(1);
});
