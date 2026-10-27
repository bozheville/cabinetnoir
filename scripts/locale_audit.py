#!/usr/bin/env python3
"""Locale audit: every i18n key the code can request must exist in every locale.

Catches what scripts/locale_parity.py cannot:

- keys referenced from source (`t('...')`, fallback arrays `t(['a', 'b'])`)
  but defined in no locale — parity only compares locales against each
  other, so a key missing everywhere passes;
- dynamic template keys (`t(`glossary.${id}.name`)`) audited against the
  id sources: the algorithms list, the learning config, the glossary
  terms used in markdown, the identification rules/catalogue and the
  timeline/challenge registries;
- untranslated values: fr/ua leaves identical to the English text.
  Legitimate matches (proper quotations, formulas, cipher names kept in
  English by convention) live in the ALLOWLIST below.

Usage: python3 scripts/locale_audit.py
Prints every problem found and exits 1; exits 0 when clean.
"""
import glob
import json
import re
import sys

LOCALES = ['en', 'fr', 'ua']
LOCALE_DIR = 'public/locales/{}/common.json'
SOURCE_GLOBS = ['src/**/*.ts', 'src/**/*.tsx', 'pages/**/*.tsx']

# Values that legitimately stay identical to English in fr/ua.
ALLOWLIST = {
    'name',
    'identify.families.substitution',
    'identify.families.transposition',
    'glossary.substitution.name',
    'glossary.transposition.name',
    'processing.columnar.settings.double_transposition',
    'learning.example.columns.formula',
    'learning.challenges.alberti-medium-1.title',
    'learning.challenges.morse-medium-1.title',
    'processing.railFence.title',
    'processing.railFence.short_title',
    'processing.saknussemm.short_title',
    'glossary.rail-fence.name',
    'processing.adfgvx.variants.adfgx',
    'processing.adfgvx.variants.adfgvx',
}

# The dynamic families the UI resolves with template literals, and the
# source each family's ids come from.
FAMILIES = [
    ('algorithms', r"(?:encodingsList|encryptorsList):\s*\[(.*?)\]", r"'(\w+)'",
     'src/@encryptors/algorithms.js',
     lambda i: [f'processing.{i}.title', f'processing.{i}.short_title',
                f'learning.{i}.description']),
    ('glossary (config)', r'glossary:\s*\[(.*?)\]', r"'([a-z0-9-]+)'",
     'src/@learning/config.js',
     lambda g: [f'glossary.{g}.name', f'glossary.{g}.definition']),
    ('glossary terms (markdown)', r'\{\{term:([a-zA-Z0-9-]+)\}\}', None,
     'content/*/*/*.md',
     lambda t: [f'glossary.{t}.name', f'glossary.{t}.definition']),
    ('learning controls', r'\{\{control:([a-zA-Z0-9-]+)\}\}', None,
     'content/*/*/*.md',
     lambda c: [f'learning.controls.{c}']),
    ('identify reasons', r"rule\('([a-zA-Z0-9]+)'", None,
     'src/@encryptors/shared/identification/rules.ts',
     lambda r: [f'identify.reasons.{r}']),
    ('identify ciphers', r"id: '([a-zA-Z0-9]+)'", None,
     'src/@encryptors/shared/identification/catalogue.ts',
     lambda c: [f'identify.ciphers.{c}']),
    ('identify families', r"export type Family = ([^;]+);", r"'(\w+)'",
     'src/@encryptors/shared/identification/types.ts',
     lambda f: [f'identify.families.{f}']),
    ('identify confidence', r"export type Confidence = ([^;]+);", r"'(\w+)'",
     'src/@encryptors/shared/identification/types.ts',
     lambda c: [f'identify.confidence.{c}']),
    ('keyword alphabet errors', r"reason: '([a-zA-Z]+)'", None,
     'src/@encryptors/Keyword/keyword-crypt.ts',
     lambda c: [f'processing.keyword.settings.freeAlphabetError.{c}']),
    ('learning modes', r'modes:\s*\[(.*?)\]', r"'(\w+)'",
     'src/@learning/config.js',
     lambda m: [f'learning.modes.{m}']),
    ('at-glance i18n keys', r"'(learning\.[A-Za-z0-9.]+)'", None,
     'src/@learning/config.js',
     lambda k: [k]),
    ('timelines', r"textKey: '(learning\.timeline[.A-Za-z0-9]+)'", None,
     'src/@learning/timelines.ts',
     lambda k: [k]),
    ('challenges', r"'(learning\.challenges[.A-Za-z0-9-]+)'", None,
     'src/@learning/challenges.ts',
     lambda k: [k]),
]

# Full keys the shared wizard frame resolves through its i18nScope prop
# (default: the shared cracker block). Only scopes passed to the FRAME
# count — CrackerSettings carries the same prop name but resolves with
# its own shared-scope fallback.
WIZARD_FRAME_SUBKEYS = [
    'tooltips.back', 'tooltips.next', 'tooltips.skip', 'tooltips.useThisKey',
    'wizard.back', 'wizard.next', 'wizard.skip',
]
WIZARD_FRAME_DEFAULT_SCOPE = 'processing.cracker'


def load(locale):
    with open(LOCALE_DIR.format(locale), encoding='utf-8') as handle:
        return json.load(handle)


def leaves(tree, prefix=''):
    if isinstance(tree, dict):
        for key, value in tree.items():
            yield from leaves(value, f'{prefix}.{key}' if prefix else key)
    else:
        yield prefix, tree


def defined(locale_trees, key):
    for locale, tree in locale_trees.items():
        node = tree
        for part in key.split('.'):
            if not isinstance(node, dict) or part not in node:
                return False, locale
            node = node[part]
        if not isinstance(node, str) or not node.strip():
            return False, locale
    return True, None


def source_files():
    files = []
    for pattern in SOURCE_GLOBS:
        files += glob.glob(pattern, recursive=True)
    return files


def static_keys(files):
    keys = set()
    single = re.compile(r"""\bt\(\s*(['"])([a-zA-Z][\w.-]*)\1""")
    arrays = re.compile(r"""\bt\(\s*\[([^\]]*)\]""")
    for path in files:
        text = open(path, encoding='utf-8').read()
        keys |= {match[1] for match in single.findall(text)}
        for array in arrays.findall(text):
            keys |= set(re.findall(r"['\"]([a-zA-Z][\w.-]*)['\"]", array))
    return keys


def dynamic_keys():
    problems = []
    for label, block_pattern, id_pattern, source, build in FAMILIES:
        ids = []
        if id_pattern:
            text = open(source, encoding='utf-8').read()
            for block in re.findall(block_pattern, text, re.S):
                ids += re.findall(id_pattern, block)
        else:
            for path in glob.glob(source, recursive=True):
                ids += re.findall(block_pattern, open(path, encoding='utf-8').read())
        ids = sorted(set(ids))
        if not ids:
            problems.append((label, f'no ids extracted from {source} — audit source pattern stale'))
        for item in ids:
            for key in build(item):
                problems.append((label, key))
    # Wizard-frame scopes: every scope passed to the frame element
    # itself, plus the default.
    scopes = {WIZARD_FRAME_DEFAULT_SCOPE}
    for path in source_files():
        text = open(path, encoding='utf-8').read()
        scopes |= set(re.findall(
            r"""<CrackerWizardFrame\b[^>]*?i18nScope=['"]([\w.]+)['"]""",
            text, re.S))
    for scope in sorted(scopes):
        for sub in WIZARD_FRAME_SUBKEYS:
            problems.append(('wizard frames', f'{scope}.{sub}'))
    # Shared learning tabs (CipherTabs resolves tool + the learning tabs).
    for tab in ['learn', 'history', 'practice', 'tool', 'cryptoanalysis']:
        problems.append(('learning tabs', f'learning.tabs.{tab}'))
    return problems


def untranslated(locale_trees):
    rows = []
    en = dict(leaves(locale_trees['en']))
    for locale in LOCALES:
        if locale == 'en':
            continue
        for key, value in leaves(locale_trees[locale]):
            en_value = en.get(key)
            if (isinstance(en_value, str) and isinstance(value, str)
                    and value == en_value and len(value) >= 10
                    and key not in ALLOWLIST):
                rows.append((locale, key, value))
    return rows


def main():
    locale_trees = {locale: load(locale) for locale in LOCALES}
    files = source_files()

    problems = []

    for key in sorted(static_keys(files)):
        ok, locale = defined(locale_trees, key)
        if not ok:
            problems.append(('static t()', f'{key} (missing in {locale})'))

    for label, key in sorted(dynamic_keys()):
        ok, locale = defined(locale_trees, key)
        if not ok:
            problems.append((label, f'{key} (missing in {locale})'))

    for locale, key, value in untranslated(locale_trees):
        problems.append((f'untranslated ({locale})', f'{key} = "{value[:80]}"'))

    if problems:
        current_label = None
        print(f'{len(problems)} locale audit problem(s):\n')
        for label, detail in problems:
            if label != current_label:
                print(f'--- {label} ---')
                current_label = label
            print(f'  {detail}')
        sys.exit(1)

    print(f'locale audit ok: {len(files)} source files, '
          f'{len(LOCALES)} locales, no missing keys, no untranslated values')
    sys.exit(0)


if __name__ == '__main__':
    main()
