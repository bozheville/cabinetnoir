import { useEffect, useState } from 'react';
import { caesarEncrypt, caesarDecrypt } from './caesar-crypt';

const useCaesar = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {
  const [ secretKey, setSecretKey ] = useState('1');
  const [ keepSpaces, setKeepSpaces ] = useState(false);
  const [ keepCase, setKeepCase ] = useState(false);

  useEffect(() => {
    const settings = {
      input,
      shift: parseInt(secretKey, 10),
      keepSpaces,
      keepCase,
    }
    const output = isDecryptMode
      ? caesarDecrypt(settings)
      : caesarEncrypt(settings);

      onProcessingEnd({ output, actionType: 'encrypt'});
  }, [input, secretKey, isDecryptMode, keepCase, keepSpaces]);

  const handleKeyChange = (event) => setSecretKey(event.target.value);
  const handleKeepSpacesChange = (event) => setKeepSpaces(event.target.checked);
  const handleKeepCaseChange = (event) => setKeepCase(event.target.checked);

  return {
    secretKey,
    keepCase,
    keepSpaces,
    handleKeyChange,
    handleKeepSpacesChange,
    handleKeepCaseChange,
  };
};

export default useCaesar;
