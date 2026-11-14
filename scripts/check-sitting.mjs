#!/usr/bin/env node
/**
 * Build guard: fail if every listed exam sitting is in the past, so an
 * expired sitting can never silently ship. Bypass with ALLOW_PAST_SITTING=1.
 */
import { readFileSync } from 'node:fs';

const file = 'src/config/sitting.ts';
const txt = readFileSync(file, 'utf8');
const all = [...txt.matchAll(/examAt:\s*'([^']+)'/g)].map((m) => m[1]);
if (all.length === 0) {
  console.error(`check-sitting: could not find any examAt in ${file}`);
  process.exit(1);
}
const bad = all.filter((v) => Number.isNaN(+new Date(v)));
if (bad.length) {
  console.error(`check-sitting: examAt is not a valid date: ${bad.join(', ')}`);
  process.exit(1);
}
const now = new Date();
const upcoming = all.filter((v) => new Date(v) > now).sort();
if (upcoming.length === 0 && !process.env.ALLOW_PAST_SITTING) {
  console.error(`\n✖ check-sitting: every listed sitting (${all.join(', ')}) is in the PAST.`);
  console.error(`  Add the next ACCA sitting to SITTINGS in ${file} before deploying.`);
  console.error(`  (set ALLOW_PAST_SITTING=1 to bypass for a local build.)\n`);
  process.exit(1);
}
if (upcoming.length === 0) {
  console.log('! check-sitting: no upcoming sitting, bypassed by ALLOW_PAST_SITTING.');
} else {
  const days = Math.ceil((+new Date(upcoming[0]) - +now) / 86_400_000);
  console.log(`✓ check-sitting: ${upcoming.length} upcoming sitting(s); next is ${upcoming[0]} (${days} days away).`);
  if (upcoming.length === 1) console.log('  Only one upcoming sitting is listed: add the next one when ACCA publishes it.');
}
