import { normalize } from '@encryptors/shared/analysis/normalize';
import {
  STANDARD_ALPHABET,
  countLetters,
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
}

const icScoreOf = (ic: number): number => {
  const range = IC_ENGLISH - IC_RANDOM;
  return Math.max(0, Math.min(1, (ic - IC_RANDOM) / range));
};

const isEnglishLikeIc = (ic: number): boolean =>
  icScoreOf(ic) >= IC_ENGLISH_LIKE;

export { isEnglishLikeIc };

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
  };
};
