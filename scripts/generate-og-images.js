// Generates one Open Graph card per algorithm and locale:
// public/og/<locale>/<algorithm>.png. Runs during `yarn build`; the output
// is git-ignored, so cards always match the current locale files.
//
//   node scripts/generate-og-images.js
//
// Layout and rendering live in scripts/generate-brand-images.js.

const fs = require('fs');
const path = require('path');

const { banner } = require('./generate-brand-images');
const { encodingsList, encryptorsList } = require('../src/@encryptors/algorithms');
const { SUPPORTED_LOCALES, ogImagePath } = require('../src/@lib/sitemap-data');

const ROOT = path.join(__dirname, '..');

const main = async () => {
  const algorithms = [...encodingsList, ...encryptorsList];
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
      });
    }
  }
  console.log(`og images: ${algorithms.length * SUPPORTED_LOCALES.length} written to public/og`);
};

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
