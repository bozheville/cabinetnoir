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

  const handleAlphabetChange = (newAlphabet) => {
    setAlphabet(newAlphabet);
    setAlphabetLength(newAlphabet.length);
    setTargetAlphabet(rotate(newAlphabet, rotation));
  };

  return {
    alphabetLength,
    secretKey: String(rotation),
    handleKeyChange,
    handleAlphabetChange,
    ...monoalphabeticProps,
  };
};

export default useCaesar;
