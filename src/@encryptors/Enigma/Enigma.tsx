import React from 'react';
import { CrypterProps } from '../types';
import useEnigma from './useEnigma';

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
      <input
        type="text"
        value={secretKey}
        onChange={handleKeyChange}
      />
    </div>
  );
};

Enigma.displayName = 'Enigma';

export default Enigma;
