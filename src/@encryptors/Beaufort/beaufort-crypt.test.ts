import { describe, expect, it } from 'vitest';

import {
  DEFAULT_ALPHABET,
  beaufortDecrypt,
  beaufortEncrypt,
} from './beaufort-crypt';

describe('beaufortEncrypt (classic)', () => {
  it('computes C = K − P letter by letter', () => {
    // D(3), E(4), F(5) under the key F(5), O(14), R(17):
    // C = 5−3=2 (C), 14−4=10 (K), 17−5=12 (M).
    expect(beaufortEncrypt('DEF', 'FOR')).toBe('CKM');
  });

  it('cycles the key and strips non-letters', () => {
    // The key repeats over the clean letters only.
    expect(beaufortEncrypt('defend the east!', 'FOR')).toBe(
      beaufortEncrypt('DEFENDTHEEAST', 'FOR'),
    );
  });

  it('is reciprocal: encrypting again restores the plaintext', () => {
    const ciphertext = beaufortEncrypt('ATTACKATDAWN', 'LEMON');
    expect(beaufortEncrypt(ciphertext, 'LEMON')).toBe('ATTACKATDAWN');
    // Decrypt mode is the very same operation.
    expect(beaufortDecrypt(ciphertext, 'LEMON')).toBe('ATTACKATDAWN');
  });

  it('keeps spaces in place when asked', () => {
    expect(beaufortEncrypt('AB CD', 'X', DEFAULT_ALPHABET, { keepSpaces: true }))
      .toBe('XW VU');
    expect(beaufortDecrypt('XW VU', 'X', DEFAULT_ALPHABET, { keepSpaces: true }))
      .toBe('AB CD');
  });

  it('returns empty for letterless or keyless input', () => {
    expect(beaufortEncrypt('', 'KEY')).toBe('');
    expect(beaufortEncrypt('HELLO', '')).toBe('');
    expect(beaufortEncrypt('123', 'KEY')).toBe('');
    expect(beaufortEncrypt('HELLO', '123')).toBe('');
  });
});

describe('beaufortDecrypt (classic)', () => {
  it('round-trips every key shape', () => {
    for (const key of ['A', 'LEMON', 'FORTIFICATION']) {
      const plaintext = 'THE QUICK BROWN FOX';
      const ciphertext = beaufortEncrypt(plaintext, key);
      expect(beaufortDecrypt(ciphertext, key)).toBe('THEQUICKBROWNFOX');
    }
  });
});

describe('variant Beaufort', () => {
  it('computes C = P − K and decrypts with P = C + K', () => {
    // D(3), E(4), F(5) under F(5), O(14), R(17):
    // C = 3−5=−2→24 (Y), 4−14=−10→16 (Q), 5−17=−12→14 (O).
    expect(beaufortEncrypt('DEF', 'FOR', DEFAULT_ALPHABET, { variant: 'variantBeaufort' }))
      .toBe('YQO');
    expect(beaufortDecrypt('YQO', 'FOR', DEFAULT_ALPHABET, { variant: 'variantBeaufort' }))
      .toBe('DEF');
  });

  it('round-trips and matches the classic decrypt of the negated key', () => {
    const ciphertext = beaufortEncrypt('ATTACKATDAWN', 'LEMON', DEFAULT_ALPHABET, {
      variant: 'variantBeaufort',
    });
    expect(beaufortDecrypt(ciphertext, 'LEMON', DEFAULT_ALPHABET, { variant: 'variantBeaufort' }))
      .toBe('ATTACKATDAWN');
  });

  it('works with a custom alphabet', () => {
    const alphabet = 'QWERTYUIOPASDFGHJKLZXCVBNM';
    const ciphertext = beaufortEncrypt('HELLO', 'KEY', alphabet);
    expect(beaufortDecrypt(ciphertext, 'KEY', alphabet)).toBe('HELLO');
  });
});
