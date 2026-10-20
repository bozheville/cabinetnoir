import { describe, expect, it } from 'vitest';

import {
  homophonicEncrypt,
  nihilistEncrypt,
} from './reference';

const TEXT = 'THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG';

describe('reference ciphers (test-only, still roadmap)', () => {
  it('homophonic emits two-digit codes with many distinct values', () => {
    const out = homophonicEncrypt('EEEEETTTTTAAAAOOOIIINNN');
    expect(out).toMatch(/^\d+$/);
    const pairs = out.match(/\d{2}/g) || [];
    expect(pairs.length).toBe(23);
    expect(new Set(pairs).size).toBeGreaterThanOrEqual(6);
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
    expect(homophonicEncrypt(TEXT)).toBe(homophonicEncrypt(TEXT));
    expect(nihilistEncrypt(TEXT, 'KEY')).toBe(nihilistEncrypt(TEXT, 'KEY'));
  });
});
