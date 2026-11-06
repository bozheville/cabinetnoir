import { describe, expect, it } from 'vitest';

import { getChallenge } from './challenges';
import { ALPHABET_FIT_THRESHOLD, alphabetFit } from '@encryptors/shared/analysis';
import { STANDARD_ALPHABET } from '@encryptors/shared/analysis/frequency';
import { VIGENERE_TRANSFORM } from '@encryptors/shared/analysis/sliceTransform';
import { keywordAlphabet } from '@encryptors/Keyword/keyword-crypt';
import { vigenereDecrypt } from '@encryptors/Vigenere/vigenere-encryption';

describe('vigenere-mixed-demo', () => {
  const challenge = getChallenge('vigenere-mixed-demo')!;

  it('decrypts with key CAT over the KRYPTOS alphabet', () => {
    expect(vigenereDecrypt(challenge.ciphertext, 'CAT', keywordAlphabet('KRYPTOS'))).toBe(challenge.answer);
  });

  it('is flagged as mixed by the alphabet check', () => {
    const fit = alphabetFit(challenge.ciphertext, 3, STANDARD_ALPHABET, VIGENERE_TRANSFORM.mapIndex);
    expect(fit!).toBeGreaterThan(ALPHABET_FIT_THRESHOLD);
  });
});
