import { NormalizedText, SliceTransform, VIGENERE_TRANSFORM } from '@encryptors/shared/analysis';
import { LockedLetter } from './useCracker';

const STANDARD_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// The decryption preview as a flat letter stream: letters of slices with a
// key letter show their plaintext letter, the rest become '_'. Non-letters
// (spaces, punctuation, line breaks) are dropped, so the stream can be
// laid out in rows of exactly keyLength letters with columns matching
// the slices. `transform` swaps the slice arithmetic for the Beaufort
// family (Vigenère default keeps the original behaviour).
export const decryptPartial = (
  input: string,
  normalized: NormalizedText,
  keyLength: number,
  lockedLetters: Record<number, LockedLetter>,
  alphabet: string = STANDARD_ALPHABET,
  transform: SliceTransform = VIGENERE_TRANSFORM,
): string =>
  normalized.letters.split('').map((cipherLetter, cleanIndex) => {
    const locked = lockedLetters[cleanIndex % keyLength];
    if (!locked) {
      return '_';
    }

    const cipher = alphabet.indexOf(cipherLetter);
    const key = alphabet.indexOf(locked.letter);
    if (cipher < 0 || key < 0) {
      return '_';
    }
    return alphabet[transform.decryptIndex(cipher, key)];
  }).join('');
