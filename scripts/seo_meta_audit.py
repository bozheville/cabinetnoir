#!/usr/bin/env python3
"""SEO meta audit: per locale, every page title and description must be
unique; flags titles over 60 and descriptions outside 70–170 characters.

Mirrors the title/description logic in pages/encoder/[algorithm]/[action].tsx,
pages/index.tsx, pages/identify/index.tsx and pages/sitemap.tsx.

Usage: python3 scripts/seo_meta_audit.py [--list]
Exits 1 on duplicates, 0 otherwise (length issues are warnings).
"""
import json
import subprocess
import sys
from collections import defaultdict

LOCALES = ['en', 'fr', 'ua']
TITLE_MAX = 60
DESC_RANGE = (70, 170)

data = json.loads(subprocess.check_output(['node', '-e', '''
const a = require('./src/@encryptors/algorithms');
const c = require('./src/@learning/config');
const out = [];
for (const alg of [...a.encodingsList, ...a.encryptorsList]) {
  const actions = ['direct', 'reverse'];
  if (c.hasCryptanalysis(alg)) actions.push(c.CRYPTANALYSIS_TAB);
  for (const tab of c.LEARNING_TABS) if (c.hasTab(alg, tab)) actions.push(tab);
  out.push({ alg, encoding: a.encodingsList.includes(alg), actions });
}
console.log(JSON.stringify(out));
''']))


def get(d, key):
    for part in key.split('.'):
        d = d[part]
    return d


def fill(s, **kw):
    for k, v in kw.items():
        s = s.replace('{{%s}}' % k, v)
    return s


def pages(locale):
    d = json.load(open(f'public/locales/{locale}/common.json', encoding='utf-8'))
    name = d['name']
    yield '/', get(d, 'seo.home.title'), get(d, 'seo.home.description')
    yield '/identify', f"{get(d, 'seo.identify.title')} • {name}", get(d, 'seo.identify.description')
    yield '/sitemap', f"{get(d, 'sitemap.title')} • {name}", get(d, 'sitemap.subtitle')
    for entry in data:
        alg = entry['alg']
        kind = 'encoding' if entry['encoding'] else 'encryptor'
        cipher = get(d, f'processing.{alg}.title')
        one_liner = get(d, f'learning.{alg}.description')
        for action in entry['actions']:
            if action in ('direct', 'reverse'):
                title = fill(get(d, f'seo.toolTitle.{kind}.{action}'), cipher=cipher)
                desc = f"{fill(get(d, f'seo.toolDescription.{kind}.{action}'), cipher=cipher)} {one_liner}"
            else:
                title = fill(get(d, f'seo.tabTitle.{action}'), cipher=cipher)
                if action == 'history':
                    desc = fill(get(d, 'seo.historyDescription'), cipher=cipher,
                                era=get(d, f'learning.{alg}.era'),
                                origin=get(d, f'learning.{alg}.origin'))
                else:
                    desc = fill(get(d, f'seo.tabDescription.{action}'), cipher=cipher, oneLiner=one_liner)
            yield f'/encoder/{alg}/{action}', f'{title} • {name}', desc


failed = False
for locale in LOCALES:
    rows = list(pages(locale))
    for field, idx in (('title', 1), ('description', 2)):
        seen = defaultdict(list)
        for row in rows:
            seen[row[idx]].append(row[0])
        for value, paths in seen.items():
            if len(paths) > 1:
                failed = True
                print(f'[{locale}] duplicate {field}: {value!r} on {paths}')
    for path, title, desc in rows:
        if len(title) > TITLE_MAX:
            print(f'[{locale}] warn title {len(title)} > {TITLE_MAX}: {path} {title!r}')
        if not DESC_RANGE[0] <= len(desc) <= DESC_RANGE[1]:
            print(f'[{locale}] warn description {len(desc)} outside {DESC_RANGE}: {path}')
        if '--list' in sys.argv:
            print(f'[{locale}] {path}\n    {title}\n    {desc}')

print('duplicates found' if failed else 'no duplicates')
sys.exit(1 if failed else 0)
