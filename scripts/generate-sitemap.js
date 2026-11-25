const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  SUPPORTED_LOCALES,
  alternatesFor,
  buildSitemapPaths,
  urlFor,
} = require('../src/@lib/sitemap-data');
const { getLearningConfig } = require('../src/@learning/config');

const REPO_ROOT = path.join(__dirname, '..');

// ---------------------------------------------------------------------------
// <lastmod> sources (task 09): per URL, the files and JSON keys whose
// content feeds it. The date is the last commit that touched any of the
// files, or changed any of the keys inside the shared JSON files (locale
// copy, review config) — committer date, W3C datetime — so it moves only
// when that page's content does, never on a rebuild or on an edit to
// another page's strings. When git history is unavailable (shallow CI
// clone, uncommitted new file, no git at all) <lastmod> is omitted rather
// than falling back to the build date, which crawlers would learn to ignore.
// ---------------------------------------------------------------------------

const localeFile = (locale) => `public/locales/${locale}/common.json`;
const REVIEW_STATUS_FILE = 'content/review-status.json';

// Static pages: their page component + their own locale keys.
const STATIC_PAGES = {
  '/': { file: 'pages/index.tsx', keys: ['home', 'seo.home'] },
  '/identify': { file: 'pages/identify/index.tsx', keys: ['identify', 'seo.identify'] },
  '/about': { file: 'pages/about.tsx', keys: ['about', 'seo.about'] },
  '/sitemap': { file: 'pages/sitemap.tsx', keys: ['sitemap'] },
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
  vic: ['src/@encryptors/shared/checkerboard', 'src/@encryptors/shared/transposition'],
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

// Placeholder ids a markdown file embeds ({{term:keygroup}} → keygroup).
const placeholderIds = (file, type) => {
  const full = path.join(REPO_ROOT, file);
  if (!fs.existsSync(full)) return [];
  const pattern = new RegExp(`\\{\\{${type}:([^}]+)\\}\\}`, 'g');
  return [...fs.readFileSync(full, 'utf8').matchAll(pattern)].map((m) => m[1]);
};

// What decides a URL's <lastmod>, in that locale:
// - files: any commit touching them counts (page code, markdown, engines);
// - keys: JSON key paths inside the shared JSON files (locale copy,
//   review config). Only commits that changed one of these keys count, so
//   a VIC copy edit in common.json does not date every page. Shared UI
//   strings (footer, header, seo templates, tab labels) are left out on
//   purpose: a wording tweak there is not a content change of every page.
// A key path is an array of segments; a RegExp segment matches any key.
const sourcesFor = (pagePath, locale) => {
  const locales = localeFile(locale);

  if (STATIC_PAGES[pagePath]) {
    const { file, keys } = STATIC_PAGES[pagePath];
    return { files: [file], keys: { [locales]: keys.map((k) => k.split('.')) } };
  }

  const categoryMatch = pagePath.match(/^\/category(?:\/([a-z0-9-]+(?:\/[a-z0-9-]+)*))?$/);
  if (categoryMatch) {
    const id = categoryMatch[1] ? categoryMatch[1].split('/').pop() : 'hub';
    const folder = id === 'hub' ? '_hub' : id;
    return {
      files: ['pages/category/[[...path]].tsx', 'src/@learning/categories.js',
        `content/categories/${folder}/${locale}/intro.md`],
      keys: { [locales]: [['categories', id]] },
    };
  }

  const match = pagePath.match(/^\/encoder\/([a-zA-Z0-9]+)\/([a-z]+)$/);
  const algorithm = match[1];
  const segment = match[2];
  const files = [];
  const localeKeys = [
    ['processing', algorithm],
    ['learning', algorithm],
    ['learning', 'tooltips', algorithm],
  ];
  const keys = { [locales]: localeKeys };

  // Learning tabs: the tab's markdown, this locale only, plus the glossary
  // terms, timelines and challenge links it embeds.
  for (const topic of SEGMENT_TOPICS[segment]) {
    const file = `content/${algorithm}/${locale}/${topic}.md`;
    files.push(file);
    for (const id of placeholderIds(file, 'term')) localeKeys.push(['glossary', id]);
    for (const id of placeholderIds(file, 'timeline')) localeKeys.push(['learning', 'timeline', id]);
    for (const id of placeholderIds(file, 'challenge')) localeKeys.push(['learning', 'challenges', id]);
  }

  // The learn tab's glossary section lists the cipher's configured terms.
  if (segment === 'learn') {
    for (const id of getLearningConfig(algorithm)?.glossary || []) {
      localeKeys.push(['glossary', id]);
    }
  }

  // History layout also depends on the cipher's review config (tasks 06 + 12).
  if (segment === 'history') {
    localeKeys.push(['learning', 'timeline', algorithm]);
    keys[REVIEW_STATUS_FILE] = [[algorithm]];
  }

  // Tool pages and the cryptanalysis wizard run the cipher's own code.
  if (segment === 'direct' || segment === 'reverse' || segment === 'cryptanalysis') {
    files.push(cipherFolder(algorithm), ...(SHARED_ENGINES[algorithm] || []));
  }

  // Practice challenges are component-driven: their data lives here.
  if (segment === 'practice') {
    files.push('src/@learning/challenges.ts');
    localeKeys.push(['learning', 'challenges', new RegExp(`^${algorithm}-`)]);
  }

  return { files, keys };
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
const git = (args) => {
  try {
    return execFileSync('git', args, {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      maxBuffer: 256 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return null;
  }
};

const lastCommitDate = (paths) => {
  if (paths.length === 0) return null;
  return (git(['log', '-1', '--format=%cI', '--', ...paths]) || '').trim() || null;
};

// Leaf key paths that differ between two parsed JSON values. A subtree
// added or removed whole is reported at its root.
const changedKeyPaths = (before, after, prefix = [], out = []) => {
  if (JSON.stringify(before) === JSON.stringify(after)) return out;
  const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
  if (isObject(before) && isObject(after)) {
    for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
      changedKeyPaths(before[key], after[key], [...prefix, key], out);
    }
  } else {
    out.push(prefix);
  }
  return out;
};

const readJsonAt = (rev, file) => {
  const text = git(['show', `${rev}:${file}`]);
  if (text === null) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    // Unparseable revision: report the whole file as changed.
    return Symbol('invalid');
  }
};

// Per keyed JSON file: every non-merge commit touching it, with the key
// paths it changed (first parent → commit).
const keyHistoryCache = new Map();
const keyHistory = (file) => {
  if (!keyHistoryCache.has(file)) {
    const log = git(['log', '--no-merges', '--format=%H %cI', '--', file]) || '';
    const commits = log.trim().split('\n').filter(Boolean).map((line) => {
      const [sha, date] = line.split(' ');
      const before = readJsonAt(`${sha}^`, file);
      const after = readJsonAt(sha, file);
      const changed = typeof before === 'symbol' || typeof after === 'symbol'
        ? [[]]
        : changedKeyPaths(before, after);
      return { date, changed };
    });
    keyHistoryCache.set(file, commits);
  }
  return keyHistoryCache.get(file);
};

const segmentMatches = (pattern, key) =>
  pattern instanceof RegExp ? pattern.test(key) : pattern === key;

// A watched key and a changed path overlap when one is a prefix of the other.
const overlaps = (watched, changed) => {
  const length = Math.min(watched.length, changed.length);
  for (let i = 0; i < length; i++) {
    if (!segmentMatches(watched[i], changed[i])) return false;
  }
  return true;
};

const lastKeyChangeDate = (file, watchedKeys) => {
  for (const { date, changed } of keyHistory(file)) {
    if (changed.some((c) => watchedKeys.some((w) => overlaps(w, c)))) return date;
  }
  return null;
};

const newest = (dates) => dates
  .filter(Boolean)
  .reduce((best, d) => (best === null || Date.parse(d) > Date.parse(best) ? d : best), null);

const lastmodFor = ({ files, keys }) => newest([
  lastCommitDate(files),
  ...Object.entries(keys).map(([file, watched]) => lastKeyChangeDate(file, watched)),
]);

const sourcesKey = ({ files, keys }) => JSON.stringify({
  files,
  keys: Object.fromEntries(Object.entries(keys).map(([file, watched]) =>
    [file, watched.map((p) => p.map(String))])),
});

// Every URL carries its hreflang alternates so search engines treat the
// en / fr / ua pages as translations, not duplicates.
const linksToXML = (paths, useGit) => {
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
        const cacheKey = sourcesKey(sources);
        if (!lastmodCache.has(cacheKey)) {
          lastmodCache.set(cacheKey, lastmodFor(sources));
        }
        const lastmod = lastmodCache.get(cacheKey);
        if (lastmod) {
          xml += `\n    <lastmod>${lastmod}</lastmod>`;
        }
      }
      xml += `${alternates}\n  </url>`;
    }
  }
  return xml + '\n</urlset>\n';
};

// Writing rules:
// - Git available (developer machine): always regenerate and overwrite.
// - Git unavailable but a sitemap is committed (the Cloudflare deploy
//   build, which clones without usable history): KEEP the committed
//   file. Regenerating would strip every <lastmod> and ship a worse
//   sitemap than the one in the repo.
// - No git and no committed sitemap (fresh checkout edge case): write
//   one without <lastmod>.
// --check never writes: it exits 1 when the committed sitemap is stale
// (pre-push guard, same contract as generate-content-dates.js).
const dest = path.join(__dirname, '../public/sitemap.xml');
const useGit = gitHistoryUsable();
const xml = linksToXML(buildSitemapPaths(), useGit);

if (process.argv.includes('--check')) {
  const committed = fs.existsSync(dest) ? fs.readFileSync(dest, 'utf8') : null;
  if (committed !== xml) {
    console.error('[sitemap] public/sitemap.xml is stale: run scripts/generate-sitemap.js and commit it.');
    process.exit(1);
  }
  console.log('[sitemap] fresh');
} else if (!useGit && fs.existsSync(dest)) {
  console.log('[sitemap] git history unavailable: keeping committed sitemap.xml');
} else {
  fs.writeFileSync(dest, xml);
}