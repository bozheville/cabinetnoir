import React, { useEffect } from 'react';
import { CrypterProps } from '../types';

const Base64: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {
  useEffect(() => {
    const output = isDecryptMode
      ? atob(input)
      : btoa(input);

      onProcessingEnd({ output, actionType: 'encode'});
  }, [input, isDecryptMode]);

  return <div />;
};

Base64.displayName = 'Base64';

export default Base64;
