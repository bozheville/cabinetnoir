import { useEffect, useState } from 'react';
import { rotate } from '@encryptors/utils';
import { getAlphabet } from '@encryptors/constants';
import { useMonoalphabetic } from '@encryptors/Monoalphabetic/useMonoalphabetic';
import { useTranslation } from 'next-i18next';
import { usePendingExample } from '@learning/pendingExample';

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

  const { t } = useTranslation('common');

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

  // "Try it in the tool": the example's key is the rotation. The context
  // is only non-null when the example targets this cipher; the message
  // itself is pre-filled by EncryptionInputs.
  const pendingExample = usePendingExample();
  useEffect(() => {
    if (!pendingExample) {
      return;
    }
    const pendingRotation = parseInt(pendingExample.key ?? '', 10);
    if (Number.isNaN(pendingRotation)) {
      return;
    }
    const clamped = Math.min(Math.max(pendingRotation, 1), alphabet.length - 1);
    setRotation(clamped);
    setTargetAlphabet(rotate(alphabet, clamped));
  }, [pendingExample]);

  return {
    t,
    alphabetLength,
    secretKey: String(rotation),
    handleKeyChange,
    handleAlphabetChange,
    ...monoalphabeticProps,
  };
};

export default useCaesar;
