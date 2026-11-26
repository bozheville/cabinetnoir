// IndexNow ping: tells Bing (and the other IndexNow engines) which URLs
// to (re)crawl, instead of waiting for them to work through the sitemap.
//
// Usage:
//   node scripts/indexnow-ping.js --all       every <loc> in public/sitemap.xml
//   node scripts/indexnow-ping.js <url>...    only the given URLs
//   add --dry-run to print the payload without sending it
//
// The key is not a secret: it lives in public/<key>.txt (file name =
// content, 32 hex chars) and must be deployed before pinging, since the
// engines fetch https://cabinetnoir.eu/<key>.txt to verify ownership.
// Read from that file so the key is defined in one place.
const fs = require('fs');
const path = require('path');

const HOST = 'cabinetnoir.eu';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
// Protocol limit per request.
const BATCH = 10000;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const all = args.includes('--all');
const explicit = args.filter((a) => !a.startsWith('--'));

const sitemapUrls = () => {
  const xml = fs.readFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
};

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const readKey = () => {
  const files = fs.readdirSync(PUBLIC_DIR).filter((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  if (files.length !== 1) {
    throw new Error(`expected exactly one IndexNow key file public/<key>.txt, found ${files.length}`);
  }
  const key = files[0].slice(0, -4);
  if (fs.readFileSync(path.join(PUBLIC_DIR, files[0]), 'utf8').trim() !== key) {
    throw new Error(`public/${files[0]} does not contain its own key`);
  }
  return key;
};

const main = async () => {
  const KEY = readKey();

  const urls = all ? sitemapUrls() : explicit;
  if (urls.length === 0) {
    console.error('Usage: node scripts/indexnow-ping.js --all | <url>... [--dry-run]');
    process.exit(1);
  }
  const foreign = urls.filter((u) => new URL(u).host !== HOST);
  if (foreign.length) {
    throw new Error(`URLs outside ${HOST}: ${foreign.join(', ')}`);
  }

  for (let i = 0; i < urls.length; i += BATCH) {
    const urlList = urls.slice(i, i + BATCH);
    const body = {
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList,
    };
    if (dryRun) {
      console.log(JSON.stringify({ ...body, urlList: `${urlList.length} URLs` }, null, 2));
      continue;
    }
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    // 200 = accepted, 202 = accepted, key validation pending.
    console.log(`IndexNow: ${urlList.length} URLs → ${res.status} ${res.statusText}`);
    if (res.status >= 300) {
      console.error(await res.text());
      process.exit(1);
    }
  }
};

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
