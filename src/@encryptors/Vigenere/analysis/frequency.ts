// English letter frequencies, A-Z, in percent. Source: standard tables
// (Lewand, "Cryptological Mathematics").
export const ENGLISH_FREQUENCIES: number[] = [
  8.2, 1.5, 2.8, 4.3, 12.7, 2.2, 2.0, 6.1, 7.0, 0.2, 0.8, 4.0, 2.4,
  6.7, 7.5, 1.9, 0.1, 6.0, 6.3, 9.1, 2.8, 1.0, 2.4, 0.2, 2.0, 0.1,
];

export const ALPHABET_LENGTH = 26;

// 26 letter counts for the slice, index 0 = 'A'.
export const countLetters = (slice: string): number[] => {
  const counts = new Array<number>(ALPHABET_LENGTH).fill(0);
  for (const letter of slice) {
    const index = letter.charCodeAt(0) - 65;
    if (index >= 0 && index < ALPHABET_LENGTH) {
      counts[index] += 1;
    }
  }
  return counts;
};

// Chi-squared between shifted slice counts and English frequencies,
// mapped to 0-100 where 100 means a perfect English-like fit.
export const scoreShift = (counts: number[], shift: number): number => {
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (total === 0) {
    return 0;
  }

  let chiSquared = 0;
  for (let letter = 0; letter < ALPHABET_LENGTH; letter += 1) {
    const shifted = counts[(letter + shift) % ALPHABET_LENGTH];
    const expected = (ENGLISH_FREQUENCIES[letter] / 100) * total;
    const diff = shifted - expected;
    chiSquared += (diff * diff) / expected;
  }

  // Map: 0 chi-squared -> 100, ~250 (typical random text of any length,
  // since chi-squared scales with sample size) -> 0. Exponential decay
  // keeps the curve smooth for both short and long slices.
  return Math.round(100 * Math.exp(-chiSquared / 250));
};

// The shift (key letter offset) under which the slice looks most English.
export const findBestShift = (counts: number[]): number => {
  let bestShift = 0;
  let bestScore = -1;

  for (let shift = 0; shift < ALPHABET_LENGTH; shift += 1) {
    const score = scoreShift(counts, shift);
    if (score > bestScore) {
      bestScore = score;
      bestShift = shift;
    }
  }

  return bestShift;
};
