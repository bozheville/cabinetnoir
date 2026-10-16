// Candidate transposition key lengths (column counts), ranked as a HINT.
//
// Score for a candidate K: the index of coincidence of the symbol stream
// of the best arrangement the heuristics find. At the correct K the
// symbols are real plaintext letters (IC around 0.065); wrong candidates
// score near the 1/36 baseline.
//
// Honest caveat, proven while building this: the signal is genuinely weak
// for a single short message — wrong candidates can outscore the correct
// one (cross-letter bigrams are also structured). The wizard therefore
// treats this ranking as a hint, shows every candidate, and lets the user
// try another length at any time; the substitution stage (step 2) with
// its live preview is the real correctness test.

import { analyzeArrangement, arrangementQuality } from './arrangement';

export interface KeyLengthCandidate {
  keyLength: number;
  score: number;
}

// Real ADFGVX transposition keys were long, and short candidates pick up
// bigram artifacts, so the wizard offers 4 to 12 columns.
const MIN_KEY_LENGTH = 4;
const MAX_KEY_LENGTH = 12;

export const rankKeyLengths = (
  cipherText: string,
  fractionChars: string,
): KeyLengthCandidate[] => {
  const candidates: KeyLengthCandidate[] = [];
  const maxLength = Math.min(MAX_KEY_LENGTH, Math.floor(cipherText.length / 8));

  for (let keyLength = MIN_KEY_LENGTH; keyLength <= maxLength; keyLength += 1) {
    const { columns, arrangement } = analyzeArrangement(cipherText, keyLength, fractionChars);
    const score = arrangementQuality(columns, arrangement, keyLength, fractionChars);
    candidates.push({ keyLength, score });
  }

  return candidates.sort((a, b) => b.score - a.score);
};
