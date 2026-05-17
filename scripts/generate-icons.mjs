#!/usr/bin/env node
/**
 * Generate PWA / iOS icons from public/favicon.svg.
 *
 * Spec §15 + §22: replace the SVG-everywhere manifest icon set with real
 * PNG/maskable assets at the canonical sizes. Idempotent; rerun whenever
 * favicon.svg changes.
 *
 * Outputs (public/icons/):
 *   icon-192.png             (any purpose, 192x192)
 *   icon-512.png             (any purpose, 512x512)
 *   icon-maskable-192.png    (maskable purpose, padded safe zone)
 *   icon-maskable-512.png    (maskable purpose, padded safe zone)
 *   apple-touch-icon.png     (iOS, 180x180, opaque background)
 *   monochrome-512.png       (monochrome purpose, tint masks)
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SRC = path.resolve(ROOT, 'public/favicon.svg');
const OUT = path.resolve(ROOT, 'public/icons');

const BG = '#0a0f1e'; // matches manifest theme_color + favicon background
const MASKABLE_BG = '#0a0f1e';

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const svg = await fs.readFile(SRC);

  // "Any" purpose at 192 and 512: render the SVG full-bleed (no padding).
  // The SVG already includes a dark rounded background.
  await render(svg, path.join(OUT, 'icon-192.png'), 192, 0);
  await render(svg, path.join(OUT, 'icon-512.png'), 512, 0);

  // Maskable: per W3C spec, the safe zone is a circle of diameter 80% of the
  // icon. Pad the artwork to 80% of the canvas and fill the surrounding area
  // with the background colour so launchers can crop it into circles/squircles
  // without clipping the mark.
  await renderMaskable(svg, path.join(OUT, 'icon-maskable-192.png'), 192);
  await renderMaskable(svg, path.join(OUT, 'icon-maskable-512.png'), 512);

  // iOS Apple Touch Icon: opaque background, no transparency, 180x180.
  await render(svg, path.join(OUT, 'apple-touch-icon.png'), 180, 0);

  // Monochrome: re-render with all colour stripped to white for tint masks.
  const monochromeSvg = stripToWhite(svg.toString('utf8'));
  await render(Buffer.from(monochromeSvg, 'utf8'), path.join(OUT, 'monochrome-512.png'), 512, 0, true);

  const report = await Promise.all(
    [
      'icon-192.png',
      'icon-512.png',
      'icon-maskable-192.png',
      'icon-maskable-512.png',
      'apple-touch-icon.png',
      'monochrome-512.png',
    ].map(async (f) => {
      const stat = await fs.stat(path.join(OUT, f));
      return `  ${f.padEnd(28)} ${(stat.size / 1024).toFixed(1)} KB`;
    }),
  );

  process.stdout.write(`icons generated in public/icons/:\n${report.join('\n')}\n`);
}

async function render(svg, outPath, size, padding, transparent = false) {
  const img = sharp(svg, { density: 384 }).resize(size, size, { fit: 'contain', background: transparent ? { r: 0, g: 0, b: 0, alpha: 0 } : BG });
  await img.png({ compressionLevel: 9 }).toFile(outPath);
}

async function renderMaskable(svg, outPath, size) {
  // 80% safe zone — render artwork at 80% of the target and centre-paste it
  // onto a full-size background canvas in the brand colour.
  const inner = Math.round(size * 0.8);
  const artwork = await sharp(svg, { density: 384 })
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const canvas = sharp({
    create: { width: size, height: size, channels: 4, background: MASKABLE_BG },
  });
  await canvas
    .composite([{ input: artwork, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(outPath);
}

function stripToWhite(svgText) {
  // Replace every fill/stroke colour with white so the icon becomes a monochrome
  // mask suitable for tinting by the OS.
  return svgText
    .replace(/fill="[^"]+"/g, 'fill="#ffffff"')
    .replace(/stroke="[^"]+"/g, 'stroke="#ffffff"');
}

main().catch((e) => {
  process.stderr.write(`icon generation failed: ${e?.stack || e}\n`);
  process.exit(1);
});
