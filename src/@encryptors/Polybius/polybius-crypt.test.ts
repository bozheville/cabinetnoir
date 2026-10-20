import { describe, expect, it } from 'vitest';

import {
  polybiusEncrypt,
  polybiusDecrypt,
  resolveSquare,
  polybiusHighlightLetter,
  POLYBIUS_PLAIN_SQUARE,
} from './polybius-crypt';

describe('polybiusEncrypt', () => {
  it('encrypts into digit pairs with the plain square', () => {
    expect(polybiusEncrypt({ input: 'A', keyword: '' })).toBe('11');
    expect(polybiusEncrypt({ input: 'Z', keyword: '' })).toBe('55');
    expect(polybiusEncrypt({ input: 'HELLO', keyword: '' })).toBe('23 15 31 31 34');
  });

  it('folds J into I', () => {
    expect(polybiusEncrypt({ input: 'JUMP', keyword: '' }))
      .toBe(polybiusEncrypt({ input: 'IUMP', keyword: '' }));
    expect(polybiusEncrypt({ input: 'J', keyword: '' })).toBe('24');
  });

  it('round-trips', () => {
    const text = 'The quick brown fox jumps over the lazy dog';
    expect(polybiusDecrypt({ input: polybiusEncrypt({ input: text, keyword: '' }), keyword: '' }))
      .toBe('THEQUICKBROWNFOXIUMPSOVERTHELAZYDOG');
  });

  it('supports a keyed square', () => {
    const square = resolveSquare({ keyword: 'SECRET' });
    expect(polybiusEncrypt({ input: 'A', keyword: 'SECRET' })).toBe(
      `${Math.floor(square.indexOf('A') / 5) + 1}${(square.indexOf('A') % 5) + 1}`,
    );
    expect(polybiusDecrypt({
      input: polybiusEncrypt({ input: 'HELLO', keyword: 'SECRET' }),
      keyword: 'SECRET',
    })).toBe('HELLO');
  });

  it('supports a continuous digit stream', () => {
    expect(polybiusEncrypt({ input: 'HELLO', keyword: '', spaced: false })).toBe('2315313134');
    expect(polybiusDecrypt({ input: '2315313134', keyword: '' })).toBe('HELLO');
  });

  it('accepts a full square from the cracker hand-off', () => {
    const square = 'QWERTASDFGZXCVBNYUIOPHJKL'; // 25 letters
    expect(polybiusEncrypt({ input: 'A', square })).toBe('21');
    expect(polybiusDecrypt({ input: '11', square })).toBe('Q');
  });

  it('ignores punctuation and case', () => {
    expect(polybiusEncrypt({ input: 'h-e,l.lO!', keyword: '' }))
      .toBe(polybiusEncrypt({ input: 'HELLO', keyword: '' }));
  });
});

describe('polybiusDecrypt', () => {
  it('tolerates noise between the digits', () => {
    expect(polybiusDecrypt({ input: '23 / 15-31…31 34', keyword: '' })).toBe('HELLO');
  });

  it('drops an incomplete trailing pair', () => {
    expect(polybiusDecrypt({ input: '231531313', keyword: '' })).toBe('HELL');
  });
});

describe('polybiusHighlightLetter', () => {
  it('follows the last plaintext letter when encrypting', () => {
    expect(polybiusHighlightLetter('HELLO', false)).toBe('O');
    expect(polybiusHighlightLetter('H', false)).toBe('H');
  });

  it('follows the last complete pair when decrypting', () => {
    expect(polybiusHighlightLetter('23 15', true)).toBe('E');
    expect(polybiusHighlightLetter('2315', true)).toBe('E');
    expect(polybiusHighlightLetter('', true)).toBe('');
  });
});

describe('POLYBIUS_PLAIN_SQUARE', () => {
  it('is the classic I/J-merged square', () => {
    expect(POLYBIUS_PLAIN_SQUARE).toBe('ABCDEFGHIKLMNOPQRSTUVWXYZ');
  });
});
