import React, { useEffect, useState } from 'react';
import {Heading,  Pane, TextInput } from 'evergreen-ui';
import { CrypterProps } from '../types';
import { vigenereEncrypt, vigenereDecrypt } from './vigenere-encryption';

const Vigenere: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const [ secretKey, setSecretKey ] = useState('');

  useEffect(() => {
    const output = isDecryptMode
      ? vigenereDecrypt(input, secretKey)
      : vigenereEncrypt(input, secretKey);

      onProcessingEnd({ output, actionType: 'encrypt'});
  }, [input, secretKey, isDecryptMode]);

  return (
    <Pane
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      {...paneProps}
    >
      <Heading size={100}>Key</Heading>
      <TextInput
        width="150px"
        value={secretKey}
        onChange={(event) => setSecretKey(event.target.value)}
      />
    </Pane>
  );
};

Vigenere.displayName = 'Vigenere';

export default Vigenere;
