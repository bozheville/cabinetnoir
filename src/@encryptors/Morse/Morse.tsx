import React, { useEffect } from 'react';
import { CrypterProps } from '../types';
import { morseDecoding, morseEncoding } from './morse-encoding';

const Morse: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {
  useEffect(() => {
    const output = isDecryptMode
      ? morseDecoding(input)
      : morseEncoding(input);

      onProcessingEnd({ output, actionType: 'encode'});
  }, [input, isDecryptMode]);

  return <div />;
};

Morse.displayName = 'Morse';

export default Morse;
