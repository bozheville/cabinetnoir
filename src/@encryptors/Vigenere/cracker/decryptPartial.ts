import { NormalizedText } from '../analysis/normalize';
import { LockedLetter } from './useCracker';

const ALPHABET_LENGTH = 26;

// Decrypts letters whose slice already has a locked key letter; letters
// from unlocked slices become '_'. Non-letters (spaces, punctuation) pass
// through, so the preview keeps the shape of the original input.
export const decryptPartial = (
  input: string,
  normalized: NormalizedText,
  keyLength: number,
  lockedLetters: Record<number, LockedLetter>,
): string => {
  const result = input.split('');

  normalized.originalIndices.forEach((originalIndex, cleanIndex) => {
    const locked = lockedLetters[cleanIndex % keyLength];
    if (!locked) {
      result[originalIndex] = '_';
      return;
    }

    const cipher = normalized.letters[cleanIndex].charCodeAt(0) - 65;
    const key = locked.letter.charCodeAt(0) - 65;
    result[originalIndex] = String.fromCharCode(((cipher - key + ALPHABET_LENGTH) % ALPHABET_LENGTH) + 65);
  });

  return result.join('');
};
