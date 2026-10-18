import { describe, expect, it } from 'vitest';

import {
  ALPHABET_LENGTH,
  ENGLISH_FREQUENCIES,
  STANDARD_ALPHABET,
  countLetters,
} from './frequency';
import { indexOfCoincidence } from './keyLength';

const countByStandardAlphabet = countLetters;

// Smoke test for the shared analysis library: proves the test setup
// resolves the baseUrl aliases and that the basic math behaves.

describe('countLetters', () => {
  it('counts only alphabet letters', () => {
    const counts = countLetters('AB!C  ABZ');
    expect(counts[0]).toBe(2); // A
    expect(counts[1]).toBe(2); // B
    expect(counts[2]).toBe(1); // C
    expect(counts[25]).toBe(1); // Z
    expect(counts.reduce((sum, count) => sum + count, 0)).toBe(6);
  });

  it('counts against a reshuffled alphabet by character, not position', () => {
    const counts = countByStandardAlphabet('ZEBRA', STANDARD_ALPHABET);
    expect(counts[25]).toBe(1); // Z
    expect(counts[4]).toBe(1); // E
  });
});

describe('indexOfCoincidence', () => {
  it('is near 1/26 for random letters', () => {
    const random = 'QWZXJKVBNMPGHTRCYFSDLUEOAIE'.slice(0, 26);
    expect(indexOfCoincidence(random)).toBeLessThan(0.05);
  });

  it('is well above random for English text', () => {
    const english = (
      'THEQUICKBROWNFOXJUMSOVERTHELAZYDOG' +
      'ANDTHENTHEFOXRANINTOTHEWOODSWHERE' +
      'THEHENS werelate TO roost THAT evening'.toUpperCase()
    ).replace(/[^A-Z]/g, '');
    expect(english.length).toBeGreaterThan(60);
    expect(indexOfCoincidence(english)).toBeGreaterThan(0.055);
  });

  it('is 0 for too-short input', () => {
    expect(indexOfCoincidence('AB')).toBe(0);
  });
});

describe('constants', () => {
  it('describes the standard 26-letter alphabet', () => {
    expect(ALPHABET_LENGTH).toBe(26);
    expect(STANDARD_ALPHABET).toHaveLength(26);
    expect(ENGLISH_FREQUENCIES).toHaveLength(26);
    expect(ENGLISH_FREQUENCIES.reduce((sum, f) => sum + f, 0)).toBeCloseTo(99.9, 0);
  });
});
