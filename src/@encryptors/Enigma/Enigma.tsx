import React from 'react';
import { CrypterProps } from '../types';
import useEnigma from './useEnigma';

const Enigma: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  useEnigma({
    input,
    onProcessingEnd,
    isDecryptMode,
  });

  return (
    <div />
  );
};

Enigma.displayName = 'Enigma';

export default Enigma;
