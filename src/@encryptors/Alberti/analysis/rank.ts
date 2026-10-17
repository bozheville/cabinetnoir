// Alberti cracker math.
//
// Spike conclusion (ticket #96): the tool ships fixed discs, so the
// unknowns are just the chunk `period` and the disc `iterationStep` —
// a small (period, step) space, ranked by the English-likeness of the
// decryption instead of brute-forced silently.
//
// Implementation caveat discovered in the spike: a chunk is a RAW slice
// of the input, and letters that sit on neither disc are dropped during
// encryption, so a chunk's letter count varies and the ciphertext letter
// at position n does not map back to a fixed raw position. Positional
// decryption (the formula below) is therefore exact only for ciphertexts
// whose plaintext letters all sit on the disc — the same assumption the
// tool's own decrypt path makes. The cracker states this in its UI.
import {
  ALBERTI_STATIC_DISC,
  ALBERTI_DYNAMIC_DISC,
} from '@encryptors/Alberti/alberti-crypt';
import {
  STANDARD_ALPHABET,
  scoreDigraphs,
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

const mod = (value: number, m: number): number => ((value % m) + m) % m;

// Positional decryption: the cipher letter at position n was encrypted
// with the disc rotated by floor(n / period) * step.
export const albertiDecryptLetters = (
  ciphertext: string,
  period: number,
  step: number,
): string =>
  ciphertext
    .split('')
    .map((char, n) => {
      const cipherIndex = ALBERTI_DYNAMIC_DISC.indexOf(char);
      const rotation = Math.floor(n / period) * step;
      return ALBERTI_STATIC_DISC[mod(cipherIndex - rotation, DISC_LENGTH)];
    })
    .join('');

// English-likeness of a decryption via digraph statistics — much sharper
// than single-letter chi-squared at telling a correct (period, step) from
// a near-miss (a wrong period keeps the letters but wrecks the pairs).
const scoreDecryption = (plaintext: string): number =>
  scoreDigraphs(plaintext.split('').filter((char) => STANDARD_ALPHABET.indexOf(char) >= 0).join(''));

const scorePair = (ciphertext: string, period: number, step: number): number =>
  scoreDecryption(albertiDecryptLetters(ciphertext, period, step));

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
