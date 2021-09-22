import { useEffect, useState } from 'react';

import {
  monoalphabeticEncrypt,
  monoalphabeticDecrypt
} from './monoalphabetic-crypt';

export const useMonoalphabetic = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  alphabet,
  targetAlphabet,
}) => {
  const [ keepSpaces, setKeepSpaces ] = useState(false);
  const [ keepCase, setKeepCase ] = useState(false);

  useEffect(() => {
    const settings = {
      input,
      keepSpaces,
      keepCase,
      alphabet,
      targetAlphabet,
    };

    const output = input ? (
      isDecryptMode
        ? monoalphabeticDecrypt(settings)
        : monoalphabeticEncrypt(settings)
      ) : '';

      onProcessingEnd({ output });
  }, [
    input,
    isDecryptMode,
    keepCase,
    keepSpaces,
    alphabet,
    targetAlphabet,
  ]);

  const handleKeepSpacesChange = (event) => setKeepSpaces(event.target.checked);
  const handleKeepCaseChange = (event) => setKeepCase(event.target.checked);

  return {
    keepCase,
    keepSpaces,
    handleKeepSpacesChange,
    handleKeepCaseChange,
  };
};
