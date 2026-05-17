#!/usr/bin/env node
/**
 * AI Marker eval runner.
 *
 * Spec §20: weekly CI runs this against the 30 gold-standard attempts, prints
 * MAE / correlation / false-credit / missed-credit, and fails the build if MAE
 * regresses by more than 1 mark vs baseline.json.
 *
 * Usage:
 *   node packages/ai-eval/runner.mjs                   # local /api/mark
 *   node packages/ai-eval/runner.mjs --base https://...
 *   node packages/ai-eval/runner.mjs --only 001-robson-co
 *   node packages/ai-eval/runner.mjs --update-baseline # rebase the gate
 *
 * Exit codes:
 *   0  pass — MAE delta within 1 mark
 *   1  fail — MAE regression
 *   2  config error (missing gold dir, malformed JSON, network down)
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GOLD_DIR = path.join(__dirname, 'gold');
const BASELINE_PATH = path.join(__dirname, 'baseline.json');

const args = parseArgs(process.argv.slice(2));
const base = args.base || process.env.TBA_EVAL_BASE || 'http://localhost:3000';
const only = args.only ?? null;
const updateBaseline = Boolean(args['update-baseline']);

async function main() {
  let entries;
  try {
    entries = await fs.readdir(GOLD_DIR, { withFileTypes: true });
  } catch (e) {
    process.stderr.write(`No gold directory at ${GOLD_DIR}. Create at least one attempt before running.\n`);
    process.exit(2);
  }

  const attempts = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
    .map((e) => e.name)
    .filter((id) => (only ? id === only : true))
    .sort();

  if (attempts.length === 0) {
    process.stderr.write(`No gold attempts to run. Add directories under ${GOLD_DIR}.\n`);
    process.exit(2);
  }

  const results = [];
  for (const id of attempts) {
    const r = await runOne(id);
    results.push({ id, ...r });
  }

  // Metrics across the suite.
  const all = results.flatMap((r) => r.perRubric);
  const mae = mean(all.map((p) => Math.abs(p.aiAwarded - p.tutorAwarded)));
  const corr = pearson(all.map((p) => p.aiAwarded), all.map((p) => p.tutorAwarded));
  const falseCredit = ratio(all.filter((p) => p.aiAwarded > 0 && p.tutorAwarded === 0).length, all.length);
  const missedCredit = ratio(all.filter((p) => p.aiAwarded === 0 && p.tutorAwarded > 0).length, all.length);

  const summary = {
    attempts: results.length,
    rubricLines: all.length,
    mae: round(mae, 3),
    correlation: round(corr, 3),
    falseCreditRate: round(falseCredit, 3),
    missedCreditRate: round(missedCredit, 3),
  };

  process.stdout.write(`\nAI Marker eval summary (${summary.attempts} attempts, ${summary.rubricLines} rubric lines):\n`);
  process.stdout.write(`  MAE                 ${summary.mae}\n`);
  process.stdout.write(`  Correlation         ${summary.correlation}\n`);
  process.stdout.write(`  False-credit rate   ${(summary.falseCreditRate * 100).toFixed(1)}%\n`);
  process.stdout.write(`  Missed-credit rate  ${(summary.missedCreditRate * 100).toFixed(1)}%\n`);

  if (updateBaseline) {
    await fs.writeFile(BASELINE_PATH, JSON.stringify(summary, null, 2) + '\n');
    process.stdout.write(`\nBaseline updated at ${path.relative(process.cwd(), BASELINE_PATH)}.\n`);
    process.exit(0);
  }

  const baseline = await loadBaseline();
  if (!baseline) {
    process.stdout.write(`\nNo baseline.json yet — pass --update-baseline to seed.\n`);
    process.exit(0);
  }

  const delta = summary.mae - baseline.mae;
  process.stdout.write(`\nMAE vs baseline (${baseline.mae}): ${delta >= 0 ? '+' : ''}${round(delta, 3)}\n`);
  if (delta > 1) {
    process.stderr.write(`\nFAIL: MAE regressed by more than 1 mark. Block deploy.\n`);
    process.exit(1);
  }
  process.stdout.write(`PASS\n`);
}

async function runOne(id) {
  const dir = path.join(GOLD_DIR, id);
  const prompt = JSON.parse(await fs.readFile(path.join(dir, 'prompt.json'), 'utf8'));
  const tutor = JSON.parse(await fs.readFile(path.join(dir, 'tutor-mark.json'), 'utf8'));

  const aiResponse = await callMarker(prompt);
  const aiPerRubric = parseAiResponse(aiResponse, tutor.perRubric);

  const perRubric = tutor.perRubric.map((line, i) => ({
    id: `${id}#${i}`,
    description: line.description,
    marksAvailable: line.marks,
    tutorAwarded: line.awarded,
    aiAwarded: aiPerRubric[i]?.awarded ?? 0,
  }));

  return { perRubric, aiTotalAwarded: aiPerRubric.reduce((s, r) => s + r.awarded, 0), tutorTotalAwarded: tutor.totalMarksAwarded };
}

async function callMarker(prompt) {
  const url = `${base.replace(/\/$/, '')}/api/mark`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(prompt),
  });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return await res.text();
}

/**
 * The current /api/mark returns markdown prose; parsing for per-rubric scores
 * is a regex over the structured "Marks awarded" panel. Once Sprint 5
 * upgrades /api/mark to emit structured JSON, replace this with a JSON parse.
 */
function parseAiResponse(text, tutorRubric) {
  // Stub heuristic — counts mentions of "✓"/"correct"/"awarded" near each
  // rubric description. Production parser lives behind a flag in /api/mark v2.
  return tutorRubric.map((line) => {
    const re = new RegExp(`${escapeRe(line.description.slice(0, 24))}[^\n]*?(✓|awarded|correct|earns)`, 'i');
    const hit = re.test(text);
    return { awarded: hit ? line.marks : 0 };
  });
}

async function loadBaseline() {
  try {
    return JSON.parse(await fs.readFile(BASELINE_PATH, 'utf8'));
  } catch {
    return null;
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

function mean(xs) {
  if (xs.length === 0) return 0;
  return xs.reduce((s, x) => s + x, 0) / xs.length;
}
function pearson(xs, ys) {
  if (xs.length < 2 || ys.length !== xs.length) return 0;
  const mx = mean(xs), my = mean(ys);
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < xs.length; i++) {
    const a = xs[i] - mx, b = ys[i] - my;
    num += a * b; dx += a * a; dy += b * b;
  }
  const den = Math.sqrt(dx * dy);
  return den === 0 ? 0 : num / den;
}
function ratio(num, denom) {
  return denom === 0 ? 0 : num / denom;
}
function round(n, dp) {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
}
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main().catch((e) => {
  process.stderr.write(`eval runner failed: ${e?.stack || e}\n`);
  process.exit(2);
});
