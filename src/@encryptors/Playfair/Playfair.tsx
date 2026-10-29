import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { CrypterProps } from '../types';
import { playfairEncrypt, playfairDecrypt } from './playfair-encryption';
import { Cluster, Stack } from '@atoms';
import TextInput from '@atoms/TextInput/TextInput';
import Tooltip from '@atoms/Tooltip';
import { ControlGroup } from '@organisms/ControlPanel';
import { usePendingExample } from '@learning/pendingExample';

const PaneStack = styled(Stack)`
  width: 100%;
  padding: 0 16px 16px;
`;

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
    <PaneStack {...paneProps}>
      <Cluster justify="center" gap={4}>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.playfair.key')}>
            <TextInput
              data-guide="key"
              label="Key"
              mono
              width="150px"
              value={secretKey}
              onChange={(event) => setSecretKey(event.target.value)}
            />
          </Tooltip>
        </ControlGroup>
      </Cluster>
    </PaneStack>
  );
};

Playfair.displayName = 'Playfair';

export default Playfair;
