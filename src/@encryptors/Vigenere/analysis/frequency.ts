// English letter frequencies, A-Z, in percent. Source: standard tables
// (Lewand, "Cryptological Mathematics").
export const ENGLISH_FREQUENCIES: number[] = [
  8.2, 1.5, 2.8, 4.3, 12.7, 2.2, 2.0, 6.1, 7.0, 0.2, 0.8, 4.0, 2.4,
  6.7, 7.5, 1.9, 0.1, 6.0, 6.3, 9.1, 2.8, 1.0, 2.4, 0.2, 2.0, 0.1,
];

export const ALPHABET_LENGTH = 26;

const STANDARD_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// 26 letter counts for the slice, indexed by position in `alphabet`.
// Characters outside the alphabet are ignored.
export const countLetters = (slice: string, alphabet: string = STANDARD_ALPHABET): number[] => {
  const counts = new Array<number>(ALPHABET_LENGTH).fill(0);
  for (const letter of slice) {
    const index = alphabet.indexOf(letter);
    if (index >= 0) {
      counts[index] += 1;
    }
  }
  return counts;
};

// English frequency expected for the letter at position `index` of
// `alphabet`: frequencies attach to characters, not to positions, so a
// reshuffled alphabet permutes the reference table accordingly.
export const englishFrequencyAt = (index: number, alphabet: string): number => {
  const standardIndex = STANDARD_ALPHABET.indexOf(alphabet[index]);
  return standardIndex >= 0 ? ENGLISH_FREQUENCIES[standardIndex] : 0;
};

// Chi-squared between the slice counts rotated by `shift` and the English
// frequencies, mapped to 0-100 where 100 means a perfect English-like fit.
//
// Position `index` of the display shows the observed count of the letter
// `alphabet[(index + shift) % length]`; when `shift` equals the key letter's
// index, that letter decrypts to `alphabet[index]`, so the reference is the
// English frequency of `alphabet[index]`.
export const scoreShift = (
  counts: number[],
  shift: number,
  alphabet: string = STANDARD_ALPHABET,
): number => {
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (total === 0) {
    return 0;
  }

  let chiSquared = 0;
  for (let index = 0; index < ALPHABET_LENGTH; index += 1) {
    const shifted = counts[(index + shift) % ALPHABET_LENGTH];
    const expected = (englishFrequencyAt(index, alphabet) / 100) * total;
    if (expected === 0) {
      continue;
    }
    const diff = shifted - expected;
    chiSquared += (diff * diff) / expected;
  }

  // Map: 0 chi-squared -> 100, ~250 (typical random text of any length,
  // since chi-squared scales with sample size) -> 0. Exponential decay
  // keeps the curve smooth for both short and long slices.
  return Math.round(100 * Math.exp(-chiSquared / 250));
};

// The shift (key letter index in `alphabet`) under which the slice looks
// most English.
export const findBestShift = (
  counts: number[],
  alphabet: string = STANDARD_ALPHABET,
): number => {
  let bestShift = 0;
  let bestScore = -1;

  for (let shift = 0; shift < ALPHABET_LENGTH; shift += 1) {
    const score = scoreShift(counts, shift, alphabet);
    if (score > bestScore) {
      bestScore = score;
      bestShift = shift;
    }
  }

  return bestShift;
};
