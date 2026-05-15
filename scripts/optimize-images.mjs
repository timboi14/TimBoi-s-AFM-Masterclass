#!/usr/bin/env node
/**
 * Re-export the heavy Spurs PNGs in /public/spurs/ to WebP + AVIF + a tiny PNG fallback.
 *
 * Idempotent: rerun any time the source PNGs change. The originals are read but
 * the new outputs go alongside (e.g. training.png stays, gets a sibling training.webp,
 * training@2x.webp, training.avif, training@2x.avif, and a re-encoded training.png).
 *
 * Mascot is treated specially: it renders at 28x28 in the active nav pill, so
 * the source weight should be ~10 KB not ~5 MB.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SPURS_DIR = path.resolve(process.cwd(), 'public/spurs');

// Backdrops render at 520 px wide (the lg breakpoint). Source at 1040 px gives
// 2x retina headroom; 1x derivative is 520 px.
const BACKDROP_SIZES = { '1x': 520, '2x': 1040 };
// Mascot renders at 28 px in the active nav pill. 64 px source covers 2x.
const MASCOT_SIZES = { '1x': 32, '2x': 64 };

const QUALITY = {
  webp: 78,
  avif: 55,
  png: 85,
};

async function optimizeOne(file) {
  const full = path.join(SPURS_DIR, file);
  const base = file.replace(/\.png$/i, '');
  const isMascot = base === 'mascot';
  const sizes = isMascot ? MASCOT_SIZES : BACKDROP_SIZES;

  const before = (await fs.stat(full)).size;
  const source = sharp(full);

  const results = [];

  for (const [tag, width] of Object.entries(sizes)) {
    const suffix = tag === '2x' ? '@2x' : '';

    const webpOut = path.join(SPURS_DIR, `${base}${suffix}.webp`);
    await source
      .clone()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY.webp, effort: 6 })
      .toFile(webpOut);
    results.push({ path: webpOut, size: (await fs.stat(webpOut)).size });

    const avifOut = path.join(SPURS_DIR, `${base}${suffix}.avif`);
    await source
      .clone()
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: QUALITY.avif, effort: 4 })
      .toFile(avifOut);
    results.push({ path: avifOut, size: (await fs.stat(avifOut)).size });
  }

  // PNG fallback at the 1x size (replaces the heavy original).
  const pngOut = path.join(SPURS_DIR, `${base}.png`);
  await source
    .clone()
    .resize({ width: sizes['1x'], withoutEnlargement: true })
    .png({ quality: QUALITY.png, compressionLevel: 9, palette: true })
    .toFile(pngOut + '.tmp');
  await fs.rename(pngOut + '.tmp', pngOut);
  results.push({ path: pngOut, size: (await fs.stat(pngOut)).size });

  const after = results.reduce((n, r) => n + r.size, 0);
  return { file, before, after, results };
}

async function main() {
  const entries = await fs.readdir(SPURS_DIR);
  const pngs = entries.filter((f) => f.endsWith('.png'));

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of pngs) {
    const { before, after, results } = await optimizeOne(file);
    totalBefore += before;
    totalAfter += after;
    const fmt = (n) => (n / 1024).toFixed(1) + ' KB';
    console.log(
      `${file.padEnd(20)}  ${fmt(before).padStart(10)}  ->  ${fmt(after).padStart(10)}  (${results.length} outputs)`,
    );
  }

  const fmt = (n) => (n / 1024 / 1024).toFixed(2) + ' MB';
  console.log('-'.repeat(60));
  console.log(`TOTAL                 ${fmt(totalBefore).padStart(10)}  ->  ${fmt(totalAfter).padStart(10)}`);
  console.log(`Reduction: ${(100 - (totalAfter / totalBefore) * 100).toFixed(1)}%`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
