import { describe, expect, it } from 'vitest';

import {
  railFenceEncrypt,
  columnarEncrypt,
  keywordAlphabet,
  keywordEncrypt,
  homophonicEncrypt,
  nihilistEncrypt,
} from './reference';
import { railFenceDecrypt } from '../roadmapCiphers';

const TEXT = 'THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG';

describe('reference ciphers (test-only)', () => {
  it('rail fence round-trips', () => {
    expect(railFenceDecrypt(railFenceEncrypt(TEXT, 3), 3)).toBe(TEXT);
    expect(railFenceDecrypt(railFenceEncrypt(TEXT, 5), 5)).toBe(TEXT);
  });

  it('columnar keeps the letter multiset', () => {
    const encrypted = columnarEncrypt(TEXT, [2, 0, 1]);
    // Padding may add trailing X's; every original letter survives.
    for (const letter of new Set(TEXT.split(''))) {
      expect(encrypted.split(letter).length - 1)
        .toBeGreaterThanOrEqual(TEXT.split(letter).length - 1);
    }
  });

  it('keyword substitution round-trips by construction', () => {
    const alphabet = keywordAlphabet('KRYPTOS');
    expect(alphabet.startsWith('KRYPTOS')).toBe(true);
    expect(alphabet).toHaveLength(26);
    const encrypted = keywordEncrypt(TEXT, 'KRYPTOS');
    expect(encrypted).toHaveLength(TEXT.length);
    // Decrypt: invert the mapping.
    const decrypted = encrypted
      .split('')
      .map((cipher) => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[alphabet.indexOf(cipher)])
      .join('');
    expect(decrypted).toBe(TEXT);
  });

  it('homophonic flattens the distribution', () => {
    const flat = 'EEEEE TTTTT AAAA OOO III NNN';
    expect(homophonicEncrypt(flat)).toContain('Z');
  });

  it('nihilist emits two-digit sums without carry', () => {
    // T = row 4, col 4 → 44; key T → 44; sum digits (4+4)(4+4) = 88.
    expect(nihilistEncrypt('T', 'T')).toBe('88');
    const out = nihilistEncrypt('ATTACKATDAWN', 'RUSSIAN');
    expect(out.split(' ')).toHaveLength(12);
    expect(out.split(' ').every((code) => {
      const value = Number(code);
      return value >= 22 && value <= 110 && code.length === 2;
    })).toBe(true);
  });

  it('is deterministic', () => {
    expect(railFenceEncrypt(TEXT, 4)).toBe(railFenceEncrypt(TEXT, 4));
    expect(nihilistEncrypt(TEXT, 'KEY')).toBe(nihilistEncrypt(TEXT, 'KEY'));
  });
});
