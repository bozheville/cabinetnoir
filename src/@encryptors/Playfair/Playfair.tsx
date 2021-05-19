import React, { useEffect, useState } from 'react';
import {Heading,  Pane, TextInput } from 'evergreen-ui';
import { CrypterProps } from '../types';
import { playfairEncrypt, playfairDecrypt } from './playfair-encryption';

const Playfair: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const [ secretKey, setSecretKey ] = useState('');

  useEffect(() => {
    const output = isDecryptMode
      ? playfairDecrypt(input, secretKey)
      : playfairEncrypt(input, secretKey);

      onProcessingEnd({ output });
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

Playfair.displayName = 'Playfair';

export default Playfair;
