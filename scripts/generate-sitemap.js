const fs = require('fs');
const path = require('path');
const {
  SUPPORTED_LOCALES,
  alternatesFor,
  buildSitemapPaths,
  urlFor,
} = require('../src/@lib/sitemap-data');

// Every URL carries its hreflang alternates so search engines treat the
// en / fr / ua pages as translations, not duplicates. No <lastmod>: the
// build date on every URL tells crawlers nothing, and they learn to
// ignore a sitemap whose dates always change.
const linksToXML = (paths) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
    + 'xmlns:xhtml="http://www.w3.org/1999/xhtml">';
  for (const pagePath of paths) {
    const alternates = alternatesFor(pagePath)
      .map(({ hrefLang, href }) =>
        `\n    <xhtml:link rel="alternate" hreflang="${hrefLang}" href="${href}"/>`)
      .join('');
    for (const locale of SUPPORTED_LOCALES) {
      xml += `\n  <url>\n    <loc>${urlFor(pagePath, locale)}</loc>${alternates}\n  </url>`;
    }
  }
  return xml + '\n</urlset>\n';
};

fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), linksToXML(buildSitemapPaths()));
