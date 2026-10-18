import { normalize } from '@encryptors/shared/analysis/normalize';
import {
  ALPHABET_LENGTH,
  ENGLISH_FREQUENCIES,
  STANDARD_ALPHABET,
  countLetters,
  chiSquaredAt,
  chiToScorePerLetter,
} from '@encryptors/shared/analysis/frequency';
import { indexOfCoincidence, rankKeyLengths } from '@encryptors/shared/analysis/keyLength';
import { Repeat, findRepeats } from '@encryptors/shared/analysis/kasiski';

import {
  GROUP_SIZE,
  HOMOPHONIC_SYMBOLS,
  IC_BAND_MAX,
  IC_BAND_MIN,
  IC_ENGLISH,
  IC_RANDOM,
  MIN_DIGIT_PAIRS,
  MIN_GROUPS_FOR_FLAG,
  MIN_LETTERS,
  NIHILIST_MAX,
  NIHILIST_MIN,
  POLYBIUS_MAX,
  POLYBIUS_MIN,
  RELIABLE_LETTERS,
  ADFGVX_LETTERS,
} from './thresholds';

// The text profile: every measurement the identification rules need,
// as one pure function of the input. Built up in pieces (basic counts,
// substitution fits, periodicity, structural flags) — no rule logic
// here, numbers only.
export interface TextProfile {
  // Normalised A-Z letters.
  letters: string;
  letterCount: number;
  nonLetterCount: number;

  // Length tier: tooShort refuses analysis, unreliable shows a banner.
  tier: 'tooShort' | 'unreliable' | 'ok';

  // Per-letter counts indexed by STANDARD_ALPHABET position.
  counts: number[];
  distinctLetters: string[];
  missingLetters: string[];

  // Index of Coincidence of the whole text.
  ic: number;
  // Share of the way from random (0) to English (1).
  icScore: number;

  // Charset flags.
  digitsOnly: boolean;
  lettersOnly: boolean;
  distinctSymbols: number;

  // Equal-size grouping (e.g. blocks of 5) present in the input.
  grouped: boolean;

  // --- Substitution fits (task 03) ---

  // Chi-squared vs English with the letters as they are: a good score
  // means the letters were moved (transposition), not replaced.
  directChiScore: number;
  // Chi-squared of the frequency *shape* only (both sides sorted):
  // a good score with a bad direct score means a monoalphabetic
  // substitution shuffled the alphabet.
  sortedChiScore: number;

  // Best Caesar shift: the shift under which the text reads most
  // English, its score and the runner-up's (a big gap = a plain shift).
  caesarBestShift: number;
  caesarBestScore: number;
  caesarRunnerUpScore: number;

  // Atbash (reversed alphabet) fit score.
  atbashScore: number;

  // Best affine key: p = inv(a) * (c - b). `multiplier === 1` means the
  // best affine fit degenerates into a plain Caesar shift.
  affineMultiplier: number;
  affineShift: number;
  affineScore: number;

  // --- Periodicity (task 04) ---

  // Periodic structure: candidate key lengths from the cracker library
  // (slice IC + Kasiski gap divisors), best first.
  periodCandidates: Array<{ length: number; confidence: number; averageIC: number; divisorCount: number }>;
  // Convenience accessors for the rules.
  bestPeriod: number | null;
  bestPeriodConfidence: number;
  bestPeriodAverageIC: number;

  // Kasiski repeats (for the metrics panel).
  repeats: Repeat[];

  // The polyalphabetic signal: how much *more* English-like the slices
  // at the best period are than the text as a whole. Near zero for plain
  // English (every period looks the same), clearly positive for a
  // periodic polyalphabetic cipher.
  periodIcGain: number;

  // --- Structural flags (task 05) ---

  // Digraph structure (Playfair and friends).
  evenLength: boolean;
  // A doubled letter sitting inside one digraph — impossible in
  // Playfair output (an X or Q is inserted between doubles).
  hasDoubledDigraph: boolean;
  // Playfair never emits J.
  hasJ: boolean;

  // ADFGVX(/ADFGX) fractionation: every letter from the ADFGVX set.
  adfgvxSet: boolean;

  // Digit structure (Polybius / Nihilist outputs): two-digit groups and
  // whether they all fit the classic ranges.
  digitPairs: number;
  polybiusLike: boolean;
  nihilistLike: boolean;

  // Flatness score for the homophonic fingerprint (with many distinct
  // symbols).
  uniformityScore: number;

  // Average best-shift chi² score of the slices at the best period. A
  // plain periodic cipher (Vigenère) decrypts slice-by-slice with plain
  // shifts — high score. A mixed-alphabet periodic cipher (Alberti)
  // does not — lower score.
  sliceShiftScore: number;

  // The raw input mixes upper and lower case letters.
  mixedCase: boolean;

  // Distinct two-digit values in digit-only output (the homophonic
  // fingerprint: dozens of distinct codes; Polybius has at most 25).
  distinctDigitPairs: number;
}

const icScoreOf = (ic: number): number => {
  const range = IC_ENGLISH - IC_RANDOM;
  return Math.max(0, Math.min(1, (ic - IC_RANDOM) / range));
};

// English-like IC is a band, not a floor: an IC far above English means
// a restricted alphabet (ADFGVX-style), far below a polyalphabetic mix.
const isEnglishLikeIc = (ic: number): boolean =>
  ic >= IC_BAND_MIN && ic <= IC_BAND_MAX;

export { isEnglishLikeIc };

// Multipliers coprime with 26 — the affine keyspace.
const AFFINE_MULTIPLIERS = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
const mod26 = (value: number): number => ((value % 26) + 26) % 26;

// Sorted-profile chi²: sort both observed counts and English frequencies
// descending and compare. Letter identity is ignored, so any monoalphabetic
// substitution keeps a good score while a transposition wrecks the shape.
const sortedChiSquared = (counts: number[], total: number): number => {
  const observed = [...counts].sort((a, b) => b - a);
  const expectedShape = [...ENGLISH_FREQUENCIES].sort((a, b) => b - a);

  let chiSquared = 0;
  for (let index = 0; index < ALPHABET_LENGTH; index += 1) {
    const expected = (expectedShape[index] / 100) * total;
    const diff = observed[index] - expected;
    chiSquared += (diff * diff) / expected;
  }
  return chiSquared;
};

export const profileText = (input: string): TextProfile => {
  const letters = normalize(input).letters;
  const letterCount = letters.length;
  const nonLetterCount = input.length - letterCount;

  // Digit-only outputs (Polybius/Nihilist) carry the analysis units in
  // their digits, not in letters.
  const digitSequence = (input.match(/\d/g) || []).join('');
  const analysisUnits = digitSequence.length > letterCount ? digitSequence.length : letterCount;

  // Mixed case in the raw letters (Alberti's fingerprint).
  const rawLetters: string[] = input.match(/[a-zA-Z]/g) || [];
  const lowerCount = rawLetters.filter((char) => char !== char.toUpperCase()).length;
  const upperCount = rawLetters.length - lowerCount;
  const mixedCase = lowerCount >= 5 && upperCount >= 5;
  const distinctDigitPairs = new Set(
    digitSequence.match(/\d{2}/g) || [],
  ).size;

  const tier = analysisUnits < MIN_LETTERS
    ? 'tooShort'
    : analysisUnits < RELIABLE_LETTERS
      ? 'unreliable'
      : 'ok';

  const counts = countLetters(letters, STANDARD_ALPHABET);
  const distinctLetters = STANDARD_ALPHABET
    .split('')
    .filter((_, index) => counts[index] > 0);
  const missingLetters = STANDARD_ALPHABET
    .split('')
    .filter((_, index) => counts[index] === 0);

  const ic = indexOfCoincidence(letters);

  // Substitution fits. All scores use the length-independent mapping —
  // the whole text is one sample, unlike the cracker's slices.
  const directChiScore = chiToScorePerLetter(chiSquaredAt(counts, 0), letterCount);
  const sortedChiScore = chiToScorePerLetter(sortedChiSquared(counts, letterCount), letterCount);

  // Caesar: all 26 shifts, best two kept.
  const shiftScores = Array.from({ length: ALPHABET_LENGTH }, (_, shift) =>
    chiToScorePerLetter(chiSquaredAt(counts, shift), letterCount));
  let caesarBestShift = 0;
  let caesarBestScore = -1;
  let caesarRunnerUpScore = -1;
  shiftScores.forEach((score, shift) => {
    if (score > caesarBestScore) {
      caesarRunnerUpScore = caesarBestScore;
      caesarBestScore = score;
      caesarBestShift = shift;
    } else if (score > caesarRunnerUpScore) {
      caesarRunnerUpScore = score;
    }
  });

  // Atbash: display position i shows the count of the cipher letter that
  // decrypts to alphabet[i]; under Atbash that is the mirror letter.
  const atbashScore = chiToScorePerLetter(
    chiSquaredAt(counts, 0, STANDARD_ALPHABET, (index) => 25 - index),
    letterCount,
  );

  // Affine: for key (a, b) the cipher letter that decrypts to
  // alphabet[i] is alphabet[(a * i + b) % 26].
  let affineMultiplier = 1;
  let affineShift = 0;
  let affineScore = -1;
  for (const a of AFFINE_MULTIPLIERS) {
    for (let b = 0; b < ALPHABET_LENGTH; b += 1) {
      const score = chiToScorePerLetter(
        chiSquaredAt(counts, b, STANDARD_ALPHABET, (index) => mod26(a * index + b)),
        letterCount,
      );
      if (score > affineScore) {
        affineScore = score;
        affineMultiplier = a;
        affineShift = b;
      }
    }
  }

  // Charset: what the raw input is made of.
  const chars = input.replace(/\s/g, '').split('');
  const digitChars = chars.filter((char) => char >= '0' && char <= '9');
  const digitsOnly = chars.length > 0 && digitChars.length === chars.length;
  const lettersOnly = chars.length > 0 && letterCount === chars.length;
  const distinctSymbols = new Set(chars.map((char) => char.toUpperCase())).size;

  // Equal-size grouping: several trailing full groups of GROUP_SIZE
  // (classic hand-cipher presentation, e.g. ADFGVX blocks of 5).
  const tokens = input.split(/\s+/).filter(Boolean);
  const grouped = tokens.length >= MIN_GROUPS_FOR_FLAG
    && tokens.every((token) => token.length === GROUP_SIZE);

  // Periodic structure: shared cracker math (slice IC + Kasiski).
  const repeats = findRepeats(letters);
  const keyLengths = rankKeyLengths(letters, repeats);
  const periodCandidates = keyLengths.slice(0, 3).map((candidate) => ({
    length: candidate.length,
    confidence: candidate.confidence,
    averageIC: candidate.averageIC,
    divisorCount: candidate.divisorCount,
  }));
  const best = keyLengths[0] || null;

  // Structural flags.
  const evenLength = letterCount > 0 && letterCount % 2 === 0;
  let hasDoubledDigraph = false;
  for (let index = 0; index + 1 < letterCount; index += 2) {
    if (letters[index] === letters[index + 1]) {
      hasDoubledDigraph = true;
      break;
    }
  }
  const hasJ = letters.includes('J');
  const adfgvxSet = letterCount > 0
    && letters.split('').every((letter) => ADFGVX_LETTERS.includes(letter));

  // Digit structure on the raw input: digits in order, read as two-digit
  // numbers when there is an even count of them.
  const digitPairs = digitSequence.length >= 2 ? Math.floor(digitSequence.length / 2) : 0;
  const pairNumbers: number[] = [];
  for (let index = 0; index + 1 < digitSequence.length; index += 2) {
    pairNumbers.push(Number(digitSequence.slice(index, index + 2)));
  }
  const allInRange = (min: number, max: number): boolean =>
    digitPairs >= MIN_DIGIT_PAIRS
    && pairNumbers.every((value) => value >= min && value <= max);
  const polybiusLike = allInRange(POLYBIUS_MIN, POLYBIUS_MAX);
  const nihilistLike = allInRange(NIHILIST_MIN, NIHILIST_MAX);

  // Uniformity vs a flat distribution: the homophonic fingerprint.
  const uniformChi = counts.reduce((sum, count) => {
    const expected = letterCount / ALPHABET_LENGTH;
    return expected > 0 ? sum + ((count - expected) ** 2) / expected : sum;
  }, 0);
  const uniformityScore = chiToScorePerLetter(uniformChi, letterCount);

  // Slices at the best period: how well plain shifts alone decrypt them
  // (the Vigenère-vs-Alberti discriminator).
  let sliceShiftScore = 0;
  if (best && best.length >= 2 && letterCount / best.length >= 4) {
    const period = best.length;
    const sliceScores: number[] = [];
    for (let offset = 0; offset < period; offset += 1) {
      const sliceCounts = new Array<number>(ALPHABET_LENGTH).fill(0);
      for (let index = offset; index < letterCount; index += period) {
        sliceCounts[STANDARD_ALPHABET.indexOf(letters[index])] += 1;
      }
      const sliceTotal = sliceCounts.reduce((sum, count) => sum + count, 0);
      if (sliceTotal < 4) {
        continue;
      }
      sliceScores.push(Math.max(...Array.from({ length: ALPHABET_LENGTH }, (_, shift) =>
        chiToScorePerLetter(chiSquaredAt(sliceCounts, shift), sliceTotal))));
    }
    if (sliceScores.length > 0) {
      sliceShiftScore = Math.round(sliceScores.reduce((sum, score) => sum + score, 0) / sliceScores.length);
    }
  }

  return {
    letters,
    letterCount,
    nonLetterCount,
    tier,
    counts,
    distinctLetters,
    missingLetters,
    ic,
    icScore: icScoreOf(ic),
    digitsOnly,
    lettersOnly,
    distinctSymbols,
    grouped,
    directChiScore,
    sortedChiScore,
    caesarBestShift,
    caesarBestScore,
    caesarRunnerUpScore,
    atbashScore,
    affineMultiplier,
    affineShift,
    affineScore,
    periodCandidates,
    bestPeriod: best ? best.length : null,
    bestPeriodConfidence: best ? best.confidence : 0,
    bestPeriodAverageIC: best ? best.averageIC : 0,
    repeats,
    periodIcGain: best ? best.averageIC - ic : 0,
    evenLength,
    hasDoubledDigraph,
    hasJ,
    adfgvxSet,
    digitPairs,
    polybiusLike,
    nihilistLike,
    uniformityScore,
    sliceShiftScore,
    mixedCase,
    distinctDigitPairs,
  };
};
