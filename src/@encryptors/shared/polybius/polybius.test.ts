import { describe, expect, it } from 'vitest';

import {
  buildSquare,
  squareAlphabet,
  squareLabels,
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
