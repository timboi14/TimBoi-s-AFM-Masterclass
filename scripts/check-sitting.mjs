#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const file = 'src/config/sitting.ts';
const txt = readFileSync(file, 'utf8');
const m = txt.match(/examAt:\s*'([^']+)'/);
if (!m) {
  console.error(`check-sitting: could not find examAt in ${file}`);
  process.exit(1);
}
const examAt = new Date(m[1]);
if (Number.isNaN(+examAt)) {
  console.error(`check-sitting: examAt is not a valid date: ${m[1]}`);
  process.exit(1);
}
const now = new Date();
if (examAt <= now && !process.env.ALLOW_PAST_SITTING) {
  console.error(`\n✖ check-sitting: the sitting (${m[1]}) is in the PAST.`);
  console.error(`  Update ${file} to the next ACCA sitting before deploying.\n`);
  process.exit(1);
}
const days = Math.ceil((+examAt - +now) / 86_400_000);
console.log(`✓ check-sitting: sitting ${m[1]} is upcoming (${days} days away).`);
