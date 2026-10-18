// English letter frequencies, A-Z, in percent. Source: standard tables
// (Lewand, "Cryptological Mathematics").
export const ENGLISH_FREQUENCIES: number[] = [
  8.2, 1.5, 2.8, 4.3, 12.7, 2.2, 2.0, 6.1, 7.0, 0.2, 0.8, 4.0, 2.4,
  6.7, 7.5, 1.9, 0.1, 6.0, 6.3, 9.1, 2.8, 1.0, 2.4, 0.2, 2.0, 0.1,
];

export const ALPHABET_LENGTH = 26;

export const STANDARD_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

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

// Chi-squared between the observed counts mapped to display positions and
// the English frequencies, mapped to 0-100 where 100 means a perfect
// English-like fit.
//
// Display position `index` shows the observed count of the letter
// `mapIndex(index, shift)`; for a plain rotation that is
// `alphabet[(index + shift) % length]`, so position `index` shows the
// letter that decrypts to `alphabet[index]` under the key letter `shift`
// — the reference is the English frequency of `alphabet[index]`.
export const chiSquaredAt = (
  counts: number[],
  shift: number,
  alphabet: string = STANDARD_ALPHABET,
  mapIndex: (displayIndex: number, shift: number) => number =
    (index, offset) => (index + offset) % ALPHABET_LENGTH,
): number => {
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (total === 0) {
    return 0;
  }

  let chiSquared = 0;
  for (let index = 0; index < ALPHABET_LENGTH; index += 1) {
    const shifted = counts[mapIndex(index, shift) % ALPHABET_LENGTH];
    const expected = (englishFrequencyAt(index, alphabet) / 100) * total;
    if (expected === 0) {
      continue;
    }
    const diff = shifted - expected;
    chiSquared += (diff * diff) / expected;
  }
  return chiSquared;
};

export const scoreShift = (
  counts: number[],
  shift: number,
  alphabet: string = STANDARD_ALPHABET,
  mapIndex: (displayIndex: number, shift: number) => number =
    (index, offset) => (index + offset) % ALPHABET_LENGTH,
): number => chiToScore(chiSquaredAt(counts, shift, alphabet, mapIndex));

// The 0-100 "English-likeness" mapping used by every cracker score.
export const chiToScore = (chiSquared: number): number =>
  Math.round(100 * Math.exp(-chiSquared / 250));

// Length-independent variant of the mapping for whole-text scoring.
// Raw chi-squared grows linearly with the sample size, so the cracker's
// whole-text mapping drives every score to 0 on long inputs. Dividing by
// the letter count and rescaling (a correct English fit measures
// ~0.3-0.6 chi-squared per letter, wrong fits 1+) keeps the 0-100 score
// meaningful at any length. Used by the identification engine, not by
// the cracker slices.
export const chiToScorePerLetter = (chiSquared: number, total: number): number =>
  total > 0 ? chiToScore((chiSquared / total) * 90) : 0;

// The shift under which the display looks most English.
export const findBestShift = (
  counts: number[],
  alphabet: string = STANDARD_ALPHABET,
  mapIndex: (displayIndex: number, shift: number) => number =
    (index, offset) => (index + offset) % ALPHABET_LENGTH,
): number => {
  let bestShift = 0;
  let bestScore = -1;

  for (let shift = 0; shift < ALPHABET_LENGTH; shift += 1) {
    const score = scoreShift(counts, shift, alphabet, mapIndex);
    if (score > bestScore) {
      bestScore = score;
      bestShift = shift;
    }
  }

  return bestShift;
};
