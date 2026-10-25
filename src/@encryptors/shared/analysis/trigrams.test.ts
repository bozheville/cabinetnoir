import { describe, expect, it } from 'vitest';

import { CRIB_WORDS, COMMON_SYLLABLES } from './english-stats';
import { TRIGRAM_SCORES } from './trigram-data';
import { scoreTrigrams, trigramScore } from './trigrams';

const ENGLISH_SAMPLE = 'ATTACKATDAWNANDMEETMEATTHEBRIDGETONIGHTANDTELLNOONE';
const SCRAMBLED_SAMPLE = 'QQZJWKLXVBNMPPQZJWKLXVBNMQQZJWKLXVBNMPP';

const offset = (trigram: string): number =>
  ((trigram.charCodeAt(0) - 65) * 26
    + trigram.charCodeAt(1) - 65) * 26
  + trigram.charCodeAt(2) - 65;

describe('trigram data', () => {
  it('holds exactly 26^3 quantized scores', () => {
    expect(TRIGRAM_SCORES).toHaveLength(26 ** 3);
    expect(TRIGRAM_SCORES.every((byte) => byte >= 0 && byte <= 255)).toBe(true);
  });

  it('knows the common trigrams and floors the impossible ones', () => {
    // THE is by far the most common English trigram; ZQX never happens.
    expect(TRIGRAM_SCORES[offset('THE')]).toBeGreaterThan(200);
    expect(TRIGRAM_SCORES[offset('ZQX')]).toBe(0);
    expect(trigramScore('ZQX')).toBeLessThan(trigramScore('THE'));
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
