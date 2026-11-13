// Regenerates content/review-dates.json: first and last commit date
// (committer date, %cI) of every content/<cipher>/<locale>/history.md.
//
// Why a committed file: the deploy build (Cloudflare) clones the repo
// without usable git history, so anything derived from git at build time
// comes up empty in production. The dates are computed here, on a
// machine with full history, committed, and shipped like any other
// asset. src/@learning/review.ts reads this file first and only falls
// back to live git (local dev convenience).
//
// Run with --check to only verify freshness (used by the pre-push
// chain): exits 1 when the committed file is stale or git history is
// unavailable, after writing the fresh version so it can be committed.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'content/review-dates.json');
const CHECK = process.argv.includes('--check');

const git = (args) =>
  execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();

if (git(['rev-parse', '--is-shallow-repository']) === 'true') {
  console.error('[content-dates] shallow git history: cannot compute dates');
  process.exit(1);
}

// Every history.md in content/, in a stable order.
const files = [];
for (const cipher of fs.readdirSync(path.join(ROOT, 'content')).sort()) {
  const dir = path.join(ROOT, 'content', cipher);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const locale of fs.readdirSync(dir).sort()) {
    if (fs.existsSync(path.join(dir, locale, 'history.md'))) {
      files.push(`content/${cipher}/${locale}/history.md`);
    }
  }
}

const dates = {};
for (const file of files) {
  const first = git(['log', '--reverse', '--format=%cI', '--', file]).split('\n')[0].trim();
  const last = git(['log', '-1', '--format=%cI', '--', file]);
  if (!first || !last) {
    console.error(`[content-dates] no git history for ${file}: commit it first`);
    process.exit(1);
  }
  dates[file] = { first, last };
}

const json = `${JSON.stringify(dates, null, 2)}\n`;
const existing = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : null;
fs.writeFileSync(OUT, json);

if (existing !== json) {
  console.error('[content-dates] content/review-dates.json was stale: regenerated.');
  if (CHECK) {
    console.error('[content-dates] commit content/review-dates.json and push again.');
    process.exit(1);
  }
} else {
  console.log(`[content-dates] fresh (${Object.keys(dates).length} files)`);
}
