import { describe, expect, it } from 'vitest';

import {
  columnarEncryptText,
  columnarDecryptText,
  doubleColumnarEncryptText,
  doubleColumnarDecryptText,
  normalizeTranspositionKey,
} from './columnar-crypt';

const TEXT = 'WEAREDISCOVEREDFLEEATONCE';

describe('normalizeTranspositionKey', () => {
  it('uppercases and keeps letters only', () => {
    expect(normalizeTranspositionKey('kriegs 42!')).toBe('KRIEGS');
  });
});

describe('columnarEncryptText / columnarDecryptText', () => {
  it('round-trips (padded)', () => {
    const encrypted = columnarEncryptText(TEXT, 'ZEBRAS');
    expect(columnarDecryptText(encrypted, 'ZEBRAS')).toBe(`${TEXT}XXXXX`);
  });

  it('round-trips (irregular)', () => {
    const encrypted = columnarEncryptText(TEXT, 'ZEBRAS', { irregular: true });
    expect(columnarDecryptText(encrypted, 'ZEBRAS', { irregular: true })).toBe(TEXT);
  });

  it('keeps the letter multiset (a pure transposition)', () => {
    const encrypted = columnarEncryptText(TEXT, 'KRIEGS', { irregular: true });
    expect(encrypted.split('').sort().join('')).toBe(TEXT.split('').sort().join(''));
  });

  it('differs between padded and irregular shapes', () => {
    expect(columnarEncryptText(TEXT, 'KRIEGS'))
      .not.toBe(columnarEncryptText(TEXT, 'KRIEGS', { irregular: true }));
  });

  it('leaves text unchanged without a key', () => {
    expect(columnarEncryptText(TEXT, '')).toBe(TEXT);
    expect(columnarEncryptText(TEXT, '123')).toBe(TEXT);
  });
});

describe('doubleColumnarEncryptText / doubleColumnarDecryptText', () => {
  it('round-trips', () => {
    const text = 'WEAREDISCOVEREDFLEEATONC'; // 24 letters, full rectangle
    const encrypted = doubleColumnarEncryptText(text, 'KRIEGS', 'MARINE');
    expect(doubleColumnarDecryptText(encrypted, 'KRIEGS', 'MARINE')).toBe(text);
  });

  it('differs from the single transposition', () => {
    expect(doubleColumnarEncryptText('ATTACKATDAWN', 'KRIEGS', 'MARINE'))
      .not.toBe(columnarEncryptText('ATTACKATDAWN', 'KRIEGS'));
  });
});
