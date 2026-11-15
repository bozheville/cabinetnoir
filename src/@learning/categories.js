// Cipher category tree: single source of truth for the browsing tree, shared
// by TypeScript pages and plain Node scripts (sitemap, OG images, audits).
//
// Plain CommonJS (not TypeScript) so plain Node scripts can `require` it, / exactly like `src/@learning/config.js`. Types live in `categories.d.ts`.
//
// Spec: specs/cipher-categories/cipher-categories.md.
// Leather values confirmed in task 01's outcome.
const CIPHER_LADDER = require('./config').CIPHER_LADDER;

const CATEGORIES = {
  substitution:          { parent: null,             leather: 'chestnut' },
  monoalphabetic:        { parent: 'substitution',   leather: 'chestnut' },
  shift:                 { parent: 'monoalphabetic', leather: 'chestnut' },
  'affine-family':       { parent: 'monoalphabetic', leather: 'chestnut' },
  polyalphabetic:        { parent: 'substitution',   leather: 'green' },
  'tabula-recta':        { parent: 'polyalphabetic', leather: 'green' },
  'disks-and-rotors':    { parent: 'polyalphabetic', leather: 'chestnut', thread: 'copper' },
  polygraphic:           { parent: 'substitution',   leather: 'oxblood' },
  'polybius-square':     { parent: 'substitution',   leather: 'saddle' },
  transposition:         { parent: null,             leather: 'navy' },
  product:               { parent: null,             leather: 'oxblood' },
  'codes-and-encodings': { parent: null,             leather: 'tan' },
};

// Live cipher → category ids; [0] is the primary tree.
const CIPHER_CATEGORIES = {
  morse: ['codes-and-encodings'],
  rot13: ['shift'],
  atbash: ['affine-family'],
  pigpen: ['monoalphabetic'],
  caesar: ['shift'],
  polybius: ['polybius-square'],
  railFence: ['transposition'],
  affine: ['affine-family'],
  keyword: ['monoalphabetic'],
  columnar: ['transposition'],
  playfair: ['polygraphic'],
  beaufort: ['tabula-recta'],
  vigenere: ['tabula-recta'],
  autokey: ['tabula-recta'],
  nihilist: ['product', 'polybius-square'],
  adfgvx: ['product', 'polybius-square', 'transposition'],
  alberti: ['disks-and-rotors'],
  enigma: ['disks-and-rotors'],
  base64: ['codes-and-encodings'],
  saknussemm: ['transposition'],
};

// Planned ciphers: rendered as unclickable "coming soon" cards only.
// Every id also lives on the roadmap; nothing here gets a page or sitemap entry.
const COMING_SOON = {
  hill: ['polygraphic'],
  homophonic: ['substitution'],
  bifid: ['product', 'polybius-square'],
  straddlingCheckerboard: ['product'],
  baconian: ['codes-and-encodings'],
  tapCode: ['codes-and-encodings', 'polybius-square'],
};

const MAX_DEPTH = 3;
const MIN_INDEXABLE_CIPHERS = 2;

// ---------------------------------------------------------------------------
// Pure helpers (no `t`, no theme): safe for Node scripts and React alike.
// ---------------------------------------------------------------------------

const getCategory = (id) => CATEGORIES[id] || null;

const getChildren = (id) =>
  Object.keys(CATEGORIES).filter((child) => CATEGORIES[child].parent === id);

const getRootCategories = () => getChildren(null);

const getAncestry = (id) => {
  const chain = [];
  for (let cursor = id; cursor; cursor = CATEGORIES[cursor].parent) {
    chain.unshift(cursor);
  }
  return chain;
};

const categoryPath = (id) => '/' + ['category', ...getAncestry(id)].join('/');

// Inverse of categoryPath: validates that segments form a real parent chain.
// `null` means the path does not exist (404), so skipped levels, wrong order
// and unknown ids are all rejected.
const categoryFromSegments = (segments) => {
  if (!Array.isArray(segments) || segments.length === 0) return null;
  let cursor = null;
  for (const segment of segments) {
    const cat = getCategory(segment);
    if (!cat || (cat.parent !== null && cat.parent !== cursor)) return null;
    cursor = segment;
  }
  return cursor || null;
};

const getCipherCategories = (cipher) => CIPHER_CATEGORIES[cipher] || null;

const getPrimaryCategory = (cipher) => {
  const cats = getCipherCategories(cipher);
  return cats ? cats[0] : null;
};

// Direct member, or through a descendant category.
const isMemberOf = (cipher, id) => {
  const cats = getCipherCategories(cipher);
  return !!cats && cats.some((cat) => getAncestry(cat).includes(id));
};

// Members of a category, deduplicated and ordered: ladder first, then
// off-ladder, then coming soon. `includeDescendants` is what ancestor pages use.
const getMembers = (id, { includeDescendants = false } = {}) => {
  const liveSet = new Set();
  for (const cipher of [...CIPHER_LADDER, 'base64', 'saknussemm']) {
    if (liveSet.has(cipher)) continue;
    if (isMemberOf(cipher, id) && (includeDescendants || getCipherCategories(cipher).includes(id))) {
      liveSet.add(cipher);
    }
  }
  const comingSoon = Object.keys(COMING_SOON).filter((cipher) =>
    COMING_SOON[cipher].some((cat) =>
      getAncestry(cat).includes(id),
    ),
  );
  return {
    live: [...liveSet],
    comingSoon,
  };
};

const liveCount = (id) => getMembers(id, { includeDescendants: true }).live.length;

const isIndexable = (id) => liveCount(id) >= MIN_INDEXABLE_CIPHERS;

const getAllCategoryPaths = () =>
  Object.keys(CATEGORIES).map((id) => getAncestry(id));

module.exports = {
  CATEGORIES,
  CIPHER_CATEGORIES,
  COMING_SOON,
  MAX_DEPTH,
  MIN_INDEXABLE_CIPHERS,
  // Re-exported for convenience, so tests and pages import one module.
  CIPHER_LADDER: require('./config').CIPHER_LADDER,
  getCategory,
  getChildren,
  getRootCategories,
  getAncestry,
  categoryPath,
  categoryFromSegments,
  getCipherCategories,
  getPrimaryCategory,
  isMemberOf,
  getMembers,
  liveCount,
  isIndexable,
  getAllCategoryPaths,
};
