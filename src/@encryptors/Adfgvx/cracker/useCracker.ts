import { useEffect, useMemo, useRef, useState } from 'react';

import { AdfgvxVariant } from '../adfgvx-encryption';
import { normalizeAdfgvxCipherText } from '../analysis/normalize';
import {
  analyzeArrangement,
  arrangementQuality,
  suggestArrangement,
} from '../analysis/arrangement';
import { splitColumns } from '../analysis/columns';
import { rankKeyLengths } from '../analysis/keyLength';
import { countSymbols, SymbolFrequency, SymbolMapping } from '../analysis/frequency';
import { findCribMatches } from '../analysis/cribs';
import { edgeScore } from '../analysis/arrangement';
import { assembleSquare, deriveTranspositionKey } from '../analysis/assemble';
import { HintConfig } from './hintSettings';

// Quality scale for the confidence bars: the chi-square independence
// statistic of a true adjacent pair sits around 40-90 on real text, a
// random pairing around 20-30 (dof = 25 for the 6x6 square). Map the
// 20-100 range onto 0-100%.
const normalizeQuality = (chi2: number): number =>
  Math.max(0, Math.min(100, Math.round(((chi2 - 20) / 80) * 100)));

export interface CrackerAnalysis {
  columns: string[];
  arrangement: number[];
  symbols: string[];
  rankedLengths: ReturnType<typeof rankKeyLengths>;
}

export const useCracker = (params: {
  input: string;
  enabled: boolean;
  hintConfig: HintConfig;
  variant: AdfgvxVariant;
}) => {
  const { input, enabled, hintConfig, variant } = params;
  const fractionChars = variant === 'adfgx' ? 'ADFGX' : 'ADFGVX';

  const [step, setStep] = useState(1);
  const [keyLength, setKeyLength] = useState<number | null>(null);
  const [arrangement, setArrangement] = useState<number[]>([]);
  const [mapping, setMapping] = useState<SymbolMapping>({});
  const [crib, setCrib] = useState('');
  const [showInputChanged, setShowInputChanged] = useState(false);

  const reset = (notifyChanged = false) => {
    setStep(1);
    setKeyLength(null);
    setArrangement([]);
    setMapping({});
    setCrib('');
    setShowInputChanged(notifyChanged);
  };

  // Analysis restarts whenever the text changes.
  const previousInput = useRef(input);
  useEffect(() => {
    if (previousInput.current === input) {
      return;
    }
    const hadProgress = keyLength !== null || Object.keys(mapping).length > 0;
    previousInput.current = input;
    reset(hadProgress);
  }, [input]);

  // A different variant changes the square and the fractionation alphabet.
  const previousVariant = useRef(variant);
  useEffect(() => {
    if (previousVariant.current === variant) {
      return;
    }
    const hadProgress = keyLength !== null || Object.keys(mapping).length > 0;
    previousVariant.current = variant;
    reset(hadProgress);
  }, [variant]);

  const analysis = useMemo<CrackerAnalysis | null>(() => {
    if (!enabled) {
      return null;
    }
    const normalized = normalizeAdfgvxCipherText(input, fractionChars);
    if (normalized.length < 8) {
      return null;
    }
    return {
      columns: [],
      arrangement: [],
      symbols: [],
      rankedLengths: rankKeyLengths(normalized, fractionChars),
    };
  }, [input, enabled, fractionChars]);

  // Split analysis for the chosen key length.
  const split = useMemo(() => {
    if (!enabled || keyLength === null) {
      return null;
    }
    const normalized = normalizeAdfgvxCipherText(input, fractionChars);
    if (normalized.length < keyLength * 2) {
      return null;
    }
    const result = analyzeArrangement(normalized, keyLength, fractionChars);
    return { ...result, quality: arrangementQuality(result.columns, result.arrangement, keyLength, fractionChars) };
  }, [input, enabled, keyLength, fractionChars]);

  // Choosing a key length seeds the arrangement with the suggestion.
  const chooseKeyLength = (length: number) => {
    setKeyLength(length);
    setMapping({});
    if (step > 2) {
      setStep(2);
    }
    const normalized = normalizeAdfgvxCipherText(input, fractionChars);
    if (normalized.length >= length * 2) {
      const { columns } = splitColumns(normalized, length);
      setArrangement(suggestArrangement(columns, length, fractionChars));
    } else {
      setArrangement([]);
    }
  };

  const autoArrange = () => {
    if (keyLength === null) return;
    const normalized = normalizeAdfgvxCipherText(input, fractionChars);
    const { columns } = splitColumns(normalized, keyLength);
    setArrangement(suggestArrangement(columns, keyLength, fractionChars));
  };

  // Swap the chunks in two grid slots. Swapping the two slots of a pair
  // flips the pair's orientation; any other swap re-pairs the columns.
  const swapSlots = (slotA: number, slotB: number) => {
    setArrangement((current) => {
      const next = [...current];
      [next[slotA], next[slotB]] = [next[slotB], next[slotA]];
      return next;
    });
    setMapping({});
  };

  // Live symbol stream + frequencies + preview.
  const symbols = useMemo(
    () => (split ? split.symbols : []),
    [split],
  );

  const frequencies = useMemo<SymbolFrequency[]>(() => countSymbols(symbols), [symbols]);

  const preview = useMemo(
    () => symbols.map((symbol) => mapping[symbol] || '·').join(''),
    [symbols, mapping],
  );

  const setSymbolLetter = (symbol: string, letter: string) => {
    setMapping((current) => {
      const next = { ...current };
      if (letter) {
        next[symbol] = letter.toUpperCase();
      } else {
        delete next[symbol];
      }
      return next;
    });
  };

  const cribMatches = useMemo(() => {
    if (!crib.trim()) return [];
    return findCribMatches(symbols, crib.toUpperCase().replace(/[^A-Z0-9]/g, ''), mapping);
  }, [symbols, crib, mapping]);

  // Applying a crib match: every symbol in the match span adopts the crib
  // letter at its position (symbols already mapped to something else lose
  // that mapping only if it contradicts the crib).
  const applyCribMatch = (start: number) => {
    const cleanCrib = crib.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setMapping((current) => {
      const next = { ...current };
      for (let offset = 0; offset < cleanCrib.length; offset += 1) {
        next[symbols[start + offset]] = cleanCrib[offset];
      }
      return next;
    });
  };

  const assembledSquare = useMemo(
    () => assembleSquare(mapping, variant),
    [mapping, variant],
  );

  const assembledTranspositionKey = useMemo(
    () => deriveTranspositionKey(arrangement),
    [arrangement],
  );

  // Chi-square quality of pair `pair` (slots 2p and 2p+1) — the number
  // behind the pair quality bars in step 2.
  const edgeQuality = (pair: number): number => {
    if (!split || arrangement.length < 2 * pair + 2) return 0;
    return edgeScore(split.columns, arrangement[2 * pair], arrangement[2 * pair + 1], fractionChars);
  };

  return {
    variant,
    fractionChars,
    input,
    step,
    setStep,
    keyLength,
    chooseKeyLength,
    arrangement,
    swapSlots,
    autoArrange,
    split,
    normalizeQuality,
    symbols,
    frequencies,
    mapping,
    setSymbolLetter,
    crib,
    setCrib,
    cribMatches,
    applyCribMatch,
    preview,
    assembledSquare,
    assembledTranspositionKey,
    edgeQuality,
    analysis,
    hintConfig,
    reset,
    hasInputChanged: showInputChanged,
    setShowInputChanged,
  };
};

export default useCracker;
