// One-shot extractor for the past papers spec.
// Reads PAST_PAPERS_MODULE_SPEC_1.md, walks fenced code blocks in order,
// and writes each block out as a numbered file so we can grab them by index.
import fs from 'node:fs';
import path from 'node:path';

const src = fs.readFileSync(process.argv[2], 'utf8');
const outDir = process.argv[3];
fs.mkdirSync(outDir, { recursive: true });

const lines = src.split(/\r?\n/);
let inBlock = false;
let lang = '';
let buf = [];
let blockIdx = 0;
let lastHeading = '';
let lastSubHeading = '';
const manifest = [];

for (const line of lines) {
  const fence = line.match(/^```(\w+)?\s*$/);
  if (fence) {
    if (!inBlock) {
      inBlock = true;
      lang = fence[1] || 'txt';
      buf = [];
    } else {
      inBlock = false;
      const content = buf.join('\n') + '\n';
      const file = path.join(outDir, `${String(blockIdx).padStart(3, '0')}.${lang}`);
      fs.writeFileSync(file, content);
      manifest.push({ idx: blockIdx, lang, heading: lastHeading, sub: lastSubHeading, bytes: content.length, file: path.basename(file) });
      blockIdx += 1;
    }
    continue;
  }
  if (inBlock) {
    buf.push(line);
  } else {
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    if (h2) { lastHeading = h2[1]; lastSubHeading = ''; }
    if (h3) { lastSubHeading = h3[1]; }
  }
}

fs.writeFileSync(path.join(outDir, '_manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Extracted ${blockIdx} blocks to ${outDir}`);
console.log(`Manifest summary:`);
for (const m of manifest) {
  console.log(`  ${m.idx} [${m.lang}] ${m.bytes}B — ${m.heading} / ${m.sub}`);
}
