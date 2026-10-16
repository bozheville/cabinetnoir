import { getAlphabet } from '@encryptors/constants';
import { useMonoalphabetic } from '@encryptors/Monoalphabetic/useMonoalphabetic';
import { getAffineAlphabet, isCoprimePair } from '@encryptors/utils';
import { useEffect, useState } from 'react';
import { usePendingExample } from '@learning/pendingExample';

const DEFAULT_ALPHABET = getAlphabet({ key: 'latin' }).value;

const DEFAULT_TARGET_ALPHABET = getAffineAlphabet({
  alphabet: DEFAULT_ALPHABET,
  multiplier: 1,
  shift: 1,
});

const useAffine = (props) => {
  const [ shift, setShift ] = useState(1);
  const [ multiplier, setMultiplier ] = useState(1);

  const [alphabet, setAlphabet] = useState(DEFAULT_ALPHABET);
  const [targetAlphabet, setTargetAlphabet] = useState(DEFAULT_TARGET_ALPHABET);

  useEffect(() => {
    if (isCoprimePair(multiplier, alphabet.length)) {
      setTargetAlphabet(getAffineAlphabet({ alphabet, multiplier, shift }));
    }
  }, [ alphabet, multiplier, shift ]);

  const monoalphabeticProps = useMonoalphabetic({ alphabet, targetAlphabet, ...props })

  const handleKeyChange = (event) => setShift(parseInt(event.target.value));
  const handleMultiplierChange = (event) => setMultiplier(parseInt(event.target.value));

  // "Try it in the tool": the example's key carries "multiplier/shift".
  // The context is only non-null when the example targets this cipher;
  // the message itself is pre-filled by EncryptionInputs.
  const pendingExample = usePendingExample();
  useEffect(() => {
    if (!pendingExample) {
      return;
    }
    const [pendingMultiplier, pendingShift] = (pendingExample.key ?? '').split('/');
    const parsedMultiplier = parseInt(pendingMultiplier, 10);
    if (!Number.isNaN(parsedMultiplier)) {
      setMultiplier(parsedMultiplier);
    }
    const parsedShift = parseInt(pendingShift, 10);
    if (!Number.isNaN(parsedShift)) {
      setShift(parsedShift);
    }
  }, [pendingExample]);

  return {
    secretKey: String(shift),
    multiplier,
    handleKeyChange,
    handleMultiplierChange,
    ...monoalphabeticProps,
  };
};

export default useAffine;
