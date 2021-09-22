import { useState } from 'react';
import { useMonoalphabetic } from '../Monoalphabetic/useMonoalphabetic';
import { getAlphabet } from '../constants';
import { reverse } from '@encryptors/utils';

const DEFAULT_ALPHABET_KEY = 'latin';
const DEFAULT_ALPHABET = getAlphabet({ key: DEFAULT_ALPHABET_KEY }).value;
const DEFAULT_TARGET_ALPHABET = reverse(DEFAULT_ALPHABET);

export const useAtbash = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {
  const [alphabet, setAlphabet] = useState(DEFAULT_ALPHABET);
  const [targetAlphabet, setTargetAlphabet] = useState(DEFAULT_TARGET_ALPHABET);
  const [alphabetKey, setAlphabetKey] = useState(DEFAULT_ALPHABET_KEY);

  const monoalphabeticProps = useMonoalphabetic({
    input,
    onProcessingEnd,
    isDecryptMode,
    alphabet,
    targetAlphabet,
  });

  const handleAphabetKeyChange = (event) => {
    const key = event.target.value;
    const newAlphabet = getAlphabet({ key }).value;
    setAlphabetKey(key);
    setAlphabet(newAlphabet);
    setTargetAlphabet(reverse(newAlphabet));
  };

  return {
    alphabetKey,
    handleAphabetKeyChange,
    ...monoalphabeticProps
  };
};
