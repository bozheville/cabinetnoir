import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { NormalizedText, normalize } from '@encryptors/shared/analysis';
import { Repeat, findRepeats } from '@encryptors/shared/analysis';
import { KeyLengthCandidate, rankKeyLengths } from '@encryptors/shared/analysis';
import {
  ALPHABET_FIT_THRESHOLD,
  RingAction,
  RingState,
  alphabetFit,
  ringAlphabet,
  solveRing,
  straightenRing,
} from '@encryptors/shared/analysis';
import {
  SliceTransform,
  VIGENERE_TRANSFORM,
} from '@encryptors/shared/analysis';
import { DEFAULT_ALPHABET, isEnglishAlphabet } from '../vigenere-encryption';
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

// The wizard's steps by id; the recovery step only exists while the
// user is rebuilding the alphabet.
export type StepId = 'keyLength' | 'alphabet' | 'recovery' | 'keyLetters' | 'done';

// 'known': decrypt with the entered alphabet. 'recover': rebuild it
// from the ciphertext on the ring board.
export type AlphabetMode = 'known' | 'recover';

interface RingHistory {
  present: RingAction[];
  past: RingAction[][];
  future: RingAction[][];
}

const EMPTY_RING: RingHistory = { present: [], past: [], future: [] };

export const useCracker = (params: {
  input: string;
  enabled: boolean;
  hintConfig: HintConfig;
  // The alphabet the user entered (or the example brought along).
  alphabet?: string;
  onAlphabetChange?: (alphabet: string) => void;
  // Slice arithmetic of the cipher being cracked: Vigenère by default,
  // the Beaufort family passes its reflected transform.
  transform?: SliceTransform;
}) => {
  const {
    input,
    enabled,
    hintConfig,
    alphabet: knownAlphabet = DEFAULT_ALPHABET,
    onAlphabetChange,
    transform = VIGENERE_TRANSFORM,
  } = params;

  const [step, setStep] = useState(1);
  const [keyLength, setKeyLength] = useState<number | null>(null);
  const [lockedLetters, setLockedLetters] = useState<Record<number, LockedLetter>>({});
  const [activeSlice, setActiveSlice] = useState(0);
  const [showInputChanged, setShowInputChanged] = useState(false);
  // null: follow the fit verdict until the user picks a mode.
  const [chosenMode, setChosenMode] = useState<AlphabetMode | null>(null);
  const [ring, setRing] = useState<RingHistory>(EMPTY_RING);

  const reset = (notifyChanged = false) => {
    setStep(1);
    setKeyLength(null);
    setLockedLetters({});
    setActiveSlice(0);
    setChosenMode(null);
    setRing(EMPTY_RING);
    setShowInputChanged(notifyChanged);
  };

  const hasProgress = keyLength !== null || Object.keys(lockedLetters).length > 0;

  // Analysis restarts whenever the text changes.
  const previousInput = useRef(input);
  useEffect(() => {
    if (previousInput.current === input) {
      return;
    }
    previousInput.current = input;
    reset(hasProgress);
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

  // --- The alphabet ---

  const knownIsEnglish = isEnglishAlphabet(knownAlphabet);

  // How well the entered alphabet explains every column under its best
  // shift (average chi-squared per letter; lower is better).
  const fit = useMemo(() => {
    if (!analysis || keyLength === null || !knownIsEnglish) {
      return null;
    }
    return alphabetFit(analysis.normalized.letters, keyLength, knownAlphabet, transform.mapIndex);
  }, [analysis, keyLength, knownAlphabet, knownIsEnglish, transform]);

  const fits = fit !== null && fit < ALPHABET_FIT_THRESHOLD;
  const suggestedMode: AlphabetMode = !knownIsEnglish || (fit !== null && !fits) ? 'recover' : 'known';
  const alphabetMode: AlphabetMode = !knownIsEnglish ? 'recover' : chosenMode ?? suggestedMode;

  const ringState = useMemo<RingState>(() => solveRing(ring.present), [ring.present]);
  const rawRing = ringAlphabet(ringState);
  const straightened = useMemo(() => (rawRing ? straightenRing(rawRing) : null), [rawRing]);
  const recoveredAlphabet = straightened?.alphabet ?? rawRing;

  // The alphabet the key letters are read in; null while the ring is
  // still unfinished.
  const workingAlphabet: string | null = alphabetMode === 'known' ? knownAlphabet : recoveredAlphabet;

  // A different working alphabet or slice transform invalidates the
  // arithmetic behind every locked letter.
  const lettersContext = `${workingAlphabet}|${transform.cipher}`;
  const previousContext = useRef(lettersContext);
  useEffect(() => {
    if (previousContext.current === lettersContext) {
      return;
    }
    previousContext.current = lettersContext;
    setLockedLetters({});
  }, [lettersContext]);

  // --- Steps ---

  const steps: StepId[] = alphabetMode === 'recover'
    ? ['keyLength', 'alphabet', 'recovery', 'keyLetters', 'done']
    : ['keyLength', 'alphabet', 'keyLetters', 'done'];
  const stepId: StepId = steps[Math.min(step, steps.length) - 1];
  const goTo = (id: StepId) => {
    const index = steps.indexOf(id);
    if (index >= 0) {
      setStep(index + 1);
    }
  };

  const chooseAlphabetMode = (mode: AlphabetMode) => {
    setChosenMode(mode);
  };

  // Changing the key length invalidates the ring and the letter choices
  // made for the old one.
  const chooseKeyLength = (length: number) => {
    setKeyLength(length);
    setLockedLetters({});
    setActiveSlice(0);
    setChosenMode(null);
    setRing(EMPTY_RING);
    if (step > 1) {
      setStep(1);
    }
  };

  // --- Ring board history ---

  const setRingActions = useCallback((update: (current: RingAction[]) => RingAction[]) => {
    setRing(({ present, past }) => ({
      present: update(present),
      past: [...past, present],
      future: [],
    }));
  }, []);

  const addRingAction = useCallback((action: RingAction) => {
    setRingActions((current) => [...current, action]);
  }, [setRingActions]);

  const removeRingAction = useCallback((index: number) => {
    setRingActions((current) => current.filter((_, position) => position !== index));
  }, [setRingActions]);

  const undoRing = useCallback(() => {
    setRing(({ present, past, future }) => (past.length === 0
      ? { present, past, future }
      : { present: past[past.length - 1], past: past.slice(0, -1), future: [present, ...future] }));
  }, []);

  const redoRing = useCallback(() => {
    setRing(({ present, past, future }) => (future.length === 0
      ? { present, past, future }
      : { present: future[0], past: [...past, present], future: future.slice(1) }));
  }, []);

  const clearRing = useCallback(() => {
    setRingActions(() => []);
  }, [setRingActions]);

  // --- Key letters ---

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
    // The alphabet the key letters are read in (falls back to the
    // entered one while the ring is unfinished).
    alphabet: workingAlphabet ?? knownAlphabet,
    workingAlphabet,
    knownAlphabet,
    knownIsEnglish,
    onAlphabetChange,
    fit,
    fits,
    suggestedMode,
    alphabetMode,
    chooseAlphabetMode,
    ringActions: ring.present,
    ringState,
    straightened,
    recoveredAlphabet,
    addRingAction,
    removeRingAction,
    undoRing,
    redoRing,
    clearRing,
    canUndoRing: ring.past.length > 0,
    canRedoRing: ring.future.length > 0,
    transform,
    assembledKey,
    input,
    step,
    setStep,
    steps,
    stepId,
    goTo,
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
