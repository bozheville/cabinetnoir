import { useEffect, useState } from 'react';
import { caesarEncrypt, caesarDecrypt } from './caesar-crypt';
import { getAlphabet } from '../constants';

const useCaesar = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {
  const [ secretKey, setSecretKey ] = useState('1');
  const [ keepSpaces, setKeepSpaces ] = useState(false);
  const [ keepCase, setKeepCase ] = useState(false);
  const [ alphabetKey, setAlphabetKey ] = useState('latin');
  const [ alphabetLength, setAlphabetLength ] = useState(26);

  useEffect(() => {
    const settings = {
      input,
      shift: parseInt(secretKey, 10),
      keepSpaces,
      keepCase,
      alphabetKey,
    };

    const output = input ? (
      isDecryptMode
        ? caesarDecrypt(settings)
        : caesarEncrypt(settings)
      ) : '';

      onProcessingEnd({ output });
  }, [input, secretKey, isDecryptMode, keepCase, keepSpaces, alphabetKey]);

  const handleKeyChange = (event) => setSecretKey(event.target.value);
  const handleKeepSpacesChange = (event) => setKeepSpaces(event.target.checked);
  const handleKeepCaseChange = (event) => setKeepCase(event.target.checked);
  const handleAphabetKey = (event) => {

    setAlphabetKey(event.target.value)
    setAlphabetLength(getAlphabet({ key: event.target.value }).value.length);
  };

  return {
    alphabetLength,
    secretKey,
    keepCase,
    keepSpaces,
    alphabetKey,
    handleKeyChange,
    handleKeepSpacesChange,
    handleKeepCaseChange,
    handleAphabetKey,
  };
};

export default useCaesar;
