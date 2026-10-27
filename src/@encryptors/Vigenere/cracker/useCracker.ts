import { useEffect, useMemo, useRef, useState } from 'react';

import { NormalizedText, normalize } from '@encryptors/shared/analysis';
import { Repeat, findRepeats } from '@encryptors/shared/analysis';
import { KeyLengthCandidate, rankKeyLengths } from '@encryptors/shared/analysis';
import {
  SliceTransform,
  VIGENERE_TRANSFORM,
} from '@encryptors/shared/analysis';
import { DEFAULT_ALPHABET } from '../vigenere-encryption';
import { HintConfig } from './hintSettings';

export type LetterSource = 'chart' | 'manual' | 'crib';

export interface LockedLetter {
  letter: string;
  source: LetterSource;
}

export interface CrackerAnalysis {
  normalized: NormalizedText;
  repeats: Repeat[];
  rankedLengths: KeyLengthCandidate[];
}

export const useCracker = (params: {
  input: string;
  enabled: boolean;
  hintConfig: HintConfig;
  alphabet?: string;
  // Slice arithmetic of the cipher being cracked: Vigenère by default,
  // the Beaufort family passes its reflected transform.
  transform?: SliceTransform;
}) => {
  const {
    input,
    enabled,
    hintConfig,
    alphabet = DEFAULT_ALPHABET,
    transform = VIGENERE_TRANSFORM,
  } = params;

  const [step, setStep] = useState(1);
  const [keyLength, setKeyLength] = useState<number | null>(null);
  const [lockedLetters, setLockedLetters] = useState<Record<number, LockedLetter>>({});
  const [activeSlice, setActiveSlice] = useState(0);
  const [showInputChanged, setShowInputChanged] = useState(false);

  const reset = (notifyChanged = false) => {
    setStep(1);
    setKeyLength(null);
    setLockedLetters({});
    setActiveSlice(0);
    setShowInputChanged(notifyChanged);
  };

  // Analysis restarts whenever the text changes.
  const previousInput = useRef(input);
  useEffect(() => {
    if (previousInput.current === input) {
      return;
    }
    const hadProgress = keyLength !== null || Object.keys(lockedLetters).length > 0;
    previousInput.current = input;
    reset(hadProgress);
  }, [input]);

  // A different alphabet invalidates the arithmetic behind locked letters.
  const previousAlphabet = useRef(alphabet);
  useEffect(() => {
    if (previousAlphabet.current === alphabet) {
      return;
    }
    const hadProgress = keyLength !== null || Object.keys(lockedLetters).length > 0;
    previousAlphabet.current = alphabet;
    reset(hadProgress);
  }, [alphabet]);

  // A different slice transform (Vigenère ↔ Beaufort family) invalidates
  // every locked letter the same way an alphabet change does.
  const previousTransform = useRef(transform);
  useEffect(() => {
    if (previousTransform.current === transform) {
      return;
    }
    const hadProgress = keyLength !== null || Object.keys(lockedLetters).length > 0;
    previousTransform.current = transform;
    reset(hadProgress);
  }, [transform]);

  const analysis = useMemo<CrackerAnalysis | null>(() => {
    if (!enabled) {
      return null;
    }

    const normalized = normalize(input);
    if (!normalized.letters) {
      return null;
    }

    const repeats = findRepeats(normalized.letters);
    return {
      normalized,
      repeats,
      rankedLengths: rankKeyLengths(normalized.letters, repeats),
    };
  }, [input, enabled]);

  // Changing the key length invalidates letter choices made for the old one.
  const chooseKeyLength = (length: number) => {
    setKeyLength(length);
    setLockedLetters({});
    setActiveSlice(0);
    if (step > 1) {
      setStep(1);
    }
  };

  // The live key: slice index -> current key letter. Every edit (chart
  // rotation, strip typing, crib apply) writes here and re-renders the
  // preview and all derived views immediately.
  const setSliceLetter = (slice: number, letter: string, source: LetterSource = 'chart') => {
    if (!letter) {
      setLockedLetters((current) => {
        const next = { ...current };
        delete next[slice];
        return next;
      });
      return;
    }

    setLockedLetters((current) => ({
      ...current,
      [slice]: { letter: letter.toUpperCase(), source },
    }));
  };

  const hasInputChanged = showInputChanged;

  // Assembled key in slice order; empty string for slices without a letter.
  const assembledKey = keyLength === null
    ? ''
    : Array.from({ length: keyLength })
      .map((_, slice) => lockedLetters[slice]?.letter ?? '')
      .join('');

  return {
    alphabet,
    transform,
    assembledKey,
    input,
    step,
    setStep,
    keyLength,
    chooseKeyLength,
    lockedLetters,
    setSliceLetter,
    activeSlice,
    setActiveSlice,
    analysis,
    reset,
    setShowInputChanged,
    hasInputChanged,
    hintConfig,
  };
};

export default useCracker;
