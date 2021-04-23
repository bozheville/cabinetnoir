import React, { useEffect, useState } from 'react';
import { Heading, Pane, TextInput } from 'evergreen-ui';
import { caesarEncrypt, caesarDecrypt } from './caesar-crypt';
import { CrypterProps } from '../types';

const Caesar: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const [ secretKey, setSecretKey ] = useState('1');

  useEffect(() => {
    const output = isDecryptMode
      ? caesarDecrypt(input, parseInt(secretKey, 10))
      : caesarEncrypt(input, parseInt(secretKey, 10));

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
      <Heading size={100}>Shift</Heading>
      <TextInput
        type="range"
        min="1"
        max="25"
        width="150px"
        value={secretKey}
        marginY="0"
        onChange={(event) => setSecretKey(event.target.value)}
      />
      <Heading size={100}>{secretKey}</Heading>
    </Pane>
  );
};

Caesar.displayName = 'Caesar';

export default Caesar;
