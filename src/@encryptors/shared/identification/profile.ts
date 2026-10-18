import { normalize } from '@encryptors/shared/analysis/normalize';
import {
  ALPHABET_LENGTH,
  ENGLISH_FREQUENCIES,
  STANDARD_ALPHABET,
  countLetters,
  chiSquaredAt,
  chiToScorePerLetter,
} from '@encryptors/shared/analysis/frequency';
import { indexOfCoincidence } from '@encryptors/shared/analysis/keyLength';

import {
  GROUP_SIZE,
  HOMOPHONIC_SYMBOLS,
  IC_ENGLISH,
  IC_ENGLISH_LIKE,
  IC_RANDOM,
  MIN_GROUPS_FOR_FLAG,
  MIN_LETTERS,
  RELIABLE_LETTERS,
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
}

const icScoreOf = (ic: number): number => {
  const range = IC_ENGLISH - IC_RANDOM;
  return Math.max(0, Math.min(1, (ic - IC_RANDOM) / range));
};

const isEnglishLikeIc = (ic: number): boolean =>
  icScoreOf(ic) >= IC_ENGLISH_LIKE;

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

  const tier = letterCount < MIN_LETTERS
    ? 'tooShort'
    : letterCount < RELIABLE_LETTERS
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
  };
};
