import { useEffect, useState } from 'react';
import { affineEncrypt, affineDecrypt } from './affine-crypt';

const useAffine = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {
  const [ secretKey, setSecretKey ] = useState('1');
  const [ multiplier, setMultiplier ] = useState('1');
  const [ keepSpaces, setKeepSpaces ] = useState(false);
  const [ keepCase, setKeepCase ] = useState(false);

  useEffect(() => {
    const settings = {
      input,
      multiplier: parseInt(multiplier, 10),
      shift: parseInt(secretKey, 10),
      keepSpaces,
      keepCase,
    }
    const output = isDecryptMode
      ? affineDecrypt(settings)
      : affineEncrypt(settings);

      onProcessingEnd({ output });
  }, [input, secretKey, isDecryptMode, keepCase, keepSpaces, multiplier]);

  const handleKeyChange = (event) => setSecretKey(event.target.value);
  const handleKeepSpacesChange = (event) => setKeepSpaces(event.target.checked);
  const handleKeepCaseChange = (event) => setKeepCase(event.target.checked);
  const handleMultiplierChange = (event) => setMultiplier(event.target.value);

  return {
    secretKey,
    keepCase,
    keepSpaces,
    multiplier,
    handleKeyChange,
    handleKeepSpacesChange,
    handleKeepCaseChange,
    handleMultiplierChange,
  };
};

export default useAffine;
