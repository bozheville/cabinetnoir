import { describe, expect, it } from 'vitest';

import {
  columnOrder,
  normalizeTranspositionKey,
  columnarEncrypt,
  columnarDecrypt,
  doubleColumnarEncrypt,
  doubleColumnarDecrypt,
} from './transposition';

describe('columnOrder', () => {
  it('sorts columns by key letter', () => {
    // C(0) A(1) B(2): A reads first, so column 1 comes first.
    expect(columnOrder('CAB')).toEqual([1, 2, 0]);
  });

  it('breaks ties left-to-right', () => {
    // B A N A N A: the three A's keep their relative order.
    expect(columnOrder('BANANA')).toEqual([1, 3, 5, 0, 2, 4]);
  });

  it('is case-insensitive after normalization', () => {
    expect(normalizeTranspositionKey('kriegs 42')).toBe('KRIEGS');
    expect(columnOrder(normalizeTranspositionKey('kRiegs'))).toEqual(columnOrder('KRIEGS'));
  });
});

describe('columnarEncrypt / columnarDecrypt (padded)', () => {
  it('encrypts a known vector', () => {
    // ABC/DEF/GH+X read by columns 1, 2, 0 (key CAB).
    expect(columnarEncrypt('ABCDEFGH', [1, 2, 0])).toBe('BEHCFXADG');
  });

  it('round-trips', () => {
    const order = columnOrder('ZEBRAS');
    const encrypted = columnarEncrypt('WEAREDISCOVEREDFLEEATONCE', order);
    // 25 letters in 6 columns → 5 pad characters.
    expect(columnarDecrypt(encrypted, order)).toBe('WEAREDISCOVEREDFLEEATONCEXXXXX');
  });

  it('leaves text unchanged without a key', () => {
    expect(columnarEncrypt('ABC', [])).toBe('ABC');
    expect(columnarDecrypt('ABC', [])).toBe('ABC');
  });

  it('supports a custom pad character', () => {
    // 3 letters in 2 columns → one pad cell, read inside column 1.
    const encrypted = columnarEncrypt('ABC', [1, 0], { padChar: '?' });
    expect(encrypted).toBe('B?AC');
  });
});

describe('columnarEncrypt / columnarDecrypt (irregular)', () => {
  it('encrypts a known vector with uneven columns', () => {
    // 8 letters, width 3: col 1 and 0 hold 3 letters, col 2 holds 2.
    expect(columnarEncrypt('ABCDEFGH', [1, 2, 0], { irregular: true }))
      .toBe('BEHCFADG');
  });

  it('round-trips', () => {
    const order = columnOrder('ZEbras');
    const encrypted = columnarEncrypt('WEAREDISCOVEREDFLEEATONCE', order, { irregular: true });
    expect(columnarDecrypt(encrypted, order, { irregular: true }))
      .toBe('WEAREDISCOVEREDFLEEATONCE');
  });

  it('decrypts padded ciphertext through the remainder logic', () => {
    // A full rectangle has remainder 0 — the irregular decode matches.
    const order = columnOrder('GERMAN');
    const encrypted = columnarEncrypt('ATTACKATDAWN', order);
    expect(columnarDecrypt(encrypted, order, { irregular: true }))
      .toBe(columnarDecrypt(encrypted, order));
  });
});

describe('doubleColumnar', () => {
  it('round-trips', () => {
    const order1 = columnOrder('KRIEGS');
    const order2 = columnOrder('MARINE');
    // 24 letters = 4 full rows of 6 → no padding needed.
    const text = 'WEAREDISCOVEREDFLEEATONC';
    const encrypted = doubleColumnarEncrypt(text, order1, order2);
    expect(doubleColumnarDecrypt(encrypted, order1, order2)).toBe(text);
  });

  it('differs from a single transposition', () => {
    const order1 = columnOrder('KRIEGS');
    const order2 = columnOrder('MARINE');
    expect(doubleColumnarEncrypt('ATTACKATDAWN', order1, order2))
      .not.toBe(columnarEncrypt('ATTACKATDAWN', order1));
  });
});
