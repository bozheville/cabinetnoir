import { describe, expect, it } from 'vitest';
import { encodingsList, encryptorsList } from '../@encryptors/algorithms';

import {
  CATEGORIES,
  CIPHER_CATEGORIES,
  COMING_SOON,
  MAX_DEPTH,
  categoryFromSegments,
  getAllCategoryPaths,
  getAncestry,
  getCipherCategories,
  getMembers,
  getPrimaryCategory,
  isIndexable,
  isMemberOf,
} from './categories';
import { primaryTrail } from '@hooks/useCipherTrail';

const CIPHERS: string[] = [...encodingsList, ...encryptorsList];

const asRecord = (value: unknown): Record<string, unknown> =>
  (value ?? {}) as Record<string, unknown>;

describe('categories data model', () => {
  it('every live cipher has at least one category and every key is real', () => {
    for (const cipher of CIPHERS) {
      expect(getCipherCategories(cipher)).not.toBeNull();
    }
    for (const cipher of Object.keys(CIPHER_CATEGORIES)) {
      expect(CIPHERS).toContain(cipher);
    }
  });

  it('no cipher is live and coming soon at once', () => {
    for (const cipher of Object.keys(CIPHER_CATEGORIES)) {
      expect(COMING_SOON).not.toHaveProperty(cipher);
    }
  });

  it('every referenced category id exists, and parents exist', () => {
    for (const id of Object.keys(CATEGORIES)) {
      const { parent } = CATEGORIES[id];
      if (parent !== null) expect(CATEGORIES).toHaveProperty(parent);
    }
    for (const cats of Object.values(CIPHER_CATEGORIES)) {
      for (const id of cats) expect(CATEGORIES).toHaveProperty(id);
    }
    for (const cats of Object.values(COMING_SOON)) {
      for (const id of cats) expect(CATEGORIES).toHaveProperty(id);
    }
  });

  it('has no cycles and depth is within MAX_DEPTH', () => {
    expect(getAncestry('tabula-recta')).toEqual([
      'substitution',
      'polyalphabetic',
      'tabula-recta',
    ]);
    expect(getAncestry('shift')).toHaveLength(3);
    for (const id of Object.keys(CATEGORIES)) {
      expect(getAncestry(id).length).toBeLessThanOrEqual(MAX_DEPTH);
    }
  });

  it('ids are unique and lowercase slugs', () => {
    const ids = [
      ...Object.keys(CATEGORIES),
    ];
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z][a-z0-9-]*$/);
    const cipherIds = [
      ...Object.keys(CIPHER_CATEGORIES),
      ...Object.keys(COMING_SOON),
    ];
    for (const id of cipherIds) expect(id).toMatch(/^[a-zA-Z][a-zA-Z0-9-]*$/);
  });

  it("a cipher's categories never contain both a category and its ancestor", () => {
    for (const [cipher, cats] of Object.entries(CIPHER_CATEGORIES)) {
      for (const cat of cats) {
        for (const other of cats) {
          if (cat === other) continue;
          expect(getAncestry(cat)).not.toContain(other);
        }
      }
    }
  });

  it('categoryFromSegments accepts real chains and rejects bad ones', () => {
    expect(categoryFromSegments(['substitution'])).toBe('substitution');
    expect(categoryFromSegments(['substitution', 'polyalphabetic', 'tabula-recta'])).toBe('tabula-recta');
    // Skipped levels, wrong order, unknown ids.
    expect(categoryFromSegments(['shift'])).toBeNull();
    expect(categoryFromSegments(['transposition', 'shift'])).toBeNull();
    expect(categoryFromSegments(['substitution', 'nonsense'])).toBeNull();
    expect(categoryFromSegments([])).toBeNull();
    expect(categoryFromSegments('substitution' as unknown as string[])).toBeNull();
  });

  it('getAllCategoryPaths covers every category once', () => {
    expect(getAllCategoryPaths()).toHaveLength(Object.keys(CATEGORIES).length);
    for (const segments of getAllCategoryPaths()) {
      expect(categoryFromSegments(segments)).toBe(segments[segments.length - 1]);
    }
  });

  it('getMembers includes descendants, deduplicates and orders correctly', () => {
    const { live, comingSoon } = getMembers('substitution', { includeDescendants: true });
    // Direct: pigpen, keyword, playfair, homophonic (soon). Descendants: the rest.
    expect(live).toContain('pigpen');
    expect(live).toContain('vigenere'); // through polyalphabetic > tabula-recta
    expect(live).toContain('nihilist'); // secondary member, via polybius-square
    expect(live.indexOf('caesar')).toBeLessThan(live.indexOf('playfair'));
    expect(live.indexOf('playfair')).toBeLessThan(live.indexOf('beaufort'));
    // Off-ladder ciphers appear even though they are not in CIPHER_LADDER.
    // Off-ladder ciphers appear via their own family, not on others' pages.
    expect(getMembers('transposition', { includeDescendants: true }).live).toContain('saknussemm');
    expect(getMembers('codes-and-encodings', { includeDescendants: true }).live).toContain('base64');
    expect(live).not.toContain('saknussemm'); // transposition, not substitution
    expect(live).not.toContain('base64'); // codes-and-encodings, not substitution
    // A cipher is listed once even when it belongs to two subcategories.
    expect(live.filter((cipher) => cipher === 'adfgvx')).toHaveLength(1);
    // Off-ladder ciphers appear via their own family, not on others' pages.
    expect(getMembers('transposition', { includeDescendants: true }).live).toContain('saknussemm');
    expect(getMembers('codes-and-encodings', { includeDescendants: true }).live).toContain('base64');
    expect(live).not.toContain('saknussemm'); // transposition, not substitution
    expect(live).not.toContain('base64'); // codes-and-encodings, not substitution
    expect(comingSoon).toContain('homophonic');
    expect(comingSoon).not.toContain('baconian'); // codes family, not substitution
  });

  it('isMemberOf checks direct and descendant membership', () => {
    expect(isMemberOf('vigenere', 'substitution')).toBe(true); // descendant of substitution
    expect(isMemberOf('vigenere', 'tabula-recta')).toBe(true); // direct
    expect(isMemberOf('vigenere', 'polybius-square')).toBe(false);
  expect(isMemberOf('nihilist', 'product')).toBe(true); // direct
  expect(isMemberOf('nihilist', 'polybius-square')).toBe(true); // secondary, direct in its own right
  expect(isMemberOf('morse', 'codes-and-encodings')).toBe(true);
  expect(isMemberOf('morse', 'substitution')).toBe(false);
  });

  it('getPrimaryCategory returns the first tree', () => {
    expect(getPrimaryCategory('adfgvx')).toBe('product');
    expect(getPrimaryCategory('vigenere')).toBe('tabula-recta');
    expect(getPrimaryCategory('saknussemm')).toBe('transposition');
  });

  it('primaryTrail returns the primary tree as crumbs', () => {
    const t = (key: string) => key; // identity: labels are translation keys
    expect(primaryTrail('adfgvx', t)).toEqual([
      { label: 'categories.product.shortName', path: '/category/product' },
    ]);
    expect(primaryTrail('vigenere', t)).toEqual([
      { label: 'categories.substitution.shortName', path: '/category/substitution' },
      { label: 'categories.polyalphabetic.shortName', path: '/category/polyalphabetic' },
      { label: 'categories.tabula-recta.shortName', path: '/category/tabula-recta' },
    ]);
  });

  it('primaryTrail falls back to an empty trail outside the tree', () => {
    const t = (key: string) => key;
    expect(primaryTrail('saknussemm', t)).toEqual([
      { label: 'categories.transposition.shortName', path: '/category/transposition' },
    ]);
  });

  it('isIndexable pins polygraphic as false and the others as true', () => {
    expect(isIndexable('polygraphic')).toBe(false);
    for (const id of Object.keys(CATEGORIES)) {
      if (id === 'polygraphic') continue;
      expect(isIndexable(id)).toBe(true);
    }
  });
});
