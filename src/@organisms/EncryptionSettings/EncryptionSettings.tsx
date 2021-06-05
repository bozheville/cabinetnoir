import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Pane, Select,
  IconButton,
  SwapHorizontalIcon,
} from 'evergreen-ui';
import { useTranslation } from 'next-i18next';

import {
  Affine,
  Caesar,
  Morse,
  Playfair,
  Vigenere,
  encodingsList,
  encryptorsList,
  Base64,
  Rot13,
} from '@encryptors';
import { EcryptionSelector } from '@molecues';
import { RecentlyUsedContext } from '@contexts';

interface EncryptionSettingsProps {
  input: string;
  onOutputUpdate: (props: {output: string }) => void;
}

const EncryptionSettings: React.FC<EncryptionSettingsProps> = ({
  input,
  onOutputUpdate,
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { addRecentluUsed } = useContext(RecentlyUsedContext);
  const { algorithm, action } = router.query;

  const isDecryptMode = action === 'reverse';

  useEffect(() => {
    if (![...encodingsList, ...encryptorsList].includes(algorithm as string)) {
      router.push(`/`, undefined, { shallow: true });
    } else {
      addRecentluUsed(algorithm as string);
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
    algorithm === 'affine' ? Affine :
    algorithm === 'base64' ? Base64 :
    algorithm === 'caesar' ? Caesar :
    algorithm === 'playfair' ? Playfair :
    algorithm === 'vigenere' ? Vigenere :
    algorithm === 'morse' ? Morse :
    algorithm === 'rot13' ? Rot13 :
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
      <Pane>
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
