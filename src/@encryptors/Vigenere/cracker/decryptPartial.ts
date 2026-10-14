import { NormalizedText } from '../analysis/normalize';
import { LockedLetter } from './useCracker';

const STANDARD_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Decrypts letters whose slice already has a locked key letter; letters
// from unlocked slices become '_'. Non-letters (spaces, punctuation) pass
// through, so the preview keeps the shape of the original input.
export const decryptPartial = (
  input: string,
  normalized: NormalizedText,
  keyLength: number,
  lockedLetters: Record<number, LockedLetter>,
  alphabet: string = STANDARD_ALPHABET,
): string => {
  const result = input.split('');

  normalized.originalIndices.forEach((originalIndex, cleanIndex) => {
    const locked = lockedLetters[cleanIndex % keyLength];
    if (!locked) {
      result[originalIndex] = '_';
      return;
    }

    const cipher = alphabet.indexOf(normalized.letters[cleanIndex]);
    const key = alphabet.indexOf(locked.letter);
    if (cipher < 0 || key < 0) {
      result[originalIndex] = '_';
      return;
    }
    result[originalIndex] = alphabet[(cipher - key + alphabet.length) % alphabet.length];
  });

  return result.join('');
};
