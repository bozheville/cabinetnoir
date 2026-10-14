import React, { useEffect, useState } from 'react';
import {Checkbox, Heading, Pane, TextInput } from 'evergreen-ui';
import { CrypterProps } from '../types';
import { vigenereEncrypt, vigenereDecrypt } from './vigenere-encryption';
import CrackerSettings from './cracker/CrackerSettings';
import { DEFAULT_HINT_CONFIG, HintConfig } from './cracker/hintSettings';

const Vigenere: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const [ secretKey, setSecretKey ] = useState('');
  const [ isUnknownKey, setIsUnknownKey ] = useState(false);
  const [ hintConfig, setHintConfig ] = useState<HintConfig>(DEFAULT_HINT_CONFIG);

  useEffect(() => {
    const output = isDecryptMode
      ? vigenereDecrypt(input, secretKey)
      : vigenereEncrypt(input, secretKey);

      onProcessingEnd({ output });
  }, [input, secretKey, isDecryptMode]);

  return (
    <>
      <Pane
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        paddingX="16px"
        paddingBottom="16px"
        {...paneProps}
      >
        <Heading size={100}>Key</Heading>
        <TextInput
          width="150px"
          value={secretKey}
          onChange={(event) => setSecretKey(event.target.value)}
        />
        <Checkbox
          marginLeft="6px"
          label="Unknown key"
          checked={isUnknownKey}
          onChange={(event) => setIsUnknownKey(event.target.checked)}
        />
      </Pane>
      {isUnknownKey && (
        <Pane
          display="flex"
          flexDirection="column"
          width="100%"
          padding="12px"
          marginX="16px"
          marginBottom="16px"
          border="muted"
          borderRadius="4px"
        >
          <CrackerSettings config={hintConfig} onChange={setHintConfig} />
        </Pane>
      )}
    </>
  );
};

Vigenere.displayName = 'Vigenere';

export default Vigenere;
