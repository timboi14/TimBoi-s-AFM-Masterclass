import { build } from 'esbuild';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const tempDir = await mkdtemp(path.join(tmpdir(), 'tba-public-stats-'));
const statsBundle = path.join(tempDir, 'stats.mjs');
const topicsBundle = path.join(tempDir, 'topics.mjs');
const writeIfChanged = async (file, source) => {
  const previous = await readFile(file, 'utf8').catch(() => '');
  if (previous !== source) await writeFile(file, source, 'utf8');
};

try {
  const common = { bundle: true, format: 'esm', platform: 'node', target: 'node20', alias: { '@': path.join(root, 'src') }, logLevel: 'silent' };
  await build({ ...common, entryPoints: [path.join(root, 'src/data/stats-derive.ts')], outfile: statsBundle });
  const { TBA_STATS } = await import(`${pathToFileURL(statsBundle).href}?v=${Date.now()}`);
  await writeIfChanged(path.join(root, 'src/data/tba-stats.generated.ts'), `/** Generated from stats-derive.ts. Run npm run stats; do not edit. */\nexport const TBA_STATS_SNAPSHOT = ${JSON.stringify(TBA_STATS, null, 2)} as const;\n`);

  const publicStats = {
    sourcedPaperItems: TBA_STATS.verifiedPapers,
    topicGroups: TBA_STATS.topicGroups,
    theoryPrompts: TBA_STATS.theoryQA,
    examinerCases: TBA_STATS.examinerReports,
    examinerQuotes: TBA_STATS.examinerQuotes,
    traps: TBA_STATS.traps,
    spreadsheetShortcuts: TBA_STATS.spreadsheetShortcuts,
    courseWeeks: TBA_STATS.courseWeeks,
    workedDrills: TBA_STATS.workedDrills,
  };
  await writeIfChanged(path.join(root, 'src/data/public-stats.generated.ts'), `/** Dependency-free Home snapshot. Generated; do not edit. */\nexport const PUBLIC_STATS = ${JSON.stringify(publicStats, null, 2)} as const;\n`);

  await build({ ...common, entryPoints: [path.join(root, 'src/data/topics.ts')], outfile: topicsBundle });
  const { TOPIC_LIST } = await import(`${pathToFileURL(topicsBundle).href}?v=${Date.now()}`);
  const missions = TOPIC_LIST.map(({ id, matchday, badge, syllabus, title, hook }) => ({ id, matchday, badge, syllabus, title, hook }));
  await writeIfChanged(path.join(root, 'src/data/public-missions.generated.ts'), `/** Dependency-free Home mission snapshot. Generated; do not edit. */\nexport const HOME_MISSIONS = ${JSON.stringify(missions, null, 2)} as const;\n`);
  console.log(`public data: ${Object.values(publicStats).join(' · ')} · ${missions.length} missions`);
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
