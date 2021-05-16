import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Pane, Select,
  IconButton,
  SwapHorizontalIcon,
} from 'evergreen-ui';
import { useTranslation } from 'next-i18next';

import {
  Caesar,
  Morse,
  Playfair,
  Vigenere,
  encryptorsList,
  Base64,
} from '@encryptors';
import { EcryptionSelector } from '@molecues';

interface EncryptionSettingsProps {
  input: string;
  onOutputUpdate: (props: {output: string, actionType: string}) => void;
}

const EncryptionSettings: React.FC<EncryptionSettingsProps> = ({
  input,
  onOutputUpdate,
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { algorithm, action } = router.query;

  const isDecryptMode = action === 'reverse';

  useEffect(() => {
    if (!encryptorsList.includes(algorithm as string)) {
      router.push(`/`, undefined, { shallow: true });
    }
  }, [algorithm]);


  const handleSwapMode = () => {
    router.push(
      `/encoder/${algorithm}/${isDecryptMode ? 'direct' : 'reverse'}`,
      undefined,
      {
        shallow: true
      }
    );
  };

  const handleChangeAlgorithm = (event) => {
    router.push(
      `/encoder/${event.target.value}/${action}`,
      undefined,
      {
        shallow: true
      }
    );
  };

  const EncryptionComponent =
    algorithm === 'base64' ? Base64 :
    algorithm === 'caesar' ? Caesar :
    algorithm === 'playfair' ? Playfair :
    algorithm === 'vigenere' ? Vigenere :
    algorithm === 'morse' ? Morse :
    null;

  return (
    <Pane
      borderBottom="1px solid #999"
    >
      <Pane
        display="grid"
        padding="16px"
        gridTemplateColumns="1fr 32px 1fr"
      >
        <Pane
          width="100%"
          order={isDecryptMode ? 3 : 1}
          textAlign={isDecryptMode ? 'right' : 'left'}

        >
          {t('message')}
        </Pane>
        <IconButton
          icon={SwapHorizontalIcon}
          onClick={handleSwapMode}
          appearance="minimal"
          padding="9px"
          order={2}
        />
        <Pane
          display="flex"
          flexDirection="row"
          width="100%"
          order={isDecryptMode ? 1 : 3}
          justifyContent={isDecryptMode ? 'start': 'end'}
        >
          <EcryptionSelector />
        </Pane>
      </Pane>
      <Pane
        display="flex"
        flexDirection="row"
        paddingX="16px"
        paddingBottom="16px"
      >
        <EncryptionComponent
          input={input}
          onProcessingEnd={onOutputUpdate}
          isDecryptMode={isDecryptMode}
        />
      </Pane>
    </Pane>
  );
};

EncryptionSettings.displayName = 'EncryptionSettings';

export default EncryptionSettings;
