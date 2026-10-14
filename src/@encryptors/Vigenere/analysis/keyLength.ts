import { Repeat, gapDivisorCounts } from './kasiski';

export type KeyLengthLabel = 'very likely' | 'possible' | 'unlikely';

export interface KeyLengthCandidate {
  length: number;
  // 0-100, combined from Index of Coincidence and Kasiski gap evidence.
  confidence: number;
  label: KeyLengthLabel;
  reason: string;
  averageIC: number;
  divisorCount: number;
}

export const MAX_KEY_LENGTH = 20;

// Random text ~0.0385, English ~0.0667.
const IC_RANDOM = 0.0385;
const IC_ENGLISH = 0.0667;

// Weights of the two signals in the combined confidence.
const IC_WEIGHT = 0.6;
const KASISKI_WEIGHT = 0.4;

// A length scoring this much below a smaller divisor of it gets demoted
// (6 is preferred over 12 when both look about as good).
const MULTIPLE_PENALTY_THRESHOLD = 10;
const MULTIPLE_PENALTY = 15;

const VERY_LIKELY = 60;
const POSSIBLE = 35;

// TODO(localization): reason templates move to strings.ts when the cracker
// texts move to public/locales.
const reasonTemplates = {
  icOnly: (ic: number) => `slices look ${ic >= IC_ENGLISH - 0.005 ? 'very much like' : 'somewhat like'} English (IC ${ic.toFixed(3)})`,
  kasiskiOnly: (count: number) => `${count} repeat gap${count === 1 ? '' : 's'} divisible by this length`,
  both: (ic: number, count: number) => `${count} repeat gap${count === 1 ? '' : 's'} divisible by this length, slices look like English (IC ${ic.toFixed(3)})`,
  weak: 'no strong evidence for this length',
};

export const indexOfCoincidence = (letters: string): number => {
  const total = letters.length;
  if (total < 2) {
    return 0;
  }

  const counts = new Map<string, number>();
  for (const letter of letters) {
    counts.set(letter, (counts.get(letter) || 0) + 1);
  }

  const pairs = [...counts.values()].reduce((sum, count) => sum + count * (count - 1), 0);
  return pairs / (total * (total - 1));
};

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const averageSliceIC = (letters: string, length: number): number => {
  let sum = 0;
  let counted = 0;

  for (let offset = 0; offset < length; offset += 1) {
    const slice = [];
    for (let i = offset; i < letters.length; i += length) {
      slice.push(letters[i]);
    }
    // Slices shorter than 4 letters give meaningless IC; skip them instead
    // of diluting the average with noise.
    if (slice.length >= 4) {
      sum += indexOfCoincidence(slice.join(''));
      counted += 1;
    }
  }

  return counted === 0 ? 0 : sum / counted;
};

const buildReason = (averageIC: number, divisorCount: number): string => {
  if (divisorCount === 0) {
    return reasonTemplates.icOnly(averageIC);
  }
  if (averageIC < (IC_RANDOM + IC_ENGLISH) / 2) {
    return reasonTemplates.kasiskiOnly(divisorCount);
  }
  return reasonTemplates.both(averageIC, divisorCount);
};

export const rankKeyLengths = (
  letters: string,
  repeats: Repeat[],
  maxLength: number = MAX_KEY_LENGTH,
): KeyLengthCandidate[] => {
  if (!letters || letters.length < 4) {
    return [];
  }

  const divisorCounts = new Map(
    gapDivisorCounts(repeats, maxLength).map((entry) => [entry.length, entry.count]),
  );
  const maxDivisorCount = Math.max(0, ...divisorCounts.values());

  const candidates: KeyLengthCandidate[] = [];

  for (let length = 1; length <= maxLength; length += 1) {
    // Not enough letters per slice for a meaningful IC.
    if (letters.length / length < 4) {
      continue;
    }

    const averageIC = averageSliceIC(letters, length);
    const divisorCount = divisorCounts.get(length) || 0;
    const icScore = clamp01((averageIC - IC_RANDOM) / (IC_ENGLISH - IC_RANDOM));
    const kasiskiScore = maxDivisorCount === 0 ? 0 : divisorCount / maxDivisorCount;
    const confidence = Math.round(100 * (IC_WEIGHT * icScore + KASISKI_WEIGHT * kasiskiScore));

    candidates.push({
      length,
      confidence,
      label: confidence >= VERY_LIKELY ? 'very likely' : confidence >= POSSIBLE ? 'possible' : 'unlikely',
      reason: buildReason(averageIC, divisorCount),
      averageIC,
      divisorCount,
    });
  }

  candidates.sort((a, b) => b.confidence - a.confidence || a.length - b.length);

  // Multiples of an already better-ranked length are redundant; demote them
  // unless they score clearly higher.
  const accepted: number[] = [];
  const penalized = candidates.map((candidate) => {
    const isRedundantMultiple = accepted.some(
      (length) => candidate.length % length === 0
        && candidate.confidence - candidates.find((c) => c.length === length)!.confidence
          < MULTIPLE_PENALTY_THRESHOLD,
    );
    if (!isRedundantMultiple) {
      accepted.push(candidate.length);
      return candidate;
    }
    return {
      ...candidate,
      confidence: Math.max(0, candidate.confidence - MULTIPLE_PENALTY),
    };
  });

  return penalized.sort((a, b) => b.confidence - a.confidence || a.length - b.length);
};
