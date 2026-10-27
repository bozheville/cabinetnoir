import { useEffect, useMemo, useRef, useState } from 'react';

import { normalize } from '@encryptors/shared/analysis';
import { countLetters, chiSquaredAt, chiToScore, STANDARD_ALPHABET } from '@encryptors/shared/analysis';

export const MIN_PRIMER_LENGTH = 2;
export const MAX_PRIMER_LENGTH = 12;

// The plaintext and primer letters the crib placement implies.
export interface Unrolled {
  // Recovered plaintext per position (null where the crib's residue
  // classes do not reach — the user fills the primer for those).
  plain: (string | null)[];
  // Derived primer letters (null where unknown — the user types them).
  primer: (string | null)[];
}

// Crib-drag state machine:
//   1. guess a word (+ primer length) → 2. drag it along the ciphertext
//   → 3. unroll the key (the crib's plaintext chains propagate both ways
//   along the primer-length residue classes; the primer falls out at the
//   start) → 4. done (missing primer letters typed by hand).
export const useAutokeyCracker = (params: {
  input: string;
  enabled: boolean;
  suggestedCrib?: string;
}) => {
  const { input, enabled, suggestedCrib } = params;

  const [step, setStep] = useState(1);
  const [word, setWord] = useState(suggestedCrib ?? '');
  const [primerLength, setPrimerLength] = useState(4);
  const [offset, setOffset] = useState<number | null>(null);
  const [manualPrimer, setManualPrimer] = useState<Record<number, string>>({});
  const [showInputChanged, setShowInputChanged] = useState(false);

  const normalized = useMemo(
    () => (enabled ? normalize(input) : null),
    [input, enabled],
  );
  const letters = normalized?.letters ?? '';

  // Reset everything when the text changes.
  const reset = (notifyChanged = false) => {
    setStep(1);
    setOffset(null);
    setManualPrimer({});
    setShowInputChanged(notifyChanged);
  };

  const previousInput = useRef(input);
  useEffect(() => {
    if (previousInput.current === input) {
      return;
    }
    const hadProgress = offset !== null;
    previousInput.current = input;
    reset(hadProgress);
  }, [input]);

  return {
    input,
    letters,
    normalized,
    step,
    setStep,
    word,
    setWord,
    primerLength,
    setPrimerLength,
    offset,
    setOffset,
    manualPrimer,
    setManualPrimer,
    suggestedCrib,
    reset,
    setShowInputChanged,
    hasInputChanged: showInputChanged,
  };
};

// The key fragment the crib implies at `offset`: C − crib, letter by
// letter. In autokey this fragment IS plaintext from one primer-length
// earlier — readable fragment = likely right placement.
export const impliedFragment = (
  letters: string,
  word: string,
  offset: number,
): string | null => {
  if (offset < 0 || offset + word.length > letters.length) {
    return null;
  }
  let fragment = '';
  for (let i = 0; i < word.length; i += 1) {
    const cipher = STANDARD_ALPHABET.indexOf(letters[offset + i]);
    const plain = STANDARD_ALPHABET.indexOf(word[i]);
    if (cipher < 0 || plain < 0) {
      return null;
    }
    fragment += STANDARD_ALPHABET[(cipher - plain + 26) % 26];
  }
  return fragment;
};

// Every offset the crib fits at, scored for English-likeness of the
// implied fragment (the fragment is earlier plaintext in autokey).
export const dragOffsets = (
  letters: string,
  word: string,
): { offset: number; fragment: string; score: number }[] => {
  const clean = word.toUpperCase().replace(/[^A-Z]/g, '');
  if (!letters || clean.length === 0) {
    return [];
  }
  const results: { offset: number; fragment: string; score: number }[] = [];
  for (let offset = 0; offset + clean.length <= letters.length; offset += 1) {
    const fragment = impliedFragment(letters, clean, offset);
    if (fragment === null) {
      continue;
    }
    const chi = chiToScore(chiSquaredAt(countLetters(fragment), 0));
    results.push({ offset, fragment, score: chi });
  }
  return results;
};

// Unroll the crib placement across the primer-length residue chains.
// From a known plaintext letter at p: P(p+L) = C(p+L) − P(p) and, going
// the other way, P(p−L) = C(p) − P(p) (that letter is the keystream at
// p). The chains cover every residue class the crib touches; positions
// in untouched classes stay unknown. The primer letters fall out of
// K(i) = C(i) − P(i) at the start of the text.
export const unrollCrib = (
  letters: string,
  word: string,
  offset: number,
  primerLength: number,
): Unrolled => {
  const length = letters.length;
  const plain: (string | null)[] = new Array(length).fill(null);

  const setPlain = (position: number, letter: string): void => {
    if (position >= 0 && position < length && plain[position] === null) {
      plain[position] = letter;
    }
  };

  for (let i = 0; i < word.length; i += 1) {
    setPlain(offset + i, word[i]);
  }

  // Propagate to a fixpoint — the chains are independent, so a few
  // passes over the known set settle everything reachable.
  let changed = true;
  while (changed) {
    changed = false;
    for (let p = 0; p < length; p += 1) {
      const known = plain[p];
      if (known === null) {
        continue;
      }
      const cipherAt = (position: number) => STANDARD_ALPHABET.indexOf(letters[position]);
      const subtract = (a: number, b: number) => STANDARD_ALPHABET[(a - b + 26) % 26];

      if (p + primerLength < length && plain[p + primerLength] === null) {
        setPlain(p + primerLength, subtract(cipherAt(p + primerLength), STANDARD_ALPHABET.indexOf(known)));
        changed = true;
      }
      if (p >= primerLength && plain[p - primerLength] === null) {
        setPlain(p - primerLength, subtract(cipherAt(p), STANDARD_ALPHABET.indexOf(known)));
        changed = true;
      }
    }
  }

  // The primer: K(i) = C(i) − P(i) for the first primerLength positions;
  // unknown where the crib's residue classes never reached.
  const primer: (string | null)[] = [];
  for (let i = 0; i < primerLength; i += 1) {
    if (plain[i] === null) {
      primer.push(null);
      continue;
    }
    primer.push(STANDARD_ALPHABET[(STANDARD_ALPHABET.indexOf(letters[i]) - STANDARD_ALPHABET.indexOf(plain[i] as string) + 26) % 26]);
  }
  return { plain, primer };
};

export default useAutokeyCracker;
