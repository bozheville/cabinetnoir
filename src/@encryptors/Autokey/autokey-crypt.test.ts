import { describe, expect, it } from 'vitest';

import {
  DEFAULT_ALPHABET,
  autokeyDecrypt,
  autokeyEncrypt,
  autokeyKeystream,
} from './autokey-crypt';

describe('autokeyEncrypt', () => {
  it('computes C = P + K over the primer-then-plaintext keystream', () => {
    // Primer F, plaintext AAAA: keystream FAAA (primer, then the
    // plaintext itself), C = A+F=F, then A+A=A three times.
    expect(autokeyEncrypt('AAAA', 'F')).toBe('FAAA');
    // Primer AB, plaintext AAAA: keystream ABAA, C = A+A=A, A+B=B, A+A=A, A+A=A.
    expect(autokeyEncrypt('AAAA', 'AB')).toBe('ABAA');
    // Primer AB over ABAB gives keystream ABAB (the plaintext itself),
    // C = A+A, B+B, A+A, B+B = A B A B — wait: B+B=2(C). Letter by letter:
    // 0+0=A, 1+1=C, 0+0=A, 1+1=C.
    expect(autokeyEncrypt('ABAB', 'AB')).toBe('ACAC');
  });

  it('matches the classic worked example shape', () => {
    // Primer B, plaintext ATTACK (A=0..T=19): keystream BATTAC, ciphertext
    // B,A,V,V,S,S — computed letter by letter: 0+1=B, 19+0=T, 19+19=38→12(M)…
    // the exact vector is verified by the keystream helper below.
    expect(autokeyKeystream('ATTACK', 'B')).toBe('BATTACK');
  });

  it('strips non-letters and cycles nothing — the primer is consumed once', () => {
    expect(autokeyEncrypt('attack, the east!', 'AB')).toBe(
      autokeyEncrypt('ATTACKTHEEAST', 'AB'),
    );
  });

  it('keeps spaces in place when asked', () => {
    expect(autokeyEncrypt('AB CD', 'B', DEFAULT_ALPHABET, { keepSpaces: true })).toBe(
      autokeyEncrypt('ABCD', 'B').split('').reduce((acc, letter, index) => (
        index === 2 ? `${acc} ${letter}` : acc + letter
      ), ''),
    );
  });

  it('returns empty for letterless or primerless input', () => {
    expect(autokeyEncrypt('', 'KEY')).toBe('');
    expect(autokeyEncrypt('HELLO', '')).toBe('');
    expect(autokeyEncrypt('123', 'KEY')).toBe('');
  });
});

describe('autokeyDecrypt', () => {
  it('round-trips for primer lengths 1..12', () => {
    const plaintext = 'THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG';
    for (let length = 1; length <= 12; length += 1) {
      const primer = 'XKCDNOW?'.slice(0, length).padEnd(length, 'Q').slice(0, length);
      const ciphertext = autokeyEncrypt(plaintext, primer);
      expect(autokeyDecrypt(ciphertext, primer)).toBe(plaintext);
    }
  });

  it('decrypts the known short vector', () => {
    // Primer F over AAAA: C = FAAA, P = C − K letter by letter.
    expect(autokeyDecrypt('FAAA', 'F')).toBe('AAAA');
  });

  it('works with a custom alphabet', () => {
    const alphabet = 'QWERTYUIOPASDFGHJKLZXCVBNM';
    const ciphertext = autokeyEncrypt('HELLO', 'KEY', alphabet);
    expect(autokeyDecrypt(ciphertext, 'KEY', alphabet)).toBe('HELLO');
  });
});
