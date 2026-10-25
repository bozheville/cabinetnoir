#!/usr/bin/env python3
"""Regenerate the English statistics data modules.

Inputs: Peter Norvig's count_1w.txt word-frequency list (Google Books
corpus, https://norvig.com/ngrams/count_1w.txt). The corpus itself is
NOT committed — cache a copy and pass its path:

    curl -LO https://norvig.com/ngrams/count_1w.txt
    python3 scripts/generate-english-stats.py count_1w.txt

Outputs (byte-identical when the corpus is unchanged):

- src/@encryptors/shared/analysis/trigram-data.ts
  the full 17,576-entry trigram table, log10-frequency quantized to
  one byte per trigram, base64-packed, plus the calibration constants
  the scorer needs.
- src/@encryptors/shared/analysis/english-stats.ts
  CRIB_WORDS: the top 200 alphabetic words, the corpus-derived half of
  the Keyword cracker's pattern-word list.

COMMON_SYLLABLES in english-stats.ts is a curated constant (Fry-style
reading-research list), not corpus-derived; it lives in the generator
so every table has one reproducible source.

The syllable/trigram tables power hints and feedback only — the IKEA
rule of specs/standard.md: statistics point, the user decides.
"""
import base64
import json
import math
import sys
from collections import Counter

TARGET_TRIGRAM_DATA = 'src/@encryptors/shared/analysis/trigram-data.ts'
TARGET_ENGLISH_STATS = 'src/@encryptors/shared/analysis/english-stats.ts'

# Quantization: seen trigrams map to log10(percent) on [-4.5, -0.5],
# byte 1..255; byte 0 marks "never seen" and decodes to the floor.
FLOOR_LOG = -4.5
TOP_LOG = -0.5
BYTE_MAX = 255
CRIB_WORD_COUNT = 200

# Fry-style top syllables of English (reading research's classic list),
# approximate share of all syllable occurrences, per cent.
COMMON_SYLLABLES = [
    ('re', 6.4), ('in', 4.2), ('er', 3.6), ('an', 3.1), ('ti', 2.9),
    ('es', 2.8), ('on', 2.7), ('at', 2.5), ('en', 2.4), ('nd', 2.2),
    ('or', 2.1), ('st', 2.0), ('ed', 1.9), ('te', 1.8), ('ar', 1.7),
    ('ne', 1.6), ('ing', 1.5), ('to', 1.5), ('nt', 1.4), ('is', 1.3),
    ('al', 1.3), ('ve', 1.2), ('ng', 1.2), ('it', 1.1), ('as', 1.1),
    ('se', 1.0), ('le', 1.0), ('ro', 1.0), ('ra', 0.9), ('li', 0.9),
    ('ri', 0.9), ('ho', 0.9), ('ma', 0.8), ('ic', 0.8), ('ll', 0.8),
    ('co', 0.8), ('me', 0.8), ('de', 0.7), ('si', 0.7), ('om', 0.7),
    ('el', 0.7), ('ta', 0.7), ('la', 0.7), ('io', 0.7), ('ce', 0.6),
    ('ea', 0.6), ('ur', 0.6), ('lo', 0.6), ('ca', 0.6), ('ei', 0.6),
    ('us', 0.6), ('ch', 0.5), ('ha', 0.5), ('he', 0.5), ('bl', 0.5),
    ('be', 0.5), ('mi', 0.5), ('mo', 0.5), ('no', 0.5), ('ut', 0.5),
    ('ol', 0.4), ('pr', 0.4), ('ot', 0.4), ('ac', 0.4), ('ct', 0.4),
    ('pl', 0.4), ('il', 0.4), ('id', 0.4), ('di', 0.4), ('ns', 0.4),
    ('fi', 0.4), ('fo', 0.4), ('ty', 0.3), ('pe', 0.3), ('bo', 0.3),
    ('ry', 0.3), ('un', 0.3), ('ul', 0.3), ('wh', 0.3), ('wo', 0.3),
    ('sc', 0.3), ('ge', 0.3), ('na', 0.3), ('wi', 0.3), ('em', 0.3),
    ('ad', 0.3), ('ou', 0.3), ('ow', 0.3), ('pa', 0.3), ('so', 0.3),
    ('po', 0.3), ('we', 0.2), ('su', 0.2), ('od', 0.2), ('ap', 0.2),
    ('av', 0.2), ('do', 0.2), ('ex', 0.2), ('ir', 0.2), ('fa', 0.2),
    ('ke', 0.2), ('gh', 0.2), ('sh', 0.2), ('ss', 0.2),
]


def offset(trigram):
    return ((ord(trigram[0]) - 65) * 26 + (ord(trigram[1]) - 65)) * 26 \
        + (ord(trigram[2]) - 65)


def load_words(path):
    words = []
    with open(path, encoding='utf-8') as handle:
        for line in handle:
            word, _, count = line.rstrip('\n').partition('\t')
            if word.isalpha() and 2 <= len(word) <= 8:
                words.append((word.upper(), int(count)))
            if len(words) >= CRIB_WORD_COUNT:
                break
    return words


def build_trigrams(path):
    counts = Counter()
    total = 0
    with open(path, encoding='utf-8') as handle:
        for line in handle:
            word, _, count = line.rstrip('\n').partition('\t')
            word = word.upper()
            if not word.isalpha() or len(word) < 3:
                continue
            weight = int(count)
            for index in range(len(word) - 2):
                counts[word[index:index + 3]] += weight
                total += weight
    scores = bytearray(26 ** 3)
    for trigram, count in counts.items():
        logpct = math.log10(count / total * 100)
        clamped = max(FLOOR_LOG, min(TOP_LOG, logpct))
        byte = round((clamped - FLOOR_LOG) / (TOP_LOG - FLOOR_LOG) * BYTE_MAX)
        scores[offset(trigram)] = max(1, byte)
    # Calibration: the expected log-score of a trigram drawn from this
    # corpus — the "average English" anchor the scorer normalizes with.
    english_average = 0.0
    for trigram, count in counts.items():
        logpct = math.log10(count / total * 100)
        clamped = max(FLOOR_LOG, min(TOP_LOG, logpct))
        english_average += clamped * count
    english_average = round(english_average / total, 4)
    return bytes(scores), english_average, len(counts)


def wrap(base64_text, width=100):
    lines = [base64_text[index:index + width]
             for index in range(0, len(base64_text), width)]
    return '\n'.join(f"  '{line}'{'' if index == len(lines) - 1 else ' +'}"
                     for index, line in enumerate(lines))


def write_trigram_data(scores, english_average, distinct):
    data = base64.b64encode(scores).decode('ascii')
    content = f"""// GENERATED by scripts/generate-english-stats.py — do not edit by
// hand; regenerate with the script instead.
//
// The full English trigram table: 17,576 log10-frequency scores, one
// byte each, derived from Peter Norvig's count_1w.txt word list
// (Google Books corpus, https://norvig.com/mayzner.html). Byte 0
// marks a trigram the corpus never produced; the score it decodes to
// is TRIGRAM_FLOOR_LOG.
//
// {distinct} distinct trigrams observed. The bytes are base64-packed;
// at module load they decode once into a Uint8Array.
//
// Upgrade path (documented, not built): if trigram feedback proves too
// weak, the same generator can emit quadgrams — a trimmed top-20k
// table (~30-40 KB gzipped) or the full 456,976-entry quantized table
// (~457 KB raw, ~100-150 KB gzipped). The full table must then be
// lazy-fetched from public/ on first cracker open, never bundled.

export const TRIGRAM_COUNT = 26 ** 3;
export const TRIGRAM_FLOOR_LOG = {FLOOR_LOG};
export const TRIGRAM_TOP_LOG = {TOP_LOG};
// The expected log-score of an average English trigram — the anchor
// scoreTrigrams normalizes against.
export const TRIGRAM_ENGLISH_AVERAGE = {english_average};

const DATA = (
{wrap(data)}
);


export const TRIGRAM_SCORES: Uint8Array = (() => {{
  const binary = atob(DATA);
  const scores = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {{
    scores[index] = binary.charCodeAt(index);
  }}
  return scores;
}})();
"""
    with open(TARGET_TRIGRAM_DATA, 'w', encoding='utf-8') as handle:
        handle.write(content)


def write_english_stats(crib_words):
    words = json.dumps(crib_words, indent=2)
    words = '\n'.join('  ' + line for line in words.splitlines())
    syllables = json.dumps(
        [{'syllable': s, 'percent': p} for s, p in COMMON_SYLLABLES],
        indent=2)
    syllables = '\n'.join('  ' + line for line in syllables.splitlines())
    content = f"""// GENERATED in part by scripts/generate-english-stats.py — do not
// edit by hand; regenerate with the script instead.
//
// CRIB_WORDS: the top {len(crib_words)} alphabetic English words by
// Google Books frequency (Norvig's count_1w.txt), the corpus-derived
// half of the Keyword cracker's pattern-word list.
//
// COMMON_SYLLABLES: the Fry-style classic syllable list of reading
// research with approximate shares of syllable occurrences — a curated
// constant, not corpus-derived; the generator keeps it here so every
// English table has one reproducible source.
//
// Both tables power hints only — statistics point, the user decides.

export const CRIB_WORDS: string[] =
{words};

export interface CommonSyllable {{
  syllable: string;
  // Approximate share of all syllable occurrences, per cent.
  percent: number;
}}

export const COMMON_SYLLABLES: CommonSyllable[] =
{syllables};
"""
    with open(TARGET_ENGLISH_STATS, 'w', encoding='utf-8') as handle:
        handle.write(content)


def main():
    if len(sys.argv) != 2:
        sys.exit('usage: generate-english-stats.py <count_1w.txt>')
    scores, english_average, distinct = build_trigrams(sys.argv[1])
    write_trigram_data(scores, english_average, distinct)
    crib_words = [word for word, _ in load_words(sys.argv[1])]
    write_english_stats(crib_words)
    print(f'trigram table: {distinct} distinct trigrams, '
          f'english average log-score {english_average}')
    print(f'english-stats.ts: {len(crib_words)} crib words, '
          f'{len(COMMON_SYLLABLES)} syllables')


if __name__ == '__main__':
    main()
