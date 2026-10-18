import { describe, expect, it } from 'vitest';

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
