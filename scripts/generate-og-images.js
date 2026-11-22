// Generates one Open Graph card per algorithm and locale:
// public/og/<locale>/<algorithm>.png. Runs during `yarn build`; the output
// is git-ignored, so cards always match the current locale files.
//
//   node scripts/generate-og-images.js
//
// Layout and rendering live in scripts/generate-brand-images.js.

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const { banner } = require('./generate-brand-images');
const { encodingsList, encryptorsList } = require('../src/@encryptors/algorithms');
const { getAllCategoryPaths } = require('../src/@learning/categories');
const { SUPPORTED_LOCALES, ogImagePath, ogCategoryImagePath } = require('../src/@lib/sitemap-data');
const { LOOKS } = require('../src/@brand/og-looks');

const ROOT = path.join(__dirname, '..');

const lookFor = (id, key) => {
  const look = LOOKS[id];
  if (!look) throw new Error(`og: no look for "${key}" (${id}) in src/@brand/og-looks.js`);
  return look;
};

const main = async () => {
  const algorithms = [...encodingsList, ...encryptorsList];
  const categories = [null, ...getAllCategoryPaths().map((segments) => segments[segments.length - 1])];
  fs.rmSync(path.join(ROOT, 'public', 'og'), { recursive: true, force: true });

  for (const locale of SUPPORTED_LOCALES) {
    const common = JSON.parse(fs.readFileSync(path.join(ROOT, 'public', 'locales', locale, 'common.json'), 'utf8'));
    for (const algorithm of algorithms) {
      const title = common.processing?.[algorithm]?.title;
      const body = common.learning?.[algorithm]?.description;
      if (!title || !body) {
        throw new Error(`Missing processing.${algorithm}.title or learning.${algorithm}.description in ${locale}`);
      }
      await banner({
        title,
        body,
        footer: common.name,
        file: path.join(ROOT, 'public', ogImagePath(algorithm, locale)),
        look: lookFor(algorithm, algorithm),
      });
    }
    for (const id of categories) {
      const key = id === null ? 'hub' : id;
      const node = common.categories?.[key];
      const title = node?.name;
      const body = node?.description;
      if (!title || !body) {
        throw new Error(`Missing ${key}.name or .description in ${locale}`);
      }
      await banner({
        title,
        body,
        footer: common.name,
        file: path.join(ROOT, 'public', ogCategoryImagePath(id, locale)),
        look: lookFor(key, key),
      });
    }
  }
  console.log(`og images: ${(algorithms.length + categories.length) * SUPPORTED_LOCALES.length} written to public/og`);

  if (process.argv.includes('--sheet')) {
    await sheet(algorithms, categories);
  }
};

// One image with every English card side by side, for eyeballing the whole
// set at once: tmp/og-sheet.png.
const sheet = async (algorithms, categories) => {
  const files = [
    ...categories.map((id) => path.join(ROOT, 'public', ogCategoryImagePath(id, 'en'))),
    ...algorithms.map((a) => path.join(ROOT, 'public', ogImagePath(a, 'en'))),
  ];
  const cols = 4;
  const tw = 300;
  const th = Math.round((tw * 630) / 1200);
  const thumbs = [];
  for (let i = 0; i < files.length; i++) {
    const buf = await sharp(files[i]).resize(tw, th).png().toBuffer();
    thumbs.push({ input: buf, left: (i % cols) * (tw + 12), top: Math.floor(i / cols) * (th + 12) });
  }
  const rows = Math.ceil(files.length / cols);
  fs.mkdirSync(path.join(ROOT, 'tmp'), { recursive: true });
  await sharp({
    create: { width: cols * (tw + 12) - 12, height: rows * (th + 12) - 12, channels: 4, background: '#1a100b' },
  }).composite(thumbs).png().toFile(path.join(ROOT, 'tmp', 'og-sheet.png'));
  console.log('og sheet: tmp/og-sheet.png');
};

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
