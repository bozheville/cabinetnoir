// Generates the brand mark and every raster derived from it: the Open
// Graph banner and square card, touch/PWA icons and favicon.ico. Run by
// hand after changing the mark; the outputs are committed.
//
//   node scripts/generate-brand-images.js
//
// The mark is the hero Sunburst (src/@ornaments) cut to a half fan with a
// "CN" monogram inside the inner arc: brass rays, copper letters, green
// leather ground. Letters are geometry, not type, so no font is involved.
//
// sharp and @vercel/og are not direct dependencies; both ship with Next.js.
// Wordmark text goes through @vercel/og (satori), which shapes glyphs from
// the repo's Roboto Slab file. sharp's Pango text ignores `fontfile` on
// macOS and silently falls back to a system sans.

const fs = require('fs');
const path = require('path');
const React = require('react');
const sharp = require('sharp');

const PUBLIC = path.join(__dirname, '..', 'public');
const FONTS = path.join(PUBLIC, 'fonts');

// Mirrors src/@theme/materials.ts (TypeScript, so not requirable here).
const leather = { green: { base: '#2f4a3b', seam: '#1f3328' } };
const metal = {
  brass: { highlight: '#f3dc9a', light: '#e2c47a', base: '#c9a04f', dark: '#8a6212' },
  copper: { highlight: '#f5c7a4', light: '#e7a77c', base: '#c58052', dark: '#8f4a2a' },
};
const thread = { cream: '#f3e9d2' };

const TAGLINE = 'Learn cryptography by breaking real ciphers, step by step.';
const SLAB = path.join(FONTS, 'Roboto_Slab', 'static', 'RobotoSlab-Regular.ttf');

const brassStops = [
  [0, metal.brass.highlight],
  [0.18, metal.brass.light],
  [0.55, metal.brass.base],
  [1, metal.brass.dark],
];
const copperStops = [
  [0, metal.copper.highlight],
  [0.18, metal.copper.light],
  [0.55, metal.copper.base],
  [1, metal.copper.dark],
];

const gradient = (id, stops, y1, y2) =>
  `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${y1}" x2="0" y2="${y2}">`
  + stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')
  + '</linearGradient>';

const f = (n) => Number(n.toFixed(1));

// The mark on a 512 grid: half fan centred on (256, cy), rays between rIn
// and rOut, monogram inside the arc. `compact` trades ray count for stroke
// weight so the mark survives 32px; `bare` drops the rays for 16px.
// Returns the tight bounding box too.
const markParts = ({ compact = false, bare = false } = {}) => {
  const cx = 256;
  const cy = compact ? 384 : 376;
  const rOut = compact ? 248 : 232;
  const rIn = compact ? 206 : 166;
  const rArc = bare ? 236 : compact ? 186 : 150;
  const rays = bare ? 0 : compact ? 6 : 24;
  const wide = compact ? 24 : 7;
  const thin = compact ? 24 : 3.5;
  const arcW = bare ? 36 : compact ? 20 : 8;
  const baseW = bare ? 36 : compact ? 20 : 8;

  // Skip k = 0 and k = rays: horizontal rays would merge with the baseline.
  let rayPaths = '';
  for (let k = 1; k < rays; k++) {
    const a = (Math.PI * k) / rays;
    const p = (r) => `${f(cx - Math.cos(a) * r)} ${f(cy - Math.sin(a) * r)}`;
    rayPaths += `<path d="M${p(rIn)} L${p(rOut)}" stroke-width="${k % 2 ? thin : wide}"/>`;
  }
  const span = bare ? rArc + arcW / 2 : rOut;
  const fan = `<g fill="none" stroke="url(#brass)" stroke-linecap="butt">${rayPaths}`
    + `<path d="M${cx - rArc} ${cy} A${rArc} ${rArc} 0 0 1 ${cx + rArc} ${cy}" stroke-width="${arcW}"/>`
    + '</g>'
    + `<rect x="${cx - span}" y="${cy}" width="${span * 2}" height="${baseW}" fill="url(#brass)"/>`;

  // Monogram box sits on the baseline, inside the arc.
  const lw = bare ? 44 : compact ? 28 : 18;
  const h = bare ? 160 : compact ? 128 : 92;
  const w = bare ? 118 : compact ? 90 : 58;
  const gap = bare ? 20 : compact ? 18 : 16;
  const bottom = cy - (bare ? 8 : compact ? 14 : 22);
  const top = bottom - h;
  const left = cx - (w * 2 + gap) / 2;

  // C: elliptical arc open to the right, ends at +-48 degrees, butt caps.
  const rx = w / 2 - lw / 2 + 4;
  const ry = h / 2 - lw / 2;
  const ccx = left + lw / 2 + rx;
  const ccy = top + h / 2;
  const t = (48 * Math.PI) / 180;
  const ex = f(ccx + rx * Math.cos(t));
  const c = `<path d="M${ex} ${f(ccy - ry * Math.sin(t))} A${f(rx)} ${f(ry)} 0 1 0 ${ex} ${f(ccy + ry * Math.sin(t))}" `
    + `fill="none" stroke="url(#copper)" stroke-width="${lw}" stroke-linecap="butt"/>`;

  // N: filled stems plus diagonal band, so no miter spikes leave the box.
  const nl = left + w + gap;
  const nr = nl + w;
  const s = lw;
  const n = '<g fill="url(#copper)">'
    + `<rect x="${f(nl)}" y="${top}" width="${s}" height="${h}"/>`
    + `<rect x="${f(nr - s)}" y="${top}" width="${s}" height="${h}"/>`
    + `<path d="M${f(nl)} ${top} H${f(nl + s * 1.2)} L${f(nr)} ${bottom} H${f(nr - s * 1.2)} Z"/>`
    + '</g>';

  const defs = gradient('brass', brassStops, cy - span, cy + baseW)
    + gradient('copper', copperStops, top, bottom);

  const box = { x: cx - span, y: cy - span, w: span * 2, h: span + baseW };
  return { defs, body: fan + c + n, box };
};

// Mark alone on transparent ground, cropped to its bounding box.
const markCropSvg = (width) => {
  const { defs, body, box } = markParts();
  const height = Math.round((width * box.h) / box.w);
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${box.x} ${box.y} ${box.w} ${box.h}">`
      + `<defs>${defs}</defs>${body}</svg>`,
    height,
  };
};

// Mark centred on a square green tile: favicon, touch icon, logo.svg.
const markTileSvg = ({ size = 512, compact = false, bare = false, rounded = 0 } = {}) => {
  const { defs, body, box } = markParts({ compact: compact || bare, bare });
  const pad = bare ? 16 : compact ? 8 : 40;
  const scale = (512 - pad * 2) / box.w;
  const dy = (512 - box.h * scale) / 2 - box.y * scale;
  const dx = pad - box.x * scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">`
    + `<defs>${defs}</defs>`
    + `<rect width="512" height="512" rx="${rounded}" fill="${leather.green.base}"/>`
    + `<g transform="translate(${f(dx)} ${f(dy)}) scale(${scale.toFixed(4)})">${body}</g>`
    + '</svg>';
};

// Double inset rule in brass, the deco frame used across the site.
const frame = (width, height, inset, weight) => {
  const inner = inset + weight * 3;
  return `<g fill="none" stroke="${metal.brass.base}">`
    + `<rect x="${inset}" y="${inset}" width="${width - inset * 2}" height="${height - inset * 2}" stroke-width="${weight}"/>`
    + `<rect x="${inner}" y="${inner}" width="${width - inner * 2}" height="${height - inner * 2}" stroke-width="${weight / 2}" stroke-opacity="0.6"/>`
    + '</g>';
};

const ground = (width, height, inset, weight) => Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`
  + `<rect width="${width}" height="${height}" fill="${leather.green.base}"/>`
  + frame(width, height, inset, weight)
  + '</svg>',
);

// Copper rule ending in a lozenge, as in HeadingRule.
const rule = (width, align = 'left') => {
  const svg = align === 'center'
    ? `<path d="M0 6 H${width / 2 - 10} M${width / 2 + 10} 6 H${width}" stroke="${metal.copper.base}" stroke-width="2"/>`
      + `<rect x="${width / 2 - 3.5}" y="2.5" width="7" height="7" transform="rotate(45 ${width / 2} 6)" fill="${metal.copper.base}"/>`
    : `<path d="M0 6 H${width - 14}" stroke="${metal.copper.base}" stroke-width="2"/>`
      + `<rect x="${width - 10}" y="2.5" width="7" height="7" transform="rotate(45 ${width - 6.5} 6)" fill="${metal.copper.base}"/>`;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="12">${svg}</svg>`);
};

// Renders text on a transparent canvas, then trims it to the ink box so
// layout maths works on visible glyphs only.
const text = async (content, { size, color, width, align = 'left' }) => {
  const { ImageResponse } = await import('next/dist/compiled/@vercel/og/index.node.js');
  const el = React.createElement('div', {
    style: {
      display: 'flex',
      width,
      justifyContent: align === 'centre' ? 'center' : 'flex-start',
      textAlign: align === 'centre' ? 'center' : 'left',
      fontFamily: 'Roboto Slab',
      fontSize: size,
      lineHeight: 1.3,
      color,
    },
  }, content);
  const res = new ImageResponse(el, {
    width,
    height: Math.ceil(size * 1.3 * 3),
    fonts: [{ name: 'Roboto Slab', data: fs.readFileSync(SLAB), weight: 400, style: 'normal' }],
  });
  const raw = Buffer.from(await res.arrayBuffer());
  const { data: buffer, info } = await sharp(raw).trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true });
  return { buffer, w: info.width, h: info.height };
};

const banner = async () => {
  const W = 1200;
  const H = 630;
  const markW = 440;
  const mark = markCropSvg(markW);
  const textW = 520;
  const space = 56;

  const title = await text('Cabinet Noir', { size: 72, color: metal.brass.light, width: textW });
  const tagline = await text(TAGLINE, { size: 30, color: thread.cream, width: textW });

  const left = Math.round((W - (markW + space + textW)) / 2);
  const textLeft = left + markW + space;
  const blockH = title.h + 24 + 12 + 24 + tagline.h;
  const textTop = Math.round((H - blockH) / 2);

  await sharp(ground(W, H, 24, 4))
    .composite([
      { input: Buffer.from(mark.svg), left, top: Math.round((H - mark.height) / 2) },
      { input: title.buffer, left: textLeft, top: textTop },
      { input: rule(140), left: textLeft, top: textTop + title.h + 24 },
      { input: tagline.buffer, left: textLeft, top: textTop + title.h + 24 + 12 + 24 },
    ])
    .png()
    .toFile(path.join(PUBLIC, 'og-image.png'));
};

const square = async () => {
  const S = 1200;
  const markW = 820;
  const mark = markCropSvg(markW);
  const title = await text('Cabinet Noir', { size: 112, color: metal.brass.light, width: 1000, align: 'centre' });
  const ruleW = 360;

  const blockH = mark.height + 72 + title.h + 36 + 12;
  const top = Math.round((S - blockH) / 2);

  await sharp(ground(S, S, 40, 6))
    .composite([
      { input: Buffer.from(mark.svg), left: Math.round((S - markW) / 2), top },
      { input: title.buffer, left: Math.round((S - title.w) / 2), top: top + mark.height + 72 },
      { input: rule(ruleW, 'center'), left: Math.round((S - ruleW) / 2), top: top + mark.height + 72 + title.h + 36 },
    ])
    .png()
    .toFile(path.join(PUBLIC, 'og-image-square.png'));
};

// favicon.ico with embedded PNG frames (supported by every current browser).
const writeIco = (frames, file) => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  const entries = [];
  let offset = 6 + 16 * frames.length;
  for (const { size, data } of frames) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  fs.writeFileSync(file, Buffer.concat([header, ...entries, ...frames.map((p) => p.data)]));
};

const render = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

const main = async () => {
  fs.writeFileSync(path.join(PUBLIC, 'images', 'logo.svg'), markTileSvg());
  fs.writeFileSync(path.join(PUBLIC, 'icon.svg'), markTileSvg({ compact: true, rounded: 64 }));

  await banner();
  await square();

  const full = markTileSvg({ size: 1024 });
  const compact = markTileSvg({ size: 1024, compact: true });
  const bare = markTileSvg({ size: 1024, bare: true });
  fs.writeFileSync(path.join(PUBLIC, 'icon-512.png'), await render(full, 512));
  fs.writeFileSync(path.join(PUBLIC, 'apple-touch-icon.png'), await render(full, 180));

  const frames = [];
  for (const size of [16, 32, 48]) {
    frames.push({ size, data: await render(size === 16 ? bare : compact, size) });
  }
  writeIco(frames, path.join(PUBLIC, 'favicon.ico'));
};

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
