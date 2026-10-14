import { NormalizedText } from '../analysis/normalize';
import { LockedLetter } from './useCracker';

const STANDARD_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// The decryption preview as a flat letter stream: letters of slices with a
// key letter show their plaintext letter, the rest become '_'. Non-letters
// (spaces, punctuation, line breaks) are dropped, so the stream can be
// laid out in rows of exactly keyLength letters with columns matching
// the slices.
export const decryptPartial = (
  input: string,
  normalized: NormalizedText,
  keyLength: number,
  lockedLetters: Record<number, LockedLetter>,
  alphabet: string = STANDARD_ALPHABET,
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
    return alphabet[(cipher - key + alphabet.length) % alphabet.length];
  }).join('');
