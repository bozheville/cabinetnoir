import { describe, expect, it } from 'vitest';

import { CRIB_WORDS, COMMON_SYLLABLES } from './english-stats';
import { BIGRAM_SCORES, TRIGRAM_SCORES } from './ngram-data';
import { bigramScore, scoreTrigrams, trigramScore } from './ngrams';

const ENGLISH_SAMPLE = 'ATTACKATDAWNANDMEETMEATTHEBRIDGETONIGHTANDTELLNOONE';
const SCRAMBLED_SAMPLE = 'QQZJWKLXVBNMPPQZJWKLXVBNMQQZJWKLXVBNMPP';

const offset = (ngram: string): number =>
  [...ngram].reduce((total, char) => total * 26 + char.charCodeAt(0) - 65, 0);

describe('ngram data', () => {
  it('holds exactly 26^n quantized scores', () => {
    expect(TRIGRAM_SCORES).toHaveLength(26 ** 3);
    expect(BIGRAM_SCORES).toHaveLength(26 ** 2);
    expect(TRIGRAM_SCORES.every((byte) => byte >= 0 && byte <= 255)).toBe(true);
    expect(BIGRAM_SCORES.every((byte) => byte >= 0 && byte <= 255)).toBe(true);
  });

  it('knows the common ngrams and floors the impossible ones', () => {
    // THE is by far the most common English trigram; ZQX never happens.
    expect(TRIGRAM_SCORES[offset('THE')]).toBeGreaterThan(200);
    expect(TRIGRAM_SCORES[offset('ZQX')]).toBe(0);
    expect(trigramScore('ZQX')).toBeLessThan(trigramScore('THE'));
    // TH and HE top the bigrams; JQ never happens. (TH sits near the
    // top of the scale, not on it — within-word TH is ~2.4% of bigrams
    // while the scale tops out at 3.16%. No bigram is byte 0: every
    // one of the 676 pairs occurs somewhere in a 4.5-billion-word
    // corpus — QJ just almost never does.)
    expect(BIGRAM_SCORES[offset('TH')]).toBeGreaterThan(230);
    expect(bigramScore('HE')).toBeGreaterThan(bigramScore('QJ'));
    expect(BIGRAM_SCORES[offset('QJ')]).toBeLessThan(20);
    // ET was missing from the old curated digraph list — the corpus
    // table must know it.
    expect(bigramScore('ET')).toBeGreaterThan(bigramScore('ZQ'));
  });
});

describe('scoreTrigrams', () => {
  it('scores English far above scrambled text', () => {
    expect(scoreTrigrams(ENGLISH_SAMPLE)).toBeGreaterThan(60);
    expect(scoreTrigrams(SCRAMBLED_SAMPLE)).toBeLessThan(30);
  });

  it('handles short input', () => {
    expect(scoreTrigrams('')).toBe(0);
    expect(scoreTrigrams('AB')).toBe(0);
    expect(scoreTrigrams('THE')).toBeGreaterThan(0);
  });
});

describe('english stats tables', () => {
  it('lists crib words uppercase, deduplicated, frequency-ordered', () => {
    expect(CRIB_WORDS.length).toBeGreaterThan(100);
    expect(new Set(CRIB_WORDS).size).toBe(CRIB_WORDS.length);
    expect(CRIB_WORDS[0]).toBe('THE');
    expect(CRIB_WORDS.every((word) => /^[A-Z]+$/.test(word))).toBe(true);
  });

  it('lists syllables with sane percentages', () => {
    expect(COMMON_SYLLABLES.length).toBeGreaterThanOrEqual(100);
    expect(COMMON_SYLLABLES.every(({ syllable, percent }) =>
      /^[A-Z]+$/.test(syllable.toUpperCase()) && percent > 0 && percent <= 10)).toBe(true);
  });
});
