import { describe, expect, it } from 'vitest';

import { STANDARD_ALPHABET } from '@encryptors/shared/analysis/frequency';

import { profileText } from './profile';
import { MIN_LETTERS, RELIABLE_LETTERS } from './thresholds';

const englishText =
  'THEQUICKBROWNFOXJUMPSOVERTHELAZYDOGANDTHEFOXRUNSINTOTHEWOODSWHERETHEHENSROOSTATEVENING'; // 88 letters
const longEnglish = englishText.repeat(3);

describe('profileText: basics', () => {
  it('normalises and counts letters vs non-letters', () => {
    const profile = profileText('Hello, World! 123');
    expect(profile.letters).toBe('HELLOWORLD');
    expect(profile.letterCount).toBe(10);
    expect(profile.nonLetterCount).toBe(7);
  });

  it('reports distinct and missing letters', () => {
    const profile = profileText('ABABABABAB');
    expect(profile.distinctLetters.join('')).toBe('AB');
    expect(profile.missingLetters).toHaveLength(24);
  });

  it('gives English text an English-like IC score', () => {
    const profile = profileText(longEnglish);
    expect(profile.ic).toBeGreaterThan(0.055);
    expect(profile.icScore).toBeGreaterThan(0.4);
  });

  it('detects the length tiers', () => {
    expect(profileText('SHORT').tier).toBe('tooShort');
    expect(profileText('A'.repeat(MIN_LETTERS)).tier).toBe('unreliable');
    expect(profileText('A'.repeat(RELIABLE_LETTERS + 1)).tier).toBe('ok');
  });

  it('flags digit-only and letter-only charsets', () => {
    expect(profileText('13 25 44 31 42').digitsOnly).toBe(true);
    expect(profileText(longEnglish).lettersOnly).toBe(true);
  });

  it('counts distinct symbols across the raw input', () => {
    expect(profileText('AB AB AB AB AB AB %$').distinctSymbols).toBe(4); // A, B, %, $
  });

  it('flags equal-size grouping', () => {
    expect(profileText('FGXVA DFGVX FVXAD GXVDF').grouped).toBe(true);
    expect(profileText(longEnglish).grouped).toBe(false);
  });

  it('is deterministic', () => {
    expect(profileText(longEnglish)).toEqual(profileText(longEnglish));
  });
});

describe('profileText: substitution fits', () => {
  const encryptWith = (plaintext: string, targetAlphabet: string): string =>
    plaintext
      .toUpperCase()
      .split('')
      .map((letter) => {
        const index = STANDARD_ALPHABET.indexOf(letter);
        return index >= 0 ? targetAlphabet[index] : letter;
      })
      .join('');

  const caesarAlphabet = (shift: number): string =>
    STANDARD_ALPHABET.split('').map((_, index) =>
      STANDARD_ALPHABET[(index + shift) % 26]).join('');

  const affineAlphabet = (a: number, b: number): string =>
    STANDARD_ALPHABET.split('').map((_, index) =>
      STANDARD_ALPHABET[(a * index + b) % 26]).join('');

  it('recovers the Caesar shift of a shifted text', () => {
    const profile = profileText(encryptWith(longEnglish, caesarAlphabet(7)));
    expect(profile.caesarBestShift).toBe(7);
    expect(profile.caesarBestScore).toBeGreaterThan(65);
    expect(profile.caesarBestScore - profile.caesarRunnerUpScore).toBeGreaterThan(5);
    expect(profile.directChiScore).toBeLessThan(50); // as-is: not English
    expect(profile.sortedChiScore).toBeGreaterThan(65); // shape preserved
  });

  it('scores plain English best at shift 0', () => {
    const profile = profileText(longEnglish);
    expect(profile.caesarBestShift).toBe(0);
    expect(profile.directChiScore).toBeGreaterThan(65);
  });

  it('scores Atbash highest on Atbash text', () => {
    const atbashAlphabet = STANDARD_ALPHABET.split('').reverse().join('');
    const profile = profileText(encryptWith(longEnglish, atbashAlphabet));
    expect(profile.atbashScore).toBeGreaterThan(65);
  });

  it('recovers an affine key', () => {
    const profile = profileText(encryptWith(longEnglish, affineAlphabet(5, 8)));
    expect(profile.affineMultiplier).toBe(5);
    expect(profile.affineShift).toBe(8);
    expect(profile.affineScore).toBeGreaterThan(65);
  });
});
