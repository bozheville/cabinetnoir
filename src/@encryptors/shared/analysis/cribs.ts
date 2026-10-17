export interface CribMatch {
  // Start index of the crib in the clean ciphertext.
  position: number;
  // Key letters implied by the crib: cipher letter minus crib letter.
  fragment: string;
  // Slice -> implied key letter for the slices the crib covers.
  sliceLetters: { slice: number; letter: string }[];
  // Slice indices where the fragment disagrees with locked letters.
  conflicts: number[];
  // Fragment forms a repeating pattern (hint: real key length may be
  // shorter, or the match is coincidental).
  isStrong: boolean;
}

const ALPHABET_LENGTH = 26;

const STANDARD_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const toCleanLetters = (text: string): string =>
  text.toUpperCase().split('').filter((char) => /[A-Z]/.test(char)).join('');

// Key fragment implied by placing the crib at `position`:
// fragment[i] = cipher[position + i] - crib[i] (mod 26).
// Returns null when the crib does not fit at that position.
export const impliedKeyFragment = (
  ciphertext: string,
  crib: string,
  position: number,
  alphabet: string = STANDARD_ALPHABET,
): string | null => {
  if (!ciphertext || !crib || position < 0 || position + crib.length > ciphertext.length) {
    return null;
  }

  const fragment: string[] = [];
  for (let i = 0; i < crib.length; i += 1) {
    const cipher = alphabet.indexOf(ciphertext[position + i]);
    const plain = alphabet.indexOf(crib[i]);
    if (cipher < 0 || plain < 0) {
      return null;
    }
    fragment.push(alphabet[(cipher - plain + alphabet.length) % alphabet.length]);
  }
  return fragment.join('');
};

const isRepeating = (fragment: string): boolean => {
  for (let period = 1; period <= Math.floor(fragment.length / 2); period += 1) {
    let repeating = true;
    for (let i = period; i < fragment.length; i += 1) {
      if (fragment[i] !== fragment[i - period]) {
        repeating = false;
        break;
      }
    }
    if (repeating) {
      return true;
    }
  }
  return false;
};

// Try the crib at every position of the clean ciphertext. A position is
// kept when the implied fragment is internally consistent for the chosen
// key length (same slice always implies the same letter) and reports
// conflicts with already-locked letters instead of hiding them.
export const findCribMatches = (
  ciphertext: string,
  crib: string,
  keyLength: number,
  lockedLetters: Record<number, string> = {},
  alphabet: string = STANDARD_ALPHABET,
): CribMatch[] => {
  const cleanCipher = toCleanLetters(ciphertext);
  const cleanCrib = toCleanLetters(crib);

  if (!cleanCipher || cleanCrib.length === 0 || keyLength < 1
    || cleanCipher.length < cleanCrib.length) {
    return [];
  }

  const matches: CribMatch[] = [];

  for (let position = 0; position + cleanCrib.length <= cleanCipher.length; position += 1) {
    const fragment = impliedKeyFragment(cleanCipher, cleanCrib, position, alphabet);
    if (!fragment) {
      continue;
    }

    // Internal consistency: a crib may cover the same slice more than once
    // (crib longer than the key). Both occurrences must imply the same key
    // letter, otherwise the crib cannot sit at this position.
    const sliceLetters = new Map<number, string>();
    let inconsistent = false;
    const conflicts: number[] = [];

    for (let i = 0; i < fragment.length; i += 1) {
      const slice = (position + i) % keyLength;
      const letter = fragment[i];
      const seen = sliceLetters.get(slice);
      if (seen && seen !== letter) {
        inconsistent = true;
        break;
      }
      sliceLetters.set(slice, letter);

      const locked = lockedLetters[slice];
      if (locked && locked.toUpperCase() !== letter && !conflicts.includes(slice)) {
        conflicts.push(slice);
      }
    }

    if (inconsistent) {
      continue;
    }

    matches.push({
      position,
      fragment: [...sliceLetters.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([, letter]) => letter)
        .join(''),
      sliceLetters: [...sliceLetters.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([slice, letter]) => ({ slice, letter })),
      conflicts,
      isStrong: isRepeating(fragment),
    });
  }

  return matches;
};
