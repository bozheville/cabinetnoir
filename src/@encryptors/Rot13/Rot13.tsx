import React, {useEffect} from 'react';
import { CrypterProps } from '../types';
import { caesarEncrypt } from '../Caesar/caesar-crypt';

const Rot13: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {
  useEffect(() => {
    const settings = {
      input,
      shift: 13,
      keepSpaces: true,
      keepCase: true,
    };

    const output = caesarEncrypt(settings);
    onProcessingEnd({ output });
  }, [input, isDecryptMode]);

  return <div />;
};

Rot13.displayName = 'Rot13';

export default Rot13;
