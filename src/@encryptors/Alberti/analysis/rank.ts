// Alberti cracker math.
//
// The tool ships fixed discs (the movable disc starts at "m"), so the
// unknowns are just the chunk `period` and the disc `iterationStep` —
// 12 × 23 combinations. The wizard ranks them by the English-likeness
// of the full decryption instead of brute-forcing silently.
//
// The spike conclusion (ticket #96): each chunk is monoalphabetic under
// a rotation of the known dynamic disc, so no Kasiski/IC machinery is
// needed — direct ranked brute force over (period, step) is both honest
// and fast, and the cards teach the parameter roles.
import {
  albertiEncrypt,
  ALBERTI_STATIC_DISC,
  ALBERTI_DYNAMIC_DISC,
} from '@encryptors/Alberti/alberti-crypt';
import {
  ENGLISH_FREQUENCIES,
  STANDARD_ALPHABET,
  chiToScore,
} from '@encryptors/shared/analysis';

export const DISC_LENGTH = ALBERTI_STATIC_DISC.length;

export const MAX_PERIOD = 12;

export interface AlbertiCandidate {
  value: number;
  confidence: number;
  // The partner parameter the best score was found at (hint for the
  // next step).
  bestPartner: number;
}

// Only characters the dynamic disc can produce count; everything else
// (spaces, punctuation, casing) is dropped before scoring.
export const normalizeAlbertiCipherText = (input: string): string =>
  input
    .toLowerCase()
    .split('')
    .filter((char) => ALBERTI_DYNAMIC_DISC.includes(char))
    .join('');

const decryptWith = (ciphertext: string, period: number, step: number): string =>
  albertiEncrypt({
    input: ciphertext,
    isDecryptMode: true,
    staticDisc: ALBERTI_STATIC_DISC,
    dynamicDisc: ALBERTI_DYNAMIC_DISC,
    iterationStep: step,
    period,
  });

// Chi-squared English-likeness of a decryption. The static disc carries
// 20 Latin letters only (no H/J/K/U/W/Y), so the reference uses just the
// letters the disc can produce.
const scoreDecryption = (plaintext: string): number => {
  const counts = new Map<string, number>();
  let total = 0;
  for (const char of plaintext) {
    if (!ALBERTI_STATIC_DISC.includes(char)) {
      continue;
    }
    counts.set(char, (counts.get(char) || 0) + 1);
    total += 1;
  }
  if (total === 0) {
    return 0;
  }

  let chiSquared = 0;
  for (const letter of ALBERTI_STATIC_DISC) {
    const englishIndex = STANDARD_ALPHABET.indexOf(letter);
    const frequency = englishIndex >= 0 ? ENGLISH_FREQUENCIES[englishIndex] : 0;
    const expected = (frequency / 100) * total;
    if (expected === 0) {
      continue;
    }
    const observed = counts.get(letter) || 0;
    const diff = observed - expected;
    chiSquared += (diff * diff) / expected;
  }

  return chiToScore(chiSquared);
};

const scorePair = (ciphertext: string, period: number, step: number): number =>
  scoreDecryption(decryptWith(ciphertext, period, step));

// All disc steps ranked for a fixed period.
export const rankSteps = (ciphertext: string, period: number): AlbertiCandidate[] => {
  if (!ciphertext) {
    return [];
  }

  return Array.from({ length: DISC_LENGTH }, (_, step) => ({
    value: step,
    confidence: scorePair(ciphertext, period, step),
    bestPartner: period,
  })).sort((a, b) => b.confidence - a.confidence || a.value - b.value);
};

// All periods ranked by their best step.
export const rankPeriods = (
  ciphertext: string,
  maxPeriod: number = MAX_PERIOD,
): AlbertiCandidate[] => {
  if (!ciphertext) {
    return [];
  }

  const periods = [];
  for (let period = 1; period <= maxPeriod; period += 1) {
    let bestStep = 0;
    let bestScore = -1;
    for (let step = 0; step < DISC_LENGTH; step += 1) {
      const score = scorePair(ciphertext, period, step);
      if (score > bestScore) {
        bestScore = score;
        bestStep = step;
      }
    }
    periods.push({ value: period, confidence: bestScore, bestPartner: bestStep });
  }

  return periods.sort((a, b) => b.confidence - a.confidence || a.value - b.value);
};

export { decryptWith as albertiDecryptWith };
