import { describe, expect, it } from 'vitest';

import {
  buildSquare,
  squareAlphabet,
  squareLabels,
  squareCoordinates,
  foldForSquare,
  toCoordinates,
  fromCoordinates,
} from './polybius';

describe('buildSquare', () => {
  it('gives the plain square for an empty key (IJ merged)', () => {
    expect(buildSquare('', { size: 5 })).toBe('ABCDEFGHIKLMNOPQRSTUVWXYZ');
  });

  it('builds the keyed square: keyword first, deduplicated', () => {
    expect(buildSquare('SECRET', { size: 5 })).toBe('SECRTABDFGHIKLMNOPQUVWXYZ');
  });

  it('folds J into I (IJ merge)', () => {
    expect(buildSquare('JUNGLE', { size: 5, merge: 'IJ' }))
      .toBe(buildSquare('IUNGLE', { size: 5, merge: 'IJ' }));
  });

  it('folds K into C (CK merge)', () => {
    // The CK alphabet keeps J (only K is dropped).
    expect(buildSquare('CK', { size: 5, merge: 'CK' })).toBe('CABDEFGHIJLMNOPQRSTUVWXYZ');
    expect(squareAlphabet(5, 'CK')).toBe('ABCDEFGHIJLMNOPQRSTUVWXYZ');
  });

  it('builds a 6x6 square with letters and digits, no merge', () => {
    expect(buildSquare('', { size: 6 })).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
    expect(buildSquare('SECRET7', { size: 6 })).toBe(
      'SECRT7ABDFGHIJKLMNOPQUVWXYZ012345689',
    );
  });

  it('ignores characters outside the alphabet', () => {
    expect(buildSquare('S3CRET!', { size: 5 })).toBe(buildSquare('SCRET', { size: 5 }));
  });
});

describe('coordinates', () => {
  const SQUARE = buildSquare('SECRET', { size: 5 });

  it('lists every coordinate pair in reading order', () => {
    const pairs = squareCoordinates(5);
    expect(pairs).toHaveLength(25);
    expect(pairs[0]).toBe('11');
    expect(pairs[1]).toBe('12');
    expect(pairs[5]).toBe('21');
    expect(pairs[24]).toBe('55');
    // Round-trip: the plain square fills in coordinate order.
    const square = buildSquare('', { size: 5 });
    expect(pairs.map((pair) => fromCoordinates(pair, square)).join(''))
      .toBe(squareAlphabet(5));
  });

  it('gives 36 pairs for a 6x6 square', () => {
    const pairs = squareCoordinates(6);
    expect(pairs).toHaveLength(36);
    expect(pairs[35]).toBe('66');
  });

  it('round-trips letters through digit coordinates', () => {
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    for (const letter of alphabet) {
      const pair = toCoordinates(letter, SQUARE);
      expect(pair).toMatch(/^[1-5][1-5]$/);
      expect(fromCoordinates(pair, SQUARE)).toBe(letter);
    }
  });

  it('maps to 1-based digit labels by default', () => {
    // A sits at row 1, column 1 of the plain square.
    expect(toCoordinates('A', buildSquare('', { size: 5 }))).toBe('11');
    // Z sits at row 5, column 5.
    expect(toCoordinates('Z', buildSquare('', { size: 5 }))).toBe('55');
  });

  it('uses custom labels (ADFGVX letters)', () => {
    const labels = 'ADFGX';
    expect(toCoordinates('A', buildSquare('', { size: 5 }), labels)).toBe('AA');
    expect(fromCoordinates('XX', buildSquare('', { size: 5 }), labels)).toBe('Z');
  });

  it('leaves the merged partner without a cell of its own', () => {
    // J shares I's cell on an IJ square: it has no coordinates of its
    // own, and no coordinate pair decodes to J.
    expect(toCoordinates('J', SQUARE)).toBe('');
    expect(fromCoordinates('00', SQUARE)).toBe('');
    expect(toCoordinates('1', SQUARE)).toBe('');
  });
});

describe('foldForSquare', () => {
  it('folds the merge partners for reading back', () => {
    expect(foldForSquare('J')).toBe('I');
    expect(foldForSquare('K', 'CK')).toBe('C');
    expect(foldForSquare('M', 'CK')).toBe('M');
  });
});

describe('squareLabels', () => {
  it('gives 1-based digit labels per size', () => {
    expect(squareLabels(5)).toBe('12345');
    expect(squareLabels(6)).toBe('123456');
  });
});

describe('custom alphabets', () => {
  it('builds a square from any alphabet passed in', () => {
    // A Greek 24-letter alphabet on a 5x5 square: the last cell stays
    // unused, the square string is one letter short.
    const greek = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ';
    expect(buildSquare('', { size: 5, alphabet: greek }))
      .toBe(greek);
    expect(buildSquare('ΚΡΥΠΤΟ', { size: 5, alphabet: greek }).startsWith('ΚΡΥΠΤ')).toBe(true);
  });

  it('applies the merge to a custom alphabet', () => {
    // A preset merge folds only when the alphabet overflows the grid.
    expect(squareAlphabet(5, 'IJ', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'))
      .toBe('ABCDEFGHIKLMNOPQRSTUVWXYZ');
    // An explicit rule always folds, even when everything fits.
    expect(squareAlphabet(5, { fold: 'Θ', into: 'Φ' }, 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'))
      .toBe('ΑΒΓΔΕΖΗΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ');
  });

  it('folds key letters the custom alphabet has no cell for', () => {
    const rule = { fold: 'Θ', into: 'Φ' };
    expect(buildSquare('ΘΦ', { size: 5, alphabet: 'ΑΒΓΔΕΖΗΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ', merge: rule }))
      .toBe(buildSquare('ΦΦ', { size: 5, alphabet: 'ΑΒΓΔΕΖΗΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ', merge: rule }));
  });

  it('keeps J on a 6x6 square (it has a cell there)', () => {
    expect(buildSquare('J', { size: 6 })[0]).toBe('J');
  });

  it('round-trips a custom alphabet through coordinates', () => {
    const square = buildSquare('', { size: 5, alphabet: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ' });
    for (const letter of square) {
      const pair = toCoordinates(letter, square);
      expect(pair).toMatch(/^[1-5][1-5]$/);
      expect(fromCoordinates(pair, square)).toBe(letter);
    }
  });
});
