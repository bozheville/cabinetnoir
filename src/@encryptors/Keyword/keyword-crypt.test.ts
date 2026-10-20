import { describe, expect, it } from 'vitest';

import {
  keywordAlphabet,
  keywordEncrypt,
  keywordDecrypt,
  keywordFromAlphabet,
  validateFreeAlphabet,
} from './keyword-crypt';

describe('keywordAlphabet', () => {
  it('builds the KRYPTOS alphabet (keyword first, then A→Z)', () => {
    // The real Kryptos tableau's first row.
    expect(keywordAlphabet('KRYPTOS')).toBe('KRYPTOSABCDEFGHIJLMNQUVWXZ');
  });

  it('deduplicates the keyword', () => {
    expect(keywordAlphabet('BALLOON')).toBe('BALONCDEFGHIJKMPQRSTUVWXYZ');
  });

  it('continues from the keyword\'s last letter when asked', () => {
    // After S: U V W X Z (T is used), then wrap A… (skipping used letters).
    expect(keywordAlphabet('KRYPTOS', { continueFromLast: true }))
      .toBe('KRYPTOSUVWXZABCDEFGHIJLMNQ');
  });

  it('ignores non-letters and case in the keyword', () => {
    expect(keywordAlphabet('kryp tos!')).toBe(keywordAlphabet('KRYPTOS'));
  });

  it('returns an empty alphabet for a keyword without letters', () => {
    expect(keywordAlphabet('123')).toBe('');
    expect(keywordAlphabet('')).toBe('');
  });
});

describe('keywordEncrypt / keywordDecrypt', () => {
  const TEXT = 'The quick brown fox jumps over the lazy dog';

  it('round-trips (keyword mode)', () => {
    const encrypted = keywordEncrypt({
      input: TEXT, keyword: 'KRYPTOS', keepSpaces: true,
    });
    expect(keywordDecrypt({ input: encrypted, keyword: 'KRYPTOS' }))
      .toBe(TEXT.toUpperCase());
  });

  it('encrypts a known vector', () => {
    // A → K (KRYPTOS starts with K), B → R, C → Y…
    expect(keywordEncrypt({ input: 'ABC', keyword: 'KRYPTOS' })).toBe('KRY');
  });

  it('round-trips in free-alphabet mode', () => {
    const alphabet = 'QWERTYUIOPASDFGHJKLZXCVBNM';
    const encrypted = keywordEncrypt({ input: TEXT, targetAlphabet: alphabet });
    expect(keywordDecrypt({ input: encrypted, targetAlphabet: alphabet }))
      .toBe('THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG');
  });

  it('rejects an invalid free alphabet with a reason', () => {
    expect(() => keywordEncrypt({ input: 'A', targetAlphabet: 'ABC' }))
      .toThrow('Invalid free alphabet: length');
    expect(() => keywordEncrypt({ input: 'A', targetAlphabet: 'AABCDEFGHIJKLMNOPQRSTUVWXY' }))
      .toThrow('Invalid free alphabet: duplicates');
  });

  it('keeps spaces and case only when asked', () => {
    const spaced = keywordEncrypt({
      input: 'AB AB', keyword: 'KRYPTOS', keepSpaces: true, keepCase: true,
    });
    expect(spaced).toBe('KR KR');
    expect(keywordEncrypt({ input: 'AB AB', keyword: 'KRYPTOS' })).toBe('KRKR');
  });

  it('throws without a key', () => {
    expect(() => keywordEncrypt({ input: 'A' })).toThrow('keyword or a targetAlphabet');
  });
});

describe('keywordFromAlphabet', () => {
  it('recovers KRYPTOS from a keyword-built alphabet', () => {
    expect(keywordFromAlphabet(keywordAlphabet('KRYPTOS'))).toBe('KRYPTOS');
    expect(keywordFromAlphabet(keywordAlphabet('KRYPTOS', { continueFromLast: true })))
      .toBe('KRYPTOS');
  });

  it('does not mistake a Caesar rotation for a keyword', () => {
    const rotated = 'DEFGHIJKLMNOPQRSTUVWXYZABC';
    expect(keywordFromAlphabet(rotated)).toBe(null);
  });

  it('returns null for a mixed alphabet', () => {
    expect(keywordFromAlphabet('QWERTYUIOPASDFGHJKLZXCVBNM')).toBe(null);
    expect(keywordFromAlphabet('short')).toBe(null);
  });
});

describe('validateFreeAlphabet', () => {
  it('accepts any 26-letter permutation (spaces allowed)', () => {
    expect(validateFreeAlphabet('QWERTYUIOP ASDFGHJKL ZXCVBNM'))
      .toEqual({ valid: true, alphabet: 'QWERTYUIOPASDFGHJKLZXCVBNM' });
  });

  it('rejects with a reason code per case', () => {
    expect(validateFreeAlphabet('')).toEqual({ valid: false, reason: 'empty' });
    expect(validateFreeAlphabet('ABC')).toEqual({ valid: false, reason: 'length' });
    expect(validateFreeAlphabet('AABCDEFGHIJKLMNOPQRSTUVWXY'))
      .toEqual({ valid: false, reason: 'duplicates' });
    expect(validateFreeAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXY1'))
      .toEqual({ valid: false, reason: 'length' });
  });

  it('accepts a full permutation with digits ignored only if 26 letters remain', () => {
    // 26 letters + noise characters → valid, noise stripped.
    expect(validateFreeAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ!'))
      .toEqual({ valid: true, alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' });
  });
});
