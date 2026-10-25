// Single source of truth for every crawlable URL on the site. Consumed by
// scripts/generate-sitemap.js (the XML sitemap, written at build time) and
// by pages/sitemap.tsx (the human-readable HTML sitemap, rendered at build
// time), so the two can never drift apart.
//
// Plain CommonJS so plain Node scripts can require it, exactly like
// src/@encryptors/algorithms.js and src/@learning/config.js.

const { encodingsList, encryptorsList } = require('../@encryptors/algorithms');
const {
  LEARNING_TABS,
  CRYPTOANALYSIS_TAB,
  hasTab,
  hasCryptoanalysis,
} = require('../@learning/config');

// The canonical origin. NEXT_PUBLIC_SITE_URL lets a preview/staging deploy
// emit absolute URLs against its own domain without code changes.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cabinetnoir.eu';

// 'en' is the defaultLocale, which Next.js serves without a path prefix.
const SUPPORTED_LOCALES = ['en', 'fr', 'ua'];

const localePrefix = (locale) => (locale === 'en' ? '' : `/${locale}`);

const ACTIONS = ['direct', 'reverse'];

// Static (non-encoder) pages. The HTML sitemap lists itself too — it is a
// real, crawlable page in every locale.
const STATIC_PAGES = [
  { path: '/' },
  { path: '/identify' },
  { path: '/sitemap' },
];

// Every encoder page with the URL segments it actually serves: the tool
// modes, plus the learning tabs (and the cracker wizard) only where the
// per-cipher learning config says they exist.
const buildSitemapEntries = () => ({
  staticPages: STATIC_PAGES,
  encoders: [...encodingsList, ...encryptorsList].map((algorithm) => ({
    algorithm,
    segments: [
      ...ACTIONS,
      ...(hasCryptoanalysis(algorithm) ? [CRYPTOANALYSIS_TAB] : []),
      ...LEARNING_TABS.filter((tab) => hasTab(algorithm, tab)),
    ],
  })),
});

// Absolute URL for a path in a locale. The bare home page collapses to the
// origin itself (no trailing slash), matching the existing sitemap.xml.
const urlFor = (path, locale) => {
  const prefix = localePrefix(locale);
  const fullPath = path === '/' ? prefix : `${prefix}${path}`;
  return `${SITE_URL}${fullPath}`;
};

// Flat list of absolute URLs for the XML sitemap, in sitemap.xml order:
// static pages first, then every encoder segment in every locale.
const buildSitemapUrls = () => {
  const { staticPages, encoders } = buildSitemapEntries();
  const urls = [];
  for (const page of staticPages) {
    for (const locale of SUPPORTED_LOCALES) {
      urls.push(urlFor(page.path, locale));
    }
  }
  for (const encoder of encoders) {
    for (const segment of encoder.segments) {
      for (const locale of SUPPORTED_LOCALES) {
        urls.push(urlFor(`/encoder/${encoder.algorithm}/${segment}`, locale));
      }
    }
  }
  return urls;
};

module.exports = {
  SITE_URL,
  SUPPORTED_LOCALES,
  localePrefix,
  buildSitemapEntries,
  buildSitemapUrls,
  urlFor,
};
