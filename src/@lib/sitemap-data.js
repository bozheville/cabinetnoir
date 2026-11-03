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
  CRYPTANALYSIS_TAB,
  hasTab,
  hasCryptanalysis,
} = require('../@learning/config');

// The canonical origin. NEXT_PUBLIC_SITE_URL lets a preview/staging deploy
// emit absolute URLs against its own domain without code changes.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cabinetnoir.eu';

// 'en' is the defaultLocale, which Next.js serves without a path prefix.
const SUPPORTED_LOCALES = ['en', 'fr', 'ua'];

const DEFAULT_LOCALE = 'en';

// BCP 47 language tags per route locale. The Ukrainian route prefix is
// /ua for historic reasons, but the language code is `uk` — `ua` is a
// country code and search engines ignore it as a language.
const LANGUAGE_TAGS = { en: 'en', fr: 'fr', ua: 'uk' };

// Open Graph wants language_TERRITORY.
const OG_LOCALES = { en: 'en_US', fr: 'fr_FR', ua: 'uk_UA' };

const languageTag = (locale) => LANGUAGE_TAGS[locale] || locale;

// Per-algorithm Open Graph card, written by scripts/generate-og-images.js.
// Site-relative, with a leading slash.
const ogImagePath = (algorithm, locale) => `/og/${locale}/${algorithm}.png`;

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
      ...(hasCryptanalysis(algorithm) ? [CRYPTANALYSIS_TAB] : []),
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

// hreflang alternates of a locale-free path: one per locale plus the
// x-default fallback (the English page).
const alternatesFor = (path) => [
  ...SUPPORTED_LOCALES.map((locale) => ({
    hrefLang: languageTag(locale),
    href: urlFor(path, locale),
  })),
  { hrefLang: 'x-default', href: urlFor(path, DEFAULT_LOCALE) },
];

// Every locale-free page path, in sitemap.xml order: static pages first,
// then every encoder segment.
const buildSitemapPaths = () => {
  const { staticPages, encoders } = buildSitemapEntries();
  return [
    ...staticPages.map((page) => page.path),
    ...encoders.flatMap((encoder) =>
      encoder.segments.map((segment) => `/encoder/${encoder.algorithm}/${segment}`),
    ),
  ];
};

// Flat list of absolute URLs for the XML sitemap: every path in every locale.
const buildSitemapUrls = () =>
  buildSitemapPaths().flatMap((path) =>
    SUPPORTED_LOCALES.map((locale) => urlFor(path, locale)),
  );

module.exports = {
  SITE_URL,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  OG_LOCALES,
  languageTag,
  localePrefix,
  ogImagePath,
  alternatesFor,
  buildSitemapEntries,
  buildSitemapPaths,
  buildSitemapUrls,
  urlFor,
};
