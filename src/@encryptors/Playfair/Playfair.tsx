import React, { useEffect, useState } from 'react';
import { Heading, Pane } from 'evergreen-ui';
import { useTranslation } from 'next-i18next';
import { CrypterProps } from '../types';
import { playfairEncrypt, playfairDecrypt } from './playfair-encryption';
import TextInput from '@atoms/TextInput/TextInput';
import Tooltip from '@atoms/Tooltip';
import { usePendingExample } from '@learning/pendingExample';

const Playfair: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const { t } = useTranslation('common');
  const [ secretKey, setSecretKey ] = useState('');

  // "Try it in the tool": the example's key fills the keyword field.
  // The context is only non-null when the example targets this cipher;
  // the message itself is pre-filled by EncryptionInputs.
  const pendingExample = usePendingExample();
  useEffect(() => {
    if (pendingExample?.key) {
      setSecretKey(pendingExample.key);
    }
  }, [pendingExample]);

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
      paddingX="16px"
      paddingBottom="16px"
      {...paneProps}
    >
      <Heading size={100}>Key</Heading>
      <Tooltip content={t('learning.tooltips.playfair.key')}>
        <TextInput
          data-guide="key"
          width="150px"
          value={secretKey}
          onChange={(event) => setSecretKey(event.target.value)}
        />
      </Tooltip>
    </Pane>
  );
};

Playfair.displayName = 'Playfair';

export default Playfair;
