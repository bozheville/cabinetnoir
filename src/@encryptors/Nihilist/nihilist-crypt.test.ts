import { describe, expect, it } from 'vitest';

import { nihilistEncrypt, nihilistDecrypt } from './nihilist-crypt';
import { nihilistEncrypt as referenceEncrypt } from '../shared/identification/__fixtures__/reference';
import {
  noCarryAdd,
  splitSum,
  isNihilistSum,
  parseNihilistNumbers,
} from './nihilist-crypt';

describe('noCarryAdd / splitSum', () => {
  it('adds digit by digit without carry', () => {
    expect(noCarryAdd(34, 23)).toBe(57);
    expect(noCarryAdd(53, 41)).toBe(94);
    expect(noCarryAdd(55, 55)).toBe(110);
    expect(noCarryAdd(55, 53)).toBe(108);
    expect(noCarryAdd(35, 25)).toBe(60);
  });

  it('splits sums back into their two digit-sums', () => {
    expect(splitSum(94)).toEqual([9, 4]);
    expect(splitSum(110)).toEqual([10, 10]);
    expect(splitSum(103)).toEqual([10, 3]);
    // 30 means 2|10, not 3|0 — the column sum overflowed.
    expect(splitSum(30)).toEqual([2, 10]);
  });
});

describe('isNihilistSum', () => {
  it('accepts every possible no-carry sum', () => {
    for (let row = 2; row <= 10; row += 1) {
      for (let column = 2; column <= 10; column += 1) {
        expect(isNihilistSum(row * 10 + column)).toBe(true);
      }
    }
  });

  it('rejects values outside the sum range', () => {
    for (const value of [0, 11, 21, 20, 101, 111, 555]) {
      // 20 = 1|10 (row digit 1 impossible); 101 = 10|1 (column 1).
      expect(isNihilistSum(value)).toBe(false);
    }
    expect(isNihilistSum(22)).toBe(true);
    expect(isNihilistSum(101)).toBe(false);
    expect(isNihilistSum(20)).toBe(false);
  });
});

describe('parseNihilistNumbers', () => {
  it('reads a space-separated stream', () => {
    expect(parseNihilistNumbers('34 56 110 47')).toEqual([34, 56, 110, 47]);
  });

  it('reads a continuous stream with backtracking', () => {
    expect(parseNihilistNumbers('345611047')).toEqual([34, 56, 110, 47]);
    // "1102" cannot end in a bare 2, so it is 11|02? No — 11 is not a
    // valid sum; the group has no valid parse and is dropped.
    expect(parseNihilistNumbers('1102')).toEqual([]);
  });

  it('tolerates punctuation between groups', () => {
    expect(parseNihilistNumbers('34/56, 110…47')).toEqual([34, 56, 110, 47]);
  });
});

describe('nihilistEncrypt / nihilistDecrypt', () => {
  const TEXT = 'THEQUICKBROWNFOX';

  it('round-trips with the plain square', () => {
    const cipher = nihilistEncrypt({ input: TEXT, key: 'RUSSIA' });
    expect(nihilistDecrypt({ input: cipher, key: 'RUSSIA' })).toBe(TEXT);
  });

  it('round-trips with a keyed square', () => {
    const cipher = nihilistEncrypt({ input: TEXT, squareKey: 'SECRET', key: 'NIHILIST' });
    expect(nihilistDecrypt({ input: cipher, squareKey: 'SECRET', key: 'NIHILIST' })).toBe(TEXT);
  });

  it('matches the /identify reference implementation (plain square)', () => {
    const samples = [
      'ITWASTHEBESTOFTIMESITWASTHEWORSTOFTIMES',
      'ATTACKATDAWN',
      'THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG',
    ];
    for (const sample of samples) {
      expect(nihilistEncrypt({ input: sample, key: 'RUSSIA' }))
        .toBe(referenceEncrypt(sample, 'RUSSIA'));
    }
  });

  it('emits space-separated numbers in the 22–110 range', () => {
    const cipher = nihilistEncrypt({ input: 'ZZZZZ', key: 'ZZZZZ' });
    expect(cipher).toBe('110 110 110 110 110');
    const cipherMin = nihilistEncrypt({ input: 'AAAAA', key: 'AAAAA' });
    expect(cipherMin).toBe('22 22 22 22 22');
  });

  it('repeats the key over the text', () => {
    // Key AB: 11+11=22, 11+22=33 → the pattern repeats with period 2.
    const cipher = nihilistEncrypt({ input: 'AAAAAA', key: 'AB', spaced: false });
    expect(cipher).toBe('222322232223');
  });

  it('folds J into I', () => {
    expect(nihilistEncrypt({ input: 'JI', key: 'A' }))
      .toBe(nihilistEncrypt({ input: 'II', key: 'A' }));
  });

  it('returns an empty string without a key', () => {
    expect(nihilistEncrypt({ input: 'A', key: '' })).toBe('');
  });
});
