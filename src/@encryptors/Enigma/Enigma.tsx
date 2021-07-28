import React from 'react';
import { CrypterProps } from '../types';
import useEnigma from './useEnigma';
import TextInput from '@atoms/TextInput';

const Enigma: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const {
    secretKey,
    handleKeyChange,
  } = useEnigma({
    input,
    onProcessingEnd,
    isDecryptMode,
  });

  return (
    <div>
      <div>
        <span>Key</span>
        <TextInput
          value={secretKey}
          onChange={handleKeyChange}
        />
      </div>
      <div>Rotors: I II III</div>
      <div>Reflector type B</div>
    </div>
  );
};

Enigma.displayName = 'Enigma';

export default Enigma;
