import React, { useEffect } from 'react';
import { CrypterProps } from '../types';

const Base64: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {
  useEffect(() => {
    let output;
    if (isDecryptMode) {
      try {
        output = atob(input);
      } catch {
        // Invalid input: `atob` throws on characters outside its
        // alphabet, missing padding rules and stray `=` signs.
        output = '';
      }
    } else {
      output = btoa(input);
    }

      onProcessingEnd({ output });
  }, [input, isDecryptMode]);

  return <div />;
};

Base64.displayName = 'Base64';

export default Base64;
