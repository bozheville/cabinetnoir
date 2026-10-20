// Keyword substitution: a monoalphabetic cipher whose cipher alphabet is
// built from a keyword — the keyword's letters first (deduplicated), then
// the remaining letters in order. The engine reuses the shared
// monoalphabetic core; the only keyword-specific work is building the
// target alphabet.
//
// Two key modes:
// - keyword mode: the alphabet is derived from the keyword
//   (`keywordAlphabet`), optionally continuing from the keyword's last
//   letter instead of from A.
// - free-alphabet mode: the user supplies any 26-letter permutation;
//   `validateFreeAlphabet` checks it and returns a reason code for the UI.

import {
  monoalphabeticEncrypt,
  monoalphabeticDecrypt,
} from '../Monoalphabetic/monoalphabetic-crypt';

export const STANDARD_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export interface KeywordAlphabetOptions {
  // false: remaining letters follow in A→Z order (KRYPTOS → KRYPTOSABC…)
  // true:  remaining letters continue from the keyword's last letter
  //        (KRYPTOS → KRYPTOSTUVWXZABC…)
  continueFromLast?: boolean;
}

// Deduplicated keyword letters, then the remaining letters of the
// standard alphabet. The result is always exactly 26 distinct A–Z
// letters (or shorter when the keyword is empty of letters — callers
// validate before use).
export const keywordAlphabet = (
  keyword: string,
  { continueFromLast = false }: KeywordAlphabetOptions = {},
): string => {
  const seen: string[] = [];
  for (const letter of keyword.toUpperCase()) {
    if (/[A-Z]/.test(letter) && !seen.includes(letter)) {
      seen.push(letter);
    }
  }
  if (seen.length === 0) {
    return '';
  }

  const remaining = STANDARD_ALPHABET
    .split('')
    .filter((letter) => !seen.includes(letter));

  if (continueFromLast) {
    // Rotate the remaining letters to start after the keyword's last
    // letter, wrapping around Z→A.
    const last = seen[seen.length - 1];
    const lastPosition = STANDARD_ALPHABET.indexOf(last);
    const start = remaining.findIndex(
      (letter) => STANDARD_ALPHABET.indexOf(letter) > lastPosition,
    );
    const rotated = start === -1
      ? remaining
      : [...remaining.slice(start), ...remaining.slice(0, start)];
    return `${seen.join('')}${rotated.join('')}`;
  }

  return `${seen.join('')}${remaining.join('')}`;
};

// Why a free alphabet was rejected — surfaced verbatim by the tool UI.
export type FreeAlphabetError =
  | 'empty'
  | 'length'
  | 'duplicates'
  | 'characters';

export type FreeAlphabetValidation =
  | { valid: true; alphabet: string }
  | { valid: false; reason: FreeAlphabetError };

// Free-alphabet mode: accept any 26-letter permutation of A–Z.
// Input may be typed in any case, with optional spaces between letters
// (e.g. "KRY PTOSAB…"); everything but A–Z is ignored before checking.
export const validateFreeAlphabet = (alphabet: string): FreeAlphabetValidation => {
  const letters = alphabet.toUpperCase().replace(/[^A-Z]/g, '');
  if (letters.length === 0) {
    return { valid: false, reason: 'empty' };
  }
  if (letters.length !== 26) {
    return { valid: false, reason: 'length' };
  }
  if (new Set(letters.split('')).size !== 26) {
    return { valid: false, reason: 'duplicates' };
  }
  return { valid: true, alphabet: letters };
};

export interface KeywordEncryptProps {
  input: string;
  // Exactly one of `keyword` / `targetAlphabet` must be provided:
  // keyword mode builds the alphabet, free-alphabet mode uses it as-is.
  keyword?: string;
  targetAlphabet?: string;
  continueFromLast?: boolean;
  keepSpaces?: boolean;
  keepCase?: boolean;
  alphabet?: string;
}

const resolveTargetAlphabet = ({
  keyword,
  targetAlphabet,
  continueFromLast,
}: KeywordEncryptProps): string => {
  if (targetAlphabet) {
    const validation = validateFreeAlphabet(targetAlphabet);
    if (validation.valid === false) {
      throw new Error(`Invalid free alphabet: ${validation.reason}`);
    }
    return validation.alphabet;
  }
  const built = keywordAlphabet(keyword ?? '', { continueFromLast });
  if (!built) {
    throw new Error('You have to provide a keyword or a targetAlphabet');
  }
  return built;
};

export const keywordEncrypt = (props: KeywordEncryptProps): string => {
  const targetAlphabet = resolveTargetAlphabet(props);
  return monoalphabeticEncrypt({
    alphabet: props.alphabet ?? STANDARD_ALPHABET,
    targetAlphabet,
    input: props.input,
    keepSpaces: props.keepSpaces,
    keepCase: props.keepCase,
  });
};

export const keywordDecrypt = (props: KeywordEncryptProps): string => {
  const targetAlphabet = resolveTargetAlphabet(props);
  return monoalphabeticDecrypt({
    alphabet: props.alphabet ?? STANDARD_ALPHABET,
    targetAlphabet,
    input: props.input,
  });
};

// Cracker bonus (shown only after the user finished the mapping): if the
// recovered cipher alphabet is keyword-shaped, guess the keyword.
// A prefix of length k is a keyword when the remaining letters follow in
// order — either A→Z or continuing from the prefix's last letter — and
// the prefix itself is not just a plain run of the alphabet (which would
// make every rotation cipher "keyword-shaped" too).
export const keywordFromAlphabet = (cipherAlphabet: string): string | null => {
  const letters = cipherAlphabet.toUpperCase().replace(/[^A-Z]/g, '');
  if (letters.length !== 26 || new Set(letters).size !== 26) {
    return null;
  }
  const isOrderedRun = (prefix: string, rest: string, continueFromLast: boolean): boolean => {
    if (continueFromLast) {
      const lastPosition = STANDARD_ALPHABET.indexOf(prefix[prefix.length - 1]);
      const ordered = STANDARD_ALPHABET.split('')
        .filter((letter) => !prefix.includes(letter))
        .sort((a, b) => {
          const positionOf = (letter: string) => {
            const raw = STANDARD_ALPHABET.indexOf(letter);
            return raw <= lastPosition ? raw + 26 : raw;
          };
          return positionOf(a) - positionOf(b);
        })
        .join('');
      return rest === ordered;
    }
    return rest === STANDARD_ALPHABET.split('').filter(
      (letter) => !prefix.includes(letter),
    ).join('');
  };
  const isPlainRun = (prefix: string): boolean => {
    const positions = prefix.split('').map((letter) => STANDARD_ALPHABET.indexOf(letter));
    return positions.every((position, index) => (
      index === 0 || position === (positions[index - 1] + 1) % 26
    ));
  };
  for (let k = 2; k <= 12; k += 1) {
    const prefix = letters.slice(0, k);
    const rest = letters.slice(k);
    if (isPlainRun(prefix)) {
      continue;
    }
    if (isOrderedRun(prefix, rest, false) || isOrderedRun(prefix, rest, true)) {
      return prefix;
    }
  }
  return null;
};
