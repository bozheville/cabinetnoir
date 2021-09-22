import { useState } from 'react';
import { rotate } from '@encryptors/utils';
import { getAlphabet } from '@encryptors/constants';
import { useMonoalphabetic } from '@encryptors/Monoalphabetic/useMonoalphabetic';

const DEFAULT_ROTATION = 1;
const DEFAULT_ALPHABET_KEY = 'latin';
const DEFAULT_ALPHABET = getAlphabet({ key: DEFAULT_ALPHABET_KEY }).value;
const DEFAULT_TARGET_ALPHABET = rotate(DEFAULT_ALPHABET, DEFAULT_ROTATION);

const useCaesar = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {
  const [rotation, setRotation] = useState(DEFAULT_ROTATION);
  const [alphabetLength, setAlphabetLength] = useState(DEFAULT_ALPHABET.length);
  const [alphabetKey, setAlphabetKey] = useState(DEFAULT_ALPHABET_KEY);
  const [alphabet, setAlphabet] = useState(DEFAULT_ALPHABET);
  const [targetAlphabet, setTargetAlphabet] = useState(DEFAULT_TARGET_ALPHABET);

  const monoalphabeticProps = useMonoalphabetic({
    input,
    onProcessingEnd,
    isDecryptMode,
    alphabet,
    targetAlphabet,
  });

  const handleKeyChange = (event) => {
    const updatedRotation = parseInt(event.target.value);
    setRotation(updatedRotation);
    setTargetAlphabet(rotate(alphabet, updatedRotation));
  };

  const handleAphabetKey = (event) => {
    const key = event.target.value;
    const newAlphabet = getAlphabet({ key }).value;
    setAlphabetKey(key);
    setAlphabet(newAlphabet);
    setAlphabetLength(newAlphabet.length);
    setTargetAlphabet(rotate(newAlphabet, rotation));
  };

  return {
    alphabetLength,
    secretKey: String(rotation),
    alphabetKey,
    handleKeyChange,
    handleAphabetKey,
    ...monoalphabeticProps,
  };
};

export default useCaesar;
