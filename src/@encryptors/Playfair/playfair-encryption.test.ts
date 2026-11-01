import { describe, expect, it } from 'vitest';

import { playfairDecrypt, playfairEncrypt } from './playfair-encryption';

describe('playfairEncrypt', () => {
  it('drops repeated keyword letters when building the square', () => {
    // PLAYFAIREXAMPLE → PLAYF / IREXM / BCDGH / KNOQS / TUVWZ.
    expect(playfairEncrypt('HIDETHEGOLD', 'PLAYFAIREXAMPLE'))
      .toBe('BM OD ZB XD NA GE');
  });

  it('round-trips with a keyword that repeats letters', () => {
    const cipher = playfairEncrypt('HIDETHEGOLD', 'PLAYFAIREXAMPLE');
    expect(playfairDecrypt(cipher, 'PLAYFAIREXAMPLE').replace(/\s/g, ''))
      .toBe('HIDETHEGOLDX');
  });
});
