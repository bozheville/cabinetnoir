// Affine cracker math: rank the 12 valid multipliers by how English the
// best decryption for each looks, then read the shift off a frequency
// chart. Reuses the shared frequency machinery; the affine arithmetic
// (p = a⁻¹·(c − b) mod 26) lives here.
import {
  ALPHABET_LENGTH,
  ENGLISH_FREQUENCIES,
  STANDARD_ALPHABET,
  countLetters,
  chiToScore,
} from '@encryptors/shared/analysis';

export interface MultiplierCandidate {
  multiplier: number;
  // 0-100 English-likeness of the best shift for this multiplier.
  confidence: number;
  // The shift the best score was found at (a hint for step 2).
  bestShift: number;
}

// Multipliers coprime with 26.
export const AFFINE_MULTIPLIERS = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

export const modInverse = (a: number, m: number): number => {
  for (let x = 1; x < m; x += 1) {
    if ((a * x) % m === 1) {
      return x;
    }
  }
  return 1;
};

export const mod = (value: number, m: number): number =>
  ((value % m) + m) % m;

// Plaintext distribution under (multiplier, shift): p = a⁻¹·(c − b).
const plainDistribution = (
  counts: number[],
  inverse: number,
  shift: number,
): number[] => {
  const distribution = new Array<number>(ALPHABET_LENGTH).fill(0);
  for (let cipherIndex = 0; cipherIndex < ALPHABET_LENGTH; cipherIndex += 1) {
    const plainIndex = mod(inverse * (cipherIndex - shift), ALPHABET_LENGTH);
    distribution[plainIndex] += counts[cipherIndex];
  }
  return distribution;
};

const scoreDistribution = (distribution: number[]): number => {
  const total = distribution.reduce((sum, count) => sum + count, 0);
  if (total === 0) {
    return 0;
  }

  let chiSquared = 0;
  for (let index = 0; index < ALPHABET_LENGTH; index += 1) {
    const expected = (ENGLISH_FREQUENCIES[index] / 100) * total;
    if (expected === 0) {
      continue;
    }
    const diff = distribution[index] - expected;
    chiSquared += (diff * diff) / expected;
  }
  return chiToScore(chiSquared);
};

// All 12 multipliers ranked by their best shift's English-likeness.
export const rankMultipliers = (letters: string): MultiplierCandidate[] => {
  const counts = countLetters(letters);
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (total === 0) {
    return [];
  }

  return AFFINE_MULTIPLIERS.map((multiplier) => {
    const inverse = modInverse(multiplier, ALPHABET_LENGTH);
    let bestShift = 0;
    let bestScore = -1;
    for (let shift = 0; shift < ALPHABET_LENGTH; shift += 1) {
      const score = scoreDistribution(plainDistribution(counts, inverse, shift));
      if (score > bestScore) {
        bestScore = score;
        bestShift = shift;
      }
    }
    return { multiplier, confidence: bestScore, bestShift };
  }).sort((a, b) => b.confidence - a.confidence || a.multiplier - b.multiplier);
};

// Full decryption of the normalized letters under (multiplier, shift).
export const affineDecryptLetters = (letters: string, multiplier: number, shift: number): string => {
  const inverse = modInverse(multiplier, ALPHABET_LENGTH);
  return letters
    .split('')
    .map((letter) => STANDARD_ALPHABET[mod(inverse * (STANDARD_ALPHABET.indexOf(letter) - shift), ALPHABET_LENGTH)])
    .join('');
};
