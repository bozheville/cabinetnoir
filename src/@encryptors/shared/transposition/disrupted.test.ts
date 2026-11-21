// Tests for the VIC disrupted ("diagonal") transposition. The golden
// vector was derived by hand from Kahn's description: the D area starts
// under keynumber 1, steps right each row, skips a row when exhausted
// and restarts under the next keynumber; non-D cells fill first, then
// the D areas top-down; read-out follows the keynumber order.
import { describe, expect, it } from 'vitest';

import { disruptedColumnarDecrypt, disruptedColumnarEncrypt, disruptionMask } from './disrupted';

// Key digits 31452 → keynumbers per physical column: 3,1,4,5,2 →
// read order: column 1 (key 1) first, then 4, 0, 2, 3.
const ORDER = [1, 4, 0, 2, 3];
// 40 digits, i % 10.
const DIGITS = Array.from({ length: 40 }, (_, i) => String(i % 10)).join('');

describe('disruptionMask', () => {
  it('draws Kahn’s staircase of triangular areas', () => {
    const mask = disruptionMask(5, ORDER, 8);
    // Row 0: D under keynumber 1 (column 1) to the right edge.
    expect(mask[0]).toEqual([false, true, true, true, true]);
    // Each following row starts one column further right…
    expect(mask[1]).toEqual([false, false, true, true, true]);
    expect(mask[2]).toEqual([false, false, false, true, true]);
    expect(mask[3]).toEqual([false, false, false, false, true]);
    // …columns exhausted: one row skipped…
    expect(mask[4]).toEqual([false, false, false, false, false]);
    // …and the next D area starts in the following row under
    // keynumber 2 (physical column 4).
    expect(mask[5]).toEqual([false, false, false, false, true]);
    expect(mask[6]).toEqual([false, false, false, false, false]);
    // Keynumber 3 → physical column 0: whole-row D.
    expect(mask[7]).toEqual([true, true, true, true, true]);
  });
});

describe('disruptedColumnarEncrypt', () => {
  it('matches the hand-derived golden vector', () => {
    // Fill order (non-D rows 0–3, 4, 5, 6, then D areas top-down):
    // d0 | d1 d2 | d3 d4 d5 | d6..d9 | d10..d14 | d15..d18 | d19..d23
    // then D: row0 d24–d27, row1 d28–d30, row2 d31 d32, row3 d33,
    // row5 d34, row7 d35–d39.
    // Read columns in key order 1, 4, 0, 2, 3, top to bottom.
    expect(disruptedColumnarEncrypt(DIGITS, ORDER))
      .toBe('4247160670234439013605955858271769193828');
  });

  it('round-trips through the decrypt inverse', () => {
    const out = disruptedColumnarEncrypt(DIGITS, ORDER);
    expect(disruptedColumnarDecrypt(out, ORDER)).toBe(DIGITS);

    const short = DIGITS.slice(0, 23); // incomplete last row
    const shortOut = disruptedColumnarEncrypt(short, ORDER);
    expect(disruptedColumnarDecrypt(shortOut, ORDER)).toBe(short);
  });

  it('handles text longer than one triangle cycle', () => {
    const long = Array.from({ length: 120 }, (_, i) => String(i % 10)).join('');
    const out = disruptedColumnarEncrypt(long, ORDER);
    expect(out).toHaveLength(120);
    expect(disruptedColumnarDecrypt(out, ORDER)).toBe(long);
  });

  it('passes through degenerate keys', () => {
    expect(disruptedColumnarEncrypt('12345', [])).toBe('12345');
    expect(disruptedColumnarEncrypt('', ORDER)).toBe('');
  });
});
