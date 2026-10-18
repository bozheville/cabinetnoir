import { describe, expect, it } from 'vitest';

import { identify } from './identify';

const longEnglish =
  'THEQUICKBROWNFOXJUMPSOVERTHELAZYDOGANDTHENHERANINTOTHEWOODSWHERETHEHENSROOSTALLDAYLONGUNTILTHEFARMERCAMEHOMEPASTTHEOLDMILLANDDOWNTHELANE'.repeat(2);

const shiftText = (text: string, shift: number): string =>
  text.toUpperCase().replace(/[A-Z]/g, (letter) =>
    String.fromCharCode(((letter.charCodeAt(0) - 65 + shift) % 26) + 65));

const vigenereText = (text: string, key: string): string =>
  text.toUpperCase().replace(/[A-Z]/g, (letter, index) => {
    const keyShift = key.charCodeAt(index % key.length) - 65;
    return String.fromCharCode(((letter.charCodeAt(0) - 65 + keyShift) % 26) + 65);
  });

const findCandidate = (result: ReturnType<typeof identify>, id: string) => {
  for (const family of result.families) {
    const candidate = family.ciphers.find((cipher) => cipher.id === id);
    if (candidate) {
      return { family, candidate };
    }
  }
  return null;
};

describe('identify()', () => {
  it('refuses too-short input', () => {
    const result = identify('SHORT TEXT');
    expect(result.tier).toBe('tooShort');
    expect(result.families).toEqual([]);
  });

  it('ranks Caesar first on a shifted text, with its shift', () => {
    const result = identify(shiftText(longEnglish, 7));
    const found = findCandidate(result, 'caesar');
    expect(found?.candidate.confidence).toBe('veryLikely');
    expect(found?.candidate.params).toMatchObject({ shift: 7 });
    expect(result.families[0].family).toBe('substitution');
  });

  it('ranks Vigenere first on a periodic text, with its period', () => {
    const result = identify(vigenereText(longEnglish, 'LEMON'));
    const found = findCandidate(result, 'vigenere');
    expect(found?.candidate.confidence).toBe('veryLikely');
    expect(found?.candidate.params).toMatchObject({ period: 5 });
    expect(result.families[0].family).toBe('polyalphabetic');
  });

  it('keeps plain English away from substitution', () => {
    const result = identify(longEnglish);
    const caesar = findCandidate(result, 'caesar');
    expect(caesar?.candidate.confidence).toBe('ruledOut');
  });

  it('matches the Saknussemm parchment above everything else', () => {
    const result = identify('In Sneffels Yoculis craterem kem delibat umbra Scartaris Julii intra calendas descende, audas viator, et terrestre centrum attinges. Kod feci. Arne Saknussemm');
    const found = findCandidate(result, 'saknussemm');
    expect(found?.candidate.confidence).toBe('veryLikely');
    expect(found?.candidate.inApp).toBe(false);
  });

  it('never shows Saknussemm without a fingerprint match', () => {
    const result = identify(longEnglish);
    expect(findCandidate(result, 'saknussemm')).toBeNull();
  });

  it('carries the profile for the metrics panel', () => {
    const result = identify(longEnglish);
    expect(result.profile?.letterCount).toBeGreaterThan(200);
    expect(result.profile?.ic).toBeGreaterThan(0.05);
  });

  it('is deterministic', () => {
    expect(identify(shiftText(longEnglish, 3))).toEqual(identify(shiftText(longEnglish, 3)));
  });

  it('returns every family, best first', () => {
    const result = identify(shiftText(longEnglish, 3));
    expect(result.families.map((family) => family.family)).toEqual([
      'substitution',
      'polyalphabetic',
      'transposition',
      'block',
    ]);
  });
});
