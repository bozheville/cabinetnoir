#!/usr/bin/env python3
"""Key-parity check across public/locales/{en,fr,ua}/common.json."""
import json
import sys
from collections import OrderedDict

def leaves(d, prefix=''):
    if isinstance(d, dict):
        for key, value in d.items():
            yield from leaves(value, f'{prefix}.{key}' if prefix else key)
    else:
        yield prefix

trees = {}
for locale in ['en', 'fr', 'ua']:
    with open(f'public/locales/{locale}/common.json', encoding='utf-8') as handle:
        trees[locale] = set(leaves(json.load(handle)))

reference = trees['en']
ok = True
for locale, keys in trees.items():
    if locale == 'en':
        continue
    missing = sorted(reference - keys)
    extra = sorted(keys - reference)
    if missing or extra:
        ok = False
        print(f'{locale}: missing {len(missing)}, extra {len(extra)}')
        for key in missing[:20]:
            print('  missing:', key)
        for key in extra[:20]:
            print('  extra:', key)
if ok:
    print('parity ok')
    sys.exit(0)
sys.exit(1)
