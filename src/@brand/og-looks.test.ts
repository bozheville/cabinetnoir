// Coverage, uniqueness and contrast for the per-card Open Graph looks in
// src/@brand/og-looks.js. Every live cipher and every category (plus the
// hub) must have one look, no two cards may share the same tone + ornament +
// frame triple, and the text must stay readable on every tone.

import { describe, expect, it } from 'vitest';

import { encodingsList, encryptorsList } from '@encryptors/algorithms';
import { CIPHER_CATEGORIES, getAllCategoryPaths } from '@learning/categories';

import { FRAMES, LOOKS, ORNAMENTS, TONES, textContrast } from './og-looks';

const algorithms = [...encodingsList, ...encryptorsList];
const categories = [null, ...getAllCategoryPaths().map((segments) => segments[segments.length - 1])];
const expectedIds = new Set([...algorithms, ...categories.map((id) => (id === null ? 'hub' : id))]);

describe('og looks', () => {
  it('covers every algorithm and category, and nothing else', () => {
    expect(new Set(Object.keys(LOOKS))).toEqual(expectedIds);
  });

  it('every look references a real tone, ornament and frame', () => {
    for (const [id, look] of Object.entries(LOOKS)) {
      expect(TONES, `tone of "${id}"`).toHaveProperty(look.tone);
      expect(ORNAMENTS, `ornament of "${id}"`).toHaveProperty(look.ornament);
      expect(FRAMES, `frame of "${id}"`).toHaveProperty(look.frame);
    }
  });

  it('no two cards share the same tone + ornament + frame triple', () => {
    const seen = new Map<string, string>();
    for (const [id, look] of Object.entries(LOOKS)) {
      const key = `${look.tone}|${look.ornament}|${look.frame}`;
      expect(seen.has(key), `"${id}" repeats the look of "${seen.get(key)}"`).toBe(false);
      seen.set(key, id);
    }
  });

  it('every tone keeps body text at 4.5:1 and titles at 3:1', () => {
    for (const [id, look] of Object.entries(LOOKS)) {
      const { title, body } = textContrast(look.tone);
      expect(body, `body contrast on "${id}" (${look.tone})`).toBeGreaterThanOrEqual(4.5);
      expect(title, `title contrast on "${id}" (${look.tone})`).toBeGreaterThanOrEqual(3);
    }
  });

  it('ciphers share the tone of their primary category', () => {
    for (const [cipher, [primary]] of Object.entries(CIPHER_CATEGORIES)) {
      expect(LOOKS[cipher].tone, `"${cipher}" should wear its family tone`).toBe(LOOKS[primary].tone);
    }
  });
});
