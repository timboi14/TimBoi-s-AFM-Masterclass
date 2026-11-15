#!/usr/bin/env node
/**
 * Unit tests for pure logic (no browser). Bundles each TypeScript module with
 * esbuild and runs plain assertions:  npm run test:unit
 */
import { build } from 'esbuild';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const dir = mkdtempSync(path.join(tmpdir(), 'tba-unit-'));
async function load(entry) {
  const outfile = path.join(dir, entry.replace(/\W+/g, '_') + '.mjs');
  await build({
    entryPoints: [entry], outfile, bundle: true, format: 'esm', platform: 'node', logLevel: 'silent',
    alias: { '@': path.resolve('src') },
  });
  return import(pathToFileURL(outfile).href);
}

let passed = 0;
const failures = [];
function test(name, fn) {
  try { fn(); passed += 1; } catch (e) { failures.push(`✘ ${name}\n    ${e.message.split('\n')[0]}`); }
}

// Storage shim so modules that touch localStorage load under Node.
const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => void mem.set(k, String(v)),
  removeItem: (k) => void mem.delete(k),
  key: (i) => [...mem.keys()][i] ?? null,
  get length() { return mem.size; },
};

const habits = await load('src/lib/habits.ts');
const sitting = await load('src/config/sitting.ts');
const backup = await load('src/lib/db/backup.ts');

const ev = (day, type = 'card_review', extra = {}) => ({ ts: new Date(`${day}T12:00:00`).getTime(), day, type, ...extra });
const run = (from, n) => Array.from({ length: n }, (_, i) => {
  const d = new Date(`${from}T12:00:00`); d.setDate(d.getDate() + i);
  return ev(d.toISOString().slice(0, 10));
});

test('streak: empty log is zero with one starting freeze', () => {
  const s = habits.computeStreak([], '2026-11-14');
  assert.equal(s.current, 0); assert.equal(s.freezes, 1); assert.equal(s.atRisk, false);
});
test('streak: three consecutive days ending today', () => {
  const s = habits.computeStreak(run('2026-11-12', 3), '2026-11-14');
  assert.equal(s.current, 3); assert.equal(s.activeToday, true);
});
test('streak: today empty does not break the run, but flags risk', () => {
  const s = habits.computeStreak(run('2026-11-11', 3), '2026-11-14');
  assert.equal(s.current, 3); assert.equal(s.atRisk, true);
});
test('streak: one missed day spends the freeze and holds the run', () => {
  const s = habits.computeStreak([ev('2026-11-10'), ev('2026-11-11'), ev('2026-11-13'), ev('2026-11-14')], '2026-11-14');
  assert.equal(s.current, 4); assert.equal(s.freezes, 0); assert.deepEqual(s.frozenDays, ['2026-11-12']);
});
test('streak: two missed days with one freeze resets', () => {
  const s = habits.computeStreak([ev('2026-11-09'), ev('2026-11-10'), ev('2026-11-13'), ev('2026-11-14')], '2026-11-14');
  assert.equal(s.current, 2); assert.equal(s.best, 2);
});
test('streak: freezes refill every five active days, capped at two', () => {
  const s = habits.computeStreak(run('2026-10-01', 20), '2026-10-20');
  assert.equal(s.current, 20); assert.equal(s.freezes, 2);
});
test('streak: a visit alone is not study', () => {
  const s = habits.computeStreak([ev('2026-11-14', 'visit')], '2026-11-14');
  assert.equal(s.current, 0); assert.equal(s.activeToday, false);
});
test('streak: long gap resets and best is remembered', () => {
  const s = habits.computeStreak([...run('2026-09-01', 6), ev('2026-11-14')], '2026-11-14');
  assert.equal(s.current, 1); assert.equal(s.best, 6);
});
test('week: Monday start, Sunday belongs to the same week', () => {
  assert.equal(habits.weekStart('2026-11-14'), '2026-11-09'); // Saturday
  assert.equal(habits.weekStart('2026-11-15'), '2026-11-09'); // Sunday
  assert.equal(habits.weekStart('2026-11-16'), '2026-11-16'); // Monday
});
test('week: progress counts active days and detects out-of-reach goals', () => {
  const p = habits.weekProgress([ev('2026-11-09'), ev('2026-11-11')], 4, '2026-11-14');
  assert.equal(p.done, 2); assert.equal(p.remaining, 2); assert.equal(p.outOfReach, false); assert.equal(p.met, false);
  const q = habits.weekProgress([ev('2026-11-09')], 5, '2026-11-14');
  assert.equal(q.outOfReach, true);
  const r = habits.weekProgress(run('2026-11-09', 4), 4, '2026-11-14');
  assert.equal(r.met, true);
});
test('heat map: twelve weeks of seven days, last column is the current week', () => {
  const h = habits.heatMap([ev('2026-11-14'), ev('2026-11-14'), ev('2026-11-14')], 12, '2026-11-14');
  assert.equal(h.length, 12); assert.equal(h[11][5].day, '2026-11-14'); assert.equal(h[11][5].level, 2);
  assert.equal(h[11][6].isFuture, true);
});
test('recap: buckets by type and averages marked scores', () => {
  const r = habits.recapWeek([
    ev('2026-11-10'), ev('2026-11-10', 'question_attempt', { minutes: 30 }),
    ev('2026-11-11', 'answer_marked', { value: 60 }), ev('2026-11-11', 'answer_marked', { value: 70 }),
    ev('2026-11-02'), ev('2026-11-10', 'visit'),
  ], '2026-11-09');
  assert.equal(r.activeDays, 2); assert.equal(r.cards, 1); assert.equal(r.questions, 1);
  assert.equal(r.minutes, 30); assert.equal(r.avgScore, 65); assert.equal(r.actions, 4);
});

const at = (iso) => new Date(iso).getTime();
test('sitting: default skips a sitting whose entry has closed', () => {
  assert.equal(sitting.resolveSitting('', at('2026-11-14T12:00:00')).id, '2027-03');
});
test('sitting: an explicit choice is honoured until results day', () => {
  assert.equal(sitting.resolveSitting('2026-12', at('2026-12-20T12:00:00')).id, '2026-12');
  assert.equal(sitting.resolveSitting('2026-12', at('2027-01-19T12:00:00')).id, '2027-03');
});
test('sitting: unknown choice falls back to the default', () => {
  assert.equal(sitting.resolveSitting('nope', at('2026-11-14T12:00:00')).id, '2027-03');
});
test('sitting: every sitting has ordered, valid dates', () => {
  for (const s of sitting.SITTINGS) {
    assert.ok(at(s.entryDeadlineAt) < at(s.lateEntryDeadlineAt), s.id);
    assert.ok(at(s.lateEntryDeadlineAt) < at(s.examAt), s.id);
    assert.ok(at(s.examAt) < at(s.resultsAt), s.id);
    assert.equal(new Date(`${s.courseStartMonday}T12:00:00`).getDay(), 1, `${s.id} course must start on a Monday`);
  }
});

test('backup: rejects files that are not Academy backups', () => {
  assert.equal(backup.parseBackup('not json').ok, false);
  assert.equal(backup.parseBackup('{"manifest":{"app":"other","version":1},"storage":{}}').ok, false);
  assert.equal(backup.parseBackup('{"manifest":{"app":"tba-academy","version":9},"storage":{}}').ok, false);
  assert.equal(backup.parseBackup('{"manifest":{"app":"tba-academy","version":1},"storage":[]}').ok, false);
});
test('backup: keeps only app-owned keys and valid events', () => {
  const r = backup.parseBackup(JSON.stringify({
    manifest: { app: 'tba-academy', version: 2, exportedAt: '2026-11-14T10:00:00.000Z' },
    storage: { tba_points: 120, 'tba-dark': '1', other_site_token: 'secret', __proto__x: 1 },
    events: [ev('2026-11-14'), { nonsense: true }],
  }));
  assert.equal(r.ok, true); assert.equal(r.keyCount, 2); assert.equal(r.eventCount, 1);
  assert.equal('other_site_token' in r.backup.storage, false);
});
test('backup: device settings are not counted as progress', () => {
  assert.equal(backup.progressKeyCount({ 'tba-dark': '1', 'tba.settings.v2': {}, tba_points: 5 }), 1);
  assert.equal(backup.progressKeyCount({ 'afm-classroom-2026-v1': {}, 'afm-reading-preferences-v1': {} }), 1);
});

const ms = await load('src/lib/marker-score.ts');
test('marker: SCORE_JSON line is authoritative and carries the breakdown', () => {
  const r = ms.parseMarkerScore('**Marks awarded: 9 / 10**\nA 50/50 split...\nSCORE_JSON: {"awarded":7,"available":10,"points":[{"n":1,"awarded":2,"available":3},{"n":2,"awarded":5,"available":7}]}');
  assert.equal(r.source, 'json'); assert.equal(r.pct, 70); assert.equal(r.points.length, 2);
});
test('marker: falls back to the heading, not to any stray fraction', () => {
  const r = ms.parseMarkerScore('The split was 50/50 and ROI was 12/15.\n**Marks awarded: 6.5 / 13**');
  assert.equal(r.source, 'heading'); assert.equal(r.pct, 50);
  assert.equal(ms.parseMarkerScore('A 50/50 split with a 12% margin and nothing else.'), null);
});
test('marker: malformed or impossible scores are rejected or capped', () => {
  assert.equal(ms.parseMarkerScore('SCORE_JSON: {"awarded":3,"available":0}'), null);
  assert.equal(ms.parseMarkerScore('SCORE_JSON: {oops}'), null);
  assert.equal(ms.parseMarkerScore('SCORE_JSON: {"awarded":14,"available":10,"points":[]}').pct, 100);
});
test('marker: the machine line is hidden from the learner, even mid-stream', () => {
  assert.equal(ms.stripScoreLine('Good.\nSCORE_JSON: {"awarded":1,"available":2}'), 'Good.');
  assert.equal(ms.stripScoreLine('Good.\nSCORE_JS'), 'Good.');
});

// AI endpoints: fallback limiter and origin filter, with the provider mocked.
process.env.DEEPSEEK_API_KEY = 'test-key';
delete process.env.UPSTASH_REDIS_REST_URL; delete process.env.UPSTASH_REDIS_REST_TOKEN;
const realFetch = globalThis.fetch;
let upstreamCalls = 0;
globalThis.fetch = async () => { upstreamCalls += 1; return new Response('data: [DONE]\n\n', { status: 200 }); };
const quiet = console.log; console.log = () => {};
for (const name of ['mark', 'coach']) {
  const mod = await load(`api/${name}.ts`);
  const body = name === 'mark'
    ? { paperName: 'P', paperSession: 'S', partLabel: 'a', partMarks: 10, partRequirement: 'Evaluate', studentWord: 'An answer long enough to be marked by the endpoint.' }
    : { paperName: 'P', paperSession: 'S', partLabel: 'a', partMarks: 10, partRequirement: 'Evaluate' };
  const call = (headers = {}) => mod.default(new Request('https://app.example/api/' + name, {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.9', host: 'app.example', ...headers }, body: JSON.stringify(body),
  }));
  const statuses = [];
  for (let i = 0; i < 22; i++) statuses.push((await call()).status);
  const foreign = (await call({ origin: 'https://evil.example' })).status;
  const sameOrigin = (await call({ origin: 'https://app.example', 'x-forwarded-for': '198.51.100.4' })).status;
  test(`api/${name}: allows the daily quota then returns 429 without Upstash`, () => {
    assert.equal(statuses.filter((x) => x === 200).length, 20, statuses.join(','));
    assert.deepEqual(statuses.slice(20), [429, 429]);
  });
  test(`api/${name}: rejects another site's origin, accepts its own`, () => {
    assert.equal(foreign, 403); assert.equal(sameOrigin, 200);
  });
}
console.log = quiet; globalThis.fetch = realFetch;

rmSync(dir, { recursive: true, force: true });
for (const f of failures) console.error(f);
console.log(`${failures.length ? '✘' : '✓'} unit: ${passed} passed, ${failures.length} failed`);
process.exit(failures.length ? 1 : 0);
