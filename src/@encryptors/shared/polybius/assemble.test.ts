import { describe, expect, it } from 'vitest';

import {
  assembleSquareFromMapping,
  expandSquare,
} from './assemble';
import { buildSquare } from './polybius';

describe('assembleSquareFromMapping', () => {
  it('places mapped letters and leaves the rest as dots', () => {
    const mapping = { '11': 'S', '12': 'E', '55': 'C' };
    expect(assembleSquareFromMapping(mapping, { size: 5 }))
      .toBe('SE······················C');
  });

  it('reads pairs through custom labels', () => {
    const mapping = { AD: 'S', FG: 'E' };
    // Labels index the grid: AD = row 0, column 1 → cell 1; FG = row 2,
    // column 3 → cell 13.
    expect(assembleSquareFromMapping(mapping, { size: 5, labels: 'ADFGX' }))
      .toBe('·S···········E···········');
  });

  it('ignores empty letters and impossible pairs', () => {
    const mapping = { '11': 'S', '13': '', '99': 'X', '': 'Y' };
    expect(assembleSquareFromMapping(mapping, { size: 5 }).startsWith('S')).toBe(true);
    expect(assembleSquareFromMapping(mapping, { size: 5 })).toBe(
      assembleSquareFromMapping({ '11': 'S' }, { size: 5 }),
    );
  });

  it('auto-fills untouched cells from the remaining alphabet', () => {
    // One assignment pins one cell; every other cell takes the plain
    // square's remaining letters in order.
    const assembled = assembleSquareFromMapping({ '13': 'Q' }, { size: 5, fill: 'auto' });
    expect(assembled[2]).toBe('Q');
    expect(assembled.replace('Q', '')).toBe('ABCDEFGHIKLMNOPRSTUVWXYZ');
  });

  it('auto-fills with digits on a 6x6 square', () => {
    const assembled = assembleSquareFromMapping(
      { AA: '7' },
      { size: 6, labels: 'ADFGVX', fill: 'auto' },
    );
    expect(assembled).toHaveLength(36);
    // AA = the first cell.
    expect(assembled[0]).toBe('7');
    expect(assembled.includes('7')).toBe(true);
  });
});

describe('expandSquare', () => {
  it('re-inserts the folded letter after its partner', () => {
    const square = buildSquare('SECRET', { size: 5 });
    // I sits after the key letters, so J rides in right there.
    expect(expandSquare(square)).toBe('SECRTABDFGHIJKLMNOPQUVWXYZ');
  });

  it('works with a custom merge rule', () => {
    expect(expandSquare('ABCDE', { fold: 'K', into: 'C' })).toBe('ABCKDE');
    expect(expandSquare('ABCKDE', { fold: 'K', into: 'C' })).toBe('ABCKDE');
  });

  it('leaves a square without the partner cell alone', () => {
    expect(expandSquare('ABDEF', { fold: 'J', into: 'I' })).toBe('ABDEF');
  });
});
