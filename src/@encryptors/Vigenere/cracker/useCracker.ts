import { useEffect, useMemo, useRef, useState } from 'react';

import { NormalizedText, normalize } from '../analysis/normalize';
import { Repeat, findRepeats } from '../analysis/kasiski';
import { KeyLengthCandidate, rankKeyLengths } from '../analysis/keyLength';
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
}) => {
  const { input, enabled, hintConfig } = params;

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

  const lockLetter = (slice: number, letter: string, source: LetterSource = 'chart') => {
    setLockedLetters((current) => ({
      ...current,
      [slice]: { letter: letter.toUpperCase(), source },
    }));
  };

  const unlockLetter = (slice: number) => {
    setLockedLetters((current) => {
      const next = { ...current };
      delete next[slice];
      return next;
    });
  };

  const hasInputChanged = showInputChanged;

  return {
    step,
    setStep,
    keyLength,
    chooseKeyLength,
    lockedLetters,
    lockLetter,
    unlockLetter,
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
