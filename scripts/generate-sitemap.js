const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  SUPPORTED_LOCALES,
  alternatesFor,
  buildSitemapPaths,
  urlFor,
} = require('../src/@lib/sitemap-data');

const REPO_ROOT = path.join(__dirname, '..');

// ---------------------------------------------------------------------------
// <lastmod> sources (task 09): per URL, the files whose content feeds it.
// The date is the last commit that touched any of them (`git log -1
// --format=%cI`, W3C datetime), so it moves only when the content does —
// never on a rebuild. When git history is unavailable (shallow CI clone,
// uncommitted new file, no git at all) <lastmod> is omitted rather than
// falling back to the build date, which crawlers would learn to ignore.
// ---------------------------------------------------------------------------

const localeFile = (locale) => `public/locales/${locale}/common.json`;

// Static pages: their page component + their locale copy.
const STATIC_PAGE_FILES = {
  '/': 'pages/index.tsx',
  '/identify': 'pages/identify/index.tsx',
  '/about': 'pages/about.tsx',
  '/sitemap': 'pages/sitemap.tsx',
};

// Algorithm id → encryptor folder (engine + pane + cracker + analysis).
const cipherFolder = (algorithm) => {
  if (algorithm === 'base64') return 'src/@encryptors/Base64';
  if (algorithm === 'railFence') return 'src/@encryptors/RailFence';
  return `src/@encryptors/${algorithm[0].toUpperCase()}${algorithm.slice(1)}`;
};

// Shared engines a cipher is built on: a change there is a change to the
// cipher's tool (and cryptanalysis) pages too.
const SHARED_ENGINES = {
  atbash: ['src/@encryptors/Monoalphabetic'],
  affine: ['src/@encryptors/Monoalphabetic'],
  keyword: ['src/@encryptors/Monoalphabetic'],
  alberti: ['src/@encryptors/Monoalphabetic'],
  columnar: ['src/@encryptors/shared/transposition'],
  railFence: ['src/@encryptors/shared/transposition'],
  polybius: ['src/@encryptors/shared/polybius'],
  nihilist: ['src/@encryptors/shared/polybius'],
  adfgvx: ['src/@encryptors/shared/polybius'],
};

// Markdown topics per URL segment. Mirrors MARKDOWN_TOPICS and TOOL_TOPICS
// in src/@learning/content.ts (TS — not requirable from this plain Node
// script, hence the copy; keep the two in sync).
const SEGMENT_TOPICS = {
  direct: ['tool'],
  reverse: ['tool'],
  learn: ['how-it-works', 'guides', 'breaking-it'],
  history: ['history'],
  practice: [],
  cryptanalysis: [],
};

// Files whose content decides a URL's <lastmod>, in that locale.
const sourcesFor = (pagePath, locale) => {
  if (STATIC_PAGE_FILES[pagePath]) {
    return [STATIC_PAGE_FILES[pagePath], localeFile(locale)];
  }

  const match = pagePath.match(/^\/encoder\/([a-zA-Z0-9]+)\/([a-z]+)$/);
  const algorithm = match[1];
  const segment = match[2];
  const sources = [localeFile(locale)];

  // Learning tabs: the tab's markdown, this locale only.
  for (const topic of SEGMENT_TOPICS[segment]) {
    sources.push(`content/${algorithm}/${locale}/${topic}.md`);
  }

  // Tool pages and the cryptanalysis wizard run the cipher's own code.
  if (segment === 'direct' || segment === 'reverse' || segment === 'cryptanalysis') {
    sources.push(cipherFolder(algorithm), ...(SHARED_ENGINES[algorithm] || []));
  }

  // Practice challenges are component-driven: their data lives here.
  if (segment === 'practice') {
    sources.push('src/@learning/challenges.ts');
  }

  return sources;
};

// Full history present? A shallow clone may not reach the last commit
// that touched a file, so every <lastmod> would be wrong — omit them all.
const gitHistoryUsable = () => {
  try {
    return execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() === 'false';
  } catch {
    return false;
  }
};

// Last committer date (W3C datetime) of the newest commit touching any of
// the paths; null when no history covers them (untracked file, no git).
const lastCommitDate = (paths) => {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cI', '--', ...paths], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() || null;
  } catch {
    return null;
  }
};

// Every URL carries its hreflang alternates so search engines treat the
// en / fr / ua pages as translations, not duplicates.
const linksToXML = (paths) => {
  const useGit = gitHistoryUsable();
  const lastmodCache = new Map();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
    + 'xmlns:xhtml="http://www.w3.org/1999/xhtml">';
  for (const pagePath of paths) {
    const alternates = alternatesFor(pagePath)
      .map(({ hrefLang, href }) =>
        `\n    <xhtml:link rel="alternate" hreflang="${hrefLang}" href="${href}"/>`)
      .join('');
    for (const locale of SUPPORTED_LOCALES) {
      xml += `\n  <url>\n    <loc>${urlFor(pagePath, locale)}</loc>`;
      if (useGit) {
        const sources = sourcesFor(pagePath, locale);
        if (!lastmodCache.has(sources.join('|'))) {
          lastmodCache.set(sources.join('|'), lastCommitDate(sources));
        }
        const lastmod = lastmodCache.get(sources.join('|'));
        if (lastmod) {
          xml += `\n    <lastmod>${lastmod}</lastmod>`;
        }
      }
      xml += `${alternates}\n  </url>`;
    }
  }
  return xml + '\n</urlset>\n';
};

fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), linksToXML(buildSitemapPaths()));
