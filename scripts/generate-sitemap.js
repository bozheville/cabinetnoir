const fs = require('fs');
const path = require('path');
const { encodingsList, encryptorsList } = require('../src/@encryptors/algorithms');
const {
  LEARNING_TABS,
  CRYPTOANALYSIS_TAB,
  hasTab,
  hasCryptoanalysis,
} = require('../src/@learning/config');

const baseURL = 'http://cabinetnoir.eu';
const algorithms = [...encodingsList, ...encryptorsList];
const actions = ['direct', 'reverse'];
// 'en' is the defaultLocale, which Next.js serves without a path prefix.
const localePrefixes = ['', '/fr', '/ua'];

const buildLinks = () => {
  const links = [baseURL];
  for (const algorithm of algorithms) {
    const segments = [
      ...actions,
      // Cryptoanalysis is a first-class tab for ciphers with a cracker.
      ...(hasCryptoanalysis(algorithm) ? [CRYPTOANALYSIS_TAB] : []),
      ...LEARNING_TABS.filter((tab) => hasTab(algorithm, tab)),
    ];
    for (const action of segments) {
      for (const localePrefix of localePrefixes) {
        links.push(`${baseURL}${localePrefix}/encoder/${algorithm}/${action}`);
      }
    }
  }
  return links;
};

const linksToXML = (links) => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  for (const link of links) {
    xml += `\n  <url>\n    <loc>${link}</loc>\n    <lastmod>${formattedDate}</lastmod>\n  </url>`;
  }
  return xml + '\n</urlset>\n';
};

fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), linksToXML(buildLinks()));
