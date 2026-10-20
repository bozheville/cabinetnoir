// Accuracy suite for the identification engine (spec: cipher-
// identification.md, target for texts >= 200 letters: correct family
// top-1 >= 95%, correct cipher in the top 3 >= 90%).
//
// The corpus: one public-domain English source, cut to 50/100/200/500
// letters, encrypted with every in-app engine (fixed keys) and with the
// test-only reference implementations of the roadmap ciphers.
import { describe, expect, it } from 'vitest';

import { identify } from './identify';
import type { IdentificationResult } from './types';
import { STANDARD_ALPHABET } from '@encryptors/shared/analysis/frequency';
import { monoalphabeticEncrypt } from '@encryptors/Monoalphabetic/monoalphabetic-crypt';
import { vigenereEncrypt } from '@encryptors/Vigenere/vigenere-encryption';
import { playfairEncrypt } from '@encryptors/Playfair/playfair-encryption';
import { adfgvxEncrypt } from '@encryptors/Adfgvx/adfgvx-encryption';
import { albertiEncrypt, ALBERTI_STATIC_DISC, ALBERTI_DYNAMIC_DISC } from '@encryptors/Alberti/alberti-crypt';
import EnigmaPkg from 'enigma';
import { railFenceEncrypt } from '@encryptors/shared/transposition';
import { columnarEncrypt } from '@encryptors/shared/transposition';
import { keywordEncrypt } from '@encryptors/Keyword/keyword-crypt';
import {
  homophonicEncrypt,
  nihilistEncrypt,
} from './__fixtures__/reference';

const SOURCE =
  'It was the best of times, it was the worst of times, it was the age of '
  + 'wisdom, it was the age of foolishness, it was the epoch of belief, it '
  + 'was the epoch of incredulity, it was the season of light, it was the '
  + 'season of darkness, it was the spring of hope, it was the winter of '
  + 'despair, we had everything before us, we had nothing before us, we '
  + 'were all going direct to heaven, we were all going direct the other '
  + 'way. In short, the period was so far like the present period. '
  + 'There were a king with a large jaw and a queen with a plain face, on '
  + 'the throne of England; there were a king with a large jaw and a queen '
  + 'with a fair face, on the throne of France. In both countries it was '
  + 'clearer than crystal that things in general were settled for ever. '
  + 'France, less favoured on the whole as to matters of material '
  + 'prosperity than England, rolled with elaborately ironed hair. '
  + 'Crush humanity out of shape once more, under similar hammers. '
  + 'The woodman proposed to make an offering to the forest. '
  + 'The farmer raised the night-cap to the last. ';

const lettersOnly = (text: string): string => text.toUpperCase().replace(/[^A-Z]/g, '');
const sliceOf = (length: number): string => lettersOnly(SOURCE.repeat(3)).slice(0, length);

const caesarAlphabet = (shift: number): string =>
  STANDARD_ALPHABET.split('').map((_, index) => STANDARD_ALPHABET[(index + shift) % 26]).join('');
const affineAlphabet = (a: number, b: number): string =>
  STANDARD_ALPHABET.split('').map((_, index) => STANDARD_ALPHABET[(a * index + b) % 26]).join('');
const atbashAlphabet = STANDARD_ALPHABET.split('').reverse().join('');

const enigmaRotors = [
  new EnigmaPkg.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ', 'Q'),
  new EnigmaPkg.Rotor('AJDKSIRUXBLHWTMCQGZNPYFVOE', 'E'),
  new EnigmaPkg.Rotor('BDFHJLCPRTXVZNYEIWGAKMUSQO', 'V'),
];
const enigma = new EnigmaPkg.Enigma(
  enigmaRotors,
  new EnigmaPkg.Reflector('YRUHQSLDPXNGOKMIEBFZCWVJAT'),
  new EnigmaPkg.Plugboard(''),
  new EnigmaPkg.EntryWheel('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
);
enigma.setPositions('ABC');

// cipher id → encryptor of a letters-only string.
const ENCRYPTORS: Record<string, (text: string) => string> = {
  caesar: (text) => monoalphabeticEncrypt({ input: text, alphabet: STANDARD_ALPHABET, targetAlphabet: caesarAlphabet(7) }),
  rot13: (text) => monoalphabeticEncrypt({ input: text, alphabet: STANDARD_ALPHABET, targetAlphabet: caesarAlphabet(13) }),
  atbash: (text) => monoalphabeticEncrypt({ input: text, alphabet: STANDARD_ALPHABET, targetAlphabet: atbashAlphabet }),
  affine: (text) => monoalphabeticEncrypt({ input: text, alphabet: STANDARD_ALPHABET, targetAlphabet: affineAlphabet(5, 8) }),
  keyword: (text) => keywordEncrypt({ input: text, keyword: 'KRYPTOS', keepSpaces: false }),
  homophonic: (text) => homophonicEncrypt(text),
  vigenere: (text) => vigenereEncrypt(text, 'LEMON'),
  alberti: (text) => albertiEncrypt({
    input: text,
    isDecryptMode: false,
    staticDisc: ALBERTI_STATIC_DISC,
    dynamicDisc: ALBERTI_DYNAMIC_DISC,
    iterationStep: 3,
    period: 5,
  }),
  enigma: (text) => enigma.string(text),
  railFence: (text) => railFenceEncrypt(text, 4),
  columnar: (text) => columnarEncrypt(text, [3, 1, 4, 0, 2]),
  playfair: (text) => playfairEncrypt(text, 'MONARCHY'),
  adfgvx: (text) => adfgvxEncrypt(text, 'SECRET', 'CARGO'),
  nihilist: (text) => nihilistEncrypt(text, 'RUSSIA'),
};

const LENGTHS = [50, 100, 200, 500];
const CIPHER_IDS = Object.keys(ENCRYPTORS);

const rankOf = (result: IdentificationResult, id: string): number => {
  const family = result.families.find((entry) => entry.ciphers.some((cipher) => cipher.id === id));
  if (!family) {
    return 99;
  }
  return family.ciphers.findIndex((cipher) => cipher.id === id) + 1;
};
const familyRankOf = (result: IdentificationResult, id: string): number => {
  const family = result.families.find((entry) => entry.ciphers.some((cipher) => cipher.id === id));
  return family ? result.families.indexOf(family) + 1 : 99;
};

describe('identification accuracy', () => {
  it.each(LENGTHS)('meets the accuracy target at %i letters', (length) => {
    const rows: string[] = [];
    let familyTop1 = 0;
    let cipherTop3 = 0;

    for (const id of CIPHER_IDS) {
      // Saknussemm has no statistical rule; it is covered by the
      // fingerprint tests, not by the corpus.
      if (id === 'saknussemm') {
        continue;
      }
      const ciphertext = ENCRYPTORS[id](sliceOf(length));
      const result = identify(ciphertext);
      const familyRank = familyRankOf(result, id);
      const cipherRank = rankOf(result, id);
      const familyOk = familyRank <= 1 ? 1 : 0;
      const cipherOk = cipherRank <= 3 ? 1 : 0;
      familyTop1 += familyOk;
      cipherTop3 += cipherOk;
      rows.push(`${id}: family#${familyRank} cipher#${cipherRank}`);
    }

    const total = CIPHER_IDS.length; // saknussemm is not in the encryptor map
    const familyRate = familyTop1 / total;
    const cipherRate = cipherTop3 / total;

    // eslint-disable-next-line no-console
    console.log(`--- ${length} letters: family top-1 ${Math.round(familyRate * 100)}%, cipher top-3 ${Math.round(cipherRate * 100)}%\n${rows.join('\n')}`);

    if (length >= 200) {
      expect(familyRate).toBeGreaterThanOrEqual(0.95);
      expect(cipherRate).toBeGreaterThanOrEqual(0.9);
    }
  });
});
