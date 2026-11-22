// Per-card Open Graph looks: leather tone + tone-on-tone ornament pattern +
// deco frame, one unique triple per cipher and per category. Plain CommonJS
// (not TypeScript) so Node scripts can `require` it, mirroring
// src/@learning/categories.js. Types live in og-looks.d.ts.
//
// Colours mirror src/@theme/materials.ts plus four OG-only tones below; the
// ornament motifs are the spec-04 kit (fan, chevron, stepped corner, lozenge,
// rivet, keystone, double rule). Nothing outside the kit is used.

// --- Colours -------------------------------------------------------------

const leather = {
  saddle: { base: '#8a5a33', seam: '#6a4425' },
  chestnut: { base: '#5a3320', seam: '#3f2316' },
  espresso: { base: '#2b1b13', seam: '#1a100b' },
  green: { base: '#2f4a3b', seam: '#1f3328' },
  olive: { base: '#5b5a34', seam: '#424123' },
  oxblood: { base: '#5e211d', seam: '#421613' },
  navy: { base: '#243246', seam: '#18222f' },
};

// OG-only dark tones (not in materials.ts): they split the chestnut-heavy
// substitution families so shared links are told apart at a glance.
const ogTones = {
  plum: { base: '#3e2440', seam: '#2a172c' },
  teal: { base: '#1f4446', seam: '#153032' },
  slate: { base: '#2e3440', seam: '#1f232d' },
  burgundy: { base: '#4a1a2a', seam: '#33121d' },
};

const TONES = { ...leather, ...ogTones };

const brass = { light: '#e2c47a', base: '#c9a04f' };
const cream = '#f3e9d2';

const hexToRgb = (hex) => {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
};
const rgbToHex = ([r, g, b]) => '#' + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('');
// Blend `a` toward `b` by `t` (0..1); `t` > 0 lightens when b is white.
const mix = (a, b, t) => rgbToHex(hexToRgb(a).map((c, i) => c + (hexToRgb(b)[i] - c) * t));

// Ornament ink: close tone-on-tone shade, ~8 % lighter than the leather.
const ornamentInk = (base) => mix(base, '#ffffff', 0.08);

// --- Ornaments ------------------------------------------------------------
// Each builder returns a `<pattern>` def for a 1200x630 card. Stroke-based,
// 1.5/0.75 weights like spec 04, drawn once and tiled by the renderer.

const ORNAMENTS = {
  fanScales: (ink) => {
    const row = (y, off) =>
      `<path d="M${-24 + off} ${y} A12 12 0 0 1 ${0 + off} ${y} A12 12 0 0 1 ${24 + off} ${y} A12 12 0 0 1 ${48 + off} ${y}"/>`;
    return `<pattern id="orn" patternUnits="userSpaceOnUse" width="48" height="24">`
      + `<g fill="none" stroke="${ink}" stroke-width="1.5">${row(0, 24)}${row(12, 0)}${row(24, 24)}</g></pattern>`;
  },
  chevron: (ink) =>
    `<pattern id="orn" patternUnits="userSpaceOnUse" width="48" height="24">`
    + `<g fill="none" stroke="${ink}" stroke-width="1.5">`
    + `<path d="M0 6 L12 18 L24 6 M24 6 L36 18 L48 6"/>`
    + `</g></pattern>`,
  ziggurat: (ink) =>
    `<pattern id="orn" patternUnits="userSpaceOnUse" width="60" height="60">`
    + `<path d="M0 60 V45 H15 V30 H30 V15 H45 V0 H60" fill="none" stroke="${ink}" stroke-width="1.5"/>`
    + `</pattern>`,
  lozenge: (ink) =>
    `<pattern id="orn" patternUnits="userSpaceOnUse" width="44" height="44">`
    + `<g fill="none" stroke="${ink}" stroke-width="1.5">`
    + `<path d="M22 8 L36 22 L22 36 L8 22 Z"/>`
    + `</g></pattern>`,
  cornerSunburst: (ink) => {
    const rays = [0, 15, 30, 45, 60, 75, 90].map((deg) => {
      const r = (deg * Math.PI) / 180;
      return `<path d="M0 0 L${(28 * Math.cos(r)).toFixed(1)} ${(-28 * Math.sin(r)).toFixed(1)}"/>`;
    }).join('');
    return `<pattern id="orn" patternUnits="userSpaceOnUse" width="80" height="80">`
      + `<g fill="none" stroke="${ink}" stroke-width="1.5">`
      + `<g>${rays}</g>`
      + `<g transform="scale(-1,1) translate(-80,0)">${rays}</g>`
      + `<g transform="scale(1,-1) translate(0,-80)">${rays}</g>`
      + `<g transform="scale(-1,-1) translate(-80,-80)">${rays}</g>`
      + `</g></pattern>`;
  },
  arcs: (ink) =>
    `<pattern id="orn" patternUnits="userSpaceOnUse" width="80" height="80">`
    + `<g fill="none" stroke="${ink}">`
    + `<path d="M0 20 A20 20 0 0 1 20 0" stroke-width="1.5"/>`
    + `<path d="M0 40 A40 40 0 0 1 40 0" stroke-width="0.75"/>`
    + `<path d="M0 60 A60 60 0 0 1 60 0" stroke-width="1.5"/>`
    + `</g></pattern>`,
  fluting: (ink) =>
    `<pattern id="orn" patternUnits="userSpaceOnUse" width="24" height="80">`
    + `<g stroke="${ink}" fill="none">`
    + `<path d="M8 0 V80" stroke-width="1.5"/>`
    + `<path d="M16 0 V80" stroke-width="0.75" stroke-opacity="0.6"/>`
    + `</g></pattern>`,
  herringbone: (ink) =>
    `<pattern id="orn" patternUnits="userSpaceOnUse" width="48" height="48">`
    + `<g fill="none" stroke="${ink}" stroke-width="1.5">`
    + `<path d="M0 12 L12 0 M12 12 L24 0 M0 36 L12 24 M12 36 L24 24"/>`
    + `<path d="M24 12 L36 0 M36 12 L48 0 M24 36 L36 24 M36 36 L48 24"/>`
    + `</g></pattern>`,
  stepTiles: (ink) =>
    `<pattern id="orn" patternUnits="userSpaceOnUse" width="60" height="60">`
    + `<g fill="none" stroke="${ink}">`
    + `<rect x="0" y="0" width="60" height="60" stroke-width="1.5"/>`
    + `<rect x="15" y="15" width="30" height="30" stroke-width="0.75" stroke-opacity="0.6"/>`
    + `</g></pattern>`,
  pinstripe: (ink) =>
    `<pattern id="orn" patternUnits="userSpaceOnUse" width="32" height="64">`
    + `<g stroke="${ink}" fill="none">`
    + `<path d="M16 0 V64" stroke-width="0.75"/>`
    + `<path d="M16 12 L20 16 L16 20 L12 16 Z" stroke-width="1.5"/>`
    + `</g></pattern>`,
};

// --- Frames ----------------------------------------------------------------
// Each builder returns an SVG fragment for a card of the given size, in
// brass. Corners drawn once and mirrored per spec 04.

const FRAMES = {
  double: (w, h, c) => {
    const inner = (inset, weight, opacity) =>
      `<rect x="${inset}" y="${inset}" width="${w - inset * 2}" height="${h - inset * 2}" stroke-width="${weight}" stroke-opacity="${opacity}"/>`;
    return `<g fill="none" stroke="${c}">${inner(24, 4, 1)}${inner(36, 2, 0.6)}</g>`;
  },
  stepped: (w, h, c) => {
    const s = 20;
    const edge = (inset, weight, opacity) => {
      const t = inset + s;
      return `<path d="M${t},${inset} H${w - t} V${inset + s} H${w - inset} V${h - t} H${w - t} V${h - inset} H${t} V${h - t} H${inset} V${inset + s} H${t} Z" fill="none" stroke="${c}" stroke-width="${weight}" stroke-opacity="${opacity}"/>`;
    };
    return edge(24, 4, 1) + edge(40, 1.5, 0.6);
  },
  rivet: (w, h, c) => {
    const i = 24;
    const r = 26;
    return `<g fill="none" stroke="${c}">`
      + `<rect x="${i}" y="${i}" width="${w - i * 2}" height="${h - i * 2}" stroke-width="4"/>`
      + `<rect x="${i + 12}" y="${i + 12}" width="${w - (i + 12) * 2}" height="${h - (i + 12) * 2}" stroke-width="1.5" stroke-opacity="0.6"/>`
      + `<g fill="${c}" stroke="none">`
      + `<circle cx="${i}" cy="${i}" r="5"/><circle cx="${w - i}" cy="${i}" r="5"/>`
      + `<circle cx="${i}" cy="${h - i}" r="5"/><circle cx="${w - i}" cy="${h - i}" r="5"/>`
      + `</g></g>`;
  },
  fan: (w, h, c) => {
    const i = 24;
    const rays = [0, 15, 30, 45, 60, 75, 90].map((deg) => {
      const r = (deg * Math.PI) / 180;
      return `<path d="M${i} ${i} L${(i + 22 * Math.cos(r)).toFixed(1)} ${(i - 22 * Math.sin(r)).toFixed(1)}"/>`;
    }).join('');
    return `<g fill="none" stroke="${c}" stroke-width="1.5">`
      + `<rect x="${i}" y="${i}" width="${w - i * 2}" height="${h - i * 2}" stroke-width="4"/>`
      + `<g>${rays}</g>`
      + `<g transform="translate(${w},0) scale(-1,1)">${rays}</g>`
      + `<g transform="translate(0,${h}) scale(1,-1)">${rays}</g>`
      + `<g transform="translate(${w},${h}) scale(-1,-1)">${rays}</g>`
      + `</g>`;
  },
  keystone: (w, h, c) => {
    const i = 24;
    const cx = w / 2;
    return `<g fill="none" stroke="${c}">`
      + `<rect x="${i}" y="${i}" width="${w - i * 2}" height="${h - i * 2}" stroke-width="4"/>`
      + `<rect x="${i + 12}" y="${i + 12}" width="${w - (i + 12) * 2}" height="${h - (i + 12) * 2}" stroke-width="1.5" stroke-opacity="0.6"/>`
      + `<path d="M${cx - 70} ${i} L${cx + 70} ${i} L${cx + 50} ${i + 34} L${cx - 50} ${i + 34} Z" stroke-width="4"/>`
      + `</g>`;
  },
  notched: (w, h, c) => {
    const i = 28;
    const n = 18;
    const path = `M${i + n},${i} H${w - i - n} L${w - i},${i + n} V${h - i - n} L${w - i - n},${h - i} H${i + n} L${i},${h - i - n} V${i + n} Z`;
    return `<g fill="none" stroke="${c}">`
      + `<path d="${path}" stroke-width="4"/>`
      + `<rect x="${i + 14}" y="${i + 14}" width="${w - (i + 14) * 2}" height="${h - (i + 14) * 2}" stroke-width="0.75" stroke-opacity="0.6"/>`
      + `<rect x="${i + 22}" y="${i + 22}" width="${w - (i + 22) * 2}" height="${h - (i + 22) * 2}" stroke-width="0.75" stroke-opacity="0.4"/>`
      + `</g>`;
  },
};

// --- Looks -----------------------------------------------------------------
// One unique {tone, ornament, frame} triple per card id. Ciphers take the
// tone of their primary category, so a family shares a colour and differs by
// ornament and frame. `hub` keeps the brand's green + the original frame.

const LOOKS = {
  hub: { tone: 'green', ornament: 'fanScales', frame: 'double' },

  // substitution tree.
  substitution: { tone: 'chestnut', ornament: 'ziggurat', frame: 'stepped' },
  monoalphabetic: { tone: 'chestnut', ornament: 'lozenge', frame: 'rivet' },
  shift: { tone: 'burgundy', ornament: 'chevron', frame: 'double' },
  'affine-family': { tone: 'plum', ornament: 'pinstripe', frame: 'keystone' },
  caesar: { tone: 'burgundy', ornament: 'lozenge', frame: 'fan' },
  rot13: { tone: 'burgundy', ornament: 'herringbone', frame: 'stepped' },
  pigpen: { tone: 'chestnut', ornament: 'cornerSunburst', frame: 'fan' },
  keyword: { tone: 'chestnut', ornament: 'arcs', frame: 'keystone' },
  atbash: { tone: 'plum', ornament: 'fanScales', frame: 'notched' },
  affine: { tone: 'plum', ornament: 'stepTiles', frame: 'rivet' },

  // polyalphabetic tree.
  polyalphabetic: { tone: 'green', ornament: 'chevron', frame: 'rivet' },
  'tabula-recta': { tone: 'teal', ornament: 'fluting', frame: 'double' },
  vigenere: { tone: 'teal', ornament: 'fanScales', frame: 'keystone' },
  beaufort: { tone: 'teal', ornament: 'herringbone', frame: 'stepped' },
  autokey: { tone: 'teal', ornament: 'ziggurat', frame: 'notched' },
  'disks-and-rotors': { tone: 'espresso', ornament: 'arcs', frame: 'fan' },
  alberti: { tone: 'espresso', ornament: 'lozenge', frame: 'keystone' },
  enigma: { tone: 'espresso', ornament: 'pinstripe', frame: 'rivet' },

  // other families.
  polygraphic: { tone: 'oxblood', ornament: 'stepTiles', frame: 'stepped' },
  playfair: { tone: 'oxblood', ornament: 'fluting', frame: 'fan' },
  'polybius-square': { tone: 'saddle', ornament: 'cornerSunburst', frame: 'notched' },
  polybius: { tone: 'saddle', ornament: 'herringbone', frame: 'keystone' },
  transposition: { tone: 'navy', ornament: 'pinstripe', frame: 'double' },
  railFence: { tone: 'navy', ornament: 'chevron', frame: 'notched' },
  columnar: { tone: 'navy', ornament: 'fanScales', frame: 'stepped' },
  saknussemm: { tone: 'navy', ornament: 'lozenge', frame: 'fan' },
  product: { tone: 'slate', ornament: 'arcs', frame: 'rivet' },
  nihilist: { tone: 'slate', ornament: 'ziggurat', frame: 'fan' },
  adfgvx: { tone: 'slate', ornament: 'fluting', frame: 'keystone' },
  vic: { tone: 'slate', ornament: 'stepTiles', frame: 'double' },
  'codes-and-encodings': { tone: 'olive', ornament: 'stepTiles', frame: 'notched' },
  morse: { tone: 'olive', ornament: 'pinstripe', frame: 'fan' },
  base64: { tone: 'olive', ornament: 'fluting', frame: 'stepped' },
};

// --- Card ground -----------------------------------------------------------
// Full background as one SVG: leather, ornament pattern, a feathered dark
// panel behind the text block (stacked rounded rects, no SVG filters needed),
// then the frame. Returns a Buffer for sharp composite, same role as
// `ground` in scripts/generate-brand-images.js.

const cardGround = (width, height, look) => {
  const tone = TONES[look.tone];
  const ink = ornamentInk(tone.base);
  const scrim = Array.from({ length: 6 }, (_, i) => {
    const inset = 28 + i * 14;
    return `<rect x="${inset}" y="${inset}" width="${width - inset * 2}" height="${height - inset * 2}" rx="32" fill="${tone.seam}" fill-opacity="0.07"/>`;
  }).join('');
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`
    + `<defs>${ORNAMENTS[look.ornament](ink)}</defs>`
    + `<rect width="${width}" height="${height}" fill="${tone.base}"/>`
    + `<rect width="${width}" height="${height}" fill="url(#orn)"/>`
    + scrim
    + FRAMES[look.frame](width, height, brass.base)
    + '</svg>',
  );
};

// --- Contrast --------------------------------------------------------------
// WCAG contrast of card text on the worst-case ground: leather overlaid by
// the scrim, ignoring the ornament (it only moves 8 % toward white and the
// scrim pulls it back down). Exported for the test.

const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (fg, bg) => {
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
};

// Average scrim coverage across the stacked rects (the text sits in the
// middle, where coverage is the full sum; 0.07 * 5 ≈ 0.30 is the floor).
const scrimBg = (base, seam) => mix(base, seam, 0.3);

const textContrast = (toneName) => {
  const tone = TONES[toneName];
  const bg = scrimBg(tone.base, tone.seam);
  return { title: contrast(brass.light, bg), body: contrast(cream, bg) };
};

module.exports = {
  TONES,
  ORNAMENTS,
  FRAMES,
  LOOKS,
  cardGround,
  textContrast,
};
