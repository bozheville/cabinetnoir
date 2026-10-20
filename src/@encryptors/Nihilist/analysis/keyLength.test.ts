import { describe, expect, it } from 'vitest';

import { nihilistEncrypt, nihilistKeyNumbers } from '../nihilist-crypt';
import {
  rankKeyLengths,
  columnNumbers,
  consistentKeyNumbers,
} from './keyLength';

const numbersOf = (text: string, squareKey: string, key: string): number[] =>
  nihilistEncrypt({ input: text, squareKey, key, spaced: true })
    .split(' ')
    .filter(Boolean)
    .map(Number);

const PLAINTEXT =
  'ITWASTHEBESTOFTIMESITWASTHEWORSTOFTIMESITWASTHEAGEOFWISDOMITWASTHEAGE'
  + 'OFFOOLISHNESSITWASTHEEPOCHOFBELIEFITWASTHEEPOCHOFINCREDULITY';

describe('rankKeyLengths', () => {
  it('puts the true key length in the top three', () => {
    for (const key of ['RUSSIA', 'REVOLUTION', 'SIBERIA']) {
      const values = numbersOf(PLAINTEXT, '', key);
      const candidates = rankKeyLengths(values);
      const top = candidates.slice(0, 3).map((candidate) => candidate.length);
      expect(top).toContain(key.length);
    }
  });

  it('is deterministic', () => {
    const values = numbersOf(PLAINTEXT, '', 'REVOLUTION');
    expect(rankKeyLengths(values)).toEqual(rankKeyLengths(values));
  });

  it('returns nothing for a stream too short to slice', () => {
    expect(rankKeyLengths([34, 56])).toEqual([]);
  });
});

describe('columnNumbers', () => {
  it("splits the stream into the key's columns", () => {
    const values = [11, 22, 33, 44, 55, 66];
    expect(columnNumbers(values, 3, 0)).toEqual([11, 44]);
    expect(columnNumbers(values, 3, 2)).toEqual([33, 66]);
  });
});

describe('consistentKeyNumbers', () => {
  it("keeps the true key number in every column's consistent set", () => {
    for (const key of ['RUSSIA', 'REVOLUTION']) {
      const values = numbersOf(PLAINTEXT, '', key);
      const length = key.length;
      const trueNumbers = nihilistKeyNumbers(key, '');
      for (let index = 0; index < length; index += 1) {
        const consistent = consistentKeyNumbers(columnNumbers(values, length, index));
        expect(consistent).toContain(trueNumbers[index]);
      }
    }
  });

  it('narrows the search: no column keeps all 25 key numbers', () => {
    const key = 'RUSSIA';
    const values = numbersOf(PLAINTEXT, '', key);
    for (let index = 0; index < key.length; index += 1) {
      const consistent = consistentKeyNumbers(columnNumbers(values, key.length, index));
      expect(consistent.length).toBeGreaterThan(0);
      expect(consistent.length).toBeLessThan(25);
    }
  });

  it('accepts every key number for an empty column (no constraint yet)', () => {
    expect(consistentKeyNumbers([])).toEqual([
      11, 12, 13, 14, 15, 21, 22, 23, 24, 25,
      31, 32, 33, 34, 35, 41, 42, 43, 44, 45,
      51, 52, 53, 54, 55,
    ]);
  });
});
