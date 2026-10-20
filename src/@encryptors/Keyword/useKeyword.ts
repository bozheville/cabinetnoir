import { useEffect, useMemo, useState } from 'react';

import {
  keywordAlphabet,
  validateFreeAlphabet,
  FreeAlphabetError,
} from './keyword-crypt';
import {
  keywordEncrypt,
  keywordDecrypt,
  STANDARD_ALPHABET,
} from './keyword-crypt';

export const useKeyword = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {
  const [keyword, setKeyword] = useState('');
  const [continueFromLast, setContinueFromLast] = useState(false);
  const [freeAlphabetMode, setFreeAlphabetMode] = useState(false);
  const [freeAlphabet, setFreeAlphabet] = useState('');
  const [keepSpaces, setKeepSpaces] = useState(false);
  const [keepCase, setKeepCase] = useState(false);

  // The cipher alphabet: derived from the keyword, or the user's free
  // permutation. `freeAlphabetError` carries the validation reason code
  // for the UI; the output stays empty while the alphabet is invalid.
  const { targetAlphabet, freeAlphabetError } = useMemo(() => {
    if (freeAlphabetMode) {
      const validation = validateFreeAlphabet(freeAlphabet);
      return validation.valid === true
        ? { targetAlphabet: validation.alphabet, freeAlphabetError: null }
        : { targetAlphabet: '', freeAlphabetError: validation.reason as FreeAlphabetError };
    }
    return {
      targetAlphabet: keywordAlphabet(keyword, { continueFromLast }),
      freeAlphabetError: null,
    };
  }, [keyword, continueFromLast, freeAlphabetMode, freeAlphabet]);

  useEffect(() => {
    const output = input && targetAlphabet
      ? (isDecryptMode
        ? keywordDecrypt({ input, targetAlphabet })
        : keywordEncrypt({
          input,
          targetAlphabet,
          keepSpaces,
          keepCase,
        }))
      : '';

    onProcessingEnd({ output });
  }, [
    input,
    isDecryptMode,
    keepCase,
    keepSpaces,
    targetAlphabet,
  ]);

  const handleKeywordChange = (event) => setKeyword(event.target.value);
  const setKeywordValue = (value: string) => setKeyword(value);
  const handleContinueFromLastChange = (event) => setContinueFromLast(event.target.checked);
  const handleFreeAlphabetModeChange = (event) => setFreeAlphabetMode(event.target.checked);
  const handleFreeAlphabetChange = (event) => setFreeAlphabet(event.target.value);
  const handleKeepSpacesChange = (event) => setKeepSpaces(event.target.checked);
  const handleKeepCaseChange = (event) => setKeepCase(event.target.checked);

  // "Use this result" on the Cryptoanalysis tab: the cracker recovered a
  // full 26-letter cipher alphabet, which may not be keyword-derivable —
  // switch to free-alphabet mode and pre-fill it.
  const applyRecoveredAlphabet = (alphabet: string) => {
    setFreeAlphabetMode(true);
    setFreeAlphabet(alphabet);
  };

  return {
    keyword,
    continueFromLast,
    freeAlphabetMode,
    freeAlphabet,
    freeAlphabetError,
    keepCase,
    keepSpaces,
    plainAlphabet: STANDARD_ALPHABET,
    targetAlphabet,
    handleKeywordChange,
    setKeywordValue,
    handleContinueFromLastChange,
    handleFreeAlphabetModeChange,
    handleFreeAlphabetChange,
    handleKeepSpacesChange,
    handleKeepCaseChange,
    applyRecoveredAlphabet,
  };
};
