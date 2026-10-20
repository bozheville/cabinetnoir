#!/usr/bin/env python3
"""Locale key helper for the cipher roadmap tasks.

Usage: python3 scripts/locale_keys.py <spec.json>

spec.json entries map dotted key paths to texts:
  "processing>keyword>title": "Keyword substitution"
Optional anchors place a new key after an existing sibling:
  "processing>keyword@caesar>title": ...
Optional per-locale overrides:
  "__fr>processing>keyword>title": "Chiffre par mot-clé"
  "__ua>...": ...
An "__fr>"/"__ua>" entry only applies to that locale; plain entries apply
to all locales (fr/ua fall back to the en text until translated).
Passing a dict as the value merges/overwrites those subkeys only.
"""
import json
import sys
from collections import OrderedDict

LOCALES = ['en', 'fr', 'ua']
BASE = 'public/locales/{}/common.json'


def load(locale):
    with open(BASE.format(locale), encoding='utf-8') as handle:
        return json.load(handle, object_pairs_hook=OrderedDict)


def store(locale, data):
    with open(BASE.format(locale), 'w', encoding='utf-8') as handle:
        json.dump(data, handle, ensure_ascii=False, indent=2)
        handle.write('\n')


def set_key(root, parts, value):
    node = root
    for index, part in enumerate(parts):
        key, _, anchor = part.partition('@')
        last = index == len(parts) - 1
        if last:
            if key in node and isinstance(node[key], dict) and isinstance(value, dict):
                merged = node[key].copy()
                for sub_key, sub_value in value.items():
                    merged.pop(sub_key, None)
                    merged[sub_key] = sub_value
                value = merged
            if key in node or not anchor:
                node[key] = value
                continue
            # insert after the anchor sibling, keeping existing order
            rebuilt = OrderedDict()
            for existing_key, existing_value in node.items():
                rebuilt[existing_key] = existing_value
                if existing_key == anchor:
                    rebuilt[key] = value
            if key not in rebuilt:
                rebuilt[key] = value
            node.clear()
            node.update(rebuilt)
        else:
            if key not in node or not isinstance(node[key], dict):
                node[key] = OrderedDict()
            node = node[key]


def main():
    spec = json.load(open(sys.argv[1], encoding='utf-8'))
    for locale in LOCALES:
        data = load(locale)
        for dotted_path, value in spec.items():
            if dotted_path.startswith('__'):
                lang, _, rest = dotted_path[2:].partition('>')
                if lang != locale:
                    continue
                dotted_path = rest
            else:
                if value == '__EN_ONLY__':
                    continue
            set_key(data, dotted_path.split('>'), value)
        store(locale, data)
    print('ok')


if __name__ == '__main__':
    main()
