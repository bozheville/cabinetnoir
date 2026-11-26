// Regression tests for the tool-side columnar double transposition
// decrypt order. The pure engine has its own suite in
// columnar-crypt.test.ts; the pre-fix hook undid the first keyword
// first, which the engine could not catch.
import { describe, expect, it } from 'vitest';

import { doubleColumnarDecryptInput } from './useColumnar';
import { doubleColumnarEncryptText } from './columnar-crypt';

describe('doubleColumnarDecryptInput (hook order)', () => {
  it('undoes the second keyword first', async () => {
    const ciphertext = doubleColumnarEncryptText('ATTACKATDAWN', 'SUN', 'LEMON', {
      irregular: true,
    });

    expect(
      doubleColumnarDecryptInput(ciphertext, 'SUN', 'LEMON', null, { irregular: true }),
    ).toBe('ATTACKATDAWN');

    // The pre-fix order (first keyword first) must not round-trip.
    const { columnarDecrypt, columnOrder, normalizeTranspositionKey } =
      await import('../shared/transposition');
    const dec = (t: string, k: string, o: { irregular: boolean }) =>
      columnarDecrypt(t, columnOrder(normalizeTranspositionKey(k)), o);
    expect(
      dec(dec(ciphertext, 'SUN', { irregular: true }), 'LEMON', { irregular: true }),
    ).not.toBe('ATTACKATDAWN');
  });

  it('works with a numeric custom order for the first key', () => {
    // 'SUN' → columns 2,0,1.
    const ciphertext = doubleColumnarEncryptText('ATTACKATDAWN', 'SUN', 'LEMON', {
      irregular: true,
    });
    expect(
      doubleColumnarDecryptInput(ciphertext, '', 'LEMON', [2, 0, 1], { irregular: true }),
    ).toBe('ATTACKATDAWN');
  });
});
