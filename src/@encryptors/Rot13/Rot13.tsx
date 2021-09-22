import React, { useEffect } from 'react';
import { getAlphabet } from '@encryptors/constants';
import { rotate } from '@encryptors/utils';
import { CrypterProps } from '@encryptors/types';
import { monoalphabeticEncrypt } from '@encryptors/Monoalphabetic/monoalphabetic-crypt';

const Rot13: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {
  useEffect(() => {
    const alphabet = getAlphabet({ key: 'latin' }).value;
    const output = !input ? '' : monoalphabeticEncrypt({
      input,
      alphabet,
      targetAlphabet: rotate(alphabet, 13),
      keepSpaces: true,
      keepCase: true,
    });

    onProcessingEnd({ output });
  }, [input, isDecryptMode]);

  return <div />;
};

Rot13.displayName = 'Rot13';

export default Rot13;
